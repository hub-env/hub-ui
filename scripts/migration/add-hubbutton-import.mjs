#!/usr/bin/env node
/**
 * Adds `HubButtonComponent` to the `imports` array of every standalone component whose
 * TEMPLATE uses the `hubButton` attribute.
 *
 * The template block is isolated first: an example also carries its own source as static
 * `templateCode` strings, and a `hubButton` that appears only there is documentation, not a
 * dependency — importing on account of it would earn an "unused in template" warning.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const walk = (dir) =>
	readdirSync(dir).flatMap((n) => {
		const p = join(dir, n);
		return statSync(p).isDirectory() ? walk(p) : [p];
	});

/** The inline `template:` backtick block, or the linked .html file's content. */
function templateOf(path, src) {
	const inline = /template:\s*`([\s\S]*?)`\s*,?\s*\n\s*(?:styles|styleUrls|changeDetection|encapsulation|host|providers|\})/m.exec(src);
	if (inline) return inline[1];
	const url = /templateUrl:\s*'([^']+)'/.exec(src);
	if (url) {
		try {
			return readFileSync(join(dirname(path), url[1]), 'utf8');
		} catch {
			return '';
		}
	}
	return '';
}

let added = 0;
const failures = [];

for (const path of walk('src/app').filter((p) => p.endsWith('.ts'))) {
	let src = readFileSync(path, 'utf8');
	if (!src.includes('hubButton') || !src.includes('@Component')) continue;
	if (!/\bhubButton\b/.test(templateOf(path, src))) continue;
	if (src.includes('HubButtonComponent')) continue;

	const importsMatch = /imports:\s*\[([\s\S]*?)\]/.exec(src);
	if (!importsMatch) {
		failures.push(`${path}: sin array imports`);
		continue;
	}

	const inner = importsMatch[1].trim();
	const replacement = inner ? `imports: [${inner}${inner.endsWith(',') ? '' : ','} HubButtonComponent]` : 'imports: [HubButtonComponent]';
	src = src.replace(importsMatch[0], replacement);

	// Import statement, placed after the last existing import line.
	const lastImport = [...src.matchAll(/^import .*?;$/gm)].pop();
	if (!lastImport) {
		failures.push(`${path}: sin sentencias import`);
		continue;
	}
	const at = lastImport.index + lastImport[0].length;
	src = src.slice(0, at) + `\nimport { HubButtonComponent } from 'ng-hub-ui-buttons';` + src.slice(at);

	writeFileSync(path, src);
	added++;
}

console.log(`HubButtonComponent añadido a ${added} componentes`);
for (const f of failures) console.log('  !', f);
