import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
	HubListDragHandleDirective,
	HubListComponent,
	ListSortEvent,
	HubPaginableListItemDirective
} from 'ng-hub-ui-paginable';

/**
 * A task item used by the drag-and-drop example.
 */
interface Task {
	id: number;
	name: string;
}

/**
 * Demonstrates native drag-and-drop reordering of `hub-list`: in-list reordering with a
 * drag handle, cross-list transfer between two lists sharing a `dragGroup`, keyboard
 * reordering and the typed `(sorted)` event.
 */
@Component({
	selector: 'app-drag-drop-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, HubListDragHandleDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="dnd-demo">
			<section class="dnd-demo__col">
				<h5 class="dnd-demo__title">To do</h5>
				<hub-list
					[items]="todo()"
					[bindLabel]="'name'"
					[sortable]="true"
					[dragGroup]="'tasks'"
					[keyboardSortable]="true"
					(sorted)="onSorted('todo', $event)"
				>
					<ng-template listItemTpt let-item="data">
						<span class="dnd-handle" hubListDragHandle aria-hidden="true">⠿</span>
						<span class="dnd-label">{{ item.name }}</span>
					</ng-template>
				</hub-list>
			</section>

			<section class="dnd-demo__col">
				<h5 class="dnd-demo__title">Done</h5>
				<hub-list
					[items]="done()"
					[bindLabel]="'name'"
					[sortable]="true"
					[dragGroup]="'tasks'"
					[keyboardSortable]="true"
					(sorted)="onSorted('done', $event)"
				>
					<ng-template listItemTpt let-item="data">
						<span class="dnd-handle" hubListDragHandle aria-hidden="true">⠿</span>
						<span class="dnd-label">{{ item.name }}</span>
					</ng-template>
				</hub-list>
			</section>
		</div>

		<p class="dnd-demo__status">
			<strong>Last event:</strong>
			{{ lastEvent() || 'drag a row by its handle, or focus it and press Space then arrows' }}
		</p>
	`,
	styles: [
		`
			.dnd-demo {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
				gap: 1.5rem;
			}

			.dnd-demo__title {
				margin: 0 0 0.5rem;
				font-size: 0.95rem;
				font-weight: 700;
			}

			.dnd-handle {
				cursor: grab;
				color: var(--hub-sys-text-muted, #6c757d);
				font-size: 1.1rem;
				line-height: 1;
			}

			.dnd-label {
				flex: 1 1 auto;
			}

			.dnd-demo__status {
				margin: 1rem 0 0;
				padding: 0.5rem 0.75rem;
				background: var(--hub-ref-surface-2, #f8f9fa);
				border-radius: 0.375rem;
				font-size: 0.9rem;
			}
		`
	]
})
export class DragDropListExampleComponent {
	/** Items of the first (To do) list. */
	readonly todo = signal<Array<Task>>([
		{ id: 1, name: 'Design the dashboard' },
		{ id: 2, name: 'Implement the API client' },
		{ id: 3, name: 'Write unit tests' },
		{ id: 4, name: 'Review pull requests' }
	]);

	/** Items of the second (Done) list. */
	readonly done = signal<Array<Task>>([
		{ id: 5, name: 'Set up the project' },
		{ id: 6, name: 'Configure CI' }
	]);

	/** Human-readable summary of the last sort event. */
	readonly lastEvent = signal<string>('');

	/**
	 * Persists the result of a reorder/transfer emitted by the destination list.
	 *
	 * @param target Which list emitted the event.
	 * @param event The typed sort event.
	 */
	onSorted(target: 'todo' | 'done', event: ListSortEvent<Task>): void {
		if (target === 'todo') {
			this.todo.set([...(event.items as Array<Task>)]);
			if (event.isTransfer && event.previousItems) {
				this.done.set([...(event.previousItems as Array<Task>)]);
			}
		} else {
			this.done.set([...(event.items as Array<Task>)]);
			if (event.isTransfer && event.previousItems) {
				this.todo.set([...(event.previousItems as Array<Task>)]);
			}
		}
		const action = event.isTransfer ? 'Moved' : 'Reordered';
		this.lastEvent.set(`${action} "${event.item.name}" → position ${event.currentIndex + 1}`);
	}

	/** Template snippet shown in the example viewer. */
	static readonly templateCode = `<hub-list
  [items]="todo()"
  [bindLabel]="'name'"
  [sortable]="true"
  [dragGroup]="'tasks'"
  [keyboardSortable]="true"
  (sorted)="onSorted('todo', $event)"
>
  <ng-template listItemTpt let-item="data">
    <span hubListDragHandle aria-hidden="true">⠿</span>
    <span>{{ item.name }}</span>
  </ng-template>
</hub-list>

<hub-list
  [items]="done()"
  [bindLabel]="'name'"
  [sortable]="true"
  [dragGroup]="'tasks'"
  [keyboardSortable]="true"
  (sorted)="onSorted('done', $event)"
>
  <ng-template listItemTpt let-item="data">
    <span hubListDragHandle aria-hidden="true">⠿</span>
    <span>{{ item.name }}</span>
  </ng-template>
</hub-list>`;

	/** Component snippet shown in the example viewer. */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  HubListDragHandleDirective,
  HubListComponent,
  ListSortEvent,
  HubPaginableListItemDirective
} from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-drag-drop-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective, HubListDragHandleDirective],
  template: \`...\`
})
export class DragDropListExampleComponent {
  readonly todo = signal([
    { id: 1, name: 'Design the dashboard' },
    { id: 2, name: 'Implement the API client' }
  ]);
  readonly done = signal([{ id: 5, name: 'Set up the project' }]);

  // Two lists that share the same dragGroup can exchange items.
  // Only the destination list emits (sorted): event.items is the
  // destination order and event.previousItems the source order.
  onSorted(target: 'todo' | 'done', event: ListSortEvent): void {
    if (target === 'todo') {
      this.todo.set([...event.items]);
      if (event.isTransfer && event.previousItems) {
        this.done.set([...event.previousItems]);
      }
    } else {
      this.done.set([...event.items]);
      if (event.isTransfer && event.previousItems) {
        this.todo.set([...event.previousItems]);
      }
    }
  }
}`;
}
