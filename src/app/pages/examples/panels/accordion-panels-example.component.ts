import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Accordion example — stacked disclosure panels via `type="accordion"`.
 * All panels start collapsed; opening one closes the others by default.
 */
@Component({
	selector: 'app-accordion-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels type="accordion">
			<hub-panel heading="What is ng-hub-ui-panels?"
				>A single component that renders as tabs, pills or an accordion.</hub-panel
			>
			<hub-panel heading="Is it accessible?">Yes — full keyboard navigation and ARIA roles are built in.</hub-panel>
			<hub-panel heading="Can I theme it?">Every token is a --hub-panels-* CSS custom property.</hub-panel>
		</hub-panels>
	`
})
export class AccordionPanelsExampleComponent {
	static readonly templateCode = `<hub-panels type="accordion">
  <hub-panel heading="What is ng-hub-ui-panels?">
    A single component that renders as tabs, pills or an accordion.
  </hub-panel>
  <hub-panel heading="Is it accessible?">
    Yes — full keyboard navigation and ARIA roles are built in.
  </hub-panel>
  <hub-panel heading="Can I theme it?">
    Every token is a --hub-panels-* CSS custom property.
  </hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-accordion-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './accordion-panels-example.component.html'
})
export class AccordionPanelsExampleComponent {}`;
}
