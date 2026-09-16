import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubTabNavComponent, HubTabNavItem } from 'ng-hub-ui-panels';

/**
 * Content-less tab strip example — `<hub-tab-nav>` is a controlled, value-bound
 * strip that owns no content. It renders an accessible `role="tablist"` from a
 * plain `items` array and emits the selected value through the two-way `active`
 * model; the consumer renders the matching view itself. Here the selected value
 * switches an externally-rendered panel, which is the whole point of the
 * primitive versus `<hub-panels type="tabs">` (segmented control / filter
 * switch / manual tabs-with-external-content).
 */
@Component({
	selector: 'app-tab-nav-panels-example',
	standalone: true,
	imports: [HubTabNavComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3">
			<hub-tab-nav [items]="tabs" [(active)]="active" appearance="pills" justified />

			<div class="border rounded p-4">
				@switch (active()) {
					@case ('overview') {
						<h5 class="mb-1">Overview</h5>
						<p class="mb-0 text-secondary">
							The tab strip owns no content — this view is rendered by the host from <code>active()</code>.
						</p>
					}
					@case ('activity') {
						<h5 class="mb-1">Activity</h5>
						<p class="mb-0 text-secondary">Selecting a tab only emits its value; you decide what to show for it.</p>
					}
					@case ('settings') {
						<h5 class="mb-1">Settings</h5>
						<p class="mb-0 text-secondary">
							Perfect for segmented controls, filter switches or manual tabs-with-external-content.
						</p>
					}
				}
			</div>

			<p class="mb-0 small text-secondary">
				Selected value: <code>{{ active() }}</code>
			</p>
		</div>
	`
})
export class TabNavPanelsExampleComponent {
	/** The tabs rendered by the strip; each `value` is what the strip emits. */
	protected readonly tabs: HubTabNavItem[] = [
		{ value: 'overview', label: 'Overview' },
		{ value: 'activity', label: 'Activity' },
		{ value: 'settings', label: 'Settings' }
	];

	/** Two-way selected value, driving the externally-rendered view below. */
	protected readonly active = signal<unknown>('overview');

	static readonly templateCode = `<!-- Content-less, value-bound strip; the host renders the view -->
<hub-tab-nav [items]="tabs" [(active)]="active" appearance="pills" justified />

<div class="border rounded p-4">
  @switch (active()) {
    @case ('overview') { <h5>Overview</h5> <p>Rendered by the host from active().</p> }
    @case ('activity') { <h5>Activity</h5> <p>Selecting a tab only emits its value.</p> }
    @case ('settings') { <h5>Settings</h5> <p>Segmented control / filter switch.</p> }
  }
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTabNavComponent, HubTabNavItem } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-tab-nav-panels-example',
  standalone: true,
  imports: [HubTabNavComponent],
  templateUrl: './tab-nav-panels-example.component.html'
})
export class TabNavPanelsExampleComponent {
  protected readonly tabs: HubTabNavItem[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'activity', label: 'Activity' },
    { value: 'settings', label: 'Settings' }
  ];

  protected readonly active = signal<unknown>('overview');
}`;
}
