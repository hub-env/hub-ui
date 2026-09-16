import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavEndDirective, HubNavItem, HubNavStartDirective } from 'ng-hub-ui-nav';

/**
 * Demonstrates start/end slot projection through hubNavStart and hubNavEnd directives.
 */
@Component({
	selector: 'app-nav-brand-slot-example',
	standalone: true,
	imports: [HubNavComponent, HubNavStartDirective, HubNavEndDirective],
	template: `
		<hub-nav [items]="items" [config]="{ orientation: 'horizontal', collapseBreakpoint: 1200 }">
			<ng-template hubNavStart let-collapsed="collapsed">
				<div class="slot-start">
					<span class="slot-start__logo">H</span>
					@if (!collapsed) {
						<span class="slot-start__text">Hub Commerce</span>
					}
				</div>
			</ng-template>
			<ng-template hubNavEnd>
				<button type="button" class="slot-end__action">Sign out</button>
			</ng-template>
		</hub-nav>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.slot-start {
			display: inline-flex;
			align-items: center;
			gap: 0.5rem;
		}

		.slot-start__logo {
			inline-size: 1.75rem;
			block-size: 1.75rem;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			border-radius: 9999px;
			background: #0d6efd;
			color: #fff;
			font-weight: 700;
		}

		.slot-start__text {
			font-weight: 700;
		}

		.slot-end__action {
			border: 1px solid var(--hub-sys-border-color-default, #ced4da);
			background: var(--hub-sys-surface-page, #fff);
			color: var(--hub-sys-text-primary, #212529);
			border-radius: 0.4rem;
			padding: 0.35rem 0.65rem;
			font-weight: 600;
		}
	`
})
export class BrandSlotNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Start & End Slots';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description =
		'Projects custom content in start and end slots. In RTL horizontal mode, visual order reverses automatically.';

	/**
	 * Menu used for the brand slot sample.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'overview', label: 'Overview', type: 'link', route: '/overview' },
		{ id: 'orders', label: 'Orders', type: 'link', route: '/orders' },
		{ id: 'customers', label: 'Customers', type: 'link', route: '/customers' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav [items]="items">
  <ng-template hubNavStart let-collapsed="collapsed">
    <div class="slot-start">
      <span class="slot-start__logo">H</span>
      @if (!collapsed) {
        <span class="slot-start__text">Hub Commerce</span>
      }
    </div>
  </ng-template>
  <ng-template hubNavEnd>
    <button type="button" class="slot-end__action">Sign out</button>
  </ng-template>
</hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavStartDirective, HubNavEndDirective, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-brand-slot-example',
  standalone: true,
  imports: [HubNavComponent, HubNavStartDirective, HubNavEndDirective],
  template: \`...\`
})
export class BrandSlotNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'overview', label: 'Overview', type: 'link', route: '/overview' }
  ];
}`;
}
