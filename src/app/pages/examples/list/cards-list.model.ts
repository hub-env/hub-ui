/**
 * Domain models for the cards list example.
 *
 * These types describe the contact entries rendered by the paginable list in
 * its card display mode.
 */

/**
 * Represents a single contact rendered as a card in the list.
 */
export interface ContactCardItem {
	/** Unique identifier of the contact. */
	id: number;
	/** Full display name of the contact. */
	name: string;
	/** Job title or role of the contact. */
	role: string;
	/** Contact email address. */
	email: string;
	/** Contact phone number. */
	phone: string;
	/** Current availability status of the contact. */
	status: 'Available' | 'Busy' | 'Offline';
}
