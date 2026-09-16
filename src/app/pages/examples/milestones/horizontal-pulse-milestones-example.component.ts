import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — horizontal progress steps with `[pulse]="true"`, so the
 * `active` node emits a soft wave to highlight the current step. The wave colour
 * follows the node accent and is disabled under `prefers-reduced-motion`.
 */
@Component({
	selector: 'app-milestones-horizontal-pulse-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones orientation="horizontal" [pulse]="true">
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Ordered</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Payment received.
				</p>
			</hub-milestone>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Packed</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">Ready to ship.</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 0.95rem;">In transit</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Out for delivery now.
				</p>
			</hub-milestone>
			<hub-milestone state="pending">
				<h4 style="margin: 0; font-size: 0.95rem;">Delivered</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">Arriving soon.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesHorizontalPulseExampleComponent {
	static readonly templateCode = `<hub-milestones orientation="horizontal" [pulse]="true">
  <hub-milestone state="complete">
    <h4>Ordered</h4>
    <p>Payment received.</p>
  </hub-milestone>
  <hub-milestone state="complete">
    <h4>Packed</h4>
    <p>Ready to ship.</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>In transit</h4>
    <p>Out for delivery now.</p>
  </hub-milestone>
  <hub-milestone state="pending">
    <h4>Delivered</h4>
    <p>Arriving soon.</p>
  </hub-milestone>
</hub-milestones>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent } from 'ng-hub-ui-milestones';

@Component({
  selector: 'app-delivery-tracking',
  standalone: true,
  imports: [HubMilestonesComponent, HubMilestoneComponent],
  templateUrl: './delivery-tracking.component.html'
})
export class DeliveryTrackingComponent {}`;
}
