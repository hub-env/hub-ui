import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginableActionButton, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Batch actions table example component.
 * Demonstrates using the batchActions input for bulk operations on selected rows.
 */
@Component({
	selector: 'app-batch-actions-table-example',
	standalone: true,
	imports: [HubTableComponent, FormsModule, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<!-- DEMO INTERACTIVA -->
		<hub-table
			[data]="users"
			[headers]="headers"
			[selectable]="true"
			[batchActions]="batchActions"
			[(ngModel)]="selectedUsers"
		>
		</hub-table>

		@if (actionLog().length > 0) {
			<div class="mt-3">
				<h6>Action Log:</h6>
				<ul class="list-group">
					@for (log of actionLog(); track $index) {
						<li class="list-group-item">
							<hub-badge color="secondary" shape="rounded">{{ log.timestamp }}</hub-badge>
							<span class="ms-2">{{ log.message }}</span>
						</li>
					}
				</ul>
			</div>
		}
	`
})
export class BatchActionsTableExampleComponent {
	// ===========================================
	// DATOS PARA LA DEMO
	// ===========================================

	/**
	 * Sample user data for the table
	 */
	users = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', status: 'Active' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', status: 'Inactive' },
		{ id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', status: 'Active' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', status: 'Inactive' }
	];

	/**
	 * Table headers configuration
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'status', title: 'Status' }
	];

	/**
	 * Selected users array (two-way binding)
	 */
	selectedUsers = signal<any[]>([]);

	/**
	 * Action log to track batch operations
	 */
	actionLog = signal<{ timestamp: string; message: string }[]>([]);

	/**
	 * Batch actions configuration using the table's batchActions input.
	 * These buttons appear in the table toolbar when rows are selected.
	 * Each handler receives an array of all selected items.
	 */
	batchActions: PaginableActionButton[] = [
		{
			icon: 'bi bi-check-circle',
			title: 'Activate',
			tooltip: 'Activate selected users',
			classlist: 'btn btn-primary',
			handler: (items: readonly any[]) => this.activateSelected(items)
		},
		{
			icon: 'bi bi-x-circle',
			title: 'Deactivate',
			tooltip: 'Deactivate selected users',
			classlist: 'btn btn-warning',
			handler: (items: readonly any[]) => this.deactivateSelected(items)
		},
		{
			icon: 'bi bi-download',
			title: 'Export',
			tooltip: 'Export selected users to CSV',
			classlist: 'btn btn-info',
			handler: (items: readonly any[]) => this.exportSelected(items)
		},
		{
			icon: 'bi bi-trash',
			title: 'Delete',
			tooltip: 'Delete selected users',
			classlist: 'btn btn-danger',
			handler: (items: readonly any[]) => this.deleteSelected(items)
		}
	];

	/**
	 * Activate selected users
	 */
	activateSelected(items: readonly any[]): void {
		items.forEach((user) => {
			user.status = 'Active';
		});
		this.logAction(`Activated ${items.length} user(s)`);
		this.selectedUsers.set([]);
	}

	/**
	 * Deactivate selected users
	 */
	deactivateSelected(items: readonly any[]): void {
		items.forEach((user) => {
			user.status = 'Inactive';
		});
		this.logAction(`Deactivated ${items.length} user(s)`);
		this.selectedUsers.set([]);
	}

	/**
	 * Export selected users
	 */
	exportSelected(items: readonly any[]): void {
		this.logAction(`Exported ${items.length} user(s) to CSV`);
		this.selectedUsers.set([]);
	}

	/**
	 * Delete selected users
	 */
	deleteSelected(items: readonly any[]): void {
		const selectedIds = items.map((u) => u.id);
		this.users = this.users.filter((user) => !selectedIds.includes(user.id));
		this.logAction(`Deleted ${items.length} user(s)`);
		this.selectedUsers.set([]);
	}

	/**
	 * Log an action with timestamp
	 */
	private logAction(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		this.actionLog.update((logs) => [{ timestamp, message }, ...logs].slice(0, 5));
	}

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	/**
	 * Código del template HTML para mostrar en pestaña "HTML"
	 * El ExampleViewer lo extrae automáticamente
	 */
	static readonly templateCode = `<hub-table
  [data]="users"
  [headers]="headers"
  [selectable]="true"
  [batchActions]="batchActions"
  [(ngModel)]="selectedUsers">
</hub-table>`;

	/**
	 * Código del componente TypeScript para mostrar en pestaña "TS"
	 * El ExampleViewer lo extrae automáticamente
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubTableComponent, PaginableActionButton } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-batch-actions-table',
  standalone: true,
  imports: [HubTableComponent, FormsModule],
  template: \`
    <hub-table
      [data]="users"
      [headers]="headers"
      [selectable]="true"
      [batchActions]="batchActions"
      [(ngModel)]="selectedUsers">
    </hub-table>
  \`
})
export class BatchActionsTableComponent {
  selectedUsers = signal<any[]>([]);

  users = [
    { id: 1, name: 'John Doe', status: 'Active' },
    { id: 2, name: 'Jane Smith', status: 'Inactive' },
  ];

  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Name' },
    { property: 'status', title: 'Status' }
  ];

  // Batch actions appear in the table toolbar when rows are selected.
  // Each handler receives the array of selected items.
  batchActions: PaginableActionButton[] = [
    {
      icon: 'bi bi-check-circle',
      title: 'Activate',
      tooltip: 'Activate selected users',
      classlist: 'btn btn-primary',
      handler: (items: readonly any[]) => this.activateSelected(items)
    },
    {
      icon: 'bi bi-x-circle',
      title: 'Deactivate',
      classlist: 'btn btn-warning',
      handler: (items: readonly any[]) => this.deactivateSelected(items)
    },
    {
      icon: 'bi bi-trash',
      title: 'Delete',
      classlist: 'btn btn-danger',
      handler: (items: readonly any[]) => this.deleteSelected(items)
    }
  ];

  activateSelected(items: readonly any[]): void {
    items.forEach(user => user.status = 'Active');
    this.selectedUsers.set([]);
  }

  deactivateSelected(items: readonly any[]): void {
    items.forEach(user => user.status = 'Inactive');
    this.selectedUsers.set([]);
  }

  deleteSelected(items: readonly any[]): void {
    const selectedIds = items.map(u => u.id);
    this.users = this.users.filter(u => !selectedIds.includes(u.id));
    this.selectedUsers.set([]);
  }
}`;
}
