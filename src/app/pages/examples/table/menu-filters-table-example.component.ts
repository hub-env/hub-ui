import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * The column filter panel: `filter.mode: 'menu'`.
 *
 * A row-mode filter is one box that means "contains". A menu-mode column instead puts a trigger
 * in its header that opens a panel where the reader stacks conditions — "greater than 100" and
 * "less than 500", "starts with L" or "ends with p" — and chooses whether they all have to hold
 * (match all) or any one of them will do (match any). The trigger then carries the number of
 * conditions currently narrowing that column, so a filter left behind in a collapsed panel is
 * still visible from the header.
 *
 * The match modes on offer come from the column's `type`: text columns get contains/starts
 * with/ends with and the null checks, number and date columns get the comparisons.
 */
@Component({
	selector: 'app-menu-filters-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-table [data]="products" [headers]="headers" [perPage]="5" /> `,
	styles: []
})
export class MenuFiltersTableExampleComponent {
	protected readonly products = [
		{ id: 1, name: 'Laptop Pro', price: 1200, added: '2023-10-01', category: 'Electronics' },
		{ id: 2, name: 'Wireless Mouse', price: 25, added: '2023-11-15', category: 'Electronics' },
		{ id: 3, name: 'Mechanical Keyboard', price: 75, added: '2023-11-20', category: 'Electronics' },
		{ id: 4, name: 'Desk Lamp', price: 45, added: '2023-12-05', category: 'Office' },
		{ id: 5, name: 'Ergonomic Chair', price: 250, added: '2023-12-10', category: 'Office' },
		{ id: 6, name: 'Standing Desk', price: 540, added: '2024-01-08', category: 'Office' },
		{ id: 7, name: 'Noise-cancelling Headset', price: 180, added: '2024-02-14', category: 'Electronics' }
	];

	protected readonly headers: PaginableTableHeader[] = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Product', sortable: true, filter: { type: 'text', mode: 'menu' } },
		{ property: 'price', title: 'Price ($)', sortable: true, filter: { type: 'number', mode: 'menu' } },
		{ property: 'added', title: 'Added', sortable: true, filter: { type: 'date', mode: 'menu' } },
		// Left in row mode on purpose, so the two ways of filtering a column sit side by side.
		{ property: 'category', title: 'Category', filter: { type: 'text', mode: 'row' } }
	];

	static readonly templateCode = `<hub-table [data]="products" [headers]="headers" [perPage]="5" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

export class MenuFiltersComponent {
  products = [...];

  headers: PaginableTableHeader[] = [
    { property: 'id', title: 'ID' },
    // A menu column puts a trigger in its header; the panel behind it stacks conditions
    // and combines them with match all (AND) or match any (OR).
    { property: 'name', title: 'Product', sortable: true, filter: { type: 'text', mode: 'menu' } },
    { property: 'price', title: 'Price ($)', sortable: true, filter: { type: 'number', mode: 'menu' } },
    { property: 'added', title: 'Added', sortable: true, filter: { type: 'date', mode: 'menu' } },
    // Row mode is the single box under the header, and means "contains".
    { property: 'category', title: 'Category', filter: { type: 'text', mode: 'row' } }
  ];
}`;
}
