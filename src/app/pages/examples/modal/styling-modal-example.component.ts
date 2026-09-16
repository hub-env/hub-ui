import { Component, TemplateRef, ViewEncapsulation, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Styling example for modal CSS variables.
 * Uses windowClass/backdropClass to scope style overrides.
 */
@Component({
	selector: 'app-styling-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	templateUrl: './styling-modal-example.component.html',
	styleUrl: './styling-modal-example.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None
})
export class StylingModalExampleComponent {
	private readonly modal = inject(HubModal);

	/**
	 * Opens the modal with custom styling classes.
	 */
	openStyledModal(template: TemplateRef<unknown>): void {
		this.modal.open(template, {
			size: 'lg',
			windowClass: 'modal-theme-sunset',
			backdropClass: 'modal-backdrop-sunset'
		});
	}

	static templateCode = `<button hubButton variant="outline" color="dark" (click)="openStyledModal(styledTpl)">
  Open Styled Modal
</button>

<ng-template #styledTpl let-d="dismiss">
  <div class="modal-header">
    <h5 class="modal-title">Styled Modal</h5>
  </div>
  <div class="modal-body">
    <p>Modal styled via --hub-modal-* CSS variables.</p>
  </div>
  <div class="modal-footer">
    <button hubButton color="secondary" (click)="d('close')">Close</button>
  </div>
</ng-template>`;

	static componentCode = `this.modal.open(styledTpl, {
  windowClass: 'modal-theme-sunset',
  backdropClass: 'modal-backdrop-sunset',
  size: 'lg'
});`;
}
