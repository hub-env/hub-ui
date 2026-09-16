import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, FormsModule],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-list
			[items]="items"
			[paginate]="true"
			[perPage]="perPage"
			[totalItems]="items.length"
			[bindLabel]="'name'"
			[options]="{ hoverableRows: true }"
			[selectable]="selectionTypes.Multiple"
			[(ngModel)]="selectedItems"
		>
			<ng-template listItemTpt let-item="data">
				<div class="d-flex align-items-center p-2">
					<div
						class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
						style="width: 40px; height: 40px;"
					>
						{{ item.name.charAt(0) }}
					</div>
					<div>
						<h6 class="mb-0">{{ item.name }}</h6>
						<small class="text-muted">{{ item.email }}</small>
					</div>
				</div>
			</ng-template>
		</hub-list>

		<div class="mt-3 p-2 bg-light border rounded"><strong>Selected:</strong> {{ selectedItems.length }} items</div>
	`
})
export class ListExampleComponent {
	readonly selectionTypes = SelectionTypes;
	selectedItems: any[] = [];
	perPage = 10;

	items = [
		{ id: 1, name: 'John Doe', email: 'john@example.com' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie@example.com' },
		{ id: 6, name: 'Diana Prince', email: 'diana@example.com' },
		{ id: 7, name: 'Evan Brooks', email: 'evan@example.com' },
		{ id: 8, name: 'Fiona Green', email: 'fiona@example.com' }
	];

	static readonly templateCode = `<hub-list 
  [items]="items" 
  [paginate]="true" 
  [perPage]="10"
  [totalItems]="items.length"
  [bindLabel]="'name'"
  [selectable]="selectionTypes.Multiple"
  [(ngModel)]="selectedItems">
  
  <ng-template listItemTpt let-item="data">
    <div class="list-item">
      <h6>{{item.name}}</h6>
      <p>{{item.email}}</p>
    </div>
  </ng-template>
</hub-list>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective, FormsModule],
  template: \`...\`
})
export class ListExampleComponent {
  readonly selectionTypes = SelectionTypes;
  selectedItems: any[] = [];
  perPage = 10;
  items = [...];
}`;
}
