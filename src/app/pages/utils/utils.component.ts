import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { PipesUtilsExampleComponent } from '../examples/utils/pipes-utils-example.component';
import { TranslationUtilsExampleComponent } from '../examples/utils/translation-utils-example.component';
import { ExternalTranslationAdapterUtilsExampleComponent } from '../examples/utils/external-translation-adapter-utils-example.component';
import { FunctionsUtilsExampleComponent } from '../examples/utils/functions-utils-example.component';
import { FocusTrapUtilsExampleComponent } from '../examples/utils/focus-trap-utils-example.component';
import { ScrollbarUtilsExampleComponent } from '../examples/utils/scrollbar-utils-example.component';
import { OverlayUtilsExampleComponent } from '../examples/utils/overlay-utils-example.component';
import { TooltipUtilsExampleComponent } from '../examples/utils/tooltip-utils-example.component';
import { PopupUtilsExampleComponent } from '../examples/utils/popup-utils-example.component';
import { TransitionsUtilsExampleComponent } from '../examples/utils/transitions-utils-example.component';
import { DomUtilsExampleComponent } from '../examples/utils/dom-utils-example.component';
import { ColorParsingUtilsExampleComponent } from '../examples/utils/color-parsing-utils-example.component';
import { ColorContrastUtilsExampleComponent } from '../examples/utils/color-contrast-utils-example.component';
import { ColorGamutUtilsExampleComponent } from '../examples/utils/color-gamut-utils-example.component';
import { ColorPaletteUtilsExampleComponent } from '../examples/utils/color-palette-utils-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const UTILS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'utils-pipes': PipesUtilsExampleComponent,
	'utils-translation': TranslationUtilsExampleComponent,
	'utils-external-translation-adapter': ExternalTranslationAdapterUtilsExampleComponent,
	'utils-functions': FunctionsUtilsExampleComponent,
	'utils-focus-trap': FocusTrapUtilsExampleComponent,
	'utils-scrollbar': ScrollbarUtilsExampleComponent,
	'utils-overlay': OverlayUtilsExampleComponent,
	'utils-tooltip': TooltipUtilsExampleComponent,
	'utils-popup': PopupUtilsExampleComponent,
	'utils-transitions': TransitionsUtilsExampleComponent,
	'utils-dom': DomUtilsExampleComponent,
	'utils-color-parsing': ColorParsingUtilsExampleComponent,
	'utils-color-contrast': ColorContrastUtilsExampleComponent,
	'utils-color-gamut': ColorGamutUtilsExampleComponent,
	'utils-color-palette': ColorPaletteUtilsExampleComponent
};

/**
 * Maps each manually-authored feature-guide example (grouped by functionality)
 * to the registered example id whose standalone component best demonstrates it.
 * Used to attach a live `previewComponent` to every feature example.
 */
const UTILS_FEATURE_EXAMPLE_IDS: Record<string, string> = {
	// Focus Management
	'DOCS.UTILS.FEATURE.FOCUS_TRAP.TITLE': 'utils-focus-trap',
	'DOCS.UTILS.FEATURE.FOCUSABLE_ELEMENTS.TITLE': 'utils-focus-trap',
	// Internationalization (i18n)
	'DOCS.UTILS.FEATURE.TRANSLATION_SERVICE.TITLE': 'utils-translation',
	'DOCS.UTILS.FEATURE.TRANSLATE_PIPE.TITLE': 'utils-translation',
	'DOCS.UTILS.FEATURE.TRANSLATION_PROVIDER.TITLE': 'utils-translation',
	'DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.TITLE': 'utils-external-translation-adapter',
	// Overlay System
	'DOCS.UTILS.FEATURE.OVERLAY_SERVICE.TITLE': 'utils-overlay',
	'DOCS.UTILS.FEATURE.OVERLAY_REFERENCE.TITLE': 'utils-overlay',
	'DOCS.UTILS.FEATURE.POSITIONING.TITLE': 'utils-overlay',
	// Popup Service
	'DOCS.UTILS.FEATURE.POPUP_CREATION.TITLE': 'utils-popup',
	// Pipes
	'DOCS.UTILS.FEATURE.TYPE_CHECKING_PIPES.TITLE': 'utils-pipes',
	'DOCS.UTILS.FEATURE.GETPIPE.TITLE': 'utils-pipes',
	'DOCS.UTILS.FEATURE.UCFIRSTPIPE.TITLE': 'utils-pipes',
	'DOCS.UTILS.FEATURE.UNWRAPASYNCPIPE.TITLE': 'utils-pipes',
	// Utility Functions
	'DOCS.UTILS.FEATURE.TYPE_GUARDS.TITLE': 'utils-functions',
	'DOCS.UTILS.FEATURE.STRING_UTILITIES.TITLE': 'utils-functions',
	'DOCS.UTILS.FEATURE.OBJECT_UTILITIES.TITLE': 'utils-functions',
	'DOCS.UTILS.FEATURE.DOM_UTILITIES.TITLE': 'utils-dom',
	'DOCS.UTILS.FEATURE.RXJS_UTILITIES.TITLE': 'utils-dom',
	// Scrollbar Utilities
	'DOCS.UTILS.FEATURE.SCROLLBAR_WIDTH.TITLE': 'utils-scrollbar',
	// Transitions
	'DOCS.UTILS.FEATURE.RUN_TRANSITION.TITLE': 'utils-transitions',
	// Tooltip
	'DOCS.UTILS.FEATURE.TOOLTIP_DIRECTIVE.TITLE': 'utils-tooltip',
	// Color
	'DOCS.UTILS.FEATURE.COLOR_PARSING.TITLE': 'utils-color-parsing',
	'DOCS.UTILS.FEATURE.COLOR_CONTRAST.TITLE': 'utils-color-contrast',
	'DOCS.UTILS.FEATURE.COLOR_OKLCH.TITLE': 'utils-color-gamut',
	'DOCS.UTILS.FEATURE.COLOR_PALETTE.TITLE': 'utils-color-palette'
};

