/**
 * IndexNow ping for the Hub UI documentation site.
 *
 * Runs after a deploy (the CI workflow calls it once the new build is live).
 * It reads the freshly generated sitemap from the prerendered output, extracts
 * every `<loc>` URL and submits them in a single batch to the IndexNow API so
 * participating search engines (Bing, Seznam, Naver, Yandex...) re-crawl the
 * changed pages immediately instead of waiting for the next scheduled crawl.
 *
 * Key ownership: IndexNow verifies the submitter by fetching `keyLocation`,
 * which must serve the key as plain text. That file lives in the repo at
 * `public/<key>.txt` (currently `public/5a03d253183602263647b96dbfb76056.txt`),
 * is copied into the build output as a static asset and is therefore served at
 * `https://hubui.dev/<key>.txt`. If the key is ever rotated, update KEY below
 * AND rename the public/ key file to match.
 *
 * Failure policy: this script must NEVER fail a deploy. Any error — missing
 * sitemap, network failure, non-2xx API response — logs a warning and exits 0.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Bare host of the production site, as required by the IndexNow payload. */
const HOST = 'hubui.dev';

/** IndexNow API key. Must match the `public/<key>.txt` key file content. */
const KEY = '5a03d253183602263647b96dbfb76056';

/** Public URL where search engines verify key ownership. */
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

/** Shared IndexNow endpoint (fans out to every participating engine). */
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Sitemap produced by scripts/generate-sitemap.mjs during postbuild. */
const SITEMAP_PATH = join('dist/ng-hub-ui/browser', 'sitemap.xml');

/** IndexNow allows at most 10,000 URLs per submission. */
const MAX_URLS = 10000;

/**
 * Extracts every `<loc>` URL from a sitemap XML document.
 *
 * @param {string} xml Raw sitemap XML.
 * @returns {string[]} Deduplicated URL list in document order.
 */
function extractUrls(xml) {
	const urls = [];
	for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
		urls.push(match[1].trim());
	}
	return [...new Set(urls)];
}

/**
 * Reads the built sitemap and submits its URL list to IndexNow.
 * Never throws: every failure path warns and resolves normally.
 */
async function main() {
	let xml;
	try {
		xml = await readFile(SITEMAP_PATH, 'utf8');
	} catch (error) {
		console.warn(`[indexnow] sitemap not found at ${SITEMAP_PATH} — skipping ping (${error.message}).`);
		return;
	}

	const urlList = extractUrls(xml).slice(0, MAX_URLS);
	if (urlList.length === 0) {
		console.warn('[indexnow] sitemap contains no <loc> URLs — skipping ping.');
		return;
	}

	try {
		const response = await fetch(INDEXNOW_ENDPOINT, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' },
			body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList })
		});

		if (response.ok) {
			console.log(`[indexnow] submitted ${urlList.length} URLs for ${HOST} (HTTP ${response.status}).`);
		} else {
			console.warn(`[indexnow] API answered HTTP ${response.status} ${response.statusText} — continuing anyway.`);
		}
	} catch (error) {
		console.warn(`[indexnow] network error while pinging — continuing anyway (${error.message}).`);
	}
}

main().catch((error) => {
	// Belt and braces: even an unexpected bug must not break the deploy.
	console.warn(`[indexnow] unexpected error — continuing anyway (${error.message}).`);
});
