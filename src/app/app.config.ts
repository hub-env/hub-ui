import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, UrlSerializer, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { TrailingSlashUrlSerializer } from './services/trailing-slash-url-serializer';
import { hubTooltipAdapter, provideHubTranslationAdapter } from 'ng-hub-ui-utils';
import { provideHubBadgeTooltip } from 'ng-hub-ui-badges';
import { provideHubBreadcrumbTooltip } from 'ng-hub-ui-breadcrumbs';
import { hubActionsAdapter } from 'ng-hub-ui-buttons';
import { provideHubPaginableActions } from 'ng-hub-ui-paginable';
import {
	bootstrapPack,
	faPack,
	type HubIconPack,
	materialSymbolsPack,
	provideHubIcons,
	solarPack,
	svgPack
} from 'ng-hub-ui-icons';
import { DEMO_SVG_ICONS } from './shared/demo-svg-icons';
import { locale as paginableAn } from '../../projects/paginable/src/lib/assets/i18n/an';
import { locale as paginableAr } from '../../projects/paginable/src/lib/assets/i18n/ar';
import { locale as paginableAst } from '../../projects/paginable/src/lib/assets/i18n/ast';
import { locale as paginableCa } from '../../projects/paginable/src/lib/assets/i18n/ca';
import { locale as paginableDe } from '../../projects/paginable/src/lib/assets/i18n/de';
import { locale as paginableEn } from '../../projects/paginable/src/lib/assets/i18n/en';
import { locale as paginableEs } from '../../projects/paginable/src/lib/assets/i18n/es';
import { locale as paginableEu } from '../../projects/paginable/src/lib/assets/i18n/eu';
import { locale as paginableGl } from '../../projects/paginable/src/lib/assets/i18n/gl';
import { locale as paginableRu } from '../../projects/paginable/src/lib/assets/i18n/ru';
import { locale as paginableZh } from '../../projects/paginable/src/lib/assets/i18n/zh';
import { locale as stepperEn } from '../../projects/stepper/src/lib/assets/i18n/en';
import { locale as stepperEs } from '../../projects/stepper/src/lib/assets/i18n/es';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { hubLoadingBarInterceptor, provideHubLoadingBar, provideHubLoadingBarRouter } from 'ng-hub-ui-loading';
import { provideToast } from 'ng-hub-ui-toast';
import { from, map, switchMap } from 'rxjs';
import { routes } from './app.routes';
import { AppI18nService } from './services/app-i18n.service';

/**
 * Maps the library's {@link SolarVariant} keys to the suffix used by Iconify's
 * Solar CSS classes (`.icon--solar--<name>-<suffix>`). Most keys are identical;
 * only the duotone families differ (hyphenated in Iconify).
 */
const SOLAR_VARIANT_SUFFIX: Record<string, string> = {
	linear: 'linear',
	bold: 'bold',
	broken: 'broken',
	outline: 'outline',
	lineduotone: 'line-duotone',
	boldduotone: 'bold-duotone'
};

/**
 * SVG-sprite pack: maps an icon name to a `<use href="#spr-<name>">` reference.
 * The matching `<symbol>` sprite is provided by the consumer (inline in the docs
 * example); an external file would use `assets/icons.svg#<name>` instead.
 */
const SPRITE_PACK: HubIconPack = {
	resolve: (name) => ({ kind: 'use', href: `#spr-${name}` })
};

/**
 * Image pack: maps an ISO country code to a circular flag rendered as `<img>`
 * (the `{ kind: 'img' }` render mode). Demonstrates icons that are real images
 * rather than glyphs — `size` applies, `color` does not.
 */
const FLAG_PACK: HubIconPack = {
	resolve: (name) => ({
		kind: 'img',
		src: `https://hatscripts.github.io/circle-flags/flags/${name}.svg`,
		alt: `${name} flag`
	})
};

/** Built-in library dictionaries layered over the application's active locale. */
const HUB_LIBRARY_DICTIONARIES: Record<string, Record<string, unknown>> = {
	[paginableEn.lang]: { ...paginableEn.data, ...stepperEn.data },
	[paginableEs.lang]: { ...paginableEs.data, ...stepperEs.data },
	[paginableCa.lang]: paginableCa.data,
	[paginableEu.lang]: paginableEu.data,
	[paginableGl.lang]: paginableGl.data,
	[paginableAst.lang]: paginableAst.data,
	[paginableAn.lang]: paginableAn.data,
	[paginableDe.lang]: paginableDe.data,
	[paginableZh.lang]: paginableZh.data,
	[paginableAr.lang]: paginableAr.data,
	[paginableRu.lang]: paginableRu.data
};

/** Shape used by the documentation shell before it exposes Signature's public translation namespace. */
interface DocumentationDictionary extends Record<string, unknown> {
	DOCS?: {
		SIGNATURE?: {
			ACTION?: Record<string, string>;
		};
		NAV?: {
			A11Y?: Record<string, string>;
		};
	};
}

/**
 * Layers packaged library dictionaries onto the shell locale and maps documentation action text
 * to Signature's public namespace. Production consumers provide `SIGNATURE.ACTION.*` directly.
 *
 * @param dictionary - Active shell translation dictionary.
 * @param lang - Active shell language.
 * @returns Shared dictionary consumed by every Hub UI library.
 */
