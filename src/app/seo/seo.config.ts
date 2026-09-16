/**
 * Central SEO configuration for the Hub UI documentation site.
 * Update the public site URL before deploying to the final production domain.
 */

export const SITE_URL = 'https://hubui.dev';

/** Default language used for prerendered output when no user preference exists. */
export const DEFAULT_SEO_LANGUAGE = 'en';

/** Generic site name used across titles and structured data. */
export const SITE_NAME = 'Hub UI';

/**
 * Central Hub UI repository: the documentation site, the development workspace and
 * the issue tracker for every package. Every "star" CTA and the organization
 * `sameAs` point here so stars and links accumulate on a single repository.
 */
export const REPOSITORY_URL = 'https://github.com/hub-env/hub-ui';

/**
 * Author's GitHub profile. Kept apart from REPOSITORY_URL because the `Person`
 * entity in the structured data identifies the author, not the project.
 */
export const AUTHOR_GITHUB_URL = 'https://github.com/carlos-morcillo';

/**
 * Builds the public repository URL of a library from its NPM package name, which
 * matches its repository name one-to-one.
 *
 * @param packageName Published NPM package, e.g. `ng-hub-ui-board`.
 * @returns Repository URL for that library.
 */
export function libraryRepositoryUrl(packageName: string): string {
	return `https://github.com/hub-env/${packageName}`;
}

/** Author personal website, reused as a structured-data identity signal. */
export const AUTHOR_URL = 'https://www.carlosmorcillo.com';

/**
 * Author consulting pages, linked from the shell footer. Spanish readers get
 * the Spanish page; every other locale gets the English one.
 */
export const CONSULTING_URL_EN = 'https://www.carlosmorcillo.com/en/services/';
export const CONSULTING_URL_ES = 'https://www.carlosmorcillo.com/servicios/';

/** SPDX license URL shared by every MIT-licensed package. */
export const LICENSE_URL = 'https://opensource.org/licenses/MIT';

/** Stable JSON-LD `@id` for the site-wide WebSite entity. */
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Stable JSON-LD `@id` for the publishing Organization entity. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Stable JSON-LD `@id` for the author Person entity, shared across pages. */
export const PERSON_ID = `${SITE_URL}/#person-carlos`;

/** Open Graph / Twitter social-card image (1200x630) used across pages. */
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';

/** Route tabs that should remain indexable in library documentation pages. */
export const INDEXABLE_LIBRARY_TABS = ['overview', 'api', 'styles'] as const;

/**
 * Locales kept online for readers but withheld from search.
 *
 * These translations earn impressions and no clicks — over 90 days `ar` and `fr`
 * returned zero between them from positions 50-68 — while consuming the crawl
 * budget that left newly published English pages unindexed for weeks. They stay
 * reachable from the language switcher because they still serve a purpose: the
 * Arabic locale is the site's live demonstration of RTL support.
 *
 * A locale listed here is marked `noindex` and dropped from every `hreflang`
 * cluster. Both must happen together: `hreflang` pointing at a `noindex` page is
 * a contradiction Google may resolve by discarding the whole cluster. The
 * sitemap needs no change — it is built from the prerendered output and skips
 * anything carrying the directive.
 *
 * Reversible: remove a code here and its pages return to the index on the next
 * deploy. `ja` and `zh` are deliberately absent pending the 2026-09-05 review.
 */
export const NOINDEX_LANGS: ReadonlySet<string> = new Set(['ar', 'fr']);

/** Route tabs available in the library documentation experience. */
export const LIBRARY_TABS = ['overview', 'api', 'styles', 'examples', 'playground'] as const;

// Re-export SEO config types so existing imports from this module keep working.
export type {
	LibrarySeoDefinition,
	LibrarySeoKey,
	LibraryTabSeoId,
	LocalizedSeoHighlight,
	SeoRouteData,
	StaticSeoDefinition,
	StaticSeoPageId
} from './seo.config.model';

import type {
	LibrarySeoDefinition,
	LibrarySeoKey,
	LibraryTabSeoId,
	StaticSeoDefinition,
	StaticSeoPageId
} from './seo.config.model';

/**
 * Locale-neutral singleton `@id` for a library's SoftwareApplication entity.
 * One npm package must be ONE entity, not eight per-locale ones.
 *
 * @param route Library route segment (== projects/ directory).
 * @returns Stable absolute identifier.
 */
