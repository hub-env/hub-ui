import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Status line used by the operational monitor showcase.
 */
interface BadgeStatusLine {
	readonly service: string;
	readonly state: string;
	readonly color: HubBadgeColor;
}

/**
 * Counter badge rendered in the alert summary strip.
 */
interface BadgeCounter {
	readonly label: string;
	readonly color: HubBadgeColor;
	readonly icon?: string;
	readonly variant?: 'solid' | 'surface';
	readonly trailingIcon?: string;
}

/**
 * Demonstrates status-dot and counter badge patterns.
 */
@Component({
	selector: 'app-status-counters-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Status dots</span>
				@for (status of statuses; track status.service) {
					<div class="d-flex align-items-center justify-content-between gap-3">
						<span>{{ status.service }}</span>
						<hub-badge [color]="status.color" [dot]="true">{{ status.state }}</hub-badge>
					</div>
				}
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Counters</span>
				<div class="d-flex flex-wrap gap-2">
					@for (counter of counters; track counter.label) {
						<hub-badge [variant]="counter.variant ?? 'solid'" [color]="counter.color">
							@if (counter.icon) {
								<i [class]="counter.icon" aria-hidden="true"></i>
							}
							{{ counter.label }}
							@if (counter.trailingIcon) {
								<i [class]="counter.trailingIcon" aria-hidden="true"></i>
							}
						</hub-badge>
					}
				</div>
			</div>
		</div>
	`,
	styles: []
})
export class StatusCountersBadgesExampleComponent {
	/**
	 * Sample service statuses rendered in the monitor list.
	 */
	protected readonly statuses: readonly BadgeStatusLine[] = [
		{ service: 'API gateway', state: 'Online', color: 'success' },
		{ service: 'Review queue', state: 'Pending review', color: 'warning' },
		{ service: 'Billing exports', state: 'Blocked', color: 'danger' }
	];

	/**
	 * Counter specimens rendered in the summary strip.
	 */
	protected readonly counters: readonly BadgeCounter[] = [
		{ label: '12', color: 'primary' },
		{ label: '5 alerts', color: 'danger', icon: 'fa-solid fa-bell' },
		{ label: '42 deployments', color: 'info', variant: 'surface', trailingIcon: 'fa-solid fa-arrow-up-right-from-square' }
	];

	static readonly templateCode = `<div class="d-flex flex-column gap-3">
  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Status dots</span>
    @for (status of statuses; track status.service) {
      <div class="d-flex align-items-center justify-content-between gap-3">
        <span>{{ status.service }}</span>
        <hub-badge [color]="status.color" [dot]="true">{{ status.state }}</hub-badge>
      </div>
    }
  </div>

  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Counters</span>
    <div class="d-flex flex-wrap gap-2">
      @for (counter of counters; track counter.label) {
        <hub-badge [variant]="counter.variant ?? 'solid'" [color]="counter.color">
          @if (counter.icon) {
            <i [class]="counter.icon" aria-hidden="true"></i>
          }
          {{ counter.label }}
          @if (counter.trailingIcon) {
            <i [class]="counter.trailingIcon" aria-hidden="true"></i>
          }
        </hub-badge>
      }
    </div>
  </div>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent } from 'ng-hub-ui-badges';

interface BadgeStatusLine {
  service: string;
  state: string;
  color: HubBadgeColor;
}

interface BadgeCounter {
  label: string;
  color: HubBadgeColor;
  icon?: string;
  variant?: 'solid' | 'surface';
  trailingIcon?: string;
}

@Component({
  selector: 'app-status-counters-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './status-counters-badges-example.component.html'
})
export class StatusCountersBadgesExampleComponent {
  protected readonly statuses: BadgeStatusLine[] = [
    { service: 'API gateway', state: 'Online', color: 'success' },
    { service: 'Review queue', state: 'Pending review', color: 'warning' },
    { service: 'Billing exports', state: 'Blocked', color: 'danger' }
  ];

  protected readonly counters: BadgeCounter[] = [
    { label: '12', color: 'primary' },
    { label: '5 alerts', color: 'danger', icon: 'fa-solid fa-bell' },
    { label: '42 deployments', color: 'info', variant: 'surface', trailingIcon: 'fa-solid fa-arrow-up-right-from-square' }
  ];
}`;
}
