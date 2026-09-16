import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { BoardCard, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-card-click-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-board [board]="board()" (onCardClick)="onCardClick($event)"> </hub-board>
		<div class="mt-4 p-4 bg-gray-100 rounded">
			<p>Last Clicked: {{ lastClicked() }}</p>
		</div>
	`
})
export class CardClickExampleComponent {
	title = 'Card Click Handling';
	description = 'Check console or output when clicking a card.';
	board = signal(BoardExampleUtils.getSimpleBoard());
	lastClicked = signal<string>('None');

	/**
	 * Reflects the clicked card in the demo status message.
	 * @param card The board card that was clicked.
	 */
	onCardClick(card: BoardCard) {
		this.lastClicked.set(`Clicked card: "${card.title}" (ID: ${card.id})`);
	}

	static readonly templateCode = '<hub-board [board]="board()" (onCardClick)="onCardClick($event)"></hub-board>';

	static readonly componentCode = 'onCardClick(card: BoardCard) { this.lastClicked.set("Clicked card: " + card.title); }';
}
