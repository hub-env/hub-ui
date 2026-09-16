import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates vertical navigation using flyout expansion mode.
 */
@Component({
	selector: 'app-nav-vertical-flyout-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="nav-example-shell">
			<hub-nav
				[items]="items"
				[config]="{
					orientation: 'vertical',
					verticalExpandMode: 'flyout',
					dropdownTrigger: 'click',
					collapseBreakpoint: 0,
					dropdownRenderMode: 'overlay'
				}"
			></hub-nav>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.nav-example-shell {
			width: 300px;
			min-height: 320px;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			padding: 0.5rem;
			overflow: visible;
		}
	`
})
export class VerticalFlyoutNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Vertical Flyout Navigation';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Vertical sidebar with flyout submenus for nested navigation.';

	/**
	 * Navigation tree used for the flyout demo.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard', icon: 'fa-solid fa-gauge-high' },
		{
			id: 'catalog',
			label: 'Catalog',
			type: 'dropdown',
			icon: 'fa-solid fa-box',
			children: [
				{ id: 'products', label: 'Products', type: 'link', route: '/catalog/products' },
				{ id: 'categories', label: 'Categories', type: 'link', route: '/catalog/categories' },
				{
					id: 'inventory',
					label: 'Inventory',
					type: 'dropdown',
					children: [
						{ id: 'stock', label: 'Stock', type: 'link', route: '/catalog/inventory/stock' },
						{ id: 'movements', label: 'Movements', type: 'link', route: '/catalog/inventory/movements' }
					]
				}
			]
		},
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'vertical', verticalExpandMode: 'flyout', dropdownTrigger: 'click', collapseBreakpoint: 0, dropdownRenderMode: 'overlay' }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-vertical-flyout-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`
    <hub-nav
      [items]="items"
      [config]="{ orientation: 'vertical', verticalExpandMode: 'flyout', dropdownTrigger: 'click', collapseBreakpoint: 0, dropdownRenderMode: 'overlay' }"
    ></hub-nav>
  \`
})
export class VerticalFlyoutNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard' }
  ];
}`;
}
