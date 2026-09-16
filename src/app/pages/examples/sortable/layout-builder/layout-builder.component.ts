import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Options, SortableDirective, SortableEvent } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';
import type { ExampleItem, HierarchyNode, ItemType, Slot } from './layout-builder.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';

export type {
	BaseItem,
	ExampleItem,
	HierarchyNode,
	ItemType,
	Slot,
	SlotType,
	Widget,
	WidgetType
} from './layout-builder.model';

/**
 * Layout builder demo:
 * - Root accepts generic slots and tabs containers.
 * - Tabs contain tab slots, which contain generics, which contain widgets.
 * - Supports drag/drop, tab activation on hover during drag, and JSON export.
 */
@Component({
	selector: 'app-layout-builder',
	standalone: true,
	imports: [ExampleContainerComponent, NgTemplateOutlet, SortableDirective, HubButtonComponent, HubPanelComponent],
	templateUrl: './layout-builder.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrls: ['./layout-builder.component.scss']
})
export class LayoutBuilderComponent implements OnInit, FeatureExample {
	title = 'Layout Builder';
	description =
		'Compose nested, multi-level drag-and-drop containers (generics, tabs and widgets) with grouped sortable options.';
	import = `import { Options, SortableDirective, SortableEvent } from 'ng-hub-ui-sortable';`;

	/** Demo data structure shown on load. */
	items: ExampleItem[] = [
		{
			id: 'generic-1',
			type: 'generic',
			label: 'Generic A',

			data: 'generic-a',
			width: '50%',
			children: [
				{
					id: 'widget-1',
					type: 'widget',
					label: 'Widget 1',

					data: 'widget-1',
					children: []
				},
				{
					id: 'widget-2',
					type: 'widget',
					label: 'Widget 2',

					data: 'widget-2',
					children: []
				}
			]
		},
		// Tabs container with multiple tab slots
		{
			id: 'tabs-1',
			type: 'tabs',
			label: 'Tabs Container',

			data: 'tabs-1',
			width: '50%',
			activeTabIndex: 0,
			children: [
				{
					id: 'tab-1',
					type: 'tab',
					label: 'Tab 1',

					data: 'tab-1',
					width: '100%',
					children: [
						{
							id: 'generic-2',
							type: 'generic',
							label: 'Generic B',

							data: 'generic-b',
							width: '100%',
							children: [
								{
									id: 'widget-3',
									type: 'widget',
									label: 'Widget 3',

									data: 'widget-3',
									children: []
								}
							]
						},
						{
							id: 'generic-3',
							type: 'generic',
							label: 'Generic C',

							data: 'generic-c',
							width: '100%',
							children: []
						}
					]
				},
				{
					id: 'tab-2',
					type: 'tab',
					label: 'Tab 2',

					data: 'tab-2',
					width: '100%',
					children: [
						{
							id: 'generic-4',
							type: 'generic',
							label: 'Generic D',

							data: 'generic-d',
							width: '100%',
							children: [
								{
									id: 'widget-4',
									type: 'widget',
									label: 'Widget 4',

									data: 'widget-4',
									children: []
								}
							]
						}
					]
				}
			]
		},
		// Another generic at root level
		{
			id: 'generic-5',
			type: 'generic',
			label: 'Generic E',

			data: 'generic-e',
			width: '100%',
			children: []
		}
	];

	/** JSON representation of the hierarchy, shown in the UI. */
	outputJson = '';

	/** DOM container currently highlighted as drop target. */
	currentDropTarget: HTMLElement | null = null;

	/** CSS class applied to the drop target while dragging. */
	readonly DROP_TARGET_CLASS = 'layout-builder__drag-over';

	/** Rolling log of drag events. */
	logs: string[] = [];

	/** Token for current drag cycle to dedupe logs. */
	currentDragToken: string | null = null;

	/** Logged signatures within the current drag cycle. */
	currentDragActions = new Set<string>();

	/** Counter for generating unique IDs. */
	idCounter = 100;

	/** Timeout used to activate a tab when hovering while dragging. */
	tabHoverTimeout: ReturnType<typeof setTimeout> | null = null;

	/** Delay (ms) before activating a tab on hover during drag. */
	readonly TAB_HOVER_DELAY = 800;

