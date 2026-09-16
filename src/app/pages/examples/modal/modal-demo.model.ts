/**
 * Domain models for the modal demo providers.
 *
 * These types describe the reusable content payloads displayed by the modal
 * examples.
 */

/**
 * Example modal content that can be reused across the different modal examples.
 */
export interface ModalExampleContent {
	/** Title displayed in the modal header. */
	title: string;
	/** Main body text of the modal. */
	body: string;
	/** Optional semantic variant used to style the modal. */
	type?: 'info' | 'warning' | 'error' | 'success';
}
