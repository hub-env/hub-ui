/**
 * Type definitions for the portal modal example component.
 *
 * Describes the data payload that drives the rendering and behavior of the
 * demo modal shown in the portal documentation examples.
 */

/**
 * Data payload consumed by the modal example component to configure its
 * presentation and the set of actions it exposes.
 */
export interface ModalData {
	/** Visual variant of the modal that also determines the available actions. */
	type: 'confirm' | 'custom' | 'fullscreen';
	/** Text rendered in the modal header. */
	title: string;
	/** HTML content rendered inside the modal body. */
	content: string;
}
