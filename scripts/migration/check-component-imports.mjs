#!/usr/bin/env node
/**
 * Verifies that every `@Component` whose template uses a hub selector declares the matching
 * symbol — for EVERY decorator in the file, not just the first.
 *
 * The earlier version read one template per file and so passed three modal examples that
 * declare several components: their `hubButton` buttons rendered as bare UA chrome, and only
 * eslint's unused-import rule caught it. Angular says nothing, because an unmatched attribute
 * is simply an attribute.
 *
 * Run: node scripts/migration/check-component-imports.mjs [--fix]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const FIX = process.argv.includes('--fix');
const walk = (d) =>
	readdirSync(d).flatMap((n) => {
		const p = join(d, n);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});

const TARGETS = [
	{ selector: 'hubButton', symbol: 'HubButtonComponent', pkg: 'ng-hub-ui-buttons', attr: true },
	{ selector: 'hub-badge', symbol: 'HubBadgeComponent', pkg: 'ng-hub-ui-badges', attr: false },
	{ selector: 'hub-panel', symbol: 'PanelComponent', pkg: 'ng-hub-ui-panels', attr: false }
];

/** Every `@Component({...})` block in the file, as {start, end} offsets of the decorator body. */
function decorators(src) {
	const out = [];
	for (const m of src.matchAll(/@Component\(\{/g)) {
		let i = m.index + m[0].length;
		let depth = 1;
		for (; i < src.length && depth > 0; i++) {
			if (src[i] === '{') depth++;
			else if (src[i] === '}') depth--;
		}
		out.push({ start: m.index, end: i });
	}
	return out;
}

/** The template literal inside one decorator body, scanned to its true closing backtick. */
function templateIn(block) {
	const key = /\btemplate:\s*`/.exec(block);
	if (!key) return '';
	let i = key.index + key[0].length;
	let depth = 0;
	for (; i < block.length; i++) {
		if (block[i] === '\\') {
			i++;
			continue;
		}
		if (block[i] === '$' && block[i + 1] === '{') {
			depth++;
			i++;
			continue;
		}
		if (block[i] === '}' && depth > 0) {
			depth--;
			continue;
		}
		if (block[i] === '`' && depth === 0) break;
	}
	return block.slice(key.index + key[0].length, i);
}

const missing = [];
for (const path of walk('src/app').filter((p) => p.endsWith('.ts'))) {
	const src = readFileSync(path, 'utf8');
	if (!src.includes('@Component')) continue;

	for (const { start, end } of decorators(src)) {
		const block = src.slice(start, end);
		const tpl = templateIn(block);
		if (!tpl) continue;
		for (const t of TARGETS) {
			const used = t.attr
				? new RegExp(`<[a-zA-Z][^>]*\\s${t.selector}[\\s>=]`).test(tpl)
				: new RegExp(`<${t.selector}[\\s>]`).test(tpl);
			if (!used) continue;
			const imports = /imports:\s*\[([\s\S]*?)\]/.exec(block);
			if (imports && new RegExp(`\\b${t.symbol}\\b`).test(imports[1])) continue;
			missing.push({ path, start, symbol: t.symbol, pkg: t.pkg });
		}
	}
}

console.log(`declaraciones que faltan: ${missing.length}`);
for (const m of missing) console.log(`   ${m.path} → ${m.symbol}`);

if (!FIX) process.exit(missing.length ? 1 : 0);

// Applied back to front so earlier offsets stay valid.
const byFile = new Map();
for (const m of missing) byFile.set(m.path, [...(byFile.get(m.path) ?? []), m]);

for (const [path, items] of byFile) {
	let src = readFileSync(path, 'utf8');
	for (const m of items.sort((a, b) => b.start - a.start)) {
		const { start, end } = decorators(src).find((d) => d.start === m.start) ?? {};
		if (start === undefined) continue;
		let block = src.slice(start, end);
		const imports = /imports:\s*\[([\s\S]*?)\]/.exec(block);
		if (imports) {
			const inner = imports[1].trim();
			block = block.replace(
				imports[0],
				inner ? `imports: [${inner}${inner.endsWith(',') ? '' : ','} ${m.symbol}]` : `imports: [${m.symbol}]`
			);
		} else {
			const sel = /(selector: '[^']+',\n)/.exec(block);
			if (!sel) {
				console.log('  ! sin ancla:', path);
				continue;
			}
			block = block.replace(sel[1], `${sel[1]}\timports: [${m.symbol}],\n`);
		}
		src = src.slice(0, start) + block + src.slice(end);
		// Only the real import block counts. An example carries its own source as a template
		// literal, and those snippets contain `import` lines of their own — matching one of
		// them would skip adding the import the file actually needs.
		const lines = src.split('\n');
		const firstDecorator = lines.findIndex((l) => l.startsWith('@Component'));
		const header = lines.slice(0, firstDecorator).join('\n');
		if (!new RegExp(`import \\{[^}]*\\b${m.symbol}\\b[^}]*\\} from '${m.pkg}'`).test(header)) {
			let last = -1;
			for (let i = 0; i < firstDecorator; i++) if (/^import .*;$/.test(lines[i])) last = i;
			lines.splice(last + 1, 0, `import { ${m.symbol} } from '${m.pkg}';`);
			src = lines.join('\n');
		}
		writeFileSync(path, src);
	}
}
console.log(`corregidos: ${missing.length}`);
