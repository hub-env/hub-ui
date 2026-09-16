import { JsonPipe } from '@angular/common';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavPanelEvent } from 'ng-hub-ui-nav';

/**
 * Demonstrates all primary output events emitted by hub-nav.
 */
@Component({
	selector: 'app-nav-events-api-example',
	standalone: true,
	imports: [HubNavComponent, JsonPipe],
	template: `
		<div class="events-demo">
			<hub-nav
				[items]="items"
				[config]="{ orientation: 'vertical', verticalExpandMode: 'panel', panelMaxVisible: 2, collapseBreakpoint: 0 }"
				(itemClick)="onItemClick($event)"
				(dropdownOpen)="onDropdownOpen($event)"
				(dropdownClose)="onDropdownClose($event)"
				(mobileToggle)="onMobileToggle($event)"
				(panelChange)="onPanelChange($event)"
			></hub-nav>

			<div class="events-demo__log">
				<p><strong>Last event:</strong></p>
				<pre>{{ lastEvent() | json }}</pre>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.events-demo {
			display: grid;
			/* Allow the nav column to grow when panel drill-down adds side panels. */
			grid-template-columns: max-content minmax(0, 1fr);
			gap: 1rem;
			align-items: start;
		}

		.events-demo__log {
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			padding: 0.75rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
		}

		.events-demo__log pre {
			margin: 0;
			font-size: 0.8rem;
			white-space: pre-wrap;
		}

		@media (max-width: 900px) {
			.events-demo {
				grid-template-columns: 1fr;
			}
		}
	`
})
export class EventsApiNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Events API';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'Captures item, dropdown, mobile and panel output events to inspect emitted payloads.';

	/**
	 * Live log of the last emitted event payload.
	 */
	readonly lastEvent = signal<Record<string, unknown>>({
		name: 'none',
		payload: null
	});

	/**
	 * Menu used by the events sample.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'home', label: 'Home', type: 'link', route: '/home' },
		{
			id: 'workspace',
			label: 'Workspace',
			type: 'dropdown',
			children: [
				{ id: 'boards', label: 'Boards', type: 'link', route: '/workspace/boards' },
				{
					id: 'reports',
					label: 'Reports',
					type: 'dropdown',
					children: [
						{ id: 'daily', label: 'Daily', type: 'link', route: '/workspace/reports/daily' },
						{ id: 'weekly', label: 'Weekly', type: 'link', route: '/workspace/reports/weekly' }
					]
				}
			]
		}
	];

	/**
	 * Handles the itemClick output.
	 */
	onItemClick(item: HubNavItem): void {
		this.lastEvent.set({ name: 'itemClick', payload: item });
	}

	/**
	 * Handles the dropdownOpen output.
	 */
	onDropdownOpen(item: HubNavItem): void {
		this.lastEvent.set({ name: 'dropdownOpen', payload: item });
	}

	/**
	 * Handles the dropdownClose output.
	 */
	onDropdownClose(item: HubNavItem): void {
		this.lastEvent.set({ name: 'dropdownClose', payload: item });
	}

	/**
	 * Handles the mobileToggle output.
	 */
	onMobileToggle(open: boolean): void {
		this.lastEvent.set({ name: 'mobileToggle', payload: { open } });
	}

	/**
	 * Handles the panelChange output.
	 */
	onPanelChange(event: HubNavPanelEvent): void {
		this.lastEvent.set({ name: 'panelChange', payload: event });
	}

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav
  [items]="items"
  (itemClick)="onItemClick($event)"
  (dropdownOpen)="onDropdownOpen($event)"
  (dropdownClose)="onDropdownClose($event)"
  (mobileToggle)="onMobileToggle($event)"
  (panelChange)="onPanelChange($event)"
></hub-nav>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavPanelEvent } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-events-api-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class EventsApiNavExampleComponent {
  readonly lastEvent = signal<Record<string, unknown>>({ name: 'none', payload: null });
  onPanelChange(event: HubNavPanelEvent): void {
    this.lastEvent.set({ name: 'panelChange', payload: event });
  }
}`;
}
