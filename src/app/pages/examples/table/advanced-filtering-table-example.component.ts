import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-advanced-filtering-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-table [data]="products" [headers]="headers"> </hub-table> `
})
export class AdvancedFilteringTableExampleComponent {
	products = [
		{ id: 1, name: 'Laptop', price: 1200, date: new Date('2023-10-01'), category: 'Electronics' },
		{ id: 2, name: 'Mouse', price: 25, date: new Date('2023-11-15'), category: 'Electronics' },
		{ id: 3, name: 'Keyboard', price: 75, date: new Date('2023-11-20'), category: 'Electronics' },
		{ id: 4, name: 'Desk Lamp', price: 45, date: new Date('2023-12-05'), category: 'Office' },
		{ id: 5, name: 'Chair', price: 250, date: new Date('2023-12-10'), category: 'Office' }
	];

	headers: any[] = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Product', filter: { type: 'text' } },
		{
			property: 'price',
			title: 'Price ($)',
			filter: { type: 'number-range' }
		},
		{
			property: 'date',
			title: 'Added Date',
			filter: { type: 'date-range' }
		},
		{ property: 'category', title: 'Category', filter: { type: 'dropdown', options: ['Electronics', 'Office'] } }
	];

	static readonly templateCode = `<hub-table 
  [data]="products" 
  [headers]="headers">
</hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-advanced-filtering-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table 
      [data]="products" 
      [headers]="headers">
    </hub-table>
  \`,
})
export class AdvancedFilteringTableExampleComponent {
  products = [...];

  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Product', filter: { type: 'text' } },
    { property: 'price', title: 'Price ($)', filter: { type: 'number-range' } },
    { property: 'date', title: 'Added Date', filter: { type: 'date-range' } },
    { property: 'category', title: 'Category', filter: { type: 'dropdown', options: [...] } }];
}`;
}
