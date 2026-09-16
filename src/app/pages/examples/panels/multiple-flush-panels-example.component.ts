import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Accordion options example — `multiple` keeps several panels expanded at once
 * and `flush` removes the outer chrome for an edge-to-edge layout.
 */
@Component({
	selector: 'app-multiple-flush-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels type="accordion" multiple flush>
			<hub-panel heading="Shipping" [active]="true">Standard delivery in 3–5 business days.</hub-panel>
			<hub-panel heading="Returns" [active]="true">Free returns within 30 days.</hub-panel>
			<hub-panel heading="Warranty">Two-year limited manufacturer warranty.</hub-panel>
		</hub-panels>
	`
})
export class MultipleFlushPanelsExampleComponent {
	static readonly templateCode = `<hub-panels type="accordion" multiple flush>
  <hub-panel heading="Shipping" [active]="true">
    Standard delivery in 3–5 business days.
  </hub-panel>
  <hub-panel heading="Returns" [active]="true">
    Free returns within 30 days.
  </hub-panel>
  <hub-panel heading="Warranty">
    Two-year limited manufacturer warranty.
  </hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-multiple-flush-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './multiple-flush-panels-example.component.html'
})
export class MultipleFlushPanelsExampleComponent {}`;
}
