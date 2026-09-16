#!/usr/bin/env node
/**
 * Replaces hard-coded light-theme colours in example styles with the design-system tokens.
 *
 * Only CSS DECLARATIONS are touched (`background:`, `color:`, `border…:`), never a value in
 * TypeScript or an attribute: an example that passes `bgColor="#0d6efd"` to an avatar is
 * demonstrating a fixed colour on purpose and must keep it.
 *
 * The token carries the literal as its fallback, so nothing changes for a consumer without
 * the design system loaded.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

const BACKGROUNDS = {
	'#f8f9fa': '--hub-sys-surface-elevated',
	'#e9ecef': '--hub-sys-state-hover-bg',
	'#ffffff': '--hub-sys-surface-page',
	'#fff': '--hub-sys-surface-page'
};
const TEXT = {
	'#212529': '--hub-sys-text-primary',
	'#495057': '--hub-sys-text-secondary',
	'#6c757d': '--hub-sys-text-muted'
};
const BORDERS = {
	'#dee2e6': '--hub-sys-border-color-default',
	'#e9ecef': '--hub-sys-border-color-default',
	'#ced4da': '--hub-sys-border-color-default'
};

let hits = 0, files = 0;
for (const path of walk('src/app').filter((p) => p.endsWith('.ts') || p.endsWith('.scss'))) {
	const src = readFileSync(path, 'utf8');
	let out = src;

	out = out.replace(/(\bbackground(?:-color)?:\s*)(#[0-9a-fA-F]{3,6})\b/g, (w, prop, hex) => {
		const token = BACKGROUNDS[hex.toLowerCase()];
		if (!token) return w;
		hits++;
		return `${prop}var(${token}, ${hex})`;
	});
	out = out.replace(/(\bcolor:\s*)(#[0-9a-fA-F]{3,6})\b/g, (w, prop, hex) => {
		const token = TEXT[hex.toLowerCase()];
		if (!token) return w;
		hits++;
		return `${prop}var(${token}, ${hex})`;
	});
	out = out.replace(/(\bborder(?:-[a-z]+)?:\s*[^;{}]*?)(#[0-9a-fA-F]{3,6})\b/g, (w, head, hex) => {
		const token = BORDERS[hex.toLowerCase()];
		if (!token) return w;
		hits++;
		return `${head}var(${token}, ${hex})`;
	});

	if (out !== src) { files++; if (WRITE) writeFileSync(path, out); }
}
console.log(`${WRITE ? 'sustituidos' : 'se sustituirían'}: ${hits} literales en ${files} ficheros`);
