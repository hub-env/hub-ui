import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Board } from '../../../../../projects/board/src/public-api';
import { MOCK_BOARD, MOCK_CARDS } from '../../../data/board-mock.data';
import { HighlightModule } from 'ngx-highlightjs';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HubBadgeComponent } from 'ng-hub-ui-badges';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-infinite-scroll-board-example',
	standalone: true,
	imports: [HighlightModule, ExampleContainerComponent, TranslatePipe, HubBadgeComponent, HubPanelComponent],
	template: `
		<app-example-container
			title="Board - Infinite Scroll"
			description="Tablero con carga incremental de tarjetas al hacer scroll"
		>
			<div slot="demo">
				<div class="controls">
					<button (click)="resetBoard()" class="control-btn">🔄 Resetear</button>
					<span class="info">Scroll hasta el final de las columnas para cargar más tarjetas</span>
				</div>

				<div class="board-container">
					<div class="mock-board">
						<h4>{{ board.title }}</h4>

						<div class="columns">
							@for (column of board.columns; track column.id) {
								<div class="column" [style]="column.style || {}">
									<div class="column-header">
										<h5>{{ column.title }}</h5>
										<span class="card-count">{{ column.cards.length }}</span>
									</div>

									<div
										class="cards-container"
										(scroll)="onColumnScroll($event, column)"
										[id]="'column-' + column.id"
									>
										<div class="cards">
											@for (card of column.cards; track card.id) {
												<hub-panel>
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
													</div>
												</hub-panel>
											}
										</div>

										<!-- Loading indicator -->
										@if (isLoading[column.id || 0]) {
											<div class="loading-indicator">
												<div class="spinner"></div>
												<p>Cargando más tarjetas...</p>
											</div>
										}

										<!-- End of content indicator -->
										@if (reachedEnd[column.id || 0]) {
											<div class="end-indicator">
												<p>✅ No hay más tarjetas</p>
											</div>
										}
									</div>
								</div>
							}
						</div>
					</div>
				</div>

				<div class="status">
					<h4>Estado del Scroll:</h4>
					@for (column of board.columns; track column.id) {
						<div class="column-status">
							<strong>{{ column.title }}:</strong>
							{{ column.cards.length }} tarjetas cargadas
							@if (reachedEnd[column.id || 0]) {
								<hub-badge shape="rounded">Completa</hub-badge>
							} @else {
								<hub-badge shape="rounded" class="loading">Más disponibles</hub-badge>
							}
						</div>
					}
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
			.controls {
				display: flex;
				gap: 1rem;
				align-items: center;
				margin-bottom: 1rem;
				padding: 1rem;
				background: #f5f5f5;
				border-radius: 8px;
			}

			.control-btn {
				background: #667eea;
				color: white;
				border: none;
				padding: 0.5rem 1rem;
				border-radius: 6px;
				cursor: pointer;
				font-size: 0.9rem;
			}

			.control-btn:hover {
				background: #5a6fd8;
			}
			.info {
				color: #666;
				font-size: 0.85rem;
				font-style: italic;
			}

			.board-container {
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 1rem;
				background-color: #f9f9f9;
				margin-bottom: 1rem;
			}

			.mock-board h4 {
				margin: 0 0 1rem 0;
				color: #333;
			}
			.columns {
				display: flex;
				gap: 1rem;
				overflow-x: auto;
			}

			.column {
				flex: 0 0 280px;
				border-radius: 8px;
				padding: 0.75rem;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				display: flex;
				flex-direction: column;
			}

			.column-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 0.75rem;
				padding-bottom: 0.5rem;
				border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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

			.cards-container {
				flex: 1;
				overflow-y: auto;
				max-height: 400px;
				padding-right: 0.25rem;
			}

			.cards-container::-webkit-scrollbar {
				width: 6px;
			}
			.cards-container::-webkit-scrollbar-track {
				background: #f1f1f1;
				border-radius: 3px;
			}
			.cards-container::-webkit-scrollbar-thumb {
				background: #c1c1c1;
				border-radius: 3px;
			}
			.cards-container::-webkit-scrollbar-thumb:hover {
				background: #a1a1a1;
			}

			.cards {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
			}

			.card {
				background: var(--hub-sys-surface-page, #fff);
				border: 1px solid #e0e0e0;
				border-radius: 6px;
				padding: 0.75rem;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
			}

			.card h6 {
				margin: 0 0 0.5rem 0;
				font-size: 0.9rem;
				font-weight: 600;
				line-height: 1.3;
			}
			.card-description {
				margin: 0 0 0.5rem 0;
				color: #666;
				font-size: 0.8rem;
				line-height: 1.3;
			}
			.card-meta {
				display: flex;
				flex-direction: column;
				gap: 0.25rem;
			}
			.assignee {
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

			.loading-indicator {
				text-align: center;
				padding: 1rem;
				color: #666;
			}

			.spinner {
				width: 20px;
				height: 20px;
				border: 2px solid #f3f3f3;
				border-top: 2px solid #667eea;
				border-radius: 50%;
				animation: spin 1s linear infinite;
				margin: 0 auto 0.5rem;
			}

			@keyframes spin {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}

			.loading-indicator p {
				margin: 0;
				font-size: 0.8rem;
			}
			.end-indicator {
				text-align: center;
				padding: 1rem;
				color: #4caf50;
				font-size: 0.8rem;
			}
			.end-indicator p {
				margin: 0;
			}

			.status {
				background: #f5f5f5;
				padding: 1rem;
				border-radius: 8px;
				margin-top: 1rem;
			}

			.status h4 {
				margin: 0 0 0.75rem 0;
				color: #333;
				font-size: 1rem;
			}

			.column-status {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.5rem;
				font-size: 0.9rem;
			}

			.badge {
				padding: 0.125rem 0.5rem;
				border-radius: 12px;
				font-size: 0.7rem;
				font-weight: 500;
				background: #e8f5e8;
				color: #4caf50;
			}

			.badge.loading {
				background: #e3f2fd;
				color: #1976d2;
			}
		`
	]
})
export class InfiniteScrollBoardExampleComponent {
	board: Board = structuredClone(MOCK_BOARD);
	isLoading: { [key: number]: boolean } = {};
	reachedEnd: { [key: number]: boolean } = {};
	private cardIndex = MOCK_CARDS.length;

