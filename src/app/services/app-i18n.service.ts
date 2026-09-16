import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { deepMerge, en, LOCALE_LOADERS, type AppTranslations, type LazyAppLang } from '../i18n';
import {
	APP_LANGUAGES,
	DEFAULT_APP_LANG,
	RTL_APP_LANGS,
	SEMANTIC_KEY_RE,
	STORAGE_KEY,
	SUPPORTED_APP_LANGS,
	type AppLang,
	type AppLanguageOption
} from './app-i18n.model';

// Re-export shared i18n types/constants so existing imports from this service keep working.
export { APP_LANGUAGES, DEFAULT_APP_LANG, RTL_APP_LANGS, SEMANTIC_KEY_RE, SUPPORTED_APP_LANGS };
export type { AppLang, AppLanguageOption };

/**
 * Loaded dictionaries. English ships statically (default + deep-fallback base);
 * every other language is merged in on demand from its lazy locale chunk.
 */
const LOADED: Partial<Record<AppLang, AppTranslations>> = { en };

/**
 * The same dictionaries before the English base is merged in, so a caller can
 * tell an actually-translated key from one that resolved through the fallback.
 * Only {@link AppI18nService.hasIn} needs this; rendering always uses LOADED.
 */
const UNMERGED: Partial<Record<AppLang, unknown>> = { en };

/**
 * Signal-based i18n service for the Hub UI documentation app.
 * Provides reactive language switching between English and Spanish
 * with localStorage persistence.
 */
@Injectable({ providedIn: 'root' })
export class AppI18nService {
	private readonly router = inject(Router);
	private readonly document = inject(DOCUMENT);

	/** Currently active language code. */
	readonly lang = signal<AppLang>(this.resolveInitialLang());

	/** Invalidates translated computed values when a lazy locale finishes loading. */
	private readonly dictionaryRevision = signal(0);

	/**
	 * Resolves a dotted translation key against the active language dictionary,
	 * falling back to English when the key is missing, and interpolates `{param}`
	 * placeholders. Use for dynamic copy that the `translate` pipe cannot build.
	 *
	 * @param key Dotted key, e.g. `UI.LIBRARY.PAGE.API_INTRO`.
	 * @param params Optional values for `{name}` / `{count}` style placeholders.
	 * @returns Localized, interpolated string (or the key itself if unresolved).
	 */
	translate(key: string, params?: Record<string, string | number>): string {
		this.dictionaryRevision();
		return this.translateIn(this.lang(), key, params);
	}

