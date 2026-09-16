import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubPaginableTableCellDirective, HubPaginableTableHeaderDirective, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

@Component({
	selector: 'app-custom-templates-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPaginableTableCellDirective, HubPaginableTableHeaderDirective, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-table [data]="users" [headers]="headers">
			<!-- Custom Header for 'status' column -->
			<ng-template paginableTableHeader [header]="'status'">
				<span class="text-uppercase fw-bold"><i class="fa-solid fa-flag me-1"></i> Status</span>
			</ng-template>

			<!-- Custom Cell for 'role' column -->
			<ng-template paginableTableCell [header]="'role'" let-user="item">
				<hub-badge shape="rounded" [class]="user.role === 'Admin' ? 'bg-dark' : 'bg-primary'">
					{{ user.role }}
				</hub-badge>
			</ng-template>

			<!-- Custom Cell for 'status' column -->
			<ng-template paginableTableCell [header]="'status'" let-user="item">
				<div class="d-flex align-items-center">
					<span
						class="rounded-circle me-2"
						[style.width.px]="10"
						[style.height.px]="10"
						[class]="user.status === 'Active' ? 'bg-success' : 'bg-danger'"
					></span>
					{{ user.status }}
				</div>
			</ng-template>
		</hub-table>
	`
})
export class CustomTemplatesTableExampleComponent {
	users = [
		{ id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
		{ id: 2, name: 'Jane Smith', role: 'Editor', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', role: 'User', status: 'Inactive' }
	];

	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' },
		{ property: 'status', title: 'Status' }
	];

	static readonly templateCode = `<hub-table [data]="users" [headers]="headers">
  <!-- Custom Header -->
  <ng-template paginableTableHeader [header]="'status'">
    <i class="fa-solid fa-flag me-1"></i> STATUS
  </ng-template>

  <!-- Custom Cell -->
  <ng-template paginableTableCell [header]="'role'" let-user="item">
    <hub-badge shape="rounded" [class]="user.role === 'Admin' ? 'bg-dark' : 'bg-primary'">
      {{user.role}}
    </hub-badge>
  </ng-template>
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent, HubPaginableTableCellDirective, HubPaginableTableHeaderDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-custom-templates-table-example',
  standalone: true,
  imports: [HubTableComponent, HubPaginableTableCellDirective, HubPaginableTableHeaderDirective],
  template: \`...\`
})
export class CustomTemplatesTableExampleComponent {
  // ...
}`;
}
