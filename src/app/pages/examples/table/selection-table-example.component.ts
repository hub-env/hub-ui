import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginableActionButton, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Selection table example component.
 * Demonstrates single and multiple row selection with batch actions.
 */
@Component({
	selector: 'app-selection-table-example',
	standalone: true,
	imports: [HubTableComponent, FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-3">
			<label class="form-label fw-bold">Selection Mode:</label>
			<div class="d-flex gap-1" role="group">
				<button
					type="button"
					hubButton
					size="sm"
					color="primary"
					[variant]="!isMultiple() ? 'solid' : 'outline'"
					(click)="setSelectionMode('single')"
				>
					Single
				</button>
				<button
					type="button"
					hubButton
					size="sm"
					color="primary"
					[variant]="isMultiple() ? 'solid' : 'outline'"
					(click)="setSelectionMode('multiple')"
				>
					Multiple
				</button>
			</div>
		</div>

		<hub-table
			[data]="users"
			[headers]="headers"
			[selectable]="true"
			[multiple]="isMultiple()"
			[batchActions]="batchActions"
			[(ngModel)]="selectedItems"
		>
		</hub-table>

		@if (actionLog().length > 0) {
			<div class="mt-3 alert alert-info"><strong>Last action:</strong> {{ actionLog()[0] }}</div>
		}
	`
})
export class SelectionTableExampleComponent {
	/**
	 * Whether multiple selection is enabled
	 */
	isMultiple = signal(true);

	/**
	 * Selected items array
	 */
	selectedItems = signal<any[]>([]);

	/**
	 * Action log
	 */
	actionLog = signal<string[]>([]);

	/**
	 * Sample user data
	 */
	users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User' }
	];

	/**
	 * Table headers
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' }
	];

	/**
	 * Batch actions configuration - these appear in the table toolbar when rows are selected.
	 * The handler receives an array of selected items.
	 */
	batchActions: PaginableActionButton[] = [
		{
			icon: 'bi bi-trash',
			title: 'Delete',
			tooltip: 'Delete selected items',
			classlist: 'btn btn-danger',
			handler: (items: readonly any[]) => {
				const ids = items.map((i) => i.id);
				this.users = this.users.filter((u) => !ids.includes(u.id));
				this.logAction(`Deleted ${items.length} item(s)`);
				this.selectedItems.set([]);
			}
		},
		{
			icon: 'bi bi-download',
			title: 'Export',
			tooltip: 'Export selected items',
			classlist: 'btn btn-primary',
			handler: (items: readonly any[]) => {
				this.logAction(`Exported ${items.length} item(s) to CSV`);
				this.selectedItems.set([]);
			}
		}
	];

	/**
	 * Set selection mode
	 */
	setSelectionMode(mode: 'single' | 'multiple'): void {
		this.isMultiple.set(mode === 'multiple');
		this.selectedItems.set([]);
	}

	/**
	 * Log action
	 */
	private logAction(message: string): void {
		this.actionLog.update((logs) => [message, ...logs].slice(0, 3));
	}

	static readonly templateCode = `<hub-table
  [data]="users"
  [headers]="headers"
  [selectable]="true"
  [multiple]="isMultiple()"
  [batchActions]="batchActions"
  [(ngModel)]="selectedItems">
</hub-table>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTableComponent, PaginableActionButton } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-selection-table',
  standalone: true,
  imports: [HubTableComponent, FormsModule],
  template: \`
    <hub-table
      [data]="users"
      [headers]="headers"
      [selectable]="true"
      [multiple]="isMultiple()"
      [batchActions]="batchActions"
      [(ngModel)]="selectedItems">
    </hub-table>
  \`
})
export class SelectionTableComponent {
  isMultiple = signal(true);
  selectedItems = signal<any[]>([]);

  // Batch actions appear in toolbar when items are selected
  batchActions: Array<PaginableActionButton> = [
    {
      icon: 'bi bi-trash',
      title: 'Delete',
      tooltip: 'Delete selected items',
      classlist: 'btn btn-danger',
      handler: (items: readonly any[]) => {
        // items contains all selected rows
        this.deleteItems(items);
      }
    },
    {
      icon: 'bi bi-download',
      title: 'Export',
      classlist: 'btn btn-primary',
      handler: (items: readonly any[]) => {
        this.exportItems(items);
      }
    }
  ];

  setSelectionMode(mode: 'single' | 'multiple'): void {
    this.isMultiple.set(mode === 'multiple');
    this.selectedItems.set([]);
  }
}`;
}
