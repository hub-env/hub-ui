/**
 * Type definitions for the Hub UI documentation landing page.
 *
 * These describe the minimal third-party surfaces consumed by `HomeComponent`.
 * The component logic and data live in `home.component.ts`.
 */

/**
 * Minimal Lenis smooth-scroll surface used by the home page.
 *
 * Declared locally so the component can hold a Lenis instance without eagerly
 * importing the library's types; only the members actually used are modelled.
 */
export interface LenisInstance {
	/**
	 * Advances the smooth-scroll animation for the given timestamp.
	 *
	 * @param time High-resolution timestamp, in milliseconds.
	 */
	raf(time: number): void;
	/**
	 * Subscribes a handler to the Lenis `scroll` event.
	 *
	 * @param event The event name to listen to (`scroll`).
	 * @param handler Callback invoked on every scroll update.
	 */
	on(event: 'scroll', handler: () => void): void;
	/** Tears down the instance and releases its listeners. */
	destroy(): void;
}
