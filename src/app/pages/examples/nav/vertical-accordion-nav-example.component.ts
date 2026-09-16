import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Vertical navigation with accordion expand mode.
 */
@Component({
	selector: 'app-nav-vertical-accordion-example',
	standalone: true,
	imports: [HubNavComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="width: 280px;">
			<hub-nav [items]="items" [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }" />
		</div>
	`
})
export class VerticalAccordionNavExampleComponent {
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
/>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`
    <hub-nav
      [items]="items"
      [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
    />
  \`
})
export class NavExampleComponent {
  items: HubNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard', icon: 'fa-solid fa-gauge-high' },
    {
      id: 'products', label: 'Products', type: 'dropdown', icon: 'fa-solid fa-box',
      children: [
        { id: 'list', label: 'Product List', type: 'link', route: '/products/list' },
        { id: 'add', label: 'Add Product', type: 'link', route: '/products/add' },
        { id: 'categories', label: 'Categories', type: 'link', route: '/products/categories' }
      ]
    },
    { id: 'sep1', label: '', type: 'separator' },
    { id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
  ];
}`;

	items: HubNavItem[] = [
		{ id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard', icon: 'fa-solid fa-gauge-high' },
		{
			id: 'products',
			label: 'Products',
			type: 'dropdown',
			icon: 'fa-solid fa-box',
			children: [
				{ id: 'list', label: 'Product List', type: 'link', route: '/products/list' },
				{ id: 'add', label: 'Add Product', type: 'link', route: '/products/add' },
				{ id: 'categories', label: 'Categories', type: 'link', route: '/products/categories' }
			]
		},
		{ id: 'sep1', label: '', type: 'separator' },
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
	];
}
