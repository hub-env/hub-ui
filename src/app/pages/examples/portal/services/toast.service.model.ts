/**
 * Type definitions for the portal toast service example.
 *
 * Describes the optional configuration accepted when opening toast portals
 * programmatically through the example toast service.
 */

/**
 * Optional configuration used when opening a toast portal through the
 * example toast service.
 */
export interface ToastConfig {
	/** Auto-dismiss delay in milliseconds; defaults to 5000 when omitted. */
	duration?: number;
	/** Screen corner where the toast is anchored. */
	position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
	/** Extra CSS class applied to the portal window element. */
	windowClass?: string;
}
