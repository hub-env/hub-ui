import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/**
 * Row click events table example component
 * Demonstrates handling click events on table rows
 */
@Component({
	selector: 'app-row-click-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPanelComponent],
	template: `
		<hub-table [data]="products" [headers]="headers" [options]="{ cursor: 'pointer' }" [clickFn]="onRowClick"> </hub-table>

		@if (selectedProduct()) {
			<hub-panel class="mt-3">
				<div class="card-header bg-primary text-white">
					<h5 class="mb-0">Selected Product Details</h5>
				</div>
				<div>
					<div class="row">
						<div class="col-md-6">
							<p><strong>ID:</strong> {{ selectedProduct()?.id }}</p>
							<p><strong>Name:</strong> {{ selectedProduct()?.name }}</p>
							<p><strong>Category:</strong> {{ selectedProduct()?.category }}</p>
						</div>
						<div class="col-md-6">
							<p><strong>Price:</strong> {{ selectedProduct()?.price }}</p>
							<p><strong>Stock:</strong> {{ selectedProduct()?.stock }}</p>
							<p><strong>Status:</strong> {{ selectedProduct()?.status }}</p>
						</div>
					</div>
				</div>
			</hub-panel>
		}
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class RowClickTableExampleComponent {
	/**
	 * Sample product data for the table
	 */
	products = [
		{ id: 1, name: 'Laptop', category: 'Electronics', price: '$1,299', stock: 45, status: 'Available' },
		{ id: 2, name: 'Office Chair', category: 'Furniture', price: '$399', stock: 23, status: 'Available' },
		{ id: 3, name: 'Wireless Mouse', category: 'Accessories', price: '$29', stock: 156, status: 'Available' },
		{ id: 4, name: 'Monitor 27"', category: 'Electronics', price: '$549', stock: 0, status: 'Out of Stock' },
		{ id: 5, name: 'Desk Lamp', category: 'Furniture', price: '$79', stock: 67, status: 'Available' },
		{ id: 6, name: 'Keyboard', category: 'Accessories', price: '$89', stock: 92, status: 'Available' }
	];

	/**
	 * Table headers configuration
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Product Name' },
		{ property: 'category', title: 'Category' },
		{ property: 'price', title: 'Price' },
		{ property: 'stock', title: 'Stock' },
		{ property: 'status', title: 'Status' }
	];

	/**
	 * Currently selected product
	 */
	selectedProduct = signal<any>(null);

	/**
	 * Handle row click event. Passed to the table's `clickFn` input, which invokes
	 * it with the clicked row (`{ ...row, event }`), so `event.data` is the row data.
	 * Declared as an arrow function so `this` stays bound when used as `[clickFn]`.
	 *
	 * @param event - The clicked row augmented with the originating mouse event.
	 */
	onRowClick = (event: any): void => {
		this.selectedProduct.set(event.data);
	};

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table
  [data]="products"
  [headers]="headers"
  [options]="{ cursor: 'pointer' }"
  [clickFn]="onRowClick">
</hub-table>

@if (selectedProduct()) {
  <hub-panel class="mt-3">
    <div class="card-header">
      <h5>{{ selectedProduct()?.name }}</h5>
    </div>
    <div>
      <p>Price: {{ selectedProduct()?.price }}</p>
      <p>Stock: {{ selectedProduct()?.stock }}</p>
    </div>
  </hub-panel>
}`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-row-click-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="products"
      [headers]="headers"
      [options]="{ cursor: 'pointer' }"
      [clickFn]="onRowClick">
    </hub-table>

    @if (selectedProduct()) {
      <hub-panel class="mt-3">
        <h5>{{ selectedProduct()?.name }}</h5>
      </hub-panel>
    }
  \`
})
export class RowClickTableComponent {
  selectedProduct = signal<any>(null);

  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Product Name' },
    { property: 'price', title: 'Price' },
    { property: 'stock', title: 'Stock' }
  ];

  onRowClick = (event: any): void => {
    this.selectedProduct.set(event.data);
  };
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: '$1,299', stock: 45, status: 'Available' },
  { id: 2, name: 'Office Chair', category: 'Furniture', price: '$399', stock: 23, status: 'Available' },
  { id: 3, name: 'Wireless Mouse', category: 'Accessories', price: '$29', stock: 156, status: 'Available' },
  { id: 4, name: 'Monitor 27"', category: 'Electronics', price: '$549', stock: 0, status: 'Out of Stock' },
  { id: 5, name: 'Desk Lamp', category: 'Furniture', price: '$79', stock: 67, status: 'Available' },
  { id: 6, name: 'Keyboard', category: 'Accessories', price: '$89', stock: 92, status: 'Available' }
];`;
}
