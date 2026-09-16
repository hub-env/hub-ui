import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — the same four-step timeline laid out horizontally via
 * `orientation="horizontal"`.
 */
@Component({
	selector: 'app-milestones-horizontal-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones orientation="horizontal">
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Information</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Account verified.
				</p>
			</hub-milestone>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Shipping</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Address confirmed.
				</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 0.95rem;">Payment</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">In progress.</p>
			</hub-milestone>
			<hub-milestone state="pending">
				<h4 style="margin: 0; font-size: 0.95rem;">Review</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">Last step.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesHorizontalExampleComponent {
	static readonly templateCode = `<hub-milestones orientation="horizontal">
  <hub-milestone state="complete">
    <h4>Information</h4>
    <p>Account verified.</p>
  </hub-milestone>
  <hub-milestone state="complete">
    <h4>Shipping</h4>
    <p>Address confirmed.</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>Payment</h4>
    <p>In progress.</p>
  </hub-milestone>
  <hub-milestone state="pending">
    <h4>Review</h4>
    <p>Last step.</p>
  </hub-milestone>
</hub-milestones>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent } from 'ng-hub-ui-milestones';

@Component({
  selector: 'app-checkout-steps',
  standalone: true,
  imports: [HubMilestonesComponent, HubMilestoneComponent],
  templateUrl: './checkout-steps.component.html'
})
export class CheckoutStepsComponent {}`;
}
