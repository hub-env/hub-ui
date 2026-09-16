import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

/**
 * Demonstrates hierarchical (nested/tree) lists via the `bindChildren` input,
 * in both the default list layout and the card layout (`options.display = 'cards'`).
 * Items expose a `children` array; the component renders an expand/collapse
 * chevron automatically for any item that has children.
 */
@Component({
	selector: 'app-nested-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<h6 class="mb-2">Tree list</h6>
		<hub-list
			[items]="items"
			[bindLabel]="'name'"
			[bindChildren]="'children'"
			[options]="{ hoverableRows: true, collapsed: false }"
		>
			<ng-template listItemTpt let-item="data">
				<span class="d-inline-flex align-items-center gap-2">
					<i
						class="fa-solid"
						[class]="item.children?.length ? 'fa-folder text-warning' : 'fa-file text-secondary'"
					></i>
					{{ item.name }}
				</span>
			</ng-template>
		</hub-list>

		<h6 class="mt-4 mb-2">Cards with nested items</h6>
		<hub-list
			[items]="items"
			[bindLabel]="'name'"
			[bindChildren]="'children'"
			[options]="{ display: 'cards', collapsed: false }"
		>
			<ng-template listItemTpt let-item="data">
				<span class="d-inline-flex align-items-center gap-2">
					<i
						class="fa-solid"
						[class]="item.children?.length ? 'fa-folder text-warning' : 'fa-file text-secondary'"
					></i>
					{{ item.name }}
				</span>
			</ng-template>
		</hub-list>
	`
})
export class NestedListExampleComponent {
	items = [
		{
			id: 1,
			name: 'Documents',
			children: [
				{
					id: 11,
					name: 'Reports',
					children: [
						{ id: 111, name: 'Q1-2026.pdf' },
						{ id: 112, name: 'Q2-2026.pdf' }
					]
				},
				{ id: 12, name: 'Invoices' }
			]
		},
		{
			id: 2,
			name: 'Media',
			children: [
				{ id: 21, name: 'Photos' },
				{ id: 22, name: 'Videos' }
			]
		},
		{ id: 3, name: 'Readme.txt' }
	];

	static readonly templateCode = `<!-- Tree list -->
<hub-list
  [items]="items"
  [bindLabel]="'name'"
  [bindChildren]="'children'"
  [options]="{ hoverableRows: true, collapsed: false }">
  <ng-template listItemTpt let-item="data">
    {{ item.name }}
  </ng-template>
</hub-list>

<!-- Cards with nested items -->
<hub-list
  [items]="items"
  [bindLabel]="'name'"
  [bindChildren]="'children'"
  [options]="{ display: 'cards', collapsed: false }">
  <ng-template listItemTpt let-item="data">
    {{ item.name }}
  </ng-template>
</hub-list>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-nested-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  template: \`...\`
})
export class NestedListExampleComponent {
  // Each item can expose a 'children' array; nesting is unlimited.
  items = [
    {
      id: 1,
      name: 'Documents',
      children: [
        { id: 11, name: 'Reports', children: [{ id: 111, name: 'Q1-2026.pdf' }] },
        { id: 12, name: 'Invoices' }
      ]
    },
    { id: 2, name: 'Media', children: [{ id: 21, name: 'Photos' }] },
    { id: 3, name: 'Readme.txt' }
  ];
}`;
}
