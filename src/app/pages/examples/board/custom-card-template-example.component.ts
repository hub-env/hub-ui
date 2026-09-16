import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubCardTemplateDirective, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-custom-card-template-example',
	standalone: true,
	imports: [HubBoardComponent, HubCardTemplateDirective],
	template: `
		<hub-board [board]="board()">
			<ng-template cardTpt let-card="item">
				<div class="custom-card p-2 bg-white border border-blue-500 rounded shadow-sm">
					<div class="font-bold text-blue-700">{{ card.title }}</div>
					<div class="text-xs text-gray-500 mt-1">{{ card.description }}</div>
					<div class="mt-2 text-right">
						<span class="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">ID: {{ card.id }}</span>
					</div>
				</div>
			</ng-template>
		</hub-board>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			::ng-deep .custom-card {
				cursor: grab;
			}
		`
	]
})
export class CustomCardTemplateExampleComponent {
	title = 'Custom Card Template';
	description = 'Customize card appearance using cardTpt directive.';
	board = signal(BoardExampleUtils.getSimpleBoard());

	static readonly templateCode =
		'<hub-board [board]="board()"><ng-template cardTpt let-card="item">...</ng-template></hub-board>';

	static readonly componentCode = 'board = signal(BoardExampleUtils.getSimpleBoard());';
}
