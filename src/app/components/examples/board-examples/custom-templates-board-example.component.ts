import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Board } from '../../../../../projects/board/src/public-api';
import { MOCK_BOARD } from '../../../data/board-mock.data';
import { HighlightModule } from 'ngx-highlightjs';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-custom-templates-board-example',
	standalone: true,
	imports: [DatePipe, HighlightModule, ExampleContainerComponent, TranslatePipe, HubPanelComponent],
	template: `
		<app-example-container
			title="Board - Custom Templates"
			description="Tablero con templates customizados para headers, cards y estados"
		>
			<div slot="demo">
				<div class="board-container">
					<div class="mock-board">
						<div class="board-header-custom">
							<h4>🚀 {{ board.title }}</h4>
							<div class="board-stats">
								<span>{{ getTotalCards() }} tareas total</span>
								<span>{{ getCompletedCards() }} completadas</span>
							</div>
						</div>

						<div class="columns">
							@for (column of board.columns; track column.id) {
								<div class="column custom-column" [style]="column.style || {}">
									<!-- Custom Column Header Template -->
									<div class="custom-column-header">
										<div class="header-icon">{{ getColumnIcon(column.title) }}</div>
										<div class="header-content">
											<h5>{{ column.title }}</h5>
											<span class="progress-bar">
												<span class="progress-fill" [style.width.%]="getColumnProgress(column)"></span>
											</span>
										</div>
										<div class="header-actions">
											<button class="action-btn">⋯</button>
										</div>
									</div>

									<div class="cards">
										@for (card of column.cards; track card.id) {
											<!-- Custom Card Template -->
											<hub-panel class="custom-card">
												<div class="card-header">
													<span class="card-id">#{{ card.id }}</span>
													<div class="priority-indicator priority-{{ card.data?.priority }}"></div>
												</div>

												<h6 class="card-title">{{ card.title }}</h6>

												@if (card.description) {
													<p class="card-description">{{ card.description }}</p>
												}

												<div class="card-footer">
													@if (card.data?.assignee) {
														<div class="avatar">{{ getInitials(card.data.assignee) }}</div>
													}

													<div class="card-actions">
														@if (card.data?.dueDate) {
															<span
																class="due-date"
																[class.overdue]="isOverdue(card.data.dueDate)"
															>
																{{ card.data.dueDate | date: 'MMM dd' }}
															</span>
														}
														@if (card.data?.tags?.length) {
															<span class="tag-count">🏷️ {{ card.data.tags.length }}</span>
														}
													</div>
												</div>
											</hub-panel>
										} @empty {
											<!-- Custom Empty State Template -->
											<div class="custom-empty-state">
												<div class="empty-icon">📭</div>
												<p>{{ getEmptyStateMessage(column.title) }}</p>
												<button class="add-card-btn">+ Agregar tarjeta</button>
											</div>
										}
									</div>

									<!-- Custom Column Footer -->
									<div class="custom-column-footer">
										<button class="add-new-card">+ Nueva tarjeta</button>
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
			.board-container {
				margin-top: 1rem;
				border: 1px solid #e0e0e0;
				border-radius: 12px;
				padding: 1.5rem;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			}

			.board-header-custom {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 1.5rem;
				padding: 1rem;
				background: rgba(255, 255, 255, 0.95);
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			}

			.board-header-custom h4 {
				margin: 0;
				color: #333;
				font-size: 1.5rem;
			}

			.board-stats {
				display: flex;
				gap: 1rem;
			}

			.board-stats span {
				background: #f0f0f0;
				padding: 0.25rem 0.75rem;
				border-radius: 16px;
				font-size: 0.8rem;
				color: #666;
			}

			.columns {
				display: flex;
				gap: 1rem;
				overflow-x: auto;
				min-height: 500px;
			}

			.custom-column {
				flex: 0 0 300px;
				background: rgba(255, 255, 255, 0.95);
				border-radius: 12px;
				padding: 1rem;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
			}

			.custom-column-header {
				display: flex;
				align-items: center;
				gap: 0.75rem;
				margin-bottom: 1rem;
				padding-bottom: 0.75rem;
				border-bottom: 2px solid #f0f0f0;
			}

			.header-icon {
				font-size: 1.25rem;
			}
			.header-content {
				flex: 1;
			}
			.header-content h5 {
				margin: 0 0 0.25rem 0;
				color: #333;
				font-size: 1rem;
				font-weight: 600;
			}

			.progress-bar {
				display: block;
				width: 100%;
				height: 3px;
				background: #e0e0e0;
				border-radius: 2px;
				overflow: hidden;
			}

			.progress-fill {
				display: block;
				height: 100%;
				background: linear-gradient(90deg, #4caf50, #8bc34a);
				transition: width 0.3s ease;
			}

			.action-btn {
				background: none;
				border: none;
				font-size: 1rem;
				cursor: pointer;
				padding: 0.25rem;
				border-radius: 4px;
				color: #666;
			}

			.action-btn:hover {
				background: #f0f0f0;
			}

			.cards {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				margin-bottom: 1rem;
			}

			.custom-card {
				background: var(--hub-sys-surface-page, #fff);
				border: none;
				border-radius: 8px;
				padding: 1rem;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
				transition: all 0.2s ease;
			}

			.custom-card:hover {
				transform: translateY(-2px);
				box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
			}

			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 0.5rem;
			}

			.card-id {
				background: #f5f5f5;
				color: #666;
				padding: 0.125rem 0.5rem;
				border-radius: 4px;
				font-size: 0.7rem;
				font-weight: 500;
			}

			.priority-indicator {
				width: 8px;
				height: 8px;
				border-radius: 50%;
			}
			.priority-indicator.priority-low {
				background: #4caf50;
			}
			.priority-indicator.priority-medium {
				background: #ff9800;
			}
			.priority-indicator.priority-high {
				background: #f44336;
			}

			.card-title {
				margin: 0 0 0.5rem 0;
				font-size: 0.9rem;
				font-weight: 600;
				line-height: 1.3;
				color: #333;
			}
			.card-description {
				margin: 0 0 1rem 0;
				color: #666;
				font-size: 0.8rem;
				line-height: 1.4;
			}
			.card-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.avatar {
				width: 28px;
				height: 28px;
				border-radius: 50%;
				background: linear-gradient(45deg, #667eea, #764ba2);
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.7rem;
				font-weight: 600;
			}

			.card-actions {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.due-date {
				background: #e3f2fd;
				color: #1976d2;
				padding: 0.125rem 0.5rem;
				border-radius: 12px;
				font-size: 0.7rem;
				font-weight: 500;
			}

			.due-date.overdue {
				background: #ffebee;
				color: #d32f2f;
			}
			.tag-count {
				font-size: 0.7rem;
				color: #666;
			}

			.custom-empty-state {
				text-align: center;
				padding: 2rem 1rem;
				color: #666;
			}
			.empty-icon {
				font-size: 2rem;
				margin-bottom: 0.5rem;
			}
			.empty-state p {
				margin: 0 0 1rem 0;
				font-size: 0.9rem;
			}

			.add-card-btn,
			.add-new-card {
				background: #667eea;
				color: white;
				border: none;
				padding: 0.5rem 1rem;
				border-radius: 6px;
				cursor: pointer;
				font-size: 0.8rem;
				width: 100%;
				transition: background 0.2s;
			}

			.add-card-btn:hover,
			.add-new-card:hover {
				background: #5a6fd8;
			}
			.custom-column-footer {
				border-top: 1px solid #f0f0f0;
				padding-top: 1rem;
			}
		`
	]
})
export class CustomTemplatesBoardExampleComponent {
	board: Board = MOCK_BOARD;

