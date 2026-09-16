import { Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { InteractiveInstallerExampleComponent } from '../examples/installer/interactive-installer-example.component';
import { NonInteractiveInstallerExampleComponent } from '../examples/installer/non-interactive-installer-example.component';
import { ResolvedDependenciesInstallerExampleComponent } from '../examples/installer/resolved-dependencies-installer-example.component';
import { INSTALLER_FUNCTIONALITIES } from './installer-functionalities';

/** Live preview component for each registered example id. */
const INSTALLER_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'installer-interactive': InteractiveInstallerExampleComponent,
	'installer-non-interactive': NonInteractiveInstallerExampleComponent,
	'installer-resolved-dependencies': ResolvedDependenciesInstallerExampleComponent
};

/**
 * Documentation page for `ng-hub-ui`, the family installer.
 *
 * It is the only published package of the family that ships no components, and the page is
 * shaped by that rather than by the template every other library page fills in. There is no
 * API tab and no Styles tab: a schematic has no inputs, no outputs, no template slots and no
 * custom properties, and the route table gives it Overview and Examples only, so the reader
 * is never sent to a heading with nothing under it. What the schematic accepts — the two
 * flags and the identifiers — is documented where the commands are, in the feature guides
 * and the examples, and exhaustively in the package README.
 */
