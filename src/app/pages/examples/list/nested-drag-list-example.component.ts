import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubListComponent, ListSortEvent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

/**
 * A node of the nested (tree) structure used by the example.
 */
interface FileNode {
	id: number;
	name: string;
	children?: Array<FileNode>;
}

/**
 * Demonstrates drag-and-drop reordering in **nested (tree) lists** declared via
 * `bindChildren`. Items can be reordered among their siblings and moved into another
 * folder at any depth; the list forbids dropping a folder into its own subtree. The whole
 * row is the drag surface (no handle declared).
 */
@Component({
	selector: 'app-nested-drag-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<p class="text-muted small mb-2">Drag files between folders, or reorder within a folder.</p>
		<hub-list
			class="nested-drag-list"
			[items]="tree()"
			[bindLabel]="'name'"
			[bindChildren]="'children'"
			[sortable]="true"
			[keyboardSortable]="true"
			[options]="{ hoverableRows: true, collapsed: false }"
			(sorted)="onSorted($event)"
		>
			<ng-template listItemTpt let-item="data">
				<span class="d-inline-flex align-items-center gap-2">
					<i
						class="fa-solid"
						[class]="item.children?.length ? 'fa-folder text-warning' : 'fa-file text-secondary'"
						aria-hidden="true"
					></i>
					{{ item.name }}
				</span>
			</ng-template>
		</hub-list>

		<p class="dnd-status"><strong>Last event:</strong> {{ lastEvent() || 'drag a file or folder to reorder it' }}</p>
	`,
	styles: [
		`
			.nested-drag-list .hub-list__item {
				cursor: grab;
			}

			.nested-drag-list .hub-list__item--dragging {
				cursor: grabbing;
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
export class NestedDragListExampleComponent {
	/** The tree, reordered in place by drag-and-drop. */
	readonly tree = signal<Array<FileNode>>([
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
				{ id: 12, name: 'Invoices.xlsx' },
				{ id: 13, name: 'Notes.md' }
			]
		},
		{
			id: 2,
			name: 'Media',
			children: [
				{ id: 21, name: 'logo.svg' },
				{ id: 22, name: 'hero.png' }
			]
		},
		{ id: 3, name: 'Readme.txt' }
	]);

	/** Human-readable summary of the last reorder. */
	readonly lastEvent = signal<string>('');

	/**
	 * Reflects the reorder emitted by the list. The list mutates the tree in place, so a
	 * shallow re-set of the root signal is enough to re-flow the (already updated) tree.
	 *
	 * @param event The typed sort event (its `parentItem`/`depth` locate the affected folder).
	 */
	onSorted(event: ListSortEvent<FileNode>): void {
		this.tree.set([...this.tree()]);
		const parent = event.parentItem ? `"${event.parentItem.name}"` : 'the root';
		this.lastEvent.set(`Moved "${event.item.name}" within ${parent} → position ${event.currentIndex + 1}`);
	}

	/** Template snippet shown in the example viewer. */
	static readonly templateCode = `<hub-list
  [items]="tree()"
  [bindLabel]="'name'"
  [bindChildren]="'children'"
  [sortable]="true"
  [keyboardSortable]="true"
  [options]="{ hoverableRows: true, collapsed: false }"
  (sorted)="onSorted($event)"
>
  <ng-template listItemTpt let-item="data">
    <i class="fa-solid" [class]="item.children?.length ? 'fa-folder' : 'fa-file'"></i>
    {{ item.name }}
  </ng-template>
</hub-list>`;

	/** Component snippet shown in the example viewer. */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubListComponent, ListSortEvent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-nested-drag-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  template: \`...\`
})
export class NestedDragListExampleComponent {
  readonly tree = signal([
    { id: 1, name: 'Documents', children: [{ id: 11, name: 'Reports', children: [...] }] },
    { id: 2, name: 'Media', children: [{ id: 21, name: 'logo.svg' }] }
  ]);

  // Reorder within a folder or move between folders at any depth.
  // event.parentItem / event.depth identify the affected collection.
  onSorted(event: ListSortEvent): void {
    this.tree.set([...this.tree()]);
  }
}`;
}
