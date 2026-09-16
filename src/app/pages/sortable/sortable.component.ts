import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { SORTABLE_PLAYGROUND } from './sortable-playground';
import { SimpleSortableComponent } from '../examples/sortable/simple-sortable/simple-sortable.component';
import { SortableFormArrayComponent } from '../examples/sortable/sortable-form-array/sortable-form-array.component';
import { SortableWithOptionsComponent } from '../examples/sortable/sortable-with-options/sortable-with-options.component';
import { MultipleListsComponent } from '../examples/sortable/multiple-lists/multiple-lists.component';
import { LayoutBuilderComponent } from '../examples/sortable/layout-builder/layout-builder.component';
import { SortableSignalComponent } from '../examples/sortable/sortable-signal/sortable-signal.component';
import { ManualSortableComponent } from '../examples/sortable/manual-sortable/manual-sortable.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const SORTABLE_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'sortable-array': SimpleSortableComponent,
	'sortable-form-array': SortableFormArrayComponent,
	'sortable-options': SortableWithOptionsComponent,
	'sortable-multiple-lists': MultipleListsComponent,
	'sortable-layout-builder': LayoutBuilderComponent,
	'sortable-signal': SortableSignalComponent,
	'sortable-manual': ManualSortableComponent
};

/**
 * Main sortable library page component.
 */
