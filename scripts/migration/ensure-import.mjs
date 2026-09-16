#!/usr/bin/env node
/**
 * Ensures every component whose TEMPLATE uses a given selector declares the matching symbol
 * in its `imports` array — and adds it when `--fix` is passed.
 *
 * This exists because Angular is silent about the omission: an unmatched element or
 * attribute is inert markup, the build stays green, and the component renders as bare
 * chrome. Only the DOM gives it away.
 *
 * Usage: node scripts/migration/ensure-import.mjs <tag-or-attr> <Symbol> <package> [--fix]
 *   node scripts/migration/ensure-import.mjs hub-badge HubBadgeComponent ng-hub-ui-badges --fix
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const [selector, symbol, pkg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const FIX = process.argv.includes('--fix');
if (!selector || !symbol || !pkg) {
	console.error('uso: ensure-import.mjs <tag-or-attr> <Symbol> <package> [--fix]');
	process.exit(2);
}

const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

/** The rendered template: the inline backtick block scanned to its true end, or the linked file. */
function templateOf(path, src) {
	const key = /\btemplate:\s*`/.exec(src);
	if (key) {
		let i = key.index + key[0].length;
		let depth = 0;
		for (; i < src.length; i++) {
			if (src[i] === '\\') { i++; continue; }
			if (src[i] === '$' && src[i + 1] === '{') { depth++; i++; continue; }
			if (src[i] === '}' && depth > 0) { depth--; continue; }
			if (src[i] === '`' && depth === 0) break;
		}
		return src.slice(key.index + key[0].length, i);
	}
	const url = /templateUrl:\s*'([^']+)'/.exec(src);
	if (url) { try { return readFileSync(join(dirname(path), url[1]), 'utf8'); } catch { return ''; } }
	return '';
}

// An element (`<hub-badge`) or an attribute on some element (`<button … hubButton>`).
const used = selector.startsWith('hub-')
	? new RegExp(`<${selector}[\\s>]`)
	: new RegExp(`<[a-zA-Z][^>]*\\s${selector}[\\s>=]`);

const missing = [];
for (const path of walk('src/app').filter((p) => p.endsWith('.ts'))) {
	const src = readFileSync(path, 'utf8');
	if (!src.includes('@Component')) continue;
	if (!used.test(templateOf(path, src))) continue;
	if (new RegExp(`imports:\\s*\\[[\\s\\S]*?\\b${symbol}\\b[\\s\\S]*?\\]`).test(src)) continue;
	missing.push(path);
}

console.log(`${selector}: ${missing.length} componente(s) sin importar ${symbol}`);
for (const m of missing) console.log('  ', m);

if (!FIX) process.exit(missing.length ? 1 : 0);

for (const path of missing) {
	let src = readFileSync(path, 'utf8');
	const im = /imports:\s*\[([\s\S]*?)\]/.exec(src);
	if (im) {
		const inner = im[1].trim();
		src = src.replace(im[0], inner ? `imports: [${inner}${inner.endsWith(',') ? '' : ','} ${symbol}]` : `imports: [${symbol}]`);
	} else {
		const sel = /(@Component\(\{[\s\S]*?\n\tselector: '[^']+',\n)/.exec(src);
		if (!sel) { console.log('  ! sin ancla para el array imports:', path); continue; }
		src = src.replace(sel[1], `${sel[1]}\timports: [${symbol}],\n`);
	}
	if (!src.includes(`from '${pkg}'`)) {
		const lines = src.split('\n');
		const componentAt = lines.findIndex((l) => l.includes('@Component'));
		let last = -1;
		for (let i = 0; i < componentAt; i++) if (/^import .*;$/.test(lines[i])) last = i;
		lines.splice(last + 1, 0, `import { ${symbol} } from '${pkg}';`);
		src = lines.join('\n');
	} else {
		src = src.replace(new RegExp(`import \\{([^}]*)\\} from '${pkg}';`), (w, inner) =>
			inner.includes(symbol) ? w : `import {${inner.replace(/\s*$/, '')}, ${symbol} } from '${pkg}';`
		);
	}
	writeFileSync(path, src);
}
console.log(`corregidos: ${missing.length}`);
