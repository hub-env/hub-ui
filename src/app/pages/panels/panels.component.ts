import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { PANELS_FUNCTIONALITIES } from './panels-functionalities';
import { PANELS_PLAYGROUND } from './panels-playground';
import { BasicPanelsExampleComponent } from '../examples/panels/basic-panels-example.component';
import { PillsPanelsExampleComponent } from '../examples/panels/pills-panels-example.component';
import { AccordionPanelsExampleComponent } from '../examples/panels/accordion-panels-example.component';
import { VerticalPanelsExampleComponent } from '../examples/panels/vertical-panels-example.component';
import { JustifiedPanelsExampleComponent } from '../examples/panels/justified-panels-example.component';
import { ScrollablePanelsExampleComponent } from '../examples/panels/scrollable-panels-example.component';
import { DisabledPanelsExampleComponent } from '../examples/panels/disabled-panels-example.component';
import { RemovablePanelsExampleComponent } from '../examples/panels/removable-panels-example.component';
import { CustomHeadingPanelsExampleComponent } from '../examples/panels/custom-heading-panels-example.component';
import { ReactiveFormsPanelsExampleComponent } from '../examples/panels/reactive-forms-panels-example.component';
import { MultipleSelectionPanelsExampleComponent } from '../examples/panels/multiple-selection-panels-example.component';
import { MultipleVerticalPanelsExampleComponent } from '../examples/panels/multiple-vertical-panels-example.component';
import { MultipleFlushPanelsExampleComponent } from '../examples/panels/multiple-flush-panels-example.component';
import { KeyboardPanelsExampleComponent } from '../examples/panels/keyboard-panels-example.component';
import { CardPanelsExampleComponent } from '../examples/panels/card-panels-example.component';
import { AlertPanelsExampleComponent } from '../examples/panels/alert-panels-example.component';
import { VariantPanelsExampleComponent } from '../examples/panels/variant-panels-example.component';
import { TabNavPanelsExampleComponent } from '../examples/panels/tab-nav-panels-example.component';
import { CardSlotsPanelsExampleComponent } from '../examples/panels/card-slots-panels-example.component';
import { MixinPanelsExampleComponent } from '../examples/panels/mixin-panels-example.component';
import { HeadingActionsPanelsExampleComponent } from '../examples/panels/heading-actions-panels-example.component';
import { SidePanelPanelsExampleComponent } from '../examples/panels/side-panel-panels-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const PANELS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'panels-basic': BasicPanelsExampleComponent,
	'panels-pills': PillsPanelsExampleComponent,
	'panels-accordion': AccordionPanelsExampleComponent,
	'panels-vertical': VerticalPanelsExampleComponent,
	'panels-justified': JustifiedPanelsExampleComponent,
	'panels-scrollable': ScrollablePanelsExampleComponent,
	'panels-disabled': DisabledPanelsExampleComponent,
	'panels-removable': RemovablePanelsExampleComponent,
	'panels-custom-heading': CustomHeadingPanelsExampleComponent,
	'panels-heading-actions': HeadingActionsPanelsExampleComponent,
	'panels-reactive-forms': ReactiveFormsPanelsExampleComponent,
	'panels-multiple': MultipleSelectionPanelsExampleComponent,
	'panels-multiple-vertical': MultipleVerticalPanelsExampleComponent,
	'panels-multiple-flush': MultipleFlushPanelsExampleComponent,
	'panels-keyboard': KeyboardPanelsExampleComponent,
	'panels-card': CardPanelsExampleComponent,
	'panels-alert': AlertPanelsExampleComponent,
	'panels-variant': VariantPanelsExampleComponent,
	'panels-tab-nav': TabNavPanelsExampleComponent,
	'panels-card-slots': CardSlotsPanelsExampleComponent,
	'panels-side-panel': SidePanelPanelsExampleComponent
};

/**
 * Main ng-hub-ui-panels library documentation page.
 */
