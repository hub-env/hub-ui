import { Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library, LibraryMixins } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicUsageLoadingExampleComponent } from '../examples/loading/basic-usage-loading-example.component';
import { BrandedImageLoadingExampleComponent } from '../examples/loading/branded-image-loading-example.component';
import { ContainerOverlayLoadingExampleComponent } from '../examples/loading/container-overlay-loading-example.component';
import { DeterminateBarLoadingExampleComponent } from '../examples/loading/determinate-bar-loading-example.component';
import { CssVariablesLoadingExampleComponent } from '../examples/loading/css-variables-loading-example.component';
import { FullscreenServiceLoadingExampleComponent } from '../examples/loading/fullscreen-service-loading-example.component';
import { IndicatorVariantsLoadingExampleComponent } from '../examples/loading/indicator-variants-loading-example.component';
import { PageProgressLoadingExampleComponent } from '../examples/loading/page-progress-loading-example.component';
import { RouterHttpBarLoadingExampleComponent } from '../examples/loading/router-http-bar-loading-example.component';
import { RtlSweepLoadingExampleComponent } from '../examples/loading/rtl-sweep-loading-example.component';
import { LOADING_FUNCTIONALITIES } from './loading-functionalities';
import { LOADING_PLAYGROUND } from './loading-playground';

/**
 * Shape every example component satisfies: the code snippets are read from the class itself,
 * never from an instance, because one of these examples injects `HubLoadingService` and
 * instantiating it outside an injection context throws.
 */
type ExampleType = Type<unknown> & { templateCode?: string; componentCode?: string };

/** Live preview component for each registered example id. */
const LOADING_PREVIEW_COMPONENTS: Record<string, ExampleType> = {
	'loading-basic-usage': BasicUsageLoadingExampleComponent,
	'loading-indicator-variants': IndicatorVariantsLoadingExampleComponent,
	'loading-container-overlay': ContainerOverlayLoadingExampleComponent,
	'loading-fullscreen-service': FullscreenServiceLoadingExampleComponent,
	'loading-branded-image': BrandedImageLoadingExampleComponent,
	'loading-css-variables': CssVariablesLoadingExampleComponent,
	'loading-page-progress': PageProgressLoadingExampleComponent,
	'loading-determinate-bar': DeterminateBarLoadingExampleComponent,
	'loading-router-http-bar': RouterHttpBarLoadingExampleComponent,
	'loading-rtl-sweep': RtlSweepLoadingExampleComponent
};

/** Module path of each example, used to render its import line under the feature guides. */
const LOADING_EXAMPLE_PATHS: Record<string, string> = {
	'loading-basic-usage': 'basic-usage-loading-example.component',
	'loading-indicator-variants': 'indicator-variants-loading-example.component',
	'loading-container-overlay': 'container-overlay-loading-example.component',
	'loading-fullscreen-service': 'fullscreen-service-loading-example.component',
	'loading-branded-image': 'branded-image-loading-example.component',
	'loading-css-variables': 'css-variables-loading-example.component',
	'loading-page-progress': 'page-progress-loading-example.component',
	'loading-determinate-bar': 'determinate-bar-loading-example.component',
	'loading-router-http-bar': 'router-http-bar-loading-example.component',
	'loading-rtl-sweep': 'rtl-sweep-loading-example.component'
};

/**
 * The generated mixin catalog for this library.
 *
 * Read defensively: `MD_MIXINS` is produced by `npm run docs:mixins` from the library's own
 * `_loading-theme.scss`, so the key is absent until that has run. Half a "Mixins and styles"
 * block is worse than none, hence the guard in {@link LoadingComponent.ngOnInit}.
 */
const LOADING_MIXINS: LibraryMixins | undefined = MD_MIXINS['loading'];

/**
 * Documentation page for ng-hub-ui-loading.
 */
