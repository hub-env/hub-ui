import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-basic-board-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-board [board]="board()"></hub-board> `
})
export class BasicBoardExampleComponent {
	title = 'Board Display (Columns & Cards)';
	description = 'Basic display showing columns and cards rendering.';
	board = signal(BoardExampleUtils.getSimpleBoard());

	static readonly templateCode = `<hub-board [board]="board()"></hub-board>`;
	static readonly componentCode = `
import { Component, signal } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
  selector: 'app-basic-board-example',
  standalone: true,
  imports: [HubBoardComponent],
  template: \`
    <hub-board [board]="board()"></hub-board>
  \`
})
export class BasicBoardExampleComponent {
  board = signal(BoardExampleUtils.getSimpleBoard());
}`;
}
