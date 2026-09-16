import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubPaginableTableExpandingRowDirective, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-expandable-sticky-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPaginableTableExpandingRowDirective],
	template: `
		<hub-table [data]="users" [headers]="headers">
			<ng-template paginableTableExpandingRow let-item="item">
				<div class="p-3 bg-light border-top">
					<strong>Details for {{ item.data.name }}:</strong>
					<p class="mb-0">
						Extra information about this user can be displayed here, like biographical details, recent activities,
						or related entities.
					</p>
				</div>
			</ng-template>
		</hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.table-fixed-height {
				max-height: 400px;
			}
		`
	]
})
export class ExpandableStickyTableExampleComponent {
	users = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john@example.com',
			role: 'Admin',
			bio: 'Experienced developer and admin.',
			lastLogin: '2023-10-01 10:00'
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane@example.com',
			role: 'Editor',
			bio: 'Content specialist and editor.',
			lastLogin: '2023-10-02 11:00'
		},
		{
			id: 3,
			name: 'Bob Johnson',
			email: 'bob@example.com',
			role: 'User',
			bio: 'Regular platform user.',
			lastLogin: '2023-10-03 12:00'
		},
		{
			id: 4,
			name: 'Alice Brown',
			email: 'alice@example.com',
			role: 'Editor',
			bio: 'Creative writer and editor.',
			lastLogin: '2023-10-04 13:00'
		}
	];

	headers: any[] = [
		{ property: 'id', title: 'ID', sticky: 'start' as const },
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' },
		{ property: 'email', title: 'Email' },
		{ property: 'actions', title: 'Actions', sticky: 'end' as const }
	];

	static readonly templateCode = `<hub-table 
  [data]="users" 
  [headers]="headers">
  
  <ng-template paginableTableExpandingRow let-item="item">
    <div class="expanded-content">
      <h6>Detail: {{item.data.name}}</h6>
      <p>{{item.data.bio}}</p>
    </div>
  </ng-template>
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent, HubPaginableTableExpandingRowDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-expandable-sticky-table-example',
  standalone: true,
  imports: [HubTableComponent, HubPaginableTableExpandingRowDirective],
  template: \`...\`
})
export class ExpandableStickyTableExampleComponent {
  headers = [
    { property: 'id', title: 'ID', sticky: 'start' },
    { property: 'name', title: 'Name' },
    { property: 'actions', title: 'Actions', sticky: 'end' }];
  // ...
}`;
}