	/** Current tab header under the cursor during drag. */
	currentHoverTabHeader: HTMLElement | null = null;

	/** Bound function to remove global listeners. */
	boundMouseMoveHandler = this.onMouseMoveDuringDrag.bind(this);

	/** Sortable options for the root container (accepts generics and tabs). */
	rootOptions: Options = {
		group: {
			name: 'root',
			pull: true,
			put: ['root', 'generics']
		},
		handle: '.layout-builder__drag-handle',
		draggable: '.layout-builder__root-item',
		ghostClass: 'sortable-placeholder',
		dataIdAttr: 'data-data',
		animation: 320,
		fallbackOnBody: true
	};

	/** Sortable options for reordering tab headers inside a tabs container. */
	tabHeaderOptions: Options = {
		group: {
			name: 'tab-headers',
			pull: false,
			put: false
		},
		handle: '.layout-builder__tab-header',
		draggable: '.layout-builder__tab-header',
		ghostClass: 'sortable-placeholder',
		dataIdAttr: 'data-data',
		animation: 320
	};

	/** Sortable options for generics inside a tab. They can move between tab and root. */
	genericContainerOptions: Options = {
		group: {
			name: 'generics',
			pull: true,
			put: ['generics', 'root']
		},
		handle: '.layout-builder__drag-handle',
		draggable: '.layout-builder__generic',
		ghostClass: 'sortable-placeholder',
		dataIdAttr: 'data-data',
		animation: 320,
		fallbackOnBody: true
	};

	/** Sortable options for widgets inside a generic. Only move between generics. */
	widgetOptions: Options = {
		group: {
			name: 'widgets',
			pull: true,
			put: ['widgets']
		},
		handle: '.layout-builder__drag-handle',
		draggable: '.layout-builder__widget',
		ghostClass: 'sortable-placeholder',
		dataIdAttr: 'data-data',
		animation: 320,
		fallbackOnBody: true
	};

	/**
	 * Initializes the component by computing the initial serialized layout
	 * output.
	 */
	ngOnInit(): void {
		this.updateOutput();
	}

	/**
	 * TrackBy helper to avoid unnecessary re-renders during drag.
	 * @param _index Index provided by @for
	 * @param item Current item
	 * @returns Stable id
	 */
	trackById(_index: number, item: ExampleItem): string {
		return item.id;
	}

	/**
	 * Serialize items into a minimal hierarchy used for JSON output.
	 * @param items Items to serialize
	 * @returns Serialized hierarchy nodes
	 */
	serialize(items: ExampleItem[]): HierarchyNode[] {
		return items.map((item) => ({
			data: item.data,
			type: item.type,
			children: this.serialize(item.children)
		}));
	}

	/** Refresh the pretty-printed JSON for the view. */
	updateOutput(): void {
		this.outputJson = JSON.stringify(this.serialize(this.items), null, 2);
	}

	/** Called when any drag starts (slots or widgets). */
	onDragStart(event?: SortableEvent): void {
		this.currentDragActions.clear();
		const itemData = event?.item?.getAttribute('data-data') ?? 'item';
		this.currentDragToken = `${itemData}-${Date.now()}`;
		this.clearDropTarget();
		document.addEventListener('mousemove', this.boundMouseMoveHandler);
		document.addEventListener('dragover', this.boundMouseMoveHandler as EventListener);
	}

	/** Called when drag ends; cleans hover state and updates JSON. */
	onDragEnd(): void {
		this.currentDragToken = null;
		this.currentDragActions.clear();
		this.clearTabHoverTimeout();
		this.clearDropTarget();
		if (this.currentHoverTabHeader) {
			this.currentHoverTabHeader.classList.remove('layout-builder__tab-header--drag-hovering');
			this.currentHoverTabHeader = null;
		}
		document.removeEventListener('mousemove', this.boundMouseMoveHandler);
		document.removeEventListener('dragover', this.boundMouseMoveHandler as EventListener);
		this.updateOutput();
	}

	/** Called when the dragged element moves over a new container. */
	onDragChange(event: SortableEvent): void {
		const newTarget = event.to;

		if (newTarget !== this.currentDropTarget) {
			this.clearDropTarget();
			this.currentDropTarget = newTarget;
			this.currentDropTarget?.closest('.layout-builder__sortable')?.classList.add(this.DROP_TARGET_CLASS);
		}

		this.updateOutput();
	}

