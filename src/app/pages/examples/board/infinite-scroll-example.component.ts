import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Board, BoardCard, HubBoardComponent, ReachedEndEvent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-infinite-scroll-example',
	standalone: true,
	imports: [HubBoardComponent],
	template: `
		<hub-board class="infinite-scroll-board" [board]="board()" (reachedEnd)="onReachedEnd($event)"> </hub-board>
		<div class="mt-4 p-4 bg-gray-100 rounded">
			<p>Last Scroll End: {{ lastScrollEnd() }}</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			/* Give the board a fixed height so column bodies can actually scroll. */
			.hub-board.infinite-scroll-board {
				height: 420px;
			}
		`
	]
})
export class InfiniteScrollExampleComponent {
	title = 'Infinite Scroll';
	description =
		'Load additional cards when a column reaches the end of its scroll area. The board needs a fixed height so its columns can overflow and emit the event.';
	board = signal(this.createBoardWithManyCards());
	lastScrollEnd = signal<string>('None');
	isLoadingMore = signal(false);

	/**
	 * Keeps ids unique across the initial mock data and the incrementally loaded cards.
	 */
	private nextCardId = 120;

	/**
	 * Number of cards appended on each simulated infinite-scroll request.
	 */
	private readonly pageSize = 6;

	/**
	 * Creates the initial board with enough cards to require vertical scrolling.
	 */
	createBoardWithManyCards(): Board {
		const board = BoardExampleUtils.getSimpleBoard();
		const manyCards = Array.from({ length: 20 }, (_, i) =>
			BoardExampleUtils.createCard(100 + i, 1, `Scroll Item ${i + 1}`, 'Scroll to see more')
		);
		if (board.columns && board.columns.length > 0) {
			board.columns[0].cards = [...board.columns[0].cards, ...manyCards];
		}
		return board;
	}

	/**
	 * Simulates an infinite-scroll fetch and appends a new batch of cards to the reached column.
	 */
	onReachedEnd(event: ReachedEndEvent) {
		this.lastScrollEnd.set(`Reached end of column "${event.data.title}" (Index: ${event.index})`);

		if (this.isLoadingMore()) {
			return;
		}

		this.isLoadingMore.set(true);

		window.setTimeout(() => {
			this.board.update((currentBoard) => {
				if (!currentBoard?.columns?.[event.index]) {
					return currentBoard;
				}

				const nextBoard: Board = {
					...currentBoard,
					columns: currentBoard.columns.map((column, columnIndex) => {
						if (columnIndex !== event.index) {
							return column;
						}

						const columnId = column.id ?? columnIndex + 1;

						return {
							...column,
							cards: [...column.cards, ...this.createNextCards(columnId)]
						};
					})
				};

				return nextBoard;
			});

			this.isLoadingMore.set(false);
		}, 400);
	}

	/**
	 * Builds the next mock batch for the provided column.
	 */
	private createNextCards(columnId: number): BoardCard[] {
		return Array.from({ length: this.pageSize }, (_, index) => {
			const cardId = this.nextCardId++;
			return BoardExampleUtils.createCard(
				cardId,
				columnId,
				`Loaded Item ${cardId}`,
				`Lazy-loaded card ${index + 1} for column ${columnId}`
			);
		});
	}

	static readonly templateCode = `<hub-board
  class="infinite-scroll-board"
  [board]="board()"
  (reachedEnd)="onReachedEnd($event)">
</hub-board>`;

	static readonly cssCode = `.hub-board.infinite-scroll-board {
  height: 420px;
}`;

	static readonly componentCode = `onReachedEnd(event) {
  if (this.isLoadingMore()) {
    return;
  }

  this.isLoadingMore.set(true);

  window.setTimeout(() => {
    this.board.update((currentBoard) => ({
      ...currentBoard,
      columns: currentBoard.columns.map((column, columnIndex) =>
        columnIndex === event.index
          ? { ...column, cards: [...column.cards, ...this.createNextCards(column.id)] }
          : column
      )
    }));

    this.isLoadingMore.set(false);
  }, 400);
}`;
}
