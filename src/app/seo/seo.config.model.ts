/**
 * Type definitions for the central SEO configuration.
 *
 * These describe the route metadata, static-page and library-definition shapes
 * consumed by `seo.config.ts`, the SEO service and the documentation routing.
 * The runtime constants and lookup tables remain in `seo.config.ts`.
 */
import type { LIBRARY_TABS } from './seo.config';

/** Supported documentation tab identifiers. */
export type LibraryTabSeoId = (typeof LIBRARY_TABS)[number];

/** Static page identifiers used by route metadata. */
export type StaticSeoPageId = 'home' | 'about' | 'tokens' | 'theming' | 'design_system' | 'i18n';

/** Library route identifiers used across routing and SEO helpers. */
export type LibrarySeoKey =
	| 'action-sheet'
	| 'avatar'
	| 'board'
	| 'badges'
	| 'breadcrumbs'
	| 'buttons'
	| 'calendar'
	| 'forms'
	| 'history'
	| 'icons'
	| 'installer'
	| 'loading'
	| 'metrics'
	| 'signature'
	| 'milestones'
	| 'modal'
	| 'nav'
	| 'paginable'
	| 'panels'
	| 'portal'
	| 'skeleton'
	| 'sortable'
	| 'stepper'
	| 'toast'
	| 'utils';

/** Route-level SEO metadata stored in Angular route data. */
export interface SeoRouteData {
	/** Whether the route describes a static page, a library landing page or the not-found catch-all. */
	readonly type: 'static' | 'library' | 'notFound';
	/** Static page identifier when `type` is `static`. */
	readonly pageId?: StaticSeoPageId;
	/** Library route identifier when `type` is `library`. */
	readonly libraryKey?: LibrarySeoKey;
}

/** Static page metadata used for non-library routes. */
export interface StaticSeoDefinition {
	/** Document title for the static page. */
	readonly title: string;
	/** Meta description for the static page. */
	readonly description: string;
}

/** Highlight card metadata. Icon stays structural; the copy lives in the `SEO.*` JSON keys. */
export interface LocalizedSeoHighlight {
	/** Font Awesome icon class used to illustrate the highlight. */
	readonly icon: string;
}

/**
 * Library metadata reused for quick links, breadcrumbs and structured data.
 * All translatable text now lives in `src/app/i18n/seo/<lang>.json` under `SEO.*`;
 * only structural fields remain here.
 */
export interface LibrarySeoDefinition {
	/** Stable library identifier. */
	readonly key: LibrarySeoKey;
	/** Route segment under which the library documentation is mounted. */
	readonly route: string;
	/** Published NPM package name for the library. */
	readonly packageName: string;
	/** Structural highlight cards (icons only) shown on the landing page. */
	readonly localizedHighlights: readonly LocalizedSeoHighlight[];
	/** Related library identifiers surfaced as cross-links. */
	readonly related: readonly LibrarySeoKey[];
}