	templateCode = `<div class="cards-container" 
     (scroll)="onColumnScroll($event, column)">
  <div class="cards">
    @for (card of column.cards; track card.id) {
      <hub-panel>
        <h6>{{ card.title }}</h6>
        <!-- Card content -->
      </hub-panel>
    }
  </div>
  
  @if (isLoading[column.id || 0]) {
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Cargando más tarjetas...</p>
    </div>
  }
</div>`;

	componentCode = `import { Component } from '@angular/core';
import { Board } from 'projects/board/src/public-api';

@Component({
  selector: 'app-infinite-scroll-example',
  standalone: true,
  imports: [],
  template: \`<!-- template with scroll detection -->\`
})
export class InfiniteScrollBoardExampleComponent {
  board: Board = { /* mock data */ };
  isLoading: { [key: number]: boolean } = {};
  reachedEnd: { [key: number]: boolean } = {};
  
  onColumnScroll(event: Event, column: any) {
    const element = event.target as HTMLElement;
    const threshold = 50; // pixels from bottom
    
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
      this.loadMoreCards(column);
    }
  }
  
  loadMoreCards(column: any) {
    if (this.isLoading[column.id] || this.reachedEnd[column.id]) return;
    
    this.isLoading[column.id] = true;
    
    setTimeout(() => {
      this.addMoreCards(column);
      this.isLoading[column.id] = false;
    }, 1500);
  }
}`;

	ngOnInit() {
		// Initialize with fewer cards to demonstrate infinite scroll
		this.board.columns?.forEach((column) => {
			if (column.id) {
				this.isLoading[column.id] = false;
				this.reachedEnd[column.id] = false;
				// Keep only first 2 cards in each column
				column.cards = column.cards.slice(0, 2);
			}
		});
	}

	onColumnScroll(event: Event, column: any) {
		const element = event.target as HTMLElement;
		const threshold = 50; // pixels from bottom

		if (element.scrollTop + element.clientHeight >= element.scrollHeight - threshold) {
			this.loadMoreCards(column);
		}
	}

	loadMoreCards(column: any) {
		const columnId = column.id;

		if (this.isLoading[columnId] || this.reachedEnd[columnId]) {
			return;
		}

		this.isLoading[columnId] = true;

		// Simulate API call delay
		setTimeout(() => {
			this.addMoreCards(column);
			this.isLoading[columnId] = false;
		}, 1500);
	}

	private addMoreCards(column: any) {
		const newCardsCount = 2; // Add 2 cards at a time
		const maxCards = 6; // Maximum cards per column

		if (column.cards.length >= maxCards) {
			this.reachedEnd[column.id] = true;
			return;
		}

		// Generate new cards based on column theme
		const newCards = this.generateNewCards(column, newCardsCount);
		column.cards = [...column.cards, ...newCards];

		if (column.cards.length >= maxCards) {
			this.reachedEnd[column.id] = true;
		}
	}

	private generateNewCards(column: any, count: number) {
		const priorities = ['low', 'medium', 'high'];
		const assignees = ['Ana García', 'Carlos Ruiz', 'Laura Martín', 'David López', 'María Sánchez'];
		const taskTypes = ['Implementar', 'Diseñar', 'Configurar', 'Optimizar', 'Refactorizar', 'Documentar'];

		const newCards = [];
		for (let i = 0; i < count; i++) {
			const cardId = this.cardIndex++;
			const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
			const priority = priorities[Math.floor(Math.random() * priorities.length)];
			const assignee = assignees[Math.floor(Math.random() * assignees.length)];

			newCards.push({
				id: cardId,
				columnId: column.id,
				title: `${taskType} funcionalidad ${cardId}`,
				description: `Descripción detallada de la tarea ${cardId} para ${column.title.toLowerCase()}`,
				data: {
					assignee,
					priority,
					tags: ['nuevo', 'generado']
				}
			});
		}

		return newCards;
	}

	resetBoard() {
		this.board = structuredClone(MOCK_BOARD);
		this.cardIndex = MOCK_CARDS.length;

		this.board.columns?.forEach((column) => {
			if (column.id) {
				this.isLoading[column.id] = false;
				this.reachedEnd[column.id] = false;
				// Reset to first 2 cards
				column.cards = column.cards.slice(0, 2);
			}
		});
	}
}
