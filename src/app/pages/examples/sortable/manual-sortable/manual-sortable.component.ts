import { JsonPipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SortableDirective, SortableEvent, moveItemInArray, transferArrayItem } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubBadgeComponent } from 'ng-hub-ui-badges';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/**
 * Example component demonstrating manual array control mode.
 *
 * This example shows how to use the autoUpdateArray flag set to false,
 * giving you complete control over when and how arrays are updated during
 * drag-and-drop operations. This approach is similar to Angular CDK's
 * drag-and-drop functionality.
 *
 * Benefits of manual control:
 * - Perform validation before updating arrays
 * - Make API calls to persist changes
 * - Use immutable data patterns
 * - Implement undo/redo functionality
 * - Add custom business logic to drag operations
 */
@Component({
	selector: 'app-manual-sortable',
	templateUrl: './manual-sortable.component.html',
	styleUrls: ['./manual-sortable.component.css'],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [ExampleContainerComponent, SortableDirective, JsonPipe, HubButtonComponent, HubBadgeComponent, HubPanelComponent]
})
export class ManualSortableComponent implements FeatureExample {
	title = 'Manual Mode';
	description = 'Take full control of array updates with autoUpdateArray disabled and the moveItemInArray helper.';
	import = `import { SortableDirective, SortableEvent, moveItemInArray } from 'ng-hub-ui-sortable';`;

	/**
	 * Simple task list for demonstrating manual reordering
	 */
	tasks = [
		{ id: 1, title: 'Design UI mockups', completed: false },
		{ id: 2, title: 'Implement authentication', completed: false },
		{ id: 3, title: 'Write unit tests', completed: false },
		{ id: 4, title: 'Deploy to production', completed: false }
	];

	/**
	 * Lists for demonstrating transfer between multiple lists
	 */
	todoList = [
		{ id: 5, title: 'Review pull requests', priority: 'high' },
		{ id: 6, title: 'Update documentation', priority: 'medium' },
		{ id: 7, title: 'Refactor legacy code', priority: 'low' }
	];

	inProgressList = [
		{ id: 8, title: 'Fix bug #123', priority: 'high' },
		{ id: 9, title: 'Add new feature', priority: 'medium' }
	];

	doneList = [{ id: 10, title: 'Initial setup', priority: 'high' }];

	/**
	 * Tracking array for operation history (for demonstration)
	 */
	operationsLog: string[] = [];

	/**
	 * Handler for update events within the same list.
	 * This is called when items are reordered within the tasks list.
	 *
	 * @param event - SortableJS event containing oldIndex and newIndex
	 */
	onTasksUpdate(event: SortableEvent): void {
		if (event.oldIndex === undefined || event.newIndex === undefined) {
			return;
		}

		// If indices are the same, no operation needed
		if (event.oldIndex === event.newIndex) {
			return;
		}

		// Capture task info BEFORE moving
		const task = this.tasks[event.oldIndex];
		this.logOperation(`Reordered "${task.title}" from position ${event.oldIndex} to ${event.newIndex}`);

		// Manually update the array using the helper function
		moveItemInArray(this.tasks, event.oldIndex, event.newIndex);
	}

	/**
	 * Handler for add events when items are dropped into a list.
	 * This is called on the target list when receiving an item.
	 *
	 * @param event - SortableJS event
	 * @param targetList - The list receiving the item
	 * @param listName - Name of the target list for logging
	 */
	onListAdd(event: SortableEvent, targetList: any[], listName: string): void {
		if (event.newIndex === undefined || event.oldIndex === undefined) {
			return;
		}

		// Determine which list the item came from
		const sourceList = this.getListByElement(event.from);
		if (!sourceList) {
			return;
		}

		const item = sourceList[event.oldIndex];
		this.logOperation(`Moved "${item.title}" to ${listName}`);

		// Manually transfer the item using the helper function
		transferArrayItem(sourceList, targetList, event.oldIndex, event.newIndex);
	}

	/**
	 * Handler for remove events when items are dragged out of a list.
	 * Note: In manual mode, we handle the actual removal in the onListAdd handler
	 * to ensure the operation is atomic.
	 *
	 * @param _event - SortableJS event
	 */
	onListRemove(_event: SortableEvent): void {
		// In manual mode with transferArrayItem, the removal is handled
		// automatically by the add handler on the target list
		// This event can be used for additional logging or validation
	}

	/**
	 * Handler for update events in the multi-list scenario.
	 *
	 * @param event - SortableJS event
	 * @param list - The list being reordered
	 * @param listName - Name of the list for logging
	 */
	onListUpdate(event: SortableEvent, list: any[], listName: string): void {
		if (event.oldIndex === undefined || event.newIndex === undefined) {
			return;
		}

		const item = list[event.oldIndex];
		this.logOperation(`Reordered "${item.title}" within ${listName} from ${event.oldIndex} to ${event.newIndex}`);

		moveItemInArray(list, event.oldIndex, event.newIndex);
	}

	/**
	 * Helper method to get the list array by the DOM element.
	 * This is used to identify which list an item came from.
	 *
	 * @param element - The DOM element of the source list
	 * @returns The source array or null if not found
	 */
	private getListByElement(element: HTMLElement): any[] | null {
		const listId = element.getAttribute('data-list-id');
		switch (listId) {
			case 'todo':
				return this.todoList;
			case 'in-progress':
				return this.inProgressList;
			case 'done':
				return this.doneList;
			default:
				return null;
		}
	}

	/**
	 * Logs an operation to the operations log.
	 *
	 * @param message - Message to log
	 */
	private logOperation(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		this.operationsLog.unshift(`[${timestamp}] ${message}`);

		// Keep only last 10 operations
		if (this.operationsLog.length > 10) {
			this.operationsLog = this.operationsLog.slice(0, 10);
		}
	}

	/**
	 * Clears the operations log.
	 */
	clearLog(): void {
		this.operationsLog = [];
	}

	static readonly templateCode = `<ul
	class="list-group"
	[hubSortable]="tasks"
	[autoUpdateArray]="false"
	(update)="onUpdate($event)"
>
	@for (task of tasks; track task.id) {
		<li class="list-group-item">{{ task.title }}</li>
	}
</ul>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { SortableDirective, SortableEvent, moveItemInArray } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective],
	templateUrl: './example.component.html'
})
export class ExampleComponent {
	tasks = [
		{ id: 1, title: 'Design UI mockups' },
		{ id: 2, title: 'Write unit tests' }
	];

	onUpdate(event: SortableEvent): void {
		if (event.oldIndex === undefined || event.newIndex === undefined) {
			return;
		}

		// You decide when and how the array changes (validation, API call, etc.)
		moveItemInArray(this.tasks, event.oldIndex, event.newIndex);
	}
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = ManualSortableComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = ManualSortableComponent.componentCode;
}
