import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDragDropEvent, HubColumnPlaceholderDirective, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

/**
 * Example demonstrating custom column placeholder templates during drag operations.
 */
@Component({
	selector: 'app-column-placeholder-example',
	standalone: true,
	imports: [HubBoardComponent, HubColumnPlaceholderDirective],
	template: `
		<hub-board [board]="board()" (onColumnMoved)="onColumnMoved($event)">
			<!-- Custom column placeholder template -->
			<ng-template columnPlaceholder let-column="column">
				<div class="custom-column-placeholder">
					<div class="placeholder-content">
						<span class="placeholder-icon">📁</span>
						@if (column) {
							<span class="placeholder-title">Move "{{ column.title }}"</span>
						}
						<span class="placeholder-text">Drop column here</span>
					</div>
				</div>
			</ng-template>
		</hub-board>

		<div class="mt-3 p-3 bg-light rounded">
			<small class="text-muted">Last action: {{ lastEvent() }}</small>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.custom-column-placeholder {
			width: 256px;
			min-height: 300px;
			border: 3px dashed #6f42c1;
			border-radius: 12px;
			background: linear-gradient(135deg, rgba(111, 66, 193, 0.05) 0%, rgba(111, 66, 193, 0.15) 100%);
			display: flex;
			align-items: center;
			justify-content: center;
			animation: column-pulse 2s ease-in-out infinite;
		}

		.placeholder-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 8px;
			text-align: center;
			padding: 1rem;
		}

		.placeholder-icon {
			font-size: 2.5rem;
		}

		.placeholder-title {
			font-size: 0.875rem;
			color: #6f42c1;
			font-weight: 600;
		}

		.placeholder-text {
			font-size: 0.75rem;
			color: var(--hub-sys-text-muted, #6c757d);
		}

		@keyframes column-pulse {
			0%,
			100% {
				transform: scale(1);
				opacity: 1;
			}
			50% {
				transform: scale(0.98);
				opacity: 0.8;
			}
		}
	`
})
export class ColumnPlaceholderExampleComponent {
	title = 'Custom Column Placeholder';
	description = 'Customize the appearance of the drop zone when dragging columns using the columnPlaceholder directive.';

	board = signal(BoardExampleUtils.getSimpleBoard());
	lastEvent = signal<string>('Drag a column to see the custom placeholder');

	/**
	 * Reflects a column reordering event in the demo status message.
	 * @param event The column drag-and-drop event containing the previous and current positions.
	 */
	onColumnMoved(event: ColumnDragDropEvent) {
		this.lastEvent.set(`Column moved from position ${event.previousIndex + 1} to ${event.currentIndex + 1}`);
	}

	static readonly templateCode = `<hub-board [board]="board()" (onColumnMoved)="onColumnMoved($event)">
  <!-- Custom column placeholder template -->
  <ng-template columnPlaceholder let-column="column">
    <div class="custom-column-placeholder">
      <div class="placeholder-content">
        <span class="placeholder-icon">📁</span>
        @if (column) {
          <span>Move "{{ column.title }}"</span>
        }
        <span>Drop column here</span>
      </div>
    </div>
  </ng-template>
</hub-board>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  ColumnDragDropEvent,
  HubColumnPlaceholderDirective,
  HubBoardComponent
} from 'ng-hub-ui-board';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBoardComponent, HubColumnPlaceholderDirective],
  template: \`
    <hub-board [board]="board()" (onColumnMoved)="onColumnMoved($event)">
      <ng-template columnPlaceholder let-column="column">
        <div class="custom-column-placeholder">
          @if (column) {
            <span>Move "{{ column.title }}"</span>
          }
          <span>Drop column here</span>
        </div>
      </ng-template>
    </hub-board>
  \`,
  styles: \`
    .custom-column-placeholder {
      width: 256px;
      min-height: 300px;
      border: 3px dashed #6f42c1;
      border-radius: 12px;
      background-color: rgba(111, 66, 193, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  \`
})
export class ExampleComponent {
  board = signal(getSimpleBoard());

  onColumnMoved(event: ColumnDragDropEvent) {
    console.log('Column moved:', event);
  }
}`;

	static readonly cssCode = `.custom-column-placeholder {
  width: 256px;
  min-height: 300px;
  border: 3px dashed #6f42c1;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(111, 66, 193, 0.05) 0%, rgba(111, 66, 193, 0.15) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: column-pulse 2s ease-in-out infinite;
}

@keyframes column-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.98);
    opacity: 0.8;
  }
}`;
}
