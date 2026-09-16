import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Scrollable tabs example — an overflowing strip gets scroll buttons.
 * The wrapper constrains the width so the strip actually overflows.
 */
@Component({
	selector: 'app-scrollable-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div style="max-width: 360px">
			<hub-panels scrollable>
				@for (n of panels; track n) {
					<hub-panel [heading]="'Section ' + n">Content for section {{ n }}.</hub-panel>
				}
			</hub-panels>
		</div>
	`
})
export class ScrollablePanelsExampleComponent {
	readonly panels = [1, 2, 3, 4, 5, 6, 7, 8];

	static readonly templateCode = `<div style="max-width: 360px">
  <hub-panels scrollable>
    @for (n of panels; track n) {
      <hub-panel [heading]="'Section ' + n">Content for section {{ n }}.</hub-panel>
    }
  </hub-panels>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-scrollable-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './scrollable-panels-example.component.html'
})
export class ScrollablePanelsExampleComponent {
  readonly panels = [1, 2, 3, 4, 5, 6, 7, 8];
}`;
}
