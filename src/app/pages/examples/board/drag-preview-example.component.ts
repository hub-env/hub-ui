import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
	CardDragDropEvent,
	HubCardDragPreviewDirective,
	ColumnDragDropEvent,
	HubColumnDragPreviewDirective,
	HubBoardComponent
} from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

/**
 * Example demonstrating custom drag preview templates for cards and columns.
 * The drag preview is the visual element that follows the cursor during drag operations.
 */
@Component({
	selector: 'app-drag-preview-example',
	standalone: true,
	imports: [HubBoardComponent, HubCardDragPreviewDirective, HubColumnDragPreviewDirective],
	template: `
		<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)" (onColumnMoved)="onColumnMoved($event)">
			<!-- Custom card drag preview template -->
			<ng-template cardDragPreview let-card="card" let-column="column">
				<div class="card-drag-preview">
					<span class="drag-icon">🎯</span>
					<div class="drag-content">
						<strong>{{ card.title }}</strong>
						<small>from {{ column.title }}</small>
					</div>
				</div>
			</ng-template>

			<!-- Custom column drag preview template -->
			<ng-template columnDragPreview let-column="column">
				<div class="column-drag-preview">
					<span class="drag-icon">📁</span>
					<div class="drag-content">
						<strong>{{ column.title }}</strong>
						<small>{{ column.cards.length }} cards</small>
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
		.card-drag-preview,
		.column-drag-preview {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 8px 12px;
			border-radius: 6px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			font-size: 0.875rem;
			white-space: nowrap;
		}

		.card-drag-preview {
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			color: white;
		}

		.column-drag-preview {
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
			color: white;
		}

		.drag-icon {
			font-size: 1.25rem;
		}

		.drag-content {
			display: flex;
			flex-direction: column;
			line-height: 1.2;
		}

		.drag-content strong {
			font-weight: 600;
		}

		.drag-content small {
			opacity: 0.8;
			font-size: 0.75rem;
		}
	`
})
export class DragPreviewExampleComponent {
	title = 'Custom Drag Preview';
	description =
		'Customize the visual element that follows the cursor during drag operations using cardDragPreview and columnDragPreview directives.';

	board = signal(BoardExampleUtils.getSimpleBoard());
	lastEvent = signal<string>('Drag a card or column to see the custom preview');

	/**
	 * Reflects a card move event in the demo status message.
	 * @param event The card drag-and-drop event with the moved card and target container.
	 */
	onCardMoved(event: CardDragDropEvent) {
		const card = event.item.data;
		const to = event.container.data.title;
		this.lastEvent.set(`Dropped "${card.title}" into "${to}"`);
	}

	/**
	 * Reflects a column move event in the demo status message.
	 * @param event The column drag-and-drop event with the moved column and target position.
	 */
	onColumnMoved(event: ColumnDragDropEvent) {
		const column = event.item.data;
		this.lastEvent.set(`Moved column "${column.title}" to position ${event.currentIndex + 1}`);
	}

	static readonly templateCode = `<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)" (onColumnMoved)="onColumnMoved($event)">
  <!-- Custom card drag preview template -->
  <ng-template cardDragPreview let-card="card" let-column="column">
    <div class="card-drag-preview">
      <span class="drag-icon">🎯</span>
      <div class="drag-content">
        <strong>{{ card.title }}</strong>
        <small>from {{ column.title }}</small>
      </div>
    </div>
  </ng-template>

  <!-- Custom column drag preview template -->
  <ng-template columnDragPreview let-column="column">
    <div class="column-drag-preview">
      <span class="drag-icon">📁</span>
      <div class="drag-content">
        <strong>{{ column.title }}</strong>
        <small>{{ column.cards.length }} cards</small>
      </div>
    </div>
  </ng-template>
</hub-board>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  CardDragDropEvent,
  HubCardDragPreviewDirective,
  ColumnDragDropEvent,
  HubColumnDragPreviewDirective,
  HubBoardComponent
} from 'ng-hub-ui-board';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBoardComponent, HubCardDragPreviewDirective, HubColumnDragPreviewDirective],
  template: \`
    <hub-board [board]="board()" (onCardMoved)="onCardMoved($event)" (onColumnMoved)="onColumnMoved($event)">
      <ng-template cardDragPreview let-card="card" let-column="column">
        <div class="card-drag-preview">
          <span>🎯</span>
          <strong>{{ card.title }}</strong>
        </div>
      </ng-template>

      <ng-template columnDragPreview let-column="column">
        <div class="column-drag-preview">
          <span>📁</span>
          <strong>{{ column.title }}</strong>
        </div>
      </ng-template>
    </hub-board>
  \`,
  styles: \`
    .card-drag-preview {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .column-drag-preview {
      display: flex;
      gap: 8px;
      padding: 8px 12px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  \`
})
export class ExampleComponent {
  board = signal(getSimpleBoard());

  onCardMoved(event: CardDragDropEvent) {
    console.log('Card moved:', event.item.data);
  }

  onColumnMoved(event: ColumnDragDropEvent) {
    console.log('Column moved:', event.item.data);
  }
}`;

	static readonly cssCode = `.card-drag-preview,
.column-drag-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.875rem;
  white-space: nowrap;
}

.card-drag-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.column-drag-preview {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}`;
}