export const librarySoftwareId = (route: string): string => `${SITE_URL}/#software-${route}`;

/**
 * Locale-neutral singleton `@id` for a library's SoftwareSourceCode entity.
 *
 * @param route Library route segment.
 * @returns Stable absolute identifier.
 */
export const librarySourceCodeId = (route: string): string => `${SITE_URL}/#sourcecode-${route}`;

/** Static pages that should always be indexable. */
export const STATIC_SEO_PAGES: Record<StaticSeoPageId, StaticSeoDefinition> = {
	home: {
		title: 'Angular Component Library for Standalone Apps | Hub UI',
		description:
			'Reusable Angular UI components with standalone support, Angular Signals-friendly APIs, CSS variables, accessibility, examples and NPM packages for modals, tables, navigation, calendar and more.'
	},
	about: {
		title: 'Carlos Morcillo | Angular UI Libraries & Design Systems',
		description:
			'Carlos Morcillo builds Angular component libraries, design systems and developer tooling with a focus on accessibility, reusable architecture and production-ready documentation.'
	},
	tokens: {
		title: 'Angular Design Tokens Reference | Hub UI',
		description:
			'Complete --hub-* design token reference for ng-hub-ui: color, typography, spacing, radius and shadow variables with light and dark values.'
	},
	theming: {
		title: 'Theming Angular Components with CSS Variables | Hub UI',
		description:
			'Theme ng-hub-ui components with CSS variables: accent colors, dark mode, per-component tokens and ready-made themes — no Sass rebuild required.'
	},
	design_system: {
		title: 'Design System Guide for Angular Apps | Hub UI',
		description:
			'The ng-hub-ui design system: reference and system tokens, native CSS reset, Bootstrap-compatible utilities and a theming architecture for Angular apps.'
	},
	i18n: {
		title: 'Translating Angular Components | Hub UI i18n',
		description:
			'Translate ng-hub-ui components with your existing Angular i18n library: transloco, ngx-translate or your own, through one adapter and the HUBUI key namespace.'
	}
};

/**
 * Legal/utility pages that must stay out of the search index. Keyed by the
 * language-neutral content path (without the leading language prefix).
 */
export const NOINDEX_UTILITY_PAGES: Record<string, StaticSeoDefinition> = {
	'/privacy': {
		title: 'Privacy Policy | Hub UI',
		description: 'Privacy policy for the Hub UI documentation site.'
	},
	'/cookies': {
		title: 'Cookie Policy | Hub UI',
		description: 'Cookie policy for the Hub UI documentation site.'
	}
};

