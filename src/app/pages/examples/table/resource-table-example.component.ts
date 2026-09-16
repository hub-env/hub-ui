import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { PaginationState, HubTableComponent } from 'ng-hub-ui-paginable';

/** One row of the invoice ledger the fake endpoint serves. */
interface Invoice {
	reference: string;
	customer: string;
	issued: string;
	total: string;
	status: string;
}

/** The whole ledger, sliced into pages by the fake endpoint below. */
const LEDGER: Invoice[] = [
	{ reference: 'F-2026-0148', customer: 'Cerámicas Talavera', issued: '2026-08-03', total: '1.240,00 €', status: 'Paid' },
	{ reference: 'F-2026-0149', customer: 'Bodegas Ribera', issued: '2026-08-05', total: '3.980,50 €', status: 'Sent' },
	{ reference: 'F-2026-0150', customer: 'Editorial Lumbre', issued: '2026-08-08', total: '620,00 €', status: 'Overdue' },
	{ reference: 'F-2026-0151', customer: 'Talleres Aranda', issued: '2026-08-11', total: '2.115,75 €', status: 'Paid' },
	{ reference: 'F-2026-0152', customer: 'Clínica Sur', issued: '2026-08-14', total: '845,20 €', status: 'Sent' },
	{ reference: 'F-2026-0153', customer: 'Cerámicas Talavera', issued: '2026-08-18', total: '1.470,00 €', status: 'Draft' },
	{ reference: 'F-2026-0154', customer: 'Óptica Meridiano', issued: '2026-08-21', total: '390,00 €', status: 'Paid' },
	{ reference: 'F-2026-0155', customer: 'Bodegas Ribera', issued: '2026-08-24', total: '5.310,00 €', status: 'Sent' },
	{ reference: 'F-2026-0156', customer: 'Reformas Cid', issued: '2026-08-27', total: '7.902,40 €', status: 'Overdue' },
	{ reference: 'F-2026-0157', customer: 'Talleres Aranda', issued: '2026-08-30', total: '1.058,90 €', status: 'Paid' },
	{ reference: 'F-2026-0158', customer: 'Clínica Sur', issued: '2026-09-01', total: '2.640,00 €', status: 'Draft' },
	{ reference: 'F-2026-0159', customer: 'Editorial Lumbre', issued: '2026-09-03', total: '480,00 €', status: 'Sent' }
];

/** Page size the fake endpoint answers with, echoed back inside every response. */
const PER_PAGE = 5;

/**
 * The table fed by a whole `resource()`, through `[resource]`.
 *
 * The point of the binding is what this demo removes: there is no `[data]`, no `[loading]` and
 * no `[error]` to keep in step, because the resource already carries all three. Break the
 * endpoint and the error state appears; mend it and the rows come back — no extra wiring in
 * either direction.
 *
 * Paging is deliberately the consumer's job. The table never calls `reload()`, so the paginator
 * writes into the `page` signal the loader reads, and the request goes out because the consumer's
 * own params changed. That keeps a resource whose loader also depends on a filter, a sort or a
 * tenant id from being re-fetched behind its owner's back.
 *
 * The endpoint answers with a `PaginationState`, so page, size and total arrive with the rows
 * and the table never has to be told them. The other accepted shape — a plain array, paginated in
 * memory — is what the list example on this page demonstrates.
 */