	/**
	 * Reports whether a key resolves in a specific language, ignoring the English
	 * fallback that {@link translateIn} applies.
	 *
	 * Needed by content that is rolled out one language at a time: falling back
	 * would render English copy under a translated heading, which reads worse
	 * than omitting the section entirely. Callers use it to skip a block until
	 * that language actually has the text.
	 *
	 * @param lang Target language code.
	 * @param key Dotted key.
	 * @returns Whether this language has its own string for the key.
	 */
	hasIn(lang: AppLang, key: string): boolean {
		const value = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], UNMERGED[lang]);

		return typeof value === 'string';
	}

	/**
	 * Resolves a dotted key against an explicit language dictionary (with English
	 * fallback). Use when the target language is known independently of the active
	 * signal — e.g. SSR SEO metadata derived from the route language.
	 *
	 * @param lang Target language code.
	 * @param key Dotted key, e.g. `SEO.LIBRARY.BOARD.HEADLINE`.
	 * @param params Optional `{name}` style placeholders.
	 * @returns Localized, interpolated string (or the key itself if unresolved).
	 */
	translateIn(lang: AppLang, key: string, params?: Record<string, string | number>): string {
		const read = (dict: unknown) =>
			key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)?.[part], dict);
		let value = read(LOADED[lang]);
		if (typeof value !== 'string') {
			value = read(LOADED[DEFAULT_APP_LANG]);
		}
		if (typeof value !== 'string') {
			return key;
		}
		if (params) {
			for (const [name, replacement] of Object.entries(params)) {
				value = (value as string).split(`{${name}}`).join(String(replacement));
			}
		}
		return value as string;
	}

	/**
	 * Ensures a language dictionary is loaded, importing its lazy locale chunk
	 * and layering it over the English base on first use. Concurrent calls for
	 * the same language share one in-flight promise.
	 *
	 * @param lang Language whose dictionary must be available.
	 * @returns The fully assembled dictionary for `lang`.
	 */
	ensureLang(lang: AppLang): Promise<AppTranslations> {
		const cached = LOADED[lang];
		if (cached) {
			return Promise.resolve(cached);
		}
		let pending = this._pending.get(lang);
		if (!pending) {
			pending = LOCALE_LOADERS[lang as LazyAppLang]()
				.then((raw) => {
					const dict = deepMerge(en as Record<string, unknown>, raw) as AppTranslations;
					LOADED[lang] = dict;
					UNMERGED[lang] = raw;
					this._pending.delete(lang);
					this.dictionaryRevision.update((revision) => revision + 1);
					return dict;
				})
				.catch((error) => {
					this._pending.delete(lang);
					console.error(`[i18n] Failed to load locale '${lang}':`, error);
					return en;
				});
			this._pending.set(lang, pending);
		}
		return pending;
	}

	/**
	 * Route-guard hook: loads and activates a language before its routes render,
	 * so both SSR/prerender and client navigations paint fully localized.
	 *
	 * @param lang Language of the route tree being activated.
	 * @returns Always `true` once the dictionary is ready.
	 */
	async prepare(lang: AppLang): Promise<boolean> {
		await this.ensureLang(lang);
		this.setLang(lang, false);
		return true;
	}

	/** In-flight locale loads, keyed by language. */
	private readonly _pending = new Map<AppLang, Promise<AppTranslations>>();

	/**
	 * Initializes the active language from the current URL and keeps it in sync
	 * with subsequent router navigations (without persisting URL-derived values).
	 */
	constructor() {
		this.syncWithUrl(this.router.url, false);

		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe((event) => {
				this.syncWithUrl(event.urlAfterRedirects, false);
			});
	}

	/**
	 * Switches the active language and persists the choice.
	 *
	 * @param lang Language code to activate.
	 * @param persist Whether the choice should be stored in localStorage. Defaults to true.
	 */
	setLang(lang: AppLang, persist = true): void {
		this.lang.set(lang);
		this.applyDocumentDirection(lang);
		if (persist) {
			try {
				localStorage.setItem(STORAGE_KEY, lang);
			} catch {
				// localStorage may be unavailable in SSR context
			}
		}
	}

	/**
	 * Toggles between English and Spanish while preserving the current route.
	 */
	toggleLang(): void {
		void this.switchRouteLanguage(this.lang() === 'en' ? 'es' : 'en');
	}

	/** Whether the active language reads right-to-left. */
	isRtl(): boolean {
		return RTL_APP_LANGS.includes(this.lang());
	}

	/**
	 * Applies the text direction and `lang` attribute on the document root for the
	 * given language, so right-to-left languages (Arabic) flip the whole layout.
	 *
	 * @param lang Language to apply.
	 */
	private applyDocumentDirection(lang: AppLang): void {
		const root = this.document?.documentElement;
		if (!root) {
			return;
		}
		root.setAttribute('lang', lang);
		root.setAttribute('dir', RTL_APP_LANGS.includes(lang) ? 'rtl' : 'ltr');
	}

	/**
	 * Switches to a different language while keeping the current route, query string and fragment.
	 *
	 * @param lang Target language code.
	 * @returns Router navigation promise.
	 */
	switchRouteLanguage(lang: AppLang): Promise<boolean> {
		this.setLang(lang);
		return this.router.navigateByUrl(this.buildLocalizedUrl(lang));
	}

	/**
	 * Applies the language encoded in the current URL when present.
	 *
	 * @param url URL to inspect.
	 * @param persist Whether the language should be stored in localStorage.
	 * @returns Resolved language code.
	 */
	syncWithUrl(url: string, persist = true): AppLang {
		const routeLanguage = this.getLangFromUrl(url);

		if (routeLanguage) {
			this.setLang(routeLanguage, persist);
			void this.ensureLang(routeLanguage);
			return routeLanguage;
		}

		return this.lang();
	}

	/**
	 * Extracts a supported language prefix from a URL.
	 *
	 * @param url URL path to inspect.
	 * @returns Language code when present.
	 */
	getLangFromUrl(url: string): AppLang | null {
		const cleanUrl = url.split('#')[0]?.split('?')[0] ?? '/';
		const firstSegment = cleanUrl.split('/').filter(Boolean)[0] ?? null;
		return this.isSupportedLang(firstSegment) ? firstSegment : null;
	}

	/**
	 * Removes an existing language prefix from a path-like URL.
	 *
	 * @param url URL path or router URL.
	 * @returns URL path without the leading language segment.
	 */
	stripLangFromUrl(url: string): string {
		const parsed = this.router.parseUrl(url || '/');
		const segments = parsed.root.children['primary']?.segments.map((segment) => segment.path) ?? [];
		const normalizedSegments = this.isSupportedLang(segments[0] ?? null) ? segments.slice(1) : segments;
		return normalizedSegments.length > 0 ? `/${normalizedSegments.join('/')}` : '/';
	}

	/**
	 * Prefixes a route path with the requested language.
	 *
	 * Note: the returned path has no trailing slash, while the server answers the
	 * canonical trailing-slash form and 301-redirects this one. Appending the
	 * slash here does not fix that — Angular's `DefaultUrlSerializer` strips it
	 * again when rendering `routerLink`, so the emitted `href` is unchanged
	 * (verified against the prerendered output). Fixing it requires a custom
	 * `UrlSerializer`; tracked separately.
	 *
	 * @param path Path that may or may not already include a language prefix.
	 * @param lang Optional target language.
	 * @returns Language-aware path.
	 */
	localizePath(path: string, lang: AppLang = this.lang()): string {
		const normalizedPath = this.stripLangFromUrl(path);
		return normalizedPath === '/' ? `/${lang}` : `/${lang}${normalizedPath}`;
	}

	/**
	 * Resolves the initial language from localStorage or browser preference.
	 *
	 * @returns The language code to use on startup.
	 */
	private resolveInitialLang(): AppLang {
		try {
			const stored = localStorage.getItem(STORAGE_KEY) as AppLang | null;
			if (stored && (SUPPORTED_APP_LANGS as readonly string[]).includes(stored)) {
				return stored;
			}
			const browser = navigator.language?.slice(0, 2).toLowerCase();
			if (browser && (SUPPORTED_APP_LANGS as readonly string[]).includes(browser)) {
				return browser as AppLang;
			}
		} catch {
			// SSR-safe fallback
		}
		return DEFAULT_APP_LANG;
	}

	/**
	 * Builds a localized URL for the current route, preserving query params and fragment.
	 *
	 * @param lang Target language code.
	 * @returns Localized URL.
	 */
	private buildLocalizedUrl(lang: AppLang): string {
		const currentUrl = this.router.url || '/';
		const parsed = this.router.parseUrl(currentUrl);
		const normalizedPath = this.localizePath(currentUrl, lang);
		const query = new URLSearchParams();

		for (const [key, value] of Object.entries(parsed.queryParams)) {
			if (Array.isArray(value)) {
				value.forEach((entry) => query.append(key, String(entry)));
				continue;
			}

			if (value !== undefined && value !== null) {
				query.set(key, String(value));
			}
		}

		const queryString = query.toString();
		const fragment = parsed.fragment ? `#${parsed.fragment}` : '';
		return `${normalizedPath}${queryString ? `?${queryString}` : ''}${fragment}`;
	}

	/**
	 * Checks whether a string is one of the supported application languages.
	 *
	 * @param value Candidate language value.
	 * @returns Type guard result.
	 */
	private isSupportedLang(value: string | null): value is AppLang {
		return value !== null && (SUPPORTED_APP_LANGS as readonly string[]).includes(value);
	}
}
