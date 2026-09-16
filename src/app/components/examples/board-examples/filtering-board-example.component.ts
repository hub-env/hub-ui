import { Component, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HubBoardComponent, Board } from '../../../../../projects/board/src/public-api';
import { MOCK_BOARD } from '../../../data/board-mock.data';
import { HighlightModule } from 'ngx-highlightjs';
import { ExampleContainerComponent } from '../../shared/example-container/example-container.component';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-filtering-board-example',
	standalone: true,
	imports: [
		FormsModule,
		HubBoardComponent,
		HighlightModule,
		ExampleContainerComponent,
		TranslatePipe,
		HubButtonComponent,
		HubPanelComponent
	],
	template: `
		<app-example-container title="Board - Filtering" description="Board con filtrado simple por texto">
			<div slot="demo">
				<hub-panel class="mb-3">
					<div>
						<div class="row">
							<div class="col-md-6">
								<label class="form-label">Filtrar por texto</label>
								<input
									type="text"
									class="form-control"
									placeholder="Buscar en títulos..."
									[(ngModel)]="searchText"
									(ngModelChange)="updateFilter()"
								/>
							</div>
							<div class="col-md-6 d-flex align-items-end">
								<button hubButton variant="outline" color="secondary" (click)="clearFilter()">
									Limpiar filtro
								</button>
							</div>
						</div>
					</div>
				</hub-panel>

				<hub-board [board]="filteredBoard"></hub-board>
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
export class FilteringBoardExampleComponent {
	searchText = '';
	originalBoard: Board<any> = { ...MOCK_BOARD };
	filteredBoard: Board<any> = { ...MOCK_BOARD };

	templateCode = `<input 
  type="text" 
  class="form-control" 
  placeholder="Buscar en títulos..."
  [(ngModel)]="searchText"
  (ngModelChange)="updateFilter()">

<hub-board [board]="filteredBoard"></hub-board>`;

	componentCode = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubBoardComponent, Board } from 'projects/board/src/public-api';

@Component({
  selector: 'app-filtering-example',
  standalone: true,
  imports: [FormsModule, HubBoardComponent],
  template: \`<!-- template code -->\`
})
export class FilteringBoardExampleComponent {
  searchText = '';
  originalBoard: Board<any> = { /* mock data */ };
  filteredBoard: Board<any> = { /* filtered data */ };
  
  updateFilter() {
    this.filteredBoard = {
      ...this.originalBoard,
      columns: this.originalBoard.columns?.map(column => ({
        ...column,
        cards: column.cards.filter(card =>
          card.title.toLowerCase().includes(this.searchText.toLowerCase())
        )
      })) || []
    };
  }
  
  clearFilter() {
    this.searchText = '';
    this.updateFilter();
  }
}`;

	updateFilter() {
		this.filteredBoard = {
			...this.originalBoard,
			columns:
				this.originalBoard.columns?.map((column) => ({
					...column,
					cards: column.cards.filter((card) => card.title.toLowerCase().includes(this.searchText.toLowerCase()))
				})) || []
		};
	}

	clearFilter() {
		this.searchText = '';
		this.updateFilter();
	}
}
