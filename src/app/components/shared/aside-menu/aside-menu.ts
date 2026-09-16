import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { AsideData, MenuItem } from '../../../models/navigation.model';

/**
 * Aside menu component that displays secondary navigation menus
 * Handles drill-down navigation and item selection
 */
@Component({
	selector: 'app-aside-menu',
	standalone: true,
	imports: [],
	templateUrl: './aside-menu.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './aside-menu.scss'
})
export class AsideMenuComponent {
	/**
	 * The aside data containing menu items and configuration
	 */
	readonly aside = input.required<AsideData>();

	/**
	 * The currently active route to determine which item is active
	 */
	readonly activeRoute = input.required<string>();

	/**
	 * Event emitted when a menu item is clicked
	 */
	readonly itemClick = output<{
		item: MenuItem;
		aside: AsideData;
	}>();

	/**
	 * Event emitted when the aside close button is clicked
	 */
	readonly closeClick = output<string>();

	/**
	 * Event emitted when the back button is clicked (drill-down navigation)
	 */
	readonly backClick = output<string>();

	/**
	 * Determines if a menu item is currently active
	 * @param item - The menu item to check
	 * @returns True if the item is active
	 */
	isItemActive(item: MenuItem): boolean {
		return item.route === this.activeRoute();
	}

	/**
	 * Handles menu item click events
	 * @param item - The clicked menu item
	 */
	onItemClick(item: MenuItem): void {
		this.itemClick.emit({ item, aside: this.aside() });
	}

	/**
	 * Handles aside close button click
	 */
	onCloseClick(): void {
		this.closeClick.emit(this.aside().id);
	}

	/**
	 * Handles back button click for drill-down navigation
	 */
	onBackClick(): void {
		this.backClick.emit(this.aside().id);
	}
}
