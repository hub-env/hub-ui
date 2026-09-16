/**
 * Sitemap + llms.txt generator for the Hub UI documentation site.
 *
 * Runs after `ng build` (wired as the npm `postbuild` hook). It walks the
 * prerendered output and derives the discovery artifacts from what actually
 * exists, so new libraries, tabs or locales are covered automatically and
 * noindex/shell pages are never leaked:
 *
 *   - `sitemap.xml`     — every indexable URL with full hreflang alternates
 *                         and a truthful `<lastmod>` where one exists.
 *   - `llms.txt`        — concise machine-readable index of the library ecosystem.
 *   - `llms-full.txt`   — extended index with real per-library documentation
 *                         content (description, intro, overview, highlights,
 *                         latest release) sourced from the English SEO copy.
 *
 * Inclusion rule (app-driven, not guessed): a page is indexable only when its
 * prerendered HTML declares BOTH a `<meta name="robots">` containing `index`
 * (and not `noindex`) AND a `<link rel="canonical">`. Library shell/redirect
 * pages emit neither, so they are skipped.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Public production origin. Mirror of SITE_URL in src/app/seo/seo.config.ts. */
const SITE_URL = 'https://hubui.dev';

/** Default locale, used as the hreflang `x-default` target. */
const DEFAULT_LANG = 'en';

/** Supported locales. Mirror of SUPPORTED_APP_LANGS in src/app/services/app-i18n.model.ts. */
const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de', 'zh', 'ru', 'ar', 'ja'];

/**
 * hreflang attribute value per locale where it differs from the URL code.
 * Mirror of HREFLANG_BY_LANG in src/app/services/seo.service.model.ts: the
 * site's Chinese content is Simplified, so BCP 47 wants `zh-Hans` even though
 * the URL segment stays `/zh/`.
 */
const HREFLANG_BY_LANG = { zh: 'zh-Hans' };

/**
 * Central Hub UI repository surfaced in llms.txt, where the site, the workspace and
 * the issue tracker live. Keep in sync with REPOSITORY_URL in src/app/seo/seo.config.ts.
 */
const REPOSITORY_URL = 'https://github.com/hub-env/hub-ui';

/** Prerendered browser output directory produced by `ng build`. */
const BROWSER_DIR = 'dist/ng-hub-ui/browser';

/** Library workspace directory; each subdirectory is one npm package + SEO route. */
const PROJECTS_DIR = 'projects';

/** English SEO copy consumed by the llms-full.txt builder. */
const EN_SEO_PATH = 'src/app/i18n/seo/en.json';

/** ISO date of the current build, used as the home page `<lastmod>`. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/**
 * Recursively collects every `index.html` file under a directory.
 *
 * @param {string} dir Directory to walk.
 * @returns {Promise<string[]>} Absolute-from-cwd paths of the found files.
 */
async function collectIndexHtml(dir) {
	const found = [];
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			found.push(...(await collectIndexHtml(fullPath)));
		} else if (entry.name === 'index.html') {
			found.push(fullPath);
		}
	}

	return found;
}

/**
 * Extracts the first attribute value of a matching tag from an HTML string.
 *
 * @param {string} html Raw HTML.
 * @param {RegExp} pattern Pattern with a single capturing group.
 * @returns {string | null} Captured value, or null when absent.
 */
function extract(html, pattern) {
	const match = html.match(pattern);
	return match ? match[1] : null;
}

/**
 * Decodes the handful of HTML entities that appear in prerendered `<title>` and
 * meta-description text, so the plain-text llms files read naturally.
 *
 * @param {string} value Possibly entity-encoded text.
 * @returns {string} Decoded text.
 */
function decodeEntities(value) {
	return value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&amp;/g, '&');
}

/** Maximum head-release change bullets surfaced per library in llms-full.txt. */
const MAX_CHANGELOG_BULLETS = 6;

