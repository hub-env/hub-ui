import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Vertical tabs example — the header strip is stacked beside the content.
 */
@Component({
	selector: 'app-vertical-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels vertical>
			<hub-panel heading="Profile">Your public profile information.</hub-panel>
			<hub-panel heading="Billing">Invoices and payment methods.</hub-panel>
			<hub-panel heading="Team">Manage members and roles.</hub-panel>
		</hub-panels>
	`
})
export class VerticalPanelsExampleComponent {
	static readonly templateCode = `<hub-panels vertical>
  <hub-panel heading="Profile">Your public profile information.</hub-panel>
  <hub-panel heading="Billing">Invoices and payment methods.</hub-panel>
  <hub-panel heading="Team">Manage members and roles.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-vertical-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './vertical-panels-example.component.html'
})
export class VerticalPanelsExampleComponent {}`;
}
