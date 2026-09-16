import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubAppendDirective, HubInputComponent, HubSelectComponent } from 'ng-hub-ui-forms';
import { HubPaginableTableCellDirective, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

interface Line {
	product: string;
	quantity: number;
	unit: string;
}

/**
 * `flushFields` — the controls in the cells drawn as a spreadsheet, not as a form.
 *
 * A field is boxed so it can be told apart from the page around it. A table cell already does
 * that job — it has its own grid — so the box gets drawn twice and the result reads as a form
 * that fell into a table rather than as an editable table.
 *
 * The two tables below hold the same controls. The difference is one attribute.
 *
 * Attached content is not treated the same on both sides, and that is the point: a static
 * `append` loses its surface and reads as the plain unit it is, while a projected button stops
 * being welded to its neighbour — it gets its corners back and a gap, because two actions in a
 * cell are two things to press, not one strip.
 *
 * None of it is an input on the fields. `ng-hub-ui-forms` declares its tokens at `:root` and
 * never redeclares them on a component host, so the table governs them from above by plain
 * inheritance — which is also why it reaches these projected cell templates at all.
 */
@Component({
	selector: 'app-editable-table-example',
	standalone: true,
	imports: [
		HubTableComponent,
		HubPaginableTableCellDirective,
		HubInputComponent,
		HubSelectComponent,
		HubAppendDirective,
		FormsModule,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<h6 class="mb-2">Default — every control brings its own box</h6>
		<hub-table [headers]="headers" [data]="lines" [paginate]="false" [searchable]="false">
			<ng-template paginableTableCell [header]="'product'" let-line="item">
				<hub-input [(ngModel)]="line.product" [ngModelOptions]="{ standalone: true }" />
			</ng-template>
			<ng-template paginableTableCell [header]="'quantity'" let-line="item">
				<hub-input type="number" [(ngModel)]="line.quantity" [ngModelOptions]="{ standalone: true }" append="u." />
			</ng-template>
			<ng-template paginableTableCell [header]="'unit'" let-line="item">
				<hub-select [items]="units" [(ngModel)]="line.unit" [ngModelOptions]="{ standalone: true }" [clearable]="false">
					<ng-template hubAppend>
						<button type="button" hubButton variant="outline" color="secondary" aria-label="Duplicate">+</button>
						<button type="button" hubButton variant="outline" color="danger" aria-label="Remove">−</button>
					</ng-template>
				</hub-select>
			</ng-template>
		</hub-table>

		<h6 class="mt-4 mb-2">With <code>flushFields</code> — the same controls, read as a sheet</h6>
		<hub-table flushFields [headers]="headers" [data]="lines" [paginate]="false" [searchable]="false">
			<ng-template paginableTableCell [header]="'product'" let-line="item">
				<hub-input [(ngModel)]="line.product" [ngModelOptions]="{ standalone: true }" />
			</ng-template>
			<ng-template paginableTableCell [header]="'quantity'" let-line="item">
				<hub-input type="number" [(ngModel)]="line.quantity" [ngModelOptions]="{ standalone: true }" append="u." />
			</ng-template>
			<ng-template paginableTableCell [header]="'unit'" let-line="item">
				<hub-select [items]="units" [(ngModel)]="line.unit" [ngModelOptions]="{ standalone: true }" [clearable]="false">
					<ng-template hubAppend>
						<button type="button" hubButton variant="outline" color="secondary" aria-label="Duplicate">+</button>
						<button type="button" hubButton variant="outline" color="danger" aria-label="Remove">−</button>
					</ng-template>
				</hub-select>
			</ng-template>
		</hub-table>
	`
})
export class EditableTableExampleComponent {
	readonly headers = [
		{ property: 'product', title: 'Product' },
		{ property: 'quantity', title: 'Quantity' },
		{ property: 'unit', title: 'Unit' }
	];

	readonly units = ['box', 'pallet', 'kg'];

	lines: Line[] = [
		{ product: 'Recycled paper', quantity: 12, unit: 'box' },
		{ product: 'Ink cartridge', quantity: 3, unit: 'box' },
		{ product: 'Cardboard', quantity: 40, unit: 'kg' }
	];

	static readonly templateCode = `<hub-table flushFields [headers]="headers" [data]="lines">
  <ng-template paginableTableCell [header]="'product'" let-line="item">
    <hub-input [(ngModel)]="line.product" />
  </ng-template>
</hub-table>`;
}
