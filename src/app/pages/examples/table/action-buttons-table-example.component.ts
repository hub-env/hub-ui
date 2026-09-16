import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Action buttons table example component
 * Demonstrates adding action buttons to table rows with conditional visibility
 */
@Component({
	selector: 'app-action-buttons-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<hub-table [data]="users" [headers]="headers"> </hub-table>

		@if (actionLog().length > 0) {
			<div class="alert alert-info mt-3">
				<h6>Recent Actions:</h6>
				<ul class="mb-0">
					@for (log of actionLog(); track $index) {
						<li>{{ log }}</li>
					}
				</ul>
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ActionButtonsTableExampleComponent {
	/**
	 * Sample user data for the table
	 */
	users = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Inactive' },
		{ id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', status: 'Active' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'Active' }
	];

	/**
	 * Action log to track button clicks
	 */
	actionLog = signal<string[]>([]);

	/**
	 * Table headers configuration with action buttons
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' },
		{ property: 'status', title: 'Status' },
		{
			property: 'actions',
			title: 'Actions',
			onlyButtons: true,
			buttons: [
				{
					icon: 'bi bi-eye',
					title: 'View',
					classlist: 'btn btn-primary',
					handler: (event: any) => this.viewUser(event.data)
				},
				{
					icon: 'bi bi-pencil',
					title: 'Edit',
					classlist: 'btn btn-warning',
					handler: (event: any) => this.editUser(event.data),
					// Offered but refused: editing an inactive user is a real action of this
					// screen, it just has nothing to act on. Hiding it would change the column's
					// shape row by row and say nothing about why. `tooltip` takes no predicate, so it
					// states the rule rather than this row's reason - true on every row either way.
					disabled: (row: any) => row.data.status === 'Inactive',
					tooltip: 'Inactive users cannot be edited'
				},
				{
					icon: 'bi bi-trash',
					title: 'Delete',
					classlist: 'btn btn-danger',
					handler: (event: any) => this.deleteUser(event.data),
					hidden: (row: any) => row.data.role === 'Admin'
				}
			]
		}
	];

	/**
	 * View user action
	 */
	viewUser(user: any): void {
		this.logAction(`Viewed user: ${user.name}`);
	}

	/**
	 * Edit user action
	 */
	editUser(user: any): void {
		this.logAction(`Edited user: ${user.name}`);
	}

	/**
	 * Delete user action
	 */
	deleteUser(user: any): void {
		this.logAction(`Deleted user: ${user.name}`);
		this.users = this.users.filter((u) => u.id !== user.id);
	}

	/**
	 * Log an action
	 */
	private logAction(message: string): void {
		this.actionLog.update((logs) => [message, ...logs].slice(0, 5));
	}

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table
  [data]="users"
  [headers]="headers">
</hub-table>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-action-buttons-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="users"
      [headers]="headers">
    </hub-table>
  \`
})
export class ActionButtonsTableComponent {
  actionLog = signal<string[]>([]);

  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Name' },
    { property: 'role', title: 'Role' },
    { property: 'status', title: 'Status' },
    {
      property: 'actions',
      title: 'Actions',
      onlyButtons: true,
      buttons: [
        {
          icon: 'bi bi-eye',
          title: 'View',
          classlist: 'btn btn-primary',
          handler: (event: any) => this.viewUser(event.data)
        },
        {
          icon: 'bi bi-pencil',
          title: 'Edit',
          classlist: 'btn btn-warning',
          handler: (event: any) => this.editUser(event.data),
          // Offered but refused. \`hidden\` says the action does not exist here;
          // \`disabled\` says it exists and cannot be taken right now.
          disabled: (row: any) => row.data.status === 'Inactive',
          tooltip: 'Inactive users cannot be edited'
        },
        {
          icon: 'bi bi-trash',
          title: 'Delete',
          classlist: 'btn btn-danger',
          handler: (event: any) => this.deleteUser(event.data),
          // Hide delete button for Admin users
          hidden: (row: any) => row.data.role === 'Admin'
        }
      ]
    }
  ];

  viewUser(user: any): void {
    console.log('View', user);
  }

  editUser(user: any): void {
    console.log('Edit', user);
  }

  deleteUser(user: any): void {
    this.users = this.users.filter(u => u.id !== user.id);
  }
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'Active' }
];`;
}
