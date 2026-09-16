import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubListComponent, ListSortEvent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

/**
 * A simple item used by the whole-item drag example.
 */
interface Track {
	id: number;
	title: string;
	artist: string;
}

/**
 * Demonstrates drag-and-drop reordering **without a drag handle**: because no
 * `hubListDragHandle` is declared inside the item template, the whole row is the drag
 * surface — grab any part of a row (except interactive controls) and drop it to reorder.
 */
@Component({
	selector: 'app-whole-item-drag-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<p class="text-muted small mb-2">No handle — grab anywhere on a row to drag it.</p>
		<hub-list
			class="whole-item-list"
			[items]="tracks()"
			[bindLabel]="'title'"
			[sortable]="true"
			[keyboardSortable]="true"
			[options]="{ hoverableRows: true }"
			(sorted)="onSorted($event)"
		>
			<ng-template listItemTpt let-item="data" let-index="index">
				<div class="d-flex align-items-center gap-3 w-100">
					<span class="track-index">{{ index + 1 }}</span>
					<div class="flex-grow-1">
						<div class="fw-semibold">{{ item.title }}</div>
						<small class="text-muted">{{ item.artist }}</small>
					</div>
					<i class="fa-solid fa-grip-vertical text-muted" aria-hidden="true"></i>
				</div>
			</ng-template>
		</hub-list>

		<p class="dnd-status">
			<strong>Last event:</strong> {{ lastEvent() || 'drag any row, or focus one and press Space then arrows' }}
		</p>
	`,
	styles: [
		`
			.whole-item-list {
				--hub-list-item-padding-y: 0.75rem;
			}

			.whole-item-list .hub-list__item {
				cursor: grab;
			}

			.whole-item-list .hub-list__item--dragging {
				cursor: grabbing;
			}

			.track-index {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 1.75rem;
				height: 1.75rem;
				border-radius: 999px;
				background: var(--hub-ref-surface-2, #f1f3f5);
				font-size: 0.85rem;
				font-weight: 700;
				flex-shrink: 0;
			}

			.dnd-status {
				margin: 1rem 0 0;
				padding: 0.5rem 0.75rem;
				background: var(--hub-ref-surface-2, #f8f9fa);
				border-radius: 0.375rem;
				font-size: 0.9rem;
			}
		`
	]
})
export class WholeItemDragListExampleComponent {
	/** The playlist, reordered by drag-and-drop. */
	readonly tracks = signal<Array<Track>>([
		{ id: 1, title: 'Intro', artist: 'The Standalones' },
		{ id: 2, title: 'Signals & Slots', artist: 'Reactive Trio' },
		{ id: 3, title: 'Zoneless Nights', artist: 'The Standalones' },
		{ id: 4, title: 'Template Syntax', artist: 'Control Flow' },
		{ id: 5, title: 'Outro', artist: 'Reactive Trio' }
	]);

	/** Human-readable summary of the last reorder. */
	readonly lastEvent = signal<string>('');

	/**
	 * Persists the new order emitted by the list.
	 *
	 * @param event The typed sort event.
	 */
	onSorted(event: ListSortEvent<Track>): void {
		this.tracks.set([...(event.items as Array<Track>)]);
		this.lastEvent.set(`Moved "${event.item.title}" to position ${event.currentIndex + 1}`);
	}

	/** Template snippet shown in the example viewer. */
	static readonly templateCode = `<!-- No hubListDragHandle inside the template → the whole row is draggable -->
<hub-list
  [items]="tracks()"
  [bindLabel]="'title'"
  [sortable]="true"
  [keyboardSortable]="true"
  [options]="{ hoverableRows: true }"
  (sorted)="onSorted($event)"
>
  <ng-template listItemTpt let-item="data" let-index="index">
    <div class="d-flex align-items-center gap-3 w-100">
      <span class="track-index">{{ index + 1 }}</span>
      <div class="flex-grow-1">
        <div class="fw-semibold">{{ item.title }}</div>
        <small class="text-muted">{{ item.artist }}</small>
      </div>
    </div>
  </ng-template>
</hub-list>`;

	/** Component snippet shown in the example viewer. */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubListComponent, ListSortEvent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-whole-item-drag-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  template: \`...\`
})
export class WholeItemDragListExampleComponent {
  readonly tracks = signal([
    { id: 1, title: 'Intro', artist: 'The Standalones' },
    { id: 2, title: 'Signals & Slots', artist: 'Reactive Trio' }
  ]);

  // With no handle declared, the whole row is the drag surface.
  onSorted(event: ListSortEvent): void {
    this.tracks.set([...event.items]);
  }
}`;
}
