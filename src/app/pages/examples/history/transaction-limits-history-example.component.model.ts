/**
 * Type definitions for the transaction limits history example component.
 *
 * Describes the editor state used to demonstrate transactions and retention
 * limits in a linear history timeline in the history documentation examples.
 */

/**
 * Editor state tracked by the transaction limits history example.
 */
export interface EditorState {
	/** Unique identifier of the edited document. */
	id: string;
	/** Document title. */
	title: string;
	/** Document body content. */
	content: string;
	/** Free-form tags associated with the document. */
	tags: string[];
}
