import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { MILESTONES_FUNCTIONALITIES } from './milestones-functionalities';
import { MILESTONES_PLAYGROUND } from './milestones-playground';
import { MilestonesVerticalExampleComponent } from '../examples/milestones/vertical-milestones-example.component';
import { MilestonesHorizontalExampleComponent } from '../examples/milestones/horizontal-milestones-example.component';
import { MilestonesCustomNodesExampleComponent } from '../examples/milestones/custom-nodes-milestones-example.component';
import { MilestonesStatesExampleComponent } from '../examples/milestones/states-milestones-example.component';
import { MilestonesCssVariablesExampleComponent } from '../examples/milestones/css-variables-milestones-example.component';
import { MilestonesHorizontalPulseExampleComponent } from '../examples/milestones/horizontal-pulse-milestones-example.component';
import { MixinMilestonesExampleComponent } from '../examples/milestones/mixin-milestones-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const MILESTONES_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'milestones-vertical': MilestonesVerticalExampleComponent,
	'milestones-horizontal': MilestonesHorizontalExampleComponent,
	'milestones-horizontal-pulse': MilestonesHorizontalPulseExampleComponent,
	'milestones-custom-nodes': MilestonesCustomNodesExampleComponent,
	'milestones-states': MilestonesStatesExampleComponent,
	'milestones-css-variables': MilestonesCssVariablesExampleComponent
};

/**
 * Documentation page for the ng-hub-ui-milestones library.
 */