/**
 * Reads the head entry (`## [x.y.z] - YYYY-MM-DD`) of every library changelog,
 * including its top-level change bullets.
 *
 * The prerendered files' mtime is meaningless (it is the build time), so the
 * changelog date is the only truthful `<lastmod>` source for library pages.
 * Mirrors the parsing done by scripts/generate-library-versions.mjs but stays
 * self-contained so this script keeps working from a clean checkout.
 *
 * @returns {Map<string, { version: string, date: string, changes: string[] }>} Library route -> head release.
 */
function collectChangelogHeads() {
	const heads = new Map();

	for (const dir of readdirSync(PROJECTS_DIR).sort()) {
		const changelogPath = join(PROJECTS_DIR, dir, 'CHANGELOG.md');
		if (!existsSync(changelogPath)) {
			continue;
		}

		const changelog = readFileSync(changelogPath, 'utf8');
		const head = changelog.match(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})/m);
		if (!head) {
			continue;
		}

		// Body of the head entry: from its heading up to the next `## [` heading.
		const bodyStart = head.index + head[0].length;
		const nextEntry = changelog.slice(bodyStart).search(/^## \[/m);
		const body = changelog.slice(bodyStart, nextEntry === -1 ? undefined : bodyStart + nextEntry);
		const changes = body
			.split('\n')
			.filter((line) => line.startsWith('- '))
			.map((line) => line.slice(2).trim())
			.slice(0, MAX_CHANGELOG_BULLETS);

		heads.set(dir, { version: head[1], date: head[2], changes });
	}

	return heads;
}

/**
 * Loads the English SEO copy (headline, description, intro, overview,
 * highlights, use cases per library) used to give llms-full.txt real substance.
 *
 * @returns {Record<string, any>} The `SEO` object of src/app/i18n/seo/en.json.
 */
function loadEnglishSeoContent() {
	return JSON.parse(readFileSync(EN_SEO_PATH, 'utf8')).SEO;
}

/**
 * Resolves the truthful `<lastmod>` date for a content path, if any.
 *
 * - Library pages inherit the head date of their library changelog.
 * - The home page carries the build date (its content is regenerated per build).
 * - Every other page has no verifiable modification date, so none is emitted.
 *
 * @param {string} contentPath Language-neutral content path (e.g. `/calendar/api`).
 * @param {Map<string, { version: string, date: string, changes: string[] }>} changelogHeads Library route -> head release.
 * @returns {string | null} ISO date, or null when no truthful date exists.
 */
function resolveLastmod(contentPath, changelogHeads) {
	if (contentPath === '/') {
		return BUILD_DATE;
	}

	const [firstSegment] = contentPath.split('/').filter(Boolean);
	return changelogHeads.get(firstSegment)?.date ?? null;
}

/**
 * Reads a prerendered page and resolves it to an indexable entry.
 *
 * @param {string} file Path to an `index.html` file.
 * @returns {Promise<{ url: string, lang: string, contentPath: string, title: string, description: string } | null>}
 *          Indexable entry, or null when the page must be excluded.
 */
async function resolveEntry(file) {
	const html = await readFile(file, 'utf8');

	const robots = extract(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
	const canonical = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);

	// Shell/redirect pages emit neither robots nor canonical — skip them.
	if (!robots || !canonical || /noindex/i.test(robots)) {
		return null;
	}

	const { pathname } = new URL(canonical);
	const segments = pathname.split('/').filter(Boolean);
	const lang = segments[0];

	if (!SUPPORTED_LANGS.includes(lang)) {
		return null;
	}

	const contentPath = '/' + segments.slice(1).join('/');
	const title = (extract(html, /<title>([^<]*)<\/title>/i) ?? '').trim();
	const description = (extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i) ?? '').trim();

	return { url: canonical, lang, contentPath, title, description };
}

/**
 * Builds the hreflang-annotated sitemap XML.
 *
 * @param {Map<string, Map<string, string>>} groups Content path -> (lang -> url).
 * @param {Map<string, { version: string, date: string, changes: string[] }>} changelogHeads Library route -> head release.
 * @returns {string} Sitemap XML document.
 */