@Component({
	selector: 'app-panels',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="panelsLibrary"
			[package]="'panels'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		>
		</app-library-page>
	`
})
export class PanelsComponent implements OnInit {
	protected readonly exampleGroups = PANELS_FUNCTIONALITIES;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = PANELS_PLAYGROUND;

	/**
	 * Complete ng-hub-ui-panels library data.
	 */
	panelsLibrary: Library = {
		title: 'ng-hub-ui-panels',
		description:
			'A versatile, accessible content-panels container that renders as tabs, pills, an accordion or plain cards from a single API. Built as standalone Angular components with Signals, routing and reactive-forms integration, it supersedes ng-hub-ui-accordion.',
		overview: {
			text: 'ng-hub-ui-panels unifies the most common content-switching patterns — tabs, pills and accordion — plus a chromeless card layout, behind one declarative component. Drop `<hub-panel>` panes inside `<hub-panels>` and pick a `type`; everything else (roving-tabindex keyboard navigation, ARIA wiring, an animated accordion collapse, routed panels and form binding) works the same across views. It is built on modern Angular Signals for OnPush-safe reactivity and is themed entirely through `--hub-panels-*` CSS custom properties, with an `--hub-accordion-*` compatibility layer so existing accordion themes keep working. This library supersedes ng-hub-ui-accordion: its accordion view is a drop-in, more capable replacement.',
			highlights: [
				{
					icon: 'fa-solid fa-table-columns',
					title: 'Tabs, Pills, Accordion & Cards',
					description:
						'Four visualizations from one component — switch the entire pattern with a single `type` input, no markup changes.'
				},
				{
					icon: 'fa-solid fa-keyboard',
					title: 'Full Keyboard Navigation',
					description:
						'Arrow keys, Home, End and Delete with a roving tabindex, wired for both the tablist and accordion disclosure patterns.'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'Angular Signals Architecture',
					description:
						'State is driven entirely by Angular Signals, giving zero-overhead reactivity and OnPush-safe rendering.'
				},
				{
					icon: 'fa-solid fa-file-code',
					title: 'Reactive & Template Forms',
					description:
						'Implements ControlValueAccessor — bind the active panel(s) directly to a FormControl or ngModel, single or multiple.'
				},
				{
					icon: 'fa-solid fa-route',
					title: 'Routed Panels',
					description:
						'Give a panel a `routerLink` and the content area becomes a `<router-outlet>`; the active panel follows the URL.'
				},
				{
					icon: 'fa-solid fa-arrows-left-right',
					title: 'Scrollable & Vertical Strips',
					description:
						'Overflowing strips get scroll buttons; strips can stack vertically beside the content or stretch justified.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Every colour, border, radius and transition is a `--hub-panels-*` custom property, with accordion-token fallbacks.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'Accessible by Default',
					description:
						'Correct role="tablist"/"tab"/"tabpanel" and aria-expanded/controls semantics are applied automatically.'
				},
				{
					icon: 'fa-solid fa-table-columns',
					title: 'Non-modal Side Panel',
					description:
						'`<hub-side-panel>` docks beside the content or floats over its edge without a backdrop, scroll lock or focus trap, and keeps its content alive while closed.'
				}
			],
			changelog: [
				{
					version: '22.12.0',
					date: '2026-09-13',
					changes: [
						{
							type: 'added',
							description:
								'<hub-side-panel> inside a <hub-side-panel-container>: a side panel that is not a dialog. No backdrop, no scroll lock and no focus trap, so the page stays usable while it is open. mode="side" docks it and narrows the content; mode="over" floats it over the content edge, and a side panel falls back to over when the container is narrower than breakpoint (768 by default). Logical start/end position, a two-way open model, Escape to close, opt-in autoFocus with focus handed back on close, and content that survives closing. Themed through twelve --hub-side-panel-* tokens.'
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING \u2014 the seven exported classes are renamed with the Hub prefix: PanelsComponent, PanelComponent, PanelsConfig, PanelHeadingDirective, PanelHeadingActionsDirective, PanelHeaderDirective and PanelFooterDirective become HubPanelsComponent, HubPanelComponent, HubPanelsConfig, HubPanelHeadingDirective, HubPanelHeadingActionsDirective, HubPanelHeaderDirective and HubPanelFooterDirective. PanelComponent is an ordinary name for an ordinary thing, and an application that has a panel of its own will reach for it \u2014 an unprefixed export puts the library inside the consumer\u2019s namespace and leaves them aliasing their way out of a collision they did not create. The selectors and the exported types were already prefixed, so the classes were the last part of this surface still spelled the other way. All seven old names stay exported as deprecated aliases resolving to the same classes, so imports, viewChild() lookups and a { provide: PanelsConfig, ... } provider all keep working, and they are removed in 23.0.0. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'Both READMEs name the classes that ship. The import block and every reference to the container, the panel and the config token still used the old names, so a reader copying the documented import wrote code compiling only against the deprecated aliases \u2014 which is exactly the audience this rename exists to move.'
						}
					]
				},
				{
					version: '22.10.4',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								"A BREAKING_CHANGES.md file, written up with the three breaks this library had already shipped without one. The major number states which Angular major is targeted, so it can never be raised to warn of a break, which leaves this file as the only warning a consumer gets, and until now panels had nowhere to give it. It covers the two CSS breaks of 22.8.2 (the disclosure button stopped painting the row surface and stopped being position: relative, both filed as Changed and both released under a patch number) and the 22.3.0 scoping of the PanelsComponent injection to host: true, which stops a wrapper component's own <hub-panel> from joining a group outside its template. Each entry carries the migration the changelog only stated in passing. Documentation only: no code, types or styles change."
						},
						{
							type: 'fixed',
							description:
								'HubPanelAppearance and HubPanelVariant are now re-exported from the package entry point. The 21.3.0 notes announced them as exported types, but the barrel never listed them, so the union behind <hub-panel [appearance]> and [variant] was unreachable from outside the library: consumers had to redeclare it by hand in every project, or widen it to string and lose the very check the types exist for. No runtime change, the surface is type-only.'
						}
					]
				},
				{
					version: '22.10.3',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. It is the link a registry shows beside the package and the one a reader clicks from it, and landing on a front page they then have to search is a worse answer than landing on the reference for the package they were already looking at. Metadata only — no code, no types, no styles change, and nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.10.2',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The published package declared no licence. An absent license field is not neutral — a registry reports it as unlicensed, which legally reads as all rights reserved, the most restrictive state possible rather than the most open. The intent was always MIT; it is now stated in package.json and carried in a LICENSE file that ships with the package.'
						}
					]
				},
				{
					version: '22.10.1',
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
					version: '22.10.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution now imports the canonical resolveHubAccent from ng-hub-ui-utils; the private in-library copy was deleted. Behaviour is identical.'
						},
						{
							type: 'added',
							description:
								'New required peer dependency: ng-hub-ui-utils >=22.7.0 (home of resolveHubAccent). ng add ng-hub-ui installs it automatically; manual installs need npm i ng-hub-ui-utils.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'New removeLabel input on <hub-panel> (default "Remove panel"): the accessible name announced for the ✕ remove button, overridable per panel so consumers can localize it.'
						},
						{
							type: 'fixed',
							description:
								'The ✕ remove control was an aria-hidden <span> nested inside the tab / disclosure <button> — unfocusable, unannounced and unreachable by keyboard. It is now a real <button type="button"> with an aria-label, rendered as a SIBLING of the header control (the slot pattern hubPanelHeadingActions introduced): beside the tab button in the strip views, inside the accordion actions area at the row end. Clicking it still removes without toggling or selecting, it is disabled with its panel, and the .hub-panels__remove-btn class and its opacity tokens are unchanged.'
						},
						{
							type: 'fixed',
							description:
								'Removing a panel through the ✕ now returns keyboard focus to the closest remaining header (as the Delete key already did) instead of dropping it on <body>. New public removePanelAndRefocus(panel) method on PanelsComponent, shared by the Delete-key handlers.'
						}
					]
				},
				{
					version: '22.8.3',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Declared the real ng-hub-ui-ds peer range (>=22.0.0); the previous >=1.0.0 floor predates the --hub-ref-*/--hub-sys-* token architecture.'
						}
					]
				},
				{
					version: '22.8.2',
					date: '2026-07-09',
					changes: [
						{
							type: 'fixed',
							description:
								"The hairline closing an expanded accordion row stopped short of the row's end. It was an inset box-shadow on the disclosure button, which stopped spanning the whole header when 22.8.0 made it flex: 1 1 auto to free space for hubPanelHeadingActions. It is now drawn on .hub-panels__accordion-header--expanded, which always spans the full row."
						},
						{
							type: 'fixed',
							description:
								'togglePosition="end" put the chevron at the end of the BUTTON rather than of the row, so with hubPanelHeadingActions it landed between the heading and the affordances. The trailing chevron is now anchored to the header\u2019s inline end, and whatever sits last in the row reserves its gutter through the new --hub-panels-accordion-toggle-gutter property.'
						},
						{
							type: 'changed',
							description:
								'BREAKING (CSS contract): .hub-panels__accordion-btn no longer paints the row surface \u2014 it is transparent and the header\u2019s surface shows through, which is what lets the inset hairline reach the row\u2019s end. The --hub-panels-accordion-btn-bg and --hub-panels-accordion-active-bg tokens still drive the colour, now read by the header. A consumer who set background directly on .hub-panels__accordion-btn must move it to .hub-panels__accordion-header. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'BREAKING (CSS contract): .hub-panels__accordion-btn is no longer position: relative; the header carries it instead, so the trailing chevron can be anchored to the row. A consumer who relied on the button as the containing block for absolutely positioned heading content must now give that content its own containing block. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.8.1',
					date: '2026-07-09',
					changes: [
						{
							type: 'fixed',
							description:
								"togglePosition leaked into a nested accordion: the chevron side was a class on the container plus a descendant selector, so an accordion nested inside a panel body inherited the outer placement and could not choose its own. The flag now rides each <hub-panel> and the rule is scoped to that panel's own header."
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-07-09',
					changes: [
						{
							type: 'added',
							description:
								'New hubPanelHeadingActions directive: a header-row slot for accordion affordances that must stay usable while the row is collapsed (edit, delete, a menu). It renders as a sibling of the disclosure button, so its controls are real controls, a click never toggles the panel and tab order follows the DOM. hubPanelHeading projects INSIDE that button (a nested <button> is invalid and unreachable by keyboard) and hubPanelHeader projects inside the collapse region (it vanishes when the row closes), so until now there was nowhere to put them.'
						},
						{
							type: 'added',
							description:
								'New togglePosition input on <hub-panels> (start | end, default end; also on PanelsConfig): which side of the accordion header row the disclosure chevron sits on. Only the visual order moves — the DOM is untouched — and the offsets are logical, so start is the left edge in LTR and the right edge in RTL. Replaces the ::ng-deep order/margin override consumers were writing by hand. Exports the HubPanelsTogglePosition type.'
						},
						{
							type: 'changed',
							description:
								'.hub-panels__accordion-header is now a flex row carrying the row surface (with a new --expanded modifier), the disclosure button being its flex child, so the actions slot shares the background in both states. The button\u2019s own background rules are unchanged.'
						},
						{
							type: 'fixed',
							description:
								'RTL in the accordion header: the disclosure button used the physical text-align: left and its chevron margin-left: auto, so under dir="rtl" the label stayed left-aligned and the chevron pinned to the wrong edge. Both are logical now.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-08',
					changes: [
						{
							type: 'added',
							description:
								'New --hub-panels-tab-border-end-radius token: the radius of a vertical tab\u2019s corners on the edge that meets the panel body. They used to be hardcoded to 0, so the active tab always docked flush into the panel. Defaults to 0 (no visual change); raise it to render fully-rounded, standalone rail items such as a routed settings/profile subnav.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'New hub-panels-theme(...) SCSS mixin: one-call token theming for <hub-panels>. $accent feeds the single --hub-panels-accent slot (the component derives the emphasis/subtle/on family), alongside the panel surface and the tab appearance. Every parameter is null-defaulted and additive; for any token not exposed, set the --hub-panels-* custom property directly.'
						},
						{
							type: 'changed',
							description:
								"Packaging: the library now ships its SCSS at /styles, exposing hub-panels-theme as a first-class package entry (@use 'ng-hub-ui-panels/styles' as *;)."
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								'variant on <hub-panel> / <hub-panels> now accepts ANY colour: on top of the built-in semantic accents it takes a registered custom accent or a literal colour (#ff0000, rgb(...), oklch(...), a CSS named colour), resolved through the shared resolveHubAccent helper. The single accent slot derives the rest of the family, so built-in colours are unchanged.'
						},
						{
							type: 'changed',
							description:
								'Internal: @HostBinding / @HostListener decorators replaced by the host metadata object (Angular style guide). No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'New <hub-tab-nav> — a lightweight, content-less, value-bound tab strip (role=tablist) that emits the selected value via a two-way active model, for segmented controls / filter switches / manual tabs-with-external-content. Supports tabs/pills appearances, justified/vertical layouts and roving-tabindex keyboard nav.'
						},
						{
							type: 'added',
							description:
								'Card panels now honour [variant]: a plain card reflects data-variant and tints its bg/text/border from a single inline accent (--hub-panels-card-accent) with the same open color-mix + ds-tint model as the alert. New --hub-panels-card-border-style (e.g. dashed empty-state cards).'
						},
						{
							type: 'added',
							description:
								'New <hub-panel flush> input (zero card body padding) and <hub-panel fill> input (fill-height card with a scrolling body; the wrappers gain stable classes and --hub-panels-body-gap spaces stacked children).'
						},
						{
							type: 'added',
							description:
								'New <hub-panel standalone> static attribute: opts a loose panel out of an ancestor tabs/pills/accordion group in the same template so it renders as a plain card (the case host: true cannot cover).'
						},
						{
							type: 'changed',
							description:
								'--hub-panels-card-box-shadow and --hub-panels-panel-header-bg are now inheritable (default moved to the usage-site var() fallback) so an ancestor can set them; identical default, no visual change.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'A standalone <hub-panel> nested (transitively) inside a tab pane no longer registers as a hidden tab of the outer <hub-panels>: the group injection is now bounded with host: true, so a panel binds only to a group declared in the same template and renders as a card/alert otherwise. The providers: [{ provide: PanelsComponent, useValue: null }] workaround is no longer needed.'
						},
						{
							type: 'changed',
							description:
								'Canonical accent-slot derivation: the group role family (emphasis/subtle/on) now derives locally from the single --hub-panels-accent slot with the design-system formulas, so custom accents re-derive the full family at runtime; built-in variants only re-base the accent slot.'
						},
						{
							type: 'changed',
							description:
								'The alert open-set default (appearance="alert" with a custom variant) uses the same canonical tints as the built-ins (12% background over surface, 80% text over ink).'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'added',
							description:
								'Open-set accent variants: <hub-panels variant="…"> and <hub-panel appearance="alert" variant="…"> ship all 9 built-ins (primary…dark) with exact ds tints, and any custom string keeps working at runtime by defining a single --hub-sys-color-<name>.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-22',
					changes: [
						{
							type: 'added',
							description:
								'New variant input on <hub-panels> selecting the semantic accent of the navigation strip (active/hover tab, active pill, active accordion header). Built-in variants (primary | success | danger | warning | info) use the exact design-system tints; any custom string is also accepted and derived with color-mix. Defaults to primary.'
						},
						{
							type: 'added',
							description:
								'New group-accent tokens --hub-panels-accent, --hub-panels-accent-emphasis and --hub-panels-accent-subtle; the strip active/hover affordances now resolve through this single accent instead of being hard-wired to --hub-sys-color-primary*.'
						},
						{
							type: 'changed',
							description:
								'The outer container chrome now inherits from the --hub-container-* base layer (re-base hook), so overriding a container token on a subtree re-bases the panels chrome. No visual change with default tokens.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: inline fallback defaults now match the canonical ng-hub-ui-ds values, and the hardcoded literals left behind (z-index, font-weight, line-height, radii and theme-aware colours) go through their --hub-sys-* / --hub-ref-* tokens, so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description:
								'Aligned with Angular 22. The major number of this package states the Angular major it targets, so this release is a compatibility statement rather than an API break.'
						},
						{
							type: 'changed',
							description: 'README documentation standardized.'
						}
					]
				},
				{
					version: '21.3.0',
					date: '2026-06-16',
					changes: [
						{
							type: 'added',
							description:
								'New alert appearance for a standalone <hub-panel>: appearance="alert" with a variant renders a semantic callout (role="alert").'
						},
						{
							type: 'added',
							description:
								'New variant input (primary | success | danger | warning | info) selecting the alert colour; omit it for a neutral alert. Exported HubPanelAppearance and HubPanelVariant types.'
						},
						{
							type: 'added',
							description:
								'New alert tokens (--hub-panels-alert-*); each variant re-points them at the --hub-sys-color-<variant>-{subtle,border-subtle,emphasis} family, so the alert inherits every theme and dark mode automatically.'
						}
					]
				},
				{
					version: '21.2.0',
					date: '2026-06-14',
					changes: [
						{
							type: 'added',
							description:
								'New card visualization (type="card"): a chromeless format with no navigation strip where every <hub-panel> is always visible and styled as a card.'
						},
						{
							type: 'added',
							description:
								'A <hub-panel> can now be used standalone, outside any <hub-panels> container, rendering as a card on its own.'
						},
						{
							type: 'added',
							description:
								'New content-slot directives hubPanelHeader and hubPanelFooter, rendering header/footer bands in every view, distinct from the navigational hubPanelHeading.'
						}
					]
				},
				{
					version: '21.1.1',
					date: '2026-06-12',
					changes: [
						{
							type: 'added',
							description:
								'New token: --hub-panels-header-bg, used by the tabs/pills strip background while defaulting to the panel surface.'
						},
						{
							type: 'added',
							description:
								'New token: --hub-panels-pill-content-border-width, which controls the bordered card chrome in the pills content area.'
						},
						{
							type: 'changed',
							description:
								'The active header background now defaults to --hub-panels-content-bg so the active tab/panel fusion stays aligned when themes retint the content surface.'
						},
						{
							type: 'changed',
							description:
								'The pills content area is borderless by default; themes can opt back into a bordered card by overriding --hub-panels-pill-content-border-width.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-06-11',
					changes: [
						{
							type: 'added',
							description:
								'Multiple selection in the tabs/pills views: each open pane becomes its own bordered box placed next to the others (side by side when horizontal, stacked when vertical), with a per-pane minimum and scroll on overflow.'
						},
						{
							type: 'added',
							description:
								'New tokens: --hub-panels-pane-min-width, --hub-panels-pane-min-height, --hub-panels-pane-gap, --hub-panels-nav-content-gap, --hub-panels-pill-gap.'
						},
						{
							type: 'fixed',
							description:
								'Accordion content was always empty (two unselected ng-content slots); replaced with a single projection slot.'
						},
						{
							type: 'fixed',
							description:
								'tabs and vertical tabs now render as a single bordered box around the strip and content together (not two boxes); pills gain spacing before a bordered content card.'
						},
						{
							type: 'changed',
							description:
								'Smooth strip scrolling, not-allowed cursor on disabled headers, and full-width container.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-06-11',
					changes: [
						{
							type: 'added',
							description: 'Initial release of ng-hub-ui-panels with tabs, pills and accordion visualizations.'
						},
						{
							type: 'added',
							description:
								'ControlValueAccessor integration with single and multiple selection, bindValue and compareWith.'
						},
						{
							type: 'added',
							description:
								'Routed panels via routerLink with route/full pathMatch and a <router-outlet> content area.'
						},
						{
							type: 'added',
							description:
								'Keyboard navigation (arrows/Home/End/Delete), scrollable, vertical and justified strips.'
						},
						{
							type: 'added',
							description:
								'Accordion view with multiple expansion, flush layout and an animated grid-based collapse.'
						},
						{
							type: 'added',
							description:
								'Custom header templates through the hubPanelHeading directive and full --hub-panels-* theming.'
						},
						{
							type: 'changed',
							description:
								'Supersedes ng-hub-ui-accordion; the accordion view honours the --hub-accordion-* token contract for theme compatibility.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'type',
					type: "'tabs' | 'pills' | 'accordion' | 'card'",
					required: false,
					defaultValue: "'tabs'",
					description: 'DOCS.PANELS.API.INPUT.TYPE.DESCRIPTION'
				},
				{
					name: 'vertical',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.VERTICAL.DESCRIPTION'
				},
				{
					name: 'justified',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.JUSTIFIED.DESCRIPTION'
				},
				{
					name: 'scrollable',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.SCROLLABLE.DESCRIPTION'
				},
				{
					name: 'isKeysAllowed',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.PANELS.API.INPUT.IS_KEYS_ALLOWED.DESCRIPTION'
				},
				{
					name: 'multiple',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.MULTIPLE.DESCRIPTION'
				},
				{
					name: 'flush',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.FLUSH.DESCRIPTION'
				},
				{
					name: 'togglePosition',
					type: "'start' | 'end'",
					required: false,
					defaultValue: "'end'",
					description: 'DOCS.PANELS.API.INPUT.TOGGLE_POSITION.DESCRIPTION'
				},
				{
					name: 'variant',
					type: 'HubPanelVariant | string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.PANELS_VARIANT.DESCRIPTION'
				},
				{
					name: 'bindValue',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.BIND_VALUE.DESCRIPTION'
				},
				{
					name: 'compareWith',
					type: '(a: unknown, b: unknown) => boolean',
					required: false,
					defaultValue: '(a, b) => a === b',
					description: 'DOCS.PANELS.API.INPUT.COMPARE_WITH.DESCRIPTION'
				},
				{
					name: 'heading',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.HEADING.DESCRIPTION'
				},
				{
					name: 'appearance',
					type: "'card' | 'alert'",
					required: false,
					defaultValue: "'card'",
					description: 'DOCS.PANELS.API.INPUT.APPEARANCE.DESCRIPTION'
				},
				{
					name: 'variant',
					type: 'HubPanelVariant | string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'fill',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.FILL.DESCRIPTION'
				},
				{
					name: 'standalone',
					type: 'boolean (static attribute)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.STANDALONE.DESCRIPTION'
				},
				{
					name: 'id',
					type: 'string',
					required: false,
					defaultValue: "'hub-panel-<n>'",
					description: 'DOCS.PANELS.API.INPUT.ID.DESCRIPTION'
				},
				{
					name: 'value',
					type: 'unknown',
					required: false,
					defaultValue: 'id',
					description: 'DOCS.PANELS.API.INPUT.VALUE.DESCRIPTION'
				},
				{
					name: 'active',
					type: 'boolean (model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.ACTIVE.DESCRIPTION'
				},
				{
					name: 'disabled',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.DISABLED.DESCRIPTION'
				},
				{
					name: 'removable',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.REMOVABLE.DESCRIPTION'
				},
				{
					name: 'removeLabel',
					type: 'string',
					required: false,
					defaultValue: "'Remove panel'",
					description: 'DOCS.PANELS.API.INPUT.REMOVE_LABEL.DESCRIPTION'
				},
				{
					name: 'routerLink',
					type: 'string | string[]',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.ROUTER_LINK.DESCRIPTION'
				},
				{
					name: 'queryParams',
					type: 'Params',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.QUERY_PARAMS.DESCRIPTION'
				},
				{
					name: 'pathMatch',
					type: "'route' | 'full'",
					required: false,
					defaultValue: "'route'",
					description: 'DOCS.PANELS.API.INPUT.PATH_MATCH.DESCRIPTION'
				},
				{
					name: 'customClass',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.CUSTOM_CLASS.DESCRIPTION'
				},
				{
					name: 'items',
					type: 'HubTabNavItem[]',
					required: false,
					defaultValue: '[]',
					description: 'DOCS.PANELS.API.INPUT.TAB_NAV_ITEMS.DESCRIPTION'
				},
				{
					name: 'active',
					type: 'unknown (model)',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.TAB_NAV_ACTIVE.DESCRIPTION'
				},
				{
					name: 'appearance',
					type: "'tabs' | 'pills'",
					required: false,
					defaultValue: "'tabs'",
					description: 'DOCS.PANELS.API.INPUT.TAB_NAV_APPEARANCE.DESCRIPTION'
				},
				{
					name: 'justified',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.TAB_NAV_JUSTIFIED.DESCRIPTION'
				},
				{
					name: 'vertical',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.TAB_NAV_VERTICAL.DESCRIPTION'
				},
				{
					name: 'mode',
					type: 'HubSidePanelMode',
					required: false,
					defaultValue: "'side'",
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_MODE.DESCRIPTION'
				},
				{
					name: 'position',
					type: 'HubSidePanelPosition',
					required: false,
					defaultValue: "'end'",
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_POSITION.DESCRIPTION'
				},
				{
					name: 'open',
					type: 'boolean (model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_OPEN.DESCRIPTION'
				},
				{
					name: 'closeOnEscape',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_CLOSE_ON_ESCAPE.DESCRIPTION'
				},
				{
					name: 'breakpoint',
					type: 'number',
					required: false,
					defaultValue: '768',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_BREAKPOINT.DESCRIPTION'
				},
				{
					name: 'autoFocus',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_AUTO_FOCUS.DESCRIPTION'
				},
				{
					name: 'role',
					type: 'HubSidePanelRole',
					required: false,
					defaultValue: "'complementary'",
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_ROLE.DESCRIPTION'
				},
				{
					name: 'ariaLabel',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_ARIA_LABEL.DESCRIPTION'
				},
				{
					name: 'ariaLabelledBy',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.PANELS.API.INPUT.SIDE_PANEL_ARIA_LABELLED_BY.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'panelChange',
					type: 'OutputEmitterRef<PanelChangeEvent>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.PANEL_CHANGE.DESCRIPTION'
				},
				{
					name: 'selectPanel',
					type: 'OutputEmitterRef<HubPanelComponent>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.SELECT_PANEL.DESCRIPTION'
				},
				{
					name: 'deselectPanel',
					type: 'OutputEmitterRef<HubPanelComponent>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.DESELECT_PANEL.DESCRIPTION'
				},
				{
					name: 'removed',
					type: 'OutputEmitterRef<HubPanelComponent>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.REMOVED.DESCRIPTION'
				},
				{
					name: 'activeChange',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.ACTIVE_CHANGE.DESCRIPTION'
				},
				{
					name: 'activeChange',
					type: 'OutputEmitterRef<unknown>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.TAB_NAV_ACTIVE_CHANGE.DESCRIPTION'
				},
				{
					name: 'openChange',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.PANELS.API.OUTPUT.SIDE_PANEL_OPEN_CHANGE.DESCRIPTION'
				}
			],
			templates: [
				{
					name: 'DOCS.PANELS.API.TEMPLATE.0.NAME',
					description: 'DOCS.PANELS.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-panel>
  <ng-template hubPanelHeading>
    <i class="fa-solid fa-gear"></i> Settings <hub-badge color="primary" shape="rounded">3</hub-badge>
  </ng-template>
  Panel content
</hub-panel>`
				},
				{
					name: 'DOCS.PANELS.API.TEMPLATE.1.NAME',
					description: 'DOCS.PANELS.API.TEMPLATE.1.DESCRIPTION',
					example: `<hub-panel>
  <div hubPanelHeader>Card title</div>
  Card content
  <div hubPanelFooter>Actions</div>
</hub-panel>`
				},
				{
					name: 'DOCS.PANELS.API.TEMPLATE.2.NAME',
					description: 'DOCS.PANELS.API.TEMPLATE.2.DESCRIPTION',
					example: `<hub-panels type="card">
  <hub-panel>…</hub-panel>
  <hub-panel>…</hub-panel>
</hub-panels>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['panels'] ?? [],
			methods: [
				{
					name: 'HubPanelsComponent.selectPanel',
					signature: 'selectPanel(panel: HubPanelComponent): void',
					description: 'DOCS.PANELS.API.METHOD.SELECT_PANEL.DESCRIPTION'
				},
				{
					name: 'HubPanelsComponent.togglePanel',
					signature: 'togglePanel(panel: HubPanelComponent): void',
					description: 'DOCS.PANELS.API.METHOD.TOGGLE_PANEL.DESCRIPTION'
				},
				{
					name: 'HubPanelsComponent.removePanel',
					signature: 'removePanel(panel: HubPanelComponent, options?: { reselect?: boolean; emit?: boolean }): void',
					description: 'DOCS.PANELS.API.METHOD.REMOVE_PANEL.DESCRIPTION'
				},
				{
					name: 'HubPanelsComponent.removePanelAndRefocus',
					signature: 'removePanelAndRefocus(panel: HubPanelComponent): void',
					description: 'DOCS.PANELS.API.METHOD.REMOVE_PANEL_AND_REFOCUS.DESCRIPTION'
				},
				{
					name: 'HubSidePanelComponent.toggle',
					signature: 'toggle(force?: boolean): void',
					description: 'DOCS.PANELS.API.METHOD.SIDE_PANEL_TOGGLE.DESCRIPTION'
				},
				{
					name: 'HubSidePanelComponent.close',
					signature: 'close(): void',
					description: 'DOCS.PANELS.API.METHOD.SIDE_PANEL_CLOSE.DESCRIPTION'
				}
			]
		},
		styling: [],
		mixins: {
			...MD_MIXINS['panels'],
			demos: [
				{
					title: 'Theming with hub-panels-theme',
					previewComponent: MixinPanelsExampleComponent,
					code: `@use 'ng-hub-ui-panels/styles' as panels;

.panels-mixin-scope {
	@include panels.hub-panels-theme(
		$accent: #7c3aed,
		$border-radius: 0.75rem
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities section of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every panels example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'panels-basic',
				title: 'DOCS.PANELS.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicPanelsExampleComponent',
				files: ['basic-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/basic-panels-example.component').then((m) => m.BasicPanelsExampleComponent)
			},
			{
				id: 'panels-pills',
				title: 'DOCS.PANELS.EXAMPLE.PILLS.TITLE',
				componentName: 'PillsPanelsExampleComponent',
				files: ['pills-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/pills-panels-example.component').then((m) => m.PillsPanelsExampleComponent)
			},
			{
				id: 'panels-accordion',
				title: 'DOCS.PANELS.EXAMPLE.ACCORDION.TITLE',
				componentName: 'AccordionPanelsExampleComponent',
				files: ['accordion-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/accordion-panels-example.component').then(
						(m) => m.AccordionPanelsExampleComponent
					)
			},
			{
				id: 'panels-vertical',
				title: 'DOCS.PANELS.EXAMPLE.VERTICAL.TITLE',
				componentName: 'VerticalPanelsExampleComponent',
				files: ['vertical-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/vertical-panels-example.component').then((m) => m.VerticalPanelsExampleComponent)
			},
			{
				id: 'panels-justified',
				title: 'DOCS.PANELS.EXAMPLE.JUSTIFIED.TITLE',
				componentName: 'JustifiedPanelsExampleComponent',
				files: ['justified-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/justified-panels-example.component').then(
						(m) => m.JustifiedPanelsExampleComponent
					)
			},
			{
				id: 'panels-scrollable',
				title: 'DOCS.PANELS.EXAMPLE.SCROLLABLE.TITLE',
				componentName: 'ScrollablePanelsExampleComponent',
				files: ['scrollable-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/scrollable-panels-example.component').then(
						(m) => m.ScrollablePanelsExampleComponent
					)
			},
			{
				id: 'panels-disabled',
				title: 'DOCS.PANELS.EXAMPLE.DISABLED.TITLE',
				componentName: 'DisabledPanelsExampleComponent',
				files: ['disabled-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/disabled-panels-example.component').then((m) => m.DisabledPanelsExampleComponent)
			},
			{
				id: 'panels-removable',
				title: 'DOCS.PANELS.EXAMPLE.REMOVABLE.TITLE',
				componentName: 'RemovablePanelsExampleComponent',
				files: ['removable-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/removable-panels-example.component').then(
						(m) => m.RemovablePanelsExampleComponent
					)
			},
			{
				id: 'panels-custom-heading',
				title: 'DOCS.PANELS.EXAMPLE.CUSTOM_HEADING.TITLE',
				componentName: 'CustomHeadingPanelsExampleComponent',
				files: ['custom-heading-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/custom-heading-panels-example.component').then(
						(m) => m.CustomHeadingPanelsExampleComponent
					)
			},
			{
				id: 'panels-reactive-forms',
				title: 'DOCS.PANELS.EXAMPLE.REACTIVE_FORMS.TITLE',
				componentName: 'ReactiveFormsPanelsExampleComponent',
				files: ['reactive-forms-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/reactive-forms-panels-example.component').then(
						(m) => m.ReactiveFormsPanelsExampleComponent
					)
			},
			{
				id: 'panels-multiple',
				title: 'DOCS.PANELS.EXAMPLE.MULTIPLE.TITLE',
				componentName: 'MultipleSelectionPanelsExampleComponent',
				files: ['multiple-selection-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/multiple-selection-panels-example.component').then(
						(m) => m.MultipleSelectionPanelsExampleComponent
					)
			},
			{
				id: 'panels-multiple-vertical',
				title: 'DOCS.PANELS.EXAMPLE.MULTIPLE_VERTICAL.TITLE',
				componentName: 'MultipleVerticalPanelsExampleComponent',
				files: ['multiple-vertical-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/multiple-vertical-panels-example.component').then(
						(m) => m.MultipleVerticalPanelsExampleComponent
					)
			},
			{
				id: 'panels-multiple-flush',
				title: 'DOCS.PANELS.EXAMPLE.MULTIPLE_FLUSH.TITLE',
				componentName: 'MultipleFlushPanelsExampleComponent',
				files: ['multiple-flush-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/multiple-flush-panels-example.component').then(
						(m) => m.MultipleFlushPanelsExampleComponent
					)
			},
			{
				id: 'panels-keyboard',
				title: 'DOCS.PANELS.EXAMPLE.KEYBOARD.TITLE',
				componentName: 'KeyboardPanelsExampleComponent',
				files: ['keyboard-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/keyboard-panels-example.component').then((m) => m.KeyboardPanelsExampleComponent)
			},
			{
				id: 'panels-card',
				title: 'DOCS.PANELS.EXAMPLE.CARD.TITLE',
				componentName: 'CardPanelsExampleComponent',
				files: ['card-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/card-panels-example.component').then((m) => m.CardPanelsExampleComponent)
			},
			{
				id: 'panels-alert',
				title: 'DOCS.PANELS.EXAMPLE.ALERT.TITLE',
				componentName: 'AlertPanelsExampleComponent',
				files: ['alert-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/alert-panels-example.component').then((m) => m.AlertPanelsExampleComponent)
			},
			{
				id: 'panels-variant',
				title: 'DOCS.PANELS.EXAMPLE.VARIANT.TITLE',
				componentName: 'VariantPanelsExampleComponent',
				files: ['variant-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/variant-panels-example.component').then((m) => m.VariantPanelsExampleComponent)
			},
			{
				id: 'panels-tab-nav',
				title: 'DOCS.PANELS.EXAMPLE.TAB_NAV.TITLE',
				componentName: 'TabNavPanelsExampleComponent',
				files: ['tab-nav-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/tab-nav-panels-example.component').then((m) => m.TabNavPanelsExampleComponent)
			},
			{
				id: 'panels-card-slots',
				title: 'DOCS.PANELS.EXAMPLE.CARD_SLOTS.TITLE',
				componentName: 'CardSlotsPanelsExampleComponent',
				files: ['card-slots-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/card-slots-panels-example.component').then(
						(m) => m.CardSlotsPanelsExampleComponent
					)
			},
			{
				id: 'panels-heading-actions',
				title: 'DOCS.PANELS.EXAMPLE.HEADING_ACTIONS.TITLE',
				componentName: 'HeadingActionsPanelsExampleComponent',
				files: ['heading-actions-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/heading-actions-panels-example.component').then(
						(m) => m.HeadingActionsPanelsExampleComponent
					)
			},
			{
				id: 'panels-mixin',
				title: 'DOCS.PANELS.EXAMPLE.MIXIN.TITLE',
				componentName: 'MixinPanelsExampleComponent',
				files: ['mixin-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/mixin-panels-example.component').then((m) => m.MixinPanelsExampleComponent)
			},
			{
				id: 'panels-side-panel',
				title: 'DOCS.PANELS.EXAMPLE.SIDE_PANEL.TITLE',
				componentName: 'SidePanelPanelsExampleComponent',
				files: ['side-panel-panels-example.component.ts'],
				loader: () =>
					import('../examples/panels/side-panel-panels-example.component').then(
						(m) => m.SidePanelPanelsExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'panels'
			});
		});
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview
	 * component so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		const registry = this._exampleRegistry;

		this.panelsLibrary.functionalities = PANELS_FUNCTIONALITIES.map((group) => ({
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
						previewComponent: PANELS_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