@Component({
	selector: 'app-table-resource-example',
	// A fake loader on a timer registers no pending task, so prerendering serialises one state and
	// the browser starts in another. A real httpResource holds SSR until it answers; this one cannot,
	// and the demo exists to show the wait, so hydration is skipped for this subtree only.
	host: { ngSkipHydration: 'true' },
	standalone: true,
	imports: [HubTableComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="invoices.reload()">
				Reload
			</button>
			<button
				type="button"
				hubButton
				variant="outline"
				[color]="broken() ? 'success' : 'danger'"
				size="sm"
				(click)="broken.set(!broken())"
			>
				{{ broken() ? 'Mend the endpoint' : 'Break the endpoint' }}
			</button>
			<span class="badge text-bg-secondary text-uppercase">{{ invoices.status() }}</span>
			<span class="text-muted small">requests sent: {{ requests() }}</span>
		</div>

		<hub-table [resource]="invoices" [headers]="headers" [searchable]="false" (pageChange)="page.set($event ?? 1)" />

		<p class="text-muted small mb-0 mt-3">
			Nothing here binds <code>[data]</code>, <code>[loading]</code> or <code>[error]</code>. Paging bumps the
			<code>page</code> signal the loader reads, which is why the request counter moves: the table never reloads the
			resource itself.
		</p>
	`,
	styles: []
})
export class ResourceTableExampleComponent {
	/** The page the loader asks for. The paginator writes it; the resource reacts to it. */
	protected readonly page = signal(1);

	/** Whether the fake endpoint should reject, so the error state can be seen on demand. */
	protected readonly broken = signal(false);

	/** How many times the loader has run, which is what makes "paging refetches" visible. */
	protected readonly requests = signal(0);

	protected readonly headers = [
		{ property: 'reference', title: 'Invoice' },
		{ property: 'customer', title: 'Customer' },
		{ property: 'issued', title: 'Issued' },
		{ property: 'total', title: 'Total', align: 'end' as const },
		{ property: 'status', title: 'Status' }
	];

	/**
	 * A plain `resource()`: `[resource]` is typed by shape, so anything exposing `value`,
	 * `isLoading` and `error` fits — an `httpResource()` above all.
	 */
	protected readonly invoices = resource<PaginationState<Invoice>, { page: number; broken: boolean }>({
		params: () => ({ page: this.page(), broken: this.broken() }),
		loader: ({ params }) => this.fetchInvoices(params.page, params.broken)
	});

	/**
	 * Stands in for the HTTP call, latency and all, so the loading state lasts long enough to be
	 * seen. A real loader would be one `fetch` or one `httpResource()` and no timer.
	 *
	 * @param page 1-based page to serve.
	 * @param broken Whether this request should fail instead of answering.
	 * @returns The page of invoices, with the metadata the table reads off it.
	 */
	private fetchInvoices(page: number, broken: boolean): Promise<PaginationState<Invoice>> {
		this.requests.update((count) => count + 1);

		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (broken) {
					reject(new Error('The billing service is not answering'));
					return;
				}
				const from = (page - 1) * PER_PAGE;
				resolve({
					page,
					perPage: PER_PAGE,
					totalItems: LEDGER.length,
					data: LEDGER.slice(from, from + PER_PAGE)
				});
			}, 700);
		});
	}

	static readonly templateCode = `<button hubButton (click)="invoices.reload()">Reload</button>

<!-- One binding carries the rows, the loading state and the failure -->
<hub-table
  [resource]="invoices"
  [headers]="headers"
  (pageChange)="page.set($event ?? 1)" />`;

	static readonly componentCode = `import { Component, resource, signal } from '@angular/core';
import { PaginationState, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent {
  // The paginator writes this; the loader reads it. The table never calls reload(),
  // so the request goes out because the consumer's own params changed.
  readonly page = signal(1);

  readonly invoices = resource<PaginationState<Invoice>, { page: number }>({
    params: () => ({ page: this.page() }),
    loader: ({ params }) =>
      fetch(\`/api/invoices?page=\${params.page}\`).then((response) => {
        if (!response.ok) {
          throw new Error('The billing service is not answering');
        }
        return response.json();
      })
  });

  readonly headers = [
    { property: 'reference', title: 'Invoice' },
    { property: 'customer', title: 'Customer' },
    { property: 'issued', title: 'Issued' },
    { property: 'total', title: 'Total', align: 'end' as const },
    { property: 'status', title: 'Status' }
  ];
}`;
}