@Component({
	selector: 'app-sortable',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page [library]="sortableLibrary" [package]="'sortable'" [playground]="playgroundConfigs">
		</app-library-page>
	`
})
export class SortableComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = SORTABLE_PLAYGROUND;

	/**
	 * Complete sortable library data.
	 */
	sortableLibrary: Library = {
		title: 'ng-hub-ui-sortable',
		description:
			'Angular bindings for Sortable.js with support for arrays, FormArray, Signals, manual mode and advanced cross-list interactions.',
		overview: {
			text: 'This library exposes a lightweight directive and utility helpers to implement drag and drop sorting on top of SortableJS in Angular applications.',
			highlights: [
				{
					icon: 'fa-solid fa-sort',
					title: 'Drag-to-Reorder Lists',
					description:
						'Enable drag-and-drop reordering on any array with a single directive — pointer events and touch are both supported.'
				},
				{
					icon: 'fa-solid fa-file-code',
					title: 'Form Array Integration',
					description:
						'Binds directly to Angular Reactive Forms FormArray so the form value always reflects the current sort order.'
				},
				{
					icon: 'fa-solid fa-arrows-up-down',
					title: 'Vertical & Horizontal Axes',
					description:
						'Restrict dragging to a single axis or allow free two-dimensional movement to build grids and kanban-style lists.'
				},
				{
					icon: 'fa-solid fa-grip-lines',
					title: 'Drag Handle Support',
					description:
						'Add a dedicated drag handle element so only a specific part of the item initiates the drag — the rest remains interactive.'
				},
				{
					icon: 'fa-solid fa-arrows-left-right',
					title: 'Cross-List Sorting',
					description:
						'Transfer items between connected sortable lists and receive typed transfer events with source and target context.'
				},
				{
					icon: 'fa-solid fa-wave-square',
					title: 'Signals & FormArray',
					description:
						'Bind a writable signal or a reactive FormArray and let the directive keep your state in sync after every drag.'
				},
				{
					icon: 'fa-solid fa-sliders',
					title: 'Manual Control Mode',
					description:
						'Disable automatic updates and apply changes yourself with the moveItemInArray, transferArrayItem and copyArrayItem helpers.'
				}
			],
			changelog: [
				{
					version: '22.2.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'The list can be reordered from the keyboard. SortableJS binds mousedown and touchstart and nothing else, so until now hubSortable simply did not work for anyone who does not drag. Each item, or its handle when one is configured, is now a tab stop, and from there the interaction is the grab / move / drop model of the WAI-ARIA authoring practices: Enter or Space picks the item up, the arrows move it, Home and End send it to either end, Enter or Space drops it and Escape puts it back. Every step is announced through a polite live region. Reordering this way obeys the same rules a drag does: off while disabled is true or sort is false, honouring autoUpdateArray, and emitting the same update and sortEvent with both indexes filled in.'
						},
						{
							type: 'added',
							description:
								'keyboardSorting turns that path off for an application that already ships its own, and keyboardMessages translates what is announced. The sentences are functions rather than templates with placeholders, so a language whose word order differs is not forced through an English shape.'
						},
						{
							type: 'added',
							description:
								'SortableBindings and SortableBinding are exported. SortableBindings keeps several parallel arrays in step through one drag, and [hubSortable] has always accepted an instance in place of an array, but it was never listed in public-api.ts: nobody outside the package could construct one or type a field holding one. Both READMEs gained the connected-lists section that explains what to do with it.'
						},
						{
							type: 'changed',
							description:
								'BREAKING. SortableData is a list type instead of any. It was written any | any[] | WritableSignal<any[]>, and a union containing any is any, so the published type accepted a number, a string or a plain object without a word from the compiler. It is now T[] | WritableSignal<T[]> | SortableFormArrayLike<T>, with T defaulting to unknown. Nothing changes at runtime; see BREAKING_CHANGES.md for what stops compiling and what to write instead.'
						}
					]
				},
				{
					version: '22.1.4',
					date: '2026-09-06',
					changes: [
						{
							type: 'changed',
							description:
								"The library no longer writes into the consuming application's console. Eight guard rails, the out-of-range check in moveItemInArray, the three in transferArrayItem, the three in copyArrayItem and the directive's container lookup, used to report invalid input with console.warn or console.error. A dependency has no standing to put noise in an application's console, least of all in a production build, and the message was addressed to whoever wrote the call rather than to whoever runs the app. Every guard keeps the behaviour it always had: the call is a no-op and the arrays are left untouched. A container selector that matches nothing likewise leaves the directive inert, now without a message, so audit those selectors (see MIGRATION.md, 5.6) instead of waiting for the console to point at them."
						},
						{
							type: 'fixed',
							description:
								"The directive's JSDoc examples teach the @for block rather than *ngFor. Those snippets ship in the published typings, so they are what a consumer's editor shows on hover over hubSortable, and they contradicted the README's Quick Start, leaving the reader to work out which surface of the same library to believe. Each @for sits on the line that opens the host element on purpose, because TypeScript reads a line-initial @for inside a JSDoc comment as a tag and splits the example in two."
						}
					]
				},
				{
					version: '22.1.3',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root, and eleven keywords were added covering the vocabulary someone actually searches with when they do not already know this package's name: dnd, drag-drop, reorder, reorderable, sortable-list, list, formarray, component, reusable, ui-library. Metadata only — no code, no types, no styles change, and nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.1.2',
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
					version: '22.1.1',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'Documented the pointer-only accessibility limitation of SortableJS drag-and-drop and the recommended keyboard alternative (move up/down controls on the same array).'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								'`provideSortable()` standalone provider function to register global SortableJS options without `SortableModule`.'
						},
						{
							type: 'added',
							description:
								'Public type exports for the directive payloads (`SortableData`, `SortableEventName`, `SortableMoveEventPayload`).'
						},
						{
							type: 'deprecated',
							description:
								'`SortableModule` and `SortableModule.forRoot()` — import the standalone `SortableDirective` and use `provideSortable()` instead.'
						},
						{
							type: 'changed',
							description:
								'Aligned package scaffolding and documentation with the rest of the ng-hub-ui ecosystem.'
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
								'Rebranded the package and standardized its metadata and README to match the ng-hub-ui family. The version was cut in the repository but never published to npm: the registry goes straight from 21.3.0 to 22.1.0, which is where the rebranding reached consumers.'
						}
					]
				},
				{
					version: '21.3.0',
					date: '2026-03-31',
					changes: [
						{
							type: 'added',
							description:
								'Improved binding support for writable signals and FormArrays, plus comprehensive test coverage for the directive.'
						}
					]
				},
				{
					version: '21.2.0',
					date: '2026-02-10',
					changes: [
						{
							type: 'added',
							description:
								'The SortableJS types are re-exported from the library root — `Sortable`, `SortableEvent`, `Options`, `MoveEvent`, `GroupOptions`, `PullResult` and `PutResult` — so typing a handler no longer means importing from two packages.'
						},
						{
							type: 'changed',
							description:
								'`sortablejs` moved from peer dependencies to dependencies, so it installs with this package instead of being one more thing to remember.'
						}
					]
				},
				{
					version: '21.1.1',
					date: '2026-02-10',
					changes: [
						{
							type: 'fixed',
							description:
								'`update` and `add` emit once per drop in manual mode. SortableJS calls its own handlers more than once when the DOM is rearranged inside them, and those extra emissions used to reach the consumer.'
						},
						{
							type: 'fixed',
							description:
								"The DOM and the bound array no longer disagree in manual mode: the directive reverts SortableJS's move so Angular renders from the array it was actually given."
						},
						{
							type: 'fixed',
							description:
								'Native SortableJS CustomEvents are suppressed at the container, so a template listener no longer fires twice for a single drop.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-02-09',
					changes: [
						{
							type: 'added',
							description:
								'Manual control mode via the `autoUpdateArray` input (default `true`); set it to `false` and the directive stops mutating the bound array and only reports what happened, which is what validation, persistence, undo and immutable state all need.'
						},
						{
							type: 'added',
							description:
								'Array helper functions `moveItemInArray`, `transferArrayItem` and `copyArrayItem`, so manual mode does not mean rewriting index arithmetic in every application.'
						},
						{
							type: 'added',
							description:
								'An events guide and a manual-control example covering a single list and a Kanban board.'
						}
					]
				},
				{
					version: '21.0.1',
					date: '2025-12-12',
					changes: [
						{
							type: 'added',
							description: 'A README inside the package. The npm page had been blank since the first release.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2025-12-12',
					changes: [
						{
							type: 'added',
							description:
								'Writable signal support in the sortable bindings, alongside arrays and FormArrays, with hardened detection so neither shape trips TypeScript.'
						}
					]
				},
				{
					version: '20.0.0',
					date: '2025-12-10',
					changes: [
						{
							type: 'added',
							description:
								'First version published as `ng-hub-ui-sortable`, with the groundwork for Angular 20 compatibility. Everything the registry serves under this name starts here.'
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
			cssVariables: []
		},
		styling: []
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities and API sections of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
		this.populateApi();
	}

	/**
	 * Registers every sortable example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'sortable-array',
				title: 'DOCS.SORTABLE.EXAMPLE.ARRAY.TITLE',
				componentName: 'SimpleSortableComponent',
				files: ['simple-sortable.component.ts'],
				loader: () =>
					import('../examples/sortable/simple-sortable/simple-sortable.component').then(
						(m) => m.SimpleSortableComponent
					)
			},
			{
				id: 'sortable-form-array',
				title: 'DOCS.SORTABLE.EXAMPLE.FORM_ARRAY.TITLE',
				componentName: 'SortableFormArrayComponent',
				files: ['sortable-form-array.component.ts'],
				loader: () =>
					import('../examples/sortable/sortable-form-array/sortable-form-array.component').then(
						(m) => m.SortableFormArrayComponent
					)
			},
			{
				id: 'sortable-options',
				title: 'DOCS.SORTABLE.EXAMPLE.OPTIONS.TITLE',
				componentName: 'SortableWithOptionsComponent',
				files: ['sortable-with-options.component.ts'],
				loader: () =>
					import('../examples/sortable/sortable-with-options/sortable-with-options.component').then(
						(m) => m.SortableWithOptionsComponent
					)
			},
			{
				id: 'sortable-multiple-lists',
				title: 'DOCS.SORTABLE.EXAMPLE.MULTIPLE_LISTS.TITLE',
				componentName: 'MultipleListsComponent',
				files: ['multiple-lists.component.ts'],
				loader: () =>
					import('../examples/sortable/multiple-lists/multiple-lists.component').then((m) => m.MultipleListsComponent)
			},
			{
				id: 'sortable-layout-builder',
				title: 'DOCS.SORTABLE.EXAMPLE.LAYOUT_BUILDER.TITLE',
				componentName: 'LayoutBuilderComponent',
				files: ['layout-builder.component.ts', 'layout-builder.component.html', 'layout-builder.component.scss'],
				loader: () =>
					import('../examples/sortable/layout-builder/layout-builder.component').then((m) => m.LayoutBuilderComponent)
			},
			{
				id: 'sortable-signal',
				title: 'DOCS.SORTABLE.EXAMPLE.SIGNAL.TITLE',
				componentName: 'SortableSignalComponent',
				files: ['sortable-signal.component.ts'],
				loader: () =>
					import('../examples/sortable/sortable-signal/sortable-signal.component').then(
						(m) => m.SortableSignalComponent
					)
			},
			{
				id: 'sortable-manual',
				title: 'DOCS.SORTABLE.EXAMPLE.MANUAL.TITLE',
				componentName: 'ManualSortableComponent',
				files: ['manual-sortable.component.ts', 'manual-sortable.component.html', 'manual-sortable.component.css'],
				loader: () =>
					import('../examples/sortable/manual-sortable/manual-sortable.component').then(
						(m) => m.ManualSortableComponent
					)
			}
		];

		examples.forEach((example) => {
			this._exampleRegistry.register({
				...example,
				packagePath: 'sortable'
			});
		});
	}

	/**
	 * Populates the functionalities section.
	 */
	private populateFunctionalities(): void {
		const groups = [
			{
				title: 'DOCS.SORTABLE.FEATURE.CORE_USAGE.TITLE',
				description: 'DOCS.SORTABLE.FEATURE.CORE_USAGE.DESCRIPTION',
				examples: [
					{ id: 'sortable-array', description: 'DOCS.SORTABLE.FEATURE.CORE_USAGE.EXAMPLE.ARRAY.DESCRIPTION' },
					{ id: 'sortable-signal', description: 'DOCS.SORTABLE.FEATURE.CORE_USAGE.EXAMPLE.SIGNAL.DESCRIPTION' }
				]
			},
			{
				title: 'DOCS.SORTABLE.FEATURE.FORMS_INTEGRATION.TITLE',
				description: 'DOCS.SORTABLE.FEATURE.FORMS_INTEGRATION.DESCRIPTION',
				examples: [
					{
						id: 'sortable-form-array',
						description: 'DOCS.SORTABLE.FEATURE.FORMS_INTEGRATION.EXAMPLE.FORM_ARRAY.DESCRIPTION'
					}
				]
			},
			{
				title: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.TITLE',
				description: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.DESCRIPTION',
				examples: [
					{
						id: 'sortable-options',
						description: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.EXAMPLE.OPTIONS.DESCRIPTION'
					},
					{
						id: 'sortable-multiple-lists',
						description: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.EXAMPLE.MULTIPLE_LISTS.DESCRIPTION'
					},
					{
						id: 'sortable-layout-builder',
						description: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.EXAMPLE.LAYOUT_BUILDER.DESCRIPTION'
					},
					{
						id: 'sortable-manual',
						description: 'DOCS.SORTABLE.FEATURE.ADVANCED_CONFIGURATION.EXAMPLE.MANUAL.DESCRIPTION'
					}
				]
			}
		];

		this.sortableLibrary.functionalities = groups.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.examples
				.map((entry) => {
					const item = this._exampleRegistry.get(entry.id);
					if (!item) return null;
					return {
						title: item.title,
						description: entry.description,
						import: '',
						template: '',
						component: '',
						id: item.id,
						previewComponent: SORTABLE_PREVIEW_COMPONENTS[entry.id]
					} as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}

	/**
	 * Populates the API section with the real `[hubSortable]` directive surface.
	 *
	 * Inputs are ordered in two logical blocks — the five core data-binding and
	 * control inputs first, then the thirty-two SortableJS option inputs in the
	 * order the directive declares them, which is also the order of the README
	 * table. Every one of them is listed: a reader who cannot find an option here
	 * has to open the directive source to learn whether it can be bound directly
	 * or only through the `options` object, and the answer is always "both".
	 */
	private populateApi(): void {
		this.sortableLibrary.api.inputs = [
			{
				name: 'hubSortable',
				type: 'SortableData<T> | SortableBindings',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.HUB_SORTABLE.DESCRIPTION'
			},
			{
				name: 'options',
				type: 'Options',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.OPTIONS.DESCRIPTION'
			},
			{
				name: 'autoUpdateArray',
				type: 'boolean',
				required: false,
				defaultValue: 'true',
				description: 'DOCS.SORTABLE.API.INPUT.AUTO_UPDATE_ARRAY.DESCRIPTION'
			},
			{
				name: 'cloneFunction',
				type: '(item: T) => T',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.CLONE_FUNCTION.DESCRIPTION'
			},
			{
				name: 'container',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.CONTAINER.DESCRIPTION'
			},
			{
				name: 'keyboardSorting',
				type: 'boolean',
				required: false,
				defaultValue: 'true',
				description: 'DOCS.SORTABLE.API.INPUT.KEYBOARD_SORTING.DESCRIPTION'
			},
			{
				name: 'keyboardMessages',
				type: 'Partial<SortableKeyboardMessages>',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.KEYBOARD_MESSAGES.DESCRIPTION'
			},
			{
				name: 'group',
				type: "Options['group']",
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.GROUP.DESCRIPTION'
			},
			{
				name: 'sort',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.SORT.DESCRIPTION'
			},
			{
				name: 'delay',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DELAY.DESCRIPTION'
			},
			{
				name: 'disabled',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DISABLED.DESCRIPTION'
			},
			{
				name: 'draggable',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DRAGGABLE.DESCRIPTION'
			},
			{
				name: 'handle',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.HANDLE.DESCRIPTION'
			},
			{
				name: 'animation',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.ANIMATION.DESCRIPTION'
			},
			{
				name: 'ghostClass',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.GHOST_CLASS.DESCRIPTION'
			},
			{
				name: 'chosenClass',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.CHOSEN_CLASS.DESCRIPTION'
			},
			{
				name: 'dragClass',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DRAG_CLASS.DESCRIPTION'
			},
			{
				name: 'fallbackOnBody',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FALLBACK_ON_BODY.DESCRIPTION'
			},
			{
				name: 'fallbackTolerance',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FALLBACK_TOLERANCE.DESCRIPTION'
			},
			{
				name: 'fallbackClass',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FALLBACK_CLASS.DESCRIPTION'
			},
			{
				name: 'fallbackOffset',
				type: '{ x: number; y: number }',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FALLBACK_OFFSET.DESCRIPTION'
			},
			{
				name: 'forceFallback',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FORCE_FALLBACK.DESCRIPTION'
			},
			{
				name: 'filter',
				type: 'string | ((event, target, sortable) => boolean)',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.FILTER.DESCRIPTION'
			},
			{
				name: 'preventOnFilter',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.PREVENT_ON_FILTER.DESCRIPTION'
			},
			{
				name: 'direction',
				type: "'vertical' | 'horizontal' | ((event, target, dragEl) => 'vertical' | 'horizontal')",
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DIRECTION.DESCRIPTION'
			},
			{
				name: 'swapThreshold',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.SWAP_THRESHOLD.DESCRIPTION'
			},
			{
				name: 'invertSwap',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.INVERT_SWAP.DESCRIPTION'
			},
			{
				name: 'invertedSwapThreshold',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.INVERTED_SWAP_THRESHOLD.DESCRIPTION'
			},
			{
				name: 'removeCloneOnHide',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.REMOVE_CLONE_ON_HIDE.DESCRIPTION'
			},
			{
				name: 'ignore',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.IGNORE.DESCRIPTION'
			},
			{
				name: 'touchStartThreshold',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.TOUCH_START_THRESHOLD.DESCRIPTION'
			},
			{
				name: 'emptyInsertThreshold',
				type: 'number',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.EMPTY_INSERT_THRESHOLD.DESCRIPTION'
			},
			{
				name: 'dropBubble',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DROP_BUBBLE.DESCRIPTION'
			},
			{
				name: 'dragoverBubble',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DRAGOVER_BUBBLE.DESCRIPTION'
			},
			{
				name: 'dataIdAttr',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DATA_ID_ATTR.DESCRIPTION'
			},
			{
				name: 'delayOnTouchOnly',
				type: 'boolean',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.DELAY_ON_TOUCH_ONLY.DESCRIPTION'
			},
			{
				name: 'easing',
				type: 'string',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.EASING.DESCRIPTION'
			},
			{
				name: 'setData',
				type: '(dataTransfer: DataTransfer, draggedElement: HTMLElement) => void',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.SET_DATA.DESCRIPTION'
			},
			{
				name: 'store',
				type: '{ get: (sortable: Sortable) => string[]; set: (sortable: Sortable) => void }',
				required: false,
				description: 'DOCS.SORTABLE.API.INPUT.STORE.DESCRIPTION'
			}
		];

		this.sortableLibrary.api.outputs = [
			{
				name: 'init',
				type: 'Sortable',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.INIT.DESCRIPTION'
			},
			{
				name: 'start',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.START.DESCRIPTION'
			},
			{
				name: 'end',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.END.DESCRIPTION'
			},
			{
				name: 'add',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.ADD.DESCRIPTION'
			},
			{
				name: 'update',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.UPDATE.DESCRIPTION'
			},
			{
				name: 'sortEvent',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.SORT_EVENT.DESCRIPTION'
			},
			{
				name: 'remove',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.REMOVE.DESCRIPTION'
			},
			{
				name: 'filterEvent',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.FILTER_EVENT.DESCRIPTION'
			},
			{
				name: 'change',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.CHANGE.DESCRIPTION'
			},
			{
				name: 'choose',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.CHOOSE.DESCRIPTION'
			},
			{
				name: 'unchoose',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.UNCHOOSE.DESCRIPTION'
			},
			{
				name: 'clone',
				type: 'SortableEvent',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.CLONE.DESCRIPTION'
			},
			{
				name: 'move',
				type: 'SortableMoveEventPayload',
				required: false,
				description: 'DOCS.SORTABLE.API.OUTPUT.MOVE.DESCRIPTION'
			}
		];
	}
}
