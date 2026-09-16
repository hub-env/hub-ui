#!/usr/bin/env node
/**
 * Rewrites Bootstrap button classes to the `[hubButton]` attribute API.
 *
 * Only a class list containing the standalone `btn` token is touched, which is what keeps
 * it off the CSS custom-property names that merely look similar (`btn-color`, `btn-accent`,
 * `btn-hover-bg`) and off BEM classes of the examples' own (`btn--next`).
 *
 * `btn-close` and `btn-group` have no hub-ui equivalent, so an element carrying either is
 * reported and left alone rather than half-converted.
 *
 * Run: node scripts/migration/btn-to-hubbutton.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');

const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
const SIZES = { 'btn-sm': 'sm', 'btn-lg': 'lg' };
const SKIP = /^btn-(close|group|group-vertical|toolbar)$/;

const walk = (dir) =>
	readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});

/** Turns one Bootstrap class list into the remaining classes plus the hub attributes. */
function convert(classList) {
	const tokens = classList.split(/\s+/).filter(Boolean);
	if (!tokens.includes('btn')) return null;
	if (tokens.some((t) => SKIP.test(t))) return { skipped: tokens.filter((t) => SKIP.test(t)) };

	const kept = [];
	let color = null;
	let variant = null;
	let size = null;

	for (const token of tokens) {
		if (token === 'btn') continue;
		if (SIZES[token]) { size = SIZES[token]; continue; }
		if (token === 'btn-link') { variant = 'link'; continue; }
		const outline = /^btn-outline-(.+)$/.exec(token);
		if (outline && COLORS.includes(outline[1])) { variant = 'outline'; color = outline[1]; continue; }
		const solid = /^btn-(.+)$/.exec(token);
		if (solid && COLORS.includes(solid[1])) { color = solid[1]; continue; }
		kept.push(token);
	}

	const attrs = [];
	if (variant) attrs.push(`variant="${variant}"`);
	if (color) attrs.push(`color="${color}"`);
	if (size) attrs.push(`size="${size}"`);

	return { kept, attrs: ['hubButton', ...attrs].join(' ') };
}

let files = 0;
let converted = 0;
const skipped = [];

for (const path of walk('src/app').filter((p) => p.endsWith('.ts') || p.endsWith('.html'))) {
	const src = readFileSync(path, 'utf8');
	let touched = 0;

	const out = src.replace(/class="([^"]*)"/g, (whole, classList) => {
		const result = convert(classList);
		if (!result) return whole;
		if (result.skipped) {
			skipped.push(`${path}: ${result.skipped.join(' ')}`);
			return whole;
		}
		touched++;
		return result.kept.length ? `${result.attrs} class="${result.kept.join(' ')}"` : result.attrs;
	});

	if (touched) {
		files++;
		converted += touched;
		if (WRITE) writeFileSync(path, out);
	}
}

console.log(`${WRITE ? 'reescritos' : 'se reescribirían'}: ${converted} atributos en ${files} ficheros`);
console.log(`sin equivalente hub-ui, intactos: ${skipped.length}`);
for (const s of [...new Set(skipped)].slice(0, 12)) console.log('  ', s);
