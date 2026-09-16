import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { Library } from '../../../models/interfaces';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicHistoryExampleComponent } from '../examples/history/basic-history-example.component';
import { NestedHistoryExampleComponent } from '../examples/history/nested-history-example.component';
import { ReactiveFormHistoryExampleComponent } from '../examples/history/reactive-form-history-example.component';
import { TransactionLimitsHistoryExampleComponent } from '../examples/history/transaction-limits-history-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const HISTORY_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'history-basic': BasicHistoryExampleComponent,
	'history-nested': NestedHistoryExampleComponent,
	'history-reactive-form': ReactiveFormHistoryExampleComponent,
	'history-transaction-limits': TransactionLimitsHistoryExampleComponent
};

/**
 * Main documentation page for ng-hub-ui-history.
 */
@Component({
	selector: 'app-history',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <app-library-page [library]="historyLibrary" [package]="'history'"> </app-library-page> `
})
export class HistoryComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/**
	 * Data model rendered by the shared library page layout.
	 */
	historyLibrary: Library = {
		title: 'ng-hub-ui-history',
		description:
			'Signal-based multi-object history store with undo/redo, transactions, and automatic reactive form tracking.',
		overview: {
			text: 'The history library tracks object changes as patches and exposes a simple Angular-first API for manual commits and automatic form observation without coupling to external state management libraries.',
			// Fallback only: with a SEO entry registered for this library the page reads its
			// highlight cards from SEO.LIBRARY.HISTORY.HIGHLIGHT.<n> instead. Titles reuse the
			// feature keys so a card still deep-links to its section on the fallback path, while
			// the descriptions use the one-sentence HIGHLIGHT copy — FEATURE.*.DESCRIPTION is the
			// feature-guide lede and reads as a duplicate inside a highlight card.
			highlights: [
				{
					icon: 'fa-solid fa-clock-rotate-left',
					title: 'DOCS.HISTORY.FEATURE.MANUAL_COMMITS_AND_TIME_TRAVEL.TITLE',
					description: 'DOCS.HISTORY.FEATURE.MANUAL_COMMITS_AND_TIME_TRAVEL.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-diagram-project',
					title: 'DOCS.HISTORY.FEATURE.NESTED_OBJECTS_AND_ARRAYS.TITLE',
					description: 'DOCS.HISTORY.FEATURE.NESTED_OBJECTS_AND_ARRAYS.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'DOCS.HISTORY.FEATURE.AUTOMATIC_FORM_TRACKING.TITLE',
					description: 'DOCS.HISTORY.FEATURE.AUTOMATIC_FORM_TRACKING.HIGHLIGHT'
				},
				{
					icon: 'fa-solid fa-sliders',
					title: 'DOCS.HISTORY.FEATURE.TRANSACTIONS_AND_RETENTION.TITLE',
					description: 'DOCS.HISTORY.FEATURE.TRANSACTIONS_AND_RETENTION.HIGHLIGHT'
				}
			],
			changelog: [
				{
					version: '22.0.4',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'The published manifest no longer declares a main entry. It pointed at src/public-api.ts, the ng-packagr entry file, which never travels inside the tarball, so any resolver that ignores the exports map (older bundlers, legacy Jest resolution, plain require) followed it straight to a file that is not there. Dropping the field leaves exports, module and typings as the only entry points, the shape ng-packagr emits for every other library in the monorepo.'
						},
						{
							type: 'fixed',
							description:
								'A commit that only moves a Date (or a Set, Map or RegExp) is recorded again. The default diff walked every object key by key, and those types keep their payload outside their own enumerable keys, so the comparison found nothing and produced an empty patch. An empty patch reads as no change: commit() returned false, the tracked state kept the old value that getState() and states() then handed back, and on a mixed commit undo() restored the other fields while leaving the new date in place, all without an error. Those values are now compared and replaced as a whole, which is what structuredClone already round-trips; an instance rebuilt with the same content still records no entry.'
						}
					]
				},
				{
					version: '22.0.3',
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
					version: '22.0.2',
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
					version: '22.0.1',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'Test suite for the diff/patch/clone utilities and multi-object undo/redo: cloneDeep isolation (nested structures, Dates), createDefaultDiff/applyDefaultPatch round-trips across representative shapes (nested objects, array insert/remove/reorder, key deletion, null transitions, deep nesting), estimateBytes sanity, and store-level coverage for independent per-object timelines, no-op transactions and redo invalidation after transactional commits. No runtime changes.'
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
					version: '0.1.0',
					date: '2026-06-17',
					changes: [
						{ type: 'added', description: 'Initial release with multi-object linear history.' },
						{ type: 'added', description: 'Undo/redo, transactions, and maxEntries/maxBytes retention limits.' },
						{ type: 'added', description: 'Reactive Forms auto-commit integration via watchForm().' }
					]
				}
			]
		},
		functionalities: [
			{
				title: 'DOCS.HISTORY.FEATURE.MANUAL_COMMITS_AND_TIME_TRAVEL.TITLE',
				description: 'DOCS.HISTORY.FEATURE.MANUAL_COMMITS_AND_TIME_TRAVEL.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.HISTORY.EXAMPLE.BASIC.TITLE',
						description: 'DOCS.HISTORY.EXAMPLE.BASIC.DESCRIPTION',
						import: '',
						template: '',
						component: '',
						previewComponent: HISTORY_PREVIEW_COMPONENTS['history-basic']
					}
				]
			},
			{
				title: 'DOCS.HISTORY.FEATURE.NESTED_OBJECTS_AND_ARRAYS.TITLE',
				description: 'DOCS.HISTORY.FEATURE.NESTED_OBJECTS_AND_ARRAYS.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.HISTORY.EXAMPLE.NESTED.TITLE',
						description: 'DOCS.HISTORY.EXAMPLE.NESTED.DESCRIPTION',
						import: '',
						template: '',
						component: '',
						previewComponent: HISTORY_PREVIEW_COMPONENTS['history-nested']
					}
				]
			},
			{
				title: 'DOCS.HISTORY.FEATURE.AUTOMATIC_FORM_TRACKING.TITLE',
				description: 'DOCS.HISTORY.FEATURE.AUTOMATIC_FORM_TRACKING.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.HISTORY.EXAMPLE.REACTIVE_FORM.TITLE',
						description: 'DOCS.HISTORY.EXAMPLE.REACTIVE_FORM.DESCRIPTION',
						import: '',
						template: '',
						component: '',
						previewComponent: HISTORY_PREVIEW_COMPONENTS['history-reactive-form']
					}
				]
			},
			{
				title: 'DOCS.HISTORY.FEATURE.TRANSACTIONS_AND_RETENTION.TITLE',
				description: 'DOCS.HISTORY.FEATURE.TRANSACTIONS_AND_RETENTION.DESCRIPTION',
				examples: [
					{
						title: 'DOCS.HISTORY.EXAMPLE.TRANSACTION_LIMITS.TITLE',
						description: 'DOCS.HISTORY.EXAMPLE.TRANSACTION_LIMITS.DESCRIPTION',
						import: '',
						template: '',
						component: '',
						previewComponent: HISTORY_PREVIEW_COMPONENTS['history-transaction-limits']
					}
				]
			}
		],
		api: {
			// The package exports one factory and the types around it — no component, no
			// directive, nothing bindable — so the Inputs and Outputs tables have nothing to
			// list and stay closed. Everything a consumer touches is a member of the store the
			// factory returns, which is what the methods table is for.
			inputs: [],
			outputs: [],
			methods: [
				{
					name: 'createHistoryStore',
					signature: 'createHistoryStore<T, K>(config?: HistoryStoreConfig<T, K>): HistoryStore<T, K>',
					description: 'DOCS.HISTORY.API.METHOD.CREATE_HISTORY_STORE.DESCRIPTION',
					returns: 'HistoryStore<T, K>'
				},
				{
					name: 'HistoryStore.states',
					signature: 'states: Signal<Map<K, T>>',
					description: 'DOCS.HISTORY.API.METHOD.STATES.DESCRIPTION',
					returns: 'Signal<Map<K, T>>'
				},
				{
					name: 'HistoryStore.registerObject',
					signature: 'registerObject(id: K, initialState: T): void',
					description: 'DOCS.HISTORY.API.METHOD.REGISTER_OBJECT.DESCRIPTION'
				},
				{
					name: 'HistoryStore.registerFromObject',
					signature: 'registerFromObject(initialState: T): K',
					description: 'DOCS.HISTORY.API.METHOD.REGISTER_FROM_OBJECT.DESCRIPTION',
					returns: 'K'
				},
				{
					name: 'HistoryStore.commit',
					signature: 'commit(id: K, newState: T, options?: HistoryCommitOptions): boolean',
					description: 'DOCS.HISTORY.API.METHOD.COMMIT.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.commitFromObject',
					signature: 'commitFromObject(newState: T, options?: HistoryCommitOptions): boolean',
					description: 'DOCS.HISTORY.API.METHOD.COMMIT_FROM_OBJECT.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.undo',
					signature: 'undo(id: K): boolean',
					description: 'DOCS.HISTORY.API.METHOD.UNDO.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.redo',
					signature: 'redo(id: K): boolean',
					description: 'DOCS.HISTORY.API.METHOD.REDO.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.canUndo',
					signature: 'canUndo(id: K): boolean',
					description: 'DOCS.HISTORY.API.METHOD.CAN_UNDO.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.canRedo',
					signature: 'canRedo(id: K): boolean',
					description: 'DOCS.HISTORY.API.METHOD.CAN_REDO.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.getState',
					signature: 'getState(id: K): T | undefined',
					description: 'DOCS.HISTORY.API.METHOD.GET_STATE.DESCRIPTION',
					returns: 'T | undefined'
				},
				{
					name: 'HistoryStore.history',
					signature: 'history(id: K): HistoryMetadata',
					description: 'DOCS.HISTORY.API.METHOD.HISTORY.DESCRIPTION',
					returns: 'HistoryMetadata'
				},
				{
					name: 'HistoryStore.beginTransaction',
					signature: 'beginTransaction(id: K, label?: string): void',
					description: 'DOCS.HISTORY.API.METHOD.BEGIN_TRANSACTION.DESCRIPTION'
				},
				{
					name: 'HistoryStore.endTransaction',
					signature: 'endTransaction(id: K): boolean',
					description: 'DOCS.HISTORY.API.METHOD.END_TRANSACTION.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HistoryStore.watchForm',
					signature: 'watchForm(id: K, form: FormGroup, options?: WatchFormOptions): () => void',
					description: 'DOCS.HISTORY.API.METHOD.WATCH_FORM.DESCRIPTION',
					returns: '() => void'
				},
				{
					name: 'HistoryStore.clearHistory',
					signature: 'clearHistory(id: K): void',
					description: 'DOCS.HISTORY.API.METHOD.CLEAR_HISTORY.DESCRIPTION'
				}
			],
			templates: [],
			cssVariables: []
		},
		styling: []
	};

	/**
	 * Angular lifecycle hook. Registers the interactive examples for the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
	}

	/**
	 * Registers example components displayed by the shared example viewer.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'history-basic',
				title: 'DOCS.HISTORY.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicHistoryExampleComponent',
				files: ['basic-history-example.component.ts'],
				loader: () =>
					import('../examples/history/basic-history-example.component').then((m) => m.BasicHistoryExampleComponent)
			},
			{
				id: 'history-nested',
				title: 'DOCS.HISTORY.EXAMPLE.NESTED.TITLE',
				componentName: 'NestedHistoryExampleComponent',
				files: ['nested-history-example.component.ts'],
				loader: () =>
					import('../examples/history/nested-history-example.component').then((m) => m.NestedHistoryExampleComponent)
			},
			{
				id: 'history-reactive-form',
				title: 'DOCS.HISTORY.EXAMPLE.REACTIVE_FORM.TITLE',
				componentName: 'ReactiveFormHistoryExampleComponent',
				files: ['reactive-form-history-example.component.ts'],
				loader: () =>
					import('../examples/history/reactive-form-history-example.component').then(
						(m) => m.ReactiveFormHistoryExampleComponent
					)
			},
			{
				id: 'history-transaction-limits',
				title: 'DOCS.HISTORY.EXAMPLE.TRANSACTION_LIMITS.TITLE',
				componentName: 'TransactionLimitsHistoryExampleComponent',
				files: ['transaction-limits-history-example.component.ts'],
				loader: () =>
					import('../examples/history/transaction-limits-history-example.component').then(
						(m) => m.TransactionLimitsHistoryExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'history'
			});
		});
	}
}
