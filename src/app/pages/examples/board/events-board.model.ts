/**
 * Domain models for the board events example.
 *
 * These types describe the event-log entries rendered while interacting with
 * the board (card/column moves, clicks and scroll events).
 */

/**
 * Represents a single entry in the board event log.
 */
export interface LogEntry {
	/** Moment at which the event was captured. */
	timestamp: Date;
	/** Human-readable description of the event. */
	message: string;
	/** Visual category used to style the log entry. */
	type: 'info' | 'success' | 'warning';
}
