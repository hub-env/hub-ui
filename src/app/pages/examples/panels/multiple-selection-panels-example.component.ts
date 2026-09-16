import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Multiple selection example — with `multiple`, the tabs/pills strip lets the
 * user open several panes at once. Every active header starts its own visible
 * panel, and the following inactive headers stay grouped above that panel
 * until the next active header starts a new block. The form value is an array.
 */
@Component({
	selector: 'app-multiple-selection-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<p class="text-muted small mb-2">
			Click an inactive tab to split the layout into a new panel block. Click an active tab to merge that block back.
		</p>
		<hub-panels multiple [formControl]="open">
			<hub-panel heading="Summary" value="summary">Key metrics and a quick overview of the account.</hub-panel>
			<hub-panel heading="Stats" value="stats">Detailed statistics and charts for the period.</hub-panel>
			<hub-panel heading="Activity" value="activity">A chronological feed of recent activity.</hub-panel>
			<hub-panel heading="Notes" value="notes">Free-form notes shared with the team.</hub-panel>
		</hub-panels>
		<div class="mt-3"><strong>Open panels:</strong> {{ open.value | json }}</div>
	`
})
export class MultipleSelectionPanelsExampleComponent {
	readonly open = new FormControl<string[]>(['summary', 'stats']);

	static readonly templateCode = `<hub-panels multiple [formControl]="open">
  <hub-panel heading="Summary" value="summary">Key metrics and a quick overview.</hub-panel>
  <hub-panel heading="Stats" value="stats">Detailed statistics and charts.</hub-panel>
  <hub-panel heading="Activity" value="activity">A chronological feed of activity.</hub-panel>
  <hub-panel heading="Notes" value="notes">Free-form notes shared with the team.</hub-panel>
</hub-panels>
<div class="mt-3"><strong>Open panels:</strong> {{ open.value | json }}</div>`;

	static readonly componentCode = `import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-multiple-selection-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './multiple-selection-panels-example.component.html'
})
export class MultipleSelectionPanelsExampleComponent {
  // With multiple, every active header starts a visible panel block.
  readonly open = new FormControl<string[]>(['summary', 'stats']);
}`;
}