	templateCode = `<!-- Custom Column Header Template -->
<div class="custom-column-header">
  <div class="header-icon">{{ getColumnIcon(column.title) }}</div>
  <div class="header-content">
    <h5>{{ column.title }}</h5>
    <span class="progress-bar">
      <span class="progress-fill" [style.width.%]="getColumnProgress(column)"></span>
    </span>
  </div>
  <div class="header-actions">
    <button class="action-btn">⋯</button>
  </div>
</div>

<!-- Custom Card Template -->
<hub-panel class="custom-card">
  <div class="card-header">
    <span class="card-id">#{{ card.id }}</span>
    <div class="priority-indicator priority-{{ card.data?.priority }}"></div>
  </div>
  <h6 class="card-title">{{ card.title }}</h6>
  <div class="card-footer">
    @if (card.data?.assignee) {
    <div class="avatar">{{ getInitials(card.data.assignee) }}</div>
    }
  </div>
</hub-panel>`;

	componentCode = `import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Board } from 'projects/board/src/public-api';

@Component({
  selector: 'app-custom-templates-example',
  standalone: true,
  imports: [DatePipe],
  template: \`<!-- template with custom styling -->\`
})
export class CustomTemplatesBoardExampleComponent {
  board = { /* mock board data */ };
  
  getColumnIcon(title: string): string {
    const icons: { [key: string]: string } = {
      'Por Hacer': '📋',
      'En Progreso': '⚙️',
      'En Revisión': '👀',
      'Completado': '✅'
    };
    return icons[title] || '📌';
  }
  
  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}`;

	getTotalCards(): number {
		return this.board.columns?.reduce((total, column) => total + column.cards.length, 0) || 0;
	}

	getCompletedCards(): number {
		return this.board.columns?.find((col) => col.title === 'Completado')?.cards.length || 0;
	}

	getColumnIcon(title: string): string {
		const icons: { [key: string]: string } = {
			'Por Hacer': '📋',
			'En Progreso': '⚙️',
			'En Revisión': '👀',
			Completado: '✅'
		};
		return icons[title] || '📌';
	}

	getColumnProgress(column: any): number {
		const maxCards = Math.max(...(this.board.columns?.map((col) => col.cards.length) || [1]));
		return maxCards > 0 ? (column.cards.length / maxCards) * 100 : 0;
	}

	getInitials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
	}

	isOverdue(date: Date): boolean {
		return new Date(date) < new Date();
	}

	getEmptyStateMessage(columnTitle: string): string {
		const messages: { [key: string]: string } = {
			'Por Hacer': '¡Todo listo! No hay tareas pendientes',
			'En Progreso': 'No hay trabajo en curso',
			'En Revisión': 'Nada esperando revisión',
			Completado: 'Aún no hay tareas completadas'
		};
		return messages[columnTitle] || 'Esta columna está vacía';
	}
}
