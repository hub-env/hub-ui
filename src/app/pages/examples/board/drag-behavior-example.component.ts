import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { DragBehavior, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

@Component({
	selector: 'app-drag-behavior-example',
	standalone: true,
	imports: [HubBoardComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-3">
			<label for="dragBehavior" class="form-label fw-bold">Drag Behavior Mode:</label>
			<select id="dragBehavior" class="form-select" [value]="selectedBehavior()" (change)="onBehaviorChange($event)">
				<option value="collapse">Collapse - Element disappears and space collapses</option>
				<option value="ghost">Ghost - Element becomes semi-transparent (40% opacity)</option>
				<option value="hide">Hide - Element is invisible but space remains</option>
			</select>
			<div class="form-text">
				Try dragging cards or columns with different behaviors to see how the original element appears during drag.
			</div>
		</div>

		<hub-board [board]="board()" [dragBehavior]="selectedBehavior()"> </hub-board>

		<div class="mt-4 p-4 bg-light rounded">
			<h6 class="fw-bold">Current Behavior: {{ selectedBehavior() }}</h6>
			<ul class="mb-0 small">
				@if (selectedBehavior() === 'collapse') {
					<li>
						<strong>Collapse:</strong> The element completely disappears and its space is removed from the layout
					</li>
					<li>Best for: Clean interface where you only want to see the placeholder at the destination</li>
				}
				@if (selectedBehavior() === 'ghost') {
					<li><strong>Ghost:</strong> The element becomes semi-transparent (40% opacity) but remains visible</li>
					<li>Best for: When users need to see the original position while dragging</li>
				}
				@if (selectedBehavior() === 'hide') {
					<li><strong>Hide:</strong> The element is invisible but still occupies space in the layout</li>
					<li>Best for: Maintaining layout stability while hiding the dragged element</li>
				}
			</ul>
		</div>
	`
})
export class DragBehaviorExampleComponent {
	board = signal(BoardExampleUtils.getSimpleBoard());
	selectedBehavior = signal<DragBehavior>('collapse');

	/**
	 * Updates the selected drag behavior when the user picks a new option.
	 *
	 * @param event Change event emitted by the behavior `<select>` element.
	 */
	onBehaviorChange(event: Event): void {
		const select = event.target as HTMLSelectElement;
		this.selectedBehavior.set(select.value as DragBehavior);
	}

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<div class="mb-3">
  <label for="dragBehavior" class="form-label fw-bold">Drag Behavior Mode:</label>
  <select
    id="dragBehavior"
    class="form-select"
    [value]="selectedBehavior()"
    (change)="onBehaviorChange($event)">
    <option value="collapse">Collapse - Element disappears</option>
    <option value="ghost">Ghost - Semi-transparent</option>
    <option value="hide">Hide - Invisible but space remains</option>
  </select>
</div>

<hub-board
  [board]="board()"
  [dragBehavior]="selectedBehavior()">
</hub-board>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { DragBehavior, HubBoardComponent } from 'ng-hub-ui-board';

@Component({
  selector: 'app-drag-behavior-example',
  standalone: true,
  imports: [HubBoardComponent],
  template: \`
    <div class="mb-3">
      <label for="dragBehavior" class="form-label">Drag Behavior Mode:</label>
      <select
        id="dragBehavior"
        class="form-select"
        [value]="selectedBehavior()"
        (change)="onBehaviorChange($event)">
        <option value="collapse">Collapse</option>
        <option value="ghost">Ghost</option>
        <option value="hide">Hide</option>
      </select>
    </div>

    <hub-board
      [board]="board()"
      [dragBehavior]="selectedBehavior()">
    </hub-board>
  \`
})
export class DragBehaviorExampleComponent {
  board = signal({
    columns: [
      {
        title: 'To Do',
        cards: [
          { title: 'Task 1', description: 'Description 1' },
          { title: 'Task 2', description: 'Description 2' }
        ]
      },
      {
        title: 'In Progress',
        cards: [
          { title: 'Task 3', description: 'Description 3' }
        ]
      }
    ]
  });

  selectedBehavior = signal<DragBehavior>('collapse');

  onBehaviorChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedBehavior.set(select.value as DragBehavior);
  }
}`;

	static readonly dataCode = `// DragBehavior Type Definition
export type DragBehavior = 'ghost' | 'hide' | 'collapse';

// Behavior Descriptions:
// - 'collapse': Element completely disappears and space is removed (default)
// - 'ghost': Element becomes semi-transparent (40% opacity) but remains visible
// - 'hide': Element is invisible but still occupies its space`;
}
