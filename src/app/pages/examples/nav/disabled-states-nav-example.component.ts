import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates disabled states on links and dropdown entries.
 */
@Component({
	selector: 'app-nav-disabled-states-example',
	standalone: true,
	imports: [HubNavComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-nav
			[items]="items"
			[config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
		></hub-nav>
	`
})
export class DisabledStatesNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Disabled States';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Shows disabled behavior across root links, dropdown parents and nested items.';

	/**
	 * Navigation items including disabled root and nested entries.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard' },
		{
			id: 'operations',
			label: 'Operations',
			type: 'dropdown',
			children: [
				{ id: 'orders', label: 'Orders', type: 'link', route: '/operations/orders' },
				{ id: 'billing', label: 'Billing (soon)', type: 'link', route: '/operations/billing', disabled: true },
				{ id: 'reports', label: 'Reports', type: 'link', route: '/operations/reports' }
			]
		},
		{ id: 'integrations', label: 'Integrations (beta)', type: 'link', route: '/integrations', disabled: true },
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-disabled-states-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class DisabledStatesNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'integrations', label: 'Integrations', type: 'link', route: '/integrations', disabled: true }
  ];
}`;
}