	/** Removes the highlight class from the current drop target container. */
	clearDropTarget(): void {
		this.currentDropTarget?.closest('.layout-builder__sortable')?.classList.remove(this.DROP_TARGET_CLASS);
		this.currentDropTarget = null;
	}

	// ============================================
	// TABS LOGIC
	// ============================================

	/** Sets the active tab index. */
	setActiveTab(tabsItem: Slot, index: number): void {
		tabsItem.activeTabIndex = index;
	}

	/** Create and append a new tab inside a tabs container. */
	addTab(tabsItem: Slot): void {
		const newTab: Slot = {
			id: `tab-${++this.idCounter}`,
			type: 'tab',
			label: `Tab ${tabsItem.children.length + 1}`,
			data: `tab-${this.idCounter}`,
			width: '100%',
			children: [this.createEmptyGeneric()]
		};
		tabsItem.children.push(newTab);
		tabsItem.activeTabIndex = tabsItem.children.length - 1;
		this.updateOutput();
	}

	/** Remove a tab (with confirmation; if last tab, it offers to remove the whole tabs container). */
	removeTab(tabsItem: Slot, tabIndex: number): void {
		const ok = confirm('Remove this tab?');
		if (!ok) {
			return;
		}

		if (tabsItem.children.length === 1) {
			if (confirm('This is the last tab. Remove the entire tabs container?')) {
				const tabsIndex = this.items.indexOf(tabsItem);
				if (tabsIndex !== -1) {
					this.items.splice(tabsIndex, 1);
				}
			}
		} else {
			tabsItem.children.splice(tabIndex, 1);
			if (tabsItem.activeTabIndex! >= tabsItem.children.length) {
				tabsItem.activeTabIndex = tabsItem.children.length - 1;
			}
		}
		this.updateOutput();
	}

	/** Create an empty generic slot. */
	createEmptyGeneric(): Slot {
		return {
			id: `generic-${++this.idCounter}`,
			type: 'generic',
			label: `Generic ${this.idCounter}`,
			data: `generic-${this.idCounter}`,
			width: '100%',
			children: []
		};
	}

	// ============================================
	// TAB HOVER DURING DRAG
	// ============================================

	/**
	 * Mousemove handler during drag to detect hover over inactive tab headers.
	 * @param event Mouse event
	 */
	onMouseMoveDuringDrag(event: MouseEvent): void {
		const elements = document.elementsFromPoint(event.clientX, event.clientY);

		const tabHeader = elements.find(
			(el) =>
				el.classList.contains('layout-builder__tab-header') &&
				!el.classList.contains('layout-builder__tab-header--active')
		) as HTMLElement | undefined;

		if (tabHeader) {
			if (tabHeader !== this.currentHoverTabHeader) {
				this.currentHoverTabHeader = tabHeader;
				tabHeader.classList.add('layout-builder__tab-header--drag-hovering');
				this.startTabActivationTimeout(tabHeader);
			}
		} else {
			if (this.currentHoverTabHeader) {
				this.currentHoverTabHeader.classList.remove('layout-builder__tab-header--drag-hovering');
				this.currentHoverTabHeader = null;
				this.clearTabHoverTimeout();
			}
		}
	}

	/**
	 * Start the delayed activation of a tab while hovering during drag.
	 * @param tabHeader Tab header element being hovered
	 */
	startTabActivationTimeout(tabHeader: HTMLElement): void {
		this.clearTabHoverTimeout();

		this.tabHoverTimeout = setTimeout(() => {
			const tabData = tabHeader.getAttribute('data-data');
			if (!tabData) return;

			for (const item of this.items) {
				if (item.type === 'tabs') {
					const tabIndex = item.children.findIndex((tab) => tab.data === tabData);
					if (tabIndex !== -1 && item.activeTabIndex !== tabIndex) {
						this.setActiveTab(item, tabIndex);
						// Clear the hover visual state
						tabHeader.classList.remove('layout-builder__tab-header--drag-hovering');
						this.currentHoverTabHeader = null;
						break;
					}
				}
			}
		}, this.TAB_HOVER_DELAY);
	}

