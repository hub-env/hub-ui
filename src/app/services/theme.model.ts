/**
 * Domain models for the theme service.
 *
 * Describes the theme descriptors consumed by {@link ThemeService} and the
 * global theme switcher UI.
 */

/**
 * Theme descriptor used by the global selector.
 */
export interface HubThemeOption {
	/**
	 * Internal theme identifier used in `data-theme`.
	 */
	id: string;
	/**
	 * Human-readable name displayed in the UI.
	 */
	label: string;
}
