import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Sticky header example — two ways to pin the header.
 *
 * 1. `[stickyHeader]="true"` (container-agnostic): the header sticks inside ANY
 *    scroll parent the consumer provides (a plain `max-height` + `overflow:auto`
 *    div), independent of the built-in scroll frame.
 * 2. `options.scrollable` + `--hub-table-container-max-block-size`: the built-in
 *    scroll frame caps the body height and pins the header.
 *
 * `--hub-table-head-sticky-top` offsets the header below a toolbar in both.
 */
@Component({
	selector: 'app-sticky-header-scroll-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			/* The consumer owns the scroll container; the table only sticks the header. */
			.sticky-header-scope {
				max-height: 280px;
				overflow: auto;
			}

			.scroll-body-scope .hub-table {
				--hub-table-container-max-block-size: 280px;
			}
		</style>

		<div class="alert alert-info mb-3">
			<strong>Scroll vertically.</strong> Both tables cap the body at 280px and keep the header pinned — the first via
			<code>[stickyHeader]</code> inside a plain scroll div, the second via the built-in
			<code>options.scrollable</code> frame.
		</div>

		<h6 class="mb-2">With <code>[stickyHeader]</code> (any scroll container)</h6>
		<div class="sticky-header-scope mb-4">
			<hub-table [data]="rows" [headers]="headers" [stickyHeader]="true"></hub-table>
		</div>

		<h6 class="mb-2">With <code>options.scrollable</code> (built-in frame)</h6>
		<div class="scroll-body-scope">
			<hub-table [data]="rows" [headers]="headers" [options]="{ scrollable: true }"></hub-table>
		</div>
	`
})
export class StickyHeaderScrollTableExampleComponent {
	rows = Array.from({ length: 40 }, (_, i) => ({
		id: i + 1,
		name: `Employee ${i + 1}`,
		department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
		location: ['New York', 'London', 'Berlin', 'Tokyo'][i % 4],
		status: i % 5 === 0 ? 'On leave' : 'Active'
	}));

	headers: Array<PaginableTableHeader> = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'department', title: 'Department' },
		{ property: 'location', title: 'Location' },
		{ property: 'status', title: 'Status' }
	];

	static readonly templateCode = `<style>
  /* The consumer owns the scroll container; the table only sticks the header. */
  .sticky-header-scope { max-height: 280px; overflow: auto; }
  .scroll-body-scope .hub-table { --hub-table-container-max-block-size: 280px; }
</style>

<!-- 1. Container-agnostic: sticky header inside any scroll parent -->
<div class="sticky-header-scope">
  <hub-table [data]="rows" [headers]="headers" [stickyHeader]="true"></hub-table>
</div>

<!-- 2. Built-in scroll frame -->
<div class="scroll-body-scope">
  <hub-table [data]="rows" [headers]="headers" [options]="{ scrollable: true }"></hub-table>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-sticky-header-scroll-table',
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './sticky-header-scroll-table.component.html'
})
export class StickyHeaderScrollTableComponent {
  // scrollable + a capped body height = a sticky header while rows scroll under it.
  rows = Array.from({ length: 40 }, (_, i) => ({ id: i + 1, name: 'Employee ' + (i + 1) }));
  headers: PaginableTableHeader[] = [
    { property: 'id',   title: 'ID' },
    { property: 'name', title: 'Name' }
  ];
}`;
}
