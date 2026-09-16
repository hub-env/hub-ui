import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates grouped dropdown content using header and separator item types.
 */
@Component({
	selector: 'app-nav-headers-separators-example',
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
export class HeadersSeparatorsNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Headers & Separators';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Groups dropdown options with header and separator entries for better information hierarchy.';

	/**
	 * Menu configuration showcasing grouped dropdown sections.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'resources',
			label: 'Resources',
			type: 'dropdown',
			children: [
				{ id: 'docs-header', label: 'Documentation', type: 'header' },
				{ id: 'guides', label: 'Guides', type: 'link', route: '/resources/guides' },
				{ id: 'api', label: 'API Reference', type: 'link', route: '/resources/api' },
				{ id: 'sep-1', label: '', type: 'separator' },
				{ id: 'community-header', label: 'Community', type: 'header' },
				{ id: 'forum', label: 'Forum', type: 'link', route: '/resources/forum' },
				{ id: 'events', label: 'Events', type: 'link', route: '/resources/events' }
			]
		},
		{ id: 'contact', label: 'Contact', type: 'link', route: '/contact' }
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
  selector: 'app-nav-headers-separators-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class HeadersSeparatorsNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home' }
  ];
}`;
}
