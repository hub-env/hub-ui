import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates per-item expandMode overrides in a vertical navigation tree.
 */
@Component({
	selector: 'app-nav-mixed-expand-modes-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="mixed-modes-shell">
			<hub-nav
				[items]="items"
				[config]="{
					orientation: 'vertical',
					verticalExpandMode: 'accordion',
					dropdownRenderMode: 'overlay',
					panelMaxVisible: 2,
					panelWidth: '14rem',
					collapseBreakpoint: 0
				}"
			></hub-nav>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.mixed-modes-shell {
			width: 320px;
			min-height: 360px;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			padding: 0.5rem;
			overflow: visible;
		}
	`
})
export class MixedExpandModesNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Per-item expandMode Override';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Uses a global accordion mode but overrides specific branches to flyout and panel drill-down.';

	/**
	 * Navigation tree with mixed expansion modes.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'catalog',
			label: 'Catalog (accordion)',
			type: 'dropdown',
			children: [
				{ id: 'products', label: 'Products', type: 'link', route: '/catalog/products' },
				{ id: 'categories', label: 'Categories', type: 'link', route: '/catalog/categories' }
			]
		},
		{
			id: 'operations',
			label: 'Operations (flyout)',
			type: 'dropdown',
			expandMode: 'flyout',
			children: [
				{ id: 'orders', label: 'Orders', type: 'link', route: '/operations/orders' },
				{ id: 'returns', label: 'Returns', type: 'link', route: '/operations/returns' }
			]
		},
		{
			id: 'admin',
			label: 'Admin (panel)',
			type: 'dropdown',
			expandMode: 'panel',
			children: [
				{
					id: 'users',
					label: 'Users',
					type: 'dropdown',
					children: [
						{ id: 'create-user', label: 'Create User', type: 'link', route: '/admin/users/create' },
						{ id: 'roles', label: 'Roles', type: 'link', route: '/admin/users/roles' }
					]
				},
				{ id: 'audit', label: 'Audit', type: 'link', route: '/admin/audit' }
			]
		}
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{
    orientation: 'vertical',
    verticalExpandMode: 'accordion',
    dropdownRenderMode: 'overlay',
    panelMaxVisible: 2,
    panelWidth: '14rem',
    collapseBreakpoint: 0
  }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-mixed-expand-modes-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`
    <hub-nav
      [items]="items"
      [config]="{
        orientation: 'vertical',
        verticalExpandMode: 'accordion',
        dropdownRenderMode: 'overlay',
        panelMaxVisible: 2,
        panelWidth: '14rem',
        collapseBreakpoint: 0
      }"
    ></hub-nav>
  \`
})
export class MixedExpandModesNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home' },
    {
      id: 'catalog',
      label: 'Catalog (accordion)',
      type: 'dropdown',
      children: [
        { id: 'products', label: 'Products', type: 'link', route: '/catalog/products' },
        { id: 'categories', label: 'Categories', type: 'link', route: '/catalog/categories' }
      ]
    },
    {
      id: 'operations',
      label: 'Operations (flyout)',
      type: 'dropdown',
      expandMode: 'flyout',
      children: [
        { id: 'orders', label: 'Orders', type: 'link', route: '/operations/orders' },
        { id: 'returns', label: 'Returns', type: 'link', route: '/operations/returns' }
      ]
    },
    {
      id: 'admin',
      label: 'Admin (panel)',
      type: 'dropdown',
      expandMode: 'panel',
      children: [
        {
          id: 'users',
          label: 'Users',
          type: 'dropdown',
          children: [
            { id: 'create-user', label: 'Create User', type: 'link', route: '/admin/users/create' },
            { id: 'roles', label: 'Roles', type: 'link', route: '/admin/users/roles' }
          ]
        },
        { id: 'audit', label: 'Audit', type: 'link', route: '/admin/audit' }
      ]
    }
  ];
}`;
}
