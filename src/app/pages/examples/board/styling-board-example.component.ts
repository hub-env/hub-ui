import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-styling-board-example',
	standalone: true,
	imports: [HubBoardComponent],
	template: ` <hub-board class="custom-board-theme" [board]="board()"></hub-board> `,
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './styling-board-example.component.scss'
})
export class StylingBoardExampleComponent {
	title = 'Custom Styling with the hub-board-theme() mixin';
	description =
		'Theme the whole board with a single `@include hub-board-theme(...)` call instead of hand-writing every CSS variable. Unspecified parameters keep their defaults.';
	board = signal(BoardExampleUtils.getSimpleBoard());

	static readonly templateCode = `<hub-board class="custom-board-theme" [board]="board()"></hub-board>`;

	static readonly cssCode = `@use 'ng-hub-ui-board/styles/mixins/board-theme' as *;

.hub-board.custom-board-theme {
  height: 500px;

  // The whole theme in one include — pass only what you want to change:
  @include hub-board-theme(
    $container-bg: #f8fafc,
    $columns-gap: 1rem,
    $column-bg: #f1f5f9,
    $column-border-color: #e2e8f0,
    $column-border-radius: 12px,
    $card-bg: #ffffff,
    $card-border-radius: 8px
  );

  // Tokens not exposed through the mixin — set them directly:
  --hub-board-card-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --hub-board-card-title-color: #334155;
  --hub-board-card-subtitle-color: #64748b;
}`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
  selector: 'app-styling-board-example',
  standalone: true,
  imports: [HubBoardComponent],
  template: \`<hub-board class="custom-board-theme" [board]="board()"></hub-board>\`,
  styleUrl: './styling-board-example.component.scss' // see the CSS tab
})
export class StylingBoardExampleComponent {
  board = signal(BoardExampleUtils.getSimpleBoard());
}`;
}
