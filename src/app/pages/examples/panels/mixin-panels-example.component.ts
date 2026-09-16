import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Live demo for the `hub-panels-theme` SCSS mixin. The `.panels-mixin-scope` block sets
 * the same `--hub-panels-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-panels-accent` re-tones the
 * active tab, while `--hub-panels-border-radius` rounds the pane surface.
 */
@Component({
	selector: 'app-mixin-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.panels-mixin-scope {
				--hub-panels-accent: #7c3aed;
				--hub-panels-border-radius: 0.75rem;
			}
		</style>
		<div class="panels-mixin-scope">
			<hub-panels>
				<hub-panel heading="Overview">The active tab follows the themed accent.</hub-panel>
				<hub-panel heading="Details">Switch panels with a click or the arrow keys.</hub-panel>
				<hub-panel heading="Settings">The pane surface picks up the themed radius.</hub-panel>
			</hub-panels>
		</div>
	`,
	styles: []
})
export class MixinPanelsExampleComponent {
	static readonly templateCode = `<div class="panels-mixin-scope">
  <hub-panels>
    <hub-panel heading="Overview">
      The active tab follows the themed accent.
    </hub-panel>
    <hub-panel heading="Details">
      Switch panels with a click or the arrow keys.
    </hub-panel>
    <hub-panel heading="Settings">
      The pane surface picks up the themed radius.
    </hub-panel>
  </hub-panels>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-mixin-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './mixin-panels-example.component.html',
  styleUrl: './mixin-panels-example.component.scss'
})
export class MixinPanelsExampleComponent {}`;

	static readonly cssCode = `@use 'ng-hub-ui-panels/styles' as panels;

.panels-mixin-scope {
  @include panels.hub-panels-theme(
    $accent: #7c3aed,
    $border-radius: 0.75rem
  );
}`;
}
