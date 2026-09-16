import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelHeadingDirective, HubPanelsComponent } from 'ng-hub-ui-panels';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Custom heading templates example — project any markup into the header with
 * the `hubPanelHeading` directive (icons, badges, etc.).
 */
@Component({
	selector: 'app-custom-heading-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, HubPanelHeadingDirective, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels>
			<hub-panel>
				<ng-template hubPanelHeading
					><i class="fa-solid fa-inbox me-2"></i>Inbox
					<hub-badge color="primary" shape="rounded" class="ms-1">12</hub-badge></ng-template
				>
				Twelve unread messages.
			</hub-panel>
			<hub-panel>
				<ng-template hubPanelHeading><i class="fa-solid fa-paper-plane me-2"></i>Sent</ng-template>
				Messages you have sent.
			</hub-panel>
			<hub-panel>
				<ng-template hubPanelHeading><i class="fa-solid fa-trash me-2"></i>Trash</ng-template>
				Recently deleted items.
			</hub-panel>
		</hub-panels>
	`
})
export class CustomHeadingPanelsExampleComponent {
	static readonly templateCode = `<hub-panels>
  <hub-panel>
    <ng-template hubPanelHeading>
      <i class="fa-solid fa-inbox me-2"></i>Inbox
      <hub-badge color="primary" shape="rounded" class="ms-1">12</hub-badge>
    </ng-template>
    Twelve unread messages.
  </hub-panel>
  <hub-panel>
    <ng-template hubPanelHeading>
      <i class="fa-solid fa-paper-plane me-2"></i>Sent
    </ng-template>
    Messages you have sent.
  </hub-panel>
  <hub-panel>
    <ng-template hubPanelHeading>
      <i class="fa-solid fa-trash me-2"></i>Trash
    </ng-template>
    Recently deleted items.
  </hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent, HubPanelHeadingDirective } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-custom-heading-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, HubPanelHeadingDirective],
  templateUrl: './custom-heading-panels-example.component.html'
})
export class CustomHeadingPanelsExampleComponent {}`;
}
