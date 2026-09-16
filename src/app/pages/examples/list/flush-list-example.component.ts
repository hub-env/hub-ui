import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective, HubTableComponent } from 'ng-hub-ui-paginable';

interface Room {
	id: number;
	name: string;
	kind: string;
	rate: string;
}

/**
 * `flush` — the collection drawn as a list rather than as a stack of cards.
 *
 * Every row wears its own border, radius and surface by default. That is right for a
 * collection standing on a page: the cards are what tell it apart from the page around it.
 * It is wrong inside a dialog or a panel, where the surface has already drawn the frame and
 * a bordered box per row reads as a region of its own rather than as one list to pick from.
 *
 * Flush takes the chrome off and puts a rule between rows instead. The rule falls between
 * siblings only, so the list neither opens nor closes with one and sits flush against
 * whatever holds it, and `--hub-list-divider-width` / `--hub-list-divider-color` are there
 * for a consumer who wants a different one.
 *
 * `hub-table` takes the same input. Its row divider survives on purpose: a table with no
 * line between rows stops being readable across its columns, which is the one thing a table
 * is for.
 */
@Component({
	selector: 'app-flush-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, HubTableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="row g-4">
			<div class="col-md-6">
				<h6>Default — a stack of cards</h6>
				<p class="text-muted small">Each row is its own surface. On a page, that is what separates it from the page.</p>

				<hub-list [items]="rooms" bindLabel="name">
					<ng-template listItemTpt let-item="data">
						<span class="d-flex justify-content-between gap-3">
							<span
								>{{ item.name }} <small class="text-muted">· {{ item.kind }}</small></span
							>
							<small class="text-muted">{{ item.rate }}</small>
						</span>
					</ng-template>
				</hub-list>
			</div>

			<div class="col-md-6">
				<h6>Flush — one list</h6>
				<p class="text-muted small">
					Inside a dialog the frame is already drawn, so the rows only need a rule between them.
				</p>

				<hub-list flush [items]="rooms" bindLabel="name">
					<ng-template listItemTpt let-item="data">
						<span class="d-flex justify-content-between gap-3">
							<span
								>{{ item.name }} <small class="text-muted">· {{ item.kind }}</small></span
							>
							<small class="text-muted">{{ item.rate }}</small>
						</span>
					</ng-template>
				</hub-list>
			</div>
		</div>

		<h6 class="mt-4">The table takes it too</h6>
		<p class="text-muted small">
			Outer border, radius and head rule go; the row divider and the cell padding stay, because those are what keep a
			table readable across its columns.
		</p>

		<hub-table flush [headers]="headers" [data]="rooms" [paginate]="false" [searchable]="false" />
	`
})
export class FlushListExampleComponent {
	readonly rooms: Room[] = [
		{ id: 1, name: 'Despacho 1', kind: 'Office', rate: 'from 900,00 € / month' },
		{ id: 2, name: 'Sala Timple', kind: 'Meeting room', rate: 'from 90,00 € / day' },
		{ id: 3, name: 'Zona compartida', kind: 'Coworking', rate: 'from 180,00 € / month' }
	];

	readonly headers = [
		{ property: 'name', title: 'Room' },
		{ property: 'kind', title: 'Kind' },
		{ property: 'rate', title: 'Rate', align: 'end' as const }
	];

	static readonly templateCode = `<!-- the default: a stack of cards, right for a collection on a page -->
<hub-list [items]="rooms" bindLabel="name">
  <ng-template listItemTpt let-item="data">…</ng-template>
</hub-list>

<!-- flush: one list, a rule between rows. Right where a surface already framed it -->
<hub-list flush [items]="rooms" bindLabel="name">
  <ng-template listItemTpt let-item="data">…</ng-template>
</hub-list>

<!-- the table takes the same input; its row divider survives -->
<hub-table flush [headers]="headers" [data]="rooms" [paginate]="false" />`;

	static readonly componentCode = `// flush is an input rather than something CSS can reach, and that is not a
// preference. The token defaults are declared on the HOST, which is the very
// element a consumer would put a class on — so an assignment from outside ties
// on specificity and loses on source order, silently. The variant is declared
// on :host(.hub-list--flush), where it out-weighs what it overrides.
//
// Two tokens come with it, read ONLY under the variant:
//
//   --hub-list-divider-width   the rule that stands in for the gap
//   --hub-list-divider-color
//
// The rule falls between siblings only, so the list neither opens nor closes
// with one; a group and the collection it opens keep none between them; and the
// cards display gets none at all, because a grid separated by rules would draw
// them across the gaps.

readonly rooms = [
  { id: 1, name: 'Despacho 1', kind: 'Office', rate: 'from 900,00 € / month' },
  { id: 2, name: 'Sala Timple', kind: 'Meeting room', rate: 'from 90,00 € / day' },
  { id: 3, name: 'Zona compartida', kind: 'Coworking', rate: 'from 180,00 € / month' }
];`;
}
