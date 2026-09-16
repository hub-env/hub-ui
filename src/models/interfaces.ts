import { Type } from '@angular/core';

/**
 * Represents a complete library within the ng-hub-ui ecosystem.
 * Contains all necessary information for documentation, examples, and API reference.
 */
export interface Library {
	/** The display name of the library */
	title: string;
	/** Brief description of the library's purpose and functionality */
	description: string;
	/** Detailed overview including introductory text and version history */
	overview: Overview;
	/** Array of features and functionalities provided by the library */
	functionalities: Feature[];
	/** API documentation including inputs, outputs, and template options */
	api: LibraryApi;
	/** Styling and customization options with examples */
	styling: Feature[];
	/** Optional SCSS mixin / one-call theming documentation (the "Mixins and styles" block) */
	mixins?: LibraryMixins;
	/** Optional deprecation notice shown as a banner on the library page */
	deprecated?: LibraryDeprecation;
}

/**
 * SCSS mixin documentation for a library's "Styles" tab.
 *
 * The `intro`, `use` and `catalog` fields are GENERATED from the library's
 * `_*-theme.scss` files into `src/app/generated/md-mixins.ts` (`npm run docs:mixins`)
 * and read as `MD_MIXINS[page]` — never hand-edit them. Only `demos` (live previews,
 * which cannot be generated) are authored per page and merged in, e.g.
 * `mixins: { ...MD_MIXINS['panels'], demos: [...] }`.
 */
export interface LibraryMixins {
	/** Intro paragraph. Accepts an i18n key or a literal string (English source of truth). */
	intro: string;
	/** The canonical `@use` import line, e.g. `@use 'ng-hub-ui-badges/styles' as badges;`. */
	use: string;
	/** Optional live demos, each rendered via `NgComponentOutlet` with its SCSS shown below. */
	demos?: LibraryMixinDemo[];
	/** The full mixin catalog, grouped for the reference table. */
	catalog: LibraryMixinGroup[];
}

/** A single live demo within the "Mixins and styles" section. */
export interface LibraryMixinDemo {
	/** Heading for the demo. Accepts an i18n key or a literal string. */
	title: string;
	/** Live preview component, rendered with `NgComponentOutlet`. */
	previewComponent: Type<unknown>;
	/** The SCSS snippet demonstrating the mixin, shown under the live demo. */
	code: string;
}

/** A named group of mixins in the catalog table. */
export interface LibraryMixinGroup {
	/** Group label. Accepts an i18n key or a literal string. */
	group: string;
	/** The mixins in this group. */
	mixins: LibraryMixinEntry[];
}

/** A single mixin row in the catalog table. */
export interface LibraryMixinEntry {
	/** Mixin name without namespace, e.g. `hub-badge-theme`. */
	name: string;
	/** Parameter signature, e.g. `$accent, $bg, $color, …`. */
	params: string;
	/** Description. Accepts an i18n key or a literal string. */
	description: string;
	/** Optional canonical `@example` snippet extracted from the mixin's SCSS doc header. */
	example?: string;
	/**
	 * Optional param→token cross-reference (which `--hub-*` custom properties each
	 * parameter writes), derived from the mixin body. Enables linking a parameter to
	 * its CSS-variable row.
	 */
	paramTokens?: LibraryMixinParamToken[];
}

/** Maps one mixin parameter to the CSS custom properties it sets. */
export interface LibraryMixinParamToken {
	/** Parameter name including the `$`, e.g. `$accent`. */
	param: string;
	/** The `--hub-*` custom properties this parameter writes (one param may drive several). */
	tokens: string[];
}

/**
 * Deprecation notice for a library that has been superseded by another one.
 */
export interface LibraryDeprecation {
	/** Human-readable explanation of why the library is deprecated. */
	message: string;
	/** Display name of the recommended replacement library. */
	replacementName?: string;
	/** In-app route of the recommended replacement library (e.g. "/panels"). */
	replacementRoute?: string;
}

/**
 * A highlight card shown in the overview section to spotlight key features.
 */
export interface OverviewHighlight {
	/** Font Awesome icon class (e.g. "fa-solid fa-rocket") */
	icon: string;
	/** Short feature title (3–6 words) */
	title: string;
	/** One or two sentence description optimised for readability and SEO */
	description: string;
}

/**
 * Overview section containing introductory content and version history.
 */
