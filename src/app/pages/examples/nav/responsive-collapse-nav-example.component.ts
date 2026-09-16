import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { HubNavCollapseMode, HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates responsive collapse modes: offcanvas, dropdown, and fullscreen.
 */
@Component({
	selector: 'app-nav-responsive-collapse-example',
	standalone: true,
	imports: [HubNavComponent, TitleCasePipe],
	template: `
		<div class="collapse-modes-demo">
			@for (mode of collapseModes; track mode) {
				<section
					class="collapse-modes-demo__block"
					[class]="'collapse-modes-demo__block collapse-modes-demo__block--' + mode"
				>
					<h4 class="collapse-modes-demo__title">{{ mode | titlecase }} mode</h4>
					<p class="collapse-modes-demo__hint">Click the toggler to open the mobile panel.</p>
					<hub-nav
						[items]="items"
						[config]="{
							orientation: 'horizontal',
							dropdownTrigger: 'click',
							collapseMode: mode,
							collapseBreakpoint: 99999
						}"
					></hub-nav>
				</section>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.collapse-modes-demo {
			display: grid;
			gap: 1rem;
		}

		.collapse-modes-demo__block {
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			padding: 0.75rem;
			position: relative;
			isolation: isolate;
		}

		.collapse-modes-demo__block hub-nav {
			position: relative;
			--hub-nav-mobile-overlay-position: absolute;
			--hub-nav-mobile-zindex: 20;
			--hub-nav-mobile-bg: #ffffff;
			--hub-nav-mobile-backdrop-bg: rgba(0, 0, 0, 0.2);
		}

		.collapse-modes-demo__title {
			margin: 0 0 0.25rem;
			font-size: 0.95rem;
			font-weight: 600;
		}

		.collapse-modes-demo__hint {
			margin: 0 0 0.75rem;
			color: var(--hub-sys-text-muted, #6c757d);
			font-size: 0.875rem;
		}

		.collapse-modes-demo__block--fullscreen hub-nav {
			min-height: 14rem;
		}

		.collapse-modes-demo__block--offcanvas hub-nav {
			min-height: 14rem;
		}
	`
})
export class ResponsiveCollapseNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Responsive Collapse Modes';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Compare offcanvas, dropdown and fullscreen responsive behaviors using the same menu.';

	/**
	 * Collapse mode options rendered in the demo.
	 */
	readonly collapseModes: HubNavCollapseMode[] = ['offcanvas', 'dropdown', 'fullscreen'];

	/**
	 * Shared menu used across all collapse mode samples.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home', icon: 'fa-solid fa-house' },
		{
			id: 'solutions',
			label: 'Solutions',
			type: 'dropdown',
			children: [
				{ id: 'sales', label: 'Sales', type: 'link', route: '/solutions/sales' },
				{ id: 'support', label: 'Support', type: 'link', route: '/solutions/support' }
			]
		},
		{ id: 'pricing', label: 'Pricing', type: 'link', route: '/pricing' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{
    orientation: 'horizontal',
    collapseMode: 'offcanvas',
    collapseBreakpoint: 99999
  }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-responsive-collapse-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class ResponsiveCollapseNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'home', label: 'Home', type: 'link', route: '/home' }
  ];
}`;
}
