/**
 * Type definitions for the basic history example component.
 *
 * Describes the minimal document state used to demonstrate the manual commit
 * flow with undo and redo in the history documentation examples.
 */

/**
 * Minimal document state tracked by the basic history example.
 */
export interface BasicDocumentState {
	/** Document title edited by the user. */
	title: string;
	/** Document description edited by the user. */
	description: string;
}
