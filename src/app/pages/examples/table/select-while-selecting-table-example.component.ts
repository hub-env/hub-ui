import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubTableComponent, TableRowEvent } from 'ng-hub-ui-paginable';

/** One row of the dispatch queue. */
interface Shipment {
	reference: string;
	customer: string;
	city: string;
	carrier: string;
	status: string;
}

/**
 * `selectWhileSelecting`: with a selection under way, a row click marks the row instead of
 * opening it.
 *
 * The case it answers is a touch one. Picking several shipments means tapping them, and on a
 * table whose rows open a record the tap that misses the box navigates away — with the selection
 * built up so far. Turn the switch off below, tick a couple of rows and click a third: the record
 * opens and the ticks are gone. Turn it on and the third row is simply added to the pick.
 *
 * The mode holds no state of its own. It is on while at least one row is selected, so it starts
 * with the first tick and ends with the last untick, and the consumer has nothing to track.
 *
 * The same rule reaches the keyboard, which is the other half of this release: a row given
 * `clickFn` is a tab stop and answers to Enter and Space. Tab into the table and try it — with
 * nothing selected the row opens, with something selected it marks. Ticking a checkbox with the
 * keyboard does not open the record, because the row only acts when the row itself has focus.
 */
@Component({
	selector: 'app-table-select-while-selecting-example',
	standalone: true,
	imports: [HubTableComponent, FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3 mb-3">
			<div class="form-check form-switch mb-0">
				<input
					class="form-check-input"
					type="checkbox"
					role="switch"
					id="select-while-selecting"
					[checked]="markWhileSelecting()"
					(change)="markWhileSelecting.set(!markWhileSelecting())"
				/>
				<label class="form-check-label" for="select-while-selecting">
					<code>selectWhileSelecting</code>
				</label>
			</div>
			<button type="button" hubButton variant="outline" color="secondary" size="sm" (click)="clear()">
				Clear the pick
			</button>
		</div>

		<p class="mb-3">
			@if (picked().length) {
				With <strong>{{ picked().length }}</strong> picked, a row click
				<strong>{{ markWhileSelecting() ? 'marks the row' : 'opens the shipment' }}</strong
				>.
			} @else {
				With <strong>nothing</strong> picked, a row click <strong>opens the shipment</strong>.
			}
		</p>

		<hub-table
			[data]="shipments"
			[headers]="headers"
			[selectable]="true"
			[multiple]="true"
			[selectWhileSelecting]="markWhileSelecting()"
			[clickFn]="openShipment"
			[options]="{ cursor: 'pointer' }"
			[searchable]="false"
			[(ngModel)]="picked"
		/>

		@if (opened(); as shipment) {
			<div class="alert alert-info mt-3 mb-0">
				Opened <strong>{{ shipment.reference }}</strong> — {{ shipment.customer }}, {{ shipment.city }}
			</div>
		}
	`,
	styles: []
})
export class SelectWhileSelectingTableExampleComponent {
	/** The input under demonstration, switchable so the difference can be felt. */
	protected readonly markWhileSelecting = signal(true);

	/** The rows currently picked, bound through `ngModel`. */
	protected readonly picked = signal<Shipment[]>([]);

	/** The last shipment a row click actually opened. */
	protected readonly opened = signal<Shipment | null>(null);

	protected readonly shipments: Shipment[] = [
		{ reference: 'ES-88401', customer: 'Cerámicas Talavera', city: 'Toledo', carrier: 'Correos', status: 'In transit' },
		{ reference: 'ES-88402', customer: 'Bodegas Ribera', city: 'Aranda de Duero', carrier: 'SEUR', status: 'Delivered' },
		{ reference: 'ES-88403', customer: 'Editorial Lumbre', city: 'Valencia', carrier: 'MRW', status: 'In transit' },
		{ reference: 'ES-88404', customer: 'Talleres Aranda', city: 'Burgos', carrier: 'SEUR', status: 'Held' },
		{ reference: 'ES-88405', customer: 'Clínica Sur', city: 'Málaga', carrier: 'Correos', status: 'Delivered' },
		{ reference: 'ES-88406', customer: 'Óptica Meridiano', city: 'Sevilla', carrier: 'MRW', status: 'In transit' }
	];

	protected readonly headers = [
		{ property: 'reference', title: 'Reference' },
		{ property: 'customer', title: 'Customer' },
		{ property: 'city', title: 'City' },
		{ property: 'carrier', title: 'Carrier' },
		{ property: 'status', title: 'Status' }
	];

	/**
	 * What a row click means when no selection is under way. An arrow function so `this` still
	 * points at the component once the table holds the reference.
	 *
	 * @param event The clicked row, with the originating event attached.
	 */
	protected readonly openShipment = (event: TableRowEvent<Shipment>): void => {
		this.opened.set(event.data);
	};

	/** Drops the pick, which also leaves the marking mode. */
	protected clear(): void {
		this.picked.set([]);
	}

	static readonly templateCode = `<hub-table
  [data]="shipments"
  [headers]="headers"
  [selectable]="true"
  [multiple]="true"
  [selectWhileSelecting]="true"
  [clickFn]="openShipment"
  [options]="{ cursor: 'pointer' }"
  [(ngModel)]="picked" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubTableComponent, TableRowEvent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubTableComponent, FormsModule],
  templateUrl: './dispatch-queue.component.html'
})
export class DispatchQueueComponent {
  readonly picked = signal<Shipment[]>([]);

  // Runs on a click, and on Enter or Space with the row focused — but only while
  // nothing is picked. Tick the first box and a row click marks instead of opening.
  readonly openShipment = (event: TableRowEvent<Shipment>): void => {
    this.router.navigate(['/shipments', event.data.reference]);
  };
}`;
}
