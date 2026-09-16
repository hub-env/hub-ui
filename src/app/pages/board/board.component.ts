import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicBoardExampleComponent } from '../examples/board/basic-board-example.component';
import { MixinBoardExampleComponent } from '../examples/board/mixin-board-example.component';
import { CardDragDropExampleComponent } from '../examples/board/card-drag-drop-example.component';
import { ColumnReorderingExampleComponent } from '../examples/board/column-reordering-example.component';
import { CardClickExampleComponent } from '../examples/board/card-click-example.component';
import { InfiniteScrollExampleComponent } from '../examples/board/infinite-scroll-example.component';
import { CustomCardTemplateExampleComponent } from '../examples/board/custom-card-template-example.component';
import { CustomHeaderTemplateExampleComponent } from '../examples/board/custom-header-template-example.component';
import { CustomFooterTemplateExampleComponent } from '../examples/board/custom-footer-template-example.component';
import { DisableSortingExampleComponent } from '../examples/board/disable-sorting-example.component';
import { DragBehaviorExampleComponent } from '../examples/board/drag-behavior-example.component';
import { StylingBoardExampleComponent } from '../examples/board/styling-board-example.component';
import { CardPlaceholderExampleComponent } from '../examples/board/card-placeholder-example.component';
import { ColumnPlaceholderExampleComponent } from '../examples/board/column-placeholder-example.component';
import { DragPreviewExampleComponent } from '../examples/board/drag-preview-example.component';
import { EventsBoardExampleComponent } from '../examples/board/events-board-example.component';
import { KeyboardAccessibilityBoardExampleComponent } from '../examples/board/keyboard-accessibility-example.component';
import { BOARD_PLAYGROUND } from './board-playground';
import { BOARD_EXAMPLE_GROUPS } from './board-example-groups';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const BOARD_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'board-basic': BasicBoardExampleComponent,
	'board-card-drag-drop': CardDragDropExampleComponent,
	'board-column-reordering': ColumnReorderingExampleComponent,
	'board-card-click': CardClickExampleComponent,
	'board-infinite-scroll': InfiniteScrollExampleComponent,
	'board-custom-card-template': CustomCardTemplateExampleComponent,
	'board-custom-header-template': CustomHeaderTemplateExampleComponent,
	'board-custom-footer-template': CustomFooterTemplateExampleComponent,
	'board-disable-sorting': DisableSortingExampleComponent,
	'board-drag-behavior': DragBehaviorExampleComponent,
	'board-styling-customization': StylingBoardExampleComponent,
	'board-card-placeholder': CardPlaceholderExampleComponent,
	'board-column-placeholder': ColumnPlaceholderExampleComponent,
	'board-drag-preview': DragPreviewExampleComponent,
	'board-events': EventsBoardExampleComponent,
	'board-keyboard-accessibility': KeyboardAccessibilityBoardExampleComponent
};

/**
 * Main board library page component
 */
