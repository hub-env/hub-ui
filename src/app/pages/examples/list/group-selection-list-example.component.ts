import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListClickEvent, HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

interface Space {
	name: string;
	children?: Space[];
}

/**
 * Selecting a tree, searching it, and what a click hands over.
 *
 * Three behaviours that only make sense together, because a consumer meets them together the
 * first time they put a nested list behind a form.
 *
 * **A group heading is not a datum.** Ticking a building selects its rooms, not the building:
 * the value carries what can be booked, and "Building A" cannot. While some rooms are on and
 * others are off the heading shows the indeterminate state, which is the only honest answer to
 * "is this selected" — neither box nor blank would be.
 *
 * **The search box searches.** Type a room and the list narrows to it, keeping the building it
 * belongs to so the match is not hidden inside a group that filtered itself away.
 *
 * **In single mode a heading carries no control at all.** The cascade above is the `multiple`
 * answer to "a group is not a datum"; refusing to draw the radio is the `single` one.
 *
 * **A click hands over the item.** `event.item` is the object passed in `items`, and
 * `event.children` its children — not the internal form wrapper the event used to carry.
 */
@Component({
	selector: 'app-group-selection-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, FormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="alert alert-info mb-3">
			Tick a <strong>building</strong> to take its rooms. Tick one room and the building goes indeterminate. Type in the
			search box to narrow the tree.
		</div>

		<hub-list
			[items]="spaces"
			[bindLabel]="'name'"
			[bindValue]="'name'"
			[bindChildren]="'children'"
			[selectable]="selectionTypes.Multiple"
			[clickFn]="onRowClick"
			[options]="{ searchable: true, hoverableRows: true, collapsed: false }"
			[(ngModel)]="selected"
		>
			<ng-template listItemTpt let-item="data">
				<span class="d-inline-flex align-items-center gap-2">
					<i
						class="fa-solid"
						[class]="item.children?.length ? 'fa-building text-warning' : 'fa-door-open text-secondary'"
					></i>
					{{ item.name }}
				</span>
			</ng-template>
		</hub-list>

		<h6 class="mt-4 mb-2">Single, over the same tree</h6>
		<div class="alert alert-info mb-3">Only rooms carry a radio. A heading is not one of the things to choose.</div>

		<hub-list
			[items]="spaces"
			[bindLabel]="'name'"
			[bindValue]="'name'"
			[bindChildren]="'children'"
			[selectable]="selectionTypes.Single"
			[options]="{ hoverableRows: true, collapsed: false }"
			[(ngModel)]="room"
		>
			<ng-template listItemTpt let-item="data">
				<span class="d-inline-flex align-items-center gap-2">{{ item.name }}</span>
			</ng-template>
		</hub-list>

		<div class="mt-3 p-2 bg-light border rounded">
			<div>
				<strong>Selected:</strong> <code>{{ selected | json }}</code>
			</div>
			<div class="mt-1">
				<strong>Last click:</strong> <code>{{ lastClick }}</code>
			</div>
		</div>
	`
})
export class GroupSelectionListExampleComponent {
	readonly selectionTypes = SelectionTypes;

	/** Only rooms ever land here: a heading is not something you can book. */
	selected: unknown[] = [];

	/** Single over the same tree: only a leaf can land here. */
	room: string | null = null;

	lastClick = '(none yet)';

	readonly spaces: Space[] = [
		{
			name: 'Building A',
			children: [{ name: 'Meeting room 1' }, { name: 'Meeting room 2' }, { name: 'Phone booth' }]
		},
		{
			name: 'Building B',
			children: [{ name: 'Studio' }, { name: 'Workshop' }]
		},
		{ name: 'Rooftop' }
	];

	/**
	 * Reads the payload the way the types describe it — which is the point of the change.
	 *
	 * @param event - The click, carrying the item itself and its children.
	 */
	readonly onRowClick = (event: ListClickEvent<Space>): void => {
		const children = event.children?.length ? ` (+${event.children.length} inside)` : '';
		this.lastClick = `${event.item.name}${children}`;
	};

	static readonly templateCode = `<!-- Multiple: ticking a building takes its rooms, and the heading itself never lands in the value -->
<hub-list
  [items]="spaces"
  [bindLabel]="'name'"
  [bindValue]="'name'"
  [bindChildren]="'children'"
  [selectable]="selectionTypes.Multiple"
  [clickFn]="onRowClick"
  [options]="{ searchable: true, hoverableRows: true, collapsed: false }"
  [(ngModel)]="selected">
  <ng-template listItemTpt let-item="data">
    <span class="d-inline-flex align-items-center gap-2">{{ item.name }}</span>
  </ng-template>
</hub-list>

<!-- Single over the same tree: a heading carries no radio at all -->
<hub-list
  [items]="spaces"
  [bindLabel]="'name'"
  [bindValue]="'name'"
  [bindChildren]="'children'"
  [selectable]="selectionTypes.Single"
  [(ngModel)]="room" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListClickEvent, HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective, FormsModule],
  templateUrl: './spaces.component.html'
})
export class SpacesComponent {
  readonly selectionTypes = SelectionTypes;

  // Only rooms ever land here: a heading is not something you can book.
  selected: unknown[] = [];
  room: string | null = null;

  readonly spaces: Space[] = [
    { name: 'Building A', children: [{ name: 'Meeting room 1' }, { name: 'Phone booth' }] },
    { name: 'Building B', children: [{ name: 'Studio' }, { name: 'Workshop' }] },
    { name: 'Rooftop' }
  ];

  // The event carries the item passed in \`items\` and its children, not the
  // internal form wrapper it used to hand over.
  readonly onRowClick = (event: ListClickEvent<Space>): void => {
    console.log(event.item.name, event.children?.length ?? 0);
  };
}`;
}
