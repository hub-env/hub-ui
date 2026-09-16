import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BUTTONS_FUNCTIONALITIES } from './buttons-functionalities';
import { BtnVariantsButtonsExampleComponent } from '../examples/buttons/btn-variants-buttons-example.component';
import { FabButtonsExampleComponent } from '../examples/buttons/fab-buttons-example.component';
import { SpeedDialButtonsExampleComponent } from '../examples/buttons/speed-dial-buttons-example.component';
import { DropdownButtonsExampleComponent } from '../examples/buttons/dropdown-buttons-example.component';
import { CssVariablesButtonsExampleComponent } from '../examples/buttons/css-variables-buttons-example.component';
import { LoadingButtonsExampleComponent } from '../examples/buttons/loading-buttons-example.component';
import { CustomColorButtonsExampleComponent } from '../examples/buttons/custom-color-buttons-example.component';
import { MixinButtonsExampleComponent } from '../examples/buttons/mixin-buttons-example.component';
import { SingleOpenButtonsExampleComponent } from '../examples/buttons/single-open-buttons-example.component';

/**
 * Maps each registered example id to its standalone component so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const BUTTONS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'buttons-btn-variants': BtnVariantsButtonsExampleComponent,
	'buttons-fab': FabButtonsExampleComponent,
	'buttons-speed-dial': SpeedDialButtonsExampleComponent,
	'buttons-dropdown': DropdownButtonsExampleComponent,
	'buttons-css-variables': CssVariablesButtonsExampleComponent,
	'buttons-loading': LoadingButtonsExampleComponent,
	'buttons-custom-color': CustomColorButtonsExampleComponent,
	'buttons-single-open': SingleOpenButtonsExampleComponent
};

/**
 * Main ng-hub-ui-buttons library documentation page.
 */
