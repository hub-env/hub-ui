import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavEndDirective, HubNavItem, HubNavStartDirective } from 'ng-hub-ui-nav';

/**
 * Demonstrates RTL behavior with start/end slots.
 * In horizontal layout, start appears on the right and end on the left.
 */
@Component({
	selector: 'app-nav-rtl-example',
	standalone: true,
	imports: [HubNavComponent, HubNavStartDirective, HubNavEndDirective],
	template: `
		<div dir="rtl" class="rtl-nav-demo">
			<hub-nav
				[items]="items"
				[config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }"
			>
				<ng-template hubNavStart>
					<span class="rtl-nav-demo__slot rtl-nav-demo__slot--start">Start</span>
				</ng-template>
				<ng-template hubNavEnd>
					<span class="rtl-nav-demo__slot rtl-nav-demo__slot--end">End</span>
				</ng-template>
			</hub-nav>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.rtl-nav-demo {
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			padding: 0.5rem;
		}

		.rtl-nav-demo__slot {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0.3rem 0.55rem;
			border-radius: 0.35rem;
			font-weight: 700;
		}

		.rtl-nav-demo__slot--start {
			background: #e7f1ff;
			color: #0b5ed7;
		}

		.rtl-nav-demo__slot--end {
			background: #e8f5e9;
			color: #1b5e20;
		}
	`
})
export class RtlNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'RTL with Start/End Slots';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Horizontal RTL navigation where start and end slots automatically flip their visual sides.';

	/**
	 * Menu used for the RTL slot sample.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'catalog',
			label: 'Catalog',
			type: 'dropdown',
			children: [
				{ id: 'products', label: 'Products', type: 'link', route: '/catalog/products' },
				{ id: 'pricing', label: 'Pricing', type: 'link', route: '/catalog/pricing' }
			]
		},
		{ id: 'about', label: 'About', type: 'link', route: '/about' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<div dir="rtl">
  <hub-nav [items]="items" [config]="{ orientation: 'horizontal', dropdownTrigger: 'click', dropdownRenderMode: 'overlay' }">
    <ng-template hubNavStart>
      <span>Start</span>
    </ng-template>
    <ng-template hubNavEnd>
      <span>End</span>
    </ng-template>
  </hub-nav>
</div>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavStartDirective, HubNavEndDirective, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-rtl-example',
  standalone: true,
  imports: [HubNavComponent, HubNavStartDirective, HubNavEndDirective],
  template: \`...\`
})
export class RtlNavExampleComponent {
  readonly items: HubNavItem[] = [];
}`;
}
