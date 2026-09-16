import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';
import { FormsModule } from '@angular/forms';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/**
 * Column visibility toggle table example component
 * Demonstrates dynamically showing and hiding columns
 */
@Component({
	selector: 'app-column-visibility-table-example',
	standalone: true,
	imports: [HubTableComponent, FormsModule, HubPanelComponent],
	template: `
		<hub-panel class="mb-3">
			<div class="card-header">
				<h6 class="mb-0">Column Visibility</h6>
			</div>
			<div>
				<div class="row">
					@for (column of availableColumns; track column.key) {
						<div class="col-md-3 col-sm-6">
							<div class="form-check">
								<input
									class="form-check-input"
									type="checkbox"
									[id]="'column-' + column.key"
									[checked]="column.visible()"
									(change)="toggleColumn(column.key)"
								/>
								<label class="form-check-label" [for]="'column-' + column.key">
									{{ column.label }}
								</label>
							</div>
						</div>
					}
				</div>
			</div>
		</hub-panel>

		<hub-table [data]="products" [headers]="visibleHeaders()"> </hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ColumnVisibilityTableExampleComponent {
	/**
	 * Sample product data for the table
	 */
	products = [
		{ id: 1, name: 'Laptop', sku: 'LAP-001', category: 'Electronics', price: 1299, stock: 45, supplier: 'TechCorp' },
		{ id: 2, name: 'Office Chair', sku: 'CHR-002', category: 'Furniture', price: 399, stock: 23, supplier: 'FurnCo' },
		{ id: 3, name: 'Wireless Mouse', sku: 'MOU-003', category: 'Accessories', price: 29, stock: 156, supplier: 'TechCorp' },
		{ id: 4, name: 'Monitor 27"', sku: 'MON-004', category: 'Electronics', price: 549, stock: 34, supplier: 'ScreenPro' },
		{ id: 5, name: 'Desk Lamp', sku: 'LMP-005', category: 'Furniture', price: 79, stock: 67, supplier: 'LightCo' }
	];

	/**
	 * Available columns with visibility state
	 */
	availableColumns = [
		{ key: 'id', label: 'ID', visible: signal(true) },
		{ key: 'name', label: 'Name', visible: signal(true) },
		{ key: 'sku', label: 'SKU', visible: signal(true) },
		{ key: 'category', label: 'Category', visible: signal(true) },
		{ key: 'price', label: 'Price', visible: signal(true) },
		{ key: 'stock', label: 'Stock', visible: signal(true) },
		{ key: 'supplier', label: 'Supplier', visible: signal(true) }
	];

	/**
	 * All possible headers
	 */
	private allHeaders = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Product Name' },
		{ property: 'sku', title: 'SKU' },
		{ property: 'category', title: 'Category' },
		{ property: 'price', title: 'Price' },
		{ property: 'stock', title: 'Stock' },
		{ property: 'supplier', title: 'Supplier' }
	];

	/**
	 * Computed signal for visible headers
	 */
	visibleHeaders = computed(() => {
		return this.allHeaders.filter((header) => {
			const column = this.availableColumns.find((col) => col.key === header.property);
			return column?.visible();
		});
	});

	/**
	 * Toggle column visibility
	 * @param key - Column key to toggle
	 */
	toggleColumn(key: string): void {
		const column = this.availableColumns.find((col) => col.key === key);
		if (column) {
			column.visible.update((v) => !v);
		}
	}

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-panel class="mb-3">
  <div class="card-header">Column Visibility</div>
  <div>
    @for (column of availableColumns; track column.key) {
      <div class="form-check">
        <input
          type="checkbox"
          [checked]="column.visible()"
          (change)="toggleColumn(column.key)"
        />
        <label>{{ column.label }}</label>
      </div>
    }
  </div>
</hub-panel>

<hub-table
  [data]="products"
  [headers]="visibleHeaders()">
</hub-table>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, signal, computed } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-column-visibility-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="products"
      [headers]="visibleHeaders()">
    </hub-table>
  \`
})
export class ColumnVisibilityTableComponent {
  availableColumns = [
    { key: 'id', label: 'ID', visible: signal(true) },
    { key: 'name', label: 'Name', visible: signal(true) },
    { key: 'sku', label: 'SKU', visible: signal(true) },
    { key: 'category', label: 'Category', visible: signal(true) }
  ];

  private allHeaders = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Product Name' },
    { property: 'sku', title: 'SKU' },
    { property: 'category', title: 'Category' }
  ];

  visibleHeaders = computed(() => {
    return this.allHeaders.filter(header => {
      const column = this.availableColumns.find(col => col.key === header.property);
      return column?.visible();
    });
  });

  toggleColumn(key: string): void {
    const column = this.availableColumns.find(col => col.key === key);
    if (column) {
      column.visible.update(v => !v);
    }
  }
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `products = [
  { id: 1, name: 'Laptop', sku: 'LAP-001', category: 'Electronics', price: 1299, stock: 45, supplier: 'TechCorp' },
  { id: 2, name: 'Office Chair', sku: 'CHR-002', category: 'Furniture', price: 399, stock: 23, supplier: 'FurnCo' },
  { id: 3, name: 'Wireless Mouse', sku: 'MOU-003', category: 'Accessories', price: 29, stock: 156, supplier: 'TechCorp' },
  { id: 4, name: 'Monitor 27"', sku: 'MON-004', category: 'Electronics', price: 549, stock: 34, supplier: 'ScreenPro' },
  { id: 5, name: 'Desk Lamp', sku: 'LMP-005', category: 'Furniture', price: 79, stock: 67, supplier: 'LightCo' }
];`;
}
