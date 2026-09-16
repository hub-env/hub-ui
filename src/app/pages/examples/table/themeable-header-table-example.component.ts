import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Themeable header + row divider example.
 *
 * Restyles just the header band — surface/text (`--hub-table-head-bg` /
 * `--hub-table-head-color`), the inter-row divider (`--hub-table-row-divider-color`)
 * and the header typography & padding (`--hub-table-head-font-size` /
 * `--hub-table-head-font-weight` / `--hub-table-head-padding-x` /
 * `--hub-table-head-padding-y`) — through CSS variables, without touching the outer
 * frame or vertical borders. Every token defaults to an existing value, so a table is
 * unchanged until one is set.
 */
@Component({
	selector: 'app-themeable-header-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			/* Target the table host (.hub-table) — the tokens are declared on the
         component's :host, so setting them on an ancestor would be shadowed. */
			.themed-head-scope .hub-table {
				--hub-table-head-bg: #0d3b66;
				--hub-table-head-color: #ffffff;
				--hub-table-row-divider-color: #cfe0f1;
				/* New in 22.5.0 — header typography and padding, same head namespace. */
				--hub-table-head-font-size: 0.8125rem;
				--hub-table-head-font-weight: 600;
				--hub-table-head-padding-x: 1.25rem;
				--hub-table-head-padding-y: 0.75rem;
			}
		</style>

		<div class="themed-head-scope">
			<hub-table [data]="rows" [headers]="headers"></hub-table>
		</div>
	`
})
export class ThemeableHeaderTableExampleComponent {
	rows = [
		{ code: 'INV-1001', client: 'Acme Corp', amount: '$3,200', status: 'Paid' },
		{ code: 'INV-1002', client: 'Globex', amount: '$1,750', status: 'Pending' },
		{ code: 'INV-1003', client: 'Initech', amount: '$980', status: 'Paid' },
		{ code: 'INV-1004', client: 'Umbrella', amount: '$5,410', status: 'Overdue' }
	];

	headers: Array<PaginableTableHeader> = [
		{ property: 'code', title: 'Invoice' },
		{ property: 'client', title: 'Client' },
		{ property: 'amount', title: 'Amount' },
		{ property: 'status', title: 'Status' }
	];

	static readonly templateCode = `<style>
  .themed-head-scope .hub-table {
    --hub-table-head-bg: #0d3b66;
    --hub-table-head-color: #ffffff;
    --hub-table-row-divider-color: #cfe0f1;
    /* header typography and padding (22.5.0) */
    --hub-table-head-font-size: 0.8125rem;
    --hub-table-head-font-weight: 600;
    --hub-table-head-padding-x: 1.25rem;
    --hub-table-head-padding-y: 0.75rem;
  }
</style>

<div class="themed-head-scope">
  <hub-table [data]="rows" [headers]="headers"></hub-table>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-themeable-header-table',
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './themeable-header-table.component.html'
})
export class ThemeableHeaderTableComponent {
  headers: PaginableTableHeader[] = [
    { property: 'code',   title: 'Invoice' },
    { property: 'client', title: 'Client' },
    { property: 'amount', title: 'Amount' },
    { property: 'status', title: 'Status' }
  ];
}`;
}
