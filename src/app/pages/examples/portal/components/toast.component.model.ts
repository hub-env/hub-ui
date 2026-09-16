/**
 * Type definitions for the portal toast example component.
 *
 * Describes the data payload that drives the rendering, severity styling and
 * auto-dismiss behavior of the demo toast shown in the portal documentation
 * examples.
 */

/**
 * Data payload consumed by the toast example component to configure its
 * severity, textual content and lifetime.
 */
export interface ToastData {
	/** Severity level that determines the icon and accent color of the toast. */
	type: 'success' | 'warning' | 'error' | 'info';
	/** Text rendered as the toast title. */
	title: string;
	/** Text rendered as the toast message body. */
	message: string;
	/** Optional auto-dismiss delay in milliseconds; defaults to 5000 when omitted. */
	duration?: number;
}
