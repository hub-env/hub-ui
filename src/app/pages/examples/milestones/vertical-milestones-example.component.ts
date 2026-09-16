import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — a vertical timeline of four steps with auto-numbered nodes
 * and a title + description body per step.
 */
@Component({
	selector: 'app-milestones-vertical-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones orientation="vertical" style="max-width: 32rem;">
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 1rem;">Information</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					Account details captured and verified.
				</p>
			</hub-milestone>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 1rem;">Shipping</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Delivery address confirmed.</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 1rem;">Payment</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					Enter your payment method to continue.
				</p>
			</hub-milestone>
			<hub-milestone state="pending">
				<h4 style="margin: 0; font-size: 1rem;">Review</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					Place the order once everything looks right.
				</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesVerticalExampleComponent {
	static readonly templateCode = `<hub-milestones orientation="vertical">
  <hub-milestone state="complete">
    <h4>Information</h4>
    <p>Account details captured and verified.</p>
  </hub-milestone>
  <hub-milestone state="complete">
    <h4>Shipping</h4>
    <p>Delivery address confirmed.</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>Payment</h4>
    <p>Enter your payment method to continue.</p>
  </hub-milestone>
  <hub-milestone state="pending">
    <h4>Review</h4>
    <p>Place the order once everything looks right.</p>
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
