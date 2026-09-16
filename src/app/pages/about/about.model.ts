/**
 * Content type definitions for the "About the author" page.
 *
 * These describe the bilingual content structure consumed by `AboutComponent`.
 * The actual content data lives in `about.component.ts`.
 */

/**
 * A single entry in the career timeline.
 */
export interface TimelineItem {
	/** Year or year range the entry refers to (e.g. `2012`, `2015 – 2022`). */
	readonly year: string;
	/** Short narrative describing what happened during that period. */
	readonly text: string;
}

/**
 * A labelled group of technologies shown in the tech-stack section.
 */
export interface StackCategory {
	/** Category heading (e.g. `Specialization`, `Architecture`). */
	readonly label: string;
	/** Technologies that belong to this category. */
	readonly items: readonly string[];
}

/**
 * A single contact channel rendered in the contact section.
 */
export interface ContactLink {
	/** Visible label for the link (e.g. `Email`, `GitHub`). */
	readonly label: string;
	/** Destination URL (may be a `mailto:` or `https:` URL). */
	readonly url: string;
	/** Font Awesome icon class rendered next to the label. */
	readonly icon: string;
}

/**
 * Full content model for a single language of the About page.
 */
export interface AboutContent {
	/** Hero section: badge, name, tagline and scroll call-to-action. */
	readonly hero: {
		/** Short role/skills badge shown above the name. */
		readonly badge: string;
		/** Author's display name. */
		readonly name: string;
		/** One-line summary of what the author does. */
		readonly tagline: string;
		/** Label for the scroll-down call-to-action. */
		readonly scrollCta: string;
	};
	/** Story section: heading, narrative paragraphs and image caption. */
	readonly story: {
		/** Section heading. */
		readonly heading: string;
		/** Narrative paragraphs of the author's background. */
		readonly paragraphs: readonly string[];
		/** Caption for the accompanying image. */
		readonly imgCaption: string;
	};
	/** Mission section explaining why Hub-UI exists. */
	readonly mission: {
		/** Section heading. */
		readonly heading: string;
		/** Narrative paragraphs about the project's purpose. */
		readonly paragraphs: readonly string[];
		/** Caption for the accompanying image. */
		readonly imgCaption: string;
		/** Label for the "View on GitHub" call-to-action. */
		readonly githubCta: string;
	};
	/** Timeline section: heading, accessible label and entries. */
	readonly timeline: {
		/** Section heading. */
		readonly heading: string;
		/** Accessible label describing the timeline list. */
		readonly ariaLabel: string;
		/** Ordered timeline entries. */
		readonly items: readonly TimelineItem[];
	};
	/** Tech-stack section: heading and grouped technologies. */
	readonly stack: {
		/** Section heading. */
		readonly heading: string;
		/** Technology categories shown in the stack grid. */
		readonly categories: readonly StackCategory[];
	};
	/** Contact section: heading, intro paragraph and contact links. */
	readonly contact: {
		/** Section heading. */
		readonly heading: string;
		/** Intro paragraph inviting the reader to get in touch. */
		readonly paragraph: string;
		/** Available contact channels. */
		readonly links: readonly ContactLink[];
	};
}
