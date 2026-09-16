import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Theming the filter row, which is the migration path out of 22.17.0.
 *
 * Until that release the filter controls and the clear-filters button wore Bootstrap class names —
 * `.form-control`, `.form-select`, `.btn.btn-outline-danger` — and a product that does not ship
 * Bootstrap got a filter row nobody could see. They are drawn from tokens now, which means CSS
 * that reached them through those names no longer matches and has to come through here instead.
 *
 * The right-hand table also restores what the old clear button looked like: red at rest rather
 * than neutral-until-hover. It is three declarations, and it is the answer to the one question a
 * consumer upgrading will actually ask.
 *
 * Type in a filter to see `hub-table__filter-cell--active`, and in the search box to see the
 * clear affordance the same release added.
 */
@Component({
	selector: 'app-filter-theming-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="filter-theme-samples">
			<div class="filter-theme filter-theme--ink">
				<h6>Themed through the tokens</h6>
				<hub-table [data]="users" [headers]="headers" [searchable]="true" />
			</div>

			<div class="filter-theme filter-theme--legacy">
				<h6>Clear button back to red at rest</h6>
				<hub-table [data]="users" [headers]="headers" [searchable]="true" />
			</div>
		</div>
	`,
	styles: [
		`
			.filter-theme-samples {
				display: grid;
				gap: 1.75rem;
			}

			.filter-theme {
				display: grid;
				gap: 0.85rem;
			}

			.filter-theme h6 {
				margin: 0;
				font-weight: 700;
			}

			.filter-theme--ink .hub-table {
				--hub-table-filter-row-bg: #f8fafc;
				--hub-table-filter-cell-padding-x: 0.75rem;
				--hub-table-filter-cell-padding-y: 0.5rem;
				--hub-table-filter-control-bg: #ffffff;
				--hub-table-filter-control-color: #0f172a;
				--hub-table-filter-control-placeholder-color: #94a3b8;
				--hub-table-filter-control-border-color: #cbd5e1;
				--hub-table-filter-control-border-radius: 0.5rem;
				--hub-table-filter-control-focus-border-color: #6366f1;
				--hub-table-filter-control-focus-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
				--hub-table-filter-control-active-bg: #eef2ff;
				--hub-table-filter-control-active-border-color: #6366f1;
				--hub-table-delete-filters-color: #475569;
				--hub-table-delete-filters-border-color: #cbd5e1;
				--hub-table-delete-filters-hover-bg: rgba(99, 102, 241, 0.12);
				--hub-table-delete-filters-hover-color: #4338ca;
				--hub-table-delete-filters-hover-border-color: #6366f1;
			}

			/* The three declarations that undo the 22.17.0 change of emphasis. */
			.filter-theme--legacy .hub-table {
				--hub-table-delete-filters-color: var(--hub-sys-color-danger);
				--hub-table-delete-filters-border-color: var(--hub-sys-color-danger);
				--hub-table-delete-filters-hover-bg: var(--hub-sys-color-danger);
			}
		`
	]
})
export class FilterThemingTableExampleComponent {
	protected readonly users = [
		{ id: 1, name: 'Marta Ruiz', role: 'Admin', city: 'Valencia' },
		{ id: 2, name: 'Carlos Vega', role: 'Editor', city: 'Sevilla' },
		{ id: 3, name: 'Lucia Moreno', role: 'User', city: 'Bilbao' },
		{ id: 4, name: 'Pablo Serra', role: 'Editor', city: 'Valencia' }
	];

	protected readonly headers: PaginableTableHeader[] = [
		{ property: 'name', title: 'Name', filter: { type: 'text' } },
		{ property: 'role', title: 'Role', filter: { type: 'text' } },
		{ property: 'city', title: 'City', filter: { type: 'text' } }
	];

	static readonly templateCode = `<hub-table [data]="users" [headers]="headers" [searchable]="true" />`;

	static readonly cssCode = `/* 22.17.0 stopped naming Bootstrap classes in the filter row, so CSS that
   reached it through .form-control / .btn-outline-danger no longer matches.
   These are the tokens that replace them. */
.hub-table {
  --hub-table-filter-row-bg: #f8fafc;
  --hub-table-filter-cell-padding-x: 0.75rem;
  --hub-table-filter-cell-padding-y: 0.5rem;

  --hub-table-filter-control-bg: #ffffff;
  --hub-table-filter-control-color: #0f172a;
  --hub-table-filter-control-placeholder-color: #94a3b8;
  --hub-table-filter-control-border-color: #cbd5e1;
  --hub-table-filter-control-border-radius: 0.5rem;
  --hub-table-filter-control-focus-border-color: #6366f1;
  --hub-table-filter-control-focus-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);

  /* A filter holding a value marks its cell — hub-table__filter-cell--active. */
  --hub-table-filter-control-active-bg: #eef2ff;
  --hub-table-filter-control-active-border-color: #6366f1;

  --hub-table-delete-filters-color: #475569;
  --hub-table-delete-filters-border-color: #cbd5e1;
  --hub-table-delete-filters-hover-bg: rgba(99, 102, 241, 0.12);
  --hub-table-delete-filters-hover-color: #4338ca;
  --hub-table-delete-filters-hover-border-color: #6366f1;
}

/* The clear-filters button is neutral at rest now and destructive on hover.
   To have it red at rest again, as it was before 22.17.0: */
.hub-table {
  --hub-table-delete-filters-color: var(--hub-sys-color-danger);
  --hub-table-delete-filters-border-color: var(--hub-sys-color-danger);
  --hub-table-delete-filters-hover-bg: var(--hub-sys-color-danger);
}`;

	static readonly componentCode = `headers: PaginableTableHeader[] = [
  { property: 'name', title: 'Name', filter: { type: 'text' } },
  { property: 'role', title: 'Role', filter: { type: 'text' } },
  { property: 'city', title: 'City', filter: { type: 'text' } }
];`;
}
