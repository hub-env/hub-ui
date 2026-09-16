import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubBoardComponent, CardTemplateDirective, Board, BoardCard } from '../../../../../projects/board/src/public-api';
import { HighlightModule } from 'ngx-highlightjs';
import { MOCK_BOARD } from '../../../data/board-mock.data';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-card-actions-board-example',
	standalone: true,
	imports: [
		HubBoardComponent,
		CardTemplateDirective,
		HighlightModule,
		ExampleContainerComponent,
		TranslatePipe,
		HubButtonComponent,
		HubPanelComponent
	],
	template: `
		<app-example-container title="Board - Card Actions" description="Board con acciones en las tarjetas">
			<div slot="demo">
				<hub-board [board]="boardData">
					<ng-template cardTpt let-card="card">
						<hub-panel class="h-100">
							<div>
								<div class="d-flex justify-content-between align-items-start">
									<h6 class="card-title">{{ card.title }}</h6>
									<div class="dropdown">
										<button
											hubButton
											variant="outline"
											color="secondary"
											size="sm"
											data-bs-toggle="dropdown"
										>
											⋮
										</button>
										<ul class="dropdown-menu">
											<li>
												<a class="dropdown-item" href="#" (click)="editCard(card, $event)">✏️ Edit</a>
											</li>
											<li>
												<a class="dropdown-item" href="#" (click)="duplicateCard(card, $event)"
													>📋 Duplicate</a
												>
											</li>
											<li><hr class="dropdown-divider" /></li>
											<li>
												<a class="dropdown-item text-danger" href="#" (click)="deleteCard(card, $event)"
													>🗑️ Delete</a
												>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</hub-panel>
					</ng-template>
				</hub-board>

				@if (lastAction) {
					<div class="alert alert-info mt-3"><strong>Last Action:</strong> {{ lastAction }}</div>
				}
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
	styles: []
})
export class CardActionsBoardExampleComponent {
	boardData: Board<any> = { ...MOCK_BOARD };
	lastAction: string = '';

	templateCode = `<hub-board [board]="boardData">
  <ng-template cardTpt let-card="card">
    <hub-panel class="h-100">
      <div>
        <div class="d-flex justify-content-between align-items-start">
          <h6 class="card-title">{{ card.title }}</h6>
          <div class="dropdown">
            <button hubButton variant="outline" color="secondary" size="sm" data-bs-toggle="dropdown">
              ⋮
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" (click)="editCard(card, $event)">✏️ Edit</a></li>
              <li><a class="dropdown-item" (click)="duplicateCard(card, $event)">📋 Duplicate</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" (click)="deleteCard(card, $event)">🗑️ Delete</a></li>
            </ul>
          </div>
        </div>
      </div>
    </hub-panel>
  </ng-template>
</hub-board>`;

	componentCode = `import { Component } from '@angular/core';
import { HubBoardComponent, CardTemplateDirective } from 'projects/board/src/public-api';

@Component({
  selector: 'app-card-actions-example',
  standalone: true,
  imports: [HubBoardComponent, CardTemplateDirective],
  template: \`<!-- template code -->\`
})
export class CardActionsBoardExampleComponent {
  boardData = { /* mock data */ };
  lastAction = '';
  
  editCard(card: any, event: Event) {
    event.preventDefault();
    this.lastAction = \`Edited card: "\${card.title}"\`;
  }
  
  duplicateCard(card: any, event: Event) {
    event.preventDefault();
    // Find column and add duplicate
    const column = this.boardData.columns?.find(col => 
      col.cards.some(c => c.id === card.id)
    );
    if (column) {
      const duplicate = { ...card, id: Date.now(), title: \`\${card.title} (Copy)\` };
      column.cards.push(duplicate);
      this.lastAction = \`Duplicated card: "\${card.title}"\`;
    }
  }
  
  deleteCard(card: any, event: Event) {
    event.preventDefault();
    // Find and remove card
    this.boardData.columns?.forEach(column => {
      const cardIndex = column.cards.findIndex(c => c.id === card.id);
      if (cardIndex > -1) {
        column.cards.splice(cardIndex, 1);
        this.lastAction = \`Deleted card: "\${card.title}"\`;
      }
    });
  }
}`;

	editCard(card: BoardCard<any>, event: Event): void {
		event.preventDefault();
		this.lastAction = `Edited card: "${card.title}"`;
	}

	duplicateCard(card: BoardCard<any>, event: Event): void {
		event.preventDefault();
		const column = this.boardData.columns?.find((col) => col.cards.some((c) => c.id === card.id));

		if (column) {
			const duplicate: BoardCard<any> = {
				...card,
				id: Date.now(),
				title: `${card.title} (Copy)`
			};
			column.cards.push(duplicate);
			this.lastAction = `Duplicated card: "${card.title}"`;
		}
	}

	deleteCard(card: BoardCard<any>, event: Event): void {
		event.preventDefault();
		this.boardData.columns?.forEach((column) => {
			const cardIndex = column.cards.findIndex((c) => c.id === card.id);
			if (cardIndex > -1) {
				column.cards.splice(cardIndex, 1);
				this.lastAction = `Deleted card: "${card.title}"`;
			}
		});
	}
}
