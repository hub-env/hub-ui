import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/** A support ticket. `requester` and `tags` are carried but never given a column. */
interface Ticket {
	reference: string;
	subject: string;
	queue: string;
	requester: string;
	tags: string[];
}

/** What an older session stored: the same ticket, minus a field the schema has since grown. */
type StoredTicket = Omit<Ticket, 'tags'>;

/**
 * The two predicates the table now honours: `searchFn` decides what the search keeps, and
 * `compareFn` decides when two selection values are the same record.
 *
 * **`searchFn`.** By default the search scans the searchable columns, which is right for a grid
 * of names and wrong here: a ticket is found by who raised it and by its tags, and neither has a
 * column. Type `ana` or `billing` into the search box with the switch off and nothing matches;
 * turn it on and the tickets appear. The predicate answers for the whole row, so the columns stop
 * applying — which is the point of reaching for it. The term arrives trimmed and lowercased.
 *
 * **`compareFn`.** The default matches a stored selection against the rows by JSON, so two
 * objects are the same record only when every field matches in the same order. "Restore the saved
 * pick" below hands the table what a previous session stored — the same tickets, before the
 * schema grew a `tags` field. With the switch off the tick never appears, because the JSON of the
 * stored value and the JSON of the row differ. With it on, the reference settles it.
 */
@Component({
	selector: 'app-table-compare-search-fn-example',
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
					id="use-predicates"
					[checked]="usePredicates()"
					(change)="usePredicates.set(!usePredicates())"
				/>
				<label class="form-check-label" for="use-predicates">
					<code>searchFn</code> and <code>compareFn</code> bound
				</label>
			</div>
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="restoreSavedPick()">
				Restore the saved pick
			</button>
			<span class="text-muted small">
				saved: {{ savedPick[0].reference }} · marked in the table: {{ picked().length }}
			</span>
		</div>

		<hub-table
			[data]="tickets"
			[headers]="headers"
			[selectable]="true"
			[multiple]="true"
			[searchFn]="usePredicates() ? matchesTicket : undefined"
			[compareFn]="usePredicates() ? sameTicket : undefined"
			[(ngModel)]="picked"
		/>

		<p class="text-muted small mb-0 mt-3">
			Search for <code>ana</code>, <code>billing</code> or <code>vip</code>: the requester and the tags have no column, so
			only the predicate can find them.
		</p>
	`,
	styles: []
})
export class CompareSearchFnTableExampleComponent {
	/** Whether both predicates are bound, so the difference each makes can be seen. */
	protected readonly usePredicates = signal(true);

	/** The selection, bound through `ngModel` and matched against the rows. */
	protected readonly picked = signal<Array<Ticket | StoredTicket>>([]);

	protected readonly tickets: Ticket[] = [
		{
			reference: 'SUP-4120',
			subject: 'Export ends in a 500',
			queue: 'Platform',
			requester: 'Ana Ferreiro',
			tags: ['exports', 'vip']
		},
		{
			reference: 'SUP-4121',
			subject: 'Invoice numbering skipped a year',
			queue: 'Finance',
			requester: 'Rubén Castaño',
			tags: ['billing']
		},
		{
			reference: 'SUP-4122',
			subject: 'Two-factor codes arrive late',
			queue: 'Security',
			requester: 'Marta Iribarne',
			tags: ['auth', 'vip']
		},
		{
			reference: 'SUP-4123',
			subject: 'Duplicate rows after an import',
			queue: 'Platform',
			requester: 'Ana Ferreiro',
			tags: ['imports']
		},
		{
			reference: 'SUP-4124',
			subject: 'Credit note not applied',
			queue: 'Finance',
			requester: 'Julia Bengoa',
			tags: ['billing', 'refunds']
		}
	];

	protected readonly headers = [
		{ property: 'reference', title: 'Reference' },
		{ property: 'subject', title: 'Subject' },
		{ property: 'queue', title: 'Queue' }
	];

	/** What a previous session left behind: the record as it was before `tags` existed. */
	protected readonly savedPick: StoredTicket[] = [
		{
			reference: 'SUP-4122',
			subject: 'Two-factor codes arrive late',
			queue: 'Security',
			requester: 'Marta Iribarne'
		}
	];

	/**
	 * Keeps a ticket whose reference, subject, queue, requester or any tag contains the term.
	 * Two of those five are fields no column shows, which is the reason to bind this at all.
	 *
	 * @param ticket The row data.
	 * @param term The search term, already trimmed and lowercased by the table.
	 * @returns Whether the row survives the search.
	 */
	protected readonly matchesTicket = (ticket: Ticket, term: string): boolean =>
		[ticket.reference, ticket.subject, ticket.queue, ticket.requester, ...ticket.tags]
			.join(' ')
			.toLowerCase()
			.includes(term);

	/**
	 * Two values are the same ticket when they carry the same reference, whatever else each of
	 * them happens to hold.
	 *
	 * @param a One selection value.
	 * @param b The other.
	 * @returns Whether both name the same record.
	 */
	protected readonly sameTicket = (a: Ticket | StoredTicket, b: Ticket | StoredTicket): boolean =>
		a.reference === b.reference;

	/** Hands the table the stored selection, exactly as it was saved. */
	protected restoreSavedPick(): void {
		this.picked.set(this.savedPick.map((ticket) => ({ ...ticket })));
	}

	static readonly templateCode = `<hub-table
  [data]="tickets"
  [headers]="headers"
  [selectable]="true"
  [multiple]="true"
  [searchFn]="matchesTicket"
  [compareFn]="sameTicket"
  [(ngModel)]="picked" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubTableComponent, FormsModule],
  templateUrl: './tickets.component.html'
})
export class TicketsComponent {
  readonly picked = signal<Ticket[]>([]);

  // Only three of these five fields have a column. A predicate answers for the whole
  // row, so binding it is how you say the columns are not where the answer lives.
  readonly matchesTicket = (ticket: Ticket, term: string): boolean =>
    [ticket.reference, ticket.subject, ticket.queue, ticket.requester, ...ticket.tags]
      .join(' ')
      .toLowerCase()
      .includes(term);

  // Without this the table matches a stored selection by JSON, so a record rebuilt by a
  // reload — or saved before the schema grew a field — silently loses its tick.
  readonly sameTicket = (a: Ticket, b: Ticket): boolean => a.reference === b.reference;
}`;
}