function buildSitemap(groups, changelogHeads) {
	let body = '';

	for (const contentPath of [...groups.keys()].sort()) {
		const byLang = groups.get(contentPath);
		const xDefault = byLang.get(DEFAULT_LANG) ?? byLang.values().next().value;
		const lastmod = resolveLastmod(contentPath, changelogHeads);
		const lastmodLine = lastmod ? `\t\t<lastmod>${lastmod}</lastmod>\n` : '';

		const alternates = SUPPORTED_LANGS.filter((lang) => byLang.has(lang))
			.map(
				(lang) =>
					`\t\t<xhtml:link rel="alternate" hreflang="${HREFLANG_BY_LANG[lang] ?? lang}" href="${byLang.get(lang)}"/>`
			)
			.join('\n');
		const xDefaultLink = `\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}"/>`;

		for (const lang of SUPPORTED_LANGS) {
			if (!byLang.has(lang)) {
				continue;
			}

			body += `\t<url>\n\t\t<loc>${byLang.get(lang)}</loc>\n${lastmodLine}${alternates}\n${xDefaultLink}\n\t</url>\n`;
		}
	}

	return (
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
		body +
		'</urlset>\n'
	);
}

/**
 * Builds the concise `llms.txt` index from the English overview and API pages.
 *
 * @param {Array<{ url: string, contentPath: string, title: string, description: string }>} overviews English overview entries.
 * @param {Array<{ url: string, contentPath: string, title: string, description: string }>} apiEntries English /api entries.
 * @returns {string} llms.txt document.
 */
function buildLlms(overviews, apiEntries) {
	const lines = [
		'# Hub UI — Angular Component Library for Standalone Apps',
		'',
		'> Hub UI (ng-hub-ui) is an open-source ecosystem of standalone, signal-friendly,',
		'> CSS-variable-driven Angular UI libraries, each published individually on NPM',
		'> under the ng-hub-ui-* prefix.',
		`> Docs: ${SITE_URL} | Repo: ${REPOSITORY_URL} | License: MIT`,
		'',
		'## Component Libraries',
		''
	];

	for (const entry of overviews) {
		const label = decodeEntities(entry.title.split('|')[0].trim()) || entry.contentPath;
		lines.push(`- [${label}](${entry.url}): ${decodeEntities(entry.description)}`);
	}

	lines.push('', '## API References', '');

	for (const entry of apiEntries) {
		// API titles read `<descriptive name> | <package> API`; the package half
		// is the clearest link label ("ng-hub-ui-calendar API").
		const label = decodeEntities((entry.title.split('|')[1] ?? entry.title).trim()) || entry.contentPath;
		lines.push(`- [${label}](${entry.url}): ${decodeEntities(entry.description)}`);
	}

	lines.push('');

	return lines.join('\n');
}

/**
 * Builds the extended `llms-full.txt` index. Library sections inline the real
 * English documentation copy (meta description, intro, overview, highlights,
 * use cases and latest release) so LLM consumers get substance, not one-liners;
 * non-library pages keep the compact title + URL + description form.
 *
 * @param {Array<{ url: string, contentPath: string, title: string, description: string }>} entries English entries.
 * @param {Record<string, any>} librarySeoContent `SEO.LIBRARY` object from the English i18n copy.
 * @param {Map<string, { version: string, date: string, changes: string[] }>} changelogHeads Library route -> head release.
 * @returns {string} llms-full.txt document.
 */
