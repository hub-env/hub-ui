import { Type } from '@angular/core';
import { Route, Routes } from '@angular/router';
import { appLangGuard } from './services/app-lang.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';

// Pages
import { AvatarComponent } from './pages/avatar/avatar.component';
import { BoardComponent } from './pages/board/board.component';
import { BreadcrumbsComponent } from './pages/breadcrumbs/breadcrumbs.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { HistoryComponent } from './pages/history/history.component';
import { AboutComponent } from './pages/about/about.component';
import { HomeComponent } from './pages/home/home.component';
import { TokensComponent } from './pages/tokens/tokens.component';
import { DesignSystemComponent } from './pages/design-system/design-system.component';
import { ThemingComponent } from './pages/theming/theming.component';
import { ModalComponent } from './pages/modal/modal.component';
import { PortalComponent } from './pages/portal/portal.component';
import { TableComponent } from './pages/table/table.component';
import { UtilsComponent } from './pages/utils/utils.component';
import { SortableComponent } from './pages/sortable/sortable.component';
import { StepperComponent } from './pages/stepper/stepper.component';
import { NavComponent } from './pages/nav/nav.component';
import { SkeletonComponent } from './pages/skeleton/skeleton.component';
import { PanelsComponent } from './pages/panels/panels.component';
import { FormsComponent } from './pages/forms/forms.component';
import { MilestonesComponent } from './pages/milestones/milestones.component';
import { ToastDocsComponent } from './pages/toast/toast.component';
import { ButtonsDocsComponent } from './pages/buttons/buttons.component';
import { BadgesDocsComponent } from './pages/badges/badges.component';
import { IconsComponent } from './pages/icons/icons.component';
import { MetricsComponent } from './pages/metrics/metrics.component';
import { SignatureComponent } from './pages/signature/signature.component';
import { ActionSheetComponent } from './pages/action-sheet/action-sheet.component';
import { LoadingComponent } from './pages/loading/loading.component';
import { InstallerComponent } from './pages/installer/installer.component';
import { I18nGuideComponent } from './pages/i18n/i18n.component';

// API Pages
import { ModalApiComponent } from './pages/api/modal/modal-api.component';

import { type LibrarySeoKey, type SeoRouteData, type StaticSeoPageId } from './seo/seo.config';
import { DEFAULT_APP_LANG, SUPPORTED_APP_LANGS } from './services/app-i18n.service';

/**
 * Creates route SEO metadata for static pages.
 *
 * @param pageId Static page identifier.
 * @returns Route data object consumed by the SEO service.
 */
function createStaticSeoData(pageId: StaticSeoPageId): { seo: SeoRouteData } {
	return {
		seo: {
			type: 'static',
			pageId
		}
	};
}

/**
 * Creates a standard documentation route for a library landing page.
 *
 * @param path Public route segment.
 * @param component Standalone page component.
 * @param libraryKey SEO library identifier.
 * @returns Standardized route tree for tabbed library pages.
 */
function createLibraryRoute(path: string, component: Type<unknown>, libraryKey: LibrarySeoKey): Route {
	return {
		path,
		children: [
			{ path: '', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'functionalities', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'styling', redirectTo: 'api', pathMatch: 'full' },
			{
				path: 'overview',
				component,
				data: {
					seo: {
						type: 'library',
						libraryKey
					} satisfies SeoRouteData
				}
			},
			{
				path: 'api',
				component,
				data: {
					seo: {
						type: 'library',
						libraryKey
					} satisfies SeoRouteData
				}
			},
			{
				path: 'styles',
				component,
				data: {
					seo: {
						type: 'library',
						libraryKey
					} satisfies SeoRouteData
				}
			},
			{
				path: 'examples',
				component,
				data: {
					seo: {
						type: 'library',
						libraryKey
					} satisfies SeoRouteData
				}
			},
			{
				path: 'playground',
				component,
				data: {
					seo: {
						type: 'library',
						libraryKey
					} satisfies SeoRouteData
				}
			}
		]
	};
}

