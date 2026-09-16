/**
 * Domain models for the removable panels example.
 *
 * These types describe the dynamic panels that can be added and removed at
 * runtime.
 */

/**
 * Represents a panel that can be created or removed dynamically.
 */
export interface DynamicPanel {
	/** Unique identifier used to track the panel. */
	id: number;
	/** Title displayed in the panel heading. */
	title: string;
}
