import { Component, TemplateRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Example showing how to open the same modal in every supported placement.
 */
@Component({
	selector: 'app-placement-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="form-check form-switch">
				<input
					id="placement-centered-switch"
					class="form-check-input"
					type="checkbox"
					[checked]="centered"
					(change)="toggleCentered($event)"
				/>
				<label class="form-check-label" for="placement-centered-switch">
					Centered: <strong>{{ centered }}</strong>
				</label>
			</div>

			<div class="d-flex gap-2 flex-wrap">
				<button hubButton variant="outline" color="secondary" (click)="openAt(tpl, placements.Center)">Center</button>
				<button hubButton variant="outline" color="secondary" (click)="openAt(tpl, placements.Start)">Start</button>
				<button hubButton variant="outline" color="secondary" (click)="openAt(tpl, placements.End)">End</button>
				<button hubButton variant="outline" color="secondary" (click)="openAt(tpl, placements.Top)">Top</button>
				<button hubButton variant="outline" color="secondary" (click)="openAt(tpl, placements.Bottom)">Bottom</button>
			</div>
		</div>

		<ng-template #tpl let-close="close" let-dismiss="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">{{ activePlacementLabel }}</h5>
			</div>
			<div class="modal-body">
				<p class="mb-2">This modal uses the native <code>placement</code> option.</p>
				<p class="mb-0">
					Current placement:
					<strong>{{ activePlacement }}</strong>
				</p>
			</div>
			<div class="modal-footer">
				<button hubButton color="secondary" (click)="dismiss('cancel')">Close</button>
				<button hubButton color="primary" (click)="close(activePlacement)">Confirm</button>
			</div>
		</ng-template>
	`
})
export class PlacementModalExampleComponent {
	private readonly modal = inject(HubModal);

	readonly placements = HubModalPlacement;

	activePlacement: HubModalPlacement = HubModalPlacement.Center;
	activePlacementLabel = 'Center Modal';
	centered = true;

	/**
	 * Opens the modal using the selected placement value.
	 */
	openAt(templateRef: TemplateRef<unknown>, placement: HubModalPlacement): void {
		this.activePlacement = placement;
		this.activePlacementLabel = `${this.formatPlacement(placement)} Modal`;

		this.modal
			.open(templateRef, {
				headerSelector: '.modal-header',
				footerSelector: '.modal-footer',
				centered: this.centered,
				placement
			})
			.result.catch(() => {});
	}

	/**
	 * Updates the centered flag from the checkbox state.
	 * @param event The change event from the centered checkbox.
	 */
	toggleCentered(event: Event): void {
		this.centered = (event.target as HTMLInputElement).checked;
	}

	/**
	 * Formats a placement value into a capitalized label.
	 * @param placement The modal placement to format.
	 * @returns The placement string with its first letter capitalized.
	 */
	private formatPlacement(placement: HubModalPlacement): string {
		return placement.charAt(0).toUpperCase() + placement.slice(1);
	}

	static templateCode = `<label>
  <input type="checkbox" [checked]="centered" (change)="toggleCentered($event)" />
  Centered: {{ centered }}
</label>

<button (click)="openAt(tpl, placements.Center)">Center</button>
<button (click)="openAt(tpl, placements.Start)">Start</button>
<button (click)="openAt(tpl, placements.End)">End</button>
<button (click)="openAt(tpl, placements.Top)">Top</button>
<button (click)="openAt(tpl, placements.Bottom)">Bottom</button>

<ng-template #tpl let-close="close" let-dismiss="dismiss">
  <div class="modal-header">
    <h5 class="modal-title">{{ activePlacementLabel }}</h5>
  </div>
  <div class="modal-body">
    <p>Current placement: <strong>{{ activePlacement }}</strong></p>
  </div>
  <div class="modal-footer">
    <button hubButton color="secondary" (click)="dismiss('cancel')">Close</button>
    <button hubButton color="primary" (click)="close(activePlacement)">Confirm</button>
  </div>
</ng-template>`;

	static componentCode = `import { Component, TemplateRef, inject } from '@angular/core';
import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-placement-modal-example',
  standalone: true,
  template: \`<!-- see HTML tab -->\`
})
export class PlacementModalExampleComponent {
  private readonly modal = inject(HubModal);

  readonly placements = HubModalPlacement;

  activePlacement: HubModalPlacement = HubModalPlacement.Center;
  activePlacementLabel = 'Center Modal';
  centered = true;

  openAt(templateRef: TemplateRef<unknown>, placement: HubModalPlacement): void {
    this.activePlacement = placement;
    this.activePlacementLabel = \`\${placement.charAt(0).toUpperCase()}\${placement.slice(1)} Modal\`;

    this.modal.open(templateRef, {
      headerSelector: '.modal-header',
      footerSelector: '.modal-footer',
      centered: this.centered,
      placement
    }).result.catch(() => {});
  }

  toggleCentered(event: Event): void {
    this.centered = (event.target as HTMLInputElement).checked;
  }
}`;
}
