import { ChangeDetectionStrategy, Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { METRICS_FUNCTIONALITIES } from './metrics-functionalities';
import { ProgressMetricsExampleComponent } from '../examples/metrics/progress-metrics-example.component';
import { MeterMetricsExampleComponent } from '../examples/metrics/meter-metrics-example.component';
import { RingMetricsExampleComponent } from '../examples/metrics/ring-metrics-example.component';
import { StylingMetricsExampleComponent } from '../examples/metrics/styling-metrics-example.component';
import { MixinMetricsExampleComponent } from '../examples/metrics/mixin-metrics-example.component';

/**
 * Maps each registered example id to its standalone component so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const METRICS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'metrics-progress': ProgressMetricsExampleComponent,
	'metrics-meter': MeterMetricsExampleComponent,
	'metrics-ring': RingMetricsExampleComponent,
	'metrics-theming': StylingMetricsExampleComponent
};

/**
 * Main ng-hub-ui-metrics library documentation page.
 */
@Component({
	selector: 'app-metrics',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <app-library-page [library]="metricsLibrary" [package]="'metrics'"></app-library-page> `
})
export class MetricsComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Complete ng-hub-ui-metrics library data. */
	metricsLibrary: Library = {
		title: 'ng-hub-ui-metrics',
		description:
			'Read-only Angular metric primitives — a linear progress bar, a graded meter and a circular ring gauge — driven by semantic design-system tokens and full ARIA semantics.',
		overview: {
			text: "ng-hub-ui-metrics is a small family of presentational primitives for visualizing a single value. `hub-progress` renders a determinate or indeterminate linear bar; `hub-meter` grades a scalar against a `[low, high]` plateau following HTML `<meter>` semantics; `hub-ring` draws a normalized score as an SVG arc with an optional projected caption. None of the components hard-code a colour: they read the shared `--hub-sys-color-*` families and expose `--hub-progress-*`, `--hub-meter-*` and `--hub-ring-*` custom properties for theming. Tint a single primitive with the semantic `color` input, or retint all three at once with the one-call `hub-metrics-theme()` Sass mixin — `@use 'ng-hub-ui-metrics/styles' as hub; @include hub.hub-metrics-theme($accent, $track, $low, $optimum, $high, $radius);` — see the Theming example.",
			highlights: [
				{
					icon: 'fa-solid fa-bars-progress',
					title: 'Linear progress',
					description:
						'A determinate or indeterminate progress bar with a size scale, semantic colours and an optional value label.'
				},
				{
					icon: 'fa-solid fa-gauge-high',
					title: 'Graded meter',
					description:
						'A gauge following HTML <meter> semantics that recolours itself by band relative to the optimum point.'
				},
				{
					icon: 'fa-solid fa-circle-notch',
					title: 'Circular ring gauge',
					description:
						'An SVG ring rendering a normalized score, with colour thresholds and a caption projected through <ng-content>.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Themeable in one call',
					description:
						'Tint one primitive with the semantic color input (mapped to the ds --hub-sys-color-* families), or retint all three at once with the hub-metrics-theme() Sass mixin and the --hub-* custom properties. See the Theming example.'
				}
			],
			changelog: [
				{
					version: '22.4.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								"The three primitives keep their stylesheet to themselves. <hub-progress>, <hub-meter> and <hub-ring> shipped with ViewEncapsulation.None, which publishes every rule they emit into the application's global cascade, where it competes with rules the library never sees and cannot be removed by anyone who did not know it was there. None of the four reasons CODING_RULES.md allows for leaving encapsulation applied here: all three paint their own host and their own template and nothing else. The token defaults move from :where(.hub-progress) to :where(:host), which costs nothing because a custom property inherits, and the size and band modifiers, which ride on the host, are matched through :host(). Theming is untouched: the defaults stay at specificity zero and hub-metrics-theme() still emits its rules from your own sheet against the host element. See BREAKING_CHANGES.md for the one case that does change."
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). Every token in the three stylesheets has always resolved through the --hub-sys-* / --hub-ref-* ladder and the manifest said nothing about it, so a consumer reading the package on npm had no way to learn that installing the token package is what gives these primitives the family palette and its dark mode. It stays optional because it truly is: each token carries a literal fallback and the library renders without it.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'<hub-meter> and <hub-ring> accept a label input, mirroring <hub-progress>. An element with role=meter is named by its author alone: the meter renders no text of its own and the caption projected into the ring is not a name, so both primitives reached assistive technology unnamed and the ring could not even be named from outside. The input feeds aria-label through a host binding and is dropped when empty, so an outer aria-labelledby still applies; an aria-label written on the element itself does not, because the host binding owns the attribute and clears it whenever label is unset. See BREAKING_CHANGES.md.'
						},
						{
							type: 'added',
							description:
								'FUNCTIONALITIES.md, the coverage table the rest of the family ships. Nothing stated which parts of the three primitives a live example actually demonstrates and which are only described in prose, so a reader had to open the docs site and infer it.'
						},
						{
							type: 'fixed',
							description:
								'<hub-ring> no longer takes its accessible name from its own percentage. aria-label was hard-wired to the rounded value already carried by aria-valuetext, which announced the number twice and overwrote any name written on the element. The name now comes from the new label input, and the percentage stays in aria-valuetext.'
						},
						{
							type: 'fixed',
							description:
								'<hub-ring> size and thickness no longer shadow their own tokens. Both defaulted to a concrete length written inline as a custom property on every render, so --hub-ring-size and --hub-ring-thickness, advertised as themeable by the README, the CSS reference and the ds token spec, could only be overridden with !important, and not even the hub-metrics-theme() mixin reached them. The inputs now default to undefined (their type widens accordingly) and the inline declaration is dropped when unset, leaving the stylesheet in charge with 4rem and var(--hub-ref-space-2, 0.5rem), the same values as before. Same shape as the 22.0.1 fix for the color input of <hub-progress>.'
						},
						{
							type: 'fixed',
							description:
								'The README no longer advertises zero external dependencies. ng-hub-ui-utils has been a required peer since 22.2.0, because <hub-progress> imports resolveHubAccent from it, so anyone who followed the Quick Start installed a tree that cannot resolve. Both READMEs now state the dependency and the install command names it.'
						},
						{
							type: 'fixed',
							description:
								'The <hub-progress> token table lists --hub-progress-accent. It is the root slot written by the color input and by the $accent of the mixin, and the one every other progress token derives from, yet it was the single token the table left out, so a theme author reading only the README could not see what to override.'
						},
						{
							type: 'fixed',
							description:
								'HubRingThresholds.low described itself as inclusive (at or below) while the component treats a value equal to low as neutral. The JSDoc ships in the .d.ts, so the wrong sentence is what a consumer reads in their editor.'
						}
					]
				},
				{
					version: '22.2.4',
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
					version: '22.2.3',
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
					version: '22.2.2',
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
					version: '22.2.1',
					date: '2026-07-28',
					changes: [
						{
							type: 'fixed',
							description:
								'The package could not be published: tsconfig.lib.prod.json was missing "compilationMode": "partial", so production builds emitted full Ivy output, which npm publishing rejects. 22.2.0 never reached the registry; this release carries the 22.2.0 changes (canonical resolveHubAccent from ng-hub-ui-utils) plus the build fix.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution now imports the canonical resolveHubAccent from ng-hub-ui-utils. The private copy under src/lib/shared/resolve-hub-accent.ts (used by <hub-progress>) has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to var(--hub-sys-color-<name>, <name>), a literal colour passes through unchanged, an empty value yields null.'
						},
						{
							type: 'added',
							description:
								'NEW peer dependency: ng-hub-ui-utils >=22.7.0. Consumers must have ng-hub-ui-utils installed alongside this library (it is where resolveHubAccent lives). Users installing via ng add ng-hub-ui get it automatically; manual installs need npm i ng-hub-ui-utils.'
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
								"BREAKING (packaging) — SCSS ships at ng-hub-ui-metrics/styles. The theme mixin now builds to dist/metrics/styles/... (was dist/metrics/src/lib/styles/...), so @use 'ng-hub-ui-metrics/styles' resolves. Update any @use that reached into src/lib/styles."
						},
						{
							type: 'changed',
							description:
								'<hub-progress> color accepts ANY colour. On top of the built-in semantic accents, the input now also accepts a registered custom accent and a literal colour (#ff0000, rgb(...), oklch(...), a CSS named colour), resolved through the shared resolveHubAccent resolver (a local copy of the canonical ng-hub-ui-utils helper): a bareword becomes var(--hub-sys-color-<name>, <name>); a literal is used as-is. The single --hub-<comp>-accent slot derives the rest of the family, so built-in colours are unchanged.'
						},
						{
							type: 'changed',
							description:
								'Internal — host bindings moved to the host metadata object. @HostBinding / @HostListener decorators were replaced by the host object in the component/directive metadata (Angular style guide). No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-07-06',
					changes: [
						{
							type: 'fixed',
							description:
								'Wrapper / mixin theming now actually retints the primitives. Each component declares its token defaults on its own element (:where(.hub-progress) / :where(.hub-meter) / :where(.hub-ring)), and a custom property set on the element wins over one inherited from an ancestor — so a bare .wrapper { --hub-*: … } override, and the hub-metrics-theme() mixin that emitted such overrides, had no effect. The mixin now emits its token overrides ON the metrics elements as descendants of the include scope (<scope> :where(.hub-progress, .hub-meter, .hub-ring)), which beats the per-element defaults and reaches the components.'
						},
						{
							type: 'fixed',
							description:
								'<hub-ring> host role corrected to meter (was img, which does not expose the aria-valuemin / -valuemax / -valuenow / -valuetext attributes the component sets).'
						},
						{
							type: 'changed',
							description:
								'<hub-progress> color input is now optional (HubMetricsColor | undefined, default undefined). When set it is applied inline as a per-instance override; when omitted the accent falls back to the --hub-progress-accent token so a theme (mixin / token override) can drive it. The rendered default is unchanged (primary).'
						},
						{
							type: 'added',
							description:
								'docs/css-variables-reference.md — complete CSS custom-property reference for <hub-progress>, <hub-meter> and <hub-ring>, with the theming guidance above.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'HubProgressComponent: a determinate/indeterminate linear progress bar with a size scale, semantic colours and an optional value label.'
						},
						{
							type: 'added',
							description:
								'HubMeterComponent: a graded gauge following HTML <meter> semantics that selects its fill band from the low/high plateau and the optimum point.'
						},
						{
							type: 'added',
							description:
								'HubRingComponent: a circular SVG ring gauge with colour thresholds, a projected centre caption and exportAs "hubGauge".'
						},
						{
							type: 'added',
							description:
								'CSS-variable theming surface (--hub-progress-*, --hub-meter-*, --hub-ring-*) mapped onto the shared --hub-sys-color-* token families.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'hub-progress · value',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.VALUE.DESCRIPTION'
				},
				{
					name: 'hub-progress · max',
					type: 'number',
					required: false,
					defaultValue: '100',
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.MAX.DESCRIPTION'
				},
				{
					name: 'hub-progress · indeterminate',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.INDETERMINATE.DESCRIPTION'
				},
				{
					name: 'hub-progress · color',
					type: 'HubMetricsColor | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'hub-progress · size',
					type: 'HubProgressSize',
					required: false,
					defaultValue: "'md'",
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'hub-progress · showValue',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.SHOW_VALUE.DESCRIPTION'
				},
				{
					name: 'hub-progress · label',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.METRICS.API.PROGRESS.INPUT.LABEL.DESCRIPTION'
				},
				{
					name: 'hub-meter · value',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.METRICS.API.METER.INPUT.VALUE.DESCRIPTION'
				},
				{
					name: 'hub-meter · min',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.METRICS.API.METER.INPUT.MIN.DESCRIPTION'
				},
				{
					name: 'hub-meter · max',
					type: 'number',
					required: false,
					defaultValue: '1',
					description: 'DOCS.METRICS.API.METER.INPUT.MAX.DESCRIPTION'
				},
				{
					name: 'hub-meter · low',
					type: 'number | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.METER.INPUT.LOW.DESCRIPTION'
				},
				{
					name: 'hub-meter · high',
					type: 'number | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.METER.INPUT.HIGH.DESCRIPTION'
				},
				{
					name: 'hub-meter · optimum',
					type: 'number | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.METER.INPUT.OPTIMUM.DESCRIPTION'
				},
				{
					name: 'hub-meter · label',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.METRICS.API.METER.INPUT.LABEL.DESCRIPTION'
				},
				{
					name: 'hub-ring · value',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.METRICS.API.RING.INPUT.VALUE.DESCRIPTION'
				},
				{
					name: 'hub-ring · max',
					type: 'number',
					required: false,
					defaultValue: '1',
					description: 'DOCS.METRICS.API.RING.INPUT.MAX.DESCRIPTION'
				},
				{
					name: 'hub-ring · size',
					type: 'number | string | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.RING.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'hub-ring · thickness',
					type: 'number | string | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.RING.INPUT.THICKNESS.DESCRIPTION'
				},
				{
					name: 'hub-ring · thresholds',
					type: 'HubRingThresholds | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.METRICS.API.RING.INPUT.THRESHOLDS.DESCRIPTION'
				},
				{
					name: 'hub-ring · showValue',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.METRICS.API.RING.INPUT.SHOW_VALUE.DESCRIPTION'
				},
				{
					name: 'hub-ring · label',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.METRICS.API.RING.INPUT.LABEL.DESCRIPTION'
				}
			],
			outputs: [],
			templates: [
				{
					name: 'hub-ring · <ng-content>',
					description: 'DOCS.METRICS.API.RING.TEMPLATE.CAPTION.DESCRIPTION',
					example: `<hub-ring [value]="0.82" [thresholds]="{ low: 0.4, high: 0.75 }" label="Quality score">Score</hub-ring>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['metrics'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['metrics'],
			demos: [
				{
					title: 'Theming with hub-metrics-theme',
					previewComponent: MixinMetricsExampleComponent,
					code: `@use 'ng-hub-ui-metrics/styles' as hub;

.metrics-mixin-scope {
	@include hub.hub-metrics-theme(
		$accent: #0ea5e9,
		$radius: 0.75rem
	);
}`
				}
			]
		}
	};

	/**
	 * Registers examples and populates the grouped functionalities section
	 * shown by the shared docs page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every metrics example with the shared ExampleRegistry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'metrics-progress',
				title: 'DOCS.METRICS.EXAMPLE.PROGRESS.TITLE',
				componentName: 'ProgressMetricsExampleComponent',
				files: ['progress-metrics-example.component.ts'],
				loader: () =>
					import('../examples/metrics/progress-metrics-example.component').then(
						(m) => m.ProgressMetricsExampleComponent
					)
			},
			{
				id: 'metrics-meter',
				title: 'DOCS.METRICS.EXAMPLE.METER.TITLE',
				componentName: 'MeterMetricsExampleComponent',
				files: ['meter-metrics-example.component.ts'],
				loader: () =>
					import('../examples/metrics/meter-metrics-example.component').then((m) => m.MeterMetricsExampleComponent)
			},
			{
				id: 'metrics-ring',
				title: 'DOCS.METRICS.EXAMPLE.RING.TITLE',
				componentName: 'RingMetricsExampleComponent',
				files: ['ring-metrics-example.component.ts'],
				loader: () =>
					import('../examples/metrics/ring-metrics-example.component').then((m) => m.RingMetricsExampleComponent)
			},
			{
				id: 'metrics-theming',
				title: 'DOCS.METRICS.EXAMPLE.THEMING.TITLE',
				componentName: 'StylingMetricsExampleComponent',
				files: ['styling-metrics-example.component.ts', 'styling-metrics-example.component.scss'],
				loader: () =>
					import('../examples/metrics/styling-metrics-example.component').then(
						(m) => m.StylingMetricsExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'metrics'
			});
		});
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview component.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		this.metricsLibrary.functionalities = METRICS_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const registryItem = this.exampleRegistry.get(id);
					if (!registryItem) {
						return null;
					}

					return {
						title: registryItem.title,
						description: registryItem.title,
						import: '',
						template: '',
						component: '',
						previewComponent: METRICS_PREVIEW_COMPONENTS[id]
					} as FeatureExample;
				})
				.filter((example): example is FeatureExample => example !== null)
		}));
	}
}
