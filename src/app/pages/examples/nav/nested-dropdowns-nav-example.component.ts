import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Horizontal navigation with nested multi-level dropdowns.
 */
@Component({
	selector: 'app-nav-nested-dropdowns-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<hub-nav
			[items]="items"
			[config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
		/>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		:host {
			display: block;
		}
	`
})
export class NestedDropdownsNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Nested Multi-Level Dropdowns';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Horizontal dropdown navigation with nested levels and group separators.';

	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
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
      [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
    />
  \`
})
export class NavExampleComponent {
  items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home' },
    {
      id: 'services', label: 'Services', type: 'dropdown',
      children: [
        { id: 'web', label: 'Web Development', type: 'link', route: '/services/web' },
        {
          id: 'design', label: 'Design', type: 'dropdown',
          children: [
            { id: 'ui', label: 'UI Design', type: 'link', route: '/services/design/ui' },
            { id: 'ux', label: 'UX Research', type: 'link', route: '/services/design/ux' },
            {
              id: 'branding', label: 'Branding', type: 'dropdown',
              children: [
                { id: 'logo', label: 'Logo Design', type: 'link', route: '/services/branding/logo' },
                { id: 'identity', label: 'Visual Identity', type: 'link', route: '/services/branding/identity' }
              ]
            }
          ]
        },
        { id: 'sep', label: '', type: 'separator' },
        { id: 'consulting', label: 'Consulting', type: 'link', route: '/services/consulting' }
      ]
    },
    { id: 'contact', label: 'Contact', type: 'link', route: '/contact' }
  ];
}`;

	readonly templateCode = NestedDropdownsNavExampleComponent.templateCode;
	readonly componentCode = NestedDropdownsNavExampleComponent.componentCode;

	items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'services',
			label: 'Services',
			type: 'dropdown',
			children: [
				{ id: 'web', label: 'Web Development', type: 'link', route: '/services/web' },
				{
					id: 'design',
					label: 'Design',
					type: 'dropdown',
					children: [
						{ id: 'ui', label: 'UI Design', type: 'link', route: '/services/design/ui' },
						{ id: 'ux', label: 'UX Research', type: 'link', route: '/services/design/ux' },
						{
							id: 'branding',
							label: 'Branding',
							type: 'dropdown',
							children: [
								{ id: 'logo', label: 'Logo Design', type: 'link', route: '/services/branding/logo' },
								{
									id: 'identity',
									label: 'Visual Identity',
									type: 'link',
									route: '/services/branding/identity'
								}
							]
						}
					]
				},
				{ id: 'sep', label: '', type: 'separator' },
				{ id: 'consulting', label: 'Consulting', type: 'link', route: '/services/consulting' }
			]
		},
		{ id: 'contact', label: 'Contact', type: 'link', route: '/contact' }
	];
}
