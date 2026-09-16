import { Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicActionSheetExampleComponent } from '../examples/action-sheet/basic-action-sheet-example.component';
import { GroupsActionSheetExampleComponent } from '../examples/action-sheet/groups-action-sheet-example.component';
import { RolesActionSheetExampleComponent } from '../examples/action-sheet/roles-action-sheet-example.component';
import { ThemingActionSheetExampleComponent } from '../examples/action-sheet/theming-action-sheet-example.component';
import { ACTION_SHEET_FUNCTIONALITIES } from './action-sheet-functionalities';

/**
 * Shape every example component satisfies: the snippets are read from the class, never from
 * an instance, because each of these examples injects `HubActionSheet` and instantiating one
 * outside an injection context throws.
 */
type ExampleType = Type<unknown> & { templateCode?: string; componentCode?: string; cssCode?: string };

/** Live preview component for each registered example id. */
const ACTION_SHEET_PREVIEW_COMPONENTS: Record<string, ExampleType> = {
	'action-sheet-basic': BasicActionSheetExampleComponent,
	'action-sheet-roles': RolesActionSheetExampleComponent,
	'action-sheet-groups': GroupsActionSheetExampleComponent,
	'action-sheet-theming': ThemingActionSheetExampleComponent
};

/** Module path of each example, used to render its import line under the feature guides. */
const ACTION_SHEET_EXAMPLE_PATHS: Record<string, string> = {
	'action-sheet-basic': 'basic-action-sheet-example.component',
	'action-sheet-roles': 'roles-action-sheet-example.component',
	'action-sheet-groups': 'groups-action-sheet-example.component',
	'action-sheet-theming': 'theming-action-sheet-example.component'
};

/**
 * Documentation page for ng-hub-ui-action-sheet.
 */
