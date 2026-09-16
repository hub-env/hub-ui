#!/usr/bin/env node
/**
 * generate-library-symbols — projects the public symbol names of each library
 * into a typed constant so the SEO layer can name them in the /api meta
 * description.
 *
 * Why: developers search the literal export name ("PaginableTableHeader"), the
 * /api pages already rank top-3 for those queries, but the generic snippet never
 * confirms the symbol is documented there, so the click goes to GitHub or npm.
 * Naming the symbols in the description makes the match visible in the SERP.
 *
 * Resolves `public-api.ts` transitively: `export * from` recurses into the
 * target barrel, `export { A as B }` records the exported alias. Ranking puts
 * the library's own prefix first because those are the names that get searched.
 *
 * Output: src/app/seo/library-symbols.generated.ts
 * Run:    npm run generate:library-symbols
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.join(ROOT, 'projects');

/** Locale dictionaries and screaming-case tokens are exports nobody searches for. */
const NOISE = [/Locale$/, /^[A-Z0-9_]+$/];

/**
 * Suffixes of the API a consumer never writes by hand — they are obtained from
 * injection or returned by a call, so they are not what gets typed into a search
 * box. Ranked below the template-facing surface.
 */
const INDIRECT_SUFFIXES = /(Service|Config|Registry|Ref|Store|Adapter|Handle|Controller|Provider)$/;

/** How many symbols to project per library. The consumer truncates further to fit the SERP budget. */
const MAX_SYMBOLS = 8;

/**
 * Resolves a relative module specifier to a real file, honouring the
 * `./x.ts` and `./x/index.ts` barrel conventions used across the libraries.
 *
 * @param fromFile File containing the re-export.
 * @param spec Relative specifier, e.g. `./interfaces`.
 * @returns Absolute file path, or null when the specifier points outside the package.
 */
function resolveModule(fromFile, spec) {
	if (!spec.startsWith('.')) return null;
	const base = path.resolve(path.dirname(fromFile), spec);
	for (const candidate of [`${base}.ts`, path.join(base, 'index.ts')]) {
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}

/**
 * Collects every name a file contributes to the public surface, following
 * re-exports depth-first. `visited` guards against circular barrels.
 *
 * @param file Absolute path of the file to scan.
 * @param visited Set of already-scanned files.
 * @returns Exported symbol names contributed by this file and its re-exports.
 */
function collectExports(file, visited = new Set()) {
	if (visited.has(file) || !fs.existsSync(file)) return [];
	visited.add(file);

	const source = fs.readFileSync(file, 'utf8');
	const names = [];

	// `export * from './x'` — recurse into the barrel.
	for (const match of source.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
		const target = resolveModule(file, match[1]);
		if (target) names.push(...collectExports(target, visited));
	}

	// `export { A, B as C } from './x'` / `export type { A } from './x'` — the
	// exported alias is what consumers import, so record the right-hand name.
	for (const match of source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g)) {
		for (const clause of match[1].split(',')) {
			const parts = clause.trim().split(/\s+as\s+/);
			const name = (parts[1] ?? parts[0]).trim();
			if (/^[A-Za-z_$][\w$]*$/.test(name)) names.push(name);
		}
	}

	// Declarations exported in place.
	for (const match of source.matchAll(
		/export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|interface|type|enum|const|function)\s+([A-Za-z_$][\w$]*)/g
	)) {
		names.push(match[1]);
	}

	return names;
}

/**
 * Counts the files of a library that mention each symbol, as a proxy for how
 * central it is to the public API. Specs are excluded so test scaffolding does
 * not inflate an internal type above the documented surface.
 *
 * @param srcDir Absolute path of the library `src` directory.
 * @returns Map of symbol name to number of non-spec files mentioning it.
 */
function usageIndex(srcDir) {
	const counts = new Map();

	const walk = (dir) => {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
				for (const name of new Set(fs.readFileSync(full, 'utf8').match(/\b[A-Z][A-Za-z0-9_$]{2,}\b/g) ?? [])) {
					counts.set(name, (counts.get(name) ?? 0) + 1);
				}
			}
		}
	};

	walk(srcDir);
	return counts;
}

