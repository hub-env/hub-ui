import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Vertical multiple example — the same block-based `multiple` behavior, but
 * with every block rendering its strip vertically beside the content.
 */
@Component({
	selector: 'app-multiple-vertical-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<p class="text-muted small mb-2">
			Each active header starts a new row-like vertical block. The blocks stack top-to-bottom, and the whole layout
			scrolls horizontally only when one row needs more width.
		</p>

		<h5 class="mb-2">Tabs</h5>
		<hub-panels multiple vertical [formControl]="tabsOpen">
			<hub-panel heading="Profile" value="profile">Public profile details and biography.</hub-panel>
			<hub-panel heading="Billing" value="billing">Invoices, payment methods and VAT details.</hub-panel>
			<hub-panel heading="Team" value="team">Members, roles and access levels.</hub-panel>
			<hub-panel heading="Notes" value="notes">Shared internal notes for the account.</hub-panel>
		</hub-panels>
		<div class="mt-2 mb-4"><strong>Open tabs:</strong> {{ tabsOpen.value | json }}</div>

		<h5 class="mb-2">Pills</h5>
		<hub-panels type="pills" multiple vertical [formControl]="pillsOpen">
			<hub-panel heading="Inbox" value="inbox">Open items waiting for review.</hub-panel>
			<hub-panel heading="Review" value="review">Approvals and pending checks.</hub-panel>
			<hub-panel heading="Publish" value="publish">Publication options and scheduling.</hub-panel>
			<hub-panel heading="Archive" value="archive">Historical records and exported snapshots.</hub-panel>
		</hub-panels>
		<div class="mt-2"><strong>Open pills:</strong> {{ pillsOpen.value | json }}</div>
	`
})
export class MultipleVerticalPanelsExampleComponent {
	readonly tabsOpen = new FormControl<string[]>(['profile', 'team']);
	readonly pillsOpen = new FormControl<string[]>(['inbox', 'publish']);

	static readonly templateCode = `<hub-panels multiple vertical [formControl]="tabsOpen">
  <hub-panel heading="Profile" value="profile">Public profile details and biography.</hub-panel>
  <hub-panel heading="Billing" value="billing">Invoices, payment methods and VAT details.</hub-panel>
  <hub-panel heading="Team" value="team">Members, roles and access levels.</hub-panel>
  <hub-panel heading="Notes" value="notes">Shared internal notes for the account.</hub-panel>
</hub-panels>

<hub-panels type="pills" multiple vertical [formControl]="pillsOpen">
  <hub-panel heading="Inbox" value="inbox">Open items waiting for review.</hub-panel>
  <hub-panel heading="Review" value="review">Approvals and pending checks.</hub-panel>
  <hub-panel heading="Publish" value="publish">Publication options and scheduling.</hub-panel>
  <hub-panel heading="Archive" value="archive">Historical records and exported snapshots.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-multiple-vertical-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './multiple-vertical-panels-example.component.html'
})
export class MultipleVerticalPanelsExampleComponent {
  readonly tabsOpen = new FormControl<string[]>(['profile', 'team']);
  readonly pillsOpen = new FormControl<string[]>(['inbox', 'publish']);
}`;
}
