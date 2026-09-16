import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-disable-sorting-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-4">
			<label>
				<input type="checkbox" [checked]="disableSorting()" (change)="toggleSorting()" />
				Disable Sorting
			</label>
		</div>
		<hub-board [board]="board()" [columnSortingDisabled]="disableSorting()"> </hub-board>
	`
})
export class DisableSortingExampleComponent {
	title = 'Disable Sorting';
	description = 'Toggle column reordering sorting capability.';
	board = signal(BoardExampleUtils.getSimpleBoard());
	disableSorting = signal(true);

	/**
	 * Toggles whether column reordering (sorting) is disabled.
	 */
	toggleSorting() {
		this.disableSorting.update((v) => !v);
	}

	static readonly templateCode = `<hub-board 
  [board]="board()"
  [columnSortingDisabled]="disableSorting()">
</hub-board>`;

	static readonly componentCode = `
import { Component, signal } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
  selector: 'app-disable-sorting-example',
  standalone: true,
  imports: [HubBoardComponent],
  template: \`
    <!-- Toggle checkbox -->
    <hub-board 
      [board]="board()"
      [columnSortingDisabled]="disableSorting()">
    </hub-board>
  \`
})
export class DisableSortingExampleComponent {
  board = signal(BoardExampleUtils.getSimpleBoard());
  disableSorting = signal(true); // Default to disabled for this example

  toggleSorting() {
    this.disableSorting.update(v => !v);
  }
}`;
}