/**
 * Orders symbols by how likely a developer is to type them into a search box.
 *
 * Tier 1 is the surface written by hand — components, directives and the plain
 * interfaces used to declare data shapes. Tier 2 is the module. Tier 3 is the
 * indirect API (services, config, refs) that is injected rather than typed.
 *
 * Within a tier, shorter names win: the short prefixed names are the core public
 * types (`PaginableTableHeader`, `BoardCard`, `CalendarEvent`) while the long
 * ones are peripheral variants of them. Usage count and then the name itself
 * break remaining ties so the output stays stable and diffable.
 *
 * Partial corroboration from Search Console: for `paginable` this surfaces
 * `PaginableTableHeader`, one of the two exact-symbol queries the /api page
 * already ranks top-3 for. The other, `PaginableTableCellDirective`, is too long
 * to make the cut — accepted, since only the first few names fit the SERP budget.
 *
 * @param names Raw exported names.
 * @param dir Library directory, used to derive the expected prefix.
 * @param usage Usage counts from {@link usageIndex}.
 * @returns Deduplicated, ranked and capped symbol list.
 */
function rank(names, dir, usage) {
	const prefix = dir
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');

	const tier = (name) => {
		if (INDIRECT_SUFFIXES.test(name)) return 3;
		if (name.endsWith('Module')) return 2;
		return 1;
	};

	// A library's own prefix outranks the shared `Hub` prefix, which outranks
	// symbols re-exported from sibling packages.
	const affinity = (name) => (name.startsWith(prefix) ? 0 : name.startsWith('Hub') ? 1 : 2);

	return [...new Set(names)]
		.filter((name) => /^[A-Z]/.test(name) && !NOISE.some((pattern) => pattern.test(name)))
		.sort(
			(a, b) =>
				affinity(a) - affinity(b) ||
				tier(a) - tier(b) ||
				a.length - b.length ||
				(usage.get(b) ?? 0) - (usage.get(a) ?? 0) ||
				a.localeCompare(b)
		)
		.slice(0, MAX_SYMBOLS);
}

const symbols = {};
/** Package name to the directory currently winning it, so legacy duplicate folders lose. */
const claimed = new Map();

/**
 * Locates a library's public entry point. Both spellings are in use across the
 * workspace — `avatar` and `ds` predate the hyphenated convention — and looking
 * for only one of them silently drops those libraries from the output.
 *
 * @param dir Library directory name under projects/.
 * @returns Absolute path of the entry file, or null when the library has none.
 */
function entryPoint(dir) {
	for (const name of ['public-api.ts', 'public_api.ts']) {
		const candidate = path.join(PROJECTS, dir, 'src', name);
		if (fs.existsSync(candidate)) return candidate;
	}
	return null;
}

for (const dir of fs.readdirSync(PROJECTS).sort()) {
	const pkgPath = path.join(PROJECTS, dir, 'package.json');
	const apiPath = entryPoint(dir);
	if (!fs.existsSync(pkgPath) || !apiPath) continue;

	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	if (!String(pkg.name ?? '').startsWith('ng-hub-ui')) continue;

	// Two directories can declare the same package (a legacy folder kept around).
	// The shorter directory name is the canonical one — it matches the SEO route.
	const previous = claimed.get(pkg.name);
	if (previous && previous.length <= dir.length) continue;
	if (previous) delete symbols[previous];
	claimed.set(pkg.name, dir);

	const ranked = rank(collectExports(apiPath), dir, usageIndex(path.join(PROJECTS, dir, 'src')));
	if (ranked.length) symbols[dir] = ranked;
}

const output = `// Generated by scripts/generate-library-symbols.mjs — do not edit by hand.

/**
 * Public symbol names per library, keyed by its projects/ directory (== SEO route),
 * ranked so the most searched exports come first. Consumed by the /api meta
 * description, which names them to win the click on exact-symbol queries.
 */
export const LIBRARY_SYMBOLS: Record<string, readonly string[]> = {
${Object.entries(symbols)
	.map(([dir, names]) => `\t'${dir}': [${names.map((name) => `'${name}'`).join(', ')}]`)
	.join(',\n')}
};
`;

fs.writeFileSync(path.join(ROOT, 'src/app/seo/library-symbols.generated.ts'), output);
console.log(`[library-symbols] ${Object.keys(symbols).length} libraries projected`);
