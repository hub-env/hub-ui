import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Connected list (timeline / pipeline) example.
 *
 * The opt-in `connected` input draws a vertical connector between consecutive
 * items — a timeline / pipeline look — themed through the `--hub-list-connector-*`
 * tokens. It only affects the list display (skipped in cards) and is off by default.
 */
@Component({
	selector: 'app-connected-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			.timeline-scope .hub-list {
				--hub-list-connector-color: var(--hub-sys-color-primary, #0d6efd);
				--hub-list-connector-width: 2px;
			}
		</style>

		<div class="timeline-scope">
			<hub-list [items]="steps" [connected]="true" [bindLabel]="'title'">
				<ng-template listItemTpt let-item="data">
					<div class="d-flex align-items-center gap-2 p-2">
						<hub-badge color="primary">{{ item.time }}</hub-badge>
						<div>
							<h6 class="mb-0">{{ item.title }}</h6>
							<small class="text-muted">{{ item.detail }}</small>
						</div>
					</div>
				</ng-template>
			</hub-list>
		</div>
	`
})
export class ConnectedListExampleComponent {
	steps = [
		{ time: '09:00', title: 'Order placed', detail: 'Payment confirmed' },
		{ time: '11:20', title: 'Processing', detail: 'Picked from warehouse' },
		{ time: '14:05', title: 'Shipped', detail: 'Handed to courier' },
		{ time: '—', title: 'Out for delivery', detail: 'Estimated today' }
	];

	static readonly templateCode = `<style>
  .timeline-scope .hub-list {
    --hub-list-connector-color: var(--hub-sys-color-primary, #0d6efd);
    --hub-list-connector-width: 2px;
  }
</style>

<div class="timeline-scope">
  <hub-list [items]="steps" [connected]="true" [bindLabel]="'title'">
    <ng-template listItemTpt let-item="data">
      <div class="d-flex align-items-center gap-2 p-2">
        <hub-badge color="primary">{{ item.time }}</hub-badge>
        <h6 class="mb-0">{{ item.title }}</h6>
      </div>
    </ng-template>
  </hub-list>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-connected-list',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  templateUrl: './connected-list.component.html'
})
export class ConnectedListComponent {
  // \`connected\` draws the vertical connector between items (timeline look).
  steps = [
    { time: '09:00', title: 'Order placed' },
    { time: '11:20', title: 'Processing' },
    { time: '14:05', title: 'Shipped' }
  ];
}`;
}
