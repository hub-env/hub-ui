import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Pills example — rounded header strip via `type="pills"`.
 */
@Component({
	selector: 'app-pills-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels type="pills">
			<hub-panel heading="Account">Account settings live here.</hub-panel>
			<hub-panel heading="Security">Password and two-factor options.</hub-panel>
			<hub-panel heading="Notifications">Email and push preferences.</hub-panel>
		</hub-panels>
	`
})
export class PillsPanelsExampleComponent {
	static readonly templateCode = `<hub-panels type="pills">
  <hub-panel heading="Account">Account settings live here.</hub-panel>
  <hub-panel heading="Security">Password and two-factor options.</hub-panel>
  <hub-panel heading="Notifications">Email and push preferences.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-pills-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './pills-panels-example.component.html'
})
export class PillsPanelsExampleComponent {}`;
}
