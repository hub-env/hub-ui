// ─────────────────────────────────────────────────────────────────────────
// ff · DERIVED-COLOR RE-FLATTEN  (Figma Plugin API script — browser-oracle edition)
// ─────────────────────────────────────────────────────────────────────────
//
// WHY THIS EXISTS
// ---------------
// In the `ds` (projects/ds/styles/tokens/hub-tokens.scss), the semantic colour
// family is GENERATIVE: each of the 9 variants exposes ONE accent and derives
// its role family live, in oklch (since ds 22.4.0):
//
//   --hub-sys-color-<v>-subtle:        color-mix(in oklch, var(--hub-sys-color-<v>) 12%, var(--hub-sys-surface-page));
//   --hub-sys-color-<v>-border-subtle: color-mix(in oklch, var(--hub-sys-color-<v>) 35%, var(--hub-sys-surface-page));
//   --hub-sys-color-<v>-emphasis:      color-mix(in oklch, var(--hub-sys-color-<v>) 80%, var(--hub-sys-color-ink));
//   --hub-sys-color-<v>-on:            oklch(from var(--hub-sys-color-<v>) clamp(0, (0.62 - l) * 1000, 1) 0 h);
//
// Figma variables cannot hold a formula, so these roles are FLATTENED to
// static hex per mode. Changing an accent in Figma does NOT re-derive them —
// re-run this script after any accent change.
//
// WHY THE VALUES ARE A BAKED TABLE (browser oracle)
// -------------------------------------------------
// Do NOT re-implement the colour math by hand. Chrome's `color-mix(in oklch …)`
// treats the hue of near-achromatic inputs (the ink, the grays) as POWERLESS:
// the mixed hue keeps the chromatic side's hue, and when BOTH sides are
// near-achromatic the resulting hue is `none` (rendered as 0°, slightly red).
// A naive shortest-arc hue interpolation produces visibly different colours
// (e.g. warning-emphasis drifts to olive-green instead of gold). The only
// faithful source is the browser itself.
//
// TO REGENERATE THE MATRIX (after changing any accent):
//   1. In Chrome (matching the product's target), evaluate for each variant × mode:
//        canvas 1×1 → ctx.fillStyle = expr → fillRect → getImageData → hex
//      with the expressions above, substituting:
//        Light: page #ffffff · ink #212529   Dark: page #121212 · ink #f8f9fa
//        and the accent hex of ff/sys/color/<v> per mode.
//      (The chrome-devtools MCP `evaluate_script` does this in one call.)
//   2. Paste the result into MATRIX below and run this script via `use_figma`
//      against fileKey Jhw5jWWGTFMdHi7MDKz64C.
//
// MATRIX baked on 2026-07-09 from Chrome 150 with the default theme accents
// (Light: blue-500/gray-600/green-500/red-500/yellow-500/cyan-500/gray-600/
//  gray-100/gray-900 · Dark: blue-300/…/green-300/red-300/yellow-300/cyan-300).
// ─────────────────────────────────────────────────────────────────────────

const MATRIX = {
	primary: { L: { subtle: '#e4efff', borderSubtle: '#b0d0ff', emphasis: '#1b60cf', on: '#ffffff' }, D: { subtle: '#1c2129', borderSubtle: '#30415b', emphasis: '#8ab9ff', on: '#000000' } },
	secondary: { L: { subtle: '#efeded', borderSubtle: '#d0cbcc', emphasis: '#6b5f62', on: '#ffffff' }, D: { subtle: '#1d1c1c', borderSubtle: '#343031', emphasis: '#948a8c', on: '#ffffff' } },
	success: { L: { subtle: '#e6f0e9', borderSubtle: '#b5d5c0', emphasis: '#23724a', on: '#ffffff' }, D: { subtle: '#1d2320', borderSubtle: '#33453c', emphasis: '#90c4ab', on: '#000000' } },
	danger: { L: { subtle: '#ffe9e8', borderSubtle: '#fbbebc', emphasis: '#b6363f', on: '#ffffff' }, D: { subtle: '#281e1f', borderSubtle: '#553739', emphasis: '#ef9da3', on: '#000000' } },
	warning: { L: { subtle: '#fff8ea', borderSubtle: '#ffebc0', emphasis: '#cf9f24', on: '#000000' }, D: { subtle: '#29261d', borderSubtle: '#5a5031', emphasis: '#fee18c', on: '#000000' } },
	info: { L: { subtle: '#eaf9fe', borderSubtle: '#c2eefb', emphasis: '#26a6c4', on: '#000000' }, D: { subtle: '#1d2628', borderSubtle: '#335158', emphasis: '#8fe5f7', on: '#000000' } },
	neutral: { L: { subtle: '#efeded', borderSubtle: '#d0cbcc', emphasis: '#6b5f62', on: '#ffffff' }, D: { subtle: '#1d1c1c', borderSubtle: '#343031', emphasis: '#948a8c', on: '#ffffff' } },
	light: { L: { subtle: '#fefefe', borderSubtle: '#fdfdfd', emphasis: '#ccc9ca', on: '#000000' }, D: { subtle: '#282828', borderSubtle: '#595858', emphasis: '#faf8f9', on: '#000000' } },
	dark: { L: { subtle: '#e2e1e2', borderSubtle: '#adaaab', emphasis: '#292324', on: '#ffffff' }, D: { subtle: '#151414', borderSubtle: '#1a1818', emphasis: '#4d4849', on: '#ffffff' } }
};
const ROLE_PATH = { subtle: 'subtle', borderSubtle: 'border/subtle', emphasis: 'emphasis', on: 'on' };

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const sys = cols.find((c) => c.name === 'ff · sys');
const modeByLetter = { L: sys.modes.find((m) => m.name === 'Light').modeId, D: sys.modes.find((m) => m.name === 'Dark').modeId };
const all = await figma.variables.getLocalVariablesAsync();
const byName = new Map(all.map((v) => [v.name, v]));
const h2c = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255, a: 1 });

let written = 0;
const missing = [];
for (const [variant, modes] of Object.entries(MATRIX)) {
	for (const [ml, roles] of Object.entries(modes)) {
		for (const [role, hx] of Object.entries(roles)) {
			const name = `ff/sys/color/${variant}/${ROLE_PATH[role]}`;
			const v = byName.get(name);
			if (!v) { missing.push(name); continue; }
			v.setValueForMode(modeByLetter[ml], h2c(hx));
			written++;
		}
	}
}
return { written, missing };
