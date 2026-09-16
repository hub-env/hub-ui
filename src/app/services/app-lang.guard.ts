import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AppI18nService, DEFAULT_APP_LANG, SUPPORTED_APP_LANGS, type AppLang } from './app-i18n.service';

/**
 * Loads and activates the language of the route tree being entered BEFORE it
 * renders. The router awaits the returned promise, so prerendered pages are
 * serialized fully localized and client navigations never paint the English
 * fallback while a locale chunk is in flight.
 *
 * Attached to each top-level `:lang` route; the language is read from the
 * route's own configured path segment.
 */
export const appLangGuard: CanActivateFn = (route) => {
	const candidate = route.routeConfig?.path ?? DEFAULT_APP_LANG;
	const lang: AppLang = (SUPPORTED_APP_LANGS as readonly string[]).includes(candidate)
		? (candidate as AppLang)
		: DEFAULT_APP_LANG;
	return inject(AppI18nService).prepare(lang);
};
