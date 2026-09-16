import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { type HubThemeOption } from './theme.model';
import { AppI18nService } from './app-i18n.service';

// Re-export the theme descriptor type so existing imports from this service keep working.
export type { HubThemeOption };

/** Dark theme identifier constant. */
const DARK_THEME = 'dark';
/** Default light theme identifier constant. */
const DEFAULT_LIGHT_THEME = 'base';

/**
 * Manages global visual themes for the documentation app.
 * Applies the selected theme to `document.documentElement` through `data-theme`.
 */
@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private static readonly STORAGE_KEY = 'hub-ui-selected-theme';
	private readonly document = inject(DOCUMENT);
	private readonly platformId = inject(PLATFORM_ID);

	private readonly i18n = inject(AppI18nService);

	/** Theme ids, in the order the switcher offers them. Names are resolved per language below. */
	private static readonly THEME_IDS = ['base', 'bootstrap', 'dark', 'sunset', 'forest', 'mono', 'terminal'] as const;

	/**
	 * Available themes for the global theme switcher, named in the reader's language.
	 *
	 * A `computed` over the language signal rather than a static list: the names were English
	 * literals here, so a reader on any other language saw `Sunset` and `Forest` among otherwise
	 * translated chrome. `Bootstrap` stays as it is — it is another framework's name, not a
	 * description of a colour scheme.
	 */
	readonly themes = computed<Array<HubThemeOption>>(() => {
		this.i18n.lang();

		return ThemeService.THEME_IDS.map((id) => ({
			id,
			label: this.i18n.translate(`UI.THEMES.${id.toUpperCase()}`)
		}));
	});

	/**
	 * Currently selected theme id.
	 */
	readonly selectedTheme = signal<string>(DEFAULT_LIGHT_THEME);

	/**
	 * Whether the current theme is considered a dark theme.
	 */
	readonly isDark = computed(() => this.selectedTheme() === DARK_THEME);

	/**
	 * Initializes theme state from persisted storage and applies it to the DOM.
	 * When no theme has been persisted, falls back to the visitor's system
	 * preference (`prefers-color-scheme`) instead of forcing the light theme.
	 */
	initializeTheme(): void {
		const persisted = this.safeReadPersistedTheme();
		if (this.isKnownTheme(persisted)) {
			this.applyTheme(persisted);
			return;
		}
		// System-derived choice is not persisted, so the site keeps
		// following prefers-color-scheme until the user picks a theme.
		this.applyTheme(this.systemPreferredTheme(), false);
	}

	/**
	 * Resolves the theme matching the visitor's `prefers-color-scheme`.
	 *
	 * @returns Dark theme id when the system prefers dark, default light theme otherwise.
	 */
	private systemPreferredTheme(): string {
		if (isPlatformBrowser(this.platformId) && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
			return DARK_THEME;
		}
		return DEFAULT_LIGHT_THEME;
	}

	/**
	 * Updates the active theme and optionally persists the choice.
	 *
	 * @param themeId Theme id to apply.
	 * @param persist Whether to store the choice in localStorage. Defaults to true.
	 */
	applyTheme(themeId: string, persist = true): void {
		const normalizedTheme = this.isKnownTheme(themeId) ? themeId : DEFAULT_LIGHT_THEME;
		this.selectedTheme.set(normalizedTheme);

		if (isPlatformBrowser(this.platformId)) {
			this.document.documentElement.setAttribute('data-theme', normalizedTheme);
		}

		if (!persist) {
			return;
		}

		try {
			localStorage.setItem(ThemeService.STORAGE_KEY, normalizedTheme);
		} catch {
			// SSR-safe
		}
	}

	/**
	 * Toggles between the dark theme and the default light theme.
	 * If a non-dark theme is active, switches to dark; otherwise reverts to base.
	 */
	toggleDarkMode(): void {
		const next = this.isDark() ? DEFAULT_LIGHT_THEME : DARK_THEME;
		this.applyTheme(next);
	}

	/**
	 * Reads the persisted theme id from localStorage.
	 *
	 * @returns Persisted theme id or `null`.
	 */
	private safeReadPersistedTheme(): string | null {
		try {
			return localStorage.getItem(ThemeService.STORAGE_KEY);
		} catch {
			return null;
		}
	}

	/**
	 * Checks whether a theme id exists in the configured theme options.
	 *
	 * @param themeId Theme identifier to validate.
	 * @returns `true` if the theme is available.
	 */
	private isKnownTheme(themeId: string | null): themeId is string {
		if (!themeId) {
			return false;
		}
		return this.themes().some((theme) => theme.id === themeId);
	}
}