@Component({
	selector: 'app-board',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="boardLibrary"
			[package]="'board'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		>
		</app-library-page>
	`
})
export class BoardComponent implements OnInit {
	protected readonly exampleGroups = BOARD_EXAMPLE_GROUPS;

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = BOARD_PLAYGROUND;

	/**
	 * Example components instances for collecting data
	 */

	/**
	 * Styling example components instances for collecting styling data
	 */
	/**
	 * Styling example components instances for collecting styling data
	 */
	private stylingComponents: FeatureExample[] = [];

	/**
	 * Complete board library data
	 */
	boardLibrary: Library = {
		title: 'ng-hub-ui-board',
		description:
			'A flexible and powerful board component for Angular applications, perfect for implementation of Kanban-style boards.',
		overview: {
			text: 'This component provides a complete solution for Kanban boards on a native drag-and-drop core, with no Angular CDK dependency.',
			highlights: [
				{
					icon: 'fa-solid fa-arrows-up-down-left-right',
					title: 'Drag & Drop Between Columns',
					description:
						'Move cards freely between any columns with smooth pointer-based drag-and-drop built on the shared ng-hub-ui-utils core.'
				},
				{
					icon: 'fa-solid fa-table-columns',
					title: 'Dynamic Column Management',
					description:
						'Add, remove, and reorder columns at runtime — ideal for configurable Kanban and project-management interfaces.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Custom Card Templates',
					description:
						'Project any Angular component or template as a card so your board renders rich, interactive task representations.'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'Signals-Based Reactivity',
					description:
						'Column and card state are tracked with Angular Signals for minimal re-rendering and OnPush-compatible performance.'
				},
				{
					icon: 'fa-solid fa-lock',
					title: 'Locked & Read-Only Columns',
					description:
						'Mark individual columns as non-droppable or entirely read-only to enforce workflow rules within the board.'
				},
				{
					icon: 'fa-solid fa-arrow-down-wide-short',
					title: 'Sortable Within Columns',
					description:
						'Cards within a column can be freely reordered via drag-and-drop with full positional event emission.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Column headers, card surfaces, drag shadows, and borders are all driven by CSS custom properties.'
				}
			],
			changelog: [
				{
					version: '22.6.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING \u2014 the module and the seven template directives are renamed with the Hub prefix: BoardModule becomes HubBoardModule, and CardTemplateDirective, BoardColumnHeaderDirective, BoardColumnFooterDirective, CardPlaceholderDirective, ColumnPlaceholderDirective, CardDragPreviewDirective and ColumnDragPreviewDirective gain the same prefix. CardTemplateDirective is a name any application with cards in it will want, and an unprefixed export claims it inside the consumer\u2019s namespace rather than the library\u2019s. HubBoardComponent already carried the prefix, so the component and the directives that exist only to feed it were spelled two ways in one import list. The selectors are untouched, so no markup changes. All eight old names stay exported as deprecated aliases resolving to the same classes and are removed in 23.0.0. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'BREAKING \u2014 the colour pipe is HubBoardInvertColorPipe, and answers to hubBoardInvertColor in a template. A pipe\u2019s template name is the one part a consumer cannot rename around, and invertColor took an unprefixed name in the application\u2019s own template namespace. The prefix alone would not have been enough, since ng-hub-ui-forms already publishes HubInvertColorPipe under hubInvertColor, so the library\u2019s name goes in the middle. InvertColorPipe survives as a deprecated subclass still answering to invertColor and is removed in 23.0.0, so migrating means changing the template as well as the import. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency, >=22.0.0. The stylesheet has themed against --hub-sys-* for several releases, every read already carrying its own fallback, and the manifest never said so: nothing warned that a ng-hub-ui-ds older than the --hub-ref-* / --hub-sys-* architecture would leave the board on those fallbacks, and a reader of the manifest had no way to learn that the token package is what turns the theme on. No code, types or styles change.'
						},
						{
							type: 'fixed',
							description:
								'Both READMEs name the classes that ship. Every import block, every section heading and the legacy-module snippet still used the old names, so a reader copying the documented import wrote code that compiles only against the deprecated aliases, which is precisely the audience this rename exists to move.'
						}
					]
				},
				{
					version: '22.5.2',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'The columns are now the items of the board list. role="list" sat on the host, but its children were two role-less wrappers, the hidden keyboard hint and the live region, so the required-owned-elements chain broke and a screen reader read the board as a list with no items. The list now lives on the columns track, each column container is its listitem, and the column group semantics (role="group", its aria-label and its stable id) moved onto the column itself, which leaves the hint and the announcer outside the list. The host keeps its aria-label and becomes a region, so boardLabel still names the board and a screen-reader user can reach it without the consumer adding a heading of their own.'
						},
						{
							type: 'fixed',
							description:
								'BoardModule now exports CardDragPreviewDirective and ColumnDragPreviewDirective. Both are public API and both are documented in the README with no caveat, but neither was in the module, so a consumer who took the documented Module Import (Legacy) route got an <ng-template cardDragPreview> that matched no directive. Nothing failed out loud: the template was simply ignored and the default preview rendered, which is the worst way for an option to not work.'
						},
						{
							type: 'fixed',
							description:
								'The documentation now describes the component that ships. Both READMEs promised things the code does not do and hid things it does: a CC BY 4.0 licence that the 22.5.0 relicense had already replaced with MIT, a @use of a stylesheet removed in 21.1.0, a card template bound to let-card="card" when the context key is item (so the snippet rendered an empty card), board typed as Signal<Board> when the input takes a plain Board, a primary default on a variant that has none, EventEmitter where the outputs are output(), a BoardColumn block missing the very predicate the keyboard section relies on, and a virtual scrolling feature that is only end-of-column detection. Each one is a reader copying a line that fails to compile or silently renders nothing.'
						},
						{
							type: 'fixed',
							description:
								'FUNCTIONALITIES.md no longer lists a configurable scroll-detection padding. It is a private constant, not an input, so the row promised an API that has never existed.'
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
								"The package homepage now points at this library's own documentation page instead of the site root, so the link a registry shows beside the package lands on the reference the reader was already looking for. Metadata only."
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'changed',
							description:
								'Relicensed from CC-BY-4.0 to MIT. CC licences are not meant for software: no patent grant, no source-distribution terms and an attribution requirement with no defined meaning for code that ends up inside a bundle. MIT grants strictly more, so nobody who took an earlier version loses anything.'
						}
					]
				},
				{
					version: '22.4.1',
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
					version: '22.4.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'ARIA list semantics: the board host is role="list" named by the new boardLabel input, each column is a labelled role="group", each column body a role="list" and each card a role="listitem".'
						},
						{
							type: 'added',
							description:
								'Keyboard card reorder: Space/Enter grabs a focused card, ArrowUp/ArrowDown move it within its column and ArrowLeft/ArrowRight to the adjacent column (honouring the same predicate/cardSortingDisabled rules as dragging), Space/Enter drops emitting the same onCardMoved payload as a pointer drop, and Escape cancels restoring the original position.'
						},
						{
							type: 'added',
							description:
								'Visually hidden aria-live="polite" announcer for grab, move, drop, cancel and rejected targets (messages are English-only for now), plus a hidden usage hint linked from each focusable card.'
						},
						{
							type: 'added',
							description:
								"New optional boardLabel input: accessible name of the board list container (default 'Board')."
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging): the theme SCSS now ships at ng-hub-ui-board/styles (was dist/board/src/lib/styles), so @use 'ng-hub-ui-board/styles' resolves — update any @use that reached into src/lib/styles."
						},
						{
							type: 'changed',
							description:
								'variant now accepts any colour: besides the built-in semantic accents, a registered custom accent or a literal colour (#hex, rgb(), oklch(), CSS named colour) is resolved through the shared resolveHubAccent helper from ng-hub-ui-utils.'
						},
						{
							type: 'changed',
							description:
								'Internal: @HostBinding/@HostListener decorators replaced by the host metadata object (Angular style guide); no public API or behaviour change.'
						}
					]
				},
				{
					version: '22.2.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'Docs: css-variables-reference.md default values resynchronized with the actual code declarations, now guarded by the repo-level tokens-parity check.'
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
								'Accent system migrated to the open-set local accent slot pattern: variant re-bases a single --hub-board-accent slot and the emphasis/subtle/on family is derived locally with color-mix, growing the built-in variants from 5 to the nine canonical accents and letting any custom ds accent recolour the drag/drop placeholder at runtime.'
						},
						{
							type: 'added',
							description:
								'New tokens --hub-board-accent-on (grayscale contrast flip driven by the accent lightness) and --hub-board-accent-emphasis.'
						},
						{
							type: 'fixed',
							description:
								'Accent color-mix derivation for --hub-board-accent-subtle migrated from srgb to oklch for perceptually uniform tints; the subtle tint is now derived at 12% (was 8%).'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'board',
					type: 'Board',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BOARD.API.INPUT.BOARD.DESCRIPTION'
				},
				{
					name: 'boardLabel',
					type: 'string',
					required: false,
					defaultValue: "'Board'",
					description: 'DOCS.BOARD.API.INPUT.BOARD_LABEL.DESCRIPTION'
				},
				{
					name: 'variant',
					type: "'primary' | 'success' | 'danger' | 'warning' | 'info' | string",
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BOARD.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'columnSortingDisabled',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BOARD.API.INPUT.COLUMN_SORTING_DISABLED.DESCRIPTION'
				},
				{
					name: 'dragBehavior',
					type: "'ghost' | 'hide' | 'collapse'",
					required: false,
					defaultValue: "'collapse'",
					description: 'DOCS.BOARD.API.INPUT.DRAG_BEHAVIOR.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'onCardClick',
					type: 'OutputEmitterRef<BoardCard>',
					required: false,
					description: 'DOCS.BOARD.API.OUTPUT.ON_CARD_CLICK.DESCRIPTION'
				},
				{
					name: 'onCardMoved',
					type: 'OutputEmitterRef<CardDragDropEvent>',
					required: false,
					description: 'DOCS.BOARD.API.OUTPUT.ON_CARD_MOVED.DESCRIPTION'
				},
				{
					name: 'onColumnMoved',
					type: 'OutputEmitterRef<ColumnDragDropEvent>',
					required: false,
					description: 'DOCS.BOARD.API.OUTPUT.ON_COLUMN_MOVED.DESCRIPTION'
				},
				{
					name: 'reachedEnd',
					type: 'OutputEmitterRef<ReachedEndEvent>',
					required: false,
					description: 'DOCS.BOARD.API.OUTPUT.REACHED_END.DESCRIPTION'
				}
			],
			templates: [
				{
					name: 'DOCS.BOARD.API.TEMPLATE.0.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-board [board]="board()">
  <ng-template cardTpt let-card="item" let-column="column">
    <strong>{{ card.title }}</strong>
    <small>{{ column.title }}</small>
  </ng-template>
</hub-board>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.1.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.1.DESCRIPTION',
					example: `<ng-template columnHeaderTpt let-column="column">
  <h5>{{ column.title }}</h5>
  <span>{{ column.cards.length }} cards</span>
</ng-template>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.2.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.2.DESCRIPTION',
					example: `<ng-template columnFooterTpt let-column="column">
  <button type="button" (click)="addCard(column)">Add card</button>
</ng-template>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.3.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.3.DESCRIPTION',
					example: `<ng-template cardPlaceholder let-card="card" let-column="column">
  <div class="drop-zone">Drop "{{ card?.title }}" in {{ column.title }}</div>
</ng-template>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.4.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.4.DESCRIPTION',
					example: `<ng-template columnPlaceholder let-column="column">
  <div class="drop-zone">Drop column here</div>
</ng-template>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.5.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.5.DESCRIPTION',
					example: `<ng-template cardDragPreview let-card="card" let-column="column">
  <div class="preview">{{ card.title }} — {{ column.title }}</div>
</ng-template>`
				},
				{
					name: 'DOCS.BOARD.API.TEMPLATE.6.NAME',
					description: 'DOCS.BOARD.API.TEMPLATE.6.DESCRIPTION',
					example: `<ng-template columnDragPreview let-column="column">
  <div class="preview">{{ column.title }}</div>
</ng-template>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['board'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['board'],
			demos: [
				{
					title: 'Theming with hub-board-theme',
					previewComponent: MixinBoardExampleComponent,
					code: `@use 'ng-hub-ui-board/styles' as board;

.board-mixin-scope {
	@include board.hub-board-theme(
		$accent: #16a34a,
		$column-bg: #f6f8fa,
		$card-border-radius: 0.75rem,
		$columns-gap: 1.25rem
	);
}`
				}
			]
		}
	};

	/**
	 * Creates a FeatureExample instance and attaches its component type for rendering
	 */

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities section of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromComponents();
	}

	/**
	 * Registers every board example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'board-basic',
				title: 'DOCS.BOARD.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicBoardExampleComponent',
				files: ['basic-board-example.component.ts'],
				loader: () =>
					import('../examples/board/basic-board-example.component').then((m) => m.BasicBoardExampleComponent)
			},
			{
				id: 'board-card-drag-drop',
				title: 'DOCS.BOARD.EXAMPLE.CARD_DRAG_DROP.TITLE',
				componentName: 'CardDragDropExampleComponent',
				files: ['card-drag-drop-example.component.ts'],
				loader: () =>
					import('../examples/board/card-drag-drop-example.component').then((m) => m.CardDragDropExampleComponent)
			},
			{
				id: 'board-column-reordering',
				title: 'DOCS.BOARD.EXAMPLE.COLUMN_REORDERING.TITLE',
				componentName: 'ColumnReorderingExampleComponent',
				files: ['column-reordering-example.component.ts'],
				loader: () =>
					import('../examples/board/column-reordering-example.component').then(
						(m) => m.ColumnReorderingExampleComponent
					)
			},
			{
				id: 'board-card-click',
				title: 'DOCS.BOARD.EXAMPLE.CARD_CLICK.TITLE',
				componentName: 'CardClickExampleComponent',
				files: ['card-click-example.component.ts'],
				loader: () => import('../examples/board/card-click-example.component').then((m) => m.CardClickExampleComponent)
			},
			{
				id: 'board-infinite-scroll',
				title: 'DOCS.BOARD.EXAMPLE.INFINITE_SCROLL.TITLE',
				componentName: 'InfiniteScrollExampleComponent',
				files: ['infinite-scroll-example.component.ts'],
				loader: () =>
					import('../examples/board/infinite-scroll-example.component').then((m) => m.InfiniteScrollExampleComponent)
			},
			{
				id: 'board-custom-card-template',
				title: 'DOCS.BOARD.EXAMPLE.CUSTOM_CARD_TEMPLATE.TITLE',
				componentName: 'CustomCardTemplateExampleComponent',
				files: ['custom-card-template-example.component.ts'],
				loader: () =>
					import('../examples/board/custom-card-template-example.component').then(
						(m) => m.CustomCardTemplateExampleComponent
					)
			},
			{
				id: 'board-custom-header-template',
				title: 'DOCS.BOARD.EXAMPLE.CUSTOM_HEADER_TEMPLATE.TITLE',
				componentName: 'CustomHeaderTemplateExampleComponent',
				files: ['custom-header-template-example.component.ts'],
				loader: () =>
					import('../examples/board/custom-header-template-example.component').then(
						(m) => m.CustomHeaderTemplateExampleComponent
					)
			},
			{
				id: 'board-custom-footer-template',
				title: 'DOCS.BOARD.EXAMPLE.CUSTOM_FOOTER_TEMPLATE.TITLE',
				componentName: 'CustomFooterTemplateExampleComponent',
				files: ['custom-footer-template-example.component.ts'],
				loader: () =>
					import('../examples/board/custom-footer-template-example.component').then(
						(m) => m.CustomFooterTemplateExampleComponent
					)
			},
			{
				id: 'board-disable-sorting',
				title: 'DOCS.BOARD.EXAMPLE.DISABLE_SORTING.TITLE',
				componentName: 'DisableSortingExampleComponent',
				files: ['disable-sorting-example.component.ts'],
				loader: () =>
					import('../examples/board/disable-sorting-example.component').then((m) => m.DisableSortingExampleComponent)
			},
			{
				id: 'board-drag-behavior',
				title: 'DOCS.BOARD.EXAMPLE.DRAG_BEHAVIOR.TITLE',
				componentName: 'DragBehaviorExampleComponent',
				files: ['drag-behavior-example.component.ts'],
				loader: () =>
					import('../examples/board/drag-behavior-example.component').then((m) => m.DragBehaviorExampleComponent)
			},
			{
				id: 'board-styling-customization',
				title: 'DOCS.BOARD.EXAMPLE.STYLING_CUSTOMIZATION.TITLE',
				componentName: 'StylingBoardExampleComponent',
				files: ['styling-board-example.component.ts'],
				loader: () =>
					import('../examples/board/styling-board-example.component').then((m) => m.StylingBoardExampleComponent)
			},
			{
				id: 'board-card-placeholder',
				title: 'DOCS.BOARD.EXAMPLE.CARD_PLACEHOLDER.TITLE',
				componentName: 'CardPlaceholderExampleComponent',
				files: ['card-placeholder-example.component.ts'],
				loader: () =>
					import('../examples/board/card-placeholder-example.component').then(
						(m) => m.CardPlaceholderExampleComponent
					)
			},
			{
				id: 'board-column-placeholder',
				title: 'DOCS.BOARD.EXAMPLE.COLUMN_PLACEHOLDER.TITLE',
				componentName: 'ColumnPlaceholderExampleComponent',
				files: ['column-placeholder-example.component.ts'],
				loader: () =>
					import('../examples/board/column-placeholder-example.component').then(
						(m) => m.ColumnPlaceholderExampleComponent
					)
			},
			{
				id: 'board-drag-preview',
				title: 'DOCS.BOARD.EXAMPLE.DRAG_PREVIEW.TITLE',
				componentName: 'DragPreviewExampleComponent',
				files: ['drag-preview-example.component.ts'],
				loader: () =>
					import('../examples/board/drag-preview-example.component').then((m) => m.DragPreviewExampleComponent)
			},
			{
				id: 'board-events',
				title: 'DOCS.BOARD.EXAMPLE.EVENTS.TITLE',
				componentName: 'EventsBoardExampleComponent',
				files: ['events-board-example.component.ts'],
				loader: () =>
					import('../examples/board/events-board-example.component').then((m) => m.EventsBoardExampleComponent)
			},
			{
				id: 'board-keyboard-accessibility',
				title: 'DOCS.BOARD.EXAMPLE.KEYBOARD_ACCESSIBILITY.TITLE',
				componentName: 'KeyboardAccessibilityBoardExampleComponent',
				files: ['keyboard-accessibility-example.component.ts'],
				loader: () =>
					import('../examples/board/keyboard-accessibility-example.component').then(
						(m) => m.KeyboardAccessibilityBoardExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'board'
			});
		});
	}

	/**
	 * Populates the functionalities section with data from example components
	 */
	/**
	 * Populates the functionalities section with data from example components
	 */
	private populateFunctionalitiesFromComponents(): void {
		const examples = this._exampleRegistry.getAll().filter((ex) => ex.packagePath === 'board');

		const mapToFeature = (ex: any): FeatureExample => ({
			title: ex.title,
			description: ex.title,
			import: '',
			template: '',
			component: '',
			previewComponent: BOARD_PREVIEW_COMPONENTS[ex.id]
		});

		// Group examples by functionality
		// 1. Basic Usage
		const basicUsage = examples.filter((ex) => ex.id === 'board-basic').map(mapToFeature);

		// 2. Interactions
		const interactions = examples
			.filter((ex) =>
				[
					'board-card-drag-drop',
					'board-column-reordering',
					'board-card-click',
					'board-events',
					'board-keyboard-accessibility'
				].includes(ex.id)
			)
			.map(mapToFeature);

		// 3. Advanced Features
		const advancedFeatures = examples.filter((ex) => ['board-infinite-scroll'].includes(ex.id)).map(mapToFeature);

		// 4. Templates
		const templates = examples
			.filter((ex) =>
				[
					'board-custom-card-template',
					'board-custom-header-template',
					'board-custom-footer-template',
					'board-card-placeholder',
					'board-column-placeholder',
					'board-drag-preview'
				].includes(ex.id)
			)
			.map(mapToFeature);

		// 5. Configuration
		const configuration = examples
			.filter((ex) => ['board-disable-sorting', 'board-drag-behavior'].includes(ex.id))
			.map(mapToFeature);

		// 6. Styling
		const styling = examples.filter((ex) => ['board-styling-customization'].includes(ex.id)).map(mapToFeature);

		this.boardLibrary.functionalities = [
			{
				title: 'DOCS.BOARD.FEATURE.BASIC_USAGE.TITLE',
				description: 'DOCS.BOARD.FEATURE.BASIC_USAGE.DESCRIPTION',
				examples: basicUsage
			},
			{
				title: 'DOCS.BOARD.FEATURE.INTERACTIONS.TITLE',
				description: 'DOCS.BOARD.FEATURE.INTERACTIONS.DESCRIPTION',
				examples: interactions
			},
			{
				title: 'DOCS.BOARD.FEATURE.ADVANCED_FEATURES.TITLE',
				description: 'DOCS.BOARD.FEATURE.ADVANCED_FEATURES.DESCRIPTION',
				examples: advancedFeatures
			},
			{
				title: 'DOCS.BOARD.FEATURE.TEMPLATES.TITLE',
				description: 'DOCS.BOARD.FEATURE.TEMPLATES.DESCRIPTION',
				examples: templates
			},
			{
				title: 'DOCS.BOARD.FEATURE.CONFIGURATION.TITLE',
				description: 'DOCS.BOARD.FEATURE.CONFIGURATION.DESCRIPTION',
				examples: configuration
			},
			{
				title: 'DOCS.BOARD.FEATURE.STYLING.TITLE',
				description: 'DOCS.BOARD.FEATURE.STYLING.DESCRIPTION',
				examples: styling
			}
		];
	}
}
