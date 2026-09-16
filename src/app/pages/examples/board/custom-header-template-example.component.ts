import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardColumnHeaderDirective, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-custom-header-template-example',
	standalone: true,
	imports: [HubBoardComponent, HubBoardColumnHeaderDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-board [board]="board()">
			<ng-template columnHeaderTpt let-column="column">
				<div class="flex items-center justify-between p-2 bg-gray-200 rounded-t">
					<span class="font-bold uppercase tracking-wider text-sm">{{ column.title }}</span>
					<span class="bg-gray-800 text-white text-xs rounded-full px-2 py-0.5">{{ column.cards.length }}</span>
				</div>
			</ng-template>
		</hub-board>
	`
})
export class CustomHeaderTemplateExampleComponent {
	title = 'Custom Header Template';
	description = 'Customize column headers using columnHeaderTpt directive.';
	board = signal(BoardExampleUtils.getSimpleBoard());

	static readonly templateCode = `<hub-board [board]="board()">
  <ng-template columnHeaderTpt let-column="column">
    <div class="flex items-center justify-between ...">
      <span>{{ column.title }}</span>
      <hub-badge shape="rounded">{{ column.cards.length }}</hub-badge>
    </div>
  </ng-template>
</hub-board>`;

	static readonly componentCode = `
import { Component, signal } from '@angular/core';
import { HubBoardComponent, HubBoardColumnHeaderDirective } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
  selector: 'app-custom-header-template-example',
  standalone: true,
  imports: [HubBoardComponent, HubBoardColumnHeaderDirective],
  template: \`
    <hub-board [board]="board()">
      <ng-template columnHeaderTpt let-column="column">
        <!-- Custom header content -->
      </ng-template>
    </hub-board>
  \`
})
export class CustomHeaderTemplateExampleComponent {
  board = signal(BoardExampleUtils.getSimpleBoard());
}`;
}
