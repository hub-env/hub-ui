#!/usr/bin/env node
/**
 * Rewrites Bootstrap badge spans to <hub-badge>.
 *
 * Deliberately strict: only a <span> whose class list starts from the `badge` token and
 * whose content holds no further tag is rewritten, so a nested structure is reported rather
 * than mangled. Colour comes from `bg-*` / `text-bg-*`, shape from `rounded-pill`.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');
const COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

// <span class="…badge…" …other attrs…>content without tags</span>
const SPAN = /<span([^>]*?)class="([^"]*\bbadge\b[^"]*)"([^>]*)>([^<]*)<\/span>/g;

let converted = 0, files = 0;
const leftovers = [];

for (const path of walk('src/app').filter((p) => p.endsWith('.ts') || p.endsWith('.html'))) {
	const src = readFileSync(path, 'utf8');
	if (!/\bbadge\b/.test(src)) continue;
	let touched = 0;

	const out = src.replace(SPAN, (whole, before, classList, after, content) => {
		const tokens = classList.split(/\s+/).filter(Boolean);
		if (!tokens.includes('badge')) return whole;

		const kept = [];
		let color = null;
		let shape = null;
		for (const t of tokens) {
			if (t === 'badge') continue;
			if (t === 'rounded-pill') { shape = 'pill'; continue; }
			const m = /^(?:text-)?bg-(.+)$/.exec(t);
			if (m && COLORS.includes(m[1])) { color = m[1]; continue; }
			kept.push(t);
		}

		const attrs = [];
		if (color) attrs.push(`color="${color}"`);
		// `pill` is the component's own default, so it is only worth stating when it is not.
		if (!shape) attrs.push('shape="rounded"');

		const rest = `${before}${after}`.trimEnd();
		const cls = kept.length ? ` class="${kept.join(' ')}"` : '';
		touched++;
		return `<hub-badge ${attrs.join(' ')}${cls}${rest ? ' ' + rest.trim() : ''}>${content}</hub-badge>`;
	});

	// Anything still carrying a bare `badge` token after the pass needs eyes on it.
	for (const m of out.matchAll(/class="([^"]*)"/g)) {
		if (m[1].split(/\s+/).includes('badge')) leftovers.push(`${path}: ${m[1]}`);
	}

	if (touched) { files++; converted += touched; if (WRITE) writeFileSync(path, out); }
}

console.log(`${WRITE ? 'convertidos' : 'se convertirían'}: ${converted} badges en ${files} ficheros`);
console.log(`sin convertir (estructura anidada u otra forma): ${leftovers.length}`);
for (const l of [...new Set(leftovers)].slice(0, 15)) console.log('  ', l);