function buildLlmsFull(entries, librarySeoContent, changelogHeads) {
	const lines = [
		'# Hub UI — Full documentation index (English)',
		'',
		`> Generated from the prerendered site. Other locales mirror these paths under /{lang}/.`,
		`> Docs: ${SITE_URL} | Repo: ${REPOSITORY_URL} | License: MIT`,
		''
	];

	/** Entries grouped by their first path segment (library route or static page). */
	const byRoute = new Map();
	for (const entry of entries) {
		const [firstSegment] = entry.contentPath.split('/').filter(Boolean);
		const route = firstSegment ?? '/';
		if (!byRoute.has(route)) {
			byRoute.set(route, []);
		}
		byRoute.get(route).push(entry);
	}

	for (const route of [...byRoute.keys()].sort()) {
		const routeEntries = byRoute.get(route);
		const copy = librarySeoContent[route.toUpperCase()];

		if (!copy) {
			// Static page (home, about, tokens, theming, design-system...).
			for (const entry of routeEntries) {
				const label = decodeEntities(entry.title.split('|')[0].trim()) || entry.contentPath;
				lines.push(`## ${label}`, entry.url, decodeEntities(entry.description), '');
			}
			continue;
		}

		const packageName = `ng-hub-ui-${route}`;
		const overview = routeEntries.find((entry) => /\/overview$/.test(entry.contentPath));
		const descriptiveName = (copy.HEADLINE ?? packageName).split('|')[0].trim();
		const head = changelogHeads.get(route);

		lines.push(`## ${packageName} — ${descriptiveName}`);
		for (const entry of routeEntries) {
			const tab = entry.contentPath.split('/').filter(Boolean)[1] ?? 'overview';
			lines.push(`- ${tab}: ${entry.url}`);
		}
		lines.push(`- npm: https://www.npmjs.com/package/${packageName}`);
		if (head) {
			lines.push(`- Latest release: ${head.version} (${head.date})`);
		}
		lines.push('');

		if (overview?.description) {
			lines.push(decodeEntities(overview.description), '');
		}
		if (copy.INTRO) {
			lines.push(copy.INTRO, '');
		}
		if (copy.OVERVIEW) {
			lines.push(copy.OVERVIEW, '');
		}

		const highlights = Object.values(copy.HIGHLIGHT ?? {});
		if (highlights.length > 0) {
			lines.push('Key highlights:');
			for (const highlight of highlights) {
				lines.push(`- ${highlight.TITLE}: ${highlight.DESCRIPTION}`);
			}
			lines.push('');
		}

		const useCases = Object.values(copy.USE_CASE ?? {});
		if (useCases.length > 0) {
			lines.push(`Common use cases: ${useCases.join('; ')}.`, '');
		}

		if (head && head.changes.length > 0) {
			lines.push(`What changed in ${head.version} (${head.date}):`);
			for (const change of head.changes) {
				lines.push(`- ${change}`);
			}
			lines.push('');
		}
	}

	return lines.join('\n');
}

/**
 * Generates the discovery artifacts from the prerendered output.
 */
async function main() {
	const files = await collectIndexHtml(BROWSER_DIR);
	const resolved = (await Promise.all(files.map(resolveEntry))).filter(Boolean);
	const changelogHeads = collectChangelogHeads();
	const librarySeoContent = loadEnglishSeoContent().LIBRARY ?? {};

	/** @type {Map<string, Map<string, string>>} */
	const groups = new Map();
	for (const entry of resolved) {
		if (!groups.has(entry.contentPath)) {
			groups.set(entry.contentPath, new Map());
		}
		groups.get(entry.contentPath).set(entry.lang, entry.url);
	}

	const englishEntries = resolved
		.filter((entry) => entry.lang === DEFAULT_LANG)
		.sort((a, b) => a.contentPath.localeCompare(b.contentPath));
	const englishOverviews = englishEntries.filter((entry) => /\/overview$/.test(entry.contentPath));
	const englishApis = englishEntries.filter((entry) => /\/api$/.test(entry.contentPath));

	await writeFile(join(BROWSER_DIR, 'sitemap.xml'), buildSitemap(groups, changelogHeads), 'utf8');
	await writeFile(join(BROWSER_DIR, 'llms.txt'), buildLlms(englishOverviews, englishApis), 'utf8');
	await writeFile(join(BROWSER_DIR, 'llms-full.txt'), buildLlmsFull(englishEntries, librarySeoContent, changelogHeads), 'utf8');

	console.log(
		`[sitemap] ${resolved.length} indexable URLs across ${groups.size} content paths ` +
			`(${files.length - resolved.length} non-indexable pages skipped).`
	);
	console.log(
		`[llms] ${englishOverviews.length} libraries and ${englishApis.length} API references indexed in llms.txt; ` +
			`${englishEntries.length} URLs in llms-full.txt.`
	);
}

main().catch((error) => {
	console.error('[generate-sitemap] failed:', error);
	process.exit(1);
});
