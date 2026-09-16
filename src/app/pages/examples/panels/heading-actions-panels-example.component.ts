import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
	HubPanelComponent,
	HubPanelHeadingActionsDirective,
	HubPanelHeadingDirective,
	HubPanelsComponent
} from 'ng-hub-ui-panels';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Accordion row actions example — `hubPanelHeadingActions` projects real
 * controls beside the disclosure button (never inside it), so an edit/delete
 * affordance stays valid, keyboard-reachable and visible while the row is
 * collapsed. `togglePosition="start"` leads the row with the chevron.
 */
@Component({
	selector: 'app-heading-actions-panels-example',
	standalone: true,
	imports: [
		HubPanelsComponent,
		HubPanelComponent,
		HubPanelHeadingDirective,
		HubPanelHeadingActionsDirective,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels type="accordion" multiple togglePosition="start">
			@for (row of rows(); track row.id) {
				<hub-panel>
					<ng-template hubPanelHeading>{{ row.name }}</ng-template>
					<ng-template hubPanelHeadingActions>
						<button
							type="button"
							hubButton
							variant="outline"
							color="secondary"
							size="sm"
							[attr.aria-label]="'Edit ' + row.name"
							(click)="edit(row.id)"
						>
							<i class="fa-solid fa-pen"></i>
						</button>
						<button
							type="button"
							hubButton
							variant="outline"
							color="danger"
							size="sm"
							[attr.aria-label]="'Delete ' + row.name"
							(click)="remove(row.id)"
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</ng-template>
					{{ row.detail }}
				</hub-panel>
			}
		</hub-panels>

		@if (lastAction()) {
			<p class="text-body-secondary mt-2 mb-0">{{ lastAction() }}</p>
		}
	`
})
export class HeadingActionsPanelsExampleComponent {
	protected readonly rows = signal([
		{ id: 'shipping', name: 'Shipping address', detail: 'Where the order is delivered.' },
		{ id: 'billing', name: 'Billing address', detail: 'Where the invoice is sent.' },
		{ id: 'returns', name: 'Returns', detail: 'How to send an item back.' }
	]);

	protected readonly lastAction = signal('');

	/** The actions sit outside the disclosure button, so no click ever toggles the row. */
	protected edit(id: string): void {
		this.lastAction.set(`Edit requested for "${id}" — the panel did not toggle.`);
	}

	protected remove(id: string): void {
		this.rows.update((rows) => rows.filter((row) => row.id !== id));
		this.lastAction.set(`Removed "${id}".`);
	}

	static readonly templateCode = `<hub-panels type="accordion" multiple togglePosition="start">
  @for (row of rows(); track row.id) {
    <hub-panel>
      <ng-template hubPanelHeading>{{ row.name }}</ng-template>

      <!-- Beside the disclosure button, never inside it: these are real
           buttons, they stay visible while the row is collapsed, and a
           click never toggles the panel (no stopPropagation needed). -->
      <ng-template hubPanelHeadingActions>
        <button type="button" (click)="edit(row.id)">Edit</button>
        <button type="button" (click)="remove(row.id)">Delete</button>
      </ng-template>

      {{ row.detail }}
    </hub-panel>
  }
</hub-panels>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent, HubPanelHeadingDirective, HubPanelHeadingActionsDirective } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-heading-actions-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, HubPanelHeadingDirective, HubPanelHeadingActionsDirective],
  templateUrl: './heading-actions-panels-example.component.html'
})
export class HeadingActionsPanelsExampleComponent {
  protected readonly rows = signal([
    { id: 'shipping', name: 'Shipping address', detail: 'Where the order is delivered.' },
    { id: 'billing', name: 'Billing address', detail: 'Where the invoice is sent.' }
  ]);

  protected edit(id: string): void { /* … */ }

  protected remove(id: string): void {
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }
}`;
}
