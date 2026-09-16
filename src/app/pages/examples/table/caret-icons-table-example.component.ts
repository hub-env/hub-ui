import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubPaginableTableExpandingRowDirective, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Overridable expander caret icons example.
 *
 * The master-detail row expander glyph is driven by `--hub-table-icon-caret-up` /
 * `--hub-table-icon-caret-down` (SVG data-URIs painted through `mask-image`, the
 * same indirection the sort icons use). Here they are swapped for plus / minus
 * signs so the expander matches a product's own iconography.
 */
@Component({
	selector: 'app-caret-icons-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPaginableTableExpandingRowDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			.custom-caret-scope .hub-table {
				--hub-table-icon-caret-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M416 208H272V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H64c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V272h144c17.7 0 32-14.3 32-32s-14.3-32-32-32z'/%3E%3C/svg%3E");
				--hub-table-icon-caret-up: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z'/%3E%3C/svg%3E");
			}
		</style>

		<div class="alert alert-info mb-3">
			<strong>Expand a row.</strong> The expander uses custom plus / minus glyphs via
			<code>--hub-table-icon-caret-up</code> / <code>--hub-table-icon-caret-down</code>.
		</div>

		<div class="custom-caret-scope">
			<hub-table [data]="products" [headers]="headers">
				<ng-template paginableTableExpandingRow let-item="item" let-colspan="colspan">
					<tr>
						<td [attr.colspan]="colspan" class="p-3 bg-light">
							<strong>{{ item.name }}</strong> — SKU {{ item.sku }}, {{ item.stock }} in stock.
						</td>
					</tr>
				</ng-template>
			</hub-table>
		</div>
	`
})
export class CaretIconsTableExampleComponent {
	products = [
		{ name: 'Wireless Mouse', sku: 'WM-100', price: '$24.99', stock: 132 },
		{ name: 'Mechanical Keyboard', sku: 'MK-220', price: '$89.00', stock: 47 },
		{ name: 'USB-C Hub', sku: 'UH-330', price: '$39.50', stock: 88 }
	];

	headers: Array<PaginableTableHeader> = [
		{ property: 'name', title: 'Product' },
		{ property: 'sku', title: 'SKU' },
		{ property: 'price', title: 'Price' },
		{ property: 'stock', title: 'Stock' }
	];

	static readonly templateCode = `<style>
  .custom-caret-scope .hub-table {
    --hub-table-icon-caret-down: url("data:image/svg+xml,…plus…");
    --hub-table-icon-caret-up:   url("data:image/svg+xml,…minus…");
  }
</style>

<div class="custom-caret-scope">
  <hub-table [data]="products" [headers]="headers">
    <ng-template paginableTableExpandingRow let-item="item">
      <div class="p-3 bg-light">{{ item.name }} — {{ item.stock }} in stock.</div>
    </ng-template>
  </hub-table>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPaginableTableExpandingRowDirective, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-caret-icons-table',
  standalone: true,
  imports: [HubTableComponent, HubPaginableTableExpandingRowDirective],
  templateUrl: './caret-icons-table.component.html'
})
export class CaretIconsTableComponent {
  headers: PaginableTableHeader[] = [
    { property: 'name',  title: 'Product' },
    { property: 'sku',   title: 'SKU' },
    { property: 'price', title: 'Price' },
    { property: 'stock', title: 'Stock' }
  ];
}`;
}