/**
 * Creates the route tree for a documented package that has no component API.
 *
 * The installer is a command-line schematic: no inputs, no outputs, no template slots and no
 * custom properties. Given the standard five tabs it would publish an API page and a Styles
 * page carrying one heading each and nothing under them — and prerender both. It gets the two
 * tabs it can fill, and the other three redirect to the overview so a guessed or bookmarked
 * URL still lands on the page rather than on the not-found catch-all.
 *
 * @param path Public route segment.
 * @param component Standalone page component.
 * @param libraryKey SEO library identifier.
 * @returns Route tree with Overview and Examples only.
 */
function createToolRoute(path: string, component: Type<unknown>, libraryKey: LibrarySeoKey): Route {
	const seo = { seo: { type: 'library', libraryKey } satisfies SeoRouteData };

	return {
		path,
		children: [
			{ path: '', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'functionalities', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'api', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'styles', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'styling', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'playground', redirectTo: 'overview', pathMatch: 'full' },
			{ path: 'overview', component, data: seo },
			{ path: 'examples', component, data: seo }
		]
	};
}

/**
 * Creates compatibility redirects for old non-localized library URLs.
 *
 * @param path Library route segment.
 * @returns Redirect routes preserving the existing public URL shape.
 */
function createLegacyLibraryRedirects(path: string): Routes {
	// redirectTo must be absolute: a relative target on a nested legacy path
	// (`buttons/overview`) resolves against the matched parent segment and
	// produces a broken `/buttons/en/buttons/overview` redirect.
	return [
		{ path, redirectTo: `/${DEFAULT_APP_LANG}/${path}/overview`, pathMatch: 'full' },
		{ path: `${path}/overview`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/overview`, pathMatch: 'full' },
		{ path: `${path}/api`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/api`, pathMatch: 'full' },
		{ path: `${path}/styles`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/styles`, pathMatch: 'full' },
		{ path: `${path}/examples`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/examples`, pathMatch: 'full' },
		{ path: `${path}/playground`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/playground`, pathMatch: 'full' },
		{ path: `${path}/functionalities`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/overview`, pathMatch: 'full' },
		{ path: `${path}/styling`, redirectTo: `/${DEFAULT_APP_LANG}/${path}/api`, pathMatch: 'full' }
	];
}

const localizedRoutes: Routes = [
	{ path: '', component: HomeComponent, data: createStaticSeoData('home') },

	// Home
	{ path: 'home', redirectTo: '', pathMatch: 'full' },

	// About
	{ path: 'about', component: AboutComponent, data: createStaticSeoData('about') },

	// Legal pages
	{ path: 'privacy', loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyPolicyComponent) },
	{ path: 'cookies', loadComponent: () => import('./pages/cookies/cookies.component').then((m) => m.CookiePolicyComponent) },

	// Design system guide + design tokens reference
	{ path: 'design-system', component: DesignSystemComponent, data: createStaticSeoData('design_system') },
	{ path: 'tokens', component: TokensComponent, data: createStaticSeoData('tokens') },
	{ path: 'theming', component: ThemingComponent, data: createStaticSeoData('theming') },
	{ path: 'i18n', component: I18nGuideComponent, data: createStaticSeoData('i18n') },

	// Library Pages
	createLibraryRoute('panels', PanelsComponent, 'panels'),
	createLibraryRoute('forms', FormsComponent, 'forms'),
	createLibraryRoute('icons', IconsComponent, 'icons'),
	createLibraryRoute('metrics', MetricsComponent, 'metrics'),
	createLibraryRoute('signature', SignatureComponent, 'signature'),
	createLibraryRoute('milestones', MilestonesComponent, 'milestones'),
	createLibraryRoute('action-sheet', ActionSheetComponent, 'action-sheet'),
	createToolRoute('installer', InstallerComponent, 'installer'),
	createLibraryRoute('avatar', AvatarComponent, 'avatar'),
	createLibraryRoute('board', BoardComponent, 'board'),
	createLibraryRoute('badges', BadgesDocsComponent, 'badges'),
	createLibraryRoute('breadcrumbs', BreadcrumbsComponent, 'breadcrumbs'),
	createLibraryRoute('calendar', CalendarComponent, 'calendar'),
	createLibraryRoute('history', HistoryComponent, 'history'),
	createLibraryRoute('loading', LoadingComponent, 'loading'),
	createLibraryRoute('modal', ModalComponent, 'modal'),
	createLibraryRoute('paginable', TableComponent, 'paginable'),
	createLibraryRoute('portal', PortalComponent, 'portal'),
	createLibraryRoute('utils', UtilsComponent, 'utils'),
	createLibraryRoute('sortable', SortableComponent, 'sortable'),
	createLibraryRoute('nav', NavComponent, 'nav'),
	createLibraryRoute('skeleton', SkeletonComponent, 'skeleton'),
	createLibraryRoute('stepper', StepperComponent, 'stepper'),
	createLibraryRoute('toast', ToastDocsComponent, 'toast'),
	createLibraryRoute('buttons', ButtonsDocsComponent, 'buttons'),

	// API Pages
	{ path: 'api/modal', component: ModalApiComponent },

	// Catch-all: render a real not-found page (noindex) instead of silently
	// redirecting to home, so unknown URLs stop masquerading as content.
	{ path: '**', component: NotFoundComponent, data: { seo: { type: 'notFound' } satisfies SeoRouteData } }
];

