import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HubPaginatorComponent } from 'ng-hub-ui-paginable';

/** One line of the audit trail the demo pages through. */
interface AuditEntry {
	id: number;
	at: string;
	actor: string;
	action: string;
}

/** Forty-three entries, which is enough for the ellipsis and the last-page controls to appear. */
const TRAIL: AuditEntry[] = Array.from({ length: 43 }, (_, index) => {
	const actors = ['a.ferreiro', 'r.castano', 'm.iribarne', 'j.bengoa'];
	const actions = [
		'signed in',
		'exported the invoice ledger',
		'changed a customer address',
		'issued a credit note',
		'revoked an API key'
	];
	return {
		id: 1000 + index,
		at: `2026-09-0${(index % 5) + 1} 0${(index % 8) + 1}:${String((index * 7) % 60).padStart(2, '0')}`,
		actor: actors[index % actors.length],
		action: actions[index % actions.length]
	};
});

/**
 * `hub-paginator` on its own, driving a collection the table has nothing to do with.
 *
 * The component is exported and answers to three names — `hub-paginator`, `hub-ui-paginator` and
 * the legacy `paginable-table-paginator` — so it can page anything: a card grid, a feed, this
 * audit trail. It owns exactly one thing, the current page: `[(page)]` is two-way and
 * `[numberOfPages]` tells it where the collection ends, which is what enables the "last page"
 * control and the ellipsis.
 *
 * Everything around it belongs to whoever mounts it. The page-size control and the "showing X–Y
 * of Z" line below are this component's own markup, not the paginator's — inside `hub-table` they
 * are drawn by the table's bottom bar, which is why they look built in there and are absent here.
 */
@Component({
	selector: 'app-paginator-basic-example',
	standalone: true,
	imports: [HubPaginatorComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
			<label class="d-flex align-items-center gap-2 mb-0">
				<span class="text-muted small">Entries per page</span>
				<select class="form-select form-select-sm w-auto" [value]="perPage()" (change)="setPerPage($event)">
					@for (size of perPageOptions; track size) {
						<option [value]="size">{{ size }}</option>
					}
				</select>
			</label>
			<span class="text-muted small">Showing {{ from() }}–{{ to() }} of {{ total }}</span>
		</div>

		<ul class="list-group mb-3">
			@for (entry of visible(); track entry.id) {
				<li class="list-group-item d-flex flex-wrap justify-content-between gap-2">
					<span
						><strong>{{ entry.actor }}</strong> {{ entry.action }}</span
					>
					<small class="text-muted">{{ entry.at }}</small>
				</li>
			}
		</ul>

		<hub-paginator [(page)]="page" [numberOfPages]="numberOfPages()" />
	`,
	styles: []
})
export class BasicPaginatorExampleComponent {
	/** The page the paginator writes and the slice below reads. */
	protected readonly page = signal(1);

	/** How many entries a page holds. Owned here, not by the paginator. */
	protected readonly perPage = signal(10);

	protected readonly perPageOptions = [5, 10, 20];

	/** The whole trail, paged in memory. */
	protected readonly total = TRAIL.length;

	/** Where the collection ends, which is what unlocks the last-page control. */
	protected readonly numberOfPages = computed(() => Math.ceil(this.total / this.perPage()));

	/** The current slice. */
	protected readonly visible = computed(() => {
		const start = (this.page() - 1) * this.perPage();
		return TRAIL.slice(start, start + this.perPage());
	});

	/** 1-based index of the first entry on the page, for the count line. */
	protected readonly from = computed(() => (this.page() - 1) * this.perPage() + 1);

	/** 1-based index of the last entry on the page, for the count line. */
	protected readonly to = computed(() => Math.min(this.page() * this.perPage(), this.total));

	/**
	 * Changing the page size sends the reader back to the first page: page 4 of a 10-per-page
	 * trail is past the end once pages hold 20.
	 *
	 * @param event The change event of the size selector.
	 */
	protected setPerPage(event: Event): void {
		this.perPage.set(Number((event.target as HTMLSelectElement).value));
		this.page.set(1);
	}

	static readonly templateCode = `<!-- hub-ui-paginator and paginable-table-paginator name the same component -->
<hub-paginator [(page)]="page" [numberOfPages]="numberOfPages()" />`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { HubPaginatorComponent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubPaginatorComponent],
  templateUrl: './audit-trail.component.html'
})
export class AuditTrailComponent {
  readonly page = signal(1);
  readonly perPage = signal(10);

  // Without numberOfPages the paginator cannot know where the collection ends, so it
  // drops the last-page control and the trailing ellipsis and only steps forward.
  readonly numberOfPages = computed(() => Math.ceil(this.entries.length / this.perPage()));

  readonly visible = computed(() => {
    const start = (this.page() - 1) * this.perPage();
    return this.entries.slice(start, start + this.perPage());
  });
}`;
}
