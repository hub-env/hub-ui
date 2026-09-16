import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Justified tabs example — headers stretch to share the available width.
 */
@Component({
	selector: 'app-justified-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels justified>
			<hub-panel heading="Day">Today's agenda.</hub-panel>
			<hub-panel heading="Week">The seven-day view.</hub-panel>
			<hub-panel heading="Month">The full month at a glance.</hub-panel>
		</hub-panels>
	`
})
export class JustifiedPanelsExampleComponent {
	static readonly templateCode = `<hub-panels justified>
  <hub-panel heading="Day">Today's agenda.</hub-panel>
  <hub-panel heading="Week">The seven-day view.</hub-panel>
  <hub-panel heading="Month">The full month at a glance.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-justified-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './justified-panels-example.component.html'
})
export class JustifiedPanelsExampleComponent {}`;
}