export const routes: Routes = [
	{ path: '', redirectTo: DEFAULT_APP_LANG, pathMatch: 'full' },
	{ path: 'home', redirectTo: DEFAULT_APP_LANG, pathMatch: 'full' },
	{ path: 'about', redirectTo: `${DEFAULT_APP_LANG}/about`, pathMatch: 'full' },
	{ path: 'privacy', redirectTo: `${DEFAULT_APP_LANG}/privacy`, pathMatch: 'full' },
	{ path: 'cookies', redirectTo: `${DEFAULT_APP_LANG}/cookies`, pathMatch: 'full' },
	{ path: 'tokens', redirectTo: `${DEFAULT_APP_LANG}/tokens`, pathMatch: 'full' },
	{ path: 'theming', redirectTo: `${DEFAULT_APP_LANG}/theming`, pathMatch: 'full' },
	...createLegacyLibraryRedirects('panels'),
	...createLegacyLibraryRedirects('forms'),
	...createLegacyLibraryRedirects('metrics'),
	...createLegacyLibraryRedirects('signature'),
	...createLegacyLibraryRedirects('milestones'),
	...createLegacyLibraryRedirects('avatar'),
	...createLegacyLibraryRedirects('board'),
	...createLegacyLibraryRedirects('badges'),
	...createLegacyLibraryRedirects('breadcrumbs'),
	...createLegacyLibraryRedirects('calendar'),
	...createLegacyLibraryRedirects('history'),
	...createLegacyLibraryRedirects('installer'),
	...createLegacyLibraryRedirects('loading'),
	...createLegacyLibraryRedirects('modal'),
	...createLegacyLibraryRedirects('nav'),
	...createLegacyLibraryRedirects('skeleton'),
	...createLegacyLibraryRedirects('paginable'),
	...createLegacyLibraryRedirects('portal'),
	...createLegacyLibraryRedirects('sortable'),
	...createLegacyLibraryRedirects('stepper'),
	...createLegacyLibraryRedirects('toast'),
	...createLegacyLibraryRedirects('utils'),
	...createLegacyLibraryRedirects('buttons'),
	...createLegacyLibraryRedirects('icons'),
	...SUPPORTED_APP_LANGS.map((lang) => ({
		path: lang,
		// Awaits the language's lazy dictionary before anything under it renders
		// (SSR serializes localized; client switches never flash the EN fallback).
		canActivate: [appLangGuard],
		children: localizedRoutes
	})),
	// Top-level catch-all for URLs without a language prefix.
	{ path: '**', component: NotFoundComponent, data: { seo: { type: 'notFound' } satisfies SeoRouteData } }
];