/** Library-specific metadata used by the documentation landing pages. */
export const LIBRARY_SEO: Record<LibrarySeoKey, LibrarySeoDefinition> = {
	forms: {
		key: 'forms',
		route: 'forms',
		packageName: 'ng-hub-ui-forms',
		localizedHighlights: [
			{ icon: 'fa-solid fa-wand-magic-sparkles' },
			{ icon: 'fa-solid fa-list-check' },
			{ icon: 'fa-solid fa-calendar-days' }
		],
		related: ['utils', 'modal', 'calendar']
	},
	icons: {
		key: 'icons',
		route: 'icons',
		packageName: 'ng-hub-ui-icons',
		localizedHighlights: [{ icon: 'fa-solid fa-shapes' }, { icon: 'fa-solid fa-feather' }, { icon: 'fa-solid fa-palette' }],
		related: ['buttons', 'badges', 'nav']
	},
	panels: {
		key: 'panels',
		route: 'panels',
		packageName: 'ng-hub-ui-panels',
		localizedHighlights: [
			{ icon: 'fa-solid fa-table-columns' },
			{ icon: 'fa-solid fa-route' },
			{ icon: 'fa-solid fa-universal-access' }
		],
		related: ['nav', 'stepper']
	},
	metrics: {
		key: 'metrics',
		route: 'metrics',
		packageName: 'ng-hub-ui-metrics',
		localizedHighlights: [
			{ icon: 'fa-solid fa-bars-progress' },
			{ icon: 'fa-solid fa-gauge-high' },
			{ icon: 'fa-solid fa-circle-notch' }
		],
		related: ['skeleton', 'badges', 'stepper']
	},
	signature: {
		key: 'signature',
		route: 'signature',
		packageName: 'ng-hub-ui-signature',
		localizedHighlights: [{ icon: 'fa-solid fa-signature' }, { icon: 'fa-solid fa-pen' }],
		related: ['forms', 'utils']
	},
	milestones: {
		key: 'milestones',
		route: 'milestones',
		packageName: 'ng-hub-ui-milestones',
		localizedHighlights: [
			{ icon: 'fa-solid fa-arrows-up-down-left-right' },
			{ icon: 'fa-solid fa-circle-nodes' },
			{ icon: 'fa-solid fa-palette' }
		],
		related: ['stepper', 'nav', 'panels']
	},
	avatar: {
		key: 'avatar',
		route: 'avatar',
		packageName: 'ng-hub-ui-avatar',
		localizedHighlights: [{ icon: 'fa-solid fa-image' }, { icon: 'fa-solid fa-circle-dot' }, { icon: 'fa-solid fa-users' }],
		related: ['breadcrumbs', 'utils', 'nav']
	},
	board: {
		key: 'board',
		route: 'board',
		packageName: 'ng-hub-ui-board',
		localizedHighlights: [
			{ icon: 'fa-solid fa-up-down-left-right' },
			{ icon: 'fa-solid fa-id-card' },
			{ icon: 'fa-solid fa-table-columns' }
		],
		related: ['sortable', 'modal', 'portal']
	},
	badges: {
		key: 'badges',
		route: 'badges',
		packageName: 'ng-hub-ui-badges',
		localizedHighlights: [
			{ icon: 'fa-solid fa-tags' },
			{ icon: 'fa-solid fa-circle-dot' },
			{ icon: 'fa-solid fa-palette' }
		],
		related: ['avatar', 'nav', 'buttons']
	},
	breadcrumbs: {
		key: 'breadcrumbs',
		route: 'breadcrumbs',
		packageName: 'ng-hub-ui-breadcrumbs',
		localizedHighlights: [
			{ icon: 'fa-solid fa-route' },
			{ icon: 'fa-solid fa-code' },
			{ icon: 'fa-solid fa-mobile-screen' }
		],
		related: ['nav', 'utils', 'portal']
	},
	calendar: {
		key: 'calendar',
		route: 'calendar',
		packageName: 'ng-hub-ui-calendar',
		localizedHighlights: [
			{ icon: 'fa-solid fa-calendar-days' },
			{ icon: 'fa-solid fa-calendar-check' },
			{ icon: 'fa-solid fa-hand' }
		],
		related: ['modal', 'portal', 'paginable']
	},
	history: {
		key: 'history',
		route: 'history',
		packageName: 'ng-hub-ui-history',
		localizedHighlights: [
			{ icon: 'fa-solid fa-clock-rotate-left' },
			{ icon: 'fa-solid fa-sliders' },
			{ icon: 'fa-solid fa-wave-square' }
		],
		related: ['sortable', 'utils', 'paginable']
	},
	'action-sheet': {
		key: 'action-sheet',
		route: 'action-sheet',
		packageName: 'ng-hub-ui-action-sheet',
		localizedHighlights: [
			{ icon: 'fa-solid fa-list-check' },
			{ icon: 'fa-solid fa-triangle-exclamation' },
			{ icon: 'fa-solid fa-universal-access' }
		],
		related: ['modal', 'portal', 'buttons']
	},
	installer: {
		key: 'installer',
		route: 'installer',
		packageName: 'ng-hub-ui',
		localizedHighlights: [
			{ icon: 'fa-solid fa-terminal' },
			{ icon: 'fa-solid fa-code' },
			{ icon: 'fa-solid fa-diagram-project' }
		],
		related: ['utils', 'forms', 'paginable']
	},
	loading: {
		key: 'loading',
		route: 'loading',
		packageName: 'ng-hub-ui-loading',
		localizedHighlights: [
			{ icon: 'fa-solid fa-spinner' },
			{ icon: 'fa-solid fa-layer-group' },
			{ icon: 'fa-solid fa-palette' }
		],
		related: ['skeleton', 'metrics']
	},
	modal: {
		key: 'modal',
		route: 'modal',
		packageName: 'ng-hub-ui-modal',
		localizedHighlights: [
			{ icon: 'fa-solid fa-layer-group' },
			{ icon: 'fa-solid fa-universal-access' },
			{ icon: 'fa-solid fa-code' }
		],
		related: ['portal', 'utils']
	},
	nav: {
		key: 'nav',
		route: 'nav',
		packageName: 'ng-hub-ui-nav',
		localizedHighlights: [
			{ icon: 'fa-solid fa-compass' },
			{ icon: 'fa-solid fa-sitemap' },
			{ icon: 'fa-solid fa-mobile-screen' }
		],
		related: ['breadcrumbs', 'portal', 'stepper']
	},
	paginable: {
		key: 'paginable',
		route: 'paginable',
		packageName: 'ng-hub-ui-paginable',
		localizedHighlights: [
			{ icon: 'fa-solid fa-server' },
			{ icon: 'fa-solid fa-filter' },
			{ icon: 'fa-solid fa-table-list' }
		],
		related: ['sortable', 'utils', 'modal']
	},
	portal: {
		key: 'portal',
		route: 'portal',
		packageName: 'ng-hub-ui-portal',
		localizedHighlights: [
			{ icon: 'fa-solid fa-up-right-from-square' },
			{ icon: 'fa-solid fa-arrows-to-circle' },
			{ icon: 'fa-solid fa-layer-group' }
		],
		related: ['modal', 'nav', 'utils']
	},
	skeleton: {
		key: 'skeleton',
		route: 'skeleton',
		packageName: 'ng-hub-ui-skeleton',
		localizedHighlights: [
			{ icon: 'fa-solid fa-layer-group' },
			{ icon: 'fa-solid fa-terminal' },
			{ icon: 'fa-solid fa-mobile-screen' }
		],
		related: ['paginable', 'board', 'portal']
	},
	sortable: {
		key: 'sortable',
		route: 'sortable',
		packageName: 'ng-hub-ui-sortable',
		localizedHighlights: [
			{ icon: 'fa-solid fa-arrow-down-wide-short' },
			{ icon: 'fa-solid fa-list-check' },
			{ icon: 'fa-solid fa-diagram-project' }
		],
		related: ['paginable', 'board', 'history']
	},
	stepper: {
		key: 'stepper',
		route: 'stepper',
		packageName: 'ng-hub-ui-stepper',
		localizedHighlights: [
			{ icon: 'fa-solid fa-shoe-prints' },
			{ icon: 'fa-solid fa-circle-check' },
			{ icon: 'fa-solid fa-swatchbook' }
		],
		related: ['modal', 'utils']
	},
	buttons: {
		key: 'buttons',
		route: 'buttons',
		packageName: 'ng-hub-ui-buttons',
		localizedHighlights: [
			{ icon: 'fa-solid fa-computer-mouse' },
			{ icon: 'fa-solid fa-layer-group' },
			{ icon: 'fa-solid fa-caret-down' }
		],
		related: ['modal', 'utils', 'portal']
	},
	toast: {
		key: 'toast',
		route: 'toast',
		packageName: 'ng-hub-ui-toast',
		localizedHighlights: [
			{ icon: 'fa-solid fa-bell' },
			{ icon: 'fa-solid fa-wave-square' },
			{ icon: 'fa-solid fa-palette' }
		],
		related: ['modal', 'portal', 'utils']
	},
	utils: {
		key: 'utils',
		route: 'utils',
		packageName: 'ng-hub-ui-utils',
		localizedHighlights: [
			{ icon: 'fa-solid fa-layer-group' },
			{ icon: 'fa-solid fa-keyboard' },
			{ icon: 'fa-solid fa-language' }
		],
		related: ['modal', 'portal', 'paginable']
	}
};

/** Tabs that should be indexed for library landing pages. */
export const INDEXABLE_LIBRARY_TAB_SET = new Set<LibraryTabSeoId>(INDEXABLE_LIBRARY_TABS);

/**
 * Returns a library SEO entry from its route key.
 *
 * @param key Library route identifier.
 * @returns Matching library metadata, if available.
 */
export function getLibrarySeoDefinition(key: string | null | undefined): LibrarySeoDefinition | null {
	if (!key) {
		return null;
	}

	return LIBRARY_SEO[key as LibrarySeoKey] ?? null;
}
