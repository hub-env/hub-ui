/**
 * Type definitions for the design token catalogue.
 *
 * These describe the shape of the token entries and groups rendered on the
 * tokens documentation page. The actual token datasets live in `tokens.data.ts`.
 */

/**
 * A single design token: its custom-property name and the raw declared value.
 */
export interface TokenEntry {
	/** Full custom-property name, e.g. `--hub-ref-color-blue-500`. */
	name: string;
	/** Raw value as declared in the default `:root` block. */
	value: string;
}

/**
 * A named collection of related tokens, used to group component tokens by their
 * prefix segment (e.g. `input`, `select`, `slider`).
 */
export interface TokenGroup {
	/** Human-readable group title (the prefix segment after `--hub-`). */
	title: string;
	/** Tokens that belong to this group. */
	tokens: TokenEntry[];
}

/**
 * A monorepo library that declares its own component tokens (`--hub-{prefix}-*`),
 * with a link to its documentation page. Derived from `projects/**` and the
 * `createLibraryRoute(...)` calls in the app routes.
 */
export interface TokenLibrary {
	/** Library folder/short name, e.g. `forms`. */
	name: string;
	/** Documentation route, e.g. `/forms` (empty when no route exists). */
	route: string;
	/** Canonical component token prefixes the library declares, e.g. `['form', 'input']`. */
	prefixes: string[];
	/** Number of distinct component tokens the library declares. */
	count: number;
}
