import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Board, HubBoardComponent } from 'ng-hub-ui-board';

/**
 * Live demo for the `hub-board-theme` SCSS mixin. The `.board-mixin-scope` block sets
 * the same `--hub-board-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-board-accent` re-tones the
 * column accents, `--hub-board-column-bg` softens the column surface, and
 * `--hub-board-card-border-radius` / `--hub-board-columns-gap` round the cards and space
 * the columns.
 */
@Component({
	selector: 'app-mixin-board-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.board-mixin-scope {
				--hub-board-accent: #16a34a;
				--hub-board-column-bg: #f6f8fa;
				--hub-board-card-border-radius: 0.75rem;
				--hub-board-columns-gap: 1.25rem;
			}
		</style>
		<div class="board-mixin-scope">
			<hub-board [board]="board"></hub-board>
		</div>
	`,
	styles: []
})
export class MixinBoardExampleComponent {
	/** Small, realistic sprint board rendered with the themed `--hub-board-*` tokens. */
	protected readonly board: Board = {
		title: 'Sprint board',
		columns: [
			{
				id: 1,
				title: 'To Do',
				cards: [
					{ id: 1, columnId: 1, title: 'Research', description: 'Analyze requirements' },
					{ id: 2, columnId: 1, title: 'Design', description: 'Create UI mockups' }
				]
			},
			{
				id: 2,
				title: 'In Progress',
				cards: [{ id: 3, columnId: 2, title: 'Development', description: 'Implement core features' }]
			},
			{
				id: 3,
				title: 'Done',
				cards: [{ id: 4, columnId: 3, title: 'Release', description: 'Ship to production' }]
			}
		]
	};
}
