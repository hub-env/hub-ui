import { Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicCardSkeletonExampleComponent } from '../examples/skeleton/basic-card-skeleton-example.component';
import { CompactDslSkeletonExampleComponent } from '../examples/skeleton/compact-dsl-skeleton-example.component';
import { CompactVariantSkeletonExampleComponent } from '../examples/skeleton/compact-variant-skeleton-example.component';
import { CustomPresetSkeletonExampleComponent } from '../examples/skeleton/custom-preset-skeleton-example.component';
import { DashboardSkeletonExampleComponent } from '../examples/skeleton/dashboard-skeleton-example.component';
import { InlineTemplateSkeletonExampleComponent } from '../examples/skeleton/inline-template-skeleton-example.component';
import { MixinSkeletonExampleComponent } from '../examples/skeleton/mixin-skeleton-example.component';
import { PresetCatalogueSkeletonExampleComponent } from '../examples/skeleton/preset-catalogue-skeleton-example.component';
import { ResponsiveTableSkeletonExampleComponent } from '../examples/skeleton/responsive-table-skeleton-example.component';
import { SKELETON_PLAYGROUND } from './skeleton-playground';

/**
 * `DOCS.SKELETON.EXAMPLE.*` key segment that holds the localized title and description
 * of every registered example.
 *
 * The copy lives in the locale files rather than on the example classes so a reader in
 * any of the eight languages gets it in their own, and so the page never has to build an
 * example just to ask it how it introduces itself.
 */
const EXAMPLE_I18N_KEYS: Record<string, string> = {
	'skeleton-card-preset': 'CARD_PRESET',
	'skeleton-preset-catalogue': 'PRESET_CATALOGUE',
	'skeleton-inline-template': 'INLINE_TEMPLATE',
	'skeleton-compact-dsl': 'COMPACT_DSL',
	'skeleton-custom-preset': 'CUSTOM_PRESET',
	'skeleton-responsive-table': 'RESPONSIVE_TABLE',
	'skeleton-compact-variant': 'COMPACT_VARIANT',
	'skeleton-dashboard-composition': 'DASHBOARD_COMPOSITION'
};

/**
 * Main skeleton library documentation page component.
 */
