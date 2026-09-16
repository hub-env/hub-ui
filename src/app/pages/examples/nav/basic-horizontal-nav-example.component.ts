import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Basic horizontal navigation bar example.
 */
@Component({
	selector: 'app-nav-basic-horizontal-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<hub-nav
			[items]="items"
			[config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
		></hub-nav>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		:host {
			display: block;
		}
	`
})
export class BasicHorizontalNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Basic Horizontal Navigation';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Horizontal navigation with links, a dropdown group and disabled item support.';

	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
></hub-nav>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`<hub-nav [items]="items" [config]="{ orientation: 'horizontal' }" />\`
})
export class NavExampleComponent {
  items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home', icon: 'fa-solid fa-house' },
    {
      id: 'products',
      label: 'Products',
      type: 'dropdown',
      children: [
        { id: 'catalog', label: 'Catalog', type: 'link', route: '/products/catalog' },
        { id: 'pricing', label: 'Pricing', type: 'link', route: '/products/pricing' }
      ]
    },
    { id: 'docs', label: 'Documentation', type: 'link', route: '/docs' },
    { id: 'disabled', label: 'Disabled', type: 'link', route: '/disabled', disabled: true }
  ];
}`;

	readonly templateCode = BasicHorizontalNavExampleComponent.templateCode;
	readonly componentCode = BasicHorizontalNavExampleComponent.componentCode;

	items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home', icon: 'fa-solid fa-house' },
		{
			id: 'products',
			label: 'Products',
			type: 'dropdown',
			children: [
				{ id: 'catalog', label: 'Catalog', type: 'link', route: '/products/catalog' },
				{ id: 'pricing', label: 'Pricing', type: 'link', route: '/products/pricing' }
			]
		},
		{ id: 'docs', label: 'Documentation', type: 'link', route: '/docs' },
		{ id: 'disabled', label: 'Disabled', type: 'link', route: '/disabled', disabled: true }
	];
}
