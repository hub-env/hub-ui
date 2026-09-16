#!/usr/bin/env node
/**
 * generate-tokens-data — derive the /tokens reference page dataset from the ds.
 *
 * Source of truth: projects/ds/styles/tokens/hub-tokens.css (the compiled ds, the
 * runtime reflection of the canonical token spec). This script extracts every
 * `--hub-ref-*` and `--hub-sys-*` custom property as it resolves in the DEFAULT
 * cascade (`:root` / `[data-theme='light'|'base']`, last-declaration-wins so the
 * ref-based re-assert beats the Bootstrap bridge), and writes them as a typed
 * dataset the docs app consumes. The docs app therefore never duplicates the
 * token catalogue — it is regenerated from the ds.
 *
 * Output: src/app/pages/tokens/tokens.generated.ts
 * Run:    npm run generate:tokens-data   (also runs on `prebuild`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DS_CSS = path.join(ROOT, 'projects/ds/styles/tokens/hub-tokens.css');
const OUT = path.join(ROOT, 'src/app/pages/tokens/tokens.generated.ts');

const css = fs.readFileSync(DS_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

// A selector block applies to the DEFAULT theme when one of its selectors is
// `:root`, `[data-theme='light']` or `[data-theme='base']`. Theme-only blocks
// (dark/sunset/forest/mono/terminal/bootstrap) are skipped.
const isDefaultSelector = (selector) =>
	selector
		.split(';')
		.pop() // drop any leading at-statement prelude (e.g. `@charset "UTF-8";`)
		.split(',')
		.map((s) => s.trim().replace(/['"]/g, ''))
		.some((s) => s === ':root' || s === '[data-theme=light]' || s === '[data-theme=base]');

const ref = new Map();
const sys = new Map();
const order = { ref: [], sys: [] };

const blockRe = /([^{}]+)\{([^{}]*)\}/g;
const declRe = /(--hub-[a-z0-9-]+)\s*:\s*([^;]+);/g;
let block;
while ((block = blockRe.exec(css))) {
	if (!isDefaultSelector(block[1])) continue;
	let decl;
	while ((decl = declRe.exec(block[2]))) {
		const name = decl[1];
		const value = decl[2].trim().replace(/\s+/g, ' ');
		if (name.startsWith('--hub-ref-')) {
			if (!ref.has(name)) order.ref.push(name);
			ref.set(name, value);
		} else if (name.startsWith('--hub-sys-')) {
			if (!sys.has(name)) order.sys.push(name);
			sys.set(name, value);
		}
	}
}

// ---------------------------------------------------------------- libraries
// Every monorepo library that declares its own component tokens (--hub-{prefix}-*,
// excluding the ref/sys/container/body/main foundation), linked to its docs route.
const PROJECTS = path.join(ROOT, 'projects');
const routesSrc = fs.readFileSync(path.join(ROOT, 'src/app/app.routes.ts'), 'utf8');
const libRoutes = new Set([...routesSrc.matchAll(/createLibraryRoute\('([a-z0-9-]+)'/g)].map((m) => m[1]));
const RESERVED = new Set(['ref', 'sys', 'container', 'body', 'main']);

// Tokens are defined in several ways: as `--hub-x: …` declarations in SCSS/CSS,
// as inline component styles in `.ts`, or — the CSS-variable-first pattern — only
// as a documented API consumed via `var(--hub-x, fallback)` plus a name allow-list
// (e.g. the tooltip directive). So the token SURFACE of a library is the set of
// distinct `--hub-{prefix}-*` names it references anywhere in its source.
const SRC_EXT = new Set(['.scss', '.css', '.ts', '.html']);
const walkSrc = (dir, acc = []) => {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist') continue;
		const p = path.join(dir, e.name);
		if (e.isDirectory()) walkSrc(p, acc);
		else if (SRC_EXT.has(path.extname(e.name))) acc.push(p);
	}
	return acc;
};

const tokenRe = /--hub-[a-z0-9]+(?:-[a-z0-9]+)*/g;
const libraries = [];
for (const entry of fs.readdirSync(PROJECTS, { withFileTypes: true })) {
	if (!entry.isDirectory() || entry.name === 'ds') continue;
	let files;
	try {
		files = walkSrc(path.join(PROJECTS, entry.name));
	} catch {
		continue;
	}
	const names = new Set();
	const prefixes = new Set();
	for (const f of files) {
		const txt = fs.readFileSync(f, 'utf8');
		for (const m of txt.matchAll(tokenRe)) {
			const seg = m[0].slice('--hub-'.length).split('-')[0];
			if (RESERVED.has(seg)) continue; // foundation tokens belong to the ds, not the lib
			names.add(m[0]);
			prefixes.add(seg);
		}
	}
	if (names.size > 0) {
		libraries.push({
			name: entry.name,
			route: libRoutes.has(entry.name) ? `/${entry.name}` : '',
			prefixes: [...prefixes].sort(),
			count: names.size
		});
	}
}
libraries.sort((a, b) => a.name.localeCompare(b.name));

const esc = (v) => v.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const rows = (orderList, map) => orderList.map((n) => `\t{ name: '${n}', value: '${esc(map.get(n))}' }`).join(',\n');
const libRows = libraries
	.map(
		(l) =>
			`\t{ name: '${l.name}', route: '${l.route}', prefixes: [${l.prefixes.map((p) => `'${p}'`).join(', ')}], count: ${l.count} }`
	)
	.join(',\n');

const out = `// AUTO-GENERATED by scripts/generate-tokens-data.mjs — DO NOT EDIT.
// Source of truth: projects/ds/styles/tokens/hub-tokens.css (the ds) + projects/** + app routes.
// Regenerate with: npm run generate:tokens-data
import { TokenEntry, TokenLibrary } from './tokens.model';

/** Reference layer tokens (\`--hub-ref-*\`), default cascade, derived from the ds. */
export const GENERATED_REF_TOKENS: TokenEntry[] = [
${rows(order.ref, ref)}
];

/** System layer tokens (\`--hub-sys-*\`), default cascade, derived from the ds. */
export const GENERATED_SYS_TOKENS: TokenEntry[] = [
${rows(order.sys, sys)}
];

/** Every library that declares component tokens, linked to its docs page. */
export const GENERATED_TOKEN_LIBRARIES: TokenLibrary[] = [
${libRows}
];
`;

fs.writeFileSync(OUT, out);
console.log(
	`generate-tokens-data: ${order.ref.length} ref + ${order.sys.length} sys tokens, ${libraries.length} token libraries → ${path.relative(ROOT, OUT)}`
);
