/**
 * Type definitions for the avatar demo mock data.
 *
 * These describe the shape of the sample users rendered across the avatar
 * documentation page. The actual mock datasets live in `avatar-mock.data.ts`.
 */

/**
 * A sample user used to demonstrate the avatar component and its resolution
 * sources (custom image, GitHub, Gravatar, social networks, initials).
 */
export interface MockUser {
	/** Unique numeric identifier for the user. */
	id: number;
	/** Full display name, also used to derive avatar initials. */
	name: string;
	/** Email address, used as the Gravatar lookup key. */
	email: string;
	/** Optional application username. */
	username?: string;
	/** Optional GitHub handle used to resolve a GitHub avatar. */
	githubUsername?: string;
	/** Optional Facebook id used to resolve a Facebook avatar. */
	facebookId?: string;
	/** Optional Twitter handle used to resolve a Twitter avatar. */
	twitterUsername?: string;
	/** Optional explicit image URL that overrides every other source. */
	customImageUrl?: string;
	/** Job title or role shown alongside the avatar. */
	role: string;
	/** Presence status used to render the status indicator. */
	status: 'online' | 'offline' | 'busy' | 'away';
}
