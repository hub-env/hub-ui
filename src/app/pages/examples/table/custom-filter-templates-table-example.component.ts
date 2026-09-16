import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HubPaginableTableFilterDirective, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Custom filter templates: replacing the control a filter column draws, without taking over what
 * it filters.
 *
 * Three things have to line up for a template to be used, and all three are easy to miss:
 *
 * - The directive is `paginableTableFilter` (or its short alias `filterTpt`), it takes the column
 *   through `[header]`, and it is **standalone** — it has to be in the component's `imports` or it
 *   matches nothing and the table quietly draws its own control instead.
 * - The template is handed `formControl` and `header`, not a filter object. Writing to that
 *   control is what filters; reading `.value` is what keeps the control in step with a filter
 *   cleared from elsewhere.
 * - Only a **row-mode** filter renders a template. A `mode: 'menu'` column is drawn by the
 *   dropdown filter panel, which is a different surface with its own rules.
 *
 * The value written has to be one the column's own matching understands: `dropdown` compares the
 * cell against it as a string, which is why both controls below write a single value and clear it
 * with `null`.
 */
@Component({
	selector: 'app-custom-filter-templates-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPaginableTableFilterDirective],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-table [data]="orders" [headers]="headers" [searchable]="false">
			<!-- Status: a row of pills, one at a time, clicking the active one clears the filter -->
			<ng-template paginableTableFilter [header]="'status'" let-control="formControl">
				<div class="d-flex flex-wrap gap-1">
					@for (status of statuses; track status) {
						<button
							type="button"
							class="btn btn-sm"
							[class.btn-primary]="control.value === status"
							[class.btn-outline-secondary]="control.value !== status"
							(click)="toggle(control, status)"
						>
							{{ status }}
						</button>
					}
				</div>
			</ng-template>

			<!-- Priority: radio buttons, with an explicit "All" that clears the filter -->
			<ng-template paginableTableFilter [header]="'priority'" let-control="formControl">
				<div class="d-flex flex-wrap gap-3">
					<div class="form-check mb-0">
						<input
							class="form-check-input"
							type="radio"
							name="priorityFilter"
							id="priority-all"
							[checked]="!control.value"
							(change)="control.setValue(null)"
						/>
						<label class="form-check-label small" for="priority-all">All</label>
					</div>
					@for (priority of priorities; track priority) {
						<div class="form-check mb-0">
							<input
								class="form-check-input"
								type="radio"
								name="priorityFilter"
								[id]="'priority-' + priority"
								[checked]="control.value === priority"
								(change)="control.setValue(priority)"
							/>
							<label class="form-check-label small" [for]="'priority-' + priority">{{ priority }}</label>
						</div>
					}
				</div>
			</ng-template>
		</hub-table>
	`,
	styles: []
})
export class CustomFilterTemplatesTableExampleComponent {
	protected readonly statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

	protected readonly priorities = ['Low', 'Medium', 'High'];

	protected readonly orders = [
		{ id: 1001, customer: 'John Doe', product: 'Laptop', amount: 1299, status: 'Pending', priority: 'High' },
		{ id: 1002, customer: 'Jane Smith', product: 'Mouse', amount: 29, status: 'Shipped', priority: 'Low' },
		{ id: 1003, customer: 'Bob Johnson', product: 'Monitor', amount: 549, status: 'Delivered', priority: 'Medium' },
		{ id: 1004, customer: 'Alice Brown', product: 'Keyboard', amount: 89, status: 'Pending', priority: 'Medium' },
		{ id: 1005, customer: 'Charlie Wilson', product: 'Chair', amount: 399, status: 'Cancelled', priority: 'Low' },
		{ id: 1006, customer: 'Diana Martinez', product: 'Desk', amount: 799, status: 'Shipped', priority: 'High' },
		{ id: 1007, customer: 'Edward Taylor', product: 'Webcam', amount: 149, status: 'Delivered', priority: 'Low' },
		{ id: 1008, customer: 'Fiona Anderson', product: 'Headphones', amount: 199, status: 'Pending', priority: 'Medium' }
	];

	/**
	 * The two templated columns are declared `mode: 'row'`, which is the mode that renders a
	 * projected template at all, and `type: 'dropdown'`, which is the matching a value picked from
	 * a fixed set wants: the cell has to equal it, not merely contain it.
	 */
	protected readonly headers: Array<PaginableTableHeader> = [
		{ property: 'id', title: 'Order ID' },
		{ property: 'customer', title: 'Customer', filter: { type: 'text', mode: 'row' } },
		{ property: 'product', title: 'Product', filter: { type: 'text', mode: 'row' } },
		{ property: 'amount', title: 'Amount', filter: { type: 'number', mode: 'row' } },
		{ property: 'status', title: 'Status', filter: { type: 'dropdown', mode: 'row', options: this.statuses } },
		{ property: 'priority', title: 'Priority', filter: { type: 'dropdown', mode: 'row', options: this.priorities } }
	];

	/**
	 * Clicking the active pill clears the column instead of re-applying it, which is the only way
	 * out of a filter drawn as buttons rather than as a select with an empty option.
	 *
	 * @param control The column's filter control, handed over by the template context.
	 * @param status The pill that was clicked.
	 */
	protected toggle(control: FormControl, status: string): void {
		control.setValue(control.value === status ? null : status);
	}

	static readonly templateCode = `<hub-table [data]="orders" [headers]="headers">
  <!-- Row mode only: a menu filter is drawn by the dropdown panel, not from a template -->
  <ng-template paginableTableFilter [header]="'status'" let-control="formControl">
    <div class="d-flex flex-wrap gap-1">
      @for (status of statuses; track status) {
        <button
          type="button"
          class="btn btn-sm"
          [class.btn-primary]="control.value === status"
          [class.btn-outline-secondary]="control.value !== status"
          (click)="toggle(control, status)">
          {{ status }}
        </button>
      }
    </div>
  </ng-template>

  <ng-template paginableTableFilter [header]="'priority'" let-control="formControl">
    <div class="form-check">
      <input type="radio" name="priorityFilter" [checked]="!control.value"
             (change)="control.setValue(null)" />
      <label>All</label>
    </div>
    @for (priority of priorities; track priority) {
      <div class="form-check">
        <input type="radio" name="priorityFilter" [checked]="control.value === priority"
               (change)="control.setValue(priority)" />
        <label>{{ priority }}</label>
      </div>
    }
  </ng-template>
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HubPaginableTableFilterDirective, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  // The directive is standalone: leave it out and the template matches nothing,
  // and the table draws its own control with no error to say why.
  imports: [HubTableComponent, HubPaginableTableFilterDirective],
  templateUrl: './orders.component.html'
})
export class OrdersComponent {
  readonly statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  readonly priorities = ['Low', 'Medium', 'High'];

