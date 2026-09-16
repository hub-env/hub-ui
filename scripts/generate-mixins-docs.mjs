#!/usr/bin/env node
/**
 * generate-mixins-docs — docs-page "Styles" tab mixin catalogs, generated from SCSS.
 *
 * Source of truth: each library's `_*-theme.scss` file(s). A `hub-<slug>-theme` mixin
 * is discovered by its `// scss-docs-start <name>` / `// scss-docs-end <name>` markers,
 * and projected into `src/app/generated/md-mixins.ts` as one `LibraryMixins` per docs
 * page, so the pages' "Styles" tab always shows the complete, true mixin API.
 *
 * What is extracted per mixin:
 * - name             — the `hub-<slug>-theme` mixin name.
 * - description      — the short blurb after the em-dash on the doc-header title line.
 * - intro (page)     — the first prose paragraph of the (first) mixin's doc header.
 * - example          — the `@example` SCSS snippet from the doc header.
 * - params           — the parameter names from the signature (all null-defaulted).
 * - paramTokens      — param → `--hub-*` tokens, parsed from the BODY (`--hub-x: #{$p}`),
 *                      NOT from inline comments (only 3 libs comment the token). Supports
 *                      one param → many tokens; color-mix/oklch derived lines are ignored
 *                      because they reference `var(...)`, not `#{$param}`.
 *
 * `use` (the `@use '<pkg>/styles' as <ns>;` line) is derived from the library package name.
 * Live demos are NOT generated (they need a component + scoped SCSS); pages merge their own
 * `demos` into `MD_MIXINS[page]`.
 *
 * Excluded automatically (name does not match `hub-*-theme`): the design-system `theme`
 * mixin, `table-variant`, and avatar's co-located `hub-avatar-color-variants` / `-badge-color`.
 *
 * Run: `npm run docs:mixins`  ·  CI: `npm run docs:mixins -- --check` (exit 1 on drift).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = path.join(ROOT, 'projects');
const OUT_PATH = path.join(ROOT, 'src/app/generated/md-mixins.ts');
const CHECK = process.argv.includes('--check');

// Library folder -> docs page id. Identity except where the page id diverges from the
// folder (kept in sync with generate-css-variables-docs.mjs SECTION_MAP: paginable -> table).
const LIB_TO_PAGE = {
	paginable: 'table'
};

// --------------------------------------------------------------- discovery
/** Recursively lists `*-theme.scss` files under projects/, skipping build/vendor dirs. */
function findThemeFiles() {
	const entries = fs.readdirSync(PROJECTS, { recursive: true });
	return entries
		.map((rel) => String(rel))
		.filter(
			(rel) =>
				rel.endsWith('-theme.scss') &&
				!rel.includes('node_modules') &&
				!rel.split(path.sep).includes('dist')
		)
		.map((rel) => path.join(PROJECTS, rel))
		.sort();
}

/** Reads a library's published package name from its package.json. */
function packageName(libSlug) {
	try {
		const pkg = JSON.parse(fs.readFileSync(path.join(PROJECTS, libSlug, 'package.json'), 'utf8'));
		return pkg.name || `ng-hub-ui-${libSlug}`;
	} catch {
		return `ng-hub-ui-${libSlug}`;
	}
}

// --------------------------------------------------------------- header parsing
/**
 * Collects the contiguous `//` doc-header lines directly above a `scss-docs-start` marker,
 * stopping at the previous mixin's marker or any non-comment line.
 */
