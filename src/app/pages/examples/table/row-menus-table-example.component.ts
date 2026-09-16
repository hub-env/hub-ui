import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HUB_PAGINABLE_ACTIONS, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';
import { hubActionsAdapter } from 'ng-hub-ui-buttons';

/**
 * A row menu, drawn by the button library rather than by the table.
 *
 * What the table drew was markup in Bootstrap class names — `.btn`, `.dropdown-menu`,
 * `.dropdown-item` — which resolve to nothing in a product that does not ship Bootstrap: the
 * trigger fell back to the browser's default grey button and the panel was a transparent box with
 * no border, shadow or padding. Rather than restyle a second dropdown implementation, the table
 * now describes what a row offers and a registered adapter draws it with the real component —
 * placement, outside-click, Escape, scroll and focus already solved.
 *
 * Neither package depends on the other. This example provides the token locally to show the
 * wiring; an application registers it once with `provideHubPaginableActions(hubActionsAdapter)`.
 *
 * Two rows are worth pointing at: Bob Johnson is inactive, so the menu itself is refused, and
 * Alice Brown is an editor, so only the item that needs ownership is.
 */
@Component({
	selector: 'app-row-menus-table-example',
	standalone: true,
	imports: [HubTableComponent],
	// App-wide you would write providers: [provideHubPaginableActions(hubActionsAdapter)].
	// Provided on the component here so the example carries its own wiring.
	providers: [{ provide: HUB_PAGINABLE_ACTIONS, useValue: hubActionsAdapter }],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-table [data]="users" [headers]="headers" />

		@if (log().length) {
			<div class="alert alert-info mt-3 mb-0">
				<ul class="mb-0">
					@for (entry of log(); track $index) {
						<li>{{ entry }}</li>
					}
				</ul>
			</div>
		}
	`,
	styles: []
})
export class RowMenusTableExampleComponent {
	protected readonly log = signal<string[]>([]);

	protected readonly users = [
		{ id: 1, name: 'John Doe', role: 'Admin', status: 'Active' },
		{ id: 2, name: 'Jane Smith', role: 'Owner', status: 'Active' },
		{ id: 3, name: 'Bob Johnson', role: 'User', status: 'Inactive' },
		{ id: 4, name: 'Alice Brown', role: 'Editor', status: 'Active' }
	];

	protected readonly headers: PaginableTableHeader[] = [
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' },
		{ property: 'status', title: 'Status' },
		{
			property: 'actions',
			title: 'Actions',
			onlyButtons: true,
			buttons: [
				{
					icon: 'fa-solid fa-pen',
					title: 'Edit',
					variant: 'outline',
					color: 'primary',
					handler: (event: any) => this.record(`Edited ${event.data.name}`)
				},
				{
					icon: 'fa-solid fa-ellipsis',
					title: 'More',
					variant: 'ghost',
					// The menu itself is refused on an inactive row: everything inside it acts on a
					// user who is not there to be acted on.
					disabled: (row: any) => row.data.status === 'Inactive',
					tooltip: 'Inactive users cannot be managed',
					buttons: [
						{
							icon: 'fa-solid fa-copy',
							title: 'Duplicate',
							handler: (event: any) => this.record(`Duplicated ${event.data.name}`)
						},
						{
							icon: 'fa-solid fa-key',
							title: 'Transfer ownership',
							// Refused rather than hidden, so the menu keeps its shape row by row.
							disabled: (row: any) => row.data.role !== 'Owner',
							handler: (event: any) => this.record(`Transferred ${event.data.name}`)
						},
						{
							icon: 'fa-solid fa-trash',
							title: 'Delete',
							color: 'danger',
							// Genuinely absent for an admin, which is what `hidden` is for.
							hidden: (row: any) => row.data.role === 'Admin',
							handler: (event: any) => this.record(`Deleted ${event.data.name}`)
						}
					]
				}
			]
		}
	];

	private record(message: string): void {
		this.log.update((entries) => [message, ...entries].slice(0, 4));
	}

	static readonly templateCode = `<hub-table [data]="users" [headers]="headers" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { provideHubPaginableActions, HubTableComponent } from 'ng-hub-ui-paginable';
import { hubActionsAdapter } from 'ng-hub-ui-buttons';

// Register once for the application. Neither package depends on the other:
// the table describes what a row offers, the adapter draws it.
// providers: [provideHubPaginableActions(hubActionsAdapter)]

export class RowMenusComponent {
  headers = [
    { property: 'name', title: 'Name' },
    { property: 'role', title: 'Role' },
    { property: 'status', title: 'Status' },
    {
      property: 'actions',
      title: 'Actions',
      onlyButtons: true,
      buttons: [
        {
          icon: 'fa-solid fa-pen',
          title: 'Edit',
          variant: 'outline',
          color: 'primary',
          handler: (event) => this.edit(event.data)
        },
        {
          icon: 'fa-solid fa-ellipsis',
          title: 'More',
          variant: 'ghost',
          // New in 22.16.0: a menu can be refused on a row like any other action.
          disabled: (row) => row.data.status === 'Inactive',
          tooltip: 'Inactive users cannot be managed',
          buttons: [
            { icon: 'fa-solid fa-copy', title: 'Duplicate', handler: (event) => this.duplicate(event.data) },
            {
              icon: 'fa-solid fa-key',
              title: 'Transfer ownership',
              // Refused, so the menu keeps its shape row by row.
              disabled: (row) => row.data.role !== 'Owner',
              handler: (event) => this.transfer(event.data)
            },
            {
              icon: 'fa-solid fa-trash',
              title: 'Delete',
              color: 'danger',
              // Genuinely absent here, which is what hidden is for.
              hidden: (row) => row.data.role === 'Admin',
              handler: (event) => this.remove(event.data)
            }
          ]
        }
      ]
    }
  ];
}`;
}
