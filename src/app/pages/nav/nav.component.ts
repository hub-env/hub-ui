import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { NAV_FUNCTIONALITIES } from './nav-functionalities';
import { NAV_PLAYGROUND } from './nav-playground';
import { BasicHorizontalNavExampleComponent } from '../examples/nav/basic-horizontal-nav-example.component';
import { VerticalAccordionNavExampleComponent } from '../examples/nav/vertical-accordion-nav-example.component';
import { VerticalFlyoutNavExampleComponent } from '../examples/nav/vertical-flyout-nav-example.component';
import { RailCollapseNavExampleComponent } from '../examples/nav/rail-collapse-nav-example.component';
import { VerticalStickyNavExampleComponent } from '../examples/nav/vertical-sticky-nav-example.component';
import { NestedDropdownsNavExampleComponent } from '../examples/nav/nested-dropdowns-nav-example.component';
import { HeadersSeparatorsNavExampleComponent } from '../examples/nav/headers-separators-nav-example.component';
import { DisabledStatesNavExampleComponent } from '../examples/nav/disabled-states-nav-example.component';
import { DropdownTriggersNavExampleComponent } from '../examples/nav/dropdown-triggers-nav-example.component';
import { ResponsiveCollapseNavExampleComponent } from '../examples/nav/responsive-collapse-nav-example.component';
import { BrandSlotNavExampleComponent } from '../examples/nav/brand-slot-nav-example.component';
import { CustomItemTemplateNavExampleComponent } from '../examples/nav/custom-item-template-nav-example.component';
import { RtlNavExampleComponent } from '../examples/nav/rtl-nav-example.component';
import { EventsApiNavExampleComponent } from '../examples/nav/events-api-nav-example.component';
import { RouterActiveNavExampleComponent } from '../examples/nav/router-active-nav-example.component';
import { PanelDrilldownNavExampleComponent } from '../examples/nav/panel-drilldown-nav-example.component';
import { MixedExpandModesNavExampleComponent } from '../examples/nav/mixed-expand-modes-nav-example.component';
import { SidebarRightPanelNavExampleComponent } from '../examples/nav/sidebar-right-panel-nav-example.component';
import { TruncatedLabelsNavExampleComponent } from '../examples/nav/truncated-labels-nav-example.component';
import { MixinNavExampleComponent } from '../examples/nav/mixin-nav-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const NAV_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'nav-basic-horizontal': BasicHorizontalNavExampleComponent,
	'nav-vertical-accordion': VerticalAccordionNavExampleComponent,
	'nav-vertical-flyout': VerticalFlyoutNavExampleComponent,
	'nav-vertical-sticky': VerticalStickyNavExampleComponent,
	'nav-rail-collapse': RailCollapseNavExampleComponent,
	'nav-nested-dropdowns': NestedDropdownsNavExampleComponent,
	'nav-headers-separators': HeadersSeparatorsNavExampleComponent,
	'nav-disabled-states': DisabledStatesNavExampleComponent,
	'nav-dropdown-triggers': DropdownTriggersNavExampleComponent,
	'nav-responsive-collapse': ResponsiveCollapseNavExampleComponent,
	'nav-brand-slot': BrandSlotNavExampleComponent,
	'nav-custom-item-template': CustomItemTemplateNavExampleComponent,
	'nav-rtl-slots': RtlNavExampleComponent,
	'nav-events-api': EventsApiNavExampleComponent,
	'nav-router-active': RouterActiveNavExampleComponent,
	'nav-panel-drilldown': PanelDrilldownNavExampleComponent,
	'nav-mixed-expand-modes': MixedExpandModesNavExampleComponent,
	'nav-sidebar-right-panel': SidebarRightPanelNavExampleComponent,
	'nav-truncated-labels': TruncatedLabelsNavExampleComponent
};

/**
 * Main nav library documentation page component.
 */
