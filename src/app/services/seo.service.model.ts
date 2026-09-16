/**
 * Domain models and constants for the global SEO service.
 *
 * Holds the resolved-metadata shape and the language/robots lookup tables used
 * by {@link SeoService} when synchronizing route state with page metadata,
 * canonical links and structured data.
 */
import type { AppLang } from './app-i18n.model';

/** Open Graph locale per supported app language. */
export const OG_LOCALE_BY_LANG: Record<AppLang, string> = {
	en: 'en_US',
	es: 'es_ES',
	fr: 'fr_FR',
	de: 'de_DE',
	zh: 'zh_CN',
	ru: 'ru_RU',
	// `ar_AR` is not a real locale (AR is Argentina's country code); ar_SA is
	// the conventional Open Graph locale for Arabic content.
	ar: 'ar_SA',
	ja: 'ja_JP'
};

/**
 * `hreflang` attribute value per supported app language. Deviates from the raw
 * URL language code only where BCP 47 requires a script subtag (`zh` alone is
 * ambiguous between Simplified and Traditional; the site content is Simplified,
 * hence `zh-Hans`). URL paths keep using the bare `/zh/` segment.
 */
export const HREFLANG_BY_LANG: Record<AppLang, string> = {
	en: 'en',
	es: 'es',
	fr: 'fr',
	de: 'de',
	zh: 'zh-Hans',
	ru: 'ru',
	ar: 'ar',
	ja: 'ja'
};

/** Languages rendered right-to-left (mirror of RTL_APP_LANGS). */
export const RTL_SEO_LANGS: readonly AppLang[] = ['ar'];

/** Meta robots value used by indexable pages. */
export const INDEX_ROBOTS_CONTENT = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

/** Meta robots value used by utility/demo pages that should not appear in search results. */
export const NOINDEX_ROBOTS_CONTENT = 'noindex,follow';

/** Route segment used by noindex demo/example pages. */

/** Open Graph object type accepted by the resolved SEO metadata. */
export type SeoOgType = 'website' | 'article' | 'profile';

/**
 * Fully resolved SEO metadata for a single route, ready to be written to the
 * document head (title, meta tags and structured data).
 */
export interface ResolvedSeoMetadata {
	/** Document title for the current route. */
	readonly title: string;
	/** Meta description for the current route. */
	readonly description: string;
	/** Whether the page should be excluded from search indexes. */
	readonly noindex: boolean;
	/** Open Graph object type for the page. */
	readonly ogType: SeoOgType;
	/** JSON-LD structured-data entries appended to the document head. */
	readonly structuredData: Record<string, unknown>[];
}
