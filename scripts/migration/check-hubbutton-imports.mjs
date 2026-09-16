#!/usr/bin/env node
/**
 * Finds components whose template uses `hubButton` but whose `imports` array does not
 * declare `HubButtonComponent`.
 *
 * Angular is silent about this: an unmatched attribute is just an attribute, so the button
 * renders as bare UA chrome and the build stays green. Only the missing `hub-btn` class in
 * the DOM gives it away, which is why this check exists rather than a trust in the compiler.
 *
 * Run: node scripts/migration/check-hubbutton-imports.mjs [--fix]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const FIX = process.argv.includes('--fix');
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });

/**
 * The component's rendered template.
 *
 * The inline block is read by scanning for the matching backtick rather than by regex, so a
 * template containing its own backticks or `${}` cannot truncate the match.
 */
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
	if (url) {
		try { return readFileSync(join(dirname(path), url[1]), 'utf8'); } catch { return ''; }
	}
	return '';
}

const missing = [];
for (const path of walk('src/app').filter((p) => p.endsWith('.ts'))) {
	const src = readFileSync(path, 'utf8');
	if (!src.includes('@Component')) continue;
	// The attribute in a template, not the word inside a prose comment or a code snippet.
	if (!/<[a-zA-Z][^>]*\shubButton[\s>]/.test(templateOf(path, src))) continue;
	if (/imports:\s*\[[\s\S]*?HubButtonComponent[\s\S]*?\]/.test(src)) continue;
	missing.push(path);
}

console.log(`componentes con hubButton en plantilla y sin importar: ${missing.length}`);
for (const m of missing) console.log('  ', m);

if (FIX) {
	for (const path of missing) {
		let src = readFileSync(path, 'utf8');
		const im = /imports:\s*\[([\s\S]*?)\]/.exec(src);
		if (im) {
			const inner = im[1].trim();
			src = src.replace(im[0], inner ? `imports: [${inner}${inner.endsWith(',') ? '' : ','} HubButtonComponent]` : 'imports: [HubButtonComponent]');
		} else {
			const sel = /(@Component\(\{[\s\S]*?\n\tselector: '[^']+',\n)/.exec(src);
			if (!sel) { console.log('  ! sin ancla:', path); continue; }
			src = src.replace(sel[1], `${sel[1]}\timports: [HubButtonComponent],\n`);
		}
		if (!src.includes("from 'ng-hub-ui-buttons'")) {
			const lines = src.split('\n');
			const componentAt = lines.findIndex((l) => l.includes('@Component'));
			let last = -1;
			for (let i = 0; i < componentAt; i++) if (/^import .*;$/.test(lines[i])) last = i;
			lines.splice(last + 1, 0, "import { HubButtonComponent } from 'ng-hub-ui-buttons';");
			src = lines.join('\n');
		}
		writeFileSync(path, src);
	}
	console.log(`corregidos: ${missing.length}`);
}