@Component({
	selector: 'app-installer',
	standalone: true,
	imports: [LibraryPageComponent],
	template: `
		<app-library-page
			[library]="installerLibrary"
			[package]="'installer'"
			[install]="'ng add ng-hub-ui'"
			[exampleGroups]="exampleGroups"
		></app-library-page>
	`
})
export class InstallerComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Section headings for the examples panel, shared with the app shell navigation. */
	protected readonly exampleGroups = INSTALLER_FUNCTIONALITIES;

	/**
	 * Complete installer documentation payload.
	 *
	 * `api` and `styling` stay empty on purpose and are never rendered: the page has no API
	 * or Styles route. See the class comment.
	 */
	installerLibrary: Library = {
		title: 'ng-hub-ui',
		description:
			'The ng-hub-ui family installer: one `ng add` command that asks which libraries you want, resolves the packages each of them needs, and writes them into your manifest.',
		overview: {
			text: '`ng-hub-ui` is the umbrella package of the family, and the only one that ships no components. What it ships is an `ng add` schematic: it offers the 25 catalogued libraries in a multi-select prompt, or takes the identifiers straight from a `--libraries` flag, and resolves each selection into the npm packages it actually needs — including the peers a library depends on and the one external package (`sortablejs`) that is not ours. The resolved list is written into `dependencies` at the workspace root, never overwriting a key that is already there, and then handed to whichever package manager the Angular CLI detects. Its scope stops at dependency wiring: it does not touch `angular.json`, register providers, import components or add stylesheet entries.',
			highlights: [
				{
					icon: 'fa-solid fa-terminal',
					title: 'DOCS.INSTALLER.FEATURE.ONE_COMMAND.TITLE',
					description: 'DOCS.INSTALLER.FEATURE.ONE_COMMAND.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'DOCS.INSTALLER.FEATURE.SCRIPTABLE.TITLE',
					description: 'DOCS.INSTALLER.FEATURE.SCRIPTABLE.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-diagram-project',
					title: 'DOCS.INSTALLER.FEATURE.RESOLVED_DEPENDENCIES.TITLE',
					description: 'DOCS.INSTALLER.FEATURE.RESOLVED_DEPENDENCIES.HIGHLIGHT'
				}
			],
			changelog: [
				{
					version: '0.2.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Four documents said the installer has no page on the documentation site. This is that page: both READMEs and `FUNCTIONALITIES.md` link to it instead of denying it.'
						},
						{
							type: 'changed',
							description:
								'The manifest `homepage` points at this page rather than at the family root — it is the link a registry shows beside the package, and every other library in the family already points at its own documentation. Metadata only: no code, no schematic behaviour, no catalogue change.'
						}
					]
				},
				{
					version: '0.2.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'Every one of the 25 catalogue ranges now floors at or above the highest peer the family declares on it. `ng-hub-ui-forms` had reached 22.32.0 peering on `ng-hub-ui-utils >=22.12.0` while the catalogue still offered `utils ^22.8.1`, so `ng add ng-hub-ui --libraries=forms` wrote a pair npm cannot satisfy — invisible on a fresh unpinned install, an `ERESOLVE` anywhere resolution was already fixed.'
						},
						{
							type: 'fixed',
							description:
								'Both READMEs denied a library the installer has offered since 0.1.6: they said `ng-hub-ui-action-sheet` was not on npm, in five separate places, while the catalogue had carried it all along.'
						},
						{
							type: 'changed',
							description:
								'The Angular peer range is `>=18.0.0`, up from `>=17.3.0`. Nothing in the catalogue targets Angular 17, so the old floor let `ng add ng-hub-ui` run, write the manifest and only then fail to resolve. See `BREAKING_CHANGES.md`.'
						},
						{
							type: 'added',
							description:
								'The schematic has a tracked spec again. The only test over `ng add` lived beside the compiled output where `.gitignore` excludes it, so it left the repository the moment it was written; run today it reported three failures it had been reporting for months.'
						}
					]
				},
				{
					version: '0.1.7',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								'The manifest `homepage` points at the localized site root rather than the redirect above it, so a reader arriving from npm lands one hop earlier.'
						}
					]
				},
				{
					version: '0.1.6',
					date: '2026-08-30',
					changes: [
						{
							type: 'added',
							description:
								'`action-sheet` joins the catalogue and the prompt: `ng-hub-ui-action-sheet` reached the registry with 22.0.0, and it needs no co-installs.'
						}
					]
				}
			]
		},
		functionalities: [],
		// A schematic has no component surface. The page has no API route, so nothing here is
		// ever rendered; the two flags are documented in the feature guides and the examples.
		api: { inputs: [], outputs: [], templates: [], cssVariables: [] },
		styling: []
	};

	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
	}

	/** Registers the page's examples with the shared registry, one lazily-loaded entry each. */
	private registerExamples(): void {
		const examples = [
			{
				id: 'installer-interactive',
				title: 'DOCS.INSTALLER.EXAMPLE.INTERACTIVE.TITLE',
				componentName: 'InteractiveInstallerExampleComponent',
				files: ['interactive-installer-example.component.ts'],
				sourceCode: InteractiveInstallerExampleComponent.sourceCode,
				loader: () =>
					import('../examples/installer/interactive-installer-example.component').then(
						(m) => m.InteractiveInstallerExampleComponent
					)
			},
			{
				id: 'installer-non-interactive',
				title: 'DOCS.INSTALLER.EXAMPLE.NON_INTERACTIVE.TITLE',
				componentName: 'NonInteractiveInstallerExampleComponent',
				files: ['non-interactive-installer-example.component.ts'],
				sourceCode: NonInteractiveInstallerExampleComponent.sourceCode,
				loader: () =>
					import('../examples/installer/non-interactive-installer-example.component').then(
						(m) => m.NonInteractiveInstallerExampleComponent
					)
			},
			{
				id: 'installer-resolved-dependencies',
				title: 'DOCS.INSTALLER.EXAMPLE.RESOLVED_DEPENDENCIES.TITLE',
				componentName: 'ResolvedDependenciesInstallerExampleComponent',
				files: ['resolved-dependencies-installer-example.component.ts'],
				sourceCode: ResolvedDependenciesInstallerExampleComponent.sourceCode,
				loader: () =>
					import('../examples/installer/resolved-dependencies-installer-example.component').then(
						(m) => m.ResolvedDependenciesInstallerExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'installer'
			});
		});
	}

	/**
	 * Builds the grouped feature list, attaching a live preview to each example so the Overview
	 * "Feature guides" section renders the transcripts inline.
	 */
	private populateFunctionalities(): void {
		this.installerLibrary.functionalities = INSTALLER_FUNCTIONALITIES.map((group) => ({
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
	 * `import`, `template` and `component` stay empty: they are rendered as a TypeScript import
	 * line, an HTML block and a component class, and none of the three describes a shell
	 * command. The commands themselves are inside the preview, and the Examples tab shows them
	 * again as copyable shell and JSON.
	 *
	 * @param exampleId Registered example id.
	 * @returns Populated feature example, or null when the id is not registered.
	 */
	private createExample(exampleId: string): FeatureExample | null {
		const registered = this.exampleRegistry.get(exampleId);
		const component = INSTALLER_PREVIEW_COMPONENTS[exampleId];

		if (!registered || !component) {
			return null;
		}

		return {
			title: registered.title,
			description: `DOCS.INSTALLER.EXAMPLE.${this.descriptionKeySegment(exampleId)}.DESCRIPTION`,
			import: '',
			template: '',
			component: '',
			previewComponent: component
		};
	}

	/**
	 * Converts a registered example id into the SCREAMING_SNAKE_CASE segment its i18n keys use,
	 * so the id stays the single source of truth for both.
	 *
	 * @param exampleId Registered example id, e.g. `installer-non-interactive`.
	 * @returns Key segment, e.g. `NON_INTERACTIVE`.
	 */
	private descriptionKeySegment(exampleId: string): string {
		return exampleId
			.replace(/^installer-/, '')
			.replace(/-/g, '_')
			.toUpperCase();
	}
}
