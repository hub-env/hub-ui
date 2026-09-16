import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Basic tabs example — the default `tabs` visualization.
 */
@Component({
	selector: 'app-basic-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels>
			<hub-panel heading="Overview">The first enabled panel is activated automatically.</hub-panel>
			<hub-panel heading="Details">Switch panels with a click or the arrow keys.</hub-panel>
			<hub-panel heading="Settings">Each panel projects its own content.</hub-panel>
		</hub-panels>
	`
})
export class BasicPanelsExampleComponent {
	static readonly templateCode = `<hub-panels>
  <hub-panel heading="Overview">
    The first enabled panel is activated automatically.
  </hub-panel>
  <hub-panel heading="Details">
    Switch panels with a click or the arrow keys.
  </hub-panel>
  <hub-panel heading="Settings">
    Each panel projects its own content.
  </hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-basic-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './basic-panels-example.component.html'
})
export class BasicPanelsExampleComponent {}`;
}
