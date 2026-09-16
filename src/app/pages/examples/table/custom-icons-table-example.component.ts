import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubPaginableTableExpandingRowDirective, PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Custom icon set example.
 *
 * Every built-in table glyph is a `--hub-table-icon-<name>` CSS variable (an SVG
 * painted through `mask-image`, tinted with `currentColor`). This scope swaps
 * several at once — the search box, the sort arrows and the row expander — for a
 * different look, without touching the component.
 */
@Component({
	selector: 'app-custom-icons-table-example',
	standalone: true,
	imports: [HubTableComponent, HubPaginableTableExpandingRowDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			.custom-icons-scope .hub-table {
				/* search box → a star */
				--hub-table-icon-search: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 34 2.3l128.3-68.5 128.3 68.5c11 5.9 24.4 5 34.4-2.3s14.9-19.3 12.9-31.3L461.4 329 565.6 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L403.9 150.3 316.9 18z'/%3E%3C/svg%3E");
				/* unsorted column glyph (the one shown by default) → a bold up-down arrow */
				--hub-table-icon-sort: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 512'%3E%3Cpath d='M145.6 7.7C141.1 2.8 134.7 0 128 0s-13.1 2.8-17.6 7.7l-104 112c-6.5 7-8.2 17.2-4.4 25.9S14.5 160 24 160H80V352H24c-9.5 0-18.2 5.7-22 14.4s-2.1 18.9 4.4 25.9l104 112c4.5 4.9 10.9 7.7 17.6 7.7s13.1-2.8 17.6-7.7l104-112c6.5-7 8.2-17.2 4.4-25.9s-12.5-14.4-22-14.4H176V160h56c9.5 0 18.2-5.7 22-14.4s2.1-18.9-4.4-25.9l-104-112z'/%3E%3C/svg%3E");
				/* active sort → chevrons */
				--hub-table-icon-sort-up: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z'/%3E%3C/svg%3E");
				--hub-table-icon-sort-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5 12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z'/%3E%3C/svg%3E");
				/* expander caret → plus / minus */
				--hub-table-icon-caret-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M416 208H272V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H64c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V272h144c17.7 0 32-14.3 32-32s-14.3-32-32-32z'/%3E%3C/svg%3E");
				--hub-table-icon-caret-up: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M416 208H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z'/%3E%3C/svg%3E");
			}
		</style>

		<div class="alert alert-info mb-3">
			<strong>Search, sort and expand</strong> to see the swapped glyphs. Every icon is a
			<code>--hub-table-icon-*</code> variable.
		</div>

		<div class="custom-icons-scope">
			<hub-table [data]="people" [headers]="headers" [options]="{ searchable: true }">
				<ng-template paginableTableExpandingRow let-item="item" let-colspan="colspan">
					<tr>
						<td [attr.colspan]="colspan" class="p-3 bg-light">{{ item.name }} — {{ item.role }}</td>
					</tr>
				</ng-template>
			</hub-table>
		</div>
	`
})
export class CustomIconsTableExampleComponent {
	people = [
		{ name: 'Ada Lovelace', role: 'Engineer', team: 'Core' },
		{ name: 'Alan Turing', role: 'Researcher', team: 'Labs' },
		{ name: 'Grace Hopper', role: 'Architect', team: 'Platform' },
		{ name: 'Katherine Johnson', role: 'Analyst', team: 'Data' }
	];

	headers: Array<PaginableTableHeader> = [
		{ property: 'name', title: 'Name', sortable: true },
		{ property: 'role', title: 'Role', sortable: true },
		{ property: 'team', title: 'Team', sortable: true }
	];

	static readonly templateCode = `<style>
  .custom-icons-scope .hub-table {
    --hub-table-icon-search:    url("data:image/svg+xml,…"); /* a star */
    --hub-table-icon-sort:      url("data:image/svg+xml,…"); /* unsorted glyph */
    --hub-table-icon-sort-up:   url("data:image/svg+xml,…");
    --hub-table-icon-sort-down: url("data:image/svg+xml,…");
    --hub-table-icon-caret-up:  url("data:image/svg+xml,…");
    --hub-table-icon-caret-down:url("data:image/svg+xml,…");
  }
</style>

<div class="custom-icons-scope">
  <hub-table [data]="people" [headers]="headers" [options]="{ searchable: true }">
    <ng-template paginableTableExpandingRow let-item="item" let-colspan="colspan">
      <tr><td [attr.colspan]="colspan">{{ item.name }}</td></tr>
    </ng-template>
  </hub-table>
</div>`;

	static readonly componentCode = `// Every built-in glyph is a --hub-table-icon-<name> variable:
// search, filter, eraser, info, sort, sort-up, sort-down, caret-up, caret-down,
// chevron-up/down/left/right, angle-left/right, angle-double-left/right,
// ellipsis-v, trash, plus. Override any of them in a scope or globally.
@Component({ /* … */ })
export class CustomIconsTableComponent {
  headers = [
    { property: 'name', title: 'Name', sortable: true },
    { property: 'role', title: 'Role', sortable: true }
  ];
}`;
}
