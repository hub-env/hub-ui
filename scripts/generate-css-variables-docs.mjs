#!/usr/bin/env node
/**
 * generate-css-variables-docs — docs-page CSS-variable tables, generated from the MD.
 *
 * Source of truth: projects/ds/docs/variables-css-library.en.md (kept in sync with the
 * library code by scripts/tokens-parity.mjs, checks A–D). This script projects the MD
 * component sections into `src/app/generated/md-css-variables.ts`, one CssVariableGroup[]
 * per docs page, so the pages' "CSS Variables" tables always show the complete, true API.
 *
 * - Only `IN_USE` rows are emitted (PENDING/PROPOSAL are aspirational, INTERNAL are
 *   runtime-written variables — not theming hooks).
 * - Descriptions reuse the page's existing `DOCS.*` i18n key for a token when one was
 *   already curated (preserving the 8-language translations); otherwise the MD "Usage"
 *   text is emitted as plain English (rendered as-is; translatable later via the
 *   library-content maps).
 * - `url(data:…)` default values are elided to keep the tables readable.
 *
 * Run: `npm run docs:cssvars`  ·  CI: `npm run docs:cssvars -- --check` (exit 1 on drift).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MD_PATH = path.join(ROOT, 'projects/ds/docs/variables-css-library.en.md');
const OUT_PATH = path.join(ROOT, 'src/app/generated/md-css-variables.ts');
const CHECK = process.argv.includes('--check');

// MD section name -> { page, title } (sections absent here are skipped: foundational
// layers, PENDING-only proposals and libraries without a docs page).
const SECTION_MAP = {
	accordion: { page: 'panels', title: 'Accordion (legacy bridge)' },
	'action sheet': { page: 'action-sheet', title: 'Action sheet' },
	avatar: { page: 'avatar', title: 'Avatar' },
	board: { page: 'board', title: 'Board' },
	breadcrumbs: { page: 'breadcrumbs', title: 'Breadcrumbs' },
	calendar: { page: 'calendar', title: 'Calendar' },
	form: { page: 'forms', title: 'Form' },
	'form container': { page: 'forms', title: 'Form' },
	input: { page: 'forms', title: 'Input' },
	'file input': { page: 'forms', title: 'File input' },
	select: { page: 'forms', title: 'Select' },
	check: { page: 'forms', title: 'Check & radio' },
	datepicker: { page: 'forms', title: 'Datepicker' },
	daterangepicker: { page: 'forms', title: 'Date range picker' },
	label: { page: 'forms', title: 'Label' },
	slider: { page: 'forms', title: 'Slider' },
	switch: { page: 'forms', title: 'Switch' },
	otp: { page: 'forms', title: 'OTP input' },
	badges: { page: 'badges', title: 'Badge' },
	buttons: { page: 'buttons', title: 'Buttons, FAB & dropdown' },
	utils: { page: 'utils', title: 'Overlay & tooltip' },
	modal: { page: 'modal', title: 'Modal' },
	toast: { page: 'toast', title: 'Toast' },
	table: { page: 'table', title: 'Table' },
	list: { page: 'table', title: 'List' },
	paginator: { page: 'table', title: 'Paginator' },
	'menu filter': { page: 'table', title: 'Column filter panel' },
	'table dropdown': { page: 'table', title: 'Row actions menu (deprecated)' },
	signature: { page: 'signature', title: 'Signature' },
	skeleton: { page: 'skeleton', title: 'Skeleton' },
	metrics: { page: 'metrics', title: 'Metrics' },
	stepper: { page: 'stepper', title: 'Stepper' },
	nav: { page: 'nav', title: 'Nav' },
	panels: { page: 'panels', title: 'Panels' },
	milestones: { page: 'milestones', title: 'Milestones' },
	icons: { page: 'icons', title: 'Icon' },
	loading: { page: 'loading', title: 'Loading' },
	'loading-bar': { page: 'loading', title: 'Loading bar' }
};

// ------------------------------------------------- existing token -> i18n key map
// Reuse curated DOCS.* description keys so existing translations survive. The mapping
// is frozen in css-vars-doc-i18n-map.json (the hand-curated page arrays it was mined
// from no longer exist) — extend that file to translate more tokens.
function collectExistingKeys() {
	const mapPath = path.join(ROOT, 'scripts/css-vars-doc-i18n-map.json');
	return new Map(Object.entries(JSON.parse(fs.readFileSync(mapPath, 'utf8'))));
}

// ------------------------------------------------------------------ MD parsing
function parseMd() {
	const md = fs.readFileSync(MD_PATH, 'utf8');
	const pages = new Map(); // page -> Map(groupTitle -> vars[])
	let section = null;
	for (const line of md.split('\n')) {
		const h = line.match(/^#{3,4}\s+(.*)$/);
		if (h) {
			const name = (h[1].match(/`([^`]+)`/) || [, h[1]])[1].trim();
			section = SECTION_MAP[name] ?? null;
			continue;
		}
		if (!section) continue;
		const row = line.match(/^\|\s*`(--hub-[a-z0-9-]+)`\s*\|\s*(`[^`]*`|[^|]*)\|([^|]*)\|([^|]*)\|/);
		if (!row || !/`IN_USE`/.test(line)) continue;
		const [, token, rawValue, rawUsage] = row;
		let value = rawValue.trim().replace(/^`|`$/g, '').replace(/\s+/g, ' ');
		if (/url\(/.test(value)) value = value.replace(/url\((["']).*?\1\s*\)|url\([^)]*\)/g, 'url("data:image/svg+xml,…")');
		const usage = rawUsage.trim().replace(/`/g, '');
		if (!pages.has(section.page)) pages.set(section.page, new Map());
		const groups = pages.get(section.page);
		if (!groups.has(section.title)) groups.set(section.title, []);
		groups.get(section.title).push({ token, value, usage });
	}
	return pages;
}

// ------------------------------------------------------------------ type heuristic
function inferType(token, value) {
	const t = token.toLowerCase();
	const v = value.toLowerCase();
	if (v.includes('url(')) return 'url';
	if (/shadow/.test(t)) return 'shadow';
	if (/(transition|duration|easing|animation|delay)/.test(t)) return 'transition';
	if (/(zindex|z-index|opacity|columns|-order$|flex$|font-weight|line-height)/.test(t)) return 'number';
	if (/(color|-bg$|-bg-|background|accent|emphasis|subtle$|-on$|-ink|fill$|tint)/.test(t)) return 'color';
	if (/(radius|width|height|size)/.test(t)) return 'length';
	if (/border(-style)?$/.test(t)) return 'border';
	if (/(width|height|size|padding|margin|gap|radius|offset|inset|spacing|top$|min-|max-|indent)/.test(t)) return 'length';
	if (/^#|rgba?\(|oklch|color-mix|var\(--hub-(sys|ref)-color/.test(v)) return 'color';
	if (/rem$|px$|em$|%$/.test(v)) return 'length';
	return 'string';
}

// ------------------------------------------------------------------ emit
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const existingKeys = collectExistingKeys();
const pages = parseMd();

let out = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Complete CSS-variable tables for the library docs pages, projected from the design
 * system's token spec (projects/ds/docs/variables-css-library.en.md), which
 * scripts/tokens-parity.mjs keeps in sync with the library code.
 *
 * Regenerate with: npm run docs:cssvars
 */
