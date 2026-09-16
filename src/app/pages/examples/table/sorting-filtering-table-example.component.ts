import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-sorting-filtering-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-table [data]="users" [headers]="headers" [ordination]="{ property: 'name', direction: 'asc' }" [searchable]="true">
		</hub-table>
	`
})
export class SortingFilteringTableExampleComponent {
	users = [
		{ id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
		{ id: 2, name: 'Jane Smith', role: 'Editor', status: 'Inactive' },
		{ id: 3, name: 'Bob Johnson', role: 'User', status: 'Pending' },
		{ id: 4, name: 'Alice Brown', role: 'Editor', status: 'Active' },
		{ id: 5, name: 'Charlie Wilson', role: 'User', status: 'Deleted' }
	];

	headers: any[] = [
		{ property: 'id', title: 'ID', sortable: true },
		{ property: 'name', title: 'Name', sortable: true, filter: { type: 'text', mode: 'row' } },
		{ property: 'role', title: 'Role', sortable: true, filter: { type: 'text', mode: 'row' } },
		{ property: 'status', title: 'Status', sortable: true }
	];

	static readonly templateCode = `<hub-table 
  [data]="users" 
  [headers]="headers"
  [ordination]="{ property: 'name', direction: 'asc' }"
  [searchable]="true">
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-sorting-filtering-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table 
      [data]="users" 
      [headers]="headers"
      [ordination]="{ property: 'name', direction: 'asc' }"
      [searchable]="true">
    </hub-table>
  \`,
})
export class SortingFilteringTableExampleComponent {
  users = [...];
  headers = [
    { property: 'id', title: 'ID', sortable: true },
    { property: 'name', title: 'Name', sortable: true, filter: { type: 'text' } },
    { property: 'role', title: 'Role', sortable: true, filter: { type: 'text' } },
    { property: 'status', title: 'Status', sortable: true }];
}`;
}
