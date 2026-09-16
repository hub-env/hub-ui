import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Vertical navigation with panel drill-down expand mode.
 * Clicking a dropdown item opens its children in a stacked side panel.
 */
@Component({
	selector: 'app-nav-panel-drilldown-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="sidebar-shell">
			<hub-nav
				style="height: 100%"
				[items]="items"
				[config]="{
					orientation: 'vertical',
					verticalExpandMode: 'panel',
					panelMaxVisible: 2,
					sidebarSide: 'left',
					panelWidth: '14rem',
					collapseBreakpoint: 0
				}"
			/>
			<div class="sidebar-shell__content">
				<p class="text-muted">Main content area — the sidebar fills 100% of the container height.</p>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		:host {
			display: block;
		}
		.sidebar-shell {
			display: flex;
			height: 400px;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			overflow: hidden;
		}
		.sidebar-shell__content {
			flex: 1;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
		}
	`
})
export class PanelDrilldownNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Panel Drill-Down Navigation';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Vertical sidebar navigation where child levels open in stacked drill-down panels.';

	static readonly templateCode = `<!-- Set height: 100% on the host to fill the sidebar container -->
<hub-nav
  style="height: 100%"
  [items]="items"
  [config]="{
    orientation: 'vertical',
    verticalExpandMode: 'panel',
    panelMaxVisible: 2,
    sidebarSide: 'left',
    panelWidth: '14rem'
  }"
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
      [config]="{
        orientation: 'vertical',
        verticalExpandMode: 'panel',
        panelMaxVisible: 2,
        sidebarSide: 'left',
        panelWidth: '14rem'
      }"
    />
  \`
})
export class NavExampleComponent {
  items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home', icon: 'fa-solid fa-house' },
    {
      id: 'docs', label: 'Documentation', type: 'dropdown', icon: 'fa-solid fa-book',
      children: [
        { id: 'getting-started', label: 'Getting Started', type: 'link', route: '/docs/start' },
        {
          id: 'guides', label: 'Guides', type: 'dropdown',
          children: [
            { id: 'routing', label: 'Routing', type: 'link', route: '/docs/guides/routing' },
            { id: 'forms', label: 'Forms', type: 'link', route: '/docs/guides/forms' },
            { id: 'http', label: 'HTTP Client', type: 'link', route: '/docs/guides/http' }
          ]
        },
        { id: 'api', label: 'API Reference', type: 'link', route: '/docs/api' }
      ]
    },
    {
      id: 'components', label: 'Components', type: 'dropdown', icon: 'fa-solid fa-table-cells-large',
      children: [
        { id: 'buttons', label: 'Buttons', type: 'link', route: '/components/buttons' },
        { id: 'modals', label: 'Modals', type: 'link', route: '/components/modals' },
        { id: 'tables', label: 'Tables', type: 'link', route: '/components/tables' }
      ]
    },
    { id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
  ];
}`;

	readonly templateCode = PanelDrilldownNavExampleComponent.templateCode;
	readonly componentCode = PanelDrilldownNavExampleComponent.componentCode;

	items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home', icon: 'fa-solid fa-house' },
		{
			id: 'docs',
			label: 'Documentation',
			type: 'dropdown',
			icon: 'fa-solid fa-book',
			children: [
				{ id: 'getting-started', label: 'Getting Started', type: 'link', route: '/docs/start' },
				{
					id: 'guides',
					label: 'Guides',
					type: 'dropdown',
					children: [
						{ id: 'routing', label: 'Routing', type: 'link', route: '/docs/guides/routing' },
						{ id: 'forms', label: 'Forms', type: 'link', route: '/docs/guides/forms' },
						{ id: 'http', label: 'HTTP Client', type: 'link', route: '/docs/guides/http' }
					]
				},
				{ id: 'api', label: 'API Reference', type: 'link', route: '/docs/api' }
			]
		},
		{
			id: 'components',
			label: 'Components',
			type: 'dropdown',
			icon: 'fa-solid fa-table-cells-large',
			children: [
				{ id: 'buttons', label: 'Buttons', type: 'link', route: '/components/buttons' },
				{ id: 'modals', label: 'Modals', type: 'link', route: '/components/modals' },
				{ id: 'tables', label: 'Tables', type: 'link', route: '/components/tables' }
			]
		},
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
	];
}