export interface Overview {
	/** Main descriptive text explaining the library's purpose and usage */
	text: string;
	/** Key feature highlights displayed as cards in the overview section */
	highlights?: OverviewHighlight[];
	/** Version history and changelog entries */
	changelog: ChangelogEntry[];
}

/**
 * Represents a single changelog entry for version tracking.
 */
export interface ChangelogEntry {
	/** Version number (e.g., "1.2.0") */
	version: string;
	/** Release date in ISO format */
	date: string;
	/** Array of changes made in this version */
	changes: ChangelogItem[];
}

/**
 * Individual change item within a changelog entry.
 */
export interface ChangelogItem {
	/** Type of change (added, changed, deprecated, removed, fixed, security) */
	type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
	/** Description of the change */
	description: string;
}

/**
 * API documentation structure for a library.
 */
export interface LibraryApi {
	/** Component input properties and their specifications */
	inputs: ApiProperty[];
	/** Component output events and their specifications */
	outputs: ApiProperty[];
	/** Available template slots and projection options */
	templates: TemplateOption[];
	/** CSS custom properties (variables) for styling customization */
	cssVariables: CssVariableGroup[];
	/** Public methods exposed by the library's services or handles (service-first libraries) */
	methods?: ApiMethod[];
}

/**
 * Represents a public method exposed by a library service or handle,
 * documented in the API tab alongside inputs and outputs.
 */
export interface ApiMethod {
	/** Method name, optionally qualified with its owner (e.g. "HubModal.open") */
	name: string;
	/** Full call signature, e.g. "open(content, options?): HubModalRef" */
	signature: string;
	/** Detailed description of what the method does. Accepts an i18n key or a literal string. */
	description: string;
	/** Optional return value documentation (type and/or meaning) */
	returns?: string;
}

/**
 * Represents an API property (input or output) with full documentation.
 */
export interface ApiProperty {
	/** Property name */
	name: string;
	/** TypeScript type definition */
	type: string;
	/** Whether the property is required */
	required: boolean;
	/** Default value if not required */
	defaultValue?: string;
	/** Detailed description of the property's purpose and behavior */
	description: string;
	/** Usage examples or additional notes */
	examples?: string[];
}

/**
 * Template option for content projection and slot usage.
 */
export interface TemplateOption {
	/** Slot or selector name */
	name: string;
	/** Description of what content should be projected */
	description: string;
	/** Example usage of the template option */
	example: string;
}

/**
 * Represents a feature or functionality provided by the library.
 */
export interface Feature {
	/** Feature display name */
	title: string;
	/** Detailed description of the feature's capabilities */
	description: string;
	/** Array of practical examples demonstrating the feature */
	examples: FeatureExample[];
}

/**
 * Represents a complete example demonstrating a specific feature.
 * Contains all code and documentation needed to implement the example.
 */
export interface FeatureExample {
	/** Example display title */
	title: string;
	/** Description explaining what the example demonstrates */
	description: string;
	/** Import statements required for the example */
	import: string;
	/** HTML template code for the example */
	template: string;
	/** TypeScript component code for the example */
	component: string;
	/** Optional additional code files (services, models, etc.) */
	additionalFiles?: AdditionalFile[];
	/** Optional styling specific to this example */
	styles?: string;
	/** Optional component type used to render a live preview */
	previewComponent?: Type<unknown>;
}

/**
 * Additional code file that may be needed for a complete example.
 */
export interface AdditionalFile {
	/** File name with extension */
	filename: string;
	/** Programming language for syntax highlighting */
	language: 'typescript' | 'javascript' | 'css' | 'scss' | 'html' | 'json';
	/** File content */
	content: string;
	/** Description of the file's purpose */
	description: string;
}

/**
 * Group of related CSS custom properties for styling customization.
 */
export interface CssVariableGroup {
	/** Group title (e.g., "Colors", "Spacing", "Typography") */
	title: string;
	/** Description of what this group of variables controls */
	description: string;
	/** CSS custom properties in this group */
	variables: CssVariable[];
}

/**
 * Individual CSS custom property with documentation.
 */
export interface CssVariable {
	/** CSS variable name (including -- prefix) */
	name: string;
	/** Default value of the variable */
	defaultValue: string;
	/** Description of what this variable controls */
	description: string;
	/** Type/format of the expected value (e.g., "color", "length", "transition") */
	type: 'color' | 'length' | 'transition' | 'border' | 'shadow' | 'url' | 'number' | 'string';
	/** Example values that can be used */
	examples?: string[];
}