  readonly headers: Array<PaginableTableHeader> = [
    { property: 'id', title: 'Order ID' },
    { property: 'customer', title: 'Customer', filter: { type: 'text', mode: 'row' } },
    { property: 'status', title: 'Status', filter: { type: 'dropdown', mode: 'row', options: this.statuses } },
    { property: 'priority', title: 'Priority', filter: { type: 'dropdown', mode: 'row', options: this.priorities } }
  ];

  // Writing to the control is what filters; the value has to be one the column's own
  // matching understands, and null is how a column is cleared.
  toggle(control: FormControl, status: string): void {
    control.setValue(control.value === status ? null : status);
  }
}`;

	static readonly dataCode = `orders = [
  { id: 1001, customer: 'John Doe', product: 'Laptop', amount: 1299, status: 'Pending', priority: 'High' },
  { id: 1002, customer: 'Jane Smith', product: 'Mouse', amount: 29, status: 'Shipped', priority: 'Low' },
  { id: 1003, customer: 'Bob Johnson', product: 'Monitor', amount: 549, status: 'Delivered', priority: 'Medium' },
  { id: 1004, customer: 'Alice Brown', product: 'Keyboard', amount: 89, status: 'Pending', priority: 'Medium' },
  { id: 1005, customer: 'Charlie Wilson', product: 'Chair', amount: 399, status: 'Cancelled', priority: 'Low' }
];`;
}
