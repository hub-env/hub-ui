import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * One-call theming example (`hub-table-theme`).
 *
 * The SCSS mixin themes a table in a single `@include` instead of setting each `--hub-*`
 * token by hand. The preview inlines the CSS that include compiles to, and the CSS tab
 * publishes the include itself — the same entry point, the same selector and the same six
 * parameters, so a reader who copies the snippet gets the table they are looking at.
 */
@Component({
	selector: 'app-mixin-theme-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			/* Compiled output of the @include published in the CSS tab. */
			.mixin-theme-scope .hub-table {
				--hub-table-accent: #6a1b9a;
				--hub-table-selected-bg: #f3e5f5;
				--hub-table-selected-color: #4a148c;
				--hub-table-hover-bg: #faf4fc;
				--hub-table-border-radius: 0.75rem;
				--hub-table-cell-padding-y: 0.5rem;
			}
		</style>

		<div class="mixin-theme-scope">
			<hub-table [data]="rows" [headers]="headers" [selectable]="true"></hub-table>
		</div>
	`
})
export class MixinThemeTableExampleComponent {
	rows = [
		{ code: 'A-01', name: 'Alpha', owner: 'Ada' },
		{ code: 'B-02', name: 'Bravo', owner: 'Alan' },
		{ code: 'C-03', name: 'Charlie', owner: 'Grace' }
	];

	headers: Array<PaginableTableHeader> = [
		{ property: 'code', title: 'Code' },
		{ property: 'name', title: 'Name' },
		{ property: 'owner', title: 'Owner' }
	];

	static readonly templateCode = `<div class="mixin-theme-scope">
  <hub-table [data]="rows" [headers]="headers" [selectable]="true"></hub-table>
</div>`;

	static readonly componentCode = `@Component({ /* … */ })
export class MixinThemeTableExampleComponent {
  rows = [
    { code: 'A-01', name: 'Alpha', owner: 'Ada' },
    { code: 'B-02', name: 'Bravo', owner: 'Alan' },
    { code: 'C-03', name: 'Charlie', owner: 'Grace' }
  ];

  headers: Array<PaginableTableHeader> = [
    { property: 'code', title: 'Code' },
    { property: 'name', title: 'Name' },
    { property: 'owner', title: 'Owner' }
  ];
}`;

	static readonly cssCode = `// One @include instead of setting every token by hand.
@use 'ng-hub-ui-paginable/styles' as paginable;

// The table declares its own token defaults on the host element, so the include has to
// reach the table itself: a value set on a bare wrapper is shadowed and never arrives.
.mixin-theme-scope .hub-table {
  @include paginable.hub-table-theme(
    $accent: #6a1b9a,
    $selected-bg: #f3e5f5,
    $selected-color: #4a148c,
    $hover-bg: #faf4fc,
    $border-radius: 0.75rem,
    $cell-padding-y: 0.5rem
  );
}`;
}