function collectHeader(lines, startIdx) {
	const header = [];
	for (let i = startIdx - 1; i >= 0; i--) {
		const line = lines[i];
		if (!/^\s*\/\//.test(line)) break;
		if (/scss-docs-(start|end)/.test(line)) break;
		header.unshift(line.replace(/^\s*\/\/ ?/, ''));
	}
	return header;
}

const isSeparator = (l) => /^[\s─–—-]*$/.test(l) && /[─–—-]/.test(l);

/** Parses the doc header into { description (short), intro (first paragraph), example }. */
function parseHeader(headerLines, mixinName) {
	const lines = headerLines.filter((l) => !isSeparator(l));
	let description = '';
	let intro = '';
	let example = '';

	// Title line either as `hub-x-theme — <short desc>` or a box `── hub-x-theme ──`.
	const titleIdx = lines.findIndex((l) => l.includes(mixinName));
	if (titleIdx !== -1) {
		// Require a spaced separator so the hyphen inside `hub-x-theme` is never matched.
		const m = lines[titleIdx].match(/hub-[a-z0-9-]+-theme\s+[—–-]\s+(.+)$/);
		if (m) description = capitalize(m[1].trim());
	}

	// Everything after the title, up to @example/@param, is prose → first paragraph = intro.
	const rest = lines.slice(titleIdx + 1);
	const stopIdx = rest.findIndex((l) => /^\s*@(example|param)/.test(l));
	const proseLines = (stopIdx === -1 ? rest : rest.slice(0, stopIdx)).map((l) => l.trim());
	const paragraphs = splitParagraphs(proseLines);
	intro = paragraphs[0] ?? description;

	// @example: skip any prose on/after the `@example` line (which may span lines and may
	// or may not be followed by a blank) and keep from the first code line onward. Code
	// starts with `@`/selector (contains `{`); prose continuation does neither.
	const exIdx = lines.findIndex((l) => /^\s*@example/.test(l));
	if (exIdx !== -1) {
		const after = lines.slice(exIdx + 1).filter((l) => !/^\s*@param/.test(l));
		const codeStart = after.findIndex((l) => /^\s*@/.test(l) || l.includes('{'));
		if (codeStart !== -1) example = dedent(after.slice(codeStart)).replace(/^\n+|\n+$/g, '');
	}

	return { description, intro, example };
}

/** Groups consecutive non-blank lines into paragraphs (blank line = separator). */
function splitParagraphs(lines) {
	const paragraphs = [];
	let current = [];
	for (const line of lines) {
		if (line === '') {
			if (current.length) paragraphs.push(current.join(' '));
			current = [];
		} else {
			current.push(line);
		}
	}
	if (current.length) paragraphs.push(current.join(' '));
	return paragraphs;
}

/** Removes the common leading indentation from a block of lines. */
function dedent(lines) {
	const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length);
	const min = indents.length ? Math.min(...indents) : 0;
	return lines.map((l) => l.slice(min)).join('\n');
}

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// --------------------------------------------------------------- mixin parsing
/**
 * Extracts every `hub-*-theme` mixin from a theme SCSS file, with its params and the
 * `--hub-*` tokens each param writes (from the body).
 */
function parseMixins(filePath) {
	const text = fs.readFileSync(filePath, 'utf8');
	const lines = text.split('\n');
	const mixins = [];

	const startRe = /\/\/\s*scss-docs-start\s+(hub-[a-z0-9-]+-theme)\b/;
	for (let i = 0; i < lines.length; i++) {
		const start = lines[i].match(startRe);
		if (!start) continue;
		const name = start[1];
		const endIdx = lines.findIndex((l, j) => j > i && new RegExp(`scss-docs-end\\s+${name}\\b`).test(l));
		if (endIdx === -1) continue;

		const block = lines.slice(i + 1, endIdx).join('\n');
		const header = parseHeader(collectHeader(lines, i), name);
		const params = parseSignatureParams(block, name);
		const paramTokens = params
			.map((param) => ({ param: `$${param}`, tokens: tokensForParam(block, param) }))
			.filter((pt) => pt.tokens.length > 0);

		mixins.push({
			name,
			params: params.map((p) => `$${p}`).join(', '),
			description: header.description || `One-call token theming for \`${name}\`.`,
			intro: header.intro,
			example: header.example,
			paramTokens
		});
	}
	return mixins;
}

/** Reads the parameter names from a mixin signature (handles multi-line and single-line). */
function parseSignatureParams(block, name) {
	const open = block.indexOf('(', block.indexOf(`@mixin ${name}`));
	if (open === -1) return [];
	let depth = 0;
	let close = -1;
	for (let k = open; k < block.length; k++) {
		if (block[k] === '(') depth++;
		else if (block[k] === ')') {
			depth--;
			if (depth === 0) {
				close = k;
				break;
			}
		}
	}
	if (close === -1) return [];
	const sig = block.slice(open + 1, close).replace(/\/\/[^\n]*/g, '');
	const params = [];
	for (const m of sig.matchAll(/\$([a-z0-9-]+)\s*:/g)) {
		if (!params.includes(m[1])) params.push(m[1]);
	}
	return params;
}

