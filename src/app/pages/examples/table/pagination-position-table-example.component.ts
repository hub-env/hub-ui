import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/** The three placements `paginationPosition` accepts, in the order the switch offers them. */
type PaginationPlacement = 'bottom' | 'top' | 'both';

/**
 * Where the paging chrome sits, switched live.
 *
 * The reason this needs a demo rather than a line in a table is that the thing being moved is
 * not the paginator: the bar also carries the page-size selector and the row count, and all
 * three travel together. Reading `top` as "the paginator goes up" is the mistake — and it was
 * once the implementation's mistake too.
 *
 * `both` is the value worth trying on a long table: the reader can change page from wherever
 * they happen to be, without scrolling back to an edge to reach a control.
 */
@Component({
	selector: 'app-table-pagination-position-example',
	standalone: true,
	imports: [HubTableComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
			<span class="small text-muted me-1">paginationPosition</span>
			@for (placement of placements; track placement) {
				<button
					type="button"
					hubButton
					size="sm"
					color="primary"
					[variant]="position() === placement ? 'solid' : 'outline'"
					[attr.aria-pressed]="position() === placement"
					(click)="position.set(placement)"
				>
					{{ placement }}
				</button>
			}
		</div>

		<hub-table
			[data]="invoices"
			[headers]="headers"
			[(page)]="page"
			[(perPage)]="perPage"
			[perPageOptions]="perPageOptions"
			[paginationPosition]="position()"
		></hub-table>

		<p class="small text-muted mb-0 mt-3">
			Watch all three pieces of the bar, not just the paginator: the page links, the
			<em>rows per page</em> selector and the row count are one block, and every value moves the block. With
			<code>both</code> the table draws it twice, so a long page can be paged from either end.
		</p>
	`,
	styles: []
})
export class PaginationPositionTableExampleComponent {
	/** Offered in the order a reader is likely to try them: the default first. */
	protected readonly placements: readonly PaginationPlacement[] = ['bottom', 'top', 'both'];

	/** The placement the switch is currently on. */
	protected readonly position = signal<PaginationPlacement>('bottom');

	/** Current page (two-way bound, which is also what puts the table in client mode). */
	protected readonly page = signal(1);

	/** Page size, small enough that the paginator has somewhere to go. */
	protected readonly perPage = signal(4);

	/** Page sizes the bar's selector offers. */
	protected readonly perPageOptions = [4, 8, 12];

	/** Columns of the demo table. */
	protected readonly headers = [
		{ property: 'reference', title: 'Reference' },
		{ property: 'client', title: 'Client' },
		{ property: 'issued', title: 'Issued' },
		{ property: 'total', title: 'Total' }
	];

	/** Enough rows for three pages at the default page size. */
	protected readonly invoices = [
		{ reference: 'F-2601', client: 'Cerámicas Talavera', issued: '2026-01-08', total: '1.240,00 €' },
		{ reference: 'F-2602', client: 'Molinos del Duero', issued: '2026-01-12', total: '820,50 €' },
		{ reference: 'F-2603', client: 'Aceites Jaén', issued: '2026-01-19', total: '3.115,00 €' },
		{ reference: 'F-2604', client: 'Textiles Béjar', issued: '2026-01-23', total: '640,75 €' },
		{ reference: 'F-2605', client: 'Vidrios La Granja', issued: '2026-02-02', total: '2.480,00 €' },
		{ reference: 'F-2606', client: 'Conservas Vigo', issued: '2026-02-09', total: '1.905,20 €' },
		{ reference: 'F-2607', client: 'Muebles Yecla', issued: '2026-02-14', total: '4.310,00 €' },
		{ reference: 'F-2608', client: 'Papeles Alcoy', issued: '2026-02-21', total: '512,40 €' },
		{ reference: 'F-2609', client: 'Calzados Elda', issued: '2026-03-03', total: '2.070,00 €' },
		{ reference: 'F-2610', client: 'Herrajes Éibar', issued: '2026-03-11', total: '1.388,90 €' },
		{ reference: 'F-2611', client: 'Quesos Roncal', issued: '2026-03-18', total: '735,00 €' },
		{ reference: 'F-2612', client: 'Cristalería Arganda', issued: '2026-03-27', total: '2.964,60 €' }
	];

	/** HTML snippet displayed in the example viewer. */
	static readonly templateCode = `<!-- 'bottom' (the default), 'top', or 'both' -->
<hub-table
  [data]="invoices"
  [headers]="headers"
  [(page)]="page"
  [(perPage)]="perPage"
  [perPageOptions]="perPageOptions"
  [paginationPosition]="position()">
</hub-table>`;

	/** TypeScript snippet displayed in the example viewer. */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-table-pagination-position-example',
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './pagination-position-table-example.component.html'
})
export class PaginationPositionTableExampleComponent {
  position = signal<'bottom' | 'top' | 'both'>('bottom');
  page = signal(1);
  perPage = signal(4);
  perPageOptions = [4, 8, 12];

  headers = [
    { property: 'reference', title: 'Reference' },
    { property: 'client', title: 'Client' },
    { property: 'issued', title: 'Issued' },
    { property: 'total', title: 'Total' }
  ];

  invoices = [/* … */];
}

// The input moves the whole bar — paginator, rows-per-page selector and row count.
// To set it once for the whole application, hand it to the provider instead:
//
//   providePaginable({ defaults: { paginationPosition: 'both' } })`;
}
