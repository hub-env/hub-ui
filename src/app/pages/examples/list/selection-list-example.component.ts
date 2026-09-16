import { Component, ChangeDetectionStrategy } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Selectable list example.
 *
 * A `selectable` list marks each item (and card) with a `pointer` cursor on hover to
 * advertise it is interactive, and surfaces the choice with the `hub-list__item--selected`
 * accent tint.
 *
 * The two modes are shown together because the difference that matters is not the control
 * but the VALUE. `multiple` renders checkboxes and answers with an array. `single` renders
 * radios and answers with the value itself — not a list of one — exactly as `hub-select`
 * does, so asking "which one" never means reading `[0]` and then telling an empty array
 * apart from a missing answer.
 */
@Component({
	selector: 'app-selection-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, FormsModule, JsonPipe, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="alert alert-info mb-3">
			<strong>Hover a row.</strong> Selectable items show a <code>pointer</code> cursor; tick the checkbox to select.
		</div>

		<hub-list
			[items]="members"
			[bindLabel]="'name'"
			[selectable]="selectionTypes.Multiple"
			[options]="{ hoverableRows: true }"
			[(ngModel)]="selected"
		>
			<ng-template listItemTpt let-item="data">
				<div class="d-flex align-items-center gap-2 p-2">
					<hub-badge color="secondary">{{ item.role }}</hub-badge>
					<span>{{ item.name }}</span>
				</div>
			</ng-template>
		</hub-list>

		<div class="mt-3 p-2 bg-light border rounded">
			<strong>Selected:</strong> {{ selected.length }} — <code>{{ selected | json }}</code>
		</div>

		<h5 class="mt-4">Single</h5>
		<div class="alert alert-info mb-3">One of these, and only one. Picking a row releases the previous one.</div>

		<hub-list
			[items]="members"
			[bindLabel]="'name'"
			[bindValue]="'name'"
			[selectable]="selectionTypes.Single"
			[options]="{ hoverableRows: true }"
			[(ngModel)]="lead"
		>
			<ng-template listItemTpt let-item="data">
				<div class="d-flex align-items-center gap-2 p-2">
					<hub-badge color="secondary">{{ item.role }}</hub-badge>
					<span>{{ item.name }}</span>
				</div>
			</ng-template>
		</hub-list>

		<div class="mt-3 p-2 bg-light border rounded">
			<strong>Lead:</strong> <code>{{ lead === null ? 'null' : lead }}</code>
		</div>
	`
})
export class SelectionListExampleComponent {
	readonly selectionTypes = SelectionTypes;
	selected: unknown[] = [];

	/** A bare value, because that is what single mode emits. */
	lead: string | null = null;

	members = [
		{ name: 'Ada Lovelace', role: 'Eng' },
		{ name: 'Alan Turing', role: 'Research' },
		{ name: 'Grace Hopper', role: 'Arch' },
		{ name: 'Katherine Johnson', role: 'Data' }
	];

	static readonly templateCode = `<!-- multiple: checkboxes, and the value is an array -->
<hub-list
  [items]="members"
  [bindLabel]="'name'"
  [selectable]="selectionTypes.Multiple"
  [(ngModel)]="selected"
>
  <ng-template listItemTpt let-item="data">
    <span>{{ item.name }}</span>
  </ng-template>
</hub-list>

<!-- single: radios, and the value is the value — not a list of one -->
<hub-list
  [items]="members"
  [bindLabel]="'name'"
  [bindValue]="'name'"
  [selectable]="selectionTypes.Single"
  [(ngModel)]="lead"
>
  <ng-template listItemTpt let-item="data">{{ item.name }}</ng-template>
</hub-list>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-selection-list',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  templateUrl: './selection-list.component.html'
})
export class SelectionListComponent {
  readonly selectionTypes = SelectionTypes;
  selected = [];
  // A selectable list renders each item with cursor: pointer on hover.
}`;
}
