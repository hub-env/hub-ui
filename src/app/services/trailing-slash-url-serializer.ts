import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Splits a serialized URL into its path and the query/fragment tail, so the
 * trailing slash is only ever applied to the path.
 *
 * @param url Serialized URL, e.g. `/en/paginable/overview?tab=1#api`.
 * @returns Tuple of path and the remainder (empty when there is none).
 */
function splitPath(url: string): [string, string] {
	const boundary = url.search(/[?#]/);
	return boundary === -1 ? [url, ''] : [url.slice(0, boundary), url.slice(boundary)];
}

/**
 * URL serializer that emits the canonical trailing-slash form of every route.
 *
 * The server answers `/en/paginable/overview/` with a 200 and 301-redirects the
 * slashless variant. Angular's `DefaultUrlSerializer` emits the slashless one,
 * so every `routerLink` in the app rendered an `href` pointing at a redirect —
 * Search Console then indexed both variants and split each page's signals
 * between them (`/en` 582 impressions vs `/en/` 423, and the same on every
 * library page).
 *
 * Appending the slash in `localizePath` does not work: the serializer strips it
 * again on the way out. It has to happen here, at serialization time.
 *
 * `parse` mirrors the transform because Angular's parser would read the trailing
 * slash as an extra empty segment and fail to match the route. Stripping it
 * before delegating keeps parse/serialize a stable round-trip.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
	/**
	 * Parses a URL, tolerating the trailing slash this serializer emits.
	 *
	 * @param url URL to parse, with or without a trailing slash.
	 * @returns Parsed URL tree.
	 */
	override parse(url: string): UrlTree {
		const [path, tail] = splitPath(url);
		const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;

		return super.parse(`${normalized}${tail}`);
	}

	/**
	 * Serializes a URL tree in its canonical trailing-slash form.
	 *
	 * @param tree URL tree to serialize.
	 * @returns Serialized URL whose path ends with `/`.
	 */
	override serialize(tree: UrlTree): string {
		const [path, tail] = splitPath(super.serialize(tree));
		const normalized = path.endsWith('/') ? path : `${path}/`;

		return `${normalized}${tail}`;
	}
}
