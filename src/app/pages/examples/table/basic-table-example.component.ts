import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-basic-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-table [data]="users" [headers]="headers" [options]="{ striped: 'rows-odd', hoverableRows: true }"> </hub-table>
	`
})
export class BasicTableExampleComponent {
	users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' }
	];

	headers: any[] = [
		{ property: 'id', title: 'ID', align: 'center' as const },
		{ property: 'name', title: 'Name', icon: 'fa-solid fa-user' },
		{ property: 'email', title: 'Email', icon: 'fa-solid fa-envelope' },
		{ property: 'role', title: 'Role', align: 'end' as const }
	];

	static readonly templateCode = `<hub-table 
  [data]="users" 
  [headers]="headers"
  [options]="{ striped: 'rows-odd', hoverableRows: true }">
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-basic-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table 
      [data]="users" 
      [headers]="headers"
      [options]="{ striped: 'rows-odd', hoverableRows: true }">
    </hub-table>
  \`,
})
export class BasicTableExampleComponent {
  users = [...];

  headers = [
    { property: 'id', title: 'ID', align: 'center' },
    { property: 'name', title: 'Name', icon: 'fa-solid fa-user' },
    { property: 'email', title: 'Email', icon: 'fa-solid fa-envelope' },
    { property: 'role', title: 'Role', align: 'end' }];
}`;
}
