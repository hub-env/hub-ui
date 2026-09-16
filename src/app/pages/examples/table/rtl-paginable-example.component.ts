import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	HubListComponent,
	PaginableActionButton,
	PaginableTableOptions,
	SelectionTypes,
	HubTableComponent
} from 'ng-hub-ui-paginable';

/**
 * Demonstrates right-to-left rendering for both table and list paginable components.
 */
@Component({
	selector: 'app-rtl-paginable-example',
	standalone: true,
	imports: [HubTableComponent, HubListComponent, FormsModule],
	template: `
		<div class="rtl-demo__controls">
			<label class="rtl-demo__label" for="rtlToggle">RTL</label>
			<input id="rtlToggle" type="checkbox" [checked]="rtl()" (change)="onRtlToggle($any($event.target).checked)" />
		</div>

		<hub-table
			[data]="tableRows"
			[headers]="tableHeaders"
			[selectable]="SelectionTypes.Multiple"
			[batchActions]="tableBatchActions"
			[(ngModel)]="selectedTableRows"
			[page]="1"
			[perPage]="10"
			[totalItems]="tableRows.length"
			[options]="tableOptions()"
		></hub-table>

		<hr class="my-4" />

		<hub-list
			[items]="listItems"
			[bindLabel]="'title'"
			[selectable]="SelectionTypes.Multiple"
			[batchActions]="listBatchActions"
			[(ngModel)]="selectedListItems"
			[paginate]="true"
			[page]="1"
			[perPage]="10"
			[totalItems]="listItems.length"
			[options]="listOptions()"
		></hub-list>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.rtl-demo__controls {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				margin-bottom: 0.75rem;
			}

			.rtl-demo__label {
				font-weight: 600;
				font-size: 0.875rem;
			}
		`
	]
})
export class RtlPaginableExampleComponent {
	/** Controls RTL mode used by both demo instances. */
	readonly rtl = signal(true);
	/** Exposes selection type enum to the template. */
	readonly SelectionTypes = SelectionTypes;

	/** Header configuration used by the table demo. */
	readonly tableHeaders = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' }
	];

	/** Table rows rendered in the table demo. */
	readonly tableRows = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Reviewer' }
	];

	/** List items rendered in the list demo. */
	readonly listItems = [
		{ id: 1, title: 'Start the project kickoff' },
		{ id: 2, title: 'Prepare requirements document' },
		{ id: 3, title: 'Review API contract' },
		{ id: 4, title: 'Plan deployment checklist' }
	];

	/** Stores selected rows for list batch actions. */
	readonly selectedTableRows = signal<Array<{ id: number; name: string; email: string; role: string }>>([]);
	/** Stores selected rows for list batch actions. */
	readonly selectedListItems = signal<Array<{ id: number; title: string }>>([]);

	/** Demonstrates table batch actions in RTL layout. */
	readonly tableBatchActions: PaginableActionButton[] = [
		{
			title: 'Activate',
			icon: 'bi bi-check-circle',
			classlist: 'btn btn-primary',
			handler: () => this.selectedTableRows.set([])
		},
		{
			title: 'Deactivate',
			icon: 'bi bi-x-circle',
			classlist: 'btn btn-warning',
			handler: () => this.selectedTableRows.set([])
		},
		{
			title: 'Export',
			icon: 'bi bi-download',
			classlist: 'btn btn-info',
			handler: () => this.selectedTableRows.set([])
		},
		{
			title: 'Delete',
			icon: 'bi bi-trash',
			classlist: 'btn btn-danger',
			handler: () => this.selectedTableRows.set([])
		}
	];

	/** Demonstrates list batch actions in RTL layout. */
	readonly listBatchActions: PaginableActionButton[] = [
		{
			title: 'Archive',
			icon: 'bi bi-archive',
			classlist: 'btn btn-outline-secondary',
			handler: () => this.selectedListItems.set([])
		},
		{
			title: 'Mark done',
			icon: 'bi bi-check2-circle',
			classlist: 'btn btn-outline-primary',
			handler: () => this.selectedListItems.set([])
		}
	];

	/**
	 * Returns the options object used by the table demo.
	 * The object is recomputed to keep a stable API while toggling RTL.
	 */
	readonly tableOptions = signal<PaginableTableOptions>({
		searchable: true,
		hoverableRows: true,
		rtl: true
	});

	/**
	 * Returns the options object used by the list demo.
	 * The object is recomputed to keep a stable API while toggling RTL.
	 */
	readonly listOptions = signal<PaginableTableOptions>({
		searchable: true,
		collapsed: true,
		rtl: true
	});

	/**
	 * Updates both table and list options when the RTL toggle changes.
	 *
	 * @param enabled Whether RTL mode should be enabled.
	 */
	onRtlToggle(enabled: boolean): void {
		this.rtl.set(enabled);
		this.tableOptions.update((value) => ({ ...value, rtl: enabled }));
		this.listOptions.update((value) => ({ ...value, rtl: enabled }));
	}

	/** Template snippet shown in the example viewer HTML tab. */
	static readonly templateCode = `<hub-table
		[data]="tableRows"
		[headers]="tableHeaders"
		[selectable]="SelectionTypes.Multiple"
		[batchActions]="tableBatchActions"
		[(ngModel)]="selectedTableRows"
		[options]="{ searchable: true, hoverableRows: true, rtl: true }"
		[page]="1"
		[perPage]="10"
		[totalItems]="tableRows.length">
		</hub-table>

		<hr class="my-4" />

<hub-list
  [items]="listItems"
  [bindLabel]="'title'"
  [selectable]="SelectionTypes.Multiple"
  [batchActions]="listBatchActions"
  [(ngModel)]="selectedListItems"
  [paginate]="true"
  [options]="{ searchable: true, collapsed: true, rtl: true }"
  [page]="1"
		[perPage]="10"
		[totalItems]="listItems.length">
		</hub-list>`;

	/** TypeScript snippet shown in the example viewer TS tab. */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-rtl-paginable-example',
  standalone: true,
  imports: [HubTableComponent, HubListComponent],
  template: \`...\`
})
export class RtlPaginableExampleComponent {}`;

	/** CSS snippet shown in the example viewer CSS tab. */
	static readonly cssCode = `/* Enable RTL through options.rtl on table and list components. */`;
}
