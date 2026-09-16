#!/usr/bin/env node
/**
 * deploy — publishes hubui.dev by hand, the same way the workflow does.
 *
 * The normal path is `.github/workflows/deploy.yml`, which runs on every push to `main`.
 * This script exists for when that path is cut — Actions suspended for billing, a GitHub
 * incident — and the site has to go out anyway. It runs the same steps in the same order:
 * the library test gate, a production build, and an rsync over SSH that only sends what
 * changed. The procedure, and the two traps that cost an afternoon to find, are written up
 * in the maintainer's knowledge base ("00 · Despliegue manual de hubui.dev").
 *
 * Usage:
 *   npm run deploy                 # gate, build, confirm, upload
 *   npm run deploy -- --dry-run    # everything except the upload; shows what would travel
 *   npm run deploy -- --skip-build # upload the build already in dist/ (still confirms)
 *   npm run deploy -- --yes        # no confirmation prompt
 *   npm run deploy -- --allow-dirty
 *
 * The connection is read from the environment. DEPLOY_HOST and DEPLOY_USER are required and
 * have no default, because this repository is public and the server address should not be;
 * DEPLOY_PORT and DEPLOY_PATH default to the hosting provider's usual values. SSH asks for
 * the password on the terminal; nothing is stored here.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = './dist/ng-hub-ui/browser/';

const HOST = process.env['DEPLOY_HOST'];
const USER = process.env['DEPLOY_USER'];
const PORT = process.env['DEPLOY_PORT'] ?? '65002';
const REMOTE = process.env['DEPLOY_PATH'] ?? 'domains/hubui.dev/public_html/';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);

if (has('--help') || has('-h')) {
	console.log(
		[
			'',
			'  npm run deploy [-- flags]',
			'',
			'    --dry-run       run everything but the upload, listing what would travel',
			'    --skip-build    upload what is already in dist/, skipping the gate and the build',
			'    --yes           do not ask before uploading',
			'    --allow-dirty   deploy with uncommitted changes in the working tree',
			'',
			`  target: ${USER ?? '$DEPLOY_USER'}@${HOST ?? '$DEPLOY_HOST'}:${REMOTE} (port ${PORT})`,
			'  details: "00 · Despliegue manual de hubui.dev" in the maintainer knowledge base',
			''
		].join('\n')
	);
	process.exit(0);
}

if (!HOST || !USER) {
	fail('set DEPLOY_HOST and DEPLOY_USER in the environment before deploying');
}

/** Runs a command with the terminal attached, and stops the deploy if it fails. */
function run(command, commandArgs, { allowFailure = false } = {}) {
	const result = spawnSync(command, commandArgs, { cwd: ROOT, stdio: 'inherit' });

	if (result.error) {
		fail(`could not run ${command}: ${result.error.message}`);
	}
	if (result.status !== 0 && !allowFailure) {
		fail(`${command} exited with ${result.status}`);
	}

	return result.status;
}

function fail(message) {
	console.error(`\n✗ ${message}\n`);
	process.exit(1);
}

function step(title) {
	console.log(`\n[1m── ${title}[0m`);
}

// ── Pre-flight ───────────────────────────────────────────────────────────────
// A deploy from a dirty tree ships something that cannot be reproduced from a
// commit, which is exactly the state you do not want to debug from later.

const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' }).stdout?.trim();

if (dirty && !has('--allow-dirty')) {
	console.error('\n✗ the working tree has uncommitted changes:\n');
	console.error(dirty.split('\n').slice(0, 10).join('\n'));
	console.error('\n  Commit them, or pass --allow-dirty if this is deliberate.\n');
	process.exit(1);
}

// ── Gate and build ───────────────────────────────────────────────────────────

if (!has('--skip-build')) {
	step('library tests — the same gate the workflow runs before shipping');
	run('npm', ['run', 'test:libs']);

	step('production build');
	run('npm', ['run', 'build', '--', '--configuration', 'production']);
}

if (!existsSync(path.join(ROOT, SRC, 'index.html'))) {
	fail(`no build found at ${SRC} — run without --skip-build`);
}

// ── Upload ───────────────────────────────────────────────────────────────────
// No --delete, like the workflow: whatever was placed on the server by hand stays.
// --partial so an interrupted transfer resumes instead of starting over.

const sshCommand = `ssh -p ${PORT} -o StrictHostKeyChecking=no -o ServerAliveInterval=15`;
const rsyncArgs = (dryRun) =>
	[
		'-rlptz',
		'--partial',
		'--stats',
		...(dryRun ? ['-n'] : []),
		'--exclude',
		'.git*',
		'-e',
		sshCommand,
		SRC,
		`${USER}@${HOST}:${REMOTE}`
	].filter(Boolean);

step(`what would travel to ${USER}@${HOST}:${REMOTE}`);
run('rsync', rsyncArgs(true));

if (has('--dry-run')) {
	console.log('\n✓ dry run only — nothing was uploaded.\n');
	process.exit(0);
}

if (!has('--yes')) {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	const answer = (await rl.question('\nUpload this to production? [y/N] ')).trim().toLowerCase();
	rl.close();

	if (answer !== 'y' && answer !== 'yes') {
		console.log('\nCancelled. Nothing was uploaded.\n');
		process.exit(0);
	}
}

step('uploading');
run('rsync', rsyncArgs(false));

// ── Verify ───────────────────────────────────────────────────────────────────
// A deploy is not done because rsync exited zero; it is done when the site answers.

step('verifying against the live site');

const status = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '-L', 'https://hubui.dev/en/'], {
	encoding: 'utf8'
}).stdout?.trim();

const sitemap = spawnSync('sh', ['-c', 'curl -s https://hubui.dev/sitemap.xml | grep -c "<loc>"'], {
	encoding: 'utf8'
}).stdout?.trim();

console.log(`  https://hubui.dev/en/ → ${status}`);
console.log(`  canonical URLs in the live sitemap → ${sitemap}`);

if (status !== '200') {
	fail(`the site answered ${status}. The upload finished, but something is wrong — check before walking away.`);
}

console.log('\n✓ deployed.\n');