/** Finds the `--hub-*` custom properties a parameter directly writes (`--hub-x: … #{$param} …;`). */
function tokensForParam(block, param) {
	const re = new RegExp(`(--hub-[a-z0-9-]+)\\s*:[^;]*#\\{\\$${param}\\}[^;]*;`, 'g');
	const tokens = [];
	for (const m of block.matchAll(re)) {
		if (!tokens.includes(m[1])) tokens.push(m[1]);
	}
	return tokens;
}

// --------------------------------------------------------------- emit
const q = (s) =>
	`'${String(s ?? '')
		.replace(/\\/g, '\\\\')
		.replace(/'/g, "\\'")
		.replace(/\n/g, '\\n')}'`;

function build() {
	// page -> { use, intro, mixins[] }
	const pages = new Map();

	for (const file of findThemeFiles()) {
		const libSlug = path.relative(PROJECTS, file).split(path.sep)[0];
		const page = LIB_TO_PAGE[libSlug] ?? libSlug;
		const mixins = parseMixins(file);
		if (!mixins.length) continue;

		if (!pages.has(page)) {
			pages.set(page, {
				use: `@use '${packageName(libSlug)}/styles' as ${libSlug};`,
				intro: '',
				mixins: []
			});
		}
		const bucket = pages.get(page);
		if (!bucket.intro && mixins[0].intro) bucket.intro = mixins[0].intro;
		bucket.mixins.push(...mixins);
	}

	let out = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Complete SCSS mixin catalogs for the library docs pages' "Styles" tab, parsed from each
 * library's \`_*-theme.scss\` files (discovered by their scss-docs-start/end markers).
 *
 * Regenerate with: npm run docs:mixins
 */
import { LibraryMixins } from '../../models/interfaces';

export const MD_MIXINS: Record<string, LibraryMixins> = {
`;

	for (const [page, bucket] of [...pages.entries()].sort()) {
		const mixins = [...bucket.mixins].sort((a, b) => a.name.localeCompare(b.name));
		out += `\t'${page}': {\n`;
		out += `\t\tintro: ${q(bucket.intro)},\n`;
		out += `\t\tuse: ${q(bucket.use)},\n`;
		out += `\t\tcatalog: [\n\t\t\t{\n\t\t\t\tgroup: 'Theming',\n\t\t\t\tmixins: [\n`;
		for (const m of mixins) {
			out += `\t\t\t\t\t{\n`;
			out += `\t\t\t\t\t\tname: ${q(m.name)},\n`;
			out += `\t\t\t\t\t\tparams: ${q(m.params)},\n`;
			out += `\t\t\t\t\t\tdescription: ${q(m.description)},\n`;
			if (m.example) out += `\t\t\t\t\t\texample: ${q(m.example)},\n`;
			if (m.paramTokens.length) {
				out += `\t\t\t\t\t\tparamTokens: [\n`;
				for (const pt of m.paramTokens) {
					out += `\t\t\t\t\t\t\t{ param: ${q(pt.param)}, tokens: [${pt.tokens.map(q).join(', ')}] },\n`;
				}
				out += `\t\t\t\t\t\t]\n`;
			}
			out += `\t\t\t\t\t},\n`;
		}
		out += `\t\t\t\t]\n\t\t\t}\n\t\t]\n\t},\n`;
	}
	out += `};\n`;
	return { out, pages };
}

const { out, pages } = build();

if (CHECK) {
	const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : '';
	if (current !== out) {
		console.error('✗ md-mixins.ts is stale — run `npm run docs:mixins` to regenerate.');
		process.exit(1);
	}
	console.log('✓ md-mixins.ts is up to date.');
} else {
	fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
	fs.writeFileSync(OUT_PATH, out);
	let nMixins = 0;
	for (const b of pages.values()) nMixins += b.mixins.length;
	console.log(`✓ generated ${path.relative(ROOT, OUT_PATH)} — ${pages.size} pages, ${nMixins} mixins.`);
}
