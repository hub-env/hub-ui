import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CardDragDropEvent, HubCardPlaceholderDirective, HubBoardComponent } from 'ng-hub-ui-board';
import { BoardExampleUtils } from './board-example-utils';

/**
 * Example demonstrating custom card placeholder templates during drag operations.
 */
@Component({
	selector: 'app-card-placeholder-example',
	standalone: true,
	imports: [HubBoardComponent, HubCardPlaceholderDirective],
	template: `
		<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)">
			<!-- Custom card placeholder template -->
			<ng-template cardPlaceholder let-card="card" let-column="column">
				<div class="custom-card-placeholder">
					@if (card) {
						<div class="placeholder-content">
							<span class="placeholder-icon">📋</span>
							<span class="placeholder-text">Drop "{{ card.title }}" here</span>
						</div>
					} @else {
						<div class="placeholder-content">
							<span class="placeholder-icon">📥</span>
							<span class="placeholder-text">Drop card here</span>
						</div>
					}
				</div>
			</ng-template>
		</hub-board>

		<div class="mt-3 p-3 bg-light rounded">
			<small class="text-muted">Last action: {{ lastEvent() }}</small>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.custom-card-placeholder {
			min-height: 80px;
			border: 2px dashed #198754;
			border-radius: 8px;
			background-color: rgba(25, 135, 84, 0.1);
			display: flex;
			align-items: center;
			justify-content: center;
			animation: pulse 1.5s ease-in-out infinite;
		}

		.placeholder-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 4px;
		}

		.placeholder-icon {
			font-size: 1.5rem;
		}

		.placeholder-text {
			font-size: 0.75rem;
			color: #198754;
			font-weight: 500;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.6;
			}
		}
	`
})
export class CardPlaceholderExampleComponent {
	title = 'Custom Card Placeholder';
	description = 'Customize the appearance of the drop zone when dragging cards using the cardPlaceholder directive.';

	board = signal(BoardExampleUtils.getSimpleBoard());
	lastEvent = signal<string>('Drag a card to see the custom placeholder');

	/**
	 * Reflects a card move event in the demo status message.
	 * @param event The card drag-and-drop event with the moved card and target container.
	 */
	onCardMoved(event: CardDragDropEvent) {
		const card = event.item.data;
		const to = event.container.data.title;
		this.lastEvent.set(`Dropped "${card.title}" into "${to}"`);
	}

	static readonly templateCode = `<hub-board [board]="board()" (onCardMoved)="onCardMoved($event)">
  <!-- Custom card placeholder template -->
  <ng-template cardPlaceholder let-card="card" let-column="column">
    <div class="custom-card-placeholder">
      @if (card) {
        <span>Drop "{{ card.title }}" here</span>
      } @else {
        <span>Drop card here</span>
      }
    </div>
  </ng-template>
</hub-board>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  CardDragDropEvent,
  HubCardPlaceholderDirective,
  HubBoardComponent
} from 'ng-hub-ui-board';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBoardComponent, HubCardPlaceholderDirective],
  template: \`
    <hub-board [board]="board()" (onCardMoved)="onCardMoved($event)">
      <ng-template cardPlaceholder let-card="card" let-column="column">
        <div class="custom-placeholder">
          @if (card) {
            <span>Drop "{{ card.title }}" here</span>
          }
        </div>
      </ng-template>
    </hub-board>
  \`,
  styles: \`
    .custom-placeholder {
      min-height: 80px;
      border: 2px dashed #198754;
      border-radius: 8px;
      background-color: rgba(25, 135, 84, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  \`
})
export class ExampleComponent {
  board = signal(getSimpleBoard());

  onCardMoved(event: CardDragDropEvent) {
    console.log('Card moved:', event.item.data);
  }
}`;

	static readonly cssCode = `.custom-card-placeholder {
  min-height: 80px;
  border: 2px dashed #198754;
  border-radius: 8px;
  background-color: rgba(25, 135, 84, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}`;
}
