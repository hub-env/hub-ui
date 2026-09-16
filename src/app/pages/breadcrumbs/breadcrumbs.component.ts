import { Component, inject, OnInit, Type, ChangeDetectionStrategy } from '@angular/core';
import { FeatureExample, Library } from '../../../models/interfaces';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';

// Eagerly imported only for use as previewComponent in functionalities/styling —
// NOT referenced in the template, so they don't appear in the imports[] array.
import { BasicBreadcrumbsExampleComponent } from '../examples/breadcrumbs/basic-breadcrumbs-example.component';
import { DynamicBreadcrumbsExampleComponent } from '../examples/breadcrumbs/dynamic-breadcrumbs-example.component';
import { CustomBreadcrumbsExampleComponent } from '../examples/breadcrumbs/custom-breadcrumbs-example.component';
import { IconsBreadcrumbsExampleComponent } from '../examples/breadcrumbs/icons-breadcrumbs-example.component';
import { RtlBreadcrumbsExampleComponent } from '../examples/breadcrumbs/rtl-breadcrumbs-example.component';
import { StylingBreadcrumbsExampleComponent } from '../examples/breadcrumbs/styling-breadcrumbs-example.component';
import { TruncationBreadcrumbsExampleComponent } from '../examples/breadcrumbs/truncation-breadcrumbs-example.component';
import { MixinBreadcrumbsExampleComponent } from '../examples/breadcrumbs/mixin-breadcrumbs-example.component';
import { CollapseBreadcrumbsExampleComponent } from '../examples/breadcrumbs/collapse-breadcrumbs-example.component';
import { ExternalLinksBreadcrumbsExampleComponent } from '../examples/breadcrumbs/external-links-breadcrumbs-example.component';
import { FocusRingBreadcrumbsExampleComponent } from '../examples/breadcrumbs/focus-ring-breadcrumbs-example.component';
import { SignalBreadcrumbsExampleComponent } from '../examples/breadcrumbs/signal-breadcrumbs-example.component';

// Interactive playground configuration
import { BREADCRUMBS_PLAYGROUND } from './breadcrumbs-playground';

/**
 * Snippet metadata published by the modern (bare) example components as static
 * members, so the page can read them without instantiating the class.
 */
interface StaticExampleMeta {
	title: string;
	description: string;
	importCode: string;
	templateCode: string;
	componentCode: string;
}

/**
 * Main breadcrumbs library page component that displays comprehensive documentation
 * with overview, API, and examples content rendered through the shared library page.
 *
 * Functional examples are lazy-registered in the shared ExampleRegistry so the
 * LibraryPageComponent's Examples tab can render them via ExampleViewer. The
 * Styling section still uses an eagerly imported component for its live preview.
 */
@Component({
	selector: 'app-breadcrumbs',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `<app-library-page
		[library]="breadcrumbsLibrary"
		[package]="'breadcrumbs'"
		[playground]="playgroundConfigs"
	></app-library-page>`
})
export class BreadcrumbsComponent implements OnInit {
	private readonly _registry = inject(ExampleRegistry);

	/**
	 * Interactive playground configurations exposed under the Playground tab.
	 */
	protected readonly playgroundConfigs = BREADCRUMBS_PLAYGROUND;

	/**
	 * Example components instances for collecting data
	 */
	private exampleComponents: FeatureExample[] = [
		this.createExample(BasicBreadcrumbsExampleComponent),
		this.createExample(DynamicBreadcrumbsExampleComponent),
		this.createExample(CustomBreadcrumbsExampleComponent),
		this.createExample(IconsBreadcrumbsExampleComponent),
		this.createExample(RtlBreadcrumbsExampleComponent),
		this.createExample(TruncationBreadcrumbsExampleComponent),
		this.createStaticExample(CollapseBreadcrumbsExampleComponent),
		this.createStaticExample(ExternalLinksBreadcrumbsExampleComponent),
		this.createStaticExample(FocusRingBreadcrumbsExampleComponent),
		this.createStaticExample(SignalBreadcrumbsExampleComponent)
	];

