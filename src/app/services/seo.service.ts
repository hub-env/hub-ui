import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppI18nService } from './app-i18n.service';
import {
	AUTHOR_GITHUB_URL,
	AUTHOR_URL,
	DEFAULT_OG_IMAGE_PATH,
	DEFAULT_SEO_LANGUAGE,
	getLibrarySeoDefinition,
	INDEXABLE_LIBRARY_TAB_SET,
	LIBRARY_TABS,
	LICENSE_URL,
	libraryRepositoryUrl,
	librarySoftwareId,
	librarySourceCodeId,
	NOINDEX_LANGS,
	NOINDEX_UTILITY_PAGES,
	ORGANIZATION_ID,
	PERSON_ID,
	REPOSITORY_URL,
	SITE_NAME,
	SITE_URL,
	STATIC_SEO_PAGES,
	WEBSITE_ID,
	type LibraryTabSeoId,
	type SeoRouteData
} from '../seo/seo.config';
import { DEFAULT_APP_LANG, SUPPORTED_APP_LANGS, type AppLang } from './app-i18n.service';
import { LIBRARY_LAST_MODIFIED, LIBRARY_VERSIONS } from '../seo/library-versions.generated';
import { LIBRARY_SYMBOLS } from '../seo/library-symbols.generated';
import { THEMEABLE_LIBRARY_ROUTES } from '../seo/theming-surface.generated';

/**
 * Character budget for a meta description before Google truncates it. The /api
 * description packs as many symbol names as fit under this ceiling.
 */
const MAX_DESCRIPTION_LENGTH = 155;

/**
 * JSON-LD types that legitimately carry `inLanguage`/`url` (CreativeWork-derived).
 * Injecting them into `Organization`/`Person`/`BreadcrumbList` produced
 * out-of-domain properties flagged by validators.
 */
const LD_LOCALIZED_TYPES = new Set(['WebSite', 'SoftwareApplication', 'SoftwareSourceCode', 'TechArticle', 'ProfilePage']);
import {
	HREFLANG_BY_LANG,
	INDEX_ROBOTS_CONTENT,
	NOINDEX_ROBOTS_CONTENT,
	OG_LOCALE_BY_LANG,
	RTL_SEO_LANGS,
	type ResolvedSeoMetadata
} from './seo.service.model';

/**
 * Translation-key segment of a library.
 *
 * Uppercased, with hyphens folded into underscores: a route id like `action-sheet`
 * has to reach `SEO.LIBRARY.ACTION_SHEET`, which is the shape every other key in the
 * translation files uses.
 */
function seoKeySegment(key: string): string {
	return key.toUpperCase().replace(/-/g, '_');
}

