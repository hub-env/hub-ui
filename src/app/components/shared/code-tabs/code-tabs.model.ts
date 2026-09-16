/**
 * Type definitions for the code tabs component.
 */

/** A single source file rendered as a tab in the code tabs component. */
export interface CodeFile {
	/** File name displayed as the tab label. */
	name: string;
	/** Optional syntax highlighting language identifier. */
	language?: string;
	/** Source code shown when the tab is active. */
	code: string;
}