@Component({
	selector: 'app-skeleton',
	standalone: true,
	imports: [LibraryPageComponent],
	template: `
		<app-library-page
			[library]="skeletonLibrary"
			[package]="'skeleton'"
			[playground]="playgroundConfigs"
		></app-library-page>
	`
})
export class SkeletonComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = SKELETON_PLAYGROUND;

	/**
	 * Complete skeleton library documentation payload.
	 */
	skeletonLibrary: Library = {
		title: 'ng-hub-ui-skeleton',
		description:
			'Dynamic Angular skeleton placeholders with a compact DSL, reusable presets, responsive values and programmatic preset registration.',
		overview: {
			text: 'This library focuses on loading states that stay maintainable when products grow. Instead of hand-writing one-off shimmer markup, teams can reuse named presets or declare new skeleton structures with a compact Emmet-like DSL that supports nesting, repeats, variants, preset composition and responsive property values.',
			highlights: [
				{
					icon: 'fa-solid fa-layer-group',
					title: 'Preset Catalogue',
					description:
						'Understand what the bundled catalogue already solves before authoring your own loading patterns. The initial presets are meant to cover the common surfaces product teams ship every week: cards, rows, dashboards, forms, detail views and empty states.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Compact DSL Authoring',
					description:
						'The DSL is the contract that turns one-off shimmer markup into maintainable product code. This section explains how the syntax composes structure, modifiers, params and repeats without forcing teams into verbose JSON trees.'
				},
				{
					icon: 'fa-solid fa-mobile-screen',
					title: 'Variants And Responsive Layouts',
					description:
						'Loading states need to react to density and breakpoints just like the real UI. This section explains how variants and responsive values keep the same skeleton relevant across compact cards, wide tables and mobile stacks.'
				},
				{
					icon: 'fa-solid fa-sliders',
					title: 'Programmatic Registration And Theming',
					description:
						'Real products usually need a local skeleton language. This section covers how to register project-specific presets and how to theme shimmer, colour, spacing and radii through CSS variables.'
				}
			],
			changelog: [
				{
					version: '22.3.1',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'Both READMEs stop presenting six internal DSL helpers as part of the API. They listed parseHubSkeletonDsl, interpolateHubSkeletonParams, resolveTemplateDsl, resolveResponsiveToken, resolveBreakpointFromWidth and resolveHubSkeletonNodes as exported, and public-api.ts has never re-exported the module that declares them, so a reader who followed the documentation and imported one got a build error. They stay internal: a layout is written as a template string and handed to the component or registered as a preset, so nothing outside the package has to call them.'
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
								'FUNCTIONALITIES.md now ships with the library, the same coverage table the rest of the family provides: which parts of the component, the DSL, the preset catalogue, the registry and the styling surface a live example actually demonstrates, and which are only prose. Nothing stated it before, so a reader had to open the documentation site and infer it.'
						},
						{
							type: 'changed',
							description:
								"One preset registry is shared again instead of one per placeholder. The component listed HubSkeletonPresetRegistryService in its own providers, so every <hub-skeleton> on screen built a private instance and merged the sixteen bundled presets into a fresh Map, twenty times over on a screen with twenty placeholders, while the README described the service as the providedIn: 'root' singleton a consumer who injects it actually gets. The component now resolves the root instance, which changes where custom presets are read from: see BREAKING_CHANGES.md."
						},
						{
							type: 'changed',
							description:
								"Both READMEs teach the canonical ng-hub-ui-skeleton/styles entry for the theming mixin. They still reached for the deep path ng-hub-ui-skeleton/styles/mixins/skeleton-theme, which resolves but is not the entry 22.2.0 introduced and not what BREAKING_CHANGES.md, the mixin's own header and the generated mixin reference all show, so a reader comparing two sources had to guess which one was current."
						},
						{
							type: 'fixed',
							description:
								'The ariaLabel input is finally reachable by assistive technology. The container carried role="presentation" and aria-label at once, a conflict that costs the name whichever way a user agent resolves it, while every placeholder shape inside is aria-hidden, so nothing was left to carry the name either. A consumer setting the input, or relying on its non-empty default, got silence and had to announce the loading state from an outer element of their own. The container is now a polite role="status" region with aria-busy="true", matching ng-hub-ui-loading, and keeps the label as its accessible name.'
						},
						{
							type: 'fixed',
							description:
								'The styles subpath the docs prescribe is now declared in the manifest exports. Since 22.2.0 the stylesheets have shipped at styles/, and both the README and BREAKING_CHANGES.md tell consumers to reach them with @use ng-hub-ui-skeleton/styles. The generated exports map declared only . and ./package.json, so anything that enforces the map, from Node subpath resolution to the Sass pkg: importer and bundlers that honour exports, refused the very import the documentation teaches. An Angular CLI build happened to survive because it resolves bare Sass specifiers through loadPaths instead, which is why the block went unnoticed. The theming entry and the skeleton-theme mixin are now declared explicitly, as the sibling libraries already do.'
						},
						{
							type: 'deprecated',
							description:
								'HubSkeletonModule is deprecated and will be removed in 23.0.0. It imports and exports HubSkeletonComponent and provides nothing of its own, so importing the component directly is the whole migration; custom presets go through provideHubSkeletonPresets(), which never travelled through the module either. The class described itself as kept for compatibility with module-based apps but carried no @deprecated tag, so neither an editor nor the build warned anyone. See BREAKING_CHANGES.md.'
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
								'The package shipped without its licence notice. package.json declared MIT, but no LICENSE file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.'
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
							type: 'added',
							description:
								'Comprehensive test suite for the skeleton DSL parser and preset registry: full grammar coverage (node types, nesting, siblings, props, variants, multipliers, responsive tokens), every parser error path with its exact message, preset expansion/override/variant resolution, and component render round-trips. No runtime changes.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging) — SCSS ships at ng-hub-ui-skeleton/styles. The theme mixin now builds to dist/skeleton/styles/... (was dist/skeleton/src/lib/styles/...), so @use 'ng-hub-ui-skeleton/styles' resolves. Update any @use that reached into src/lib/styles."
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
								'New hub-skeleton-theme() Sass mixin (styles/mixins/skeleton-theme) — theme the loading placeholders in one call: base / highlight surfaces (the shimmer gradient), corner radius, node gap and shimmer speed. Every parameter is optional and defaults to null, so only the ones you pass are emitted as --hub-skeleton-* overrides. Token-based, no Bootstrap dependency. (A skeleton is a neutral placeholder — there is no semantic colour variant; per-node sizes still come from the template DSL / presets.) The five theming tokens (--hub-skeleton-bg / -highlight / -radius / -gap / -animation-duration) are now documented in the design-token reference.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{ type: 'changed', description: 'Aligned with Angular 22.' },
						{ type: 'changed', description: 'README documentation standardized.' }
					]
				},
				{
					version: '0.1.1',
					date: '2026-06-14',
					changes: [
						{
							type: 'changed',
							description:
								'Replaced the deprecated ngStyle directive with the native [style] binding (Angular soft-deprecated ngStyle/ngClass in November 2024 in favour of native bindings, for better performance and smaller bundles).'
						}
					]
				},
				{
					version: '0.1.0',
					date: '2026-04-14',
					changes: [
						{ type: 'added', description: 'Added the initial dynamic skeleton component for Angular.' },
						{
							type: 'added',
							description: 'Added a compact Emmet-like DSL with preset composition and repeat support.'
						},
						{
							type: 'added',
							description: 'Added responsive property values, variants, and programmatic preset registration.'
						},
						{
							type: 'added',
							description:
								'Added the first preset catalogue for cards, lists, tables, forms, dashboards, and empty states.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'preset',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.SKELETON.API.INPUT.PRESET.DESCRIPTION'
				},
				{
					name: 'template',
					type: 'string | HubSkeletonTemplateDefinition | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.SKELETON.API.INPUT.TEMPLATE.DESCRIPTION'
				},
				{
					name: 'params',
					type: 'HubSkeletonParams',
					required: false,
					defaultValue: '{}',
					description: 'DOCS.SKELETON.API.INPUT.PARAMS.DESCRIPTION'
				},
				{
					name: 'variant',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.SKELETON.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'animated',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.SKELETON.API.INPUT.ANIMATED.DESCRIPTION'
				},
				{
					name: 'appearance',
					type: `'default' | 'subtle' | 'contrast'`,
					required: false,
					defaultValue: "'default'",
					description: 'DOCS.SKELETON.API.INPUT.APPEARANCE.DESCRIPTION'
				},
				{
					name: 'ariaLabel',
					type: 'string',
					required: false,
					defaultValue: "'Loading placeholder'",
					description: 'DOCS.SKELETON.API.INPUT.ARIALABEL.DESCRIPTION'
				}
			],
			outputs: [],
			templates: [
				{
					name: 'DOCS.SKELETON.API.TEMPLATE.0.NAME',
					description: 'DOCS.SKELETON.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-skeleton preset="table-row" [params]="{ columns: 4 }"></hub-skeleton>`
				},
				{
					name: 'DOCS.SKELETON.API.TEMPLATE.1.NAME',
					description: 'DOCS.SKELETON.API.TEMPLATE.1.DESCRIPTION',
					example: `<hub-skeleton template="stack(gap:12)>circle(size:40)+stack(gap:8)>line(width:42%)+line(width:72%)"></hub-skeleton>`
				},
				{
					name: 'provideHubSkeletonPresets',
					description: 'DOCS.SKELETON.API.TEMPLATE.2.DESCRIPTION',
					example: `providers: [provideHubSkeletonPresets([{ name: 'profile-card', template: 'stack(gap:16)>circle(size:72)+line(width:48%)' }])]`
				}
			],
			cssVariables: MD_CSS_VARIABLES['skeleton'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['skeleton'],
			demos: [
				{
					title: 'DOCS.SKELETON.MIXIN.DEMO.THEMING.TITLE',
					previewComponent: MixinSkeletonExampleComponent,
					code: `@use 'ng-hub-ui-skeleton/styles' as skeleton;

.skeleton-mixin-scope {
	@include skeleton.hub-skeleton-theme(
		$bg: rgba(124, 58, 237, 0.14),
		$highlight: rgba(124, 58, 237, 0.32),
		$radius: 0.75rem,
		$gap: 0.85rem
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the interactive examples and builds the
	 * grouped functionalities shown on the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
	}

	/**
	 * Registers every skeleton example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'skeleton-card-preset',
				title: 'DOCS.SKELETON.EXAMPLE.CARD_PRESET.TITLE',
				componentName: 'BasicCardSkeletonExampleComponent',
				files: ['basic-card-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/basic-card-skeleton-example.component').then(
						(m) => m.BasicCardSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-preset-catalogue',
				title: 'DOCS.SKELETON.EXAMPLE.PRESET_CATALOGUE.TITLE',
				componentName: 'PresetCatalogueSkeletonExampleComponent',
				files: ['preset-catalogue-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/preset-catalogue-skeleton-example.component').then(
						(m) => m.PresetCatalogueSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-inline-template',
				title: 'DOCS.SKELETON.EXAMPLE.INLINE_TEMPLATE.TITLE',
				componentName: 'InlineTemplateSkeletonExampleComponent',
				files: ['inline-template-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/inline-template-skeleton-example.component').then(
						(m) => m.InlineTemplateSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-compact-dsl',
				title: 'DOCS.SKELETON.EXAMPLE.COMPACT_DSL.TITLE',
				componentName: 'CompactDslSkeletonExampleComponent',
				files: ['compact-dsl-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/compact-dsl-skeleton-example.component').then(
						(m) => m.CompactDslSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-custom-preset',
				title: 'DOCS.SKELETON.EXAMPLE.CUSTOM_PRESET.TITLE',
				componentName: 'CustomPresetSkeletonExampleComponent',
				files: ['custom-preset-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/custom-preset-skeleton-example.component').then(
						(m) => m.CustomPresetSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-responsive-table',
				title: 'DOCS.SKELETON.EXAMPLE.RESPONSIVE_TABLE.TITLE',
				componentName: 'ResponsiveTableSkeletonExampleComponent',
				files: ['responsive-table-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/responsive-table-skeleton-example.component').then(
						(m) => m.ResponsiveTableSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-compact-variant',
				title: 'DOCS.SKELETON.EXAMPLE.COMPACT_VARIANT.TITLE',
				componentName: 'CompactVariantSkeletonExampleComponent',
				files: ['compact-variant-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/compact-variant-skeleton-example.component').then(
						(m) => m.CompactVariantSkeletonExampleComponent
					)
			},
			{
				id: 'skeleton-dashboard-composition',
				title: 'DOCS.SKELETON.EXAMPLE.DASHBOARD_COMPOSITION.TITLE',
				componentName: 'DashboardSkeletonExampleComponent',
				files: ['dashboard-skeleton-example.component.ts'],
				loader: () =>
					import('../examples/skeleton/dashboard-skeleton-example.component').then(
						(m) => m.DashboardSkeletonExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'skeleton'
			});
		});
	}

	/**
	 * Builds the grouped feature list, attaching a live preview component to each
	 * example so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalities(): void {
		this.skeletonLibrary.functionalities = [
			{
				title: 'DOCS.SKELETON.FEATURE.PRESET_CATALOGUE.TITLE',
				description: 'DOCS.SKELETON.FEATURE.PRESET_CATALOGUE.DESCRIPTION',
				examples: [
					this.createExample(PresetCatalogueSkeletonExampleComponent, 'skeleton-preset-catalogue'),
					this.createExample(BasicCardSkeletonExampleComponent, 'skeleton-card-preset'),
					this.createExample(DashboardSkeletonExampleComponent, 'skeleton-dashboard-composition')
				]
			},
			{
				title: 'DOCS.SKELETON.FEATURE.COMPACT_DSL_AUTHORING.TITLE',
				description: 'DOCS.SKELETON.FEATURE.COMPACT_DSL_AUTHORING.DESCRIPTION',
				examples: [
					this.createExample(CompactDslSkeletonExampleComponent, 'skeleton-compact-dsl'),
					this.createExample(InlineTemplateSkeletonExampleComponent, 'skeleton-inline-template')
				]
			},
			{
				title: 'DOCS.SKELETON.FEATURE.VARIANTS_AND_RESPONSIVE_LAYOUTS.TITLE',
				description: 'DOCS.SKELETON.FEATURE.VARIANTS_AND_RESPONSIVE_LAYOUTS.DESCRIPTION',
				examples: [
					this.createExample(CompactVariantSkeletonExampleComponent, 'skeleton-compact-variant'),
					this.createExample(ResponsiveTableSkeletonExampleComponent, 'skeleton-responsive-table')
				]
			},
			{
				title: 'DOCS.SKELETON.FEATURE.PROGRAMMATIC_REGISTRATION_AND_THEMING.TITLE',
				description: 'DOCS.SKELETON.FEATURE.PROGRAMMATIC_REGISTRATION_AND_THEMING.DESCRIPTION',
				examples: [
					this.createExample(CustomPresetSkeletonExampleComponent, 'skeleton-custom-preset'),
					this.createExample(DashboardSkeletonExampleComponent, 'skeleton-dashboard-composition')
				]
			}
		];
	}

	/**
	 * Describes an example from its class and its locale entry, producing a
	 * `FeatureExample` wired with its preview component.
	 *
	 * Nothing here constructs the component: the snippets are read off the class, which is
	 * where `ExampleViewer` reads them too, and an example that reaches for `inject()` would
	 * throw NG0203 the moment the page tried to build one.
	 *
	 * @param component Example component type whose static snippets the page prints.
	 * @param exampleId Registered example id, which resolves the localized copy.
	 * @returns Fully populated feature example descriptor.
	 */
	private createExample(
		component: Type<unknown> & { templateCode?: string; componentCode?: string },
		exampleId: string
	): FeatureExample {
		const key = `DOCS.SKELETON.EXAMPLE.${EXAMPLE_I18N_KEYS[exampleId]}`;
		return {
			title: `${key}.TITLE`,
			description: `${key}.DESCRIPTION`,
			import: `import { ${component.name} } from './${this.resolveExampleImportPath(exampleId)}';`,
			template: component.templateCode ?? '',
			component: component.componentCode ?? '',
			previewComponent: component
		};
	}

	/**
	 * Resolves the relative module path for an example id, used to render the
	 * import statement shown in the example's code snippet.
	 *
	 * @param exampleId Registered example id.
	 * @returns Relative module path of the example component.
	 */
	private resolveExampleImportPath(exampleId: string): string {
		switch (exampleId) {
			case 'skeleton-preset-catalogue':
				return 'preset-catalogue-skeleton-example.component';
			case 'skeleton-compact-dsl':
				return 'compact-dsl-skeleton-example.component';
			case 'skeleton-card-preset':
				return 'basic-card-skeleton-example.component';
			case 'skeleton-inline-template':
				return 'inline-template-skeleton-example.component';
			case 'skeleton-custom-preset':
				return 'custom-preset-skeleton-example.component';
			case 'skeleton-responsive-table':
				return 'responsive-table-skeleton-example.component';
			case 'skeleton-compact-variant':
				return 'compact-variant-skeleton-example.component';
			case 'skeleton-dashboard-composition':
				return 'dashboard-skeleton-example.component';
			default:
				return 'basic-card-skeleton-example.component';
		}
	}
}
