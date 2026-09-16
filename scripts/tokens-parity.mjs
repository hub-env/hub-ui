#!/usr/bin/env node
/**
 * tokens-parity — design-token drift guard.
 *
 * Source of truth: projects/ds/docs/variables-css-library.en.md  (the MD, shipped with the ds package).
 * Mirror:          projects/ds/styles/tokens/hub-tokens.css  (compiled `ds`).
 * Consumers:       projects/** /*.{scss,ts,html}  (every library — inline component
 *                  styles in .ts count: tokens declared there are as public as SCSS ones).
 *
 * It cross-checks, in both directions and aware of the MD's GENERATIVE rules
 * (colour ramps `--hub-ref-color-{hue}-{step}` and semantic families
 * `--hub-sys-color-{variant}-{role}`), reporting every drift:
 *   A. Foundational (ref/sys/container): ds.css  ⇄  MD
 *   B. Component coverage:               libs     ⇄  MD
 *      (declared AND consumed-only hooks: `var(--hub-x, fallback)` without a
 *      declaration is still public themable API and must have an MD row;
 *      runtime-written variables are inventoried with status `INTERNAL`)
 *   C. Library lint:                     consumed ref/sys  →  must exist in ds.css
 *
 * Exit code 1 on any drift, 0 when clean. Run: `npm run tokens:parity`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MD_PATH = path.join(ROOT, 'projects/ds/docs/variables-css-library.en.md');
const DS_CSS = path.join(ROOT, 'projects/ds/styles/tokens/hub-tokens.css');
const rel = (f) => path.relative(ROOT, f);

const md = fs.readFileSync(MD_PATH, 'utf8');
const dsCss = fs.readFileSync(DS_CSS, 'utf8');

// ---------------------------------------------------------------- collect scss
function walk(dir, acc = []) {
	for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, e.name);
		if (e.isDirectory()) {
			if (e.name === 'node_modules' || e.name === '.git') continue;
			walk(p, acc);
		} else if (/\.(scss|ts|html)$/.test(e.name) && !e.name.endsWith('.spec.ts')) acc.push(p);
	}
	return acc;
}
const srcFiles = walk(path.join(ROOT, 'projects'));

// ------------------------------------------------------------ ds declared set
const DECL = /^[ \t]*(--hub-[a-z0-9-]+)\s*:/gm;
const dsTokens = new Set([...dsCss.matchAll(DECL)].map((m) => m[1]));

// --------------------------------------------------- libraries: decl + consume
const libDeclared = new Map(); // token -> "rel/path:line"
const libConsumed = new Set();
const VAR = /var\(\s*(--hub-[a-z0-9-]+)/g;
for (const f of srcFiles) {
	if (f.includes(`${path.sep}ds${path.sep}`)) continue; // ds is the mirror, not a consumer
	const txt = fs.readFileSync(f, 'utf8');
	txt.split('\n').forEach((l, i) => {
		const m = l.match(/^[ \t]*(--hub-[a-z0-9-]+)\s*:/);
		if (m && !libDeclared.has(m[1])) libDeclared.set(m[1], `${rel(f)}:${i + 1}`);
	});
	for (const m of txt.matchAll(VAR)) libConsumed.add(m[1]);
}

// --------------------------------- MD: tokens documented in a TABLE ROW + status
// A token is "documented" only when it is the subject (first cell) of a table row,
// not when it is merely mentioned in prose or inside another row's value.
// Regions wrapped in `<!-- parity:ignore-start -->` … `<!-- parity:ignore-end -->`
// (the illustrative Light/Dark table, the accent-slot annex) are excluded from row
// parsing, duplicate detection and the D/E cell loops — their rows either
// re-document tokens owned by a canonical row elsewhere or have their own check (G).
const mdAllLines = md.split('\n');
const ignoredLines = new Set();
{
	let ignoring = false;
	mdAllLines.forEach((l, i) => {
		if (l.includes('parity:ignore-start')) ignoring = true;
		if (ignoring) ignoredLines.add(i);
		if (l.includes('parity:ignore-end')) ignoring = false;
	});
}
const mdRowTokens = new Set();
const mdStatus = new Map();
const mdRowCount = new Map();
mdAllLines.forEach((line, i) => {
	if (ignoredLines.has(i)) return;
	const m = line.match(/^\|\s*`(--hub-[a-z0-9-]+)`\s*\|/);
	if (!m) return;
	mdRowTokens.add(m[1]);
	mdRowCount.set(m[1], (mdRowCount.get(m[1]) ?? 0) + 1);
	const s = line.match(/`(PENDING|IN_USE|PROPOSAL|INTERNAL)`/);
	if (s && !mdStatus.has(m[1])) mdStatus.set(m[1], s[1]);
});
// B4. The same token documented by two (non-ignored) rows = two sources of truth.
const dupRows = [...mdRowCount]
	.filter(([, n]) => n > 1)
	.map(([t, n]) => `${t} (${n} rows)`)
	.sort();

// ------------------------------------------- MD: expand the GENERATIVE families
function parseHuesSteps() {
	const lines = md.split('\n');
	const hdr = lines.findIndex((l) => /^\|\s*Step\s*\|/.test(l));
	if (hdr < 0) return { hues: [], steps: [] };
	const hues = [...lines[hdr].matchAll(/`([a-z]+)`/g)].map((m) => m[1]);
	const steps = [];
	for (let i = hdr + 2; i < lines.length && lines[i].startsWith('|'); i++) {
		const m = lines[i].match(/^\|\s*(\d{3})\s*\|/);
		if (m) steps.push(m[1]);
	}
	return { hues, steps };
}
function parseVariantsRoles() {
	const vm = md.match(/\*\*Variants:\*\*\s*(.+)/);
	const variants = vm ? [...vm[1].matchAll(/`([a-z]+)`/g)].map((m) => m[1]) : [];
	const roles = [...md.matchAll(/--hub-sys-color-\{variant\}-([a-z-]+)/g)].map((m) => m[1]);
	return { variants, roles: [...new Set(roles)] };
}
const { hues, steps } = parseHuesSteps();
const { variants, roles } = parseVariantsRoles();

const mdExpanded = new Set(mdRowTokens);
for (const h of hues) for (const s of steps) mdExpanded.add(`--hub-ref-color-${h}-${s}`);
// Semantic families: the accent set is OPEN and every variant — chromatic and
// neutral alike — derives the full role family from the same generative engine.
for (const v of variants) {
	mdExpanded.add(`--hub-sys-color-${v}`);
	for (const r of roles) mdExpanded.add(`--hub-sys-color-${v}-${r}`);
}

// ----------------------------------------------------------------- predicates
const layer = (t, l) => t.startsWith(`--hub-${l}-`);
const foundational = (t) => ['ref', 'sys', 'container', 'body', 'main'].some((l) => layer(t, l));
const aspirational = (t) => mdStatus.get(t) === 'PENDING' || mdStatus.get(t) === 'PROPOSAL';
// ds styles (utility sheets / mixins) own a handful of documented cascade knobs
// (e.g. --hub-bg-opacity): count any --hub-* appearing under ds/styles as existing
// so their rows are not reported stale. ds stays excluded from the component scans.
const dsStylesTokens = new Set();
for (const f of srcFiles) {
	if (!f.includes(`${path.sep}ds${path.sep}styles${path.sep}`)) continue;
	const txt = fs.readFileSync(f, 'utf8');
	for (const m of txt.matchAll(/--hub-[a-z0-9-]+/g)) dsStylesTokens.add(m[0]);
}
const existsInCode = new Set([...libDeclared.keys(), ...libConsumed, ...dsStylesTokens]);

// A. Foundational: ds.css ⇄ MD
const dsFoundNotMd = [...dsTokens].filter((t) => foundational(t) && !mdExpanded.has(t)).sort();
const mdFoundNotDs = [...mdExpanded]
	.filter((t) => foundational(t) && !dsTokens.has(t) && !aspirational(t))
	.sort();
// A3. A foundational row still flagged PENDING/PROPOSAL whose token IS compiled in ds
// has shipped — flip its status to IN_USE (foundational companion of check B3).
const foundShippedPending = [...mdRowTokens].filter((t) => foundational(t) && aspirational(t) && dsTokens.has(t)).sort();

// B. Component coverage: libs ⇄ MD
// Component accent-slot family: a library declares `--hub-{comp}-accent` and derives
// `-subtle` / `-border-subtle` / `-emphasis` / `-on` locally from it (the same
// generative rule as the sys family). It is documented once as a convention in the
// Components section, so it is covered generatively rather than row-by-row.
const accentSlot = (t) => /^--hub-.+-accent(-subtle|-border-subtle|-emphasis|-on)?$/.test(t);
const gaps = [...libDeclared.keys()].filter((t) => !foundational(t) && !mdRowTokens.has(t) && !accentSlot(t)).sort();
const stale = [...mdRowTokens]
	.filter((t) => !foundational(t) && ['IN_USE', 'INTERNAL'].includes(mdStatus.get(t)) && !existsInCode.has(t))
	.sort();

// B2. Consumed-only hooks: `var(--hub-x, fallback)` with no declaration anywhere is
// still public themable API (or a runtime-written INTERNAL variable) — either way it
// must have an MD row. Interpolated partials (`--hub-sys-color-#{$v}` → trailing dash)
// and prefixes of documented tokens are skipped.
const consumedPartial = (t) =>
	t.endsWith('-') || [...mdExpanded].some((d) => d !== t && d.startsWith(`${t}-`)) || [...dsTokens].some((d) => d !== t && d.startsWith(`${t}-`));
const consumedGaps = [...libConsumed]
	.filter((t) => !foundational(t) && !accentSlot(t) && !mdExpanded.has(t) && !consumedPartial(t))
	.sort();

// B3. A PENDING/PROPOSAL row whose token is actually declared in a library has shipped —
// promote it to IN_USE (and fix its Source) so the docs generator picks it up.
const shippedPending = [...mdRowTokens]
	.filter((t) => !foundational(t) && aspirational(t) && libDeclared.has(t))
	.sort();

// G. Accent-slot annex ⇄ discovered slots: the annex table (between the accent-annex
// markers) must enumerate exactly the per-component accent slots found in the
// libraries — declared or consumed, names only (defaults live in each lib's SCSS).
const annexBlock = md.match(/<!-- accent-annex:start -->([\s\S]*?)<!-- accent-annex:end -->/);
const annexTokens = new Set(annexBlock ? [...annexBlock[1].matchAll(/`(--hub-[a-z0-9-]+)`/g)].map((m) => m[1]) : []);
const discoveredSlots = [...new Set([...libDeclared.keys(), ...libConsumed])].filter((t) => !foundational(t) && accentSlot(t));
const annexMissing = discoveredSlots.filter((t) => !annexTokens.has(t)).sort();
const annexExtra = [...annexTokens].filter((t) => !discoveredSlots.includes(t)).sort();

// D. Value parity: the MD row's "Initial value" cell must match the token's actual
// declaration in code. The Source column names the owning file — the declaration is
// looked up there first, falling back to the token's first declaration anywhere.
// Exempt: PENDING/PROPOSAL/INTERNAL rows, Sass-interpolated values, url(data:) icons
// (documented descriptively). Run with --write to rewrite drifted cells from code.
const WRITE = process.argv.includes('--write');
const declByFile = new Map(); // relPath -> Map(token -> { val, line })
const declFirst = new Map(); // token -> { val, file, line } (first seen)
const occByFile = new Map(); // relPath -> Map(token -> first line it appears on at all)
const occFirst = new Map(); // token -> { file, line } (first appearance anywhere)
for (const f of srcFiles) {
	if (f.includes(`${path.sep}ds${path.sep}`) || f.includes(`${path.sep}vendor${path.sep}`)) continue;
	const txt = fs.readFileSync(f, 'utf8');
	const map = new Map();
	const occ = new Map();
	const lines = txt.split('\n');
	// A declaration may span several lines — the formatter wraps a long `calc()` — and the
	// pattern below needs the terminating `;` to match. Read a wrapped declaration as one
	// logical line, anchored at the line it starts on, or the token registers as undeclared:
	// value parity then has nothing to compare and the documented value drifts in silence.
	const joined = lines.map((l, i) => {
		if (!/^[ \t]*--hub-[a-z0-9-]+\s*:/.test(l) || l.includes(';')) return l;
		let text = l;
		for (let j = i + 1; j < lines.length && !text.includes(';'); j++) text += ' ' + lines[j].trim();
		return text;
	});
	lines.forEach((l, i) => {
		// Declarations read from the joined view; occurrences from the real line, so a
		// `var()` on a continuation line is not credited to the line above it.
		const d = joined[i].match(/^[ \t]*(--hub-[a-z0-9-]+)\s*:\s*([^;]+);/);
		if (d) {
			// Tightened inside parentheses as well as collapsed: a wrapped declaration otherwise
			// reaches the docs carrying the line breaks it was formatted with — `var( --token )`.
			const val = d[2]
				.replace(/\s+/g, ' ')
				.replace(/\(\s+/g, '(')
				.replace(/\s+\)/g, ')')
				.trim();
			if (!map.has(d[1])) map.set(d[1], { val, line: i + 1 });
			if (!declFirst.has(d[1])) declFirst.set(d[1], { val, file: rel(f), line: i + 1 });
		}
		for (const m of l.matchAll(/--hub-[a-z0-9-]+/g)) {
			if (!occ.has(m[0])) occ.set(m[0], i + 1);
			if (!occFirst.has(m[0])) occFirst.set(m[0], { file: rel(f), line: i + 1 });
		}
	});
	if (map.size) declByFile.set(rel(f), map);
	if (occ.size) occByFile.set(rel(f), occ);
}
const normVal = (v) => {
	let s = v.replace(/\s+/g, ' ').trim().replace(/'/g, '"').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/,\s+/g, ',');
	s = s.replace(/#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])\b/g, (_, a, b, c) => `#${a}${a}${b}${b}${c}${c}`);
	return s.toLowerCase();
};
const valueDrift = [];
const sourceDrift = []; // E. Source column must name an existing file containing the token, with the right line
const mdLines = md.split('\n');
for (let i = 0; i < mdLines.length; i++) {
	if (ignoredLines.has(i)) continue;
	const m = mdLines[i].match(/^(\|\s*`(--hub-[a-z0-9-]+)`\s*\|\s*)(`[^`]*`|[^|]*)(\s*\|)([\s\S]*)$/);
	if (!m) continue;
	const tok = m[2];
	if (['ref', 'sys', 'container', 'body', 'main'].some((l) => tok.startsWith(`--hub-${l}-`))) continue;
	if (/`(PENDING|PROPOSAL)`/.test(mdLines[i])) continue;

	// --- E. Source validation (IN_USE + INTERNAL rows) ---
	const src = mdLines[i].match(/`([a-z0-9/._-]+\.(?:scss|ts|html)):(\d+)`/);
	if (src) {
		const relFile = `projects/${src[1]}`;
		const inFile = occByFile.get(relFile);
		let target = null; // { file, line }
		if (inFile?.has(tok)) {
			const line = declByFile.get(relFile)?.get(tok)?.line ?? inFile.get(tok);
			if (line !== Number(src[2])) target = { file: src[1], line, why: 'line' };
		} else {
			const found = declFirst.get(tok) ?? occFirst.get(tok);
			if (found) target = { file: found.file.replace(/^projects\//, ''), line: found.line, why: inFile ? 'token not in file' : 'file missing' };
		}
		if (target) {
			sourceDrift.push(`${tok}: \`${src[1]}:${src[2]}\` → \`${target.file}:${target.line}\` (${target.why})`);
			if (WRITE) mdLines[i] = mdLines[i].replace(src[0], `\`${target.file}:${target.line}\``);
		}
	}

	// --- D. Value parity (IN_USE rows with a real declaration) ---
	if (/`INTERNAL`/.test(mdLines[i])) continue;
	const code = (src && declByFile.get(`projects/${src[1]}`)?.get(tok)?.val) ?? declFirst.get(tok)?.val;
	if (!code || code.includes('#{')) continue;
	const mdVal = m[3].trim().replace(/^`|`$/g, '');
	if (normVal(mdVal) !== normVal(code)) {
		valueDrift.push(`${tok}: MD "${mdVal.slice(0, 60)}" ≠ code "${code.slice(0, 60)}"`);
		if (WRITE) mdLines[i] = mdLines[i].replace(m[3], `\`${code}\``);
	}
}
if (WRITE && (valueDrift.length || sourceDrift.length)) fs.writeFileSync(MD_PATH, mdLines.join('\n'));

// F. Per-library reference docs (projects/<lib>/docs/css-variables-reference.md):
// each token row's "Default" cell must match the library's actual declaration.
// url(data:) values, Sass-interpolated values and rows whose token has no declaration
// in that library (consumed-only bridges, prose) are skipped. --write rewrites cells.
const refDocDrift = [];
for (const lib of fs.readdirSync(path.join(ROOT, 'projects'))) {
	const docPath = path.join(ROOT, 'projects', lib, 'docs/css-variables-reference.md');
	if (!fs.existsSync(docPath)) continue;
	const docLines = fs.readFileSync(docPath, 'utf8').split('\n');
	let dirty = false;
	for (let i = 0; i < docLines.length; i++) {
		const m = docLines[i].match(/^(\|\s*`(--hub-[a-z0-9-]+)`(?:[^|]*)\|\s*)(`[^`]*`)(\s*\|)/);
		if (!m) continue;
		const tok = m[2];
		// the declaration must come from THIS library
		const decl = declFirst.get(tok);
		if (!decl || !decl.file.startsWith(`projects/${lib}/`)) continue;
		const code = decl.val;
		if (code.includes('#{') || /url\(/.test(code) || /url\(/.test(m[3])) continue;
		const mdVal = m[3].replace(/^`|`$/g, '');
		if (normVal(mdVal) !== normVal(code)) {
			refDocDrift.push(`${lib}: ${tok}: doc "${mdVal.slice(0, 45)}" ≠ code "${code.slice(0, 45)}"`);
			if (WRITE) {
				docLines[i] = `${m[1]}\`${code}\`${m[4]}${docLines[i].slice(m[0].length)}`;
				dirty = true;
			}
		}
	}
	if (WRITE && dirty) fs.writeFileSync(docPath, docLines.join('\n'));
}

// C. Library lint: consumed ref/sys must exist in ds.css
// e.g. var(--hub-sys-color-#{$variant}) is captured as `--hub-sys-color-` (trailing dash)
const interpolation = (t) => t.endsWith('-') || [...dsTokens].some((d) => d.startsWith(`${t}-`));
const lint = [...libConsumed]
	.filter((t) => (layer(t, 'ref') || layer(t, 'sys')) && !dsTokens.has(t) && !libDeclared.has(t))
	.filter((t) => !interpolation(t))
	.sort();

// -------------------------------------------------------------------- report
const out = [];
let fail = 0;
const section = (title, items, render) => {
	out.push(`\n${items.length ? '✗' : '✓'} ${title}: ${items.length}`);
	if (items.length) {
		fail += items.length;
		for (const it of items.slice(0, 60)) out.push(`    ${render(it)}`);
		if (items.length > 60) out.push(`    … and ${items.length - 60} more`);
	}
};

out.push('=== tokens-parity ===');
out.push(
	`ds.css tokens: ${dsTokens.size} | MD rows: ${mdRowTokens.size} | MD expanded: ${mdExpanded.size} | lib declared: ${libDeclared.size}`
);
out.push(`generative: ${hues.length} hues × ${steps.length} steps; ${variants.length} variants × ${roles.length} roles`);

out.push('\n── A. Foundational (ref/sys/container): ds ⇄ MD ──');
section('In ds but NOT documented in MD', dsFoundNotMd, (t) => t);
section('Documented (non-PENDING) but MISSING from ds', mdFoundNotDs, (t) => `${t}  [${mdStatus.get(t) || 'no-status'}]`);
section('Marked PENDING/PROPOSAL but COMPILED in ds (shipped)', foundShippedPending, (t) => t);

out.push('\n── B. Component coverage: libraries ⇄ MD ──');
section('Declared in a library but UNDOCUMENTED', gaps, (t) => `${t}  (${libDeclared.get(t)})`);
section('Consumed-only hook but UNDOCUMENTED', consumedGaps, (t) => t);
section('Documented IN_USE/INTERNAL but ABSENT from code (stale)', stale, (t) => t);
section('Marked PENDING/PROPOSAL but DECLARED in code (shipped)', shippedPending, (t) => `${t}  (${libDeclared.get(t)})`);
section('Duplicate MD rows for the same token', dupRows, (d) => d);

out.push('\n── C. Library lint: consumed ref/sys not in ds ──');
section('Consumed but missing from ds.css', lint, (t) => t);

out.push('\n── D. Value parity: MD "Initial value" ⇄ code declaration ──');
if (WRITE && valueDrift.length) {
	out.push(`  ✎ ${valueDrift.length} cell(s) rewritten from code (--write)`);
} else {
	section('Initial value drifted from code (run --write to sync)', valueDrift, (d) => d);
}

out.push('\n── E. Source column: file exists, contains the token, right line ──');
if (WRITE && sourceDrift.length) {
	out.push(`  ✎ ${sourceDrift.length} Source cell(s) retargeted (--write)`);
} else {
	section('Source drifted (run --write to fix)', sourceDrift, (d) => d);
}

out.push('\n── F. Per-library reference docs: Default cell ⇄ code declaration ──');
if (WRITE && refDocDrift.length) {
	out.push(`  ✎ ${refDocDrift.length} Default cell(s) rewritten from code (--write)`);
} else {
	section('Reference-doc default drifted (run --write to sync)', refDocDrift, (d) => d);
}

out.push('\n── G. Accent-slot annex ⇄ discovered slots ──');
section('Slot in code but MISSING from the annex', annexMissing, (t) => t);
section('Annex row without a matching slot in code', annexExtra, (t) => t);

out.push(`\n${fail ? `✗ DRIFT: ${fail} issue(s)` : '✓ No drift — MD, ds and libraries are in sync.'}`);
console.log(out.join('\n'));
process.exit(fail ? 1 : 0);