@Component({
	selector: 'app-buttons-docs',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <app-library-page [library]="buttonsLibrary" [package]="'buttons'"> </app-library-page> `
})
export class ButtonsDocsComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Complete ng-hub-ui-buttons library data. */
	buttonsLibrary: Library = {
		title: 'ng-hub-ui-buttons',
		description:
			'Complete Angular 21+ button system built on Signals. Covers standard buttons with five variants and nine built-in semantic colours (an open set, extensible with any accent), a nine-position floating action button, an expandable speed-dial and a directive-driven overlay dropdown.',
		overview: {
			text: 'ng-hub-ui-buttons is a zero-dependency button library for Angular 21+ standalone applications (peer: ng-hub-ui-utils). It ships HubButtonComponent for in-flow buttons — one component with a dual selector, usable as an element (<hub-button>) or as an attribute on a native host (<button hubButton> / <a hubButton>) — HubFabComponent for fixed-viewport actions, HubSpeedDialComponent for action menus, and HubDropdownDirective that attaches any `<ng-template>` to any trigger via the OverlayService — no CDK required. All inputs use the Angular Signals API. Every visual property is a CSS custom property so the entire system themes with a single stylesheet override.',
			highlights: [
				{
					icon: 'fa-solid fa-computer-mouse',
					title: 'Signal-based API',
					description:
						'All inputs use `input()`, `model()` and `output()` — no `@Input`/`@Output` decorators, fully OnPush-safe and compatible with template type-checking.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Five variants × open-set colours',
					description:
						'`solid`, `outline`, `soft`, `ghost` and `link` styles across nine built-in accents (`primary`…`info` plus `neutral`/`light`/`dark`) — and **any custom colour** via the `hub-btn-color-rules()` mixin. Every role (emphasis/subtle/on) derives from a single `--hub-btn-accent` slot at runtime.'
				},
				{
					icon: 'fa-solid fa-spinner',
					title: 'Loading = busy + disabled',
					description:
						'A `loading` button shows an animated, swappable SVG spinner (`--hub-button-spinner`) and is fully inert — `aria-busy`, native `disabled`, out of tab order, no double-submit.'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'FAB + Speed Dial',
					description:
						'`HubFabComponent` places a circular button at any of nine fixed-viewport positions. `HubSpeedDialComponent` wraps it with a projected list of action items that expand on click and collapse on Escape.'
				},
				{
					icon: 'fa-solid fa-caret-down',
					title: 'Overlay Dropdown',
					description:
						'`[hubDropdown]="tpl"` turns any element into a dropdown trigger. The panel attaches via `OverlayService` — no CDK — with eight placement options, click-outside close and Escape support.'
				}
			],
			changelog: [
				{
					version: '22.12.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'fixed',
							description:
								'The emphasis slot that paints the label of an outline, soft, ghost or link button was mixed toward the ink by a percentage, which cannot darken a pale accent: the shipped warning measured 2.43:1 against the page and the shipped info 2.86:1, both under the 4.5:1 floor. Its luminosity is capped instead, matching the -emphasis derivation in ng-hub-ui-ds.'
						}
					]
				},
				{
					version: '22.11.2',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								"<hub-fab> says why it stays outside style encapsulation, which CODING_RULES.md now requires of every component that does. Nothing about the component changes; the two reasons were already load-bearing and were nowhere a reviewer could read them. First, the stylesheet is a public contract: hub-fab-color($type) is exported from ng-hub-ui-buttons/styles so a consumer can register their own accent, it emits a plain .hub-fab-<type> rule from their sheet, and the six built-in colours are generated by that very mixin from this one, so scoping this side would stop a consumer's variants being interchangeable with the built-ins. Second, the same rules dress an element in another component's view: <hub-speed-dial> renders its trigger as a button carrying the hub-fab classes inside its own template. Both are now pinned by tests, so the exception fails the day it stops being true."
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). Every colour, radius and spacing default in this library resolves through the --hub-sys-* / --hub-ref-* ladder and the manifest said nothing about it, so a consumer reading the package on npm could not tell that installing the token package is what gives the buttons the family palette and its dark mode. It stays optional: each token carries a literal fallback.'
						}
					]
				},
				{
					version: '22.11.1',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'<hub-fab> actually emits fabClick. The output was declared and documented but nothing ever emitted it, so the one event the component offers never fired and the only way to react to a FAB was to bind (click) on it, the very thing the output exists to spare you. Pressing the FAB now emits it once, and never while disabled, which is re-checked in code because pointer-events: none does not stop a programmatic click.'
						},
						{
							type: 'fixed',
							description:
								'The @use of ng-hub-ui-buttons/styles resolves. The stylesheets have always shipped in the package, but the manifest declared no subpath for them, so tooling that honours the exports map could not reach the mixin API the README teaches, and the workaround was to reach into node_modules by physical path.'
						},
						{
							type: 'fixed',
							description:
								'<hub-fab> is reachable without a pointer. The FAB is a custom tag with projected content, so nothing about it was a control: no role, no place in the tab order, no keyboard activation, and disabled said so only in CSS, which left screen-reader users with an unannounced blob and keyboard users with no way to reach it at all. It now advertises role="button", carries tabindex="0" (-1 while disabled, alongside aria-disabled="true") and activates on Enter and Space, the same treatment the element form of <hub-button> got in 22.8.0. Because it now reports as a button, do not nest a <hub-fab> inside another interactive element, and give it an aria-label when all it contains is an icon.'
						},
						{
							type: 'fixed',
							description:
								'trigger="hover" on <hub-speed-dial> lets the pointer reach the items. The enter/leave pair sat on the trigger button and the items render in a sibling column one --hub-speed-dial-gap away, so starting the trip fired mouseleave and closed the dial before the pointer arrived: in hover mode no item could ever be pressed. Both handlers now sit on the host, whose box holds the button, the items and the gap between them.'
						},
						{
							type: 'fixed',
							description:
								'trigger="hover" on [hubDropdown] lets the pointer reach the panel. The panel is attached at body level and offset from its trigger, so leaving the trigger closed the dropdown while the pointer was still crossing ground that belongs to neither. Leaving now only starts a short grace period, which arriving on the panel cancels, and the countdown starts again when the pointer leaves the panel too.'
						},
						{
							type: 'fixed',
							description:
								'closeOnSelect="false" actually keeps the panel open. The click-outside listener excluded the trigger and nothing else, and the panel is not a descendant of its trigger since it hangs off the body, so every click on a menu item read as a click outside and closed the dropdown whatever the input said. The option now does what it documents, which is what a multi-select menu, a filter panel or a form inside a dropdown is built on.'
						},
						{
							type: 'fixed',
							description:
								'The bare boolean attribute compiles beyond <hub-button>. 22.11.0 fixed disabled and loading on the button but left the same trap everywhere else: <hub-fab disabled>, <hub-speed-dial-item disabled>, <hub-dropdown-item selected> and closeOnSelect on [hubDropdown] all failed with TS2322, Type string is not assignable to type boolean, because an attribute written without a value passes the empty string. extended and collapseOnScroll on the FAB were in the same state. All of them now use booleanAttribute, so the bare form, ="" and [bound]="true" are interchangeable. Additive: every binding that compiled before still compiles.'
						},
						{
							type: 'changed',
							description:
								'Comments that had fallen behind the code now match it: icon on hub-dropdown-item and hub-speed-dial-item is a CSS class, not a character or a ligature, and the SCSS headers write the current hub-button, [hubButton] selector instead of the pre-22.2.0 spelling.'
						},
						{
							type: 'changed',
							description:
								'[hubDropdown] no longer promises a backdrop it never had. The README and the documentation site listed backdrop close among the ways the panel closes, which sent anyone counting on a dimmed, click-blocking layer behind an open menu looking for a variable to tint it. There is none: the overlay is created without hasBackdrop, so no such element is ever built and the onBackdropClick callback the directive registered could never fire. What closes the panel on an outside click is a document-level listener, and that is what the documentation now says. The dead registration is gone.'
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-09-03',
					changes: [
						{
							type: 'fixed',
							description:
								"<button hubButton disabled> compiles. `disabled` and `loading` were plain input(false) with no transform, so the bare HTML spelling of a boolean attribute — which passes the empty string — failed with TS2322, on exactly the usage `disabled`'s own documentation promises to mirror. Both use booleanAttribute now."
						}
					]
				},
				{
					version: '22.10.1',
					date: '2026-09-01',
					changes: [
						{
							type: 'fixed',
							description:
								'A dropdown destroyed while open no longer leaves anything behind. Its overlay stayed attached to the body and the directive stayed recorded as the one open dropdown, so the next dropdown to open anywhere called close() on a destroyed instance, which emits closed on an OutputRef nobody owns any more: the browser reports that as NG0953, and it showed up in an ordinary table when you opened a row menu, navigated away and opened another. Both are torn down on destroy now, and silently, because closing there would emit the very event that has nobody left to receive it.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'added',
							description:
								'hubActionsAdapter, so a host library can have its row actions drawn with this library button and dropdown without either package depending on the other. The same arrangement hubFormControlAdapter already uses for a table inputs: the host describes what a row offers in neutral terms and this maps the description onto the real components. Register it where the host expects it, for ng-hub-ui-paginable: provideHubPaginableActions(hubActionsAdapter).'
						},
						{
							type: 'added',
							description:
								'hub-actions-cell, the component that adapter creates. Public because creating a component is the honest way to assemble hubDropdown: it needs a host element and an ng-template, which is natural in a template and awkward imperatively.'
						},
						{
							type: 'fixed',
							description:
								'Only one dropdown is open at a time, however it was opened. Closing on click-outside already made a second one usually replace the first, since opening it is itself a click outside the first. Usually is not a guarantee: a dropdown opened from code produces no such click, and both panels stayed up.'
						},
						{
							type: 'fixed',
							description:
								'A click on a row action no longer reaches whatever surrounds it. Drawn inside a clickable row, such as a table row that opens a detail page, pressing an action navigated away and the action own effect was lost with the screen it happened on.'
						}
					]
				},
				{
					version: '22.9.4',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								'The homepage in the manifest points at this library own documentation page rather than at the site root. Metadata only.'
						}
					]
				},
				{
					version: '22.9.3',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The published package declared no licence. An absent license field is not neutral: a registry reports it as unlicensed, which legally reads as all rights reserved. The intent was always MIT; it is now stated in package.json and carried in a LICENSE file that ships with the package.'
						}
					]
				},
				{
					version: '22.9.2',
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
					version: '22.9.1',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Declared the real ng-hub-ui-utils peer range (>=22.7.0); the previous >=1.0.0 floor resolved to a utils major without resolveHubAccent.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'The hub-btn-theme mixin: one-call token theming for <hub-button> and [hubButton] — accent, which drives the whole role family, plus border-radius, padding-x, padding-y and font-size. Every parameter defaults to null, so only what you pass is emitted and the rest keep the component defaults.'
						},
						{
							type: 'changed',
							description:
								'The color input of button, FAB, speed dial and dropdown accepts ANY colour. On top of the built-in accents it now also takes a custom accent registered by the product and a literal colour (#hex, rgb(), oklch(), a CSS named colour), resolved through the shared resolveHubAccent helper from ng-hub-ui-utils.'
						},
						{
							type: 'changed',
							description:
								'Internal: host bindings moved from the @HostBinding and @HostListener decorators to the host object in the component metadata, as the Angular style guide asks. No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'The typed color API now also accepts neutral, light and dark (the CSS already shipped), so <hub-button color="neutral"> — and fab/speed-dial/dropdown — type-check.'
						},
						{
							type: 'added',
							description:
								'Overridable hover + a new pressed (:active) state via --hub-btn-hover-bg/-border/-color and --hub-btn-active-bg/-border/-color — retune one interaction colour with a single line; existing visuals preserved.'
						},
						{
							type: 'added',
							description:
								'The element form <hub-button> is now keyboard-accessible: it advertises role="button", a focusable tabindex and activates on Enter/Space; the [hubButton] attribute form on a native button/anchor stays free of redundant role/tabindex.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-02',
					changes: [
						{
							type: 'added',
							description:
								'Speed-dial label tokens --hub-speed-dial-label-bg and --hub-speed-dial-label-color: a theme-aware inverted pair for the tooltip-style label chip beside each action.'
						},
						{
							type: 'fixed',
							description:
								'Speed dial and dropdown no longer crash SSR and prerender with "document is not defined". Both subscribed to the global document keydown in their constructors for Escape-to-close, which threw on the server and aborted rendering of any page containing them. The listeners use the injected DOCUMENT now and are only wired in the browser.'
						},
						{
							type: 'fixed',
							description:
								'The speed-dial item label rendered inverted when the ds tokens were loaded, and the token fallbacks are realigned to the ng-hub-ui-ds light defaults so the with-ds and without-ds renders match.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'changed',
							description:
								'Icons in buttons are projected, not configured: project a <hub-icon> or any other element as the content, and its side follows the markup order, with --hub-button-gap between icon and label. There is intentionally no icon input.'
						},
						{
							type: 'removed',
							description:
								'The iconOnly input and the forced square layout it switched on (breaking). A button sizes to its content now; for an icon-only button, project just the icon and set an aria-label. Symmetric padding keeps it visually balanced without a dedicated mode.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'changed',
							description:
								'`HubBtnComponent` renamed to `HubButtonComponent` (the old name stays as a deprecated alias).'
						},
						{
							type: 'changed',
							description:
								'`HubButtonComponent` now has a dual selector `hub-button, [hubButton]` — usable as `<hub-button>` or as an attribute on a native host (`<button hubButton>` / `<a hubButton>`), with the loading spinner rendered in both forms.'
						},
						{
							type: 'deprecated',
							description:
								'`HubBtnDirective` is replaced by `HubButtonComponent` (which now matches `[hubButton]`); it remains exported as a deprecated alias.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'added',
							description:
								'The local accent slot --hub-btn-accent, and the whole role family derived from it at runtime with color-mix() and relative colour: emphasis, subtle and on recompute live, so registering a new accent is one CSS rule and needs no recompilation.'
						},
						{
							type: 'changed',
							description:
								'Canonical zindex token names (breaking): --hub-fab-z-index becomes --hub-fab-zindex, --hub-dropdown-panel-z-index becomes --hub-dropdown-panel-zindex and --hub-speed-dial-z-index becomes --hub-speed-dial-zindex, matching the --hub-sys-zindex-* convention. A stylesheet left on the old spelling sets a variable nothing reads.'
						},
						{
							type: 'changed',
							description:
								'Appearance decoupled from colour: solid, outline, soft, ghost and link consume only the local accent family, so they apply to any accent, known or registered, and the known-variant loop grew from five colours to the nine canonical ones.'
						}
					]
				},
				{
					version: '22.3.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: the inline fallback defaults are aligned with the canonical ng-hub-ui-ds values, and the hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) are routed through their --hub-sys-* and --hub-ref-* tokens, so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-25',
					changes: [
						{
							type: 'changed',
							description:
								'Every dimension token consolidated onto the shared --hub-ref-* reference scale, so button, FAB and dropdown sizing resolves through the design-system tokens instead of hand-tuned rem literals. A few defaults shift to land on the scale: button md padding 14 to 16px and 7 to 8px, gap 6 to 8px, dropdown item padding 14 to 16px, and disabled opacity 0.55 to 0.65.'
						}
					]
				},
				{
					version: '22.2.1',
					date: '2026-06-23',
					changes: [
						{
							type: 'changed',
							description:
								'btn.component.ts renamed to button.component.ts, for naming consistency with the element selector.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-23',
					changes: [
						{ type: 'changed', description: '`HubBtnComponent` selector renamed from `hub-btn` to `hub-button`.' },
						{
							type: 'changed',
							description: '`HubBtnDirective` selector renamed from `[hubBtn]` to `[hubButton]`.'
						},
						{
							type: 'changed',
							description:
								'The button CSS custom properties renamed from `--hub-btn-*` to `--hub-button-*`, for naming consistency with the element selector. The `--hub-btn-*` prefix returns in 22.4.0 and 22.8.0 for a different family: the accent slot and the interaction slots.'
						},
						{
							type: 'fixed',
							description:
								'`peerDependencies`: `ng-hub-ui-utils` corrected to `>=1.0.0` to match its actual published versioning scheme.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-23',
					changes: [
						{
							type: 'added',
							description:
								'Public SCSS mixin API at `ng-hub-ui-buttons/styles`: `hub-btn-variant-rules()` generic primitive and `hub-btn-color-rules()` convenience mixin for registering custom semantic colors without modifying the library.'
						},
						{
							type: 'added',
							description:
								'`hub-fab-color()`, `hub-dropdown-panel-color()`, `hub-dropdown-item-color()` and their `*-rules` counterparts for extending FAB and dropdown colors.'
						},
						{
							type: 'added',
							description:
								'`HubDropdownDirective`: panel closes automatically on scroll to keep alignment with the trigger.'
						},
						{
							type: 'changed',
							description:
								'`HubSpeedDialComponent`: trigger slot renamed from `slot="trigger"` to `hubTrigger` attribute.'
						},
						{
							type: 'changed',
							description:
								'`HubSpeedDialItemComponent` and `HubDropdownItemComponent`: `icon` input now expects a CSS class string rendered via `<i [class]="icon()">` instead of raw text.'
						},
						{
							type: 'fixed',
							description:
								'`HubFabComponent`: uses `position: static` when nested inside `HubSpeedDialComponent` instead of `position: fixed`.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'added',
							description:
								'`HubBtnComponent` and `HubBtnDirective` with five variants, six colours, four sizes, loading and icon-only modes.'
						},
						{
							type: 'added',
							description:
								'`HubFabComponent` with nine-position grid, scroll-collapse and CSS logical properties for RTL.'
						},
						{
							type: 'added',
							description:
								'`HubSpeedDialComponent` and `HubSpeedDialItemComponent` with two-way `isOpen` model and Escape close.'
						},
						{
							type: 'added',
							description:
								'`HubDropdownDirective` with eight placements, click/hover triggers, `closeOnSelect` and click-outside close.'
						},
						{
							type: 'added',
							description:
								'`HubDropdownPanelComponent`, `HubDropdownItemComponent`, `HubDropdownDividerComponent`, `HubDropdownHeaderComponent` helper components.'
						},
						{
							type: 'added',
							description:
								'SCSS token system: `:where()` zero-specificity defaults + `@each` semantic colour loops for all variants.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'variant (hub-button)',
					type: "'solid' | 'outline' | 'soft' | 'ghost' | 'link'",
					required: false,
					defaultValue: "'solid'",
					description: 'DOCS.BUTTONS.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'color (hub-button)',
					type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'light' | 'dark' | string",
					required: false,
					defaultValue: "'primary'",
					description: 'DOCS.BUTTONS.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'size (hub-button)',
					type: "'sm' | 'md' | 'lg' | 'xl'",
					required: false,
					defaultValue: "'md'",
					description: 'DOCS.BUTTONS.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'loading (hub-button)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.LOADING.DESCRIPTION'
				},
				{
					name: 'disabled (hub-button)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.DISABLED.DESCRIPTION'
				},
				{
					name: 'color (hub-fab)',
					type: 'HubSemanticColor',
					required: false,
					defaultValue: "'primary'",
					description: 'DOCS.BUTTONS.API.INPUT.FAB_COLOR.DESCRIPTION'
				},
				{
					name: 'size (hub-fab)',
					type: "'mini' | 'standard' | 'large'",
					required: false,
					defaultValue: "'standard'",
					description: 'DOCS.BUTTONS.API.INPUT.FAB_SIZE.DESCRIPTION'
				},
				{
					name: 'extended (hub-fab)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.FAB_EXTENDED.DESCRIPTION'
				},
				{
					name: 'position (hub-fab)',
					type: "'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'",
					required: false,
					defaultValue: "'bottom-end'",
					description: 'DOCS.BUTTONS.API.INPUT.FAB_POSITION.DESCRIPTION'
				},
				{
					name: 'collapseOnScroll (hub-fab)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.FAB_COLLAPSE_ON_SCROLL.DESCRIPTION'
				},
				{
					name: 'disabled (hub-fab)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.FAB_DISABLED.DESCRIPTION'
				},
				{
					name: 'color (hub-speed-dial)',
					type: 'HubSemanticColor',
					required: false,
					defaultValue: "'primary'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_COLOR.DESCRIPTION'
				},
				{
					name: 'size (hub-speed-dial)',
					type: "'mini' | 'standard' | 'large'",
					required: false,
					defaultValue: "'standard'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_SIZE.DESCRIPTION'
				},
				{
					name: 'position (hub-speed-dial)',
					type: 'HubFabPosition',
					required: false,
					defaultValue: "'bottom-end'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_POSITION.DESCRIPTION'
				},
				{
					name: 'direction (hub-speed-dial)',
					type: "'up' | 'down' | 'left' | 'right'",
					required: false,
					defaultValue: "'up'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_DIRECTION.DESCRIPTION'
				},
				{
					name: 'trigger (hub-speed-dial)',
					type: "'click' | 'hover'",
					required: false,
					defaultValue: "'click'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_TRIGGER.DESCRIPTION'
				},
				{
					name: 'isOpen (hub-speed-dial)',
					type: 'boolean (two-way model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_IS_OPEN.DESCRIPTION'
				},
				{
					name: 'icon (hub-speed-dial-item)',
					type: 'string',
					required: true,
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_ITEM_ICON.DESCRIPTION'
				},
				{
					name: 'label (hub-speed-dial-item)',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_ITEM_LABEL.DESCRIPTION'
				},
				{
					name: 'color (hub-speed-dial-item)',
					type: "HubSemanticColor | 'default'",
					required: false,
					defaultValue: "'default'",
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_ITEM_COLOR.DESCRIPTION'
				},
				{
					name: 'disabled (hub-speed-dial-item)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.SPEED_DIAL_ITEM_DISABLED.DESCRIPTION'
				},
				{
					name: 'hubDropdown ([hubDropdown])',
					type: 'TemplateRef<any>',
					required: true,
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_TPL.DESCRIPTION'
				},
				{
					name: 'placement ([hubDropdown])',
					type: "'top-start' | 'top' | 'top-end' | 'start' | 'end' | 'bottom-start' | 'bottom' | 'bottom-end'",
					required: false,
					defaultValue: "'bottom-start'",
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_PLACEMENT.DESCRIPTION'
				},
				{
					name: 'trigger ([hubDropdown])',
					type: "'click' | 'hover'",
					required: false,
					defaultValue: "'click'",
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_TRIGGER.DESCRIPTION'
				},
				{
					name: 'closeOnSelect ([hubDropdown])',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_CLOSE_ON_SELECT.DESCRIPTION'
				},
				{
					name: 'disabled ([hubDropdown])',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_DISABLED.DESCRIPTION'
				},
				{
					name: 'offsetY ([hubDropdown])',
					type: 'number',
					required: false,
					defaultValue: '4',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_OFFSET_Y.DESCRIPTION'
				},
				{
					name: 'panelClass ([hubDropdown])',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_PANEL_CLASS.DESCRIPTION'
				},
				{
					name: 'isOpen ([hubDropdown])',
					type: 'boolean (two-way model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_IS_OPEN.DESCRIPTION'
				},
				{
					name: 'color (hub-dropdown-panel)',
					type: "HubSemanticColor | 'default'",
					required: false,
					defaultValue: "'default'",
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_PANEL_COLOR.DESCRIPTION'
				},
				{
					name: 'color (hub-dropdown-item)',
					type: "HubSemanticColor | 'default'",
					required: false,
					defaultValue: "'default'",
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_ITEM_COLOR.DESCRIPTION'
				},
				{
					name: 'icon (hub-dropdown-item)',
					type: 'string | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_ITEM_ICON.DESCRIPTION'
				},
				{
					name: 'disabled (hub-dropdown-item)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_ITEM_DISABLED.DESCRIPTION'
				},
				{
					name: 'selected (hub-dropdown-item)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BUTTONS.API.INPUT.DROPDOWN_ITEM_SELECTED.DESCRIPTION'
				},
				{
					name: 'config (hub-actions-cell)',
					type: 'HubActionsCellConfig',
					required: true,
					defaultValue: '—',
					description: 'DOCS.BUTTONS.API.INPUT.ACTIONS_CELL_CONFIG.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'fabClick (hub-fab)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.FAB_CLICK.DESCRIPTION'
				},
				{
					name: 'isOpenChange (hub-speed-dial)',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.SPEED_DIAL_IS_OPEN_CHANGE.DESCRIPTION'
				},
				{
					name: 'opened (hub-speed-dial)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.SPEED_DIAL_OPENED.DESCRIPTION'
				},
				{
					name: 'closed (hub-speed-dial)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.SPEED_DIAL_CLOSED.DESCRIPTION'
				},
				{
					name: 'itemClick (hub-speed-dial-item)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.SPEED_DIAL_ITEM_CLICK.DESCRIPTION'
				},
				{
					name: 'isOpenChange ([hubDropdown])',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.DROPDOWN_IS_OPEN_CHANGE.DESCRIPTION'
				},
				{
					name: 'opened ([hubDropdown])',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.DROPDOWN_OPENED.DESCRIPTION'
				},
				{
					name: 'closed ([hubDropdown])',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.DROPDOWN_CLOSED.DESCRIPTION'
				},
				{
					name: 'itemClick (hub-dropdown-item)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BUTTONS.API.OUTPUT.DROPDOWN_ITEM_CLICK.DESCRIPTION'
				}
			],
			templates: [
				{
					name: '[slot=icon] (hub-fab)',
					description: 'DOCS.BUTTONS.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-fab aria-label="New document">
  <i slot="icon" class="fa-solid fa-plus"></i>
</hub-fab>`
				},
				{
					name: '[slot=label] (hub-fab)',
					description: 'DOCS.BUTTONS.API.TEMPLATE.1.DESCRIPTION',
					example: `<hub-fab extended aria-label="New document">
  <i slot="icon" class="fa-solid fa-plus"></i>
  <span slot="label">New document</span>
</hub-fab>`
				},
				{
					name: '[hubTrigger] (hub-speed-dial)',
					description: 'DOCS.BUTTONS.API.TEMPLATE.2.DESCRIPTION',
					example: `<hub-speed-dial>
  <i hubTrigger class="fa-solid fa-plus"></i>
  <hub-speed-dial-item icon="fa-solid fa-pen" label="Edit" />
</hub-speed-dial>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['buttons'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['buttons'],
			demos: [
				{
					title: 'Theming with hub-btn-theme',
					previewComponent: MixinButtonsExampleComponent,
					code: `@use 'ng-hub-ui-buttons/styles' as buttons;

.btn-mixin-scope {
	@include buttons.hub-btn-theme(
		$accent: #7c3aed,
		$border-radius: 999px
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers examples and populates the
	 * functionalities section of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every buttons example with the shared ExampleRegistry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'buttons-btn-variants',
				title: 'DOCS.BUTTONS.EXAMPLE.BTN_VARIANTS.TITLE',
				componentName: 'BtnVariantsButtonsExampleComponent',
				files: ['btn-variants-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/btn-variants-buttons-example.component').then(
						(m) => m.BtnVariantsButtonsExampleComponent
					)
			},
			{
				id: 'buttons-fab',
				title: 'DOCS.BUTTONS.EXAMPLE.FAB.TITLE',
				componentName: 'FabButtonsExampleComponent',
				files: ['fab-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/fab-buttons-example.component').then((m) => m.FabButtonsExampleComponent)
			},
			{
				id: 'buttons-speed-dial',
				title: 'DOCS.BUTTONS.EXAMPLE.SPEED_DIAL.TITLE',
				componentName: 'SpeedDialButtonsExampleComponent',
				files: ['speed-dial-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/speed-dial-buttons-example.component').then(
						(m) => m.SpeedDialButtonsExampleComponent
					)
			},
			{
				id: 'buttons-dropdown',
				title: 'DOCS.BUTTONS.EXAMPLE.DROPDOWN.TITLE',
				componentName: 'DropdownButtonsExampleComponent',
				files: ['dropdown-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/dropdown-buttons-example.component').then(
						(m) => m.DropdownButtonsExampleComponent
					)
			},
			{
				id: 'buttons-css-variables',
				title: 'DOCS.BUTTONS.EXAMPLE.CSS_VARIABLES.TITLE',
				componentName: 'CssVariablesButtonsExampleComponent',
				files: ['css-variables-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/css-variables-buttons-example.component').then(
						(m) => m.CssVariablesButtonsExampleComponent
					)
			},
			{
				id: 'buttons-loading',
				title: 'DOCS.BUTTONS.EXAMPLE.LOADING.TITLE',
				componentName: 'LoadingButtonsExampleComponent',
				files: ['loading-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/loading-buttons-example.component').then(
						(m) => m.LoadingButtonsExampleComponent
					)
			},
			{
				id: 'buttons-custom-color',
				title: 'DOCS.BUTTONS.EXAMPLE.CUSTOM_COLOR.TITLE',
				componentName: 'CustomColorButtonsExampleComponent',
				files: ['custom-color-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/custom-color-buttons-example.component').then(
						(m) => m.CustomColorButtonsExampleComponent
					)
			},
			{
				id: 'buttons-single-open',
				title: 'DOCS.BUTTONS.EXAMPLE.SINGLE_OPEN.TITLE',
				componentName: 'SingleOpenButtonsExampleComponent',
				files: ['single-open-buttons-example.component.ts'],
				loader: () =>
					import('../examples/buttons/single-open-buttons-example.component').then(
						(m) => m.SingleOpenButtonsExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'buttons'
			});
		});
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview component.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		const registry = this._exampleRegistry;

		this.buttonsLibrary.functionalities = BUTTONS_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const regItem = registry.get(id);
					if (!regItem) return null;
					return {
						title: regItem.title,
						description: regItem.title,
						import: '',
						template: '',
						component: '',
						id: regItem.id,
						previewComponent: BUTTONS_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
