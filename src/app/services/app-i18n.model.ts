/**
 * Domain models, constants and metadata for the application i18n service.
 *
 * This file centralises the language-related types, regular expressions and
 * lookup tables consumed by {@link AppI18nService}. Keeping them out of the
 * service keeps the service focused on behaviour while allowing other parts of
 * the app (SEO, language switcher, route guards) to import the shared types.
 */

/**
 * Matches semantic translation keys (`UI.`, `DOCS.`, `SEO.` prefixes). Values that
 * do not match are treated as literal text (e.g. English-only changelog entries).
 */
export const SEMANTIC_KEY_RE = /^(UI|DOCS|SEO)\./;

/** Supported application languages. */
export type AppLang = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ru' | 'ar' | 'ja';

/** Ordered tuple of every supported application language code. */
export const SUPPORTED_APP_LANGS = ['en', 'es', 'fr', 'de', 'zh', 'ru', 'ar', 'ja'] as const;

/** Language applied when no user/browser preference can be resolved. */
export const DEFAULT_APP_LANG: AppLang = 'en';

/** Languages that render right-to-left. */
export const RTL_APP_LANGS: readonly AppLang[] = ['ar'];

/** Display metadata for a single language in the language switcher. */
export interface AppLanguageOption {
	/** Language code used internally and in URLs. */
	code: AppLang;
	/** Short uppercase label shown in compact switchers (e.g. `EN`). */
	label: string;
	/** Native, human-readable language name (e.g. `Español`). */
	nativeLabel: string;
	/** Text direction applied when the language is active. */
	dir: 'ltr' | 'rtl';
}

/** Display metadata for the language switcher (native label + text direction). */
export const APP_LANGUAGES: ReadonlyArray<AppLanguageOption> = [
	{ code: 'en', label: 'EN', nativeLabel: 'English', dir: 'ltr' },
	{ code: 'es', label: 'ES', nativeLabel: 'Español', dir: 'ltr' },
	{ code: 'fr', label: 'FR', nativeLabel: 'Français', dir: 'ltr' },
	{ code: 'de', label: 'DE', nativeLabel: 'Deutsch', dir: 'ltr' },
	{ code: 'zh', label: 'ZH', nativeLabel: '中文', dir: 'ltr' },
	{ code: 'ru', label: 'RU', nativeLabel: 'Русский', dir: 'ltr' },
	{ code: 'ar', label: 'AR', nativeLabel: 'العربية', dir: 'rtl' },
	{ code: 'ja', label: 'JA', nativeLabel: '日本語', dir: 'ltr' }
];

/** localStorage key under which the active language preference is persisted. */
export const STORAGE_KEY = 'hub-ui-lang';
