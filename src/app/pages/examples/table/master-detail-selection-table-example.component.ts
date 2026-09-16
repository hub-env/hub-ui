import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PaginableTableHeader, HubTableComponent, TableRowEvent } from 'ng-hub-ui-paginable';
import { HubPanelComponent } from 'ng-hub-ui-panels';

interface Order {
	id: number;
	customer: string;
	total: string;
	status: string;
	city: string;
}

/**
 * Master-detail with the active row marked by `[rowClass]`.
 *
 * The consumer drives the "active row" from its OWN state (`activeId`) via
 * `[rowClass]="row => row.id === activeId ? 'hub-table__row--selected' : ''"`. That
 * public class reuses the built-in `--hub-table-selected-*` tint — no repaint, no
 * `!important`. The demo also opts into the leading accent bar with
 * `--hub-table-selected-bar-width`, giving the full master-detail affordance
 * (soft tint + accent bar) entirely through tokens.
 */
@Component({
	selector: 'app-master-detail-selection-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			/* The consumer turns on the selected-row accent bar via the public token. */
			.master-detail-demo hub-table {
				--hub-table-selected-bar-width: 3px;
			}
			.master-detail-demo tbody tr {
				cursor: pointer;
			}
		</style>

		<div class="master-detail-demo row g-3">
			<div class="col-lg-7">
				<hub-table
					[data]="orders"
					[headers]="headers"
					[paginate]="false"
					[searchable]="false"
					[rowClass]="rowClass"
					[clickFn]="selectRow"
				></hub-table>
				<p class="text-muted small mt-2 mb-0">
					Click a row to open its detail — the active row shows the tint + accent bar.
				</p>
			</div>

			<div class="col-lg-5">
				<hub-panel class="h-100">
					<div>
						@if (active(); as order) {
							<h5 class="card-title mb-1">Order #{{ order.id }}</h5>
							<h6 class="card-subtitle text-muted mb-3">{{ order.customer }}</h6>
							<dl class="row mb-0">
								<dt class="col-5">Total</dt>
								<dd class="col-7">{{ order.total }}</dd>
								<dt class="col-5">Status</dt>
								<dd class="col-7">{{ order.status }}</dd>
								<dt class="col-5">City</dt>
								<dd class="col-7">{{ order.city }}</dd>
							</dl>
						} @else {
							<p class="text-muted mb-0">Select an order to see its detail.</p>
						}
					</div>
				</hub-panel>
			</div>
		</div>
	`,
	styles: []
})
export class MasterDetailSelectionTableExampleComponent {
	/** Currently active (master-detail) row. */
	active = signal<Order | null>(null);

	/** Demo orders. */
	orders: Array<Order> = [
		{ id: 1001, customer: 'Ada Lovelace', total: '$1,240.00', status: 'Paid', city: 'London' },
		{ id: 1002, customer: 'Alan Turing', total: '$890.50', status: 'Pending', city: 'Manchester' },
		{ id: 1003, customer: 'Grace Hopper', total: '$2,415.00', status: 'Paid', city: 'New York' },
		{ id: 1004, customer: 'Katherine Johnson', total: '$540.75', status: 'Refunded', city: 'Hampton' },
		{ id: 1005, customer: 'Edsger Dijkstra', total: '$1,975.20', status: 'Paid', city: 'Rotterdam' }
	];

	/** Table headers. */
	headers: Array<PaginableTableHeader> = [
		{ property: 'id', title: 'Order' },
		{ property: 'customer', title: 'Customer' },
		{ property: 'total', title: 'Total', align: 'end' },
		{ property: 'status', title: 'Status' }
	];

	/** Opens the detail panel for the clicked row. */
	selectRow = (event: TableRowEvent<Order>): void => {
		this.active.set(event.data);
	};

	/** Marks the active row with the public selected class consumed by --hub-table-selected-*. */
	rowClass = (row: Order): string => (row.id === this.active()?.id ? 'hub-table__row--selected' : '');

	static readonly templateCode = `<div class="master-detail">
  <hub-table
    [data]="orders"
    [headers]="headers"
    [rowClass]="rowClass"
    [clickFn]="selectRow">
  </hub-table>

  <!-- detail panel bound to active() -->
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { PaginableTableHeader, HubTableComponent, TableRowEvent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-master-detail-selection-table',
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './master-detail-selection-table.component.html',
  // Opt into the leading accent bar; the tint comes for free from --hub-table-selected-*.
  styles: [\`hub-table { --hub-table-selected-bar-width: 3px; }\`]
})
export class MasterDetailSelectionTableComponent {
  active = signal<any>(null);

  orders = [
    { id: 1001, customer: 'Ada Lovelace', total: '$1,240.00', status: 'Paid', city: 'London' },
    { id: 1002, customer: 'Alan Turing', total: '$890.50', status: 'Pending', city: 'Manchester' }
  ];
  headers: PaginableTableHeader[] = [
    { property: 'id', title: 'Order' },
    { property: 'customer', title: 'Customer' },
    { property: 'total', title: 'Total' },
    { property: 'status', title: 'Status' }
  ];

  // Drive the active row from the app's OWN state — no repaint, no !important.
  selectRow = (event: TableRowEvent<any>) => this.active.set(event.data);
  rowClass = (row: any) => (row.id === this.active()?.id ? 'hub-table__row--selected' : '');
}`;
}
