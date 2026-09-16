/**
 * Domain models for the layout builder sortable example.
 *
 * These types describe the hierarchical structure manipulated by the layout
 * builder: slots (generic/tabs/tab containers), widgets and their serialized
 * JSON representation.
 */

/** Slot types allowed in the layout (root or nested inside tabs). */
export type SlotType = 'generic' | 'tabs' | 'tab';

/** Leaf type representing a widget (only inside generics). */
export type WidgetType = 'widget';

/** Union of all item kinds. */
export type ItemType = SlotType | WidgetType;

/** Common fields shared by all items. */
export interface BaseItem {
	/** Unique identifier of the item. */
	id: string;
	/** Discriminator describing the kind of item. */
	type: ItemType;
	/** Human-readable label shown in the UI. */
	label: string;
	/** Stable data key used for drag/drop tracking and serialization. */
	data: string;
}

/** Container node (generic, tabs, or tab) that may define width and children. */
export interface Slot extends BaseItem {
	/** Container discriminator (generic, tabs or tab). */
	type: SlotType;
	/** CSS width applied to the slot. */
	width: string;
	/** Nested items contained by this slot. */
	children: ExampleItem[];
	/** Only for type 'tabs': active tab index. */
	activeTabIndex?: number;
}

/** Widget leaf node; cannot define width or children. */
export interface Widget extends BaseItem {
	/** Leaf discriminator (always 'widget'). */
	type: WidgetType;
	/** Widgets never contain children. */
	children: [];
}

/** Runtime item used throughout the component. */
export type ExampleItem = Slot | Widget;

/** Minimal structure used for exporting the hierarchy as JSON. */
export type HierarchyNode = {
	/** Stable data key of the node. */
	data: string;
	/** Kind of the node. */
	type: ItemType;
	/** Serialized children of the node. */
	children: HierarchyNode[];
};
