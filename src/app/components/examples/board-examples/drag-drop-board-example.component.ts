import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Board } from '../../../../../projects/board/src/public-api';
import { MOCK_BOARD } from '../../../data/board-mock.data';
import { HighlightModule } from 'ngx-highlightjs';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-drag-drop-board-example',
	standalone: true,
	imports: [DatePipe, HighlightModule, ExampleContainerComponent, TranslatePipe, HubPanelComponent],
	template: `
		<app-example-container
			title="Board - Drag & Drop"
			description="Tablero completo con funcionalidad de arrastrar y soltar (simulado)"
		>
			<div slot="demo">
				<div class="board-container">
					<div class="mock-board">
						<h4>{{ board.title }}</h4>
						<p class="board-description">{{ board.description }}</p>

						<div class="columns">
							@for (column of board.columns; track column.id) {
								<div class="column" [style]="column.style || {}">
									<div class="column-header">
										<h5>{{ column.title }}</h5>
										<span class="card-count">{{ column.cards.length }}</span>
									</div>
									@if (column.description) {
										<p class="column-description">{{ column.description }}</p>
									}

									<div class="cards">
										@for (card of column.cards; track card.id) {
											<hub-panel class="draggable" [attr.draggable]="true">
												<h6>{{ card.title }}</h6>
												@if (card.description) {
													<p class="card-description">{{ card.description }}</p>
												}
												<div class="card-meta">
													@if (card.data?.assignee) {
														<span class="assignee">👤 {{ card.data.assignee }}</span>
													}
													@if (card.data?.priority) {
														<span class="priority priority-{{ card.data.priority }}">
															{{ card.data.priority }}
														</span>
													}
													@if (card.data?.dueDate) {
														<span class="due-date">📅 {{ card.data.dueDate | date: 'dd/MM' }}</span>
													}
												</div>
												@if (card.data?.tags?.length) {
													<div class="tags">
														@for (tag of card.data.tags; track tag) {
															<span class="tag">{{ tag }}</span>
														}
													</div>
												}
											</hub-panel>
										} @empty {
											<div class="empty-state">
												<p>No hay tarjetas</p>
											</div>
										}
									</div>
								</div>
							}
						</div>
					</div>
				</div>
			</div>

			<div slot="code">
				<h4>{{ 'UI.LIBRARY.PAGE.TEMPLATE' | translate }}</h4>
				<pre><code [highlight]="templateCode" language="xml"></code></pre>

				<h4 class="mt-4">{{ 'UI.LIBRARY.PAGE.COMPONENT' | translate }}</h4>
				<pre><code [highlight]="componentCode" language="typescript"></code></pre>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.example-container {
				padding: 1rem;
			}

			.board-container {
				margin-top: 1rem;
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 1rem;
				background-color: #f5f5f5;
			}

			.mock-board h4 {
				margin: 0 0 0.5rem 0;
				color: #333;
				font-size: 1.25rem;
			}

			.board-description {
				margin: 0 0 1rem 0;
				color: #666;
				font-size: 0.9rem;
			}

			.columns {
				display: flex;
				gap: 1rem;
				overflow-x: auto;
				min-height: 400px;
			}

			.column {
				flex: 0 0 280px;
				border-radius: 8px;
				padding: 0.75rem;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}

			.column-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 0.5rem;
			}

			.column-header h5 {
				margin: 0;
				color: #333;
				font-size: 1rem;
				font-weight: 600;
			}

			.card-count {
				background: rgba(0, 0, 0, 0.1);
				color: #666;
				padding: 0.125rem 0.5rem;
				border-radius: 12px;
				font-size: 0.75rem;
				font-weight: 500;
			}

			.column-description {
				margin: 0 0 0.75rem 0;
				color: #666;
				font-size: 0.8rem;
			}

			.cards {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				min-height: 100px;
			}

			.card {
				background: var(--hub-sys-surface-page, #fff);
				border: 1px solid #e0e0e0;
				border-radius: 6px;
				padding: 0.75rem;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				transition:
					transform 0.2s,
					box-shadow 0.2s;
			}

			.card.draggable {
				cursor: move;
			}

			.card.draggable:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			}

			.card h6 {
				margin: 0 0 0.5rem 0;
				font-size: 0.9rem;
				font-weight: 600;
				line-height: 1.3;
			}

			.card-description {
				margin: 0 0 0.75rem 0;
				color: #666;
				font-size: 0.8rem;
				line-height: 1.3;
			}

			.card-meta {
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
				margin-bottom: 0.5rem;
			}

			.assignee,
			.due-date {
				font-size: 0.75rem;
				color: #666;
			}

			.priority {
				font-size: 0.7rem;
				padding: 0.125rem 0.5rem;
				border-radius: 12px;
				font-weight: 600;
				text-transform: uppercase;
				width: fit-content;
			}

			.priority-low {
				background: #e3f2fd;
				color: #1976d2;
			}
			.priority-medium {
				background: #fff3e0;
				color: #f57c00;
			}
			.priority-high {
				background: #ffebee;
				color: #d32f2f;
			}

			.tags {
				display: flex;
				flex-wrap: wrap;
				gap: 0.25rem;
			}

			.tag {
				background: #f0f0f0;
				color: #666;
				padding: 0.125rem 0.375rem;
				border-radius: 3px;
				font-size: 0.7rem;
			}

			.empty-state {
				text-align: center;
				color: #999;
				padding: 2rem;
				font-style: italic;
			}

			.empty-state p {
				margin: 0;
			}
		`
	]
})
export class DragDropBoardExampleComponent {
	board: Board = MOCK_BOARD;

	templateCode = `<div class="board-container">
  <div class="mock-board">
    <h4>{{ board.title }}</h4>
    <p class="board-description">{{ board.description }}</p>
    
    <div class="columns">
      @for (column of board.columns; track column.id) {
        <div class="column">
          <div class="column-header">
            <h5>{{ column.title }}</h5>
            <span class="card-count">{{ column.cards.length }}</span>
          </div>
          
          <div class="cards">
            @for (card of column.cards; track card.id) {
              <hub-panel class="draggable" [attr.draggable]="true">
                <h6>{{ card.title }}</h6>
                <div class="card-meta">
                  @if (card.data?.assignee) {
                    <span class="assignee">👤 {{ card.data.assignee }}</span>
                  }
                </div>
              </hub-panel>
            }
          </div>
        </div>
      }
    </div>
  </div>
</div>`;

	componentCode = `import { Component } from '@angular/core';
import { Board } from 'projects/board/src/public-api';

@Component({
  selector: 'app-drag-drop-board-example',
  standalone: true,
  imports: [DatePipe],
  template: \`<!-- full template with drag & drop styles -->\`,
  styles: [\`
    .board-container { /* board styles */ }
    .column { /* column styles */ }
    .card.draggable { cursor: move; }
    .card:hover { transform: translateY(-2px); }
  \`]
})
export class DragDropBoardExampleComponent {
  board: Board = {
    title: 'Proyecto Web',
    columns: [
      {
        id: 1,
        title: 'Por Hacer',
        cards: [{ id: 1, title: 'Tarea 1' }]
      }
    ]
  };
}`;
}
