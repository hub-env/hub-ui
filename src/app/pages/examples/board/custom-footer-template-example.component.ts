import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardColumnFooterDirective, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-custom-footer-template-example',
	standalone: true,
	imports: [HubBoardComponent, HubBoardColumnFooterDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-board [board]="board()">
			<ng-template columnFooterTpt let-column="column">
				<div class="p-2 text-center">
					<button
						class="text-sm text-gray-500 hover:text-gray-800 w-full border border-dashed border-gray-300 rounded p-1"
					>
						+ Add Card to {{ column.title }}
					</button>
				</div>
			</ng-template>
		</hub-board>
	`
})
export class CustomFooterTemplateExampleComponent {
	title = 'Custom Footer Template';
	description = 'Customize column footers using columnFooterTpt directive.';
	board = signal(BoardExampleUtils.getSimpleBoard());

	static readonly templateCode = `<hub-board [board]="board()">
  <ng-template columnFooterTpt let-column="column">
    <button>+ Add Card</button>
  </ng-template>
</hub-board>`;

	static readonly componentCode = `
import { Component, signal } from '@angular/core';
import { HubBoardComponent, HubBoardColumnFooterDirective } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
  selector: 'app-custom-footer-template-example',
  standalone: true,
  imports: [HubBoardComponent, HubBoardColumnFooterDirective],
  template: \`
    <hub-board [board]="board()">
      <ng-template columnFooterTpt let-column="column">
        <!-- Custom footer content -->
      </ng-template>
    </hub-board>
  \`
})
export class CustomFooterTemplateExampleComponent {
  board = signal(BoardExampleUtils.getSimpleBoard());
}`;
}
