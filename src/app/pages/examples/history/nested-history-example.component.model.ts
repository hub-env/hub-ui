/**
 * Type definitions for the nested history example component.
 *
 * Describes the nested invoice state used to demonstrate diff patches over
 * nested objects and array mutations in the history documentation examples.
 */

/**
 * Single line item belonging to a complex invoice.
 */
export interface InvoiceLine {
	/** Human-readable name of the invoiced item. */
	name: string;
	/** Number of units billed. */
	quantity: number;
	/** Price charged per unit. */
	unitPrice: number;
}

/**
 * Complex invoice state featuring a nested customer object and an array of
 * line items, used to showcase nested history tracking.
 */
export interface ComplexInvoice {
	/** Unique identifier of the invoice. */
	id: string;
	/** Nested customer information. */
	customer: {
		/** Customer display name. */
		name: string;
		/** Customer city. */
		city: string;
	};
	/** Collection of invoiced line items. */
	lines: InvoiceLine[];
}
