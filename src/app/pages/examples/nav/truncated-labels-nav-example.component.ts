import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Truncated labels with overflow tooltip.
 *
 * In a narrow sidebar, long item labels are clipped with an ellipsis (the
 * standard nav behaviour). Hovering a clipped item reveals its full text via the
 * hub-ui tooltip — automatically and only when the label actually overflows
 * (powered by `ng-hub-ui-utils`' `[hubOverflowTooltip]`, wired inside the nav).
 */
@Component({
	selector: 'app-nav-truncated-labels-example',
	standalone: true,
	imports: [HubNavComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="width: fit-content;">
			<hub-nav
				style="--hub-nav-panel-width: 200px;"
				[items]="items"
				[config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
			/>
		</div>
		<p class="text-muted small mt-2">Narrow sidebar — hover a clipped item to read its full label.</p>
	`
})
export class TruncatedLabelsNavExampleComponent {
	static readonly templateCode = `<!-- Narrow the sidebar with the panel-width token; long labels then truncate -->
<div style="width: fit-content;">
  <hub-nav
    style="--hub-nav-panel-width: 200px;"
    [items]="items"
    [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
  />
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

// The overflow tooltip is automatic: a clipped nav label shows its full text on
// hover. It needs ng-hub-ui-utils >= 22.6.0 and the tooltip styles, once:
//   @use 'ng-hub-ui-utils/styles/tooltip';

@Component({
  selector: 'app-nav-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`
    <div style="width: fit-content;">
      <hub-nav
        style="--hub-nav-panel-width: 200px;"
        [items]="items"
        [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
      />
    </div>
  \`
})
export class NavExampleComponent {
  items: HubNavItem[] = [
    { id: 'overview', label: 'Workspace Overview Dashboard', type: 'link', route: '/overview', icon: 'fa-solid fa-gauge-high' },
    {
      id: 'admin', label: 'Administration & Organization Settings', type: 'dropdown', icon: 'fa-solid fa-shield-halved',
      children: [
        { id: 'iam', label: 'Identity and Access Management', type: 'link', route: '/admin/iam' },
        { id: 'billing', label: 'Billing, Invoices & Payment Methods', type: 'link', route: '/admin/billing' }
      ]
    },
    { id: 'reports', label: 'Quarterly Financial Reports Export', type: 'link', route: '/reports', icon: 'fa-solid fa-chart-line' }
  ];
}`;

	items: HubNavItem[] = [
		{
			id: 'overview',
			label: 'Workspace Overview Dashboard',
			type: 'link',
			route: '/overview',
			icon: 'fa-solid fa-gauge-high'
		},
		{
			id: 'admin',
			label: 'Administration & Organization Settings',
			type: 'dropdown',
			icon: 'fa-solid fa-shield-halved',
			children: [
				{ id: 'iam', label: 'Identity and Access Management', type: 'link', route: '/admin/iam' },
				{ id: 'billing', label: 'Billing, Invoices & Payment Methods', type: 'link', route: '/admin/billing' }
			]
		},
		{
			id: 'reports',
			label: 'Quarterly Financial Reports Export',
			type: 'link',
			route: '/reports',
			icon: 'fa-solid fa-chart-line'
		}
	];
}
