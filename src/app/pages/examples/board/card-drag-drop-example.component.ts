import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CardDragDropEvent, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-card-drag-drop-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)"> </hub-board>
		<div class="mt-4 p-4 bg-gray-100 rounded">
			<p>Last Event: {{ lastEvent() }}</p>
		</div>
	`
})
export class CardDragDropExampleComponent {
	title = 'Card Drag & Drop';
	description = 'Drag and drop cards within the same column or between different columns.';
	board = signal(BoardExampleUtils.getSimpleBoard());
	lastEvent = signal<string>('None');

	/**
	 * Reflects a card move event in the demo status message.
	 * @param event The card drag-and-drop event with the source and target containers.
	 */
	onCardMoved(event: CardDragDropEvent) {
		const card = event.item.data;
		const from = event.previousContainer.data.title;
		const to = event.container.data.title;
		this.lastEvent.set(`Moved "${card.title}" from ${from} to ${to}`);
	}

	static readonly templateCode = '<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)"></hub-board>';

	static readonly componentCode =
		'onCardMoved(event) { this.lastEvent.set("Moved " + card.title + " from " + from + " to " + to); }';
}
