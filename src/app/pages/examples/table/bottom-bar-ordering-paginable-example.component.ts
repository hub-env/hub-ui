import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubListComponent, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Bottom bar ordering example for table and list.
 * Demonstrates how to reorder paginator, settings and info blocks with CSS variables.
 */
@Component({
	selector: 'app-bottom-bar-ordering-paginable-example',
	standalone: true,
	imports: [HubTableComponent, HubListComponent],
	template: `
		<div class="demo-grid">
			<h6>Table bottom bar ordering</h6>
			<hub-table
				class="demo-table-ordering"
				[data]="tableRows"
				[headers]="tableHeaders"
				[page]="1"
				[perPage]="2"
				[totalItems]="tableRows.length"
			></hub-table>

			<hr />

			<h6>List bottom bar ordering</h6>
			<hub-list
				class="demo-list-ordering"
				[items]="listItems"
				[bindLabel]="'name'"
				[paginate]="true"
				[page]="1"
				[perPage]="2"
				[totalItems]="listItems.length"
			></hub-list>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-grid {
				display: grid;
				gap: 1rem;
			}

			.demo-card {
				display: grid;
				gap: 0.75rem;
				padding: 1rem;
				border: 1px solid #e2e8f0;
				border-radius: 0.75rem;
				background: var(--hub-sys-surface-page, #ffffff);
			}

			.demo-card h6 {
				margin: 0;
				font-weight: 700;
			}

			.demo-table-ordering {
				--hub-table-bottom-bar-justify-content: flex-start;
				--hub-table-bottom-bar-gap: 0.75rem;
				--hub-table-bottom-bar-info-order: 1;
				--hub-table-bottom-bar-settings-order: 2;
				--hub-table-bottom-bar-paginator-order: 3;
			}

			.demo-list-ordering {
				--hub-list-bottom-bar-justify-content: flex-start;
				--hub-list-bottom-bar-gap: 0.75rem;
				--hub-list-bottom-bar-info-order: 1;
				--hub-list-bottom-bar-settings-order: 2;
				--hub-list-bottom-bar-paginator-order: 3;
			}
		`
	]
})
export class BottomBarOrderingPaginableExampleComponent {
	/**
	 * Demo data for the table component.
	 */
	tableRows = [
		{ id: 1, name: 'John Doe', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', role: 'User' }
	];

	/**
	 * Column configuration for the table demo.
	 */
	tableHeaders = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' }
	];

	/**
	 * Demo items for the list component.
	 */
	listItems = [
		{ id: 1, name: 'Task A' },
		{ id: 2, name: 'Task B' },
		{ id: 3, name: 'Task C' }
	];

	/**
	 * HTML snippet displayed in the example viewer.
	 */
	static readonly templateCode = `<hub-table
  class="demo-table-ordering"
  [data]="tableRows"
  [headers]="tableHeaders"
  [page]="1"
  [perPage]="10"
  [totalItems]="tableRows.length">
</hub-table>

<hr />

<hub-list
  class="demo-list-ordering"
  [items]="listItems"
  [bindLabel]="'name'"
  [paginate]="true"
  [page]="1"
  [perPage]="10"
  [totalItems]="listItems.length">
</hub-list>`;

	/**
	 * TypeScript snippet displayed in the example viewer.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-bottom-bar-ordering-paginable-example',
  standalone: true,
  imports: [HubTableComponent, HubListComponent],
  template: \`...\`
})
export class BottomBarOrderingPaginableExampleComponent {
  tableRows = [...];
  tableHeaders = [...];
  listItems = [...];
}`;

	/**
	 * CSS snippet displayed in the example viewer.
	 */
	static readonly cssCode = `.demo-table-ordering {
  --hub-table-bottom-bar-justify-content: flex-start;
  --hub-table-bottom-bar-gap: 0.75rem;
  --hub-table-bottom-bar-info-order: 1;
  --hub-table-bottom-bar-settings-order: 2;
  --hub-table-bottom-bar-paginator-order: 3;
}

.demo-list-ordering {
  --hub-list-bottom-bar-justify-content: flex-start;
  --hub-list-bottom-bar-gap: 0.75rem;
  --hub-list-bottom-bar-info-order: 1;
  --hub-list-bottom-bar-settings-order: 2;
  --hub-list-bottom-bar-paginator-order: 3;
}`;
}
