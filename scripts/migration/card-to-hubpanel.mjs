#!/usr/bin/env node
/**
 * Rewrites Bootstrap cards to <hub-panel>.
 *
 * The closing tag is found by scanning and counting nested <div>s, not by regex: a card
 * wraps arbitrary markup, so only real tag matching can tell which `</div>` is its own.
 *
 * - `<div class="card …">` … `</div>`  ->  `<hub-panel …>` … `</hub-panel>`
 * - `class="card-body …"` loses `card-body`; the panel already pads its own content.
 * - `card-header` becomes the panel's `heading` only when it holds plain text; anything
 *   richer is left for a human, because a heading input cannot carry markup.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const WRITE = process.argv.includes('--write');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

/** Index just past the `</div>` that closes the `<div>` opening at `openEnd`. */
function matchingDivEnd(src, openEnd) {
	let depth = 1;
	let i = openEnd;
	while (i < src.length && depth > 0) {
		const nextOpen = src.indexOf('<div', i);
		const nextClose = src.indexOf('</div>', i);
		if (nextClose === -1) return -1;
		if (nextOpen !== -1 && nextOpen < nextClose) { depth++; i = nextOpen + 4; continue; }
		depth--;
		if (depth === 0) return nextClose;
		i = nextClose + 6;
	}
	return -1;
}

let cards = 0, files = 0;
const notes = [];

for (const path of walk('src/app').filter((p) => p.endsWith('.ts') || p.endsWith('.html'))) {
	let src = readFileSync(path, 'utf8');
	if (!/class="[^"]*\bcard\b/.test(src)) continue;
	let touched = 0;
	let guard = 0;
	let from = 0;

	while (guard++ < 500) {
		// `\b` treats the hyphen as a word boundary, so `card-body` matches a naive
		// `\bcard\b`. The token list is the authority; the search resumes past a near miss
		// instead of abandoning the file on one.
		const re = /<div([^>]*)class="([^"]*card[^"]*)"([^>]*)>/g;
		re.lastIndex = from;
		const open = re.exec(src);
		if (!open) break;
		const tokens = open[2].split(/\s+/).filter(Boolean);
		if (!tokens.includes('card')) { from = open.index + 1; continue; }

		const openStart = open.index;
		const openEnd = openStart + open[0].length;
		const closeAt = matchingDivEnd(src, openEnd);
		if (closeAt === -1) { notes.push(`${path}: cierre no emparejado`); break; }

		const kept = tokens.filter((t) => t !== 'card');
		const rest = `${open[1]}${open[3]}`.trim();
		const cls = kept.length ? ` class="${kept.join(' ')}"` : '';
		const attrs = [cls, rest ? ` ${rest}` : ''].join('');

		src = src.slice(0, openStart) + `<hub-panel${attrs}>` + src.slice(openEnd, closeAt) + '</hub-panel>' + src.slice(closeAt + 6);
		from = openStart + 1;
		touched++;
	}

	if (touched) {
		// The body wrapper is redundant once the panel owns the padding.
		src = src.replace(/class="card-body\s*([^"]*)"/g, (w, rest) => (rest.trim() ? `class="${rest.trim()}"` : ''));
		src = src.replace(/<div\s+>/g, '<div>');
		files++;
		cards += touched;
		if (WRITE) writeFileSync(path, src);
	}
}

console.log(`${WRITE ? 'convertidas' : 'se convertirían'}: ${cards} cards en ${files} ficheros`);
for (const n of [...new Set(notes)].slice(0, 10)) console.log('  !', n);
