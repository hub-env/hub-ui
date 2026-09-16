#!/usr/bin/env node
/**
 * test-libs — runs the unit suite of every workspace project that actually has specs.
 *
 * The project list is DISCOVERED, not hard-coded: a project qualifies when `angular.json` declares a
 * `test` target for it AND at least one `*.spec.ts` lives under its root. A project with a `test`
 * target but no spec makes `@angular/build:unit-test` throw rather than report zero tests, so it is
 * skipped here and picked up automatically the day it gets its first spec.
 *
 * Exits 1 on the first failing suite. Run: `npm run test:libs`.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Whether a directory tree contains at least one spec file.
 *
 * @param dir - Directory to search.
 * @returns `true` as soon as a `*.spec.ts` is found.
 */
function hasSpec(dir) {
	if (!fs.existsSync(dir)) {
		return false;
	}

	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') {
			continue;
		}

		const full = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (hasSpec(full)) {
				return true;
			}
		} else if (entry.name.endsWith('.spec.ts')) {
			return true;
		}
	}

	return false;
}

const angular = JSON.parse(fs.readFileSync(path.join(ROOT, 'angular.json'), 'utf8'));

const testable = [];
const skipped = [];

for (const [name, project] of Object.entries(angular.projects)) {
	const targets = project.architect ?? project.targets ?? {};

	if (!targets.test) {
		continue;
	}

	const projectRoot = path.join(ROOT, project.sourceRoot ?? project.root ?? '');

	if (hasSpec(projectRoot)) {
		testable.push(name);
	} else {
		skipped.push(name);
	}
}

if (skipped.length) {
	console.log(`↷ skipped (test target but no spec): ${skipped.join(', ')}\n`);
}

const failed = [];

for (const name of testable) {
	console.log(`\n── ${name} ──`);

	try {
		execSync(`npx ng test ${name} --no-watch`, { stdio: 'inherit', cwd: ROOT });
	} catch {
		failed.push(name);
	}
}

console.log('');

if (failed.length) {
	console.error(`✗ ${failed.length} suite(s) failed: ${failed.join(', ')}`);
	process.exit(1);
}

console.log(`✓ ${testable.length} suite(s) passed.`);