@Component({
	selector: 'app-milestones',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `<app-library-page
		[library]="milestonesLibrary"
		[package]="'milestones'"
		[playground]="playgroundConfigs"
		[exampleGroups]="exampleGroups"
	></app-library-page>`
})
export class MilestonesComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = MILESTONES_PLAYGROUND;

	/** Section headings for the examples panel, shared with the Overview feature guides. */
	protected readonly exampleGroups = MILESTONES_FUNCTIONALITIES;

	milestonesLibrary: Library = {
		title: 'ng-hub-ui-milestones',
		description:
			'A standalone, signal-based timeline / progress-steps component for Angular. Lay milestones out vertically or horizontally, drive each node with a state, auto-number them, project custom in-circle content, and theme everything through canonical `--hub-*` CSS variables — no Bootstrap dependency.',
		overview: {
			text: 'ng-hub-ui-milestones is a purely presentational timeline. A `hub-milestones` container projects `hub-milestone` children, draws the connecting rail between them and numbers the nodes automatically in DOM order. Each node carries a `state` (complete / active / pending / error) that drives its colors, an optional per-node `color` override, and either auto-numbering, a `label`, or fully custom content via the `hubMilestoneNode` template (icons, emoji, avatars). Both components are standalone, OnPush and signal-native, and every colour, size and spacing is a canonical `--hub-milestone-*` CSS variable, so theming (including dark mode) is runtime and instant.',
			highlights: [
				{
					icon: 'fa-solid fa-arrows-up-down',
					title: 'Vertical or horizontal',
					description:
						'One `orientation` input flips the timeline between a vertical wizard and horizontal progress steps.'
				},
				{
					icon: 'fa-solid fa-list-ol',
					title: 'Auto-numbered nodes',
					description: 'Nodes are numbered 1, 2, 3… in DOM order automatically — no manual indices.'
				},
				{
					icon: 'fa-solid fa-circle-half-stroke',
					title: 'Four node states',
					description: 'complete, active, pending and error each render distinct node and connector styling.'
				},
				{
					icon: 'fa-solid fa-icons',
					title: 'Custom in-circle content',
					description: 'Project numbers, icons, emoji or avatars into the node with `<ng-template hubMilestoneNode>`.'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'Signal-native & standalone',
					description:
						'Both components are standalone, OnPush and built on Angular Signals. Import only what you use.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Canonical CSS variables',
					description:
						'Themed entirely through `--hub-milestone-*` tokens with safe fallbacks — runtime dark mode included.'
				}
			],
			changelog: [
				{
					version: '22.5.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'A milestone in error is no longer distinguishable by colour alone. It was a red circle and nothing else, and the rail carries aria-hidden="true", so the state reached nobody who does not separate red from green. Every node now renders its state as a word in the body, clipped out of the page and read out with the step, and an error node additionally draws a light mark on its circle that survives greyscale.'
						},
						{
							type: 'added',
							description:
								"stateLabel on hub-milestone and stateLabels in HubMilestonesConfig: the announced word is English by default (Completed, Pending, Error, and nothing for active, which aria-current already names), and these two are how it gets translated. The per-node input wins over the application-wide option, and '' silences one node or one state."
						},
						{
							type: 'added',
							description:
								'data-state on hub-milestone, mirroring the state the modifier classes already carry — the same attribute hook toast, badges and stepper expose for styling and for tests.'
						},
						{
							type: 'changed',
							description:
								'The node body now contains one clipped span before the projected content. Nothing moves on screen and no API changes, but a test asserting on the exact textContent of a milestone body will see the state word alongside its own copy.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								"A :root in the application now outranks the library's token defaults. The component is unencapsulated, so its :root block of --hub-milestone-* defaults lands in the global stylesheet with the same specificity as the application's own :root, and the tie goes to whichever sheet was injected last — the component's, always. Wrapped in :where() the defaults score zero, so the consumer's rule wins on merit and nothing needs !important. Same tokens, same values; only what wins changed."
						},
						{
							type: 'changed',
							description:
								'The Styling section of both READMEs says where a redefinition actually lands. It listed :root, a hub-milestones selector and the per-node color input as equivalent, when the first of the three did nothing.'
						}
					]
				},
				{
					version: '22.3.3',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'The documentation no longer denies the ng-hub-ui-utils dependency the package requires. Both READMEs advertised zero runtime dependencies and an install line naming this package alone, while peerDependencies has demanded ng-hub-ui-utils since 22.3.0, so a reader installing by hand ended up with an application that cannot resolve resolveHubAccent. The install block now names both packages and states the peer range.'
						},
						{
							type: 'fixed',
							description:
								'hubMilestoneNode is described as what it is: an attribute directive. Calling it structural set the wrong expectation about where its content appears. It only tags a template, and hub-milestone is what renders it inside the circle.'
						},
						{
							type: 'fixed',
							description:
								'HUB_MILESTONES_CONFIG is in the API reference. The token is exported from public-api.ts and is the only way to read the resolved application defaults, yet neither README named it.'
						},
						{
							type: 'fixed',
							description:
								'The Styling section documents the SCSS the package ships. The theming mixin and the styles entry point have been published since 22.2.0 with no trace in either README, leaving the one-call theming path visible only to whoever read the changelog.'
						}
					]
				},
				{
					version: '22.3.2',
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
					version: '22.3.1',
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
					version: '22.3.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution now imports the canonical resolveHubAccent from ng-hub-ui-utils. The private copy under src/lib/shared/resolve-hub-accent.ts has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to var(--hub-sys-color-<name>, <name>), a literal colour passes through unchanged, an empty value yields null.'
						},
						{
							type: 'added',
							description:
								'NEW peer dependency: ng-hub-ui-utils >=22.7.0. Consumers must have ng-hub-ui-utils installed alongside this library (it is where resolveHubAccent lives). Users installing via ng add ng-hub-ui get it automatically; manual installs need npm i ng-hub-ui-utils.'
						}
					]
				},
				{
					version: '22.2.1',
					date: '2026-07-28',
					changes: [
						{
							type: 'fixed',
							description:
								'Each milestone exposes role=listitem and the active node announces aria-current=step, completing the list semantics the container already declared.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'hub-milestones-theme(...) SCSS mixin — one-call token theming for <hub-milestones>, covering the full --hub-milestone-* surface: completed steps ($node-color, $node-text, $node-size, $node-font-size, $connector-bg, $connector-thickness), upcoming steps ($pending-bg, $pending-border, $pending-color, $connector-pending-bg), the error state ($error-bg), the step body ($body-color, $body-muted) and layout ($gap, $spacing). Every parameter is null-defaulted and additive.'
						},
						{
							type: 'changed',
							description:
								"Packaging — the library now ships its SCSS at /styles. src/lib/styles is emitted to dist/milestones/styles, exposing hub-milestones-theme as a first-class package entry: @use 'ng-hub-ui-milestones/styles' as *;"
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								'<hub-milestone> color accepts ANY colour. On top of the built-in semantic accents, the input now also accepts a registered custom accent and a literal colour (#ff0000, rgb(...), oklch(...), a CSS named colour), resolved through the shared resolveHubAccent resolver: a bareword becomes var(--hub-sys-color-<name>, <name>); a literal is used as-is. Built-in colours are unchanged.'
						},
						{
							type: 'changed',
							description:
								'Internal — host bindings moved to the host metadata object. @HostBinding / @HostListener decorators were replaced by the host object in the component and directive metadata (Angular style guide). No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.0.3',
					date: '2026-06-25',
					changes: [
						{
							type: 'changed',
							description:
								'Widened the Angular peer dependency range from ^22.0.0 to >=21.0.0, so the library installs on Angular 21 projects as well, aligning it with the rest of the ng-hub-ui family. No code changes.'
						}
					]
				},
				{
					version: '22.0.2',
					date: '2026-06-25',
					changes: [
						{
							type: 'added',
							description:
								'Viewport reveal — when a <hub-milestones> scrolls into view it plays a one-shot animation, filling the accent trail from the first node up to the active node. On by default; set it globally with provideHubMilestones({ reveal: false }) or per instance with [reveal]. Tunable via --hub-milestone-reveal-duration / --hub-milestone-reveal-stagger, SSR-safe and disabled under prefers-reduced-motion.'
						},
						{
							type: 'added',
							description:
								'provideHubMilestones() provider and HubMilestonesConfig for app-wide defaults, plus the [pulse] input on <hub-milestones> — an opt-in soft wave on the active node whose colour follows the node accent and is overridable via --hub-milestone-pulse-color / --hub-milestone-pulse-duration / --hub-milestone-pulse-spread.'
						},
						{
							type: 'fixed',
							description:
								"Connectors now reach from node to node: the connector is absolutely positioned and always spans node edge to next-node edge, in both orientations. Its colour follows the theme accent (--hub-milestone-node-color) instead of the hardcoded purple-to-orange gradient, the accent trail stops at the active node so the timeline reads as a real progress indicator, and layout, connectors and the reveal flip correctly under dir='rtl'."
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: aligned inline fallback defaults with the canonical ng-hub-ui-ds values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their --hub-sys-* / --hub-ref-* tokens, so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description: 'Aligned with Angular 22. README documentation standardized.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-06-14',
					changes: [
						{
							type: 'added',
							description:
								'Initial release: hub-milestones container (vertical / horizontal orientation, auto-numbered nodes) and hub-milestone node with complete/active/pending/error states.'
						},
						{
							type: 'added',
							description:
								'Per-node color override, label fallback and custom in-circle content via the hubMilestoneNode template directive.'
						},
						{
							type: 'added',
							description: 'Full --hub-milestone-* CSS-variable theming for node, connector, states and spacing.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'orientation (hub-milestones)',
					type: "'vertical' | 'horizontal'",
					required: false,
					defaultValue: "'vertical'",
					description: 'DOCS.MILESTONES.API.INPUT.ORIENTATION.DESCRIPTION'
				},
				{
					name: 'state (hub-milestone)',
					type: "'complete' | 'active' | 'pending' | 'error'",
					required: false,
					defaultValue: "'pending'",
					description: 'DOCS.MILESTONES.API.INPUT.STATE.DESCRIPTION'
				},
				{
					name: 'color (hub-milestone)',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.MILESTONES.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'label (hub-milestone)',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.MILESTONES.API.INPUT.LABEL.DESCRIPTION'
				},
				{
					name: 'stateLabel (hub-milestone)',
					type: 'string | undefined',
					required: false,
					defaultValue: 'HubMilestonesConfig.stateLabels',
					description: 'DOCS.MILESTONES.API.INPUT.STATE_LABEL.DESCRIPTION'
				},
				{
					name: 'pulse (hub-milestones)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.MILESTONES.API.INPUT.PULSE.DESCRIPTION'
				},
				{
					name: 'reveal (hub-milestones)',
					type: 'boolean | undefined',
					required: false,
					defaultValue: 'HubMilestonesConfig.reveal',
					description: 'DOCS.MILESTONES.API.INPUT.REVEAL.DESCRIPTION'
				}
			],
			outputs: [],
			templates: [
				{
					name: 'DOCS.MILESTONES.API.TEMPLATE.0.NAME',
					description: 'DOCS.MILESTONES.API.TEMPLATE.0.DESCRIPTION',
					example:
						'<hub-milestone>\n  <ng-template hubMilestoneNode>★</ng-template>\n  <h4>Shipped</h4>\n</hub-milestone>'
				},
				{
					name: 'DOCS.MILESTONES.API.TEMPLATE.1.NAME',
					description: 'DOCS.MILESTONES.API.TEMPLATE.1.DESCRIPTION',
					example:
						'<hub-milestone state="active">\n  <h4>Payment</h4>\n  <p>Enter your payment method.</p>\n</hub-milestone>'
				}
			],
			cssVariables: MD_CSS_VARIABLES['milestones'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['milestones'],
			demos: [
				{
					title: 'Theming with hub-milestones-theme',
					previewComponent: MixinMilestonesExampleComponent,
					code: `@use 'ng-hub-ui-milestones/styles' as milestones;

.milestones-mixin-scope {
	@include milestones.hub-milestones-theme(
		$node-color: #7c3aed,
		$connector-thickness: 3px
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
	 * Registers every milestones example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'milestones-vertical',
				title: 'DOCS.MILESTONES.EXAMPLE.VERTICAL.TITLE',
				componentName: 'MilestonesVerticalExampleComponent',
				files: ['vertical-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/vertical-milestones-example.component').then(
						(m) => m.MilestonesVerticalExampleComponent
					)
			},
			{
				id: 'milestones-horizontal',
				title: 'DOCS.MILESTONES.EXAMPLE.HORIZONTAL.TITLE',
				componentName: 'MilestonesHorizontalExampleComponent',
				files: ['horizontal-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/horizontal-milestones-example.component').then(
						(m) => m.MilestonesHorizontalExampleComponent
					)
			},
			{
				id: 'milestones-horizontal-pulse',
				title: 'DOCS.MILESTONES.EXAMPLE.HORIZONTAL_PULSE.TITLE',
				componentName: 'MilestonesHorizontalPulseExampleComponent',
				files: ['horizontal-pulse-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/horizontal-pulse-milestones-example.component').then(
						(m) => m.MilestonesHorizontalPulseExampleComponent
					)
			},
			{
				id: 'milestones-states',
				title: 'DOCS.MILESTONES.EXAMPLE.STATES.TITLE',
				componentName: 'MilestonesStatesExampleComponent',
				files: ['states-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/states-milestones-example.component').then(
						(m) => m.MilestonesStatesExampleComponent
					)
			},
			{
				id: 'milestones-custom-nodes',
				title: 'DOCS.MILESTONES.EXAMPLE.CUSTOM_NODES.TITLE',
				componentName: 'MilestonesCustomNodesExampleComponent',
				files: ['custom-nodes-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/custom-nodes-milestones-example.component').then(
						(m) => m.MilestonesCustomNodesExampleComponent
					)
			},
			{
				id: 'milestones-css-variables',
				title: 'DOCS.MILESTONES.EXAMPLE.CSS_VARIABLES.TITLE',
				componentName: 'MilestonesCssVariablesExampleComponent',
				files: ['css-variables-milestones-example.component.ts'],
				loader: () =>
					import('../examples/milestones/css-variables-milestones-example.component').then(
						(m) => m.MilestonesCssVariablesExampleComponent
					)
			}
		];

		examples.forEach((ex) => this._exampleRegistry.register({ ...ex, packagePath: 'milestones' }));
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview
	 * component so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		this.milestonesLibrary.functionalities = MILESTONES_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const item = this._exampleRegistry.get(id);
					if (!item) return null;
					return {
						title: item.title,
						description: item.title,
						import: '',
						template: '',
						component: '',
						id: item.id,
						previewComponent: MILESTONES_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