	/** Clear the pending hover timeout for tab activation. */
	clearTabHoverTimeout(): void {
		if (this.tabHoverTimeout) {
			clearTimeout(this.tabHoverTimeout);
			this.tabHoverTimeout = null;
		}
	}

	/** Ensure each tab always has at least one generic slot. */
	ensureTabsHaveGenerics(): void {
		for (const item of this.items) {
			if (item.type === 'tabs') {
				for (const tab of item.children) {
					if (tab.type === 'tab' && tab.children.length === 0) {
						tab.children.push(this.createEmptyGeneric());
					}
				}
			}
		}
	}

	// ============================================
	// SLOT EVENTS (ROOT & TABS)
	// ============================================

	/**
	 * Slot added (in root or in tabs).
	 * @param event Sortable event data
	 */
	onSlotAdded(event: SortableEvent): void {
		this.addLogFromEvent(event, 'Slot added', ['generic', 'tabs', 'tab'], 'slot:add');
		this.updateOutput();
	}

	/**
	 * Slot reordered (in root or in tabs).
	 * @param event Sortable event data
	 */
	onSlotMoved(event: SortableEvent): void {
		this.addLogFromEvent(event, 'Slot moved', ['generic', 'tabs', 'tab'], 'slot:move');
		this.updateOutput();
	}

	/**
	 * Slot removed (in root or in tabs).
	 * @param event Sortable event data
	 */
	onSlotRemoved(event: SortableEvent): void {
		setTimeout(() => {
			this.ensureTabsHaveGenerics();
			this.addLogFromEvent(event, 'Slot removed', ['generic', 'tabs', 'tab'], 'slot:remove');
			this.updateOutput();
		}, 0);
	}

	// ============================================
	// TAB HEADER EVENTS
	// ============================================

	/**
	 * Tab headers reordered inside a tabs container.
	 * @param _event Sortable event data
	 */
	onTabHeadersReordered(_event: SortableEvent): void {
		this.updateOutput();
	}

	// ============================================
	// WIDGET EVENTS
	// ============================================

	/** Widget added into a generic. */
	onWidgetAdded(event: SortableEvent): void {
		if (event.from === event.to) {
			return;
		}
		this.addLogFromEvent(event, 'Widget added', ['widget'], 'widget:add');
		this.updateOutput();
	}

	/** Widgets reordered inside a generic. */
	onWidgetReordered(event: SortableEvent): void {
		this.addLogFromEvent(event, 'Widget reordered', ['widget'], 'widget:reorder');
		this.updateOutput();
	}

	/** Widget removed from a generic. */
	onWidgetRemoved(event: SortableEvent): void {
		if (event.from === event.to) {
			return;
		}
		this.addLogFromEvent(event, 'Widget removed', ['widget'], 'widget:remove');
		this.updateOutput();
	}

	/**
	 * Drag finished for a widget.
	 * @param _event Sortable event data
	 */
	onWidgetMoveEnd(_event: SortableEvent): void {
		this.onDragEnd();
		this.updateOutput();
	}

	// ============================================
	// GENERIC EVENTS (DRAG END)
	// ============================================

	/**
	 * Drag finished for a generic slot.
	 * @param _event Sortable event data
	 */
	onGenericMoveEnd(_event: SortableEvent): void {
		this.onDragEnd();
		this.updateOutput();
	}

	// ============================================
	// LOG HELPERS
	// ============================================

	/**
	 * Builds and records a log entry from a sortable event, filtering by item
	 * type and deduplicating within the current drag cycle.
	 *
	 * @param event Sortable event that triggered the log.
	 * @param action Human-readable action label.
	 * @param allowedTypes Item types for which the log should be emitted.
	 * @param signatureKey Optional key used to build the dedupe signature.
	 */
	private addLogFromEvent(event: SortableEvent, action: string, allowedTypes?: ItemType[], signatureKey?: string): void {
		const info = this.getItemInfo(event.item);
		if (allowedTypes && !allowedTypes.includes(info.type)) {
			return;
		}

		const origin = this.getContainerName(event.from as HTMLElement);
		const target = this.getContainerName(event.to as HTMLElement);
		const detail =
			event.from === event.to ? `${origin}, index ${event.oldIndex} -> ${event.newIndex}` : `${origin} → ${target}`;

		if (!this.shouldLog(`${signatureKey ?? action}:${info.type}:${origin}:${target}:${detail}`)) {
			return;
		}

		this.addLog(`${action}: ${info.type} ${info.label} (${detail})`);
	}

