import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates panel drill-down navigation with right-side sidebar placement.
 */
@Component({
	selector: 'app-nav-sidebar-right-panel-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="right-panel-shell">
			<div class="right-panel-shell__content">
				<p class="text-muted">Main content area — the sidebar is placed on the right and panels extend to the left.</p>
			</div>
			<hub-nav
				style="height: 100%"
				[items]="items"
				[config]="{
					orientation: 'vertical',
					verticalExpandMode: 'panel',
					sidebarSide: 'right',
					panelMaxVisible: 2,
					panelWidth: '14rem',
					collapseBreakpoint: 0
				}"
			></hub-nav>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.right-panel-shell {
			display: flex;
			height: 360px;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			overflow: hidden;
		}
		.right-panel-shell__content {
			flex: 1;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
		}
	`
})
export class SidebarRightPanelNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Right Sidebar Panel Mode';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Uses panel drill-down with sidebar positioned on the right side of the container.';

	/**
	 * Navigation tree used by the right-side panel demo.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'workspaces',
			label: 'Workspaces',
			type: 'dropdown',
			children: [
				{ id: 'sales', label: 'Sales', type: 'link', route: '/workspaces/sales' },
				{
					id: 'engineering',
					label: 'Engineering',
					type: 'dropdown',
					children: [
						{ id: 'frontend', label: 'Frontend', type: 'link', route: '/workspaces/engineering/frontend' },
						{ id: 'backend', label: 'Backend', type: 'link', route: '/workspaces/engineering/backend' }
					]
				}
			]
		},
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<!-- Set height: 100% to fill the sidebar container; sidebarSide: 'right' places it on the right -->
<hub-nav
  style="height: 100%"
  [items]="items"
  [config]="{ orientation: 'vertical', verticalExpandMode: 'panel', sidebarSide: 'right' }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-sidebar-right-panel-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class SidebarRightPanelNavExampleComponent {
  readonly items: HubNavItem[] = [];
}`;
}