import { CssVariableGroup } from '../../models/interfaces';

export const MD_CSS_VARIABLES: Record<string, CssVariableGroup[]> = {
`;
for (const [page, groups] of [...pages.entries()].sort()) {
	out += `\t'${page}': [\n`;
	for (const [title, vars] of groups) {
		out += `\t\t{\n\t\t\ttitle: '${esc(title)}',\n`;
		out += `\t\t\tdescription: 'Design tokens read by this component. Override them on the host element (or any ancestor) to customize; every default falls back to the ng-hub-ui-ds layer.',\n`;
		out += `\t\t\tvariables: [\n`;
		for (const v of vars) {
			const desc = existingKeys.get(v.token) ?? v.usage;
			out += `\t\t\t\t{ name: '${v.token}', defaultValue: '${esc(v.value)}', description: '${esc(desc)}', type: '${inferType(v.token, v.value)}' },\n`;
		}
		out += `\t\t\t]\n\t\t},\n`;
	}
	out += `\t],\n`;
}
out += `};\n`;

// A library whose SEO route has no entry here has nothing to theme, so its
// /styles/ tab documents nothing. Projected into its own tiny module — rather
// than read from the table above — so the SEO layer can consult it without
// pulling the whole variable catalogue into its bundle.
const THEMING_OUT_PATH = path.join(ROOT, 'src/app/seo/theming-surface.generated.ts');
const ROUTE_BY_CSS_KEY = { table: 'paginable' };
const themeableRoutes = [...pages.keys()]
	.map((key) => ROUTE_BY_CSS_KEY[key] ?? key)
	.sort();
const themingOut = `// Generated by scripts/generate-css-variables-docs.mjs — do not edit by hand.

/**
 * Library routes that expose at least one CSS variable, i.e. the ones whose
 * \`/styles/\` tab has something to document. Headless libraries (a store, a
 * portal, a drag-and-drop utility) are absent, and their styles tab is marked
 * \`noindex\` so it never reaches the sitemap as an empty page.
 */
export const THEMEABLE_LIBRARY_ROUTES: ReadonlySet<string> = new Set([
${themeableRoutes.map((route) => `\t'${route}'`).join(',\n')}
]);
`;

if (CHECK) {
	const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, 'utf8') : '';
	if (current !== out) {
		console.error('✗ md-css-variables.ts is stale — run `npm run docs:cssvars` to regenerate.');
		process.exit(1);
	}
	console.log('✓ md-css-variables.ts is up to date.');
} else {
	fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
	fs.writeFileSync(OUT_PATH, out);
	fs.writeFileSync(THEMING_OUT_PATH, themingOut);
	const nPages = pages.size;
	let nVars = 0;
	for (const groups of pages.values()) for (const vars of groups.values()) nVars += vars.length;
	console.log(`✓ generated ${path.relative(ROOT, OUT_PATH)} — ${nPages} pages, ${nVars} variables (${existingKeys.size} reused i18n keys).`);
}