@Component({
	selector: 'app-loading',
	standalone: true,
	imports: [LibraryPageComponent],
	template: `
		<app-library-page
			[library]="loadingLibrary"
			[package]="'loading'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		></app-library-page>
	`
})
export class LoadingComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = LOADING_PLAYGROUND;

	/** Section headings for the examples panel, shared with the app shell navigation. */
	protected readonly exampleGroups = LOADING_FUNCTIONALITIES;

	/**
	 * Complete loading library documentation payload.
	 */
	loadingLibrary: Library = {
		title: 'ng-hub-ui-loading',
		description:
			'Angular loading indicators: a block for inline regions, container overlays and the full viewport, plus the thin page-progress bar that sits under the navbar — with pure-CSS indicators, an optional brand image and reference-counted services.',
		overview: {
			text: 'A loading state is a promise about space and attention: how much room the pending content will take, and how much of the screen the reader may keep using while it arrives. This library answers both in one component. The same hub-loading renders as an inline block that reserves its own space, as an overlay confined to one positioned container, or as a fullscreen layer driven from TypeScript through HubLoadingService — whose reference counter is what keeps two concurrent requests from unblocking the screen the moment the first one finishes. Alongside it, hub-loading-bar answers the other half of the question. An indicator says the region is busy; the bar says the page is on its way, in the one place a reader already looks for that — under the navbar. It is driven by HubLoadingBarService, which counts its callers the same way, invents a percentage it never lets reach the end, and refuses to paint anything at all for work that finishes inside its grace period.',
			// Fallback only: with a SEO entry registered for this library the page reads its
			// highlight cards from SEO.LIBRARY.LOADING.HIGHLIGHT.<n> instead. Titles reuse the
			// feature keys so a card still deep-links to its section on the fallback path, while
			// the descriptions use the one-sentence HIGHLIGHT copy — FEATURE.*.DESCRIPTION is the
			// long feature-guide paragraph and overflows a highlight card.
			highlights: [
				{
					icon: 'fa-solid fa-spinner',
					title: 'DOCS.LOADING.FEATURE.INLINE_BLOCK.TITLE',
					description: 'DOCS.LOADING.FEATURE.INLINE_BLOCK.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-circle-notch',
					title: 'DOCS.LOADING.FEATURE.INDICATORS_AND_ACCENTS.TITLE',
					description: 'DOCS.LOADING.FEATURE.INDICATORS_AND_ACCENTS.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'DOCS.LOADING.FEATURE.OVERLAY_AND_FULLSCREEN.TITLE',
					description: 'DOCS.LOADING.FEATURE.OVERLAY_AND_FULLSCREEN.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'DOCS.LOADING.FEATURE.BRANDING_AND_THEMING.TITLE',
					description: 'DOCS.LOADING.FEATURE.BRANDING_AND_THEMING.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-bars-progress',
					title: 'DOCS.LOADING.FEATURE.PAGE_PROGRESS_BAR.TITLE',
					description: 'DOCS.LOADING.FEATURE.PAGE_PROGRESS_BAR.HIGHLIGHT'
				}
			],
			changelog: [
				{
					version: '22.2.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'<hub-loading> and <hub-loading-bar> keep their stylesheets to themselves. Both shipped with ViewEncapsulation.None, and neither reason recorded for it held any more. Retheming from a global stylesheet is answered by the tokens, not by the encapsulation mode: they are declared on the host at zero specificity, a custom property inherits down to every element inside, and a rule written against .hub-loading still reaches the host because the class is on the host element. And the overlay HubLoadingService mounts on document.body is a real component instance created through createComponent(), so it carries its own stylesheet with it. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								"The bar's RTL rule is written as :host-context([dir='rtl']). It was a hand-written pair of selectors, one for the attribute on an ancestor and one for the attribute on the bar itself, because dir is inherited and both spellings are legitimate. :host-context() is exactly that pair, and under emulated encapsulation Angular now compiles it, which it never did while the component was unencapsulated. Same behaviour, one selector."
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). Both stylesheets have always resolved their defaults through the --hub-sys-* / --hub-ref-* ladder and the manifest said nothing about it, so a consumer reading the package on npm could not tell that installing the token package is what hands the indicator and the bar the family palette and its dark mode. It stays optional: every token carries a literal fallback and the library renders without it.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'Both READMEs now document the BEM classes of the loading bar and add a Right-to-left section explaining that the indeterminate sweep reverses under dir="rtl" so it travels with the text. Both have worked since 22.1.0 with nothing in the documentation to find them by, which is the same as not having them.'
						},
						{
							type: 'changed',
							description:
								'rxjs is now declared as a peer dependency, because hubLoadingBarInterceptor imports finalize from it on the published path and a strict installer such as pnpm with hoisting turned off had no reason to resolve it. Nothing changes under npm or yarn, where rxjs arrives hoisted as a peer of @angular/core.'
						},
						{
							type: 'fixed',
							description:
								'The Angular badge and the opening line of both READMEs say 21+, the range package.json has always declared. Claiming 22+ turned away an application on Angular 21 that the library supports.'
						},
						{
							type: 'fixed',
							description:
								'HubLoadingService.isLoading is described as what it computes, the reference counter rather than the mounted overlay. The README contradicted itself, since its own SSR section already explained that on the server the counter runs while the mount is skipped.'
						},
						{
							type: 'fixed',
							description:
								'FUNCTIONALITIES.md marks the ariaLabel of hub-loading as covered, which the Inline playground control has made true since the page shipped, and adds the RTL row of the bar so the file stops omitting behaviour the stylesheet has.'
						},
						{
							type: 'fixed',
							description:
								'Calling HubLoadingService.hide(), HubLoadingBarService.complete() or HubLoadingBarService.inc() from inside an effect() no longer subscribes that effect to the internal state of the service. Each of those paths read a tracked signal to decide what to do next, the counter, whether the bar is on screen, the current fill, so the effect woke up on state it does not own: a show() from anywhere else re-ran it and retired a reference it never registered, and inc() re-entered itself on every step. The untracked read that already guarded the bar counter now covers the three places that were left out.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-09-05',
					changes: [
						{
							type: 'added',
							description:
								'hub-loading-bar: the thin page-progress strip that sits under the navbar, in three placements — inline in the flow, overlay against a positioned ancestor, or fixed to the viewport at --hub-loading-bar-offset.'
						},
						{
							type: 'added',
							description:
								'HubLoadingBarService, with reference-counted start() / complete(), an anti-flicker grace period so fast work never paints a bar at all — set delay to 0 to opt out and reveal synchronously — and a trickle that decelerates as it fills and stops short of the end, since only complete() may show 100%.'
						},
						{
							type: 'added',
							description:
								'provideHubLoadingBarRouter(), which runs the bar for the length of a navigation, including one a guard rejects, and hubLoadingBarInterceptor with withoutHubLoadingBar() to keep polls and heartbeats out of the count.'
						},
						{
							type: 'added',
							description:
								'Determinate mode through the progress input, which publishes aria-valuenow, and an indeterminate sweep. Both withhold the value while the number is invented, which is how ARIA marks a progressbar of unknown position.'
						},
						{
							type: 'added',
							description:
								'provideHubLoadingBar(), the HUB_LOADING_BAR_CONFIG token, the exported hubLoadingBarTrickle() curve, thirteen --hub-loading-bar-* tokens and the hub-loading-bar-theme() Sass mixin.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-08-24',
					changes: [
						{
							type: 'added',
							description:
								'Initial release of hub-loading: one component covering the inline block, the container overlay and the fullscreen layer, with role="status", aria-live="polite" and aria-busy set on the host.'
						},
						{
							type: 'added',
							description:
								'Five pure-CSS indicators — spinner, dots, bars, pulse and ring — in three size steps, with no image or font dependency.'
						},
						{
							type: 'added',
							description:
								'Accent resolution through resolveHubAccent() from ng-hub-ui-utils: a bare name becomes a --hub-sys-color-* token and follows the theme, while a hex, an oklch() or a var(...) is used verbatim.'
						},
						{
							type: 'added',
							description:
								'Optional image input with none, spin and pulse animations, replacing the built-in indicator with a brand mark.'
						},
						{
							type: 'added',
							description:
								'HubLoadingService for the fullscreen overlay, with a reference counter so concurrent callers cannot unblock the screen out from under each other, plus update() to re-dress the live overlay and hideAll() to force the count to zero. SSR-safe: a no-op without a DOM.'
						},
						{
							type: 'added',
							description:
								'provideHubLoading() and the HUB_LOADING_CONFIG token, supplying application-wide defaults to both the component and the service.'
						},
						{
							type: 'added',
							description:
								'Theming through the --hub-loading-* token ladder and the hub-loading-theme() Sass mixin, shipped at ng-hub-ui-loading/styles.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'hub-loading · mode',
					type: `'inline' | 'overlay' | 'fullscreen'`,
					required: false,
					defaultValue: `'inline'`,
					description: 'DOCS.LOADING.API.INPUT.MODE.DESCRIPTION'
				},
				{
					name: 'hub-loading · variant',
					type: `'spinner' | 'dots' | 'bars' | 'pulse' | 'ring'`,
					required: false,
					defaultValue: `'spinner'`,
					description: 'DOCS.LOADING.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'hub-loading · image',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.LOADING.API.INPUT.IMAGE.DESCRIPTION'
				},
				{
					name: 'hub-loading · imageAnimation',
					type: `'none' | 'spin' | 'pulse'`,
					required: false,
					defaultValue: `'none'`,
					description: 'DOCS.LOADING.API.INPUT.IMAGE_ANIMATION.DESCRIPTION'
				},
				{
					name: 'hub-loading · message',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.LOADING.API.INPUT.MESSAGE.DESCRIPTION'
				},
				{
					name: 'hub-loading · size',
					type: `'sm' | 'md' | 'lg'`,
					required: false,
					defaultValue: `'md'`,
					description: 'DOCS.LOADING.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'hub-loading · color',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.LOADING.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'hub-loading · backdrop',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.LOADING.API.INPUT.BACKDROP.DESCRIPTION'
				},
				{
					name: 'hub-loading · ariaLabel',
					type: 'string',
					required: false,
					defaultValue: `'Loading'`,
					description: 'DOCS.LOADING.API.INPUT.ARIA_LABEL.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · mode',
					type: `'inline' | 'overlay' | 'fixed'`,
					required: false,
					defaultValue: `'inline'`,
					description: 'DOCS.LOADING.API.INPUT.BAR_MODE.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · placement',
					type: `'top' | 'bottom'`,
					required: false,
					defaultValue: `'top'`,
					description: 'DOCS.LOADING.API.INPUT.BAR_PLACEMENT.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · progress',
					type: 'number | null | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.LOADING.API.INPUT.BAR_PROGRESS.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · indeterminate',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.LOADING.API.INPUT.BAR_INDETERMINATE.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · glow',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.LOADING.API.INPUT.BAR_GLOW.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · color',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.LOADING.API.INPUT.BAR_COLOR.DESCRIPTION'
				},
				{
					name: 'hub-loading-bar · ariaLabel',
					type: 'string',
					required: false,
					defaultValue: `'Loading'`,
					description: 'DOCS.LOADING.API.INPUT.BAR_ARIA_LABEL.DESCRIPTION'
				}
			],
			outputs: [],
			methods: [
				{
					name: 'HubLoadingService.show',
					signature: 'show(options?: HubLoadingOptions): void',
					description: 'DOCS.LOADING.API.METHOD.SHOW.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingService.hide',
					signature: 'hide(): void',
					description: 'DOCS.LOADING.API.METHOD.HIDE.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingService.hideAll',
					signature: 'hideAll(): void',
					description: 'DOCS.LOADING.API.METHOD.HIDE_ALL.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingService.update',
					signature: 'update(options: HubLoadingOptions): void',
					description: 'DOCS.LOADING.API.METHOD.UPDATE.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingService.isLoading',
					signature: 'isLoading: Signal<boolean>',
					description: 'DOCS.LOADING.API.METHOD.IS_LOADING.DESCRIPTION',
					returns: 'Signal<boolean> — true while at least one reference is held'
				},
				{
					name: 'HubLoadingBarService.start',
					signature: 'start(): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_START.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.complete',
					signature: 'complete(): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_COMPLETE.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.completeAll',
					signature: 'completeAll(): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_COMPLETE_ALL.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.set',
					signature: 'set(value: number): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_SET.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.inc',
					signature: 'inc(amount?: number): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_INC.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.reset',
					signature: 'reset(): void',
					description: 'DOCS.LOADING.API.METHOD.BAR_RESET.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubLoadingBarService.progress',
					signature: 'progress: Signal<number>',
					description: 'DOCS.LOADING.API.METHOD.BAR_PROGRESS.DESCRIPTION',
					returns: 'Signal<number> — the current fill, 0–100'
				},
				{
					name: 'HubLoadingBarService.isActive',
					signature: 'isActive: Signal<boolean>',
					description: 'DOCS.LOADING.API.METHOD.BAR_IS_ACTIVE.DESCRIPTION',
					returns: 'Signal<boolean> — true while at least one caller is waiting'
				},
				{
					name: 'HubLoadingBarService.isVisible',
					signature: 'isVisible: Signal<boolean>',
					description: 'DOCS.LOADING.API.METHOD.BAR_IS_VISIBLE.DESCRIPTION',
					returns: 'Signal<boolean> — true only while the bar is painted'
				}
			],
			templates: [
				{
					name: 'DOCS.LOADING.API.TEMPLATE.0.NAME',
					description: 'DOCS.LOADING.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-loading message="Importing rows"><button type="button">Cancel</button></hub-loading>`
				},
				{
					name: 'provideHubLoading',
					description: 'DOCS.LOADING.API.TEMPLATE.1.DESCRIPTION',
					example: `providers: [provideHubLoading({ variant: 'ring', size: 'lg' })]`
				},
				{
					name: 'DOCS.LOADING.API.TEMPLATE.2.NAME',
					description: 'DOCS.LOADING.API.TEMPLATE.2.DESCRIPTION',
					example: `<nav class="navbar position-relative">\n\t<hub-loading-bar mode="overlay" placement="bottom" />\n</nav>`
				},
				{
					name: 'provideHubLoadingBarRouter',
					description: 'DOCS.LOADING.API.TEMPLATE.3.DESCRIPTION',
					example: `providers: [provideRouter(routes), provideHubLoadingBarRouter()]`
				},
				{
					name: 'hubLoadingBarInterceptor',
					description: 'DOCS.LOADING.API.TEMPLATE.4.DESCRIPTION',
					example: `provideHttpClient(withInterceptors([hubLoadingBarInterceptor]))`
				},
				{
					name: 'withoutHubLoadingBar',
					description: 'DOCS.LOADING.API.TEMPLATE.5.DESCRIPTION',
					example: `this.http.get('/api/heartbeat', { context: withoutHubLoadingBar() })`
				},
				{
					name: 'provideHubLoadingBar',
					description: 'DOCS.LOADING.API.TEMPLATE.6.DESCRIPTION',
					example: `providers: [provideHubLoadingBar({ color: 'primary', delay: 120 })]`
				}
			],
			cssVariables: MD_CSS_VARIABLES['loading'] ?? []
		},
		styling: []
	};

	/**
	 * Angular lifecycle hook. Registers the interactive examples and builds the grouped
	 * functionalities shown on the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();

		if (LOADING_MIXINS) {
			this.loadingLibrary.mixins = LOADING_MIXINS;
		}
	}

	/**
	 * Registers every loading example with the shared example registry so the example viewer
	 * can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'loading-basic-usage',
				title: 'DOCS.LOADING.EXAMPLE.BASIC_USAGE.TITLE',
				componentName: 'BasicUsageLoadingExampleComponent',
				files: ['basic-usage-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/basic-usage-loading-example.component').then(
						(m) => m.BasicUsageLoadingExampleComponent
					)
			},
			{
				id: 'loading-indicator-variants',
				title: 'DOCS.LOADING.EXAMPLE.INDICATOR_VARIANTS.TITLE',
				componentName: 'IndicatorVariantsLoadingExampleComponent',
				files: ['indicator-variants-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/indicator-variants-loading-example.component').then(
						(m) => m.IndicatorVariantsLoadingExampleComponent
					)
			},
			{
				id: 'loading-container-overlay',
				title: 'DOCS.LOADING.EXAMPLE.CONTAINER_OVERLAY.TITLE',
				componentName: 'ContainerOverlayLoadingExampleComponent',
				files: ['container-overlay-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/container-overlay-loading-example.component').then(
						(m) => m.ContainerOverlayLoadingExampleComponent
					)
			},
			{
				id: 'loading-fullscreen-service',
				title: 'DOCS.LOADING.EXAMPLE.FULLSCREEN_SERVICE.TITLE',
				componentName: 'FullscreenServiceLoadingExampleComponent',
				files: ['fullscreen-service-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/fullscreen-service-loading-example.component').then(
						(m) => m.FullscreenServiceLoadingExampleComponent
					)
			},
			{
				id: 'loading-branded-image',
				title: 'DOCS.LOADING.EXAMPLE.BRANDED_IMAGE.TITLE',
				componentName: 'BrandedImageLoadingExampleComponent',
				files: ['branded-image-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/branded-image-loading-example.component').then(
						(m) => m.BrandedImageLoadingExampleComponent
					)
			},
			{
				id: 'loading-css-variables',
				title: 'DOCS.LOADING.EXAMPLE.CSS_VARIABLES.TITLE',
				componentName: 'CssVariablesLoadingExampleComponent',
				files: ['css-variables-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/css-variables-loading-example.component').then(
						(m) => m.CssVariablesLoadingExampleComponent
					)
			},
			{
				id: 'loading-page-progress',
				title: 'DOCS.LOADING.EXAMPLE.PAGE_PROGRESS.TITLE',
				componentName: 'PageProgressLoadingExampleComponent',
				files: ['page-progress-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/page-progress-loading-example.component').then(
						(m) => m.PageProgressLoadingExampleComponent
					)
			},
			{
				id: 'loading-determinate-bar',
				title: 'DOCS.LOADING.EXAMPLE.DETERMINATE_BAR.TITLE',
				componentName: 'DeterminateBarLoadingExampleComponent',
				files: ['determinate-bar-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/determinate-bar-loading-example.component').then(
						(m) => m.DeterminateBarLoadingExampleComponent
					)
			},
			{
				id: 'loading-router-http-bar',
				title: 'DOCS.LOADING.EXAMPLE.ROUTER_HTTP_BAR.TITLE',
				componentName: 'RouterHttpBarLoadingExampleComponent',
				files: ['router-http-bar-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/router-http-bar-loading-example.component').then(
						(m) => m.RouterHttpBarLoadingExampleComponent
					)
			},
			{
				id: 'loading-rtl-sweep',
				title: 'DOCS.LOADING.EXAMPLE.RTL_SWEEP.TITLE',
				componentName: 'RtlSweepLoadingExampleComponent',
				files: ['rtl-sweep-loading-example.component.ts'],
				loader: () =>
					import('../examples/loading/rtl-sweep-loading-example.component').then(
						(m) => m.RtlSweepLoadingExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'loading'
			});
		});
	}

	/**
	 * Builds the grouped feature list, attaching a live preview component to each example so
	 * the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalities(): void {
		this.loadingLibrary.functionalities = LOADING_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => this.createExample(id))
				.filter((example): example is FeatureExample => example !== null)
		}));
	}

	/**
	 * Builds one feature example from the registry entry and the example class.
	 *
	 * Snippets are read from the STATIC `templateCode` / `componentCode` properties rather than
	 * from an instance: the fullscreen example injects `HubLoadingService`, and `new Example()`
	 * outside an injection context would throw and take the whole Overview tab down with it.
	 *
	 * @param exampleId Registered example id.
	 * @returns Populated feature example, or null when the id is not registered.
	 */
	private createExample(exampleId: string): FeatureExample | null {
		const registered = this.exampleRegistry.get(exampleId);
		const component = LOADING_PREVIEW_COMPONENTS[exampleId];

		if (!registered || !component) {
			return null;
		}

		return {
			title: registered.title,
			description: `DOCS.LOADING.EXAMPLE.${this.descriptionKeySegment(exampleId)}.DESCRIPTION`,
			import: `import { ${component.name} } from './${LOADING_EXAMPLE_PATHS[exampleId]}';`,
			template: component.templateCode ?? '',
			component: component.componentCode ?? '',
			previewComponent: component
		};
	}

	/**
	 * Converts a registered example id into the SCREAMING_SNAKE_CASE segment its i18n keys use,
	 * so the id stays the single source of truth for both.
	 *
	 * @param exampleId Registered example id, e.g. `loading-container-overlay`.
	 * @returns Key segment, e.g. `CONTAINER_OVERLAY`.
	 */
	private descriptionKeySegment(exampleId: string): string {
		return exampleId
			.replace(/^loading-/, '')
			.replace(/-/g, '_')
			.toUpperCase();
	}
}
