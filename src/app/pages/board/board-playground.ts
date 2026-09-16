import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Board, DragBehavior, HubBoardComponent } from 'ng-hub-ui-board';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Builds a fresh canonical Kanban board (three columns, a handful of cards) used as
 * the live preview inside the board playground. A new object is returned on every
 * call so the preview never shares mutable state between renders.
 *
 * @returns A ready-to-render {@link Board} definition.
 */
function createPlaygroundBoard(): Board {
	return {
		title: 'Sprint Board',
		columns: [
			{
				id: 1,
				title: 'To Do',
				cards: [
					{ id: 1, columnId: 1, title: 'Research requirements', description: 'Collect and analyze user stories.' },
					{ id: 2, columnId: 1, title: 'Design mockups', description: 'Draft the main screens in Figma.' }
				]
			},
			{
				id: 2,
				title: 'In Progress',
				cards: [{ id: 3, columnId: 2, title: 'Build API', description: 'Implement the REST endpoints.' }]
			},
			{
				id: 3,
				title: 'Done',
				cards: [{ id: 4, columnId: 3, title: 'Project kickoff', description: 'Initial planning meeting.' }]
			}
		]
	};
}

/**
 * Thin, SSR-safe standalone wrapper around {@link HubBoardComponent} for the docs
 * playground. It renders a canonical board and re-exposes the board's configurable
 * visual / behavior inputs one-to-one as its own inputs, so each playground control
 * maps directly to a real board input.
 *
 * The board data is generated lazily through a {@link computed} signal — no global
 * `document` / `window` access happens at construction time, keeping it SSR-safe.
 */
@Component({
	selector: 'app-board-playground-preview',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-board
			[board]="board()"
			[columnSortingDisabled]="columnSortingDisabled()"
			[dragBehavior]="dragBehavior()"
		></hub-board>
	`
})
export class BoardPlaygroundPreviewComponent {
	/** Mirrors {@link HubBoardComponent.columnSortingDisabled}. */
	readonly columnSortingDisabled = input<boolean>(false);

	/** Mirrors {@link HubBoardComponent.dragBehavior}. */
	readonly dragBehavior = input<DragBehavior>('collapse');

	/**
	 * When `true`, drag-and-drop reordering of cards within every column is disabled.
	 * The board exposes this per column (`cardSortingDisabled`), so the wrapper applies
	 * the flag to all columns of the canonical board.
	 */
	readonly cardSortingDisabled = input<boolean>(false);

	/**
	 * Canonical board definition fed to the live preview, with the per-column card
	 * sorting flag applied from {@link cardSortingDisabled}.
	 */
	readonly board = computed<Board>(() => {
		const board = createPlaygroundBoard();
		const disabled = this.cardSortingDisabled();
		return {
			...board,
			columns: board.columns?.map((column) => ({ ...column, cardSortingDisabled: disabled }))
		};
	});
}

/**
 * Interactive playground definition for the ng-hub-ui-board documentation page.
 * The single entry previews a canonical Kanban board and lets users toggle the
 * board's real behavior inputs and theme its core `--hub-board-*` tokens live.
 */
export const BOARD_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'board',
		title: 'Board',
		tag: 'hub-board',
		description:
			'A Kanban board with drag-and-drop columns and cards. Toggle the behavior options and theme the core board tokens to see changes live.',
		component: BoardPlaygroundPreviewComponent,
		controls: [
			{
				name: 'columnSortingDisabled',
				label: 'Disable column sorting',
				type: 'boolean',
				default: false,
				description: 'Prevents reordering whole columns via drag-and-drop.'
			},
			{
				name: 'cardSortingDisabled',
				label: 'Disable card sorting',
				type: 'boolean',
				default: false,
				description: 'Prevents reordering cards within and across columns (applied to every column).'
			},
			{
				name: 'dragBehavior',
				label: 'Drag behavior',
				type: 'select',
				default: 'collapse',
				options: [
					{ label: 'collapse', value: 'collapse' },
					{ label: 'ghost', value: 'ghost' },
					{ label: 'hide', value: 'hide' }
				],
				description: 'How the dragged element behaves visually: collapse its space, ghost it, or hide it.'
			}
		],
		cssVariables: [
			{ name: '--hub-board-container-bg', label: 'Board background', type: 'color', default: '#ffffff' },
			{ name: '--hub-board-columns-gap', label: 'Gap between columns', type: 'text', default: '1rem' },
			{ name: '--hub-board-column-width', label: 'Column width', type: 'text', default: '256px' },
			{ name: '--hub-board-column-bg', label: 'Column background', type: 'color', default: '#ffffff' },
			{ name: '--hub-board-column-border-color', label: 'Column border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-board-column-border-radius', label: 'Column border radius', type: 'text', default: '0.375rem' },
			{
				name: '--hub-board-column-cap-bg',
				label: 'Column header / footer background',
				type: 'color',
				default: '#f8f9fa'
			},
			{ name: '--hub-board-card-bg', label: 'Card background', type: 'color', default: '#ffffff' },
			{ name: '--hub-board-card-color', label: 'Card text color', type: 'color', default: '#212529' },
			{ name: '--hub-board-card-border-color', label: 'Card border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-board-card-border-radius', label: 'Card border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-board-card-box-shadow', label: 'Card shadow', type: 'text', default: 'none' },
			{
				name: '--hub-board-placeholder-border-color',
				label: 'Drop-zone border color',
				type: 'color',
				default: '#0d6efd'
			},
			{
				name: '--hub-board-placeholder-bg',
				label: 'Drop-zone background',
				type: 'text',
				default: 'rgba(13, 110, 253, 0.05)'
			}
		]
	}
];
