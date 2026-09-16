import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDragDropEvent, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-column-reordering-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-board [board]="board()" (onColumnMoved)="onColumnMoved($event)"> </hub-board>
		<div class="mt-4 p-4 bg-gray-100 rounded">
			<p>Last Reorder: {{ lastReorder() }}</p>
		</div>
	`
})
export class ColumnReorderingExampleComponent {
	title = 'Column Reordering';
	description = 'Drag and drop columns to change their order.';
	board = signal(BoardExampleUtils.getSimpleBoard());
	lastReorder = signal<string>('None');

	/**
	 * Reflects a column reordering event in the demo status message.
	 * @param event The column drag-and-drop event with the previous and current indexes.
	 */
	onColumnMoved(event: ColumnDragDropEvent) {
		this.lastReorder.set(`Moved column from index ${event.previousIndex} to ${event.currentIndex}`);
	}

	static readonly templateCode = '<hub-board [board]="board()" (onColumnMoved)="onColumnMoved($event)"></hub-board>';

	static readonly componentCode =
		'onColumnMoved(event) { this.lastReorder.set("Moved column from " + event.previousIndex + " to " + event.currentIndex); }';
}
