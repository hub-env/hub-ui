import { DatePipe, NgClass } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Board, BoardCard, CardDragDropEvent, ColumnDragDropEvent, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';
import type { LogEntry } from './events-board.model';

export type { LogEntry } from './events-board.model';

@Component({
	selector: 'app-events-board-example',
	standalone: true,
	imports: [HubBoardComponent, DatePipe, NgClass],
	template: `
		<div class="example-container">
			<div class="board-container">
				<hub-board
					[board]="board"
					(onColumnMoved)="onColumnMoved($event)"
					(onCardMoved)="onCardMoved($event)"
					(onCardClick)="onCardClick($event)"
					(reachedEnd)="onReachedEnd($event)"
				>
				</hub-board>
			</div>

			<div class="logs-container">
				<h3>Event Log</h3>
				<div class="logs-list">
					@for (log of logs(); track $index) {
						<div class="log-entry" [ngClass]="log.type">
							<span class="timestamp">[{{ log.timestamp | date: 'HH:mm:ss' }}]</span>
							<span class="message">{{ log.message }}</span>
						</div>
					} @empty {
						<div class="log-entry info">
							<span class="message">No events yet. Interact with the board!</span>
						</div>
					}
				</div>
				<button class="clear-btn" (click)="clearLogs()">Clear Logs</button>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.example-container {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			height: 600px;
		}

		.board-container {
			flex: 2;
			overflow: hidden;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 4px;
		}

		.logs-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 4px;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			padding: 1rem;
			min-height: 200px;
		}

		h3 {
			margin-top: 0;
			margin-bottom: 1rem;
			font-size: 1.1rem;
			color: var(--hub-sys-text-secondary, #495057);
		}

		.logs-list {
			flex: 1;
			overflow-y: auto;
			background: white;
			border: 1px solid var(--hub-sys-border-color-default, #e9ecef);
			border-radius: 4px;
			padding: 0.5rem;
			font-family: monospace;
			font-size: 0.9rem;
		}

		.log-entry {
			padding: 4px 8px;
			border-bottom: 1px solid #f1f3f5;
			display: flex;
			gap: 8px;
		}

		.log-entry:last-child {
			border-bottom: none;
		}

		.timestamp {
			color: #adb5bd;
		}

		.type-info {
			color: var(--hub-sys-text-secondary, #495057);
		}
		.type-success {
			color: #198754;
			background-color: rgba(25, 135, 84, 0.05);
		}
		.type-warning {
			color: #d63384;
			background-color: rgba(214, 51, 132, 0.05);
		}

		.clear-btn {
			margin-top: 1rem;
			align-self: flex-end;
			padding: 0.375rem 0.75rem;
			background-color: var(--hub-sys-text-muted, #6c757d);
			color: white;
			border: none;
			border-radius: 0.25rem;
			cursor: pointer;
		}

		.clear-btn:hover {
			background-color: #5c636a;
		}
	`
})
export class EventsBoardExampleComponent {
	board: Board = BoardExampleUtils.getSimpleBoard();
	logs = signal<LogEntry[]>([]);

	/**
	 * Logs a column reorder event.
	 *
	 * @param event Drag-and-drop event describing the moved column.
	 */
	onColumnMoved(event: ColumnDragDropEvent) {
		const column = event.item.data;
		this.addLog(`Column "${column.title}" moved to index ${event.currentIndex}`, 'warning');
	}

	/**
	 * Logs a card move event between (or within) columns.
	 *
	 * @param event Drag-and-drop event describing the moved card.
	 */
	onCardMoved(event: CardDragDropEvent) {
		const card = event.item.data;
		const targetColumn = event.container.data;
		const index = event.currentIndex;

		this.addLog(`Card "${card.title}" moved to column "${targetColumn.title}" at index ${index}`, 'success');
	}

	/**
	 * Logs a card click event, resolving the owning column.
	 *
	 * @param card Card that was clicked.
	 */
	onCardClick(card: BoardCard) {
		const columns = this.board.columns || [];
		const column = columns.find((c) => c.id === card.columnId);
		this.addLog(`Clicked card "${card.title}" in column "${column?.title ?? 'Unknown'}"`, 'info');
	}

	/**
	 * Logs when a column is scrolled to its end (infinite-scroll trigger).
	 *
	 * @param event Event payload carrying the affected column id.
	 */
	onReachedEnd(event: any) {
		this.addLog(`Reached end of column ID ${event.columnId}`, 'info');
	}

	/** Clears every entry from the event log. */
	clearLogs() {
		this.logs.set([]);
	}

	/**
	 * Prepends a new entry to the event log.
	 *
	 * @param message Description of the event.
	 * @param type Visual category for the entry.
	 */
	private addLog(message: string, type: 'info' | 'success' | 'warning') {
		this.logs.update((current) => [{ timestamp: new Date(), message, type }, ...current]);
	}

	// Code properties for ExampleViewer
	static readonly templateCode = `<div class="example-container">
  <div class="board-container">
    <hub-board
      [board]="board()"
      (onColumnMoved)="onColumnMoved($event)"
      (onCardMoved)="onCardMoved($event)"
      (onCardClick)="onCardClick($event)"
      (reachedEnd)="onReachedEnd($event)">
    </hub-board>
  </div>

  <div class="logs-container">
    <!-- Log display logic -->
    @for (log of logs(); track $index) {
      <div class="log-entry" [ngClass]="log.type">
        <span>[{{ log.timestamp | date : 'HH:mm:ss' }}]</span>
        <span>{{ log.message }}</span>
      </div>
    }
  </div>
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubBoardComponent, ColumnDragDropEvent, CardDragDropEvent, BoardCard } from 'ng-hub-ui-board';

@Component({
  selector: 'app-events-board-example',
  templateUrl: './events-board-example.component.html',
  styleUrls: ['./events-board-example.component.scss']
})
export class EventsBoardExampleComponent {
  board = signal(getSimpleBoard());
  logs = signal<LogEntry[]>([]);

  onColumnMoved(event: ColumnDragDropEvent) {
    const column = event.item.data;
    this.addLog(
      \`Column "\${column.title}" moved to index \${event.currentIndex}\`,
      'warning'
    );
  }

  onCardMoved(event: CardDragDropEvent) {
    const card = event.item.data;
    const targetColumn = event.container.data; // The column where it was dropped
    
    this.addLog(
      \`Card "\${card.title}" moved to column "\${targetColumn.title}" at index \${event.currentIndex}\`,
      'success'
    );
  }

  onCardClick(card: BoardCard) {
    const columns = this.board.columns || [];
    const column = columns.find(c => c.id === card.columnId);
    this.addLog(
      \`Clicked card "\${card.title}" in column "\${column?.title}"\`,
      'info'
    );
  }

  onReachedEnd(event: any) {
    this.addLog(\`Reached end of column ID \${event.columnId}\`, 'info');
  }

  private addLog(message: string, type: string) {
    // Add to logs signal...
  }
}`;

	static readonly cssCode = `.example-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 600px;
}

.logs-list {
  font-family: monospace;
  /* ... styling ... */
}

.type-success { color: #198754; }
.type-warning { color: #d63384; }`;
}