	/**
	 * Appends a timestamped message to the rolling log, ignoring immediate
	 * duplicates and capping the log size.
	 *
	 * @param message Message to append.
	 */
	private addLog(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		const entry = `[${timestamp}] ${message}`;
		if (this.logs[this.logs.length - 1] === entry) {
			return;
		}
		this.logs = [...this.logs, entry].slice(-50);
	}

	/**
	 * Determines whether a given signature should be logged within the current
	 * drag cycle, registering it to prevent future duplicates.
	 *
	 * @param signature Unique signature describing the log event.
	 * @returns `true` if the signature has not been logged yet in this cycle.
	 */
	private shouldLog(signature: string): boolean {
		if (!this.currentDragToken) {
			return true;
		}
		const key = `${this.currentDragToken}:${signature}`;
		if (this.currentDragActions.has(key)) {
			return false;
		}
		this.currentDragActions.add(key);
		return true;
	}

	/**
	 * Resolves the label and type of an item from its DOM element.
	 *
	 * @param element DOM element representing the dragged item.
	 * @returns The item's label and type, falling back to a generic default.
	 */
	private getItemInfo(element: HTMLElement): {
		label: string;
		type: ItemType;
	} {
		const data = element?.getAttribute('data-data');
		if (!data) {
			return { label: 'Item', type: 'generic' };
		}

		const item = this.findItemByData(data, this.items);
		return {
			label: item?.label ?? data,
			type: item?.type ?? 'generic'
		};
	}

	/**
	 * Recursively searches the hierarchy for an item matching the given data key.
	 *
	 * @param data Data key to match.
	 * @param items Items to search through.
	 * @returns The matching item, or `undefined` when not found.
	 */
	private findItemByData(data: string, items: ExampleItem[]): ExampleItem | undefined {
		for (const item of items) {
			if (item.data === data) {
				return item;
			}

			if ('children' in item && item.children?.length) {
				const found = this.findItemByData(data, item.children);
				if (found) {
					return found;
				}
			}
		}
		return undefined;
	}

	/**
	 * Derives a human-readable name for a drop container from its DOM element.
	 *
	 * @param container DOM element of the container.
	 * @returns A descriptive container name.
	 */
	private getContainerName(container?: HTMLElement): string {
		if (!container) return 'contenedor';

		const data = container.getAttribute('data-data') || container.closest('[data-data]')?.getAttribute('data-data');

		if (data) {
			const item = this.findItemByData(data, this.items);
			if (item) {
				return `${item.type} ${item.label}`;
			}
			return `contenedor ${data}`;
		}

		const id = container.getAttribute('id');
		return id ? `contenedor ${id}` : 'contenedor';
	}

	/** Adjust widths so percent-based slots account for container gap. */
	slotWidth(width: string): string {
		if (!width) {
			return '';
		}
		return width.includes('%') ? `calc(${width} - 0.5rem)` : width;
	}

	static readonly templateCode = `<!-- Root container accepts generics and tabs -->
<div
	class="layout-builder__sortable"
	[hubSortable]="items"
	[options]="rootOptions"
	(add)="onSlotAdded($event)"
	(update)="onSlotMoved($event)"
	(change)="onDragChange($event)"
>
	@for (item of items; track item.id) {
		<!-- Each slot renders its own nested [hubSortable] containers -->
	}
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { Options, SortableDirective, SortableEvent } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective],
	templateUrl: './example.component.html'
})
export class ExampleComponent {
	items: ExampleItem[] = [/* nested generics, tabs and widgets */];

	// Named groups define which containers can exchange items
	rootOptions: Options = {
		group: { name: 'root', pull: true, put: ['root', 'generics'] },
		handle: '.layout-builder__drag-handle',
		animation: 320
	};

	onSlotMoved(event: SortableEvent): void {
		// React to reordering: update serialized output, log, persist, etc.
	}
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = LayoutBuilderComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = LayoutBuilderComponent.componentCode;
}
