import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Row actions saying how they should look.
 *
 * The table draws these buttons itself — plain `<button>` elements, not the `hubButton`
 * primitive, whose appearance rules are `:host(...)`-scoped and so match nothing on an
 * element it did not create. Before `variant` and `color`, a consumer who wanted a row
 * action to read like the buttons beside it had to rebuild the tint in its own
 * stylesheet, which meant two copies of one formula free to drift apart.
 */
@Component({
	selector: 'app-action-variants-table-example',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [HubTableComponent],
	template: `
		<hub-table [data]="rooms" [headers]="headers" [paginate]="false" />

		@if (log().length) {
			<p class="mt-3 mb-0 text-muted">Last action: {{ log()[0] }}</p>
		}
	`
})
export class ActionVariantsTableExampleComponent {
	protected readonly log = signal<string[]>([]);

	protected readonly rooms = [
		{ id: 1, name: 'Sala Azul', seats: 8 },
		{ id: 2, name: 'Sala Verde', seats: 4 },
		{ id: 3, name: 'Despacho 12', seats: 2 }
	];

	protected readonly headers: PaginableTableHeader[] = [
		{ property: 'name', title: 'Room' },
		{ property: 'seats', title: 'Seats', align: 'end' },
		{
			property: 'actions',
			title: 'Actions',
			align: 'end',
			onlyButtons: true,
			buttons: [
				// No variant: the plain bordered button this table has always drawn.
				{
					icon: 'icon--ph--eye',
					tooltip: 'View',
					handler: ({ data }: any) => this.record(`viewed ${data.name}`)
				},
				// Tinted, which is what a row of actions usually wants to be.
				{
					icon: 'icon--ph--pencil',
					tooltip: 'Edit',
					variant: 'soft',
					color: 'primary',
					handler: ({ data }: any) => this.record(`edited ${data.name}`)
				},
				{
					icon: 'icon--ph--trash',
					tooltip: 'Delete',
					variant: 'soft',
					color: 'danger',
					handler: ({ data }: any) => this.record(`deleted ${data.name}`)
				},
				// A variant with no colour is neutral, not colourless.
				{
					icon: 'icon--ph--dots-three-vertical',
					tooltip: 'More',
					variant: 'ghost',
					handler: ({ data }: any) => this.record(`more on ${data.name}`)
				}
			]
		}
	];

	static readonly templateCode = `<hub-table [data]="rooms" [headers]="headers" [paginate]="false" />`;

	static readonly componentCode = `import { PaginableTableHeader } from 'ng-hub-ui-paginable';

headers: PaginableTableHeader[] = [
  { property: 'name', title: 'Room' },
  { property: 'seats', title: 'Seats', align: 'end' },
  {
    property: 'actions',
    title: 'Actions',
    align: 'end',
    onlyButtons: true,
    buttons: [
      // No variant: the plain bordered button, which is the default and
      // what every table already in use keeps getting.
      { icon: 'icon--ph--eye', tooltip: 'View', handler: view },

      // The same vocabulary hubButton uses. The tints ship with the table,
      // so a row action and a real <button hubButton variant="soft"> read
      // the same side by side.
      { icon: 'icon--ph--pencil', tooltip: 'Edit',
        variant: 'soft', color: 'primary', handler: edit },
      { icon: 'icon--ph--trash', tooltip: 'Delete',
        variant: 'soft', color: 'danger', handler: remove },

      // A variant with no colour is neutral — not colourless.
      { icon: 'icon--ph--dots-three-vertical', tooltip: 'More',
        variant: 'ghost', handler: more }
    ]
  }
];

// \`default\` takes no colour: it is the plain bordered button, and colouring
// it would be giving it a variant by the back door.`;

	private record(what: string): void {
		this.log.update((entries) => [what, ...entries].slice(0, 5));
	}
}
