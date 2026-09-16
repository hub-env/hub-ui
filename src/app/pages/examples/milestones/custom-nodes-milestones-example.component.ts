import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestoneNodeDirective, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — custom in-circle content via `<ng-template hubMilestoneNode>`
 * (emoji / icons) plus per-node `color` overrides that win over the state color.
 */
@Component({
	selector: 'app-milestones-custom-nodes-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones orientation="vertical" style="max-width: 32rem;">
			<hub-milestone state="complete" color="#16a34a">
				<ng-template hubMilestoneNode>📝</ng-template>
				<h4 style="margin: 0; font-size: 1rem;">Drafted</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Article written and saved.</p>
			</hub-milestone>
			<hub-milestone state="complete" color="#0ea5e9">
				<ng-template hubMilestoneNode>👀</ng-template>
				<h4 style="margin: 0; font-size: 1rem;">Reviewed</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Approved by the editor.</p>
			</hub-milestone>
			<hub-milestone state="active" color="#f59e0b">
				<ng-template hubMilestoneNode>🚀</ng-template>
				<h4 style="margin: 0; font-size: 1rem;">Publishing</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Going live across channels.</p>
			</hub-milestone>
			<hub-milestone state="pending">
				<ng-template hubMilestoneNode>📈</ng-template>
				<h4 style="margin: 0; font-size: 1rem;">Promotion</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Scheduled for next week.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesCustomNodesExampleComponent {
	static readonly templateCode = `<hub-milestones orientation="vertical">
  <hub-milestone state="complete" color="#16a34a">
    <ng-template hubMilestoneNode>📝</ng-template>
    <h4>Drafted</h4>
    <p>Article written and saved.</p>
  </hub-milestone>
  <hub-milestone state="complete" color="#0ea5e9">
    <ng-template hubMilestoneNode>👀</ng-template>
    <h4>Reviewed</h4>
    <p>Approved by the editor.</p>
  </hub-milestone>
  <hub-milestone state="active" color="#f59e0b">
    <ng-template hubMilestoneNode>🚀</ng-template>
    <h4>Publishing</h4>
    <p>Going live across channels.</p>
  </hub-milestone>
  <hub-milestone state="pending">
    <ng-template hubMilestoneNode>📈</ng-template>
    <h4>Promotion</h4>
    <p>Scheduled for next week.</p>
  </hub-milestone>
</hub-milestones>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import {
  HubMilestonesComponent,
  HubMilestoneComponent,
  HubMilestoneNodeDirective
} from 'ng-hub-ui-milestones';

@Component({
  selector: 'app-publishing-flow',
  standalone: true,
  imports: [HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective],
  templateUrl: './publishing-flow.component.html'
})
export class PublishingFlowComponent {}`;
}