@Component({
	selector: 'app-nav',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="navLibrary"
			[package]="'nav'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		>
		</app-library-page>
	`
})
export class NavComponent implements OnInit {
	protected readonly exampleGroups = NAV_FUNCTIONALITIES;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = NAV_PLAYGROUND;

	/**
	 * Complete nav library data.
	 */
	navLibrary: Library = {
		title: 'ng-hub-ui-nav',
		description:
			'A flexible, accessible navigation component supporting horizontal and vertical orientations, unlimited dropdown nesting, responsive collapsing, brand slots, and full Angular Router integration.',
		overview: {
			text: 'Built with modern Angular Signals architecture and inspired by Bootstrap 5.3 navbar, this library provides a fully data-driven navigation solution. It supports horizontal and vertical layouts, accordion and flyout vertical modes, responsive collapsing (offcanvas, dropdown, fullscreen), custom templates via directives, and comprehensive WCAG 2.1 AA keyboard navigation. All visual aspects are customizable through CSS custom properties following a two-layer design token system.',
			highlights: [
				{
					icon: 'fa-solid fa-compass',
					title: 'Vertical & Horizontal Layouts',
					description:
						'Toggle between sidebar (vertical) and top-bar (horizontal) layouts with a single input — no structural refactoring needed.'
				},
				{
					icon: 'fa-solid fa-sitemap',
					title: 'Unlimited Nesting Depth',
					description:
						'Define nested sub-menus to any depth; the component renders drilldown panels or fly-out sub-menus automatically.'
				},
				{
					icon: 'fa-solid fa-mobile-screen',
					title: 'Responsive Collapse',
					description:
						'The navigation collapses into a hamburger-triggered mobile panel on small screens with smooth open/close animations.'
				},
				{
					icon: 'fa-solid fa-link',
					title: 'Router Active State Sync',
					description:
						'Active item highlighting is driven by Angular Router so the selected item always matches the current URL.'
				},
				{
					icon: 'fa-solid fa-eye',
					title: 'Scroll Spy Integration',
					description:
						'Built-in scroll spy directive automatically highlights the nav item corresponding to the visible page section.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Custom Item Templates',
					description:
						'Replace default nav items with any Angular template using the NavItemTemplate directive for badges, avatars, or rich metadata.'
				},
				{
					icon: 'fa-solid fa-arrows-left-right',
					title: 'Collapsible Sidebar Panel',
					description:
						'The sidebar panel can be toggled open/closed programmatically or by the user with animated width transitions.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Background, active colour, hover state, width, and every border are exposed as CSS custom properties for full brand control.'
				}
			],
			changelog: [
				{
					version: '22.14.1',
					date: '2026-09-13',
					changes: [
						{
							type: 'fixed',
							description:
								'Every click on an entry of an open panel mounted that panel again: the route sync rebuilt the panel stack with new ids, the container tracks panels by id, and the panel replayed its entrance animation and its items jumped. Moving between the entries of the panels already open now keeps them and only re-reads their items.'
						}
					]
				},
				{
					version: '22.14.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'fixed',
							description:
								'A nav with --hub-nav-border-radius came out rounded on the side its items are on and square on the side its drill-down panel was open, because the panel paints a fill of its own over the rail. The outermost panel now takes the nav own radius on its closing corners, and a right-hand sidebar takes it on the other side.'
						}
					]
				},
				{
					version: '22.13.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'--hub-nav-bg-image, so the bar can carry a gradient. The fill was only ever background-color, which takes a color and nothing else. A gradient is an image, so a var() holding one computes to an invalid value there and the declaration drops to unset: the bar ends up with no fill at all rather than falling back to the colour. The image now travels on its own property, layered over --hub-nav-bg, which keeps that colour as the fallback when the image is absent or fails. Nothing changes for a bar that does not set it.'
						}
					]
				},
				{
					version: '22.12.1',
					date: '2026-09-07',
					changes: [
						{
							type: 'changed',
							description:
								'The rail tooltip is drawn by [hubTooltip]. A collapsed rail hides the item labels and puts each one in a tooltip; that tooltip came from [tooltip], which ng-hub-ui-utils removes in 22.14.0 because a bare attribute is a name in the application namespace rather than a library one. The prefixed directive is the same tooltip, so nothing about the rail changes.'
						}
					]
				},
				{
					version: '22.12.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'The flyout panel stayed hanging where its trigger had been. In a menu that mixes the two expansions, opening a floating section closes the accordion above it and everything underneath rises to fill the gap, the trigger included. Neither of the two things the overlay watched, the page scrolling and the window resizing, happens there, so the panel kept the height the trigger had before the collapse and was left orphaned halfway down the menu. The collapse is animated, so it is not a jump either: the trigger slides for the length of the transition and the panel now travels with it the whole way. Fixed in ng-hub-ui-utils 22.13.0, which is what this release requires.'
						},
						{
							type: 'changed',
							description:
								'ng-hub-ui-utils peer floor raised to >=22.13.0, which is where the overlay learned to follow a trigger that moves. Below it the flyout panel still parts company with its item, so the floor is what keeps the fix above from being a promise the installed packages cannot keep. Raising a floor is also what makes this release a minor rather than the patch it started as; the fix itself changes no public shape in this library.'
						},
						{
							type: 'fixed',
							description:
								'A mixed menu left the panel of the section you had just walked out of on screen. Where one root drills down into panels and another expands in place, landing on the accordion root synchronised the dropdowns and left the panel stack alone, and since an accordion never touches that stack nothing ever closed it: two sections were open at once, one of them the section just left. The mirror image was true too, a panel root leaving the previous accordion expanded beside its new panel. Each root now clears whatever the other opened, while moving inside the root you are already in still leaves that section standing.'
						},
						{
							type: 'fixed',
							description:
								'A first entry sitting on the language prefix swallowed every route match. The active root was taken to be the first item matching the URL, and an item routed at /en/ matches every page in the site, so the section actually holding the route was never the one resolved: accordion sections stayed shut on every page and their navigation was handed to the panel stack instead. The active root and the trail of open dropdowns now both resolve by the longest matching route, the rule the panel opener already followed.'
						},
						{
							type: 'fixed',
							description:
								'A page outside the menu left the last section marked open. Panels were cleared when no item matched the URL, the dropdowns were not, so the nav went on claiming the reader was inside a section they had left. Both are cleared now, and likewise when the route lands on a root with no children of its own.'
						},
						{
							type: 'changed',
							description:
								'closeAllDropdowns() and closeAllPanels() on HubNavStateService skip the write when there is nothing open. Route synchronisation calls both on every navigation, and a signal has no value equality, so writing an empty set over an empty set woke every reader for nothing.'
						}
					]
				},
				{
					version: '22.11.3',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'A section marked the way the README teaches was never tracked. A valueless hubNavScrollSpySection attribute reaches the directive as the empty string rather than as null, which is how Angular initialises a static attribute with no value, so the nullish fallback to the host id never ran: the host marker attribute was stripped and the container found no sections at all. The spy stayed silent, with no activeSectionChange and nothing in the console to explain it, and consumers had to bind the id twice, once as id and once as [hubNavScrollSpySection], to get back the behaviour the directive already promised. The fallback is now falsy-aware, so the documented bare form works and the explicit form is unchanged.'
						}
					]
				},
				{
					version: '22.11.2',
					date: '2026-09-02',
					changes: [
						{
							type: 'fixed',
							description:
								'A sidebar came back from mobile without its section panel. Narrowing the window below collapseBreakpoint and widening it again left the nav expanded but panel-less: crossing back up emptied the panel stack, and nothing refilled it, because panels are derived from the route only on navigation. The user had to navigate somewhere else, anywhere, to get back the section they were already in. The stack is now re-derived from the current URL rather than left empty - not merely kept, because while collapsed the offcanvas navigates without touching the panels, so what survived would describe the page the user left. With autoOpenFromRoute off the stack is whatever the user opened by hand and nothing could rebuild it, so it is left untouched instead.'
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
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. Metadata only."
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-08-19',
					changes: [
						{
							type: 'added',
							description:
								"isLast on hub-nav-panel, marking the outermost panel of a vertical stack so it can close the stack's edge."
						},
						{
							type: 'added',
							description:
								'--hub-nav-panel-last-shadow (default none), the shadow of that terminal panel. Dropped by default because that panel now closes its edge with a border, and the boundary should be drawn once.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-08-16',
					changes: [
						{
							type: 'fixed',
							description:
								'The scroll spy could never reach the last sections of a page: its observation band stops partway down the viewport, so once the container has nothing left to scroll, everything below that line was unreachable — clicking the final entry of a seven-example page settled the mark four items above it. The last section now wins outright at the end of the container. Selection also went by intersectionRatio, which measures how much of a section fits the band rather than which comes first, so a short block beat the tall one the reader was in the middle of; the topmost section wins now.'
						},
						{
							type: 'added',
							description:
								'config.followReplacedUrls sets how eagerly the nav follows a scroll spy, which names the section under the reader by replacing the URL: true follows each report (the previous behaviour and the default), a number of milliseconds follows only once the reports go quiet so a scroll lands the mark once, and false never follows. On a thirty-item panel that turns twenty highlight changes in six seconds of reading into one. Alongside it, the active mark can travel between items instead of appearing and disappearing in place (config.activeIndicator, off by default). One element per list, parked over whichever sibling is active and moved with a transform, so the animation never touches the layout; duration and easing come from the new --hub-nav-item-active-indicator-transition. Opt-in because the mark is normally painted by each item, so turning it on moves the same pixels to a node the list owns. Travelling says you chose to go here, and most moves are not that: the mark travels for a pushed navigation and arrives for a replaced one, which is how a scroll spy reports position — otherwise it flies up and down a long panel while the reader is only reading. A relayout is treated the same way. Travel only means something between siblings: crossing into a submenu, a drill-down panel or a collapsed rail swaps one list for another, so each list owns its mark and it fades in there. Geometry is measured and re-measured through a ResizeObserver, since the rail, the accordion and the viewport all resize items without the list hearing about it. Honours prefers-reduced-motion.'
						}
					]
				},
				{
					version: '22.9.1',
					date: '2026-08-16',
					changes: [
						{
							type: 'fixed',
							description:
								'An item stopped being marked active when the application serialized URLs with a trailing slash. /products and /products/ are the same place, and a canonical trailing-slash UrlSerializer is an ordinary SEO choice, but route matching compared the two as raw strings — so every item declared without the slash silently stopped matching, and only its ancestors stayed lit because their prefix test tolerates one. Worst on items differing from their siblings only by fragment: none ever matched, so a scroll-spy panel appeared dead. Paths are now compared normalized, root excluded.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-08-15',
					changes: [
						{
							type: 'added',
							description:
								'Desktop icon rail: the new two-way rail input collapses a vertical nav to --hub-nav-rail-width showing icons only. A built-in edge toggle (config.railToggle, default true, fully themeable through the --hub-nav-rail-toggle-* tokens including a replaceable SVG arrow) flips the state; labels surface as tooltips, accordion groups open as click-triggered overlay flyouts, and below collapseBreakpoint the offcanvas behavior always wins. The library persists nothing — railChange lets the host store the preference.'
						},
						{
							type: 'added',
							description:
								'Localizable built-in labels: the previously hardcoded ARIA strings (Toggle navigation, Close navigation, Go back, Close panel, Toggle {label}) now resolve from HUBUI.NAV.* keys via the shared translation adapter, with per-instance overrides through config.labels.'
						}
					]
				},
				{
					version: '22.8.4',
					date: '2026-08-13',
					changes: [
						{
							type: 'fixed',
							description:
								'Route-aware panel sidebars now choose the most specific active root item when opening panels. A localized Home route such as /en/ no longer wins over /en/forms/overview/, so deep links keep the active library secondary panel open instead of leaving only its root entry highlighted.'
						}
					]
				},
				{
					version: '22.8.3',
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
					version: '22.8.2',
					date: '2026-08-07',
					changes: [
						{
							type: 'fixed',
							description:
								'A section no longer blinks when you click inside it. Clicking an entry closed every dropdown — right for a flyout, which is transient and dismissed by the click — but an accordion opened from the route states where you are, so closing it and letting the route reopen it a tick later made the section shut and open again on every navigation. The click now leaves the dropdown state alone when the route owns it (autoOpenFromRoute on an accordion) and still dismisses a flyout.'
						}
					]
				},
				{
					version: '22.8.1',
					date: '2026-08-07',
					changes: [
						{
							type: 'fixed',
							description:
								'An accordion opens the section you navigated into. Opening from the route was decided by whether the rail was collapsed and nothing else, so a vertical accordion arrived at /products with its section shut, while the panel it opened instead sat behind the page, invisible to the eye and the pointer. The expanded rail now consults the effective expand mode of the section holding the active route, so an accordion syncs its dropdowns and only a flyout or panel rail opens panels.'
						},
						{
							type: 'fixed',
							description:
								'Two entries no longer claim to be where you are. Marking a section on everything below it also marked an entry whose route prefixes a sibling\'s: at /products/categories, both "Products" (/products) and "Categories" lit up. The longest matching route among siblings wins now, so the catalogue is marked there and the list is still marked at /products/42/edit. An exact match is never overridden, and a dropdown that matched through a child keeps its mark.'
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-08-06',
					changes: [
						{
							type: 'fixed',
							description:
								'The rail keeps its mark on a detail page. An item was active only on its exact route, so opening a record — /customers/42/edit from /customers — cleared the mark. An item is now active on its own route and on anything below it, matched by whole segments (/products is not marked by /products-archive), with the query string ignored. A root item (/) still matches only itself, and routerLinkActiveOptions: { exact: true } — declared but never read until now — opts an item back into strict matching. Dropdowns follow their children.'
						}
					]
				},
				{
					version: '22.7.2',
					date: '2026-07-27',
					changes: [
						{
							type: 'fixed',
							description:
								'aria-orientation on the menu tree: the root menubar now announces vertical when the nav renders as a sidebar (WAI-ARIA defaults menubar to horizontal), and submenu/dropdown menus declare vertical explicitly. Keyboard behavior was already orientation-aware — only the attribute was missing.'
						}
					]
				},
				{
					version: '22.7.1',
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
					version: '22.7.0',
					date: '2026-07-08',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING — the semantic accent input variant is renamed to color, for consistency with the rest of the hub-ui family (hub-button, hub-badge, hub-metrics, hub-milestone, all color). Migration: <hub-nav variant="primary"> becomes <hub-nav color="primary">. The internal data-variant attribute and the :host([data-variant=…]) token rules are unchanged.'
						},
						{
							type: 'added',
							description:
								'The offcanvas mobile drawer forwards hubNavItemTemplate and projects the hubNavStart / hubNavEnd slots, so it matches the desktop nav instead of rendering bare items. New HubNavMobilePanelComponent inputs: itemTemplate, startTemplate, endTemplate.'
						},
						{
							type: 'added',
							description:
								'inDrawer slot context on HubNavStartTemplateContext / HubNavEndTemplateContext, true only inside the offcanvas drawer, so a full header can render there while the collapsed top bar stays slim.'
						},
						{
							type: 'added',
							description:
								'--hub-nav-collapsed-justify (justify-content of the collapsed top-bar row), plus --hub-nav-border-radius and --hub-nav-box-shadow, so the whole nav can become a floating card through tokens alone.'
						},
						{
							type: 'fixed',
							description:
								'The vertical primary column no longer pins --hub-nav-panel-width when there are no panels, which overflowed a narrower rail; it fills its container and only pins the fixed width under the new .hub-nav--has-panels host class.'
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
								'hub-nav-theme(...) SCSS mixin — one-call token theming for hub-nav: $accent feeds the single --hub-nav-accent slot and the component derives the rest of the role family, alongside the bar surface and the item appearance.'
						},
						{
							type: 'changed',
							description:
								"Packaging — the library ships its SCSS at /styles, so the mixin is a first-class package entry: @use 'ng-hub-ui-nav/styles' as *;."
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
								'The accent input accepts ANY colour: on top of the built-in semantic accents it now takes a registered custom accent and a literal colour (#hex, rgb(), oklch(), a CSS named colour), resolved through resolveHubAccent from ng-hub-ui-utils.'
						},
						{
							type: 'changed',
							description:
								'Internal — host bindings moved from @HostBinding / @HostListener decorators to the host metadata object, per the Angular style guide. No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-02',
					changes: [
						{
							type: 'changed',
							description:
								'--hub-nav-accent-subtle now uses the canonical design-system derivation (a 12% mix instead of 14%), so a custom accent re-derives the same role family a built-in one gets.'
						},
						{
							type: 'fixed',
							description:
								'SSR/prerender no longer logs "requestAnimationFrame is not defined": the scroll-spy directive scheduled its IntersectionObserver setup through requestAnimationFrame on every platform, and is now inert outside the browser.'
						},
						{
							type: 'fixed',
							description:
								'Nav transitions actually run when the ds tokens are loaded. The ds transition tokens are complete transition values, but the components composed them after a property name, producing an invalid declaration that silently disabled every item, caret, panel and mobile transition. The accordion animation and the panel transition were fixed the same way.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								"Tooltip on truncated item labels: a label clipped with an ellipsis reveals its full text on hover, through ng-hub-ui-utils' [hubOverflowTooltip] and only when the label actually overflows. The tooltip is agnostic and can be swapped with provideHubTooltip(...)."
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
								'Open-set accent variants: the accent input now takes the full open accent set out of the box, and any other name works with no recompile — define a single --hub-sys-color-<name> and the whole hover/active treatment derives from it.'
						},
						{
							type: 'added',
							description:
								'Derived accent roles --hub-nav-accent-emphasis (accent mixed over the theme ink) and --hub-nav-accent-on (the contrast colour for text sitting on the accent). Both follow the active accent automatically.'
						},
						{
							type: 'changed',
							description:
								'BREAKING — canonical zindex token names: --hub-nav-dropdown-z-index becomes --hub-nav-dropdown-zindex, --hub-nav-mobile-z-index becomes --hub-nav-mobile-zindex, and --hub-nav-panel-z-index becomes --hub-nav-panel-zindex, matching the --hub-sys-zindex-* convention.'
						},
						{
							type: 'changed',
							description:
								'All accent derivations now interpolate in the OKLCH colour space for perceptually even tints across every accent. No token API change; tints shift very slightly.'
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
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded literals routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description:
								'The semantic accent input on hub-nav, selecting the accent of the hover/active affordances. The built-in accents render with the exact design-system tints, and any other string is accepted too — the nav reads --hub-sys-color-<name> from the host application.'
						},
						{
							type: 'added',
							description:
								'--hub-nav-accent (defaults to --hub-sys-color-primary): --hub-nav-item-hover-color and --hub-nav-item-active-bg now resolve through this single accent instead of being hard-wired to the primary colour.'
						},
						{
							type: 'added',
							description:
								'Richer accent treatment for hover/active: soft color-mix tints (--hub-nav-accent-subtle), accent text, and — in a horizontal navbar only — an accent indicator bar along the bottom edge (--hub-nav-item-active-indicator-color, --hub-nav-item-active-indicator-size).'
						},
						{
							type: 'changed',
							description:
								'BREAKING (visual) — the active item moved from a solid accent fill with white text to a soft accent tint with accent text, the hover background is an accent tint instead of neutral grey, and the nav surface carries a faint accent wash. Override --hub-nav-item-active-bg / --hub-nav-item-active-color / --hub-nav-item-hover-bg / --hub-nav-bg to restore the previous look.'
						},
						{
							type: 'fixed',
							description:
								'Cross-layer token references aligned with the canonical ng-hub-ui-ds names, so the components follow the theme instead of only their inline fallback.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{ type: 'changed', description: 'Aligned with Angular 22, and README documentation standardized.' }
					]
				},
				{
					version: '21.1.1',
					date: '2026-04-12',
					changes: [
						{
							type: 'fixed',
							description:
								'Panel mode when a nav item has no dedicated caret: the panel now opens on a click anywhere on the label.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-04-01',
					changes: [
						{
							type: 'added',
							description:
								'Panel drill-down expand mode with stacked side panels, configurable max visible panels, and drill-down with back navigation.'
						},
						{
							type: 'added',
							description: 'Per-item expandMode override (accordion, flyout, or panel) on HubNavItem.'
						},
						{
							type: 'added',
							description: 'Sidebar positioning with sidebarSide config (left or right).'
						},
						{
							type: 'added',
							description: 'Panel keyboard navigation (Escape, ArrowLeft) and automatic focus management.'
						},
						{
							type: 'added',
							description: 'Mobile fallback: panel mode degrades to accordion when collapsed.'
						},
						{
							type: 'added',
							description: 'CSS custom properties for panel styling (--hub-nav-panel-*).'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-03-19',
					changes: [
						{ type: 'added', description: 'Initial release with horizontal and vertical navigation.' },
						{
							type: 'added',
							description:
								'Data-driven API with HubNavItem interface supporting link, dropdown, header, separator, and custom types.'
						},
						{
							type: 'added',
							description: 'Unlimited dropdown nesting with recursive rendering.'
						},
						{
							type: 'added',
							description: 'Responsive collapsing with offcanvas, dropdown, and fullscreen mobile panel modes.'
						},
						{
							type: 'added',
							description: 'Vertical accordion and flyout expand modes.'
						},
						{
							type: 'added',
							description:
								'Start/end slots via hubNavStart and hubNavEnd directives, plus custom item templates via hubNavItemTemplate.'
						},
						{
							type: 'added',
							description:
								'Full Angular Router integration with routerLink, routerLinkActive, fragment, and queryParams support.'
						},
						{
							type: 'added',
							description: 'WCAG 2.1 AA keyboard navigation with WAI-ARIA menubar/menu pattern.'
						},
						{
							type: 'added',
							description: 'Complete CSS custom properties token set with 60+ variables.'
						},
						{
							type: 'added',
							description: 'HubNavConfigService with InjectionToken for global default configuration.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{ name: 'items', type: 'HubNavItem[]', required: true, description: 'DOCS.NAV.API.INPUT.ITEMS.DESCRIPTION' },
				{
					name: 'config',
					type: 'Partial<HubNavConfig>',
					required: false,
					defaultValue: '{}',
					description: 'DOCS.NAV.API.INPUT.CONFIG.DESCRIPTION'
				},
				{
					name: 'navClass',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.NAV.API.INPUT.NAV_CLASS.DESCRIPTION'
				},
				{
					name: 'itemTemplate',
					type: 'TemplateRef<unknown> | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.NAV.API.INPUT.ITEM_TEMPLATE.DESCRIPTION'
				},
				{
					name: 'autoOpenFromRoute',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.NAV.API.INPUT.AUTO_OPEN_FROM_ROUTE.DESCRIPTION'
				},
				{
					name: 'color',
					type: "'primary' | 'success' | 'danger' | 'warning' | 'info' | string",
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.NAV.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'rail',
					type: 'boolean (two-way: model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.NAV.API.INPUT.RAIL.DESCRIPTION'
				},
				{
					name: 'orientation (config)',
					type: "'horizontal' | 'vertical'",
					required: false,
					defaultValue: "'horizontal'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_ORIENTATION.DESCRIPTION'
				},
				{
					name: 'verticalExpandMode (config)',
					type: "'accordion' | 'flyout' | 'panel'",
					required: false,
					defaultValue: "'accordion'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_VERTICAL_EXPAND_MODE.DESCRIPTION'
				},
				{
					name: 'dropdownTrigger (config)',
					type: "'hover' | 'click' | 'both'",
					required: false,
					defaultValue: "'click'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_DROPDOWN_TRIGGER.DESCRIPTION'
				},
				{
					name: 'dropdownRenderMode (config)',
					type: "'inline' | 'overlay'",
					required: false,
					defaultValue: "'inline'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_DROPDOWN_RENDER_MODE.DESCRIPTION'
				},
				{
					name: 'position (config)',
					type: "'static' | 'sticky' | 'fixed'",
					required: false,
					defaultValue: "'static'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_POSITION.DESCRIPTION'
				},
				{
					name: 'stickyTop (config)',
					type: 'string',
					required: false,
					defaultValue: "'0px'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_STICKY_TOP.DESCRIPTION'
				},
				{
					name: 'collapseMode (config)',
					type: "'offcanvas' | 'dropdown' | 'fullscreen'",
					required: false,
					defaultValue: "'offcanvas'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_COLLAPSE_MODE.DESCRIPTION'
				},
				{
					name: 'collapseBreakpoint (config)',
					type: 'number',
					required: false,
					defaultValue: '992',
					description: 'DOCS.NAV.API.INPUT.CONFIG_COLLAPSE_BREAKPOINT.DESCRIPTION'
				},
				{
					name: 'offcanvasPosition (config)',
					type: "'start' | 'end' | 'top' | 'bottom'",
					required: false,
					defaultValue: "'start'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_OFFCANVAS_POSITION.DESCRIPTION'
				},
				{
					name: 'ariaLabel (config)',
					type: 'string',
					required: false,
					defaultValue: "'Navigation'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_ARIA_LABEL.DESCRIPTION'
				},
				{
					name: 'panelMaxVisible (config)',
					type: 'number',
					required: false,
					defaultValue: '3',
					description: 'DOCS.NAV.API.INPUT.CONFIG_PANEL_MAX_VISIBLE.DESCRIPTION'
				},
				{
					name: 'sidebarSide (config)',
					type: "'left' | 'right'",
					required: false,
					defaultValue: "'left'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_SIDEBAR_SIDE.DESCRIPTION'
				},
				{
					name: 'panelWidth (config)',
					type: 'string',
					required: false,
					defaultValue: "'16rem'",
					description: 'DOCS.NAV.API.INPUT.CONFIG_PANEL_WIDTH.DESCRIPTION'
				},
				{
					name: 'railToggle (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.NAV.API.INPUT.CONFIG_RAIL_TOGGLE.DESCRIPTION'
				},
				{
					name: 'followReplacedUrls (config)',
					type: 'boolean | number',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.NAV.API.INPUT.CONFIG_FOLLOW_REPLACED_URLS.DESCRIPTION'
				},
				{
					name: 'activeIndicator (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.NAV.API.INPUT.CONFIG_ACTIVE_INDICATOR.DESCRIPTION'
				},
				{
					name: 'labels (config)',
					type: 'Partial<HubNavLabels>',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.NAV.API.INPUT.CONFIG_LABELS.DESCRIPTION'
				},
				{
					name: 'enabled (hubNavScrollSpy) — bound as [hubNavScrollSpy]',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.NAV.API.INPUT.SCROLL_SPY_ENABLED.DESCRIPTION'
				},
				{
					name: 'offset (hubNavScrollSpy)',
					type: 'number',
					required: false,
					defaultValue: '120',
					description: 'DOCS.NAV.API.INPUT.SCROLL_SPY_OFFSET.DESCRIPTION'
				},
				{
					name: 'sectionSelector (hubNavScrollSpy)',
					type: 'string',
					required: false,
					defaultValue: "'[data-hub-nav-scroll-spy-section]'",
					description: 'DOCS.NAV.API.INPUT.SCROLL_SPY_SECTION_SELECTOR.DESCRIPTION'
				},
				{
					name: 'sectionId (hubNavScrollSpySection)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.NAV.API.INPUT.SCROLL_SPY_SECTION_ID.DESCRIPTION'
				},
				{
					name: 'item (hub-nav-item)',
					type: 'HubNavItem',
					required: true,
					description: 'DOCS.NAV.API.INPUT.SUB_NAV_ITEM.DESCRIPTION'
				},
				{
					name: 'depth / isActive / isExpanded / forceAccordionMode (hub-nav-item; depth and forceAccordionMode also on hub-nav-item-list)',
					type: 'number / boolean / boolean / boolean',
					required: false,
					defaultValue: '0 / false / false / false',
					description: 'DOCS.NAV.API.INPUT.SUB_NAV_ITEM_STATE.DESCRIPTION'
				},
				{
					name: 'items (hub-nav-item-list)',
					type: 'HubNavItem[]',
					required: true,
					description: 'DOCS.NAV.API.INPUT.SUB_ITEM_LIST_ITEMS.DESCRIPTION'
				},
				{
					name: 'panels (hub-nav-panel-container)',
					type: 'HubNavPanelState[]',
					required: true,
					description: 'DOCS.NAV.API.INPUT.SUB_PANELS.DESCRIPTION'
				},
				{
					name: 'panel (hub-nav-panel)',
					type: 'HubNavPanelState',
					required: true,
					description: 'DOCS.NAV.API.INPUT.SUB_PANEL.DESCRIPTION'
				},
				{
					name: 'itemTemplate / dropdownRenderMode / panelWidth / sidebarSide / showHeader / hideFirstPanelHeader / isLast (hub-nav-item-list / hub-nav-panel / hub-nav-panel-container)',
					type: 'TemplateRef<unknown> | null / HubNavDropdownRenderMode / string / HubNavSidebarSide / boolean / boolean / boolean',
					required: false,
					description: 'DOCS.NAV.API.INPUT.SUB_FORWARDED.DESCRIPTION'
				},
				{
					name: 'overlayOwnerClass / overlayOrientationClass (hub-nav-item-list / hub-nav-panel / hub-nav-panel-container)',
					type: "string / 'hub-nav--horizontal' | 'hub-nav--vertical'",
					required: false,
					defaultValue: "'' / 'hub-nav--vertical' ('hub-nav--horizontal' on hub-nav-item-list)",
					description: 'DOCS.NAV.API.INPUT.SUB_OVERLAY_CLASSES.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'itemClick',
					type: 'OutputEmitterRef<HubNavItem>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.ITEM_CLICK.DESCRIPTION'
				},
				{
					name: 'dropdownOpen',
					type: 'OutputEmitterRef<HubNavItem>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.DROPDOWN_OPEN.DESCRIPTION'
				},
				{
					name: 'dropdownClose',
					type: 'OutputEmitterRef<HubNavItem>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.DROPDOWN_CLOSE.DESCRIPTION'
				},
				{
					name: 'mobileToggle',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.MOBILE_TOGGLE.DESCRIPTION'
				},
				{
					name: 'panelChange',
					type: 'OutputEmitterRef<HubNavPanelEvent>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.PANEL_CHANGE.DESCRIPTION'
				},
				{
					name: 'railChange',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.RAIL_CHANGE.DESCRIPTION'
				},
				{
					name: 'activeSectionChange (hubNavScrollSpy)',
					type: 'OutputEmitterRef<string>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.ACTIVE_SECTION_CHANGE.DESCRIPTION'
				},
				{
					name: 'clicked / toggleDropdown (hub-nav-item)',
					type: 'OutputEmitterRef<{ item: HubNavItem; event: Event }> / OutputEmitterRef<HubNavItem>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.SUB_NAV_ITEM_EVENTS.DESCRIPTION'
				},
				{
					name: 'itemClick / dropdownToggle / panelOpen (hub-nav-item-list / hub-nav-panel / hub-nav-panel-container)',
					type: 'OutputEmitterRef<{ item: HubNavItem; event: Event }> / OutputEmitterRef<HubNavItem> / OutputEmitterRef<HubNavItem>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.SUB_BUBBLED_EVENTS.DESCRIPTION'
				},
				{
					name: 'closePanel / backClick (hub-nav-panel)',
					type: 'OutputEmitterRef<string>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.SUB_PANEL_EVENTS.DESCRIPTION'
				},
				{
					name: 'panelClose / panelBack (hub-nav-panel-container)',
					type: 'OutputEmitterRef<string>',
					required: false,
					description: 'DOCS.NAV.API.OUTPUT.SUB_PANEL_CONTAINER_EVENTS.DESCRIPTION'
				}
			],
			templates: [
				{
					name: 'DOCS.NAV.API.TEMPLATE.0.NAME',
					description: 'DOCS.NAV.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-nav [items]="items">
  <ng-template hubNavStart let-collapsed="collapsed">
    <img src="logo.svg" alt="Brand" />
    @if (!collapsed) { <span>App Name</span> }
  </ng-template>
</hub-nav>`
				},
				{
					name: 'DOCS.NAV.API.TEMPLATE.1.NAME',
					description: 'DOCS.NAV.API.TEMPLATE.1.DESCRIPTION',
					example: `<hub-nav [items]="items">
  <ng-template hubNavEnd>
    <button type="button">Sign out</button>
  </ng-template>
</hub-nav>`
				},
				{
					name: 'DOCS.NAV.API.TEMPLATE.2.NAME',
					description: 'DOCS.NAV.API.TEMPLATE.2.DESCRIPTION',
					example: `<hub-nav [items]="items">
  <ng-template hubNavItemTemplate let-item let-active="active">
    <span [class.fw-bold]="active">{{ item.label }}</span>
    @if (item.badge) { <hub-badge shape="rounded">{{ item.badge }}</hub-badge> }
  </ng-template>
</hub-nav>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['nav'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['nav'],
			demos: [
				{
					title: 'Theming with hub-nav-theme',
					previewComponent: MixinNavExampleComponent,
					code: `@use 'ng-hub-ui-nav/styles' as nav;

.nav-mixin-scope {
	@include nav.hub-nav-theme($accent: #7c3aed, $item-border-radius: 0.5rem);
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
	 * Registers every nav example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'nav-basic-horizontal',
				title: 'DOCS.NAV.EXAMPLE.BASIC_HORIZONTAL.TITLE',
				componentName: 'BasicHorizontalNavExampleComponent',
				files: ['basic-horizontal-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/basic-horizontal-nav-example.component').then(
						(m) => m.BasicHorizontalNavExampleComponent
					)
			},
			{
				id: 'nav-vertical-accordion',
				title: 'DOCS.NAV.EXAMPLE.VERTICAL_ACCORDION.TITLE',
				componentName: 'VerticalAccordionNavExampleComponent',
				files: ['vertical-accordion-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/vertical-accordion-nav-example.component').then(
						(m) => m.VerticalAccordionNavExampleComponent
					)
			},
			{
				id: 'nav-vertical-flyout',
				title: 'DOCS.NAV.EXAMPLE.VERTICAL_FLYOUT.TITLE',
				componentName: 'VerticalFlyoutNavExampleComponent',
				files: ['vertical-flyout-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/vertical-flyout-nav-example.component').then(
						(m) => m.VerticalFlyoutNavExampleComponent
					)
			},
			{
				id: 'nav-vertical-sticky',
				title: 'DOCS.NAV.EXAMPLE.VERTICAL_STICKY.TITLE',
				componentName: 'VerticalStickyNavExampleComponent',
				files: ['vertical-sticky-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/vertical-sticky-nav-example.component').then(
						(m) => m.VerticalStickyNavExampleComponent
					)
			},
			{
				id: 'nav-rail-collapse',
				title: 'DOCS.NAV.EXAMPLE.RAIL_COLLAPSE.TITLE',
				componentName: 'RailCollapseNavExampleComponent',
				files: ['rail-collapse-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/rail-collapse-nav-example.component').then((m) => m.RailCollapseNavExampleComponent)
			},
			{
				id: 'nav-nested-dropdowns',
				title: 'DOCS.NAV.EXAMPLE.NESTED_DROPDOWNS.TITLE',
				componentName: 'NestedDropdownsNavExampleComponent',
				files: ['nested-dropdowns-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/nested-dropdowns-nav-example.component').then(
						(m) => m.NestedDropdownsNavExampleComponent
					)
			},
			{
				id: 'nav-headers-separators',
				title: 'DOCS.NAV.EXAMPLE.HEADERS_SEPARATORS.TITLE',
				componentName: 'HeadersSeparatorsNavExampleComponent',
				files: ['headers-separators-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/headers-separators-nav-example.component').then(
						(m) => m.HeadersSeparatorsNavExampleComponent
					)
			},
			{
				id: 'nav-disabled-states',
				title: 'DOCS.NAV.EXAMPLE.DISABLED_STATES.TITLE',
				componentName: 'DisabledStatesNavExampleComponent',
				files: ['disabled-states-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/disabled-states-nav-example.component').then(
						(m) => m.DisabledStatesNavExampleComponent
					)
			},
			{
				id: 'nav-dropdown-triggers',
				title: 'DOCS.NAV.EXAMPLE.DROPDOWN_TRIGGERS.TITLE',
				componentName: 'DropdownTriggersNavExampleComponent',
				files: ['dropdown-triggers-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/dropdown-triggers-nav-example.component').then(
						(m) => m.DropdownTriggersNavExampleComponent
					)
			},
			{
				id: 'nav-responsive-collapse',
				title: 'DOCS.NAV.EXAMPLE.RESPONSIVE_COLLAPSE.TITLE',
				componentName: 'ResponsiveCollapseNavExampleComponent',
				files: ['responsive-collapse-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/responsive-collapse-nav-example.component').then(
						(m) => m.ResponsiveCollapseNavExampleComponent
					)
			},
			{
				id: 'nav-brand-slot',
				title: 'DOCS.NAV.EXAMPLE.BRAND_SLOT.TITLE',
				componentName: 'BrandSlotNavExampleComponent',
				files: ['brand-slot-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/brand-slot-nav-example.component').then((m) => m.BrandSlotNavExampleComponent)
			},
			{
				id: 'nav-custom-item-template',
				title: 'DOCS.NAV.EXAMPLE.CUSTOM_ITEM_TEMPLATE.TITLE',
				componentName: 'CustomItemTemplateNavExampleComponent',
				files: ['custom-item-template-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/custom-item-template-nav-example.component').then(
						(m) => m.CustomItemTemplateNavExampleComponent
					)
			},
			{
				id: 'nav-rtl-slots',
				title: 'DOCS.NAV.EXAMPLE.RTL_SLOTS.TITLE',
				componentName: 'RtlNavExampleComponent',
				files: ['rtl-nav-example.component.ts'],
				loader: () => import('../examples/nav/rtl-nav-example.component').then((m) => m.RtlNavExampleComponent)
			},
			{
				id: 'nav-events-api',
				title: 'DOCS.NAV.EXAMPLE.EVENTS_API.TITLE',
				componentName: 'EventsApiNavExampleComponent',
				files: ['events-api-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/events-api-nav-example.component').then((m) => m.EventsApiNavExampleComponent)
			},
			{
				id: 'nav-router-active',
				title: 'DOCS.NAV.EXAMPLE.ROUTER_ACTIVE.TITLE',
				componentName: 'RouterActiveNavExampleComponent',
				files: ['router-active-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/router-active-nav-example.component').then((m) => m.RouterActiveNavExampleComponent)
			},
			{
				id: 'nav-panel-drilldown',
				title: 'DOCS.NAV.EXAMPLE.PANEL_DRILLDOWN.TITLE',
				componentName: 'PanelDrilldownNavExampleComponent',
				files: ['panel-drilldown-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/panel-drilldown-nav-example.component').then(
						(m) => m.PanelDrilldownNavExampleComponent
					)
			},
			{
				id: 'nav-mixed-expand-modes',
				title: 'DOCS.NAV.EXAMPLE.MIXED_EXPAND_MODES.TITLE',
				componentName: 'MixedExpandModesNavExampleComponent',
				files: ['mixed-expand-modes-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/mixed-expand-modes-nav-example.component').then(
						(m) => m.MixedExpandModesNavExampleComponent
					)
			},
			{
				id: 'nav-sidebar-right-panel',
				title: 'DOCS.NAV.EXAMPLE.SIDEBAR_RIGHT_PANEL.TITLE',
				componentName: 'SidebarRightPanelNavExampleComponent',
				files: ['sidebar-right-panel-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/sidebar-right-panel-nav-example.component').then(
						(m) => m.SidebarRightPanelNavExampleComponent
					)
			},
			{
				id: 'nav-truncated-labels',
				title: 'DOCS.NAV.EXAMPLE.TRUNCATED_LABELS.TITLE',
				componentName: 'TruncatedLabelsNavExampleComponent',
				files: ['truncated-labels-nav-example.component.ts'],
				loader: () =>
					import('../examples/nav/truncated-labels-nav-example.component').then(
						(m) => m.TruncatedLabelsNavExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'nav'
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

		this.navLibrary.functionalities = NAV_FUNCTIONALITIES.map((group) => ({
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
						previewComponent: NAV_PREVIEW_COMPONENTS[id]
					} as any;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
