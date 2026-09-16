/**
 * Type definitions for the portal modal service example.
 *
 * Describes the optional configuration accepted when opening modal portals
 * programmatically through the example modal service.
 */

/**
 * Optional configuration used when opening a modal portal through the
 * example modal service.
 */
export interface ModalConfig {
	/** Extra CSS class applied to the portal window element. */
	windowClass?: string;
	/** Whether the modal body should be scrollable when content overflows. */
	scrollable?: boolean;
	/** Whether keyboard interaction (e.g. the ESC key) is enabled. */
	keyboard?: boolean;
	/** Target container where the portal is appended (selector or element). */
	container?: string | HTMLElement;
}
