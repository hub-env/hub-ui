import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — themed entirely through `--hub-milestone-*` CSS variables
 * (node color and size, connector, spacing) plus the opt-in `[pulse]` input that
 * makes the active node emit a soft wave.
 */
@Component({
	selector: 'app-milestones-css-variables-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones
			orientation="vertical"
			[pulse]="true"
			style="
				max-width: 32rem;
				--hub-milestone-node-color: #0ea5e9;
				--hub-milestone-node-size: 3.25rem;
				--hub-milestone-connector-bg: linear-gradient(180deg, #0ea5e9, #6366f1);
				--hub-milestone-connector-thickness: 4px;
				--hub-milestone-spacing: 2.25rem;
			"
		>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 1rem;">Kickoff</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Project scoped and approved.</p>
			</hub-milestone>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 1rem;">Build</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Core features shipped.</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 1rem;">Launch</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Rolling out to production.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesCssVariablesExampleComponent {
	static readonly templateCode = `<hub-milestones
  orientation="vertical"
  [pulse]="true"
  style="
    --hub-milestone-node-color: #0ea5e9;
    --hub-milestone-node-size: 3.25rem;
    --hub-milestone-connector-bg: linear-gradient(180deg, #0ea5e9, #6366f1);
    --hub-milestone-connector-thickness: 4px;
    --hub-milestone-spacing: 2.25rem;
  ">
  <hub-milestone state="complete">
    <h4>Kickoff</h4>
    <p>Project scoped and approved.</p>
  </hub-milestone>
  <hub-milestone state="complete">
    <h4>Build</h4>
    <p>Core features shipped.</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>Launch</h4>
    <p>Rolling out to production.</p>
  </hub-milestone>
</hub-milestones>`;

	static readonly componentCode = `/*
 * Theming is pure CSS — set --hub-milestone-* tokens on the host (inline,
 * a class, or a :root override) and the timeline re-themes at runtime.
 */
import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent } from 'ng-hub-ui-milestones';

@Component({
  selector: 'app-themed-timeline',
  standalone: true,
  imports: [HubMilestonesComponent, HubMilestoneComponent],
  templateUrl: './themed-timeline.component.html'
})
export class ThemedTimelineComponent {}`;
}
