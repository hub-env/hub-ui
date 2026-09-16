import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TableBreakpoint, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-responsive-states-table-example',
	standalone: true,
	imports: [HubTableComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-3 d-flex gap-2">
			<button hubButton variant="outline" color="primary" size="sm" (click)="isLoading = !isLoading">
				Toggle Loading: {{ isLoading }}
			</button>
			<button hubButton variant="outline" color="secondary" size="sm" (click)="showData = !showData">
				Toggle Data: {{ showData ? 'Full' : 'Empty' }}
			</button>
		</div>

		<hub-table [data]="showData ? users : []" [headers]="headers" [loading]="isLoading" [responsive]="breakpoint">
		</hub-table>
	`
})
export class ResponsiveStatesTableExampleComponent {
	isLoading = false;
	showData = true;
	breakpoint = TableBreakpoint.Small;

	users = [
		{ id: 1, name: 'John Doe', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', role: 'Editor' }
	];

	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' }
	];

	static readonly templateCode = `<hub-table 
  [data]="users" 
  [headers]="headers"
  [loading]="isLoading"
  [responsive]="TableBreakpoint.Small">
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent, TableBreakpoint } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-responsive-states-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`...\`
})
export class ResponsiveStatesTableExampleComponent {
  isLoading = true;
  breakpoint = TableBreakpoint.Small;
  users = [...];
}`;
}
