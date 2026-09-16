/**
 * Type definitions for the reactive form history example component.
 *
 * Describes the profile form value used to demonstrate automatic commits
 * driven by Reactive Forms value changes in the history documentation
 * examples.
 */

/**
 * Profile form value tracked by the reactive form history example.
 */
export interface ProfileFormValue {
	/** Person's name. */
	name: string;
	/** Person's email address. */
	email: string;
	/** Person's assigned role. */
	role: string;
}