/**
 * Global SEO service that synchronizes route state with page metadata,
 * canonical links and structured data.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
	private readonly router = inject(Router);
	private readonly title = inject(Title);
	private readonly meta = inject(Meta);
	private readonly document = inject(DOCUMENT);
	private readonly i18n = inject(AppI18nService);

	/**
	 * Reapplies SEO metadata on every successful navigation and whenever the
	 * active application language changes.
	 */
	constructor() {
		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe(() => this.applyCurrentRouteSeo());

		effect(() => {
			this.i18n.lang();
			this.applyCurrentRouteSeo();
		});
	}

	/**
	 * Applies SEO metadata to the current route snapshot.
	 */
	private applyCurrentRouteSeo(): void {
		const currentPath = this.normalizePath(this.router.url);
		const language = this.resolveSeoLanguage(currentPath);
		const localizedContentPath = this.stripLanguagePrefix(currentPath);
		const routeSnapshot = this.getDeepestSnapshot(this.router.routerState.snapshot.root);
		const routeSeo = routeSnapshot.data['seo'] as SeoRouteData | undefined;
		const canonicalPath = this.ensureTrailingSlash(currentPath);
		const resolved = this.resolveSeoDefinition(localizedContentPath, canonicalPath, routeSnapshot, routeSeo, language);
		const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
		const pageTitle = resolved.title;
		const pageDescription = resolved.description;
		// A locale withheld from search overrides whatever the page itself resolved:
		// every one of its URLs is noindex, which also keeps them out of the sitemap.
		const withheldLocale = NOINDEX_LANGS.has(language);
		const robots = resolved.noindex || withheldLocale ? NOINDEX_ROBOTS_CONTENT : INDEX_ROBOTS_CONTENT;
		const ogImage = new URL(DEFAULT_OG_IMAGE_PATH, SITE_URL).toString();

		this.title.setTitle(pageTitle);
		this.meta.updateTag({ name: 'description', content: pageDescription });
		this.meta.updateTag({ name: 'robots', content: robots });
		this.meta.updateTag({ property: 'og:title', content: pageTitle });
		this.meta.updateTag({ property: 'og:description', content: pageDescription });
		this.meta.updateTag({ property: 'og:type', content: resolved.ogType });
		this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
		this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
		this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE_BY_LANG[language] ?? 'en_US' });
		this.meta.updateTag({ property: 'og:image', content: ogImage });
		this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
		this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
		this.meta.updateTag({ name: 'twitter:description', content: pageDescription });
		this.meta.updateTag({ name: 'twitter:image', content: ogImage });

		this.ensureCanonicalLink(canonicalUrl);
		this.updateAlternateLanguageLinks(localizedContentPath);
		this.updateDocumentLanguage(language);
		this.updateStructuredData(resolved, canonicalUrl, language);
	}

	/**
	 * Resolves the metadata definition for the current route.
	 *
	 * @param localizedContentPath Route path without the leading language prefix.
	 * @param canonicalPath Canonical URL path including the language prefix.
	 * @param routeSnapshot Deepest activated route snapshot.
	 * @param routeSeo Optional route-level SEO metadata.
	 * @param language Active language used to localize the resolved metadata.
	 * @returns SEO metadata resolved for the current view.
	 */
	private resolveSeoDefinition(
		localizedContentPath: string,
		canonicalPath: string,
		routeSnapshot: ActivatedRouteSnapshot,
		routeSeo: SeoRouteData | undefined,
		language: AppLang
	): ResolvedSeoMetadata {
		const utilityPage = NOINDEX_UTILITY_PAGES[localizedContentPath];
		if (utilityPage) {
			return {
				title: utilityPage.title,
				description: utilityPage.description,
				noindex: true,
				ogType: 'website',
				structuredData: []
			};
		}

		if (localizedContentPath.startsWith('/api/') || localizedContentPath.startsWith('/docs/')) {
			return {
				title: `Developer Reference | ${SITE_NAME}`,
				description: 'Reference and placeholder content inside the Hub UI documentation workspace.',
				noindex: true,
				ogType: 'article',
				structuredData: []
			};
		}

		if (routeSeo?.type === 'notFound') {
			return {
				title: `Page Not Found | ${SITE_NAME}`,
				description: 'The requested page does not exist on the Hub UI documentation site.',
				noindex: true,
				ogType: 'website',
				structuredData: []
			};
		}

		if (routeSeo?.type === 'static' && routeSeo.pageId) {
			const pageKey = `SEO.PAGE.${routeSeo.pageId.toUpperCase()}`;
			const page = STATIC_SEO_PAGES[routeSeo.pageId];
			return {
				title: this.i18n.translateIn(language, `${pageKey}.TITLE`) || page.title,
				description: this.i18n.translateIn(language, `${pageKey}.DESCRIPTION`) || page.description,
				noindex: false,
				ogType: routeSeo.pageId === 'about' ? 'profile' : 'website',
				structuredData:
					routeSeo.pageId === 'about' ? [this.createAboutStructuredData()] : this.createHomeStructuredData(language)
			};
		}

		if (routeSeo?.type === 'library' && routeSeo.libraryKey) {
			const librarySeo = getLibrarySeoDefinition(routeSeo.libraryKey);
			const tab = this.resolveLibraryTab(routeSnapshot.routeConfig?.path ?? null);

			if (librarySeo) {
				const libKey = `SEO.LIBRARY.${seoKeySegment(librarySeo.key)}`;
				const headline = this.i18n.translateIn(language, `${libKey}.HEADLINE`);
				const description = this.i18n.translateIn(language, `${libKey}.DESCRIPTION`);
				const suffix = (tab: 'API' | 'STYLES' | 'EXAMPLES' | 'PLAYGROUND') =>
					this.i18n.translateIn(language, `SEO.TAB.${tab}.TITLE_SUFFIX`);
				const tabDescription = (tab: 'API' | 'STYLES' | 'EXAMPLES' | 'PLAYGROUND') =>
					this.i18n.translateIn(language, `SEO.TAB.${tab}.DESCRIPTION`, { name: headline });

				// Tab titles drop the `| SITE_NAME` suffix on purpose: the headline
				// already carries the package name, and the site suffix pushed the
				// /api and /styles titles beyond the ~60-character SERP limit.
				const titleByTab = {
					overview: `${headline} | ${SITE_NAME}`,
					api: `${headline} ${suffix('API')}`,
					styles: `${headline} ${suffix('STYLES')}`,
					examples: `${headline} ${suffix('EXAMPLES')}`,
					playground: `${headline} ${suffix('PLAYGROUND')}`
				} satisfies Record<LibraryTabSeoId, string>;

				const descriptionByTab = {
					overview: description,
					api: this.buildApiDescription(librarySeo, language),
					styles: tabDescription('STYLES'),
					examples: tabDescription('EXAMPLES'),
					playground: tabDescription('PLAYGROUND')
				} satisfies Record<LibraryTabSeoId, string>;

				return {
					title: titleByTab[tab],
					description: descriptionByTab[tab],
					// A headless library (a store, a portal, drag-and-drop helpers) exposes
					// no CSS variables, so its /styles/ tab documents nothing. Marking it
					// noindex also drops it from the sitemap, which is built from the
					// prerendered output and skips anything carrying the directive.
					noindex:
						!INDEXABLE_LIBRARY_TAB_SET.has(tab) ||
						(tab === 'styles' && !THEMEABLE_LIBRARY_ROUTES.has(librarySeo.route)),
					ogType: 'article',
					structuredData: [
						this.createLibraryStructuredData(librarySeo),
						this.createLibrarySourceCodeStructuredData(librarySeo),
						...this.createEntityStructuredData(),
						this.createLibraryBreadcrumbStructuredData(librarySeo, canonicalPath, tab, language),
						...(tab === 'overview'
							? [this.createLibraryArticleStructuredData(librarySeo, canonicalPath, language)]
							: []),
						...(tab === 'overview' ? this.createLibraryFaqStructuredData(librarySeo, canonicalPath, language) : [])
					]
				};
			}
		}

		return {
			title: `${SITE_NAME} | Angular UI Components and Documentation`,
			description: 'Hub UI documentation for Angular UI components, examples and reusable frontend architecture.',
			noindex: false,
			ogType: 'website',
			structuredData: this.createHomeStructuredData()
		};
	}

	/**
	 * Creates `FAQPage` structured data from the library's question-and-answer
	 * keys, mirroring the block the overview tab renders.
	 *
	 * Returns an empty array when the library declares no FAQ, so libraries opt
	 * in by adding copy rather than by touching this service. The markup only
	 * reinforces the visible text: several AI crawlers never parse JSON-LD, which
	 * is why the answers are rendered on the page rather than living here alone.
	 *
	 * @param librarySeo Library definition providing the translation key prefix.
	 * @param currentPath Canonical path of the overview page.
	 * @param language Language used to resolve the copy.
	 * @returns Single-element array with the FAQPage payload, or an empty array.
	 */
	private createLibraryFaqStructuredData(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>,
		currentPath: string,
		language: AppLang
	): Record<string, unknown>[] {
		const prefix = `SEO.LIBRARY.${seoKeySegment(librarySeo.key)}.FAQ`;
		const questions: Record<string, unknown>[] = [];

		// `hasIn`, not `translateIn`: the English fallback would emit English
		// questions on a page whose visible content has none, and the markup must
		// mirror what the page actually renders.
		for (let index = 0; this.i18n.hasIn(language, `${prefix}.${index}.Q`); index++) {
			questions.push({
				'@type': 'Question',
				name: this.i18n.translateIn(language, `${prefix}.${index}.Q`),
				acceptedAnswer: {
					'@type': 'Answer',
					text: this.i18n.translateIn(language, `${prefix}.${index}.A`)
				}
			});
		}

		if (!questions.length) {
			return [];
		}

		const pageUrl = new URL(currentPath, SITE_URL).toString();

		return [
			{
				'@type': 'FAQPage',
				'@id': `${pageUrl}#faq`,
				inLanguage: language,
				mainEntityOfPage: pageUrl,
				mainEntity: questions
			}
		];
	}

	/**
	 * Builds the /api meta description, naming the library's public symbols.
	 *
	 * Developers search the literal export name and these pages already rank
	 * top-3 for those queries, but the generic snippet never confirmed the symbol
	 * was documented here, so the click went to GitHub or npm instead. Spelling
	 * the names out makes the match visible in the SERP.
	 *
	 * Symbols are added while the rendered string stays under the truncation
	 * limit, so a library with long type names simply lists fewer of them rather
	 * than emitting a description Google would cut mid-word. Falls back to the
	 * symbol-less phrasing when a library has no generated symbols.
	 *
	 * @param librarySeo Library definition providing the package name and route.
	 * @param language Language used to localize the surrounding copy.
	 * @returns Meta description for the API tab.
	 */
	private buildApiDescription(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>,
		language: AppLang
	): string {
		const symbols = LIBRARY_SYMBOLS[librarySeo.route] ?? [];
		const render = (list: readonly string[]) =>
			this.i18n.translateIn(language, 'SEO.TAB.API.DESCRIPTION', {
				name: librarySeo.packageName,
				symbols: list.join(', ')
			});

		if (!symbols.length) {
			return this.i18n.translateIn(language, 'SEO.TAB.API.DESCRIPTION_PLAIN', {
				name: librarySeo.packageName
			});
		}

		let fitted = symbols.slice(0, 1);
		for (let count = 2; count <= symbols.length; count++) {
			const candidate = symbols.slice(0, count);
			if (render(candidate).length > MAX_DESCRIPTION_LENGTH) break;
			fitted = candidate;
		}

		return render(fitted);
	}

	/**
	 * Returns the deepest activated route snapshot.
	 *
	 * @param snapshot Current activated route snapshot.
	 * @returns Deepest child snapshot.
	 */
	private getDeepestSnapshot(snapshot: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
		let current = snapshot;

		while (current.firstChild) {
			current = current.firstChild;
		}

		return current;
	}

	/**
	 * Resolves the SEO language. The prerendered baseline stays in English.
	 *
	 * @param currentPath Current URL path, optionally carrying a language prefix.
	 * @returns Current language used for metadata and html lang.
	 */
	private resolveSeoLanguage(currentPath: string): AppLang {
		const languageFromPath = this.i18n.getLangFromUrl(currentPath);
		if (languageFromPath) {
			return languageFromPath;
		}

		const currentLanguage = this.i18n.lang();
		return SUPPORTED_APP_LANGS.includes(currentLanguage) ? currentLanguage : DEFAULT_SEO_LANGUAGE;
	}

	/**
	 * Normalizes a router URL into a clean absolute path without query string or fragment.
	 *
	 * @param rawUrl Router URL.
	 * @returns Path beginning with `/`.
	 */
	private normalizePath(rawUrl: string): string {
		const path = rawUrl.split('#')[0]?.split('?')[0] ?? '/';
		return path === '' ? '/' : path;
	}

	/**
	 * Ensures a route path ends with a trailing slash, matching the canonical
	 * form the server serves with a 200 (non-slash URLs are 301-redirected).
	 * The site root is returned unchanged.
	 *
	 * @param path Route path beginning with `/`.
	 * @returns Path guaranteed to end with `/`.
	 */
	private ensureTrailingSlash(path: string): string {
		if (!path || path === '/') {
			return '/';
		}

		return path.endsWith('/') ? path : `${path}/`;
	}

	/**
	 * Validates and resolves a library tab.
	 *
	 * @param value Route parameter value.
	 * @returns Known tab identifier.
	 */
	private resolveLibraryTab(value: string | null): LibraryTabSeoId {
		if (value && (LIBRARY_TABS as readonly string[]).includes(value)) {
			return value as LibraryTabSeoId;
		}

		return 'overview';
	}

	/**
	 * Ensures the canonical link is present and updated.
	 *
	 * @param href Canonical absolute URL.
	 */
	private ensureCanonicalLink(href: string): void {
		let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

		if (!link) {
			link = this.document.createElement('link');
			link.setAttribute('rel', 'canonical');
			this.document.head.appendChild(link);
		}

		link.setAttribute('href', href);
	}

	/**
	 * Rebuilds alternate language links for the current content path.
	 *
	 * @param localizedContentPath Current route without the leading language prefix.
	 */
	private updateAlternateLanguageLinks(localizedContentPath: string): void {
		this.document.head
			.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][data-hub-ui-hreflang="true"]')
			.forEach((link) => link.remove());

		// Withheld locales are omitted: advertising a noindex page as an hreflang
		// alternate is a contradiction Google may resolve by dropping the cluster.
		SUPPORTED_APP_LANGS.filter((lang) => !NOINDEX_LANGS.has(lang)).forEach((lang) => {
			const href = new URL(
				this.ensureTrailingSlash(this.i18n.localizePath(localizedContentPath, lang)),
				SITE_URL
			).toString();
			const link = this.document.createElement('link');
			link.rel = 'alternate';
			link.hreflang = HREFLANG_BY_LANG[lang] ?? lang;
			link.href = href;
			link.setAttribute('data-hub-ui-hreflang', 'true');
			this.document.head.appendChild(link);
		});

		const defaultLink = this.document.createElement('link');
		defaultLink.rel = 'alternate';
		defaultLink.hreflang = 'x-default';
		defaultLink.href = new URL(
			this.ensureTrailingSlash(this.i18n.localizePath(localizedContentPath, DEFAULT_APP_LANG)),
			SITE_URL
		).toString();
		defaultLink.setAttribute('data-hub-ui-hreflang', 'true');
		this.document.head.appendChild(defaultLink);
	}

	/**
	 * Updates the document language to match the active application language.
	 *
	 * @param language Active language code.
	 */
	private updateDocumentLanguage(language: AppLang): void {
		this.document.documentElement.lang = language;
		this.document.documentElement.dir = RTL_SEO_LANGS.includes(language) ? 'rtl' : 'ltr';
	}

	/**
	 * Removes the leading language segment from a URL path when present.
	 *
	 * @param currentPath Current URL path.
	 * @returns Path normalized to the language-neutral route shape used by route metadata.
	 */
	private stripLanguagePrefix(currentPath: string): string {
		return this.i18n.stripLangFromUrl(currentPath);
	}

	/**
	 * Replaces the active JSON-LD script with the current route structured data.
	 *
	 * @param resolved Resolved SEO definition.
	 * @param canonicalUrl Canonical absolute URL.
	 * @param language Current page language.
	 */
	private updateStructuredData(
		resolved: Pick<ResolvedSeoMetadata, 'structuredData'>,
		canonicalUrl: string,
		language: AppLang
	): void {
		const previous = this.document.head.querySelector('#hub-ui-structured-data');
		previous?.remove();

		if (resolved.structuredData.length === 0) {
			return;
		}

		const script = this.document.createElement('script');
		script.id = 'hub-ui-structured-data';
		script.type = 'application/ld+json';
		script.text = JSON.stringify(
			{
				'@context': 'https://schema.org',
				'@graph': resolved.structuredData.map((entry) =>
					LD_LOCALIZED_TYPES.has(entry['@type'] as string)
						? {
								inLanguage: language,
								url: canonicalUrl,
								...entry
							}
						: entry
				)
			},
			null,
			0
		);

		this.document.head.appendChild(script);
	}

	/**
	 * Creates structured data for the home page: the site-wide WebSite entity,
	 * the publishing Organization and the author Person, cross-linked by stable
	 * `@id` so search engines resolve them as a single entity graph.
	 *
	 * @param language Language used to localize the description. Defaults to the SEO baseline.
	 * @returns JSON-LD entities for the main landing page.
	 */
	private createHomeStructuredData(language: AppLang = DEFAULT_SEO_LANGUAGE): Record<string, unknown>[] {
		const description = this.i18n.translateIn(language, 'SEO.PAGE.HOME.DESCRIPTION') || STATIC_SEO_PAGES.home.description;

		return [
			{
				'@type': 'WebSite',
				'@id': WEBSITE_ID,
				url: SITE_URL,
				name: SITE_NAME,
				alternateName: 'ng-hub-ui',
				description,
				publisher: { '@id': ORGANIZATION_ID }
			},
			...this.createEntityStructuredData()
		];
	}

	/**
	 * Publisher/author entity nodes (Organization + Person). Emitted on EVERY
	 * page graph so the `author`/`publisher` `@id` references of the library
	 * entities resolve within the same document instead of dangling.
	 *
	 * @returns Organization and Person JSON-LD nodes with stable `@id`s.
	 */
	private createEntityStructuredData(): Record<string, unknown>[] {
		return [
			{
				'@type': 'Organization',
				'@id': ORGANIZATION_ID,
				url: SITE_URL,
				name: SITE_NAME,
				alternateName: 'ng-hub-ui',
				// Square mark per Google's Logo guidance — not the 1200×630 OG banner.
				logo: {
					'@type': 'ImageObject',
					url: new URL('/apple-touch-icon.png', SITE_URL).toString(),
					width: 180,
					height: 180
				},
				sameAs: [REPOSITORY_URL],
				founder: { '@id': PERSON_ID }
			},
			{
				'@type': 'Person',
				'@id': PERSON_ID,
				name: 'Carlos Morcillo',
				url: AUTHOR_URL,
				description:
					this.i18n.translateIn(DEFAULT_SEO_LANGUAGE, 'SEO.PAGE.ABOUT.DESCRIPTION') ||
					STATIC_SEO_PAGES.about.description,
				sameAs: [AUTHOR_GITHUB_URL, 'https://linkedin.com/in/carlosmorcillofernandez']
			}
		];
	}

	/**
	 * Creates structured data for the about page. The `Person` reuses the shared
	 * `@id` so it resolves to the same author entity declared on the home page.
	 *
	 * @returns JSON-LD payload for the author profile.
	 */
	private createAboutStructuredData(): Record<string, unknown> {
		return {
			'@type': 'ProfilePage',
			'@id': `${SITE_URL}/#about`,
			mainEntity: {
				'@type': 'Person',
				'@id': PERSON_ID,
				name: 'Carlos Morcillo',
				url: AUTHOR_URL,
				description:
					this.i18n.translateIn(DEFAULT_SEO_LANGUAGE, 'SEO.PAGE.ABOUT.DESCRIPTION') ||
					STATIC_SEO_PAGES.about.description,
				sameAs: [AUTHOR_GITHUB_URL, 'https://linkedin.com/in/carlosmorcillofernandez']
			}
		};
	}

	/**
	 * Creates the `SoftwareApplication` structured data for a library landing page.
	 *
	 * @param librarySeo Library metadata.
	 * @param currentPath Current URL path.
	 * @param language Language used to localize the description and build the entity `@id`.
	 * @returns JSON-LD payload for a library page.
	 */
	private createLibraryStructuredData(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>
	): Record<string, unknown> {
		// Singleton entity: locale-neutral @id, canonical (EN overview) URL and
		// English copy, byte-identical from every tab and locale that emits it —
		// one npm package is ONE entity, with one main page.
		const canonicalOverview = new URL(`/${DEFAULT_SEO_LANGUAGE}/${librarySeo.route}/overview/`, SITE_URL).toString();

		return {
			'@type': 'SoftwareApplication',
			'@id': librarySoftwareId(librarySeo.route),
			name: librarySeo.packageName,
			applicationCategory: 'DeveloperApplication',
			applicationSubCategory: 'UI Component Library',
			operatingSystem: 'Web',
			description: this.i18n.translateIn(
				DEFAULT_SEO_LANGUAGE,
				`SEO.LIBRARY.${seoKeySegment(librarySeo.key)}.DESCRIPTION`
			),
			...(LIBRARY_VERSIONS[librarySeo.route] ? { softwareVersion: LIBRARY_VERSIONS[librarySeo.route] } : {}),
			downloadUrl: `https://www.npmjs.com/package/${librarySeo.packageName}`,
			programmingLanguage: 'TypeScript',
			license: LICENSE_URL,
			offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
			author: { '@id': PERSON_ID },
			publisher: { '@id': ORGANIZATION_ID },
			inLanguage: DEFAULT_SEO_LANGUAGE,
			url: canonicalOverview,
			mainEntityOfPage: canonicalOverview
		};
	}

	/**
	 * Creates the `SoftwareSourceCode` structured data for a library landing page.
	 *
	 * Holds the `codeRepository` property — which belongs to `SoftwareSourceCode`,
	 * not `SoftwareApplication` — and links back to the software entity through
	 * `targetProduct`.
	 *
	 * @param librarySeo Library metadata.
	 * @param language Language used to build stable per-locale entity identifiers.
	 * @returns JSON-LD payload describing the library source code.
	 */
	private createLibrarySourceCodeStructuredData(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>
	): Record<string, unknown> {
		const canonicalOverview = new URL(`/${DEFAULT_SEO_LANGUAGE}/${librarySeo.route}/overview/`, SITE_URL).toString();

		return {
			'@type': 'SoftwareSourceCode',
			'@id': librarySourceCodeId(librarySeo.route),
			name: `${librarySeo.packageName} source`,
			codeRepository: libraryRepositoryUrl(librarySeo.packageName),
			programmingLanguage: 'TypeScript',
			license: LICENSE_URL,
			inLanguage: DEFAULT_SEO_LANGUAGE,
			url: canonicalOverview,
			targetProduct: { '@id': librarySoftwareId(librarySeo.route) }
		};
	}

	/**
	 * Creates `TechArticle` structured data for a library overview page, marking
	 * the documentation prose as authoritative technical content and linking it
	 * to the software entity.
	 *
	 * @param librarySeo Library metadata.
	 * @param currentPath Current URL path (canonical, trailing-slash form).
	 * @param language Language used to localize the article copy and build the entity `@id`.
	 * @returns JSON-LD payload describing the documentation article.
	 */
	private createLibraryArticleStructuredData(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>,
		currentPath: string,
		language: AppLang
	): Record<string, unknown> {
		const libKey = `SEO.LIBRARY.${seoKeySegment(librarySeo.key)}`;
		const pageUrl = new URL(currentPath, SITE_URL).toString();

		return {
			'@type': 'TechArticle',
			'@id': `${pageUrl}#article`,
			headline: this.i18n.translateIn(language, `${libKey}.HEADLINE`),
			description: this.i18n.translateIn(language, `${libKey}.DESCRIPTION`),
			image: new URL(DEFAULT_OG_IMAGE_PATH, SITE_URL).toString(),
			...(LIBRARY_LAST_MODIFIED[librarySeo.route] ? { dateModified: LIBRARY_LAST_MODIFIED[librarySeo.route] } : {}),
			about: { '@id': librarySoftwareId(librarySeo.route) },
			author: { '@id': PERSON_ID },
			publisher: { '@id': ORGANIZATION_ID },
			mainEntityOfPage: pageUrl
		};
	}

	/**
	 * Creates breadcrumb structured data for library tabs.
	 *
	 * @param librarySeo Library metadata.
	 * @param currentPath Current URL path.
	 * @param tab Active tab.
	 * @param language Language used to localize breadcrumb labels.
	 * @returns JSON-LD breadcrumb payload.
	 */
	private createLibraryBreadcrumbStructuredData(
		librarySeo: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>,
		currentPath: string,
		tab: LibraryTabSeoId,
		language: AppLang
	): Record<string, unknown> {
		const baseUrl = new URL(`/${language}/`, SITE_URL).toString();
		const libraryUrl = new URL(`/${language}/${librarySeo.route}/overview/`, SITE_URL).toString();
		const currentUrl = new URL(currentPath, SITE_URL).toString();
		const homeLabel = this.i18n.translate('UI.NAV.HOME') || 'Home';
		const tabLabel = this.localizedTabLabel(tab, language);

		return {
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: homeLabel,
					item: baseUrl
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: librarySeo.packageName,
					item: libraryUrl
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: tabLabel,
					item: currentUrl
				}
			]
		};
	}

	/**
	 * Resolves the localized label of a library tab for structured-data breadcrumbs.
	 *
	 * @param tab Active tab identifier.
	 * @param language Active language code.
	 * @returns Localized, human-readable tab label.
	 */
	private localizedTabLabel(tab: LibraryTabSeoId, language: AppLang): string {
		switch (tab) {
			case 'api':
			case 'styles':
			case 'examples':
			case 'playground':
				return this.i18n.translateIn(language, `SEO.TAB.${tab.toUpperCase()}.TITLE_SUFFIX`);
			default:
				return this.i18n.translateIn(language, 'UI.LIBRARY.TABS.OVERVIEW') || 'Overview';
		}
	}
}
