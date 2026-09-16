import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Disabled panels example — a disabled panel cannot be activated and is
 * skipped by keyboard navigation.
 */
@Component({
	selector: 'app-disabled-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels>
			<hub-panel heading="Available">This panel is selectable.</hub-panel>
			<hub-panel heading="Coming soon" disabled>This panel is disabled.</hub-panel>
			<hub-panel heading="Also available">Arrow keys skip the disabled panel.</hub-panel>
		</hub-panels>
	`
})
export class DisabledPanelsExampleComponent {
	static readonly templateCode = `<hub-panels>
  <hub-panel heading="Available">This panel is selectable.</hub-panel>
  <hub-panel heading="Coming soon" disabled>This panel is disabled.</hub-panel>
  <hub-panel heading="Also available">Arrow keys skip the disabled panel.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-disabled-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './disabled-panels-example.component.html'
})
export class DisabledPanelsExampleComponent {}`;
}
