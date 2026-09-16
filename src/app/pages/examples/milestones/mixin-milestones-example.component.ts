import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent } from 'ng-hub-ui-milestones';

/**
 * Live demo for the `hub-milestones-theme` SCSS mixin. The `.milestones-mixin-scope`
 * block sets the same singular `--hub-milestone-*` custom properties the mixin emits, so
 * the rendered result matches the SCSS shown alongside it in the docs. The completed
 * nodes and the connector rail are re-toned by the scope.
 */
@Component({
	selector: 'app-mixin-milestones-example',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.milestones-mixin-scope {
				--hub-milestone-node-color: #7c3aed;
				--hub-milestone-connector-thickness: 3px;
			}
		</style>
		<div class="milestones-mixin-scope">
			<hub-milestones orientation="vertical" style="max-width: 32rem;">
				<hub-milestone state="complete">
					<h4 style="margin: 0; font-size: 1rem;">Kickoff</h4>
					<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Project scoped and approved.</p>
				</hub-milestone>
				<hub-milestone state="active">
					<h4 style="margin: 0; font-size: 1rem;">Build</h4>
					<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">The current step, in progress.</p>
				</hub-milestone>
				<hub-milestone state="pending">
					<h4 style="margin: 0; font-size: 1rem;">Launch</h4>
					<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted);">Not started yet.</p>
				</hub-milestone>
			</hub-milestones>
		</div>
	`,
	styles: []
})
export class MixinMilestonesExampleComponent {}