@Component({
	selector: 'app-action-sheet',
	standalone: true,
	imports: [LibraryPageComponent],
	template: `
		<app-library-page
			[library]="actionSheetLibrary"
			[package]="'action-sheet'"
			[exampleGroups]="exampleGroups"
		></app-library-page>
	`
})
export class ActionSheetComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Section headings for the examples panel, shared with the app shell navigation. */
	protected readonly exampleGroups = ACTION_SHEET_FUNCTIONALITIES;

	actionSheetLibrary: Library = {
		title: 'ng-hub-ui-action-sheet',
		description:
			'Angular action sheets opened from a service: actions with roles, grouped or flat, handlers that can refuse to close, and dismissal by backdrop, keyboard or a drag of the sheet.',
		overview: {
			text: 'An action sheet is the answer to "what can I do with this?" when there is no room for a menu: a short list of actions over the current screen, rising from the edge the thumb is nearest. This library opens it from a service, so a closed sheet costs the page nothing, and the call resolves once — with the action the reader chose, or with how they dismissed it. Roles carry the meaning: cancel is set apart wherever it was declared and is what a dismissal reports, destructive reads in the danger colour, and a handler that returns false keeps the sheet open when the work behind the action failed.',
			highlights: [
				{
					icon: 'fa-solid fa-list-check',
					title: 'DOCS.ACTION_SHEET.FEATURE.OPENING.TITLE',
					description: 'DOCS.ACTION_SHEET.FEATURE.OPENING.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-triangle-exclamation',
					title: 'DOCS.ACTION_SHEET.FEATURE.ROLES.TITLE',
					description: 'DOCS.ACTION_SHEET.FEATURE.ROLES.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'DOCS.ACTION_SHEET.FEATURE.GROUPS.TITLE',
					description: 'DOCS.ACTION_SHEET.FEATURE.GROUPS.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'DOCS.ACTION_SHEET.FEATURE.ACCESSIBILITY.TITLE',
					description: 'DOCS.ACTION_SHEET.FEATURE.ACCESSIBILITY.HIGHLIGHT'
				}
			],
			changelog: [
				{
					version: '22.2.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'deprecated',
							description:
								'`HubActionSheetComponent` is announced for removal in 23.0.0. The entry point exported it while this page said the library has no template API; the page was the true half. The class cannot be used from a template — `sheetRef` demands a `HubActionSheetRef` whose closing half is `@internal` and wired by `HubActionSheet.open()`, so a hand-mounted sheet resolves its promise and then stays on screen behind a fixed backdrop that traps `Tab` across the document. Nothing changes at runtime; this release is the notice. See `BREAKING_CHANGES.md`.'
						},
						{
							type: 'changed',
							description:
								'`public-api.ts` lists the component by name instead of re-exporting its whole file, so the symbol on its way out is named where it is exported. `HubResolvedActionSheetOptions` is unaffected and stays exported.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'A `:root` in the application now reaches the sheet. The `--hub-action-sheet-*` defaults were declared in a `:root, :host` block, and the encapsulation shim turns the `:root` half into a selector nothing matches — so what survived declared every token straight on the `<hub-action-sheet>` element, and a declaration on an element beats an inherited value whatever its specificity. Every `:root` an application wrote for this library was dead, `!important` included. Each token is now read where it is painted, `var(--hub-action-sheet-x, <default>)`, with the same component → design-system → literal chain as before. See `BREAKING_CHANGES.md`: a `:root` block that never did anything starts doing it.'
						},
						{
							type: 'fixed',
							description:
								'A `panelClass` that re-bases `--hub-action-sheet-accent` now recolours the selected action. The accent roles were derived on the host, above the element the class lands on, so the derived value was already fixed by the time the branded class changed the slot. They are derived where the colour is painted, so `:root`, `panelClass` and `variant` all recompute the selection.'
						},
						{
							type: 'changed',
							description:
								"`--hub-action-sheet-accent-emphasis` is declared on the sheet element rather than on the host. Nothing in the component paints with it — it is the accent family's third role, there for a consumer dressing the sheet — and declaring it beside the accent means a `panelClass` re-basing the slot recomputes it."
						},
						{
							type: 'changed',
							description:
								'The two READMEs and `docs/css-variables-reference.md` say why both entry points work. Setting a token on `:root` and setting it through `panelClass` were documented side by side without saying which wins, and one of the two did not work at all.'
						}
					]
				},
				{
					version: '22.0.2',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'`FUNCTIONALITIES.md`, the map every other library in the family already had, so a reader can tell a feature that only lives in a code snippet from one a live example demonstrates.'
						},
						{
							type: 'changed',
							description:
								"The configuration surface the package exports is written down: `HUB_ACTION_SHEET_CONFIG`, `HUB_ACTION_SHEET_DEFAULTS` and the `HubActionSheetConfig` interface, whose `variant` and `panelClass` settle an application's accent and sheet class once. Until now the only way to find any of it was to read the sources."
						},
						{
							type: 'changed',
							description:
								'`HubActionSheetRef.settled` is listed in the API tables. It is public and both READMEs already documented it, but the page a reader looks at first did not.'
						},
						{
							type: 'changed',
							description:
								"The page's changelog is the released one. It stopped at `22.0.0`, dated before the published `22.0.1`, and its `22.0.0` entry left out `provideHubActionSheet()` and the CSS variable theming the release notes list; a changelog that lags the registry teaches the reader not to trust it."
						},
						{
							type: 'changed',
							description:
								'Both READMEs describe a library on the stable line rather than one in its early stages, and list the family that exists today. The Spanish one also dropped its note announcing documentation pages that have been live for a week, since two READMEs that disagree are worse than one that is merely terse.'
						},
						{
							type: 'fixed',
							description:
								'`docs/css-variables-reference.md` gave `--hub-ref-space-1` a default of `0.5rem`, twice the `0.25rem` both readings of the token actually fall back to, so anyone sizing their own scale from that table was working from the wrong number. The two design-system tokens it omitted, `--hub-sys-color-surface-subtle` and `--hub-sys-color-ink`, are listed as well.'
						},
						{
							type: 'fixed',
							description:
								'The hover background of an action falls back to `#f8f9fa`, the value it is declared with, instead of an `rgba(0, 0, 0, 0.05)` literal that could never be reached and contradicted the documented default.'
						},
						{
							type: 'fixed',
							description:
								'The action with the `selected` role announces itself with `aria-current="true"` instead of `aria-checked`, which is not defined for a plain button and left the state visible only to readers who could see the sheet.'
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The `homepage` in the package manifest points at this library's own documentation page rather than at the site root. Metadata only — nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-08-30',
					changes: [
						{
							type: 'added',
							description:
								'`HubActionSheet.open()` returns a `HubActionSheetRef` whose `result` resolves once, with the role and data of the chosen action or with how the sheet was dismissed.'
						},
						{
							type: 'added',
							description:
								'Actions with roles: `cancel` is set apart at the end wherever it was declared, `destructive` reads in the danger colour, `selected` is marked, and a handler returning `false` keeps the sheet open.'
						},
						{
							type: 'added',
							description: 'Grouped actions with an optional title per block, plus header and sub-header.'
						},
						{
							type: 'added',
							description:
								'Dismissal by backdrop, `Escape` and by dragging the sheet down, each reporting its own role and running the cancel action first.'
						},
						{
							type: 'added',
							description:
								'`role="dialog"` with `aria-modal`, focus moved in on open, trapped while the sheet lives and returned to the opener on close.'
						},
						{
							type: 'added',
							description:
								'`provideHubActionSheet()` sets the defaults every sheet starts from — the four behaviour flags plus `variant` and `panelClass` — overridable per call.'
						},
						{
							type: 'added',
							description:
								'CSS variable theming through the `--hub-action-sheet-*` tokens, with the semantic accent on the single-slot contract the rest of the family uses (`variant`), and motion that steps aside under `prefers-reduced-motion`.'
						},
						{
							type: 'removed',
							description:
								'The placeholder `ActionSheet` component (selector `lib-action-sheet`) that the pre-release package shipped.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			// The sheet has no template API: it is opened from the service, and these are the
			// options that call accepts. The entry point does export `HubActionSheetComponent`,
			// which said otherwise until 22.2.0 — it is deprecated there and leaves in 23.0.0,
			// because a sheet mounted from a template cannot close itself.
			inputs: [
				{
					name: 'buttons',
					type: '(HubActionSheetButton | HubActionSheetGroup)[]',
					required: true,
					description: 'DOCS.ACTION_SHEET.API.OPTION.BUTTONS.DESCRIPTION'
				},
				{
					name: 'header',
					type: 'string',
					required: false,
					description: 'DOCS.ACTION_SHEET.API.OPTION.HEADER.DESCRIPTION'
				},
				{
					name: 'subHeader',
					type: 'string',
					required: false,
					description: 'DOCS.ACTION_SHEET.API.OPTION.SUB_HEADER.DESCRIPTION'
				},
				{
					name: 'variant',
					type: 'string',
					required: false,
					description: 'DOCS.ACTION_SHEET.API.OPTION.VARIANT.DESCRIPTION'
				},
				{
					name: 'backdropDismiss',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.ACTION_SHEET.API.OPTION.BACKDROP_DISMISS.DESCRIPTION'
				},
				{
					name: 'keyboard',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.ACTION_SHEET.API.OPTION.KEYBOARD.DESCRIPTION'
				},
				{
					name: 'swipeToClose',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.ACTION_SHEET.API.OPTION.SWIPE_TO_CLOSE.DESCRIPTION'
				},
				{
					name: 'animation',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.ACTION_SHEET.API.OPTION.ANIMATION.DESCRIPTION'
				},
				{
					name: 'panelClass',
					type: 'string | string[]',
					required: false,
					description: 'DOCS.ACTION_SHEET.API.OPTION.PANEL_CLASS.DESCRIPTION'
				},
				{
					name: 'ariaLabel',
					type: 'string',
					required: false,
					description: 'DOCS.ACTION_SHEET.API.OPTION.ARIA_LABEL.DESCRIPTION'
				}
			],
			outputs: [],
			templates: [],
			methods: [
				{
					name: 'HubActionSheet.open',
					signature: 'open<D>(options: HubActionSheetOptions<D>): HubActionSheetRef<D>',
					description: 'DOCS.ACTION_SHEET.API.METHOD.OPEN.DESCRIPTION'
				},
				{
					name: 'HubActionSheetRef.result',
					signature: 'result: Promise<HubActionSheetResult<D>>',
					description: 'DOCS.ACTION_SHEET.API.METHOD.RESULT.DESCRIPTION'
				},
				{
					name: 'HubActionSheetRef.closed$',
					signature: 'closed$: Observable<HubActionSheetResult<D>>',
					description: 'DOCS.ACTION_SHEET.API.METHOD.CLOSED.DESCRIPTION'
				},
				{
					name: 'HubActionSheetRef.dismiss',
					signature: "dismiss(role?: 'backdrop' | 'escape' | 'swipe' | string): void",
					description: 'DOCS.ACTION_SHEET.API.METHOD.DISMISS.DESCRIPTION'
				},
				{
					name: 'HubActionSheetRef.settled',
					signature: 'settled: boolean',
					description: 'DOCS.ACTION_SHEET.API.METHOD.SETTLED.DESCRIPTION'
				},
				{
					name: 'provideHubActionSheet',
					signature: 'provideHubActionSheet(config: Partial<HubActionSheetConfig>): EnvironmentProviders',
					description: 'DOCS.ACTION_SHEET.API.METHOD.PROVIDE.DESCRIPTION'
				},
				{
					name: 'HUB_ACTION_SHEET_CONFIG',
					signature: 'InjectionToken<HubActionSheetConfig>',
					description: 'DOCS.ACTION_SHEET.API.METHOD.CONFIG_TOKEN.DESCRIPTION'
				},
				{
					name: 'HUB_ACTION_SHEET_DEFAULTS',
					signature: 'HubActionSheetConfig',
					description: 'DOCS.ACTION_SHEET.API.METHOD.DEFAULTS.DESCRIPTION'
				}
			],
			cssVariables: MD_CSS_VARIABLES['action-sheet'] ?? []
		},
		styling: []
	};

	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
	}

	/**
	 * Registers every example with the shared registry so the viewer can lazy-load each one.
	 */
	private registerExamples(): void {
		this.exampleRegistry.registerAll([
			{
				id: 'action-sheet-basic',
				title: 'DOCS.ACTION_SHEET.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicActionSheetExampleComponent',
				packagePath: 'action-sheet',
				files: ['basic-action-sheet-example.component.ts'],
				loader: () =>
					import('../examples/action-sheet/basic-action-sheet-example.component').then(
						(m) => m.BasicActionSheetExampleComponent
					)
			},
			{
				id: 'action-sheet-roles',
				title: 'DOCS.ACTION_SHEET.EXAMPLE.ROLES.TITLE',
				componentName: 'RolesActionSheetExampleComponent',
				packagePath: 'action-sheet',
				files: ['roles-action-sheet-example.component.ts'],
				loader: () =>
					import('../examples/action-sheet/roles-action-sheet-example.component').then(
						(m) => m.RolesActionSheetExampleComponent
					)
			},
			{
				id: 'action-sheet-groups',
				title: 'DOCS.ACTION_SHEET.EXAMPLE.GROUPS.TITLE',
				componentName: 'GroupsActionSheetExampleComponent',
				packagePath: 'action-sheet',
				files: ['groups-action-sheet-example.component.ts'],
				loader: () =>
					import('../examples/action-sheet/groups-action-sheet-example.component').then(
						(m) => m.GroupsActionSheetExampleComponent
					)
			},
			{
				id: 'action-sheet-theming',
				title: 'DOCS.ACTION_SHEET.EXAMPLE.THEMING.TITLE',
				componentName: 'ThemingActionSheetExampleComponent',
				packagePath: 'action-sheet',
				files: ['theming-action-sheet-example.component.ts'],
				loader: () =>
					import('../examples/action-sheet/theming-action-sheet-example.component').then(
						(m) => m.ThemingActionSheetExampleComponent
					)
			}
		]);
	}

	/** Builds the feature guides from the registry, keeping ids the single source of truth. */
	private populateFunctionalities(): void {
		this.actionSheetLibrary.functionalities = ACTION_SHEET_FUNCTIONALITIES.map((group) => ({
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
	 * @param exampleId Registered example id.
	 * @returns Populated feature example, or null when the id is not registered.
	 */
	private createExample(exampleId: string): FeatureExample | null {
		const registered = this.exampleRegistry.get(exampleId);
		const component = ACTION_SHEET_PREVIEW_COMPONENTS[exampleId];

		if (!registered || !component) {
			return null;
		}

		return {
			title: registered.title,
			description: `DOCS.ACTION_SHEET.EXAMPLE.${this.descriptionKeySegment(exampleId)}.DESCRIPTION`,
			// The registered name, not `component.name`: the runtime one carries whatever the
			// bundler did to the class — a leading underscore in development, a single letter
			// in production — and the import line is meant to be copied.
			import: `import { ${registered.componentName} } from './${ACTION_SHEET_EXAMPLE_PATHS[exampleId]}';`,
			template: component.templateCode ?? '',
			component: component.componentCode ?? '',
			styles: component.cssCode,
			previewComponent: component
		};
	}

	/**
	 * Converts a registered example id into the SCREAMING_SNAKE_CASE segment its i18n keys use,
	 * so the id stays the single source of truth for both.
	 */
	private descriptionKeySegment(exampleId: string): string {
		return exampleId
			.replace(/^action-sheet-/, '')
			.replace(/-/g, '_')
			.toUpperCase();
	}
}
