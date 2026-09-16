/**
 * Type definitions for the application shell side navigation.
 */

/**
 * Route tabs available in each library documentation page.
 */
export type LibrarySectionTab = 'overview' | 'api' | 'styles' | 'examples' | 'playground';

/**
 * Declarative descriptor for second-level library section entries.
 */
export interface LibrarySectionDefinition {
	/** Stable section item identifier suffix. */
	readonly id: string;
	/** Label rendered in the side navigation panel. */
	readonly label: string;
	/** Route tab segment used by the documentation page route. */
	readonly tab: LibrarySectionTab;
}