	/**
	 * Styling example components instances for collecting styling data
	 */
	private stylingComponents: FeatureExample[] = [this.createExample(StylingBreadcrumbsExampleComponent)];

	/**
	 * Complete breadcrumbs library data
	 */
	breadcrumbsLibrary: Library = {
		title: 'ng-hub-ui-breadcrumbs',
		description:
			'A flexible and reusable breadcrumb component for Angular applications that automatically generates breadcrumbs based on your routing configuration. Features automatic route detection, custom templates, and RTL support.',
		overview: {
			text: "The breadcrumbs component was designed to provide automatic navigation path display for Angular applications. Built with Angular's routing system in mind, it automatically generates breadcrumbs from route configuration data. The component supports custom templates, dynamic content resolution, RTL layouts, and complete customization through CSS variables.",
			highlights: [
				{
					icon: 'fa-solid fa-route',
					title: 'Automatic Route Integration',
					description:
						'Reads Angular Router state to build the breadcrumb trail automatically without any manual configuration per page.'
				},
				{
					icon: 'fa-solid fa-pen-to-square',
					title: 'Custom Label Overrides',
					description:
						'Override any route segment label via data attributes or a resolver so IDs become human-readable names.'
				},
				{
					icon: 'fa-solid fa-arrow-up-right-from-square',
					title: 'Destinations Beyond the Router',
					description:
						'A crumb may carry href, target, rel and download and render a plain anchor, for ancestors served outside the Angular application.'
				},
				{
					icon: 'fa-solid fa-ellipsis',
					title: 'Overflow Truncation',
					description:
						'Collapse long trails with a "…" expander via maxItems, and clip individual labels with truncateItems, so breadcrumbs stay usable in constrained containers.'
				},
				{
					icon: 'fa-solid fa-keyboard',
					title: 'Tokenized Focus Ring',
					description:
						'Links and the collapsed indicator take the design-system focus ring on keyboard navigation, re-tintable through its own CSS variables.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'ARIA Navigation Landmark',
					description:
						'Wraps the trail in a <nav aria-label="breadcrumb"> with aria-current="page" on the active segment for screen readers.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Separator colour, link colour, active colour, and font size are all exposed as CSS custom properties.'
				}
			],
			changelog: [
				{
					version: '22.7.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). Every --hub-breadcrumb-* default resolves through the family --hub-sys-* / --hub-ref-* ladder, which is what makes the trail match a theme and its dark mode before anything is overridden, and the manifest said nothing about it, so a consumer reading the package on npm could not tell which package supplies those values. It is genuinely optional: every token ends in a literal fallback.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'truncateItems now clips a crumb rendered by a hubBreadcrumbItem template. The clipping rules named only the classes the component draws, and the elements a custom template renders belong to the consuming component, where a scoped rule cannot reach them, so a consumer who had personalised the markup set the input and got nothing at all, in silence. The component now draws the clipping box itself, a span.hub-breadcrumb__custom around the projected content, sitting inside the item and outside the separator so a custom crumb gets exactly the width a built-in one gets.'
						},
						{
							type: 'changed',
							description:
								'A custom crumb gets the overflow tooltip too: the new box carries hubBreadcrumbLabel, so the full text of a clipped custom label is exposed the way a built-in one is. Applying the directive by hand inside the template is no longer needed, and is now only for overriding the tooltip text. The crumb does render one element deeper, so a selector written against the old shape has to be adjusted: see BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'HubBreadcrumbsService.breadcrumbs exposes the trail as a signal. The service published only an Observable, so every consumer inside a signal-based component repeated the same toSignal(svc.breadcrumbs$, { initialValue: [] }) wrapper, the component in this library included. The wrapping now happens once inside the service, which also subscribes the route tree once for the whole application instead of once per breadcrumb on screen. breadcrumbs$ stays exactly as it was for code that composes with rxjs.'
						},
						{
							type: 'changed',
							description:
								'HubBreadcrumbComponent no longer re-exports breadcrumbs$. The component carried the Observable of the service as a public field and a signal derived from it, so a single trail had two public surfaces on the same class and neither was the one the template rendered. It now reads HubBreadcrumbsService.breadcrumbs directly: anyone who was reading the field can inject the service, which is where the trail came from anyway, and anyone substituting the service must publish breadcrumbs. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'Opening a collapsed trail from the keyboard no longer leaves focus on the page body. Expanding removes the ellipsis indicator the reader just activated, and the browser answers that by focusing the body, so someone who had pressed Enter had to tab from the top of the page to reach the crumbs they asked for. Focus is now handed to the first crumb the gesture reveals, the one at itemsBeforeCollapse, which takes it through a temporary tabindex of -1 when it renders as plain text. Consumers who moved focus by hand in (collapsedClick) can drop that code.'
						},
						{
							type: 'fixed',
							description:
								'The current crumb is announced as the current page even when the consumer renders it. aria-current="page" sat on the default span, the one branch a hubBreadcrumbItem template replaces, so a trail with a custom template reached assistive technology with nothing marking the current page while the docs promised the attribute unqualified. It now sits on the li, which wraps every branch. The attribute moved: a stylesheet or a test selecting .hub-breadcrumb__text[aria-current] should read .hub-breadcrumb__item[aria-current], while the hub-breadcrumb__item--active modifier is unchanged and is still the styling hook.'
						},
						{
							type: 'fixed',
							description:
								'--hub-breadcrumb-accent set from the application reaches the component again. The slot was declared on :host, which under emulated encapsulation is a [_nghost] rule on the crumb element itself, so a consumer rule on hub-breadcrumb lost, one on .hub-breadcrumb tied and lost on source order, and a value inherited from an ancestor, the hub-breadcrumb-theme() mixin included, never reached the links at all. The slot is no longer declared on the host: it is read where it is consumed, as var(--hub-breadcrumb-accent, var(--hub-sys-color-primary, #0d6efd)), so the default look is byte-identical, variant still wins over a consumer rule, and a plain tag or class rule, or any ancestor, now recolours the links and everything derived from them. The remaining --hub-breadcrumb-* defaults still live on :host, so overriding those still means the crumb element itself or .hub-breadcrumb__list.'
						},
						{
							type: 'fixed',
							description:
								'The built-in variant list in the component names the same nine accents its stylesheet emits. 22.2.0 grew the accent set from five to nine in the SCSS loop, but BUILT_IN_VARIANTS was left at the original five, so secondary, neutral, light and dark were treated as custom accents and got an inline --hub-breadcrumb-accent on the host on top of the stylesheet rule that already set them. Nothing rendered differently, since both paths resolve to the same token, but an inline style outranks anything a consumer writes in a sheet, so overriding the accent for those four took an !important it should never have needed. The variant JSDoc listed the same stale five and now names all nine.'
						},
						{
							type: 'fixed',
							description:
								'The documentation described an API this library does not have, and taught a mixin selector that does not win. The README opened its reference announcing a single optional input above a table of seven inputs and one output, listed five built-in variants against the nine the stylesheet emits, never named HubBreadcrumbLabelDirective or the tooltip adapter contract although both are exported, promised truncation without saying that a hubBreadcrumbItem template renders its own elements, which the scoped styles cannot reach, so they get neither the ellipsis nor the tooltip, and still announced v21.1.0 as the latest release. The hub-breadcrumb-theme() snippet included the mixin on a bare class, which ties with :host and loses on source order, and now lands on the crumb element with a selector that outranks it. BREAKING_CHANGES.md was titled after v21.1.0 over a 22.4.0 section, FUNCTIONALITIES.md marked (collapsedClick) and the tooltip adapter as uncovered while the examples exercise both, and docs/css-variables-reference.md referenced the three derived accent tokens without documenting any of them. Documentation only, with no change to code, types or styles.'
						},
						{
							type: 'deprecated',
							description:
								'HubBreadcrumbsModule is deprecated and will be removed in 23.0.0. It imports and exports HubBreadcrumbComponent and HubBreadcrumbItemDirective, both standalone and both already exported from the entry point, and provides nothing of its own, so importing them directly is the whole migration. HubBreadcrumbsService is providedIn: root and never travelled through the module. The class carried no @deprecated tag until now, so neither an editor nor the build could warn anyone. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.5.2',
					date: '2026-09-02',
					changes: [
						{
							type: 'fixed',
							description:
								'A breadcrumb asked for before the first navigation no longer throws. breadcrumbs$ opens with startWith(undefined), so the route tree is walked the moment anything subscribes, and a page shell that draws its breadcrumb on the first paint subscribes while the initial navigation is still in flight. In that window a child route exists with no snapshot and child.snapshot.url threw — into the subscription drawing the shell, so what a consumer saw was the whole header gone rather than a missing breadcrumb. A route with no snapshot is skipped rather than guessed at: it has no segments and no resolved data, so there is nothing to name yet. Present in every release from 21.0.0 onwards.'
						}
					]
				},
				{
					version: '22.5.1',
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
					version: '22.5.0',
					date: '2026-08-29',
					changes: [
						{
							type: 'added',
							description:
								'Collapsing for long trails: `maxItems`, `itemsBeforeCollapse` and `itemsAfterCollapse` fold the middle behind an indicator button that expands in place and emits `collapsedClick`.'
						},
						{
							type: 'added',
							description:
								'Crumbs can point outside the router: `href`, `target`, `rel` and `download` on `BreadcrumbItem`, accepted both from the new object form of `data.breadcrumb` and from the new `items` input. A `_blank` crumb defaults to `rel="noopener noreferrer"`.'
						},
						{
							type: 'added',
							description:
								'Keyboard focus ring on links and on the collapsed indicator, built on the design-system focus tokens and exposed as `--hub-breadcrumb-focus-*` / `--hub-breadcrumb-link-focus-color`.'
						},
						{
							type: 'changed',
							description:
								'`BreadcrumbItem` and `BreadcrumbTemplateContext` are now exported from the public API, and `BreadcrumbItem.data` became optional.'
						}
					]
				},
				{
					version: '22.4.3',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The package shipped without its licence notice. package.json declared MIT, but no LICENSE file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.'
						}
					]
				},
				{
					version: '22.4.2',
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
					version: '22.4.1',
					date: '2026-07-28',
					changes: [
						{
							type: 'fixed',
							description:
								'The active (last) crumb now declares aria-current=page so assistive technology announces the current position.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging) — the SCSS ships at ng-hub-ui-breadcrumbs/styles. The theme mixin now builds to dist/breadcrumbs/styles/… instead of dist/breadcrumbs/src/lib/styles/…, so @use 'ng-hub-ui-breadcrumbs/styles' resolves. Any @use that reached into src/lib/styles has to be updated."
						}
					]
				},
				{
					version: '22.3.1',
					date: '2026-07-06',
					changes: [
						{
							type: 'fixed',
							description:
								'Docs: the default values in docs/css-variables-reference.md were resynchronized with the actual declarations (--hub-breadcrumb-item-padding-x, --hub-breadcrumb-accent, --hub-breadcrumb-link-hover-color), now guarded by the repo-level tokens-parity check.'
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
								'Opt-in per-item truncation via the `truncateItems` input + `--hub-breadcrumb-max-item-width`.'
						},
						{
							type: 'added',
							description: '`HubBreadcrumbLabelDirective` showing a tooltip only when a label overflows.'
						},
						{
							type: 'added',
							description:
								'Optional hub-ui tooltip integration via `provideHubBreadcrumbTooltip(hubTooltipAdapter)` (native `title` fallback).'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'The accent moved to the open-set "local accent slot" pattern: variant re-bases a single --hub-breadcrumb-accent and the link hover is derived locally as --hub-breadcrumb-accent-emphasis with color-mix, mirroring the ds engine. The built-in list grew from five accents to the nine canonical ones (primary · secondary · success · danger · warning · info · neutral · light · dark), and a bare [data-variant] block re-derives the family from the slot, so any custom accent the host app adds recolours the links with one CSS rule and no recompilation.'
						},
						{
							type: 'added',
							description:
								'Tokens --hub-breadcrumb-accent-emphasis (link hover), --hub-breadcrumb-accent-subtle and --hub-breadcrumb-accent-on, all derived locally from the accent slot.'
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-06-26',
					changes: [
						{
							type: 'fixed',
							description:
								'The Angular peer dependency range was corrected to >=18.0.0. The library uses APIs whose real minimum is Angular 17.3, so the previous >=17.0.0 range let it install on incompatible versions.'
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
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii, theme-aware colours) routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
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
								'The variant input on <hub-breadcrumb>, selecting a semantic accent for the links and their hover while the current item stays muted. Any string outside the built-in set is also accepted and read as --hub-sys-color-<variant>. New token --hub-breadcrumb-accent.'
						},
						{
							type: 'added',
							description:
								'The hub-breadcrumb-theme() Sass mixin — surface, spacing, divider, current-item colour, links and accent in one call. Every parameter is optional, so only the ones passed are emitted as --hub-breadcrumb-* overrides.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description: 'Aligned with Angular 22, and the README standardized.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-03-17',
					changes: [
						{
							type: 'changed',
							description:
								'The selector was renamed from hub-breadcrumbs to hub-breadcrumb, and the styles are bundled within the component — a manual style import is no longer required.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-03-09',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING — the service, module, components and directives were renamed for consistency across the library family.'
						}
					]
				}
			]
		},
		functionalities: [], // Will be populated from example components
		api: {
			inputs: [
				{
					name: 'items',
					type: 'BreadcrumbItem[] | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.BREADCRUMBS.API.INPUT.ITEMS.DESCRIPTION'
				},
				{
					name: 'variant',
					type: 'string',
					required: false,
					description: 'DOCS.BREADCRUMBS.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'truncateItems',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BREADCRUMBS.API.INPUT.TRUNCATE_ITEMS.DESCRIPTION'
				},
				{
					name: 'maxItems',
					type: 'number | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BREADCRUMBS.API.INPUT.MAX_ITEMS.DESCRIPTION'
				},
				{
					name: 'itemsBeforeCollapse',
					type: 'number',
					required: false,
					defaultValue: '1',
					description: 'DOCS.BREADCRUMBS.API.INPUT.ITEMS_BEFORE_COLLAPSE.DESCRIPTION'
				},
				{
					name: 'itemsAfterCollapse',
					type: 'number',
					required: false,
					defaultValue: '1',
					description: 'DOCS.BREADCRUMBS.API.INPUT.ITEMS_AFTER_COLLAPSE.DESCRIPTION'
				},
				{
					name: 'collapsedAriaLabel',
					type: 'string',
					required: false,
					defaultValue: "'Show the hidden breadcrumb items'",
					description: 'DOCS.BREADCRUMBS.API.INPUT.COLLAPSED_ARIA_LABEL.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'collapsedClick',
					type: 'void',
					required: false,
					description: 'DOCS.BREADCRUMBS.API.OUTPUT.COLLAPSED_CLICK.DESCRIPTION'
				}
			],
			methods: [
				{
					name: 'HubBreadcrumbsService.breadcrumbs',
					signature: 'breadcrumbs: Signal<BreadcrumbItem[]>',
					description: 'DOCS.BREADCRUMBS.API.METHOD.BREADCRUMBS.DESCRIPTION',
					returns: 'Signal<BreadcrumbItem[]>'
				},
				{
					name: 'HubBreadcrumbsService.breadcrumbs$',
					signature: 'breadcrumbs$: Observable<BreadcrumbItem[]>',
					description: 'DOCS.BREADCRUMBS.API.METHOD.BREADCRUMBS_STREAM.DESCRIPTION',
					returns: 'Observable<BreadcrumbItem[]>'
				},
				{
					name: 'provideHubBreadcrumbTooltip',
					signature: 'provideHubBreadcrumbTooltip(adapter: HubBreadcrumbTooltipAdapter): EnvironmentProviders',
					description: 'DOCS.BREADCRUMBS.API.METHOD.PROVIDE_TOOLTIP.DESCRIPTION',
					returns: 'EnvironmentProviders'
				}
			],
			templates: [
				{
					name: 'DOCS.BREADCRUMBS.API.TEMPLATE.0.NAME',
					description: 'DOCS.BREADCRUMBS.API.TEMPLATE.0.DESCRIPTION',
					example: `<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
  @if (!isLast) {
    <a [routerLink]="item.url" class="breadcrumb-link">{{ item.label }}</a>
  } @else {
    <span class="breadcrumb-current">{{ item.label }}</span>
  }
</ng-template>`
				},
				{
					name: 'DOCS.BREADCRUMBS.API.TEMPLATE.1.NAME',
					description: 'DOCS.BREADCRUMBS.API.TEMPLATE.1.DESCRIPTION',
					example: `<a class="my-crumb" hubBreadcrumbLabel [routerLink]="item.url">{{ item.label }}</a>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['breadcrumbs'] ?? []
		},
		styling: [], // Will be populated from styling example components
		mixins: {
			...MD_MIXINS['breadcrumbs'],
			demos: [
				{
					title: 'Theming with hub-breadcrumb-theme',
					previewComponent: MixinBreadcrumbsExampleComponent,
					code: `@use 'ng-hub-ui-breadcrumbs/styles' as breadcrumbs;

/* On the crumb element, with a selector that outranks the component's :host
   defaults — a bare class ties and loses, and a wrapper never reaches it. */
hub-breadcrumb.breadcrumbs-mixin-scope {
  @include breadcrumbs.hub-breadcrumb-theme(
    $accent: #0ea5e9,
    $bg: #f0f9ff,
    $border-radius: 0.75rem,
    $item-padding-x: 0.75rem
  );
}`
				}
			]
		}
	};

	/**
	 * Creates a FeatureExample instance and attaches its component type for rendering
	 */
	private createExample<T extends FeatureExample>(component: Type<T>): T {
		const instance = new component();
		instance.previewComponent = component;
		return instance;
	}

	/**
	 * Builds a feature example from an example class's STATIC metadata.
	 *
	 * Bare examples render the demo and nothing else, publishing their snippets as
	 * static members. Reading them off the class rather than an instance is what
	 * keeps the Overview tab alive for any example that injects: `new Example()`
	 * outside an injection context throws.
	 */
	private createStaticExample(component: Type<unknown> & StaticExampleMeta): FeatureExample {
		return {
			title: component.title,
			description: component.description,
			import: component.importCode,
			template: component.templateCode,
			component: component.componentCode,
			previewComponent: component
		};
	}

	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromComponents();
		this.populateStylingFromComponents();
	}

	/**
	 * Registers all functional breadcrumbs examples in the shared ExampleRegistry so
	 * LibraryPageComponent can display them in the Examples tab via ExampleViewer.
	 */
	private registerExamples(): void {
		this._registry.registerAll([
			{
				id: 'basic-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['basic-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/basic-breadcrumbs-example.component').then(
						(m) => m.BasicBreadcrumbsExampleComponent
					)
			},
			{
				id: 'dynamic-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.TITLE',
				componentName: 'DynamicBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['dynamic-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/dynamic-breadcrumbs-example.component').then(
						(m) => m.DynamicBreadcrumbsExampleComponent
					)
			},
			{
				id: 'custom-templates',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.TITLE',
				componentName: 'CustomBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['custom-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/custom-breadcrumbs-example.component').then(
						(m) => m.CustomBreadcrumbsExampleComponent
					)
			},
			{
				id: 'icons-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.ICONS.TITLE',
				componentName: 'IconsBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['icons-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/icons-breadcrumbs-example.component').then(
						(m) => m.IconsBreadcrumbsExampleComponent
					)
			},
			{
				id: 'rtl-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.RTL.TITLE',
				componentName: 'RtlBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['rtl-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/rtl-breadcrumbs-example.component').then(
						(m) => m.RtlBreadcrumbsExampleComponent
					)
			},
			{
				id: 'truncation-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.TITLE',
				componentName: 'TruncationBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['truncation-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/truncation-breadcrumbs-example.component').then(
						(m) => m.TruncationBreadcrumbsExampleComponent
					)
			},
			{
				id: 'collapse-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.COLLAPSE.TITLE',
				componentName: 'CollapseBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['collapse-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/collapse-breadcrumbs-example.component').then(
						(m) => m.CollapseBreadcrumbsExampleComponent
					)
			},
			{
				id: 'external-links-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.EXTERNAL_LINKS.TITLE',
				componentName: 'ExternalLinksBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['external-links-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/external-links-breadcrumbs-example.component').then(
						(m) => m.ExternalLinksBreadcrumbsExampleComponent
					)
			},
			{
				id: 'focus-ring-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.FOCUS_RING.TITLE',
				componentName: 'FocusRingBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['focus-ring-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/focus-ring-breadcrumbs-example.component').then(
						(m) => m.FocusRingBreadcrumbsExampleComponent
					)
			},
			{
				id: 'signal-breadcrumbs',
				title: 'DOCS.BREADCRUMBS.EXAMPLE.SIGNAL.TITLE',
				componentName: 'SignalBreadcrumbsExampleComponent',
				packagePath: 'breadcrumbs',
				files: ['signal-breadcrumbs-example.component.ts'],
				loader: () =>
					import('../examples/breadcrumbs/signal-breadcrumbs-example.component').then(
						(m) => m.SignalBreadcrumbsExampleComponent
					)
			}
		]);
	}

	/**
	 * Populates the grouped feature data sourced from example components.
	 */
	private populateFunctionalitiesFromComponents(): void {
		// Group examples by category
		const coreFeatures = this.exampleComponents.filter((component) =>
			[
				'DOCS.BREADCRUMBS.EXAMPLE.BASIC.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.SIGNAL.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.EXTERNAL_LINKS.TITLE'
			].includes(component.title)
		);

		const dynamicContent = this.exampleComponents.filter((component) =>
			['DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.TITLE'].includes(component.title)
		);

		const templatesAndCustomization = this.exampleComponents.filter((component) =>
			['DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.TITLE'].includes(component.title)
		);

		const advancedFeatures = this.exampleComponents.filter((component) =>
			[
				'DOCS.BREADCRUMBS.EXAMPLE.ICONS.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.RTL.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.COLLAPSE.TITLE',
				'DOCS.BREADCRUMBS.EXAMPLE.FOCUS_RING.TITLE'
			].includes(component.title)
		);

		this.breadcrumbsLibrary.functionalities = [
			{
				title: 'DOCS.BREADCRUMBS.FEATURE.CORE_FEATURES.TITLE',
				description: 'DOCS.BREADCRUMBS.FEATURE.CORE_FEATURES.DESCRIPTION',
				examples: coreFeatures
			},
			{
				title: 'DOCS.BREADCRUMBS.FEATURE.DYNAMIC_CONTENT.TITLE',
				description: 'DOCS.BREADCRUMBS.FEATURE.DYNAMIC_CONTENT.DESCRIPTION',
				examples: dynamicContent
			},
			{
				title: 'DOCS.BREADCRUMBS.FEATURE.TEMPLATES_CUSTOMIZATION.TITLE',
				description: 'DOCS.BREADCRUMBS.FEATURE.TEMPLATES_CUSTOMIZATION.DESCRIPTION',
				examples: templatesAndCustomization
			},
			{
				title: 'DOCS.BREADCRUMBS.FEATURE.ADVANCED_FEATURES.TITLE',
				description: 'DOCS.BREADCRUMBS.FEATURE.ADVANCED_FEATURES.DESCRIPTION',
				examples: advancedFeatures
			}
		];
	}

	/**
	 * Populates the styling guidance data sourced from styling examples.
	 */
	private populateStylingFromComponents(): void {
		// Group styling examples by category
		const cssVariables = this.stylingComponents.filter((component) =>
			['DOCS.BREADCRUMBS.EXAMPLE.STYLING.TITLE'].includes(component.title)
		);

		this.breadcrumbsLibrary.styling = [
			{
				title: 'DOCS.BREADCRUMBS.STYLING.CSS_VARIABLES_THEMING.TITLE',
				description: 'DOCS.BREADCRUMBS.STYLING.CSS_VARIABLES_THEMING.DESCRIPTION',
				examples: cssVariables
			}
		];
	}
}