/**
 * Main utils library page component
 */
@Component({
	selector: 'app-utils',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <app-library-page [library]="utilsLibrary" [package]="'utils'"> </app-library-page> `
})
export class UtilsComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/**
	 * Complete utils library data
	 */
	utilsLibrary: Library = {
		title: 'ng-hub-ui-utils',
		description:
			'A comprehensive collection of utilities, services, and pipes shared across the ng-hub-ui ecosystem. Includes focus management, overlay system, i18n, and common helper functions.',
		overview: {
			text: 'This library provides the foundational utilities used by other ng-hub-ui components. It includes services for overlays and popups, pipes for data transformation, focus trap management, scrollbar utilities, and many general-purpose helper functions.',
			highlights: [
				{
					icon: 'fa-solid fa-layer-group',
					title: 'DOCS.UTILS.FEATURE.OVERLAY_SYSTEM.TITLE',
					description: 'DOCS.UTILS.FEATURE.OVERLAY_SYSTEM.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-comment',
					title: 'DOCS.UTILS.FEATURE.TOOLTIP.TITLE',
					description: 'DOCS.UTILS.FEATURE.TOOLTIP.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-keyboard',
					title: 'DOCS.UTILS.FEATURE.FOCUS_MANAGEMENT.TITLE',
					description: 'DOCS.UTILS.FEATURE.FOCUS_MANAGEMENT.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-globe',
					title: 'DOCS.UTILS.FEATURE.INTERNATIONALIZATION_I18N.TITLE',
					description: 'DOCS.UTILS.FEATURE.INTERNATIONALIZATION_I18N.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-filter',
					title: 'DOCS.UTILS.FEATURE.PIPES.TITLE',
					description: 'DOCS.UTILS.FEATURE.PIPES.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'DOCS.UTILS.FEATURE.COLOR.TITLE',
					description: 'DOCS.UTILS.FEATURE.COLOR.DESCRIPTION'
				},
				{
					icon: 'fa-solid fa-screwdriver-wrench',
					title: 'DOCS.UTILS.FEATURE.UTILITY_FUNCTIONS.TITLE',
					description: 'DOCS.UTILS.FEATURE.UTILITY_FUNCTIONS.DESCRIPTION'
				}
			],
			changelog: [
				{
					version: '22.15.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								"harmoniseSemantics() and tintNeutrals(), so a brand colour derives the whole palette in one place instead of once per product. The first rotates success, warning, danger and info towards the brand's hue; the second leans the grey ramp the same way. Both leave lightness exactly where the anchor had it, because lightness is what carries the contrast each role was chosen for. Two exported numbers decide the result: HUB_MAX_HUE_SHIFT (15°), which is what keeps success and danger more than 90° apart for a reader with deuteranopia — they start 135.8° apart and a brand hue between them closes the gap by up to twice the cap — and HUB_MAX_NEUTRAL_CHROMA (0.015), which sits between the design system's own gray-500 (0.0145) and gray-600 (0.0165), so a tinted ramp is never more colourful than the grey people already accept as grey."
						},
						{
							type: 'fixed',
							description:
								"The DOM helpers no longer reach for globals a server render does not have. ScrollBar.hide(), hubRunTransition(), getTransitionDurationMs(), reflow(), getActiveElement() and OverlayRef each read window or document straight out of scope, which is a ReferenceError on the way to a prerendered page. They now resolve the document and the view from what they already hold — the injected DOCUMENT, the application's injector, or the element's own ownerDocument.defaultView — which also fixes the same helpers inside an iframe, where the global was the wrong document all along."
						},
						{
							type: 'changed',
							description:
								'reflow() returns DOMRect | null and no longer falls back to document.body, and getActiveElement() accepts null as its root. Both are announced in BREAKING_CHANGES.md; no call that passes an element changes behaviour.'
						}
					]
				},
				{
					version: '22.14.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'removed',
							description:
								'TooltipDirective and its bare [tooltip] attribute, deprecated since 22.9.0. An unprefixed selector is a name in the application\'s namespace rather than the library\'s: Angular hands one attribute to every directive on the element that declares an input of that name, so nobody else could own a tooltip — not a consumer writing their own, not <hub-badge>, which declares a tooltip input and ended up drawing two, and not [hubDropdown], whose own placement is typed over eight values where a tooltip understands four. [hubTooltip] is the replacement, attribute for attribute: tooltip → hubTooltip, placement → hubTooltipPlacement, delay → hubTooltipDelay, offset → hubTooltipOffset. Breaking, and note that a template still writing tooltip="…" keeps compiling and silently shows nothing — see BREAKING_CHANGES.md.'
						},
						{
							type: 'added',
							description:
								"A guard over the whole entry point: no directive of this package may claim a bare attribute. It reads Angular's own compiled definitions rather than a hand-kept list, so the rule covers the directive somebody adds next and not only the one just removed."
						}
					]
				},
				{
					version: '22.13.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'added',
							description:
								'OverlayPosition.origin, the element the strategy is connected to. It was known to the strategy and to nobody else, and an overlay that has to keep up with its anchor needs to be able to ask which element that is.'
						},
						{
							type: 'fixed',
							description:
								'A floating panel stayed behind the moment its trigger moved. The overlay recomputed its position on scroll and on resize, and both of those describe the page moving under an origin that stays put. Nothing covered the opposite, the origin moving inside a page nobody scrolled and no window resized: a section collapsing above it, an image landing late, a sidebar accordion animating shut. The panel then hung at the height the trigger used to have, cut loose from the thing it belongs to, and every connected overlay in the family opens through this service, so all of them had it. The origin is now watched for as long as the panel is open and the panel is re-placed whenever its box actually changes, every frame of an animated collapse rather than once at the start of one. The box is read per frame and nothing is written unless it moved, so an overlay whose trigger sits still never touches the DOM, and the loop runs outside Angular zone so a zone-based application does not run change detection while a menu is open.'
						}
					]
				},
				{
					version: '22.12.1',
					date: '2026-09-06',
					changes: [
						{
							type: 'changed',
							description:
								'Every row of FUNCTIONALITIES.md now points at a runnable demo. Fifteen features (the popup service, the transition helpers, UnwrapAsyncPipe, the DOM and RxJS helpers and five of the colour functions) were listed as having no example, which left the unit tests as the only executable use of them. Each of those now has a demo on the documentation site, so the table reports coverage instead of a wishlist. No API changed.'
						},
						{
							type: 'fixed',
							description:
								'The tooltip and overlay stylesheets resolve at the path the documentation gives. The manifest declared no exports map, so ng-packagr synthesised one for the published package, and a synthesised map lists only "." and "./package.json". A package that declares exports closes every subpath outside that map, so @use "ng-hub-ui-utils/styles/tooltip"; resolved to nothing even though the sheet shipped in styles/. Both sheets are now named in the manifest, extensionless and with the .scss suffix, the way every sibling package in the family already does, and ng-packagr merges those entries into the map it generates instead of replacing them.'
						},
						{
							type: 'fixed',
							description:
								'The tooltip is announced to assistive technology and can be dismissed without a mouse. The bubble was a bare span with no id and no role, and the host was never pointed at it, so on an icon-only button, the case the tooltip is written for, a screen reader had nothing to read and the only workaround was an aria-label repeating the same text. The bubble is now role="tooltip" with an id the host is aria-describedby while it is on screen, and the attribute is put back exactly as it was found, so a description a consumer wrote is neither replaced nor left behind. The same change closes WCAG 1.4.13 for it: Escape dismisses the label without moving the pointer or the focus, and the label waits out a short grace period and stays put once the pointer lands on it, which is the only way to read one longer than its box. styles/tooltip.scss therefore ships pointer-events: auto instead of none, and the controller disables them again the moment it starts fading, so an invisible bubble never catches a click meant for what is under it. It is reached through HubTooltipController, so it arrives at all four entry points at once: [hubTooltip], the deprecated [tooltip], [hubOverflowTooltip] and hubTooltipAdapter.'
						}
					]
				},
				{
					version: '22.12.0',
					date: '2026-09-03',
					changes: [
						{
							type: 'added',
							description:
								'Colour utilities — parseColor(), toHex(), isValidColor(), relativeLuminance(), contrastRatio(), contrastAPCA(), readableOn(), compositeOver() and the OKLCh helpers rgbToOklch(), oklchToRgb(), maxSrgbChroma(), isInSrgbGamut() and clampToSrgbGamut(). The parser resolves hex (3/4/6/8 digits), rgb(), hsl(), oklch(), oklab() and the 148 CSS named colours in both modern and legacy syntax, with no DOM involved, so it runs under server-side rendering. It returns null rather than throwing on anything it cannot resolve.'
						},
						{
							type: 'added',
							description:
								"readableOn() picks black or white by OKLCh perceptual lightness, the same decision the --hub-sys-color-*-on token computes in CSS, so a component that resolves its ink in TypeScript cannot disagree with the stylesheet. The alternative metrics are available: maximising the WCAG 2 ratio puts black text on the design system's own blue, green and red accents, which is why it is not the default."
						}
					]
				},
				{
					version: '22.11.1',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root, so the link a registry shows beside the package lands on the reference for the package the reader was already looking at. Metadata only."
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-08-26',
					changes: [
						{
							type: 'added',
							description:
								'The overlay follows its origin. While attached it listens for scroll and resize in the capture phase and recomputes its position, coalesced into an animation frame. Before this it computed coordinates once and never again: a panel opened and then scrolled sat 122px away from the field it belonged to.'
						},
						{
							type: 'added',
							description:
								'start and end are logical. They resolved to left and right whatever the direction, so an overlay opened from a field inside an RTL container hung off the wrong edge. The direction is read from the origin element; OverlayPosition.withDirection() overrides it.'
						},
						{
							type: 'added',
							description:
								'OverlayRef.onKeydown(), and with it a document-level dispatcher that tells only the topmost open overlay. An overlay rarely holds focus, so a component listening on its own host never heard Escape and the panel that took over the screen could not be dismissed with the key everyone reaches for.'
						},
						{
							type: 'added',
							description:
								'HUB_DROPDOWN_POSITIONS — the four-position fallback chain a dropdown wants, below the origin and flipping above when there is no room, expressed logically so one list serves both text directions.'
						},
						{
							type: 'fixed',
							description:
								'Tearing an overlay down twice no longer throws. dispose() and detach() called removeChild on nodes something else may already have removed — a test teardown, a router navigation — and the DOMException took the whole destroy path with it.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-08-22',
					changes: [
						{
							type: 'added',
							description:
								'--hub-tooltip-white-space and --hub-tooltip-text-align, so how a label breaks and sits can be asked for per tooltip instead of through a global rule that changes every tooltip in the product. Both default to what was hard-coded, so nothing moves for anyone who says nothing.'
						}
					]
				},
				{
					version: '22.9.3',
					date: '2026-08-19',
					changes: [
						{
							type: 'fixed',
							description:
								'A tooltip whose stylesheet was never imported no longer moves the page. The element now takes position: absolute inline at creation — the same value the sheet ships — so it stops landing in normal flow at the end of the document and growing the page a scrollbar that appeared and vanished as the pointer crossed a label.'
						}
					]
				},
				{
					version: '22.9.2',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								"The stylesheets are published under styles/, so @use 'ng-hub-ui-utils/styles/tooltip' names a real path instead of reaching through the package's internal folder layout."
						}
					]
				},
				{
					version: '22.9.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The published package declares its licence. An absent license field is not neutral — a registry reports it as unlicensed, which legally reads as all rights reserved. The intent was always MIT.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'[hubTooltip], a tooltip directive that can share an element. Its inputs are hubTooltip, hubTooltipPlacement, hubTooltipDelay and hubTooltipOffset: an attribute named for its owner cannot be claimed by anyone else, which is what the bare names could not promise next to [hubDropdown] (its own placement is typed over eight values) or <hub-badge> (which declares a tooltip input and drew two).'
						},
						{
							type: 'deprecated',
							description:
								'TooltipDirective / [tooltip]. Kept working, unchanged — both directives are thin shells over the same HubTooltipController. Migration is attribute for attribute: tooltip → hubTooltip, placement → hubTooltipPlacement, delay → hubTooltipDelay, offset → hubTooltipOffset.'
						}
					]
				},
				{
					version: '22.8.1',
					date: '2026-08-15',
					changes: [
						{
							type: 'fixed',
							description:
								"A content-sized overlay no longer clips its own content into invisibility. Created with no intrinsic size, it computed to a 0×0 box whenever its content was absolutely positioned — which is exactly what a connected-position dropdown is — and the stylesheet's overflow: auto then hid what the overlay existed to display. An overlay created without an explicit width or height now opts out of clipping."
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'added',
							description:
								'provideHubTranslationAdapter() — the application-wide reactive bridge from an external translation service (transloco, ngx-translate, i18next…) into HubTranslationService. Register it once at bootstrap and every ng-hub-ui library picks up the host dictionary, re-emitting on every language change. Supports optional namespacing and deliberate per-label reactive overrides.'
						},
						{
							type: 'added',
							description:
								'HUB_TRANSLATION_PREFIX — injection token that scopes the lookups of a library to a collision-safe HUBUI.<LIBRARY>.* namespace. TranslatePipe resolves the prefixed key first and falls back to the bare key, so existing flat dictionaries keep working untouched.'
						}
					]
				},
				{
					version: '22.7.2',
					date: '2026-08-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Documentation links now point at the canonical localized URLs. The README linked to https://hubui.dev/<path> with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.'
						}
					]
				},
				{
					version: '22.7.1',
					date: '2026-07-27',
					changes: [
						{
							type: 'fixed',
							description:
								'--hub-overlay-zindex / --hub-overlay-backdrop-zindex actually work now: OverlayRef resolves its inline z-index through var(--hub-overlay-zindex, 1000) / var(--hub-overlay-backdrop-zindex, 999) instead of literal values, so re-stacking an overlay no longer requires !important. Defaults are unchanged.'
						},
						{
							type: 'added',
							description:
								'OverlayConfig.zIndex — optional explicit layer for a single overlay instance; when set it takes precedence over the token.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'resolveHubAccent(value) — the canonical "any colour" accent resolver shared across the ng-hub-ui family: barewords map to var(--hub-sys-color-<name>, <name>), literal #hex / rgb() / oklch() / var() values pass through unchanged, empty values yield null.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'CSS variable fallbacks realigned to the ds light defaults (e.g. --hub-ref-font-family-base falls back to the system-ui stack instead of inherit); fallbacks only apply when ng-hub-ui-ds is not loaded.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'added',
							description:
								'HubOverflowTooltipDirective ([hubOverflowTooltip]) — shows a tooltip only while the label is actually truncated, with live tracking via ResizeObserver + MutationObserver. hubOverflowTooltipMeasure splits the two questions a chip asks separately: the tooltip covers the whole control, while a CSS selector resolved inside it names the inner box whose truncation decides whether it speaks.'
						},
						{
							type: 'added',
							description:
								'Agnostic tooltip token — HUB_TOOLTIP_ADAPTER plus provideHubTooltip(adapter) let any tooltip implementation back [hubOverflowTooltip], app-wide or per subtree; defaults to the built-in hubTooltipAdapter.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [],
			outputs: [],
			templates: [],
			cssVariables: MD_CSS_VARIABLES['utils'] ?? []
		},
		styling: []
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities, preview components and API sections of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
		this.attachPreviewComponents();
		this.populateApi();
	}

	/**
	 * Attaches a live `previewComponent` to every feature-guide example whose
	 * title maps to a registered example component, removing the
	 * "Live preview is not available" placeholder in the Overview.
	 */
	private attachPreviewComponents(): void {
		this.utilsLibrary.functionalities.forEach((group) => {
			group.examples.forEach((example: FeatureExample) => {
				const exampleId = UTILS_FEATURE_EXAMPLE_IDS[example.title];
				if (exampleId) {
					example.previewComponent = UTILS_PREVIEW_COMPONENTS[exampleId];
				}
			});
		});
	}

	/**
	 * Registers every utils example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'utils-pipes',
				title: 'DOCS.UTILS.EXAMPLE.PIPES.TITLE',
				componentName: 'PipesUtilsExampleComponent',
				files: ['pipes-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/pipes-utils-example.component').then((m) => m.PipesUtilsExampleComponent)
			},
			{
				id: 'utils-translation',
				title: 'DOCS.UTILS.EXAMPLE.TRANSLATION.TITLE',
				componentName: 'TranslationUtilsExampleComponent',
				files: ['translation-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/translation-utils-example.component').then(
						(m) => m.TranslationUtilsExampleComponent
					)
			},
			{
				id: 'utils-external-translation-adapter',
				title: 'DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.TITLE',
				componentName: 'ExternalTranslationAdapterUtilsExampleComponent',
				files: ['app.config.ts', 'en.json', 'ngx-translate-equivalent.ts'],
				sourceCode: ExternalTranslationAdapterUtilsExampleComponent.sourceCode,
				loader: () =>
					import('../examples/utils/external-translation-adapter-utils-example.component').then(
						(m) => m.ExternalTranslationAdapterUtilsExampleComponent
					)
			},
			{
				id: 'utils-functions',
				title: 'DOCS.UTILS.EXAMPLE.FUNCTIONS.TITLE',
				componentName: 'FunctionsUtilsExampleComponent',
				files: ['functions-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/functions-utils-example.component').then((m) => m.FunctionsUtilsExampleComponent)
			},
			{
				id: 'utils-focus-trap',
				title: 'DOCS.UTILS.EXAMPLE.FOCUS_TRAP.TITLE',
				componentName: 'FocusTrapUtilsExampleComponent',
				files: ['focus-trap-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/focus-trap-utils-example.component').then((m) => m.FocusTrapUtilsExampleComponent)
			},
			{
				id: 'utils-scrollbar',
				title: 'DOCS.UTILS.EXAMPLE.SCROLLBAR.TITLE',
				componentName: 'ScrollbarUtilsExampleComponent',
				files: ['scrollbar-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/scrollbar-utils-example.component').then((m) => m.ScrollbarUtilsExampleComponent)
			},
			{
				id: 'utils-overlay',
				title: 'DOCS.UTILS.EXAMPLE.OVERLAY.TITLE',
				componentName: 'OverlayUtilsExampleComponent',
				files: ['overlay-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/overlay-utils-example.component').then((m) => m.OverlayUtilsExampleComponent)
			},
			{
				id: 'utils-tooltip',
				title: 'DOCS.UTILS.EXAMPLE.TOOLTIP.TITLE',
				componentName: 'TooltipUtilsExampleComponent',
				files: ['tooltip-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/tooltip-utils-example.component').then((m) => m.TooltipUtilsExampleComponent)
			},
			{
				id: 'utils-popup',
				title: 'DOCS.UTILS.EXAMPLE.POPUP.TITLE',
				componentName: 'PopupUtilsExampleComponent',
				files: ['popup-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/popup-utils-example.component').then((m) => m.PopupUtilsExampleComponent)
			},
			{
				id: 'utils-transitions',
				title: 'DOCS.UTILS.EXAMPLE.TRANSITIONS.TITLE',
				componentName: 'TransitionsUtilsExampleComponent',
				files: ['transitions-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/transitions-utils-example.component').then(
						(m) => m.TransitionsUtilsExampleComponent
					)
			},
			{
				id: 'utils-dom',
				title: 'DOCS.UTILS.EXAMPLE.DOM.TITLE',
				componentName: 'DomUtilsExampleComponent',
				files: ['dom-utils-example.component.ts'],
				loader: () => import('../examples/utils/dom-utils-example.component').then((m) => m.DomUtilsExampleComponent)
			},
			{
				id: 'utils-color-parsing',
				title: 'DOCS.UTILS.EXAMPLE.COLOR_PARSING.TITLE',
				componentName: 'ColorParsingUtilsExampleComponent',
				files: ['color-parsing-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/color-parsing-utils-example.component').then(
						(m) => m.ColorParsingUtilsExampleComponent
					)
			},
			{
				id: 'utils-color-contrast',
				title: 'DOCS.UTILS.EXAMPLE.COLOR_CONTRAST.TITLE',
				componentName: 'ColorContrastUtilsExampleComponent',
				files: ['color-contrast-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/color-contrast-utils-example.component').then(
						(m) => m.ColorContrastUtilsExampleComponent
					)
			},
			{
				id: 'utils-color-gamut',
				title: 'DOCS.UTILS.EXAMPLE.COLOR_GAMUT.TITLE',
				componentName: 'ColorGamutUtilsExampleComponent',
				files: ['color-gamut-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/color-gamut-utils-example.component').then(
						(m) => m.ColorGamutUtilsExampleComponent
					)
			},
			{
				id: 'utils-color-palette',
				title: 'DOCS.UTILS.EXAMPLE.COLOR_PALETTE.TITLE',
				componentName: 'ColorPaletteUtilsExampleComponent',
				files: ['color-palette-utils-example.component.ts'],
				loader: () =>
					import('../examples/utils/color-palette-utils-example.component').then(
						(m) => m.ColorPaletteUtilsExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'utils'
			});
		});
	}

	/**
	 * Populates the functionalities section
	 */
	private populateFunctionalities(): void {
		this.utilsLibrary.functionalities = [
			{
				title: 'DOCS.UTILS.FEATURE.FOCUS_MANAGEMENT.TITLE',
				description: 'DOCS.UTILS.FEATURE.FOCUS_MANAGEMENT.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.FOCUS_TRAP.TITLE',
						description: 'DOCS.UTILS.FEATURE.FOCUS_TRAP.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.FOCUSABLE_ELEMENTS.TITLE',
						description: 'DOCS.UTILS.FEATURE.FOCUSABLE_ELEMENTS.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.INTERNATIONALIZATION_I18N.TITLE',
				description: 'DOCS.UTILS.FEATURE.INTERNATIONALIZATION_I18N.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.TRANSLATION_SERVICE.TITLE',
						description: 'DOCS.UTILS.FEATURE.TRANSLATION_SERVICE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.TRANSLATE_PIPE.TITLE',
						description: 'DOCS.UTILS.FEATURE.TRANSLATE_PIPE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.TRANSLATION_PROVIDER.TITLE',
						description: 'DOCS.UTILS.FEATURE.TRANSLATION_PROVIDER.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.TITLE',
						description: 'DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.DESCRIPTION',
						import: "import { provideHubTranslationAdapter } from 'ng-hub-ui-utils';",
						template: ExternalTranslationAdapterUtilsExampleComponent.templateCode,
						component: ExternalTranslationAdapterUtilsExampleComponent.componentCode
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.OVERLAY_SYSTEM.TITLE',
				description: 'DOCS.UTILS.FEATURE.OVERLAY_SYSTEM.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.OVERLAY_SERVICE.TITLE',
						description: 'DOCS.UTILS.FEATURE.OVERLAY_SERVICE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.OVERLAY_REFERENCE.TITLE',
						description: 'DOCS.UTILS.FEATURE.OVERLAY_REFERENCE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.POSITIONING.TITLE',
						description: 'DOCS.UTILS.FEATURE.POSITIONING.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.POPUP_SERVICE.TITLE',
				description: 'DOCS.UTILS.FEATURE.POPUP_SERVICE.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.POPUP_CREATION.TITLE',
						description: 'DOCS.UTILS.FEATURE.POPUP_CREATION.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.PIPES.TITLE',
				description: 'DOCS.UTILS.FEATURE.PIPES.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.TYPE_CHECKING_PIPES.TITLE',
						description: 'DOCS.UTILS.FEATURE.TYPE_CHECKING_PIPES.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.GETPIPE.TITLE',
						description: 'DOCS.UTILS.FEATURE.GETPIPE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.UCFIRSTPIPE.TITLE',
						description: 'DOCS.UTILS.FEATURE.UCFIRSTPIPE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.UNWRAPASYNCPIPE.TITLE',
						description: 'DOCS.UTILS.FEATURE.UNWRAPASYNCPIPE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.UTILITY_FUNCTIONS.TITLE',
				description: 'DOCS.UTILS.FEATURE.UTILITY_FUNCTIONS.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.TYPE_GUARDS.TITLE',
						description: 'DOCS.UTILS.FEATURE.TYPE_GUARDS.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.STRING_UTILITIES.TITLE',
						description: 'DOCS.UTILS.FEATURE.STRING_UTILITIES.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.OBJECT_UTILITIES.TITLE',
						description: 'DOCS.UTILS.FEATURE.OBJECT_UTILITIES.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.DOM_UTILITIES.TITLE',
						description: 'DOCS.UTILS.FEATURE.DOM_UTILITIES.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.RXJS_UTILITIES.TITLE',
						description: 'DOCS.UTILS.FEATURE.RXJS_UTILITIES.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.SCROLLBAR_UTILITIES.TITLE',
				description: 'DOCS.UTILS.FEATURE.SCROLLBAR_UTILITIES.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.SCROLLBAR_WIDTH.TITLE',
						description: 'DOCS.UTILS.FEATURE.SCROLLBAR_WIDTH.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.TRANSITIONS.TITLE',
				description: 'DOCS.UTILS.FEATURE.TRANSITIONS.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.RUN_TRANSITION.TITLE',
						description: 'DOCS.UTILS.FEATURE.RUN_TRANSITION.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.TOOLTIP.TITLE',
				description: 'DOCS.UTILS.FEATURE.TOOLTIP.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.TOOLTIP_DIRECTIVE.TITLE',
						description: 'DOCS.UTILS.FEATURE.TOOLTIP_DIRECTIVE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			},
			{
				title: 'DOCS.UTILS.FEATURE.COLOR.TITLE',
				description: 'DOCS.UTILS.FEATURE.COLOR.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.UTILS.FEATURE.COLOR_PARSING.TITLE',
						description: 'DOCS.UTILS.FEATURE.COLOR_PARSING.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.COLOR_CONTRAST.TITLE',
						description: 'DOCS.UTILS.FEATURE.COLOR_CONTRAST.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.COLOR_OKLCH.TITLE',
						description: 'DOCS.UTILS.FEATURE.COLOR_OKLCH.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					},
					{
						title: 'DOCS.UTILS.FEATURE.COLOR_PALETTE.TITLE',
						description: 'DOCS.UTILS.FEATURE.COLOR_PALETTE.DESCRIPTION',
						import: '',
						template: '',
						component: ''
					}
				]
			}
		];
	}

	/**
	 * Populates the API section
	 */
	private populateApi(): void {
		// Services
		this.utilsLibrary.api.inputs = [
			{
				name: 'HubTranslationService',
				type: 'Service',
				required: false,
				defaultValue: '-',
				description: 'DOCS.UTILS.API.INPUT.HUBTRANSLATIONSERVICE.DESCRIPTION'
			},
			{
				name: 'OverlayService',
				type: 'Service',
				required: false,
				defaultValue: '-',
				description: 'DOCS.UTILS.API.INPUT.HUBOVERLAYSERVICE.DESCRIPTION'
			},
			{
				name: 'PopupService<T>',
				type: 'Service',
				required: false,
				defaultValue: '-',
				description: 'DOCS.UTILS.API.INPUT.HUBPOPUPSERVICE.DESCRIPTION'
			},
			{
				name: 'HubTooltipDirective',
				type: 'Directive',
				required: false,
				defaultValue: '-',
				description: 'DOCS.UTILS.API.INPUT.HUBTOOLTIPDIRECTIVE.DESCRIPTION'
			}
		];

		// Pipes as outputs (for documentation purposes)
		this.utilsLibrary.api.outputs = [
			{
				name: 'TranslatePipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.TRANSLATEPIPE.DESCRIPTION'
			},
			{
				name: 'GetPipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.GETPIPE.DESCRIPTION'
			},
			{
				name: 'IsStringPipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.ISSTRINGPIPE.DESCRIPTION'
			},
			{
				name: 'IsObjectPipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.ISOBJECTPIPE.DESCRIPTION'
			},
			{
				name: 'IsObservablePipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.ISOBSERVABLEPIPE.DESCRIPTION'
			},
			{
				name: 'UcfirstPipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.UCFIRSTPIPE.DESCRIPTION'
			},
			{
				name: 'UnwrapAsyncPipe',
				type: 'Pipe',
				required: false,
				description: 'DOCS.UTILS.API.OUTPUT.UNWRAPASYNCPIPE.DESCRIPTION'
			}
		];

		// Templates section for functions
		this.utilsLibrary.api.templates = [
			{
				name: 'DOCS.UTILS.API.TEMPLATE.0.NAME',
				description: 'DOCS.UTILS.API.TEMPLATE.0.DESCRIPTION',
				example: 'hubFocusTrap(zone, element, stopFocusTrap$, refocusOnClick)'
			},
			{
				name: 'DOCS.UTILS.API.TEMPLATE.1.NAME',
				description: 'DOCS.UTILS.API.TEMPLATE.1.DESCRIPTION',
				example: 'interpolateString("Hello {{name}}", { name: "World" }) → "Hello World"'
			},
			{
				name: 'DOCS.UTILS.API.TEMPLATE.2.NAME',
				description: 'DOCS.UTILS.API.TEMPLATE.2.DESCRIPTION',
				example: 'getValue(obj, "user.profile.name")'
			},
			{
				name: 'DOCS.UTILS.API.TEMPLATE.3.NAME',
				description: 'DOCS.UTILS.API.TEMPLATE.3.DESCRIPTION',
				example: 'equals({ a: 1 }, { a: 1 }) → true'
			}
		];
	}
}
