/**
 * Central i18n assembly.
 *
 * English is the source of truth and ships statically in the main bundle: it is
 * both the default language and the deep-fallback base for every other locale
 * (the `HubTranslationService` merge is shallow at the top level, so per-key
 * fallback must be built app-side).
 *
 * Every OTHER language is a lazy chunk (`./locales/<lang>.ts`) carrying only its
 * raw translations; `AppI18nService` loads it on demand through
 * {@link LOCALE_LOADERS} and layers it over a clone of the English dictionary.
 * Eagerly importing all 8 languages used to put a ~2 MB dictionary chunk on the
 * boot path of every page — a visitor only ever needs one.
 */
import uiEn from './ui/en.json';
import seoEn from './seo/en.json';
import docsEn from './docs/en.json';

import { assemble } from './merge';
import type { AppTranslations, Dict } from './i18n.model';

// Re-export the dictionary type and merge helper so consumers have one import point.
export type { AppTranslations };
export { deepMerge } from './merge';

/** Fully assembled English dictionary (default language + fallback base). */
export const en: AppTranslations = assemble(uiEn as Dict, seoEn as Dict, docsEn as Dict);

/** Languages served through lazy locale chunks (everything but English). */
export type LazyAppLang = 'es' | 'fr' | 'de' | 'zh' | 'ru' | 'ar' | 'ja';

/**
 * Dynamic loaders for the non-English dictionaries. Each resolves to the RAW
 * language content (no English base) — the caller merges it over {@link en}.
 * Static string specifiers keep every locale bundler-splittable.
 */
export const LOCALE_LOADERS: Record<LazyAppLang, () => Promise<Dict>> = {
	es: () => import('./locales/es').then((m) => m.raw),
	fr: () => import('./locales/fr').then((m) => m.raw),
	de: () => import('./locales/de').then((m) => m.raw),
	zh: () => import('./locales/zh').then((m) => m.raw),
	ru: () => import('./locales/ru').then((m) => m.raw),
	ar: () => import('./locales/ar').then((m) => m.raw),
	ja: () => import('./locales/ja').then((m) => m.raw)
};