function createHubTranslationDictionary(dictionary: Record<string, unknown>, lang: string): Record<string, unknown> {
	const documentationDictionary = dictionary as DocumentationDictionary;
	const libraryDictionary = HUB_LIBRARY_DICTIONARIES[lang];
	return {
		...dictionary,
		...libraryDictionary,
		HUBUI: {
			// Legacy components still fall back to the flat values above; new consumers use these isolated branches.
			PAGINABLE: libraryDictionary,
			STEPPER: libraryDictionary,
			SIGNATURE: {
				ACTION: documentationDictionary.DOCS?.SIGNATURE?.ACTION ?? {}
			},
			NAV: documentationDictionary.DOCS?.NAV?.A11Y ?? {}
		}
	};
}

export const appConfig: ApplicationConfig = {
	providers: [
		// One bridge keeps every Hub UI library, including Signature, on the shell's active locale.
		provideHubTranslationAdapter(() => {
			const i18n = inject(AppI18nService);
			return toObservable(i18n.lang).pipe(
				switchMap((lang) => from(i18n.ensureLang(lang))),
				map((dictionary) => createHubTranslationDictionary(dictionary, i18n.lang()))
			);
		}),
		// Upgrades every <hub-badge> from the native `title` fallback to the rich,
		// themeable hub-ui tooltip. Remove this line and badges degrade to `title`.
		provideHubBadgeTooltip(hubTooltipAdapter),
		// Same opt-in for truncated breadcrumb labels.
		provideHubBreadcrumbTooltip(hubTooltipAdapter),
		// Draws a table row's buttons and menus with the real button library instead of the
		// table's own markup, which names Bootstrap classes this site does not ship - so the
		// menu trigger fell back to the browser's default grey button and the panel had no
		// border, shadow or padding. Neither package depends on the other: the table describes
		// what a row offers, the adapter draws it. Without this line the table keeps its
		// deprecated fallback and warns once in production.
		provideHubPaginableActions(hubActionsAdapter),
		// Agnostic icon packs for <hub-icon> / [hubIcon]. The icon sets' CSS is loaded
		// in styles.scss; this only maps names → each set's class/ligature convention.
		provideHubIcons({
			defaultPack: 'fa',
			packs: {
				fa: faPack({ defaultVariant: 'solid' }),
				bi: bootstrapPack(),
				ms: materialSymbolsPack({ variant: 'outlined' }),
				// Solar ships no webfont; we load it as Iconify CSS (.icon--solar--<name>-<variant>)
				// in styles.scss, so the pack template is adapted to that class convention.
				solar: solarPack({
					variant: 'bold',
					template: (name, variant) =>
						`icon--solar icon--solar--${name}-${SOLAR_VARIANT_SUFFIX[variant ?? 'bold'] ?? variant}`
				}),
				// The consumer's own inline SVGs — no third-party icon set involved.
				svg: svgPack({ map: DEMO_SVG_ICONS }),
				// <use href="#…"> references into an SVG sprite supplied by the app.
				sprite: SPRITE_PACK,
				// Real images (flags) rendered as <img> via the 'img' render mode.
				flag: FLAG_PACK
			}
		}),
		provideBrowserGlobalErrorListeners(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(
			routes,
			withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
			withRouterConfig({ onSameUrlNavigation: 'reload' })
		),
		// Emits every href in the canonical trailing-slash form the server serves
		// with a 200, instead of the slashless variant that is 301-redirected.
		{ provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
		// The page-progress bar under the shell chrome. The router provider holds one
		// reference for the length of each navigation and the interceptor one per request,
		// which is why the bar survives a route that resolves before its data arrives.
		//
		// `delay: 0` opts out of the library's anti-flicker grace period, and the reason is
		// measured rather than stylistic: every page here is in the initial bundle, so
		// NavigationStart to NavigationEnd is 10 ms, and any grace period at all would keep
		// the bar permanently hidden. Turning it off makes the bar an acknowledgement that
		// the click registered — it appears at `min`, the CSS transition carries it to 100%,
		// and the completion tail fades it out — rather than a report of elapsed work. If
		// the library pages ever become lazy routes, revisit this: the default would then
		// have real waiting to describe.
		provideHubLoadingBar({ delay: 0 }),
		provideHubLoadingBarRouter(),
		provideHttpClient(withXhr(), withInterceptors([hubLoadingBarInterceptor])),
		provideAnimations(),
		provideToast({
			positionClass: 'toast-top-right',
			progressBar: true,
			closeButton: true,
			timeOut: 5000
		}),
		provideHighlightOptions({
			coreLibraryLoader: () => import('highlight.js/lib/core'),
			languages: {
				typescript: () => import('highlight.js/lib/languages/typescript'),
				css: () => import('highlight.js/lib/languages/css'),
				scss: () => import('highlight.js/lib/languages/scss'),
				xml: () => import('highlight.js/lib/languages/xml'),
				// The installer is a command-line tool: its examples are shell transcripts and the
				// `package.json` the schematic writes, and an unregistered language renders unhighlighted.
				bash: () => import('highlight.js/lib/languages/bash'),
				json: () => import('highlight.js/lib/languages/json')
			}
		}),
		provideClientHydration(withEventReplay())
	]
};
