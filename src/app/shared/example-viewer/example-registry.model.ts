import { Type } from '@angular/core';

/**
 * Describes a live example registered in the documentation example system.
 *
 * Each entry holds the metadata required to lazily load and display an
 * interactive example together with its source code.
 */
export interface LiveExample {
	/** Unique identifier of the example. */
	id: string;
	/** Human-readable title of the example. */
	title: string;
	/** Name of the demonstrated component. */
	componentName: string;
	/** Package path used to organize the example. */
	packagePath: string;
	/** Example file paths (relative). */
	files: string[];
	/** Source code of the example, keyed by file name. */
	sourceCode?: Record<string, string>;
	/** Lazy loader that resolves the example component type. */
	loader: () => Promise<Type<any>>;
}
