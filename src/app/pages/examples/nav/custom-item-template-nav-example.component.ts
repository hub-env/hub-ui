import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavItemTemplateDirective } from 'ng-hub-ui-nav';

/**
 * Demonstrates custom rendering for nav items using hubNavItemTemplate.
 */
@Component({
	selector: 'app-nav-custom-item-template-example',
	standalone: true,
	imports: [HubNavComponent, HubNavItemTemplateDirective],
	template: `
		<hub-nav
			[items]="items"
			[config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
		>
			<ng-template hubNavItemTemplate let-item let-active="active" let-expanded="expanded">
				<span class="custom-item" [class.custom-item--active]="active">
					<span class="custom-item__dot" [class.custom-item__dot--expanded]="expanded"></span>
					<span>{{ item.label }}</span>
					@if (item.badge) {
						<span class="custom-item__badge">{{ item.badge }}</span>
					}
				</span>
			</ng-template>
		</hub-nav>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.custom-item {
			display: inline-flex;
			align-items: center;
			gap: 0.45rem;
			font-weight: 500;
		}

		.custom-item--active {
			color: #0d6efd;
		}

		.custom-item__dot {
			inline-size: 0.5rem;
			block-size: 0.5rem;
			border-radius: 9999px;
			background: #6c757d;
		}

		.custom-item__dot--expanded {
			background: #0d6efd;
		}

		.custom-item__badge {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			color: var(--hub-sys-text-secondary, #495057);
			padding: 0.1rem 0.4rem;
			border-radius: 9999px;
			font-size: 0.72rem;
		}
	`
})
export class CustomItemTemplateNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Custom Item Template';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Overrides item rendering to implement a custom label, indicator and badge layout.';

	/**
	 * Menu used by the template customization sample.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'overview', label: 'Overview', type: 'link', route: '/overview' },
		{
			id: 'analytics',
			label: 'Analytics',
			type: 'dropdown',
			badge: 'New',
			children: [
				{ id: 'revenue', label: 'Revenue', type: 'link', route: '/analytics/revenue' },
				{ id: 'retention', label: 'Retention', type: 'link', route: '/analytics/retention' }
			]
		},
		{ id: 'alerts', label: 'Alerts', type: 'link', route: '/alerts', badge: '4' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
>
  <ng-template hubNavItemTemplate let-item let-active="active" let-expanded="expanded">
    <span class="custom-item" [class.custom-item--active]="active">
      <span class="custom-item__dot" [class.custom-item__dot--expanded]="expanded"></span>
      <span>{{ item.label }}</span>
      @if (item.badge) { <span class="custom-item__badge">{{ item.badge }}</span> }
    </span>
  </ng-template>
</hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavItemTemplateDirective } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-custom-item-template-example',
  standalone: true,
  imports: [HubNavComponent, HubNavItemTemplateDirective],
  template: \`...\`
})
export class CustomItemTemplateNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'overview', label: 'Overview', type: 'link', route: '/overview' }
  ];
}`;
}
