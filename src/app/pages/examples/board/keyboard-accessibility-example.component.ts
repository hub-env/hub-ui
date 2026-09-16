import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CardDragDropEvent, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

/**
 * The board without a pointer: `boardLabel` names it, every enabled card is a tab stop,
 * and the same `onCardMoved` payload a drop produces is emitted when the keyboard commits
 * the move — which is the point worth showing. A consumer who wires their persistence to
 * the drag path gets the keyboard path for free, and the log below is the proof.
 */
@Component({
	selector: 'app-board-keyboard-accessibility-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p class="text-muted small">
			Tab to a card, then press <kbd>Space</kbd> or <kbd>Enter</kbd> to grab it, the arrow keys to move it within or
			across columns, <kbd>Space</kbd> / <kbd>Enter</kbd> to drop it and <kbd>Esc</kbd> to cancel. A visually hidden
			<code>aria-live="polite"</code> region announces every grab, move, drop and rejection, and
			<code>boardLabel</code> gives the board its accessible name.
		</p>

		<hub-board [board]="board()" boardLabel="Sprint backlog" (onCardMoved)="logMove($event)" />

		<p class="text-muted small mt-3 mb-1">Moves committed from the keyboard (same payload as a pointer drop):</p>
		<ul class="small mb-0">
			@for (entry of moves(); track $index) {
				<li>{{ entry }}</li>
			} @empty {
				<li class="text-muted">No move yet.</li>
			}
		</ul>
	`,
	styles: []
})
export class KeyboardAccessibilityBoardExampleComponent {
	readonly board = signal(BoardExampleUtils.getSimpleBoard());

	/** Last moves, newest first, so the list stays readable without a scrollbar. */
	readonly moves = signal<string[]>([]);

	/**
	 * Renders the event as a sentence instead of dumping JSON: what matters to the reader
	 * is that the keyboard commit carries the origin and destination columns, not the shape.
	 */
	logMove(event: CardDragDropEvent): void {
		const card = event.item.data.title;
		const from = event.previousContainer.data.title;
		const to = event.container.data.title;

		this.moves.update((entries) => [`"${card}": ${from} → ${to} (position ${event.currentIndex + 1})`, ...entries]);
	}

	static readonly templateCode = `<hub-board [board]="board()" boardLabel="Sprint backlog" (onCardMoved)="logMove($event)" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { CardDragDropEvent, HubBoardComponent } from 'ng-hub-ui-board';

@Component({
  selector: 'app-board-keyboard-accessibility-example',
  standalone: true,
  imports: [HubBoardComponent],
  templateUrl: './keyboard-accessibility-example.component.html'
})
export class KeyboardAccessibilityBoardExampleComponent {
  readonly board = signal(myBoard);
  readonly moves = signal<string[]>([]);

  logMove(event: CardDragDropEvent): void {
    const card = event.item.data.title;
    const from = event.previousContainer.data.title;
    const to = event.container.data.title;

    this.moves.update((entries) => [\`"\${card}": \${from} → \${to}\`, ...entries]);
  }
}`;
}
