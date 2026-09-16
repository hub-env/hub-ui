import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * `hub-milestones` — every node state side by side: complete, active, error and pending.
 *
 * The four differ in colour, and one of them differs in more than that. An error node draws a
 * mark on its upper edge, which is what a reader who does not separate red from green has to
 * go on; and every node carries its state as a word in the body, clipped out of the page and
 * read out with the step. The last node shows `stateLabel`, which is how that word gets
 * translated — or silenced, with `''`.
 */
@Component({
	selector: 'app-milestones-states-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-milestones orientation="vertical" style="max-width: 32rem;">
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 1rem;">Complete</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					A finished step. Announced as “Completed”.
				</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 1rem;">Active</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					The current step, highlighted with a ring and carrying <code>aria-current="step"</code>.
				</p>
			</hub-milestone>
			<hub-milestone state="error">
				<h4 style="margin: 0; font-size: 1rem;">Error</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					Something needs attention here. The mark on the circle says so without colour, and the step is announced as
					“Error”.
				</p>
			</hub-milestone>
			<hub-milestone state="pending" stateLabel="Sin empezar">
				<h4 style="margin: 0; font-size: 1rem;">Pending</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">
					Not started yet — and announced as “Sin empezar”, because this node sets
					<code>stateLabel</code>.
				</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesStatesExampleComponent {
	static readonly templateCode = `<hub-milestones orientation="vertical">
  <hub-milestone state="complete">
    <h4>Complete</h4>
    <p>A finished step. Announced as "Completed".</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>Active</h4>
    <p>The current step, highlighted with a ring.</p>
  </hub-milestone>

  <!-- No extra markup: the error node draws its own non-colour mark -->
  <hub-milestone state="error">
    <h4>Error</h4>
    <p>Something needs attention here.</p>
  </hub-milestone>

  <!-- stateLabel overrides the announced word for this node -->
  <hub-milestone state="pending" stateLabel="Sin empezar">
    <h4>Pending</h4>
    <p>Not started yet.</p>
  </hub-milestone>
</hub-milestones>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent } from 'ng-hub-ui-milestones';
import { provideHubMilestones } from 'ng-hub-ui-milestones';

// Application-wide wording, overridden per node by [stateLabel]:
//   providers: [provideHubMilestones({
//     stateLabels: { complete: 'Completado', pending: 'Pendiente', error: 'Error' }
//   })]

@Component({
  selector: 'app-states-demo',
  standalone: true,
  imports: [HubMilestonesComponent, HubMilestoneComponent],
  templateUrl: './states-demo.component.html'
})
export class StatesDemoComponent {}`;
}
