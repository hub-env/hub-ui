import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavDropdownTrigger, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates runtime switching of dropdown trigger behavior.
 */
@Component({
	selector: 'app-nav-dropdown-triggers-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="trigger-demo">
			<div class="trigger-demo__controls">
				@for (mode of triggerModes; track mode) {
					<button
						type="button"
						class="trigger-demo__button"
						[class.trigger-demo__button--active]="trigger() === mode"
						(click)="trigger.set(mode)"
					>
						{{ mode }}
					</button>
				}
			</div>

			<hub-nav [items]="items" [config]="{ orientation: 'horizontal', dropdownTrigger: trigger() }"></hub-nav>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.trigger-demo {
			display: grid;
			gap: 0.75rem;
		}

		.trigger-demo__controls {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.trigger-demo__button {
			border: 1px solid var(--hub-sys-border-color-default, #ced4da);
			background: var(--hub-sys-surface-page, #fff);
			padding: 0.35rem 0.65rem;
			border-radius: 0.375rem;
			cursor: pointer;
			text-transform: capitalize;
		}

		.trigger-demo__button--active {
			border-color: #0d6efd;
			color: #0d6efd;
			font-weight: 600;
		}
	`
})
export class DropdownTriggersNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Dropdown Triggers';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Switch between click, hover and both trigger strategies at runtime.';

	/**
	 * Current dropdown trigger mode.
	 */
	readonly trigger = signal<HubNavDropdownTrigger>('click');

	/**
	 * Trigger mode options rendered in the controls.
	 */
	readonly triggerModes: HubNavDropdownTrigger[] = ['click', 'hover', 'both'];

	/**
	 * Navigation tree with nested dropdown levels.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'solutions',
			label: 'Solutions',
			type: 'dropdown',
			children: [
				{ id: 'platform', label: 'Platform', type: 'link', route: '/solutions/platform' },
				{
					id: 'industry',
					label: 'Industry',
					type: 'dropdown',
					children: [
						{ id: 'retail', label: 'Retail', type: 'link', route: '/solutions/industry/retail' },
						{ id: 'finance', label: 'Finance', type: 'link', route: '/solutions/industry/finance' }
					]
				}
			]
		},
		{ id: 'pricing', label: 'Pricing', type: 'link', route: '/pricing' }
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  [config]="{ orientation: 'horizontal', dropdownTrigger: trigger() }"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubNavComponent, HubNavDropdownTrigger, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-dropdown-triggers-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class DropdownTriggersNavExampleComponent {
  readonly trigger = signal<HubNavDropdownTrigger>('click');
  readonly triggerModes: HubNavDropdownTrigger[] = ['click', 'hover', 'both'];
  readonly items: HubNavItem[] = [];
}`;
}
