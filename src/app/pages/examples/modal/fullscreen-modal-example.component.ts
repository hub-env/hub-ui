import { Component, TemplateRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubModal, HubModalRef } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Example demonstrating opening a modal in fullscreen mode.
 */
@Component({
	selector: 'app-fullscreen-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<button hubButton color="primary" (click)="openFullscreen(tpl)">Open Fullscreen Modal</button>

		<ng-template #tpl>
			<div class="modal-header">
				<h5 class="modal-title">Fullscreen Modal</h5>
				<button type="button" class="btn-close" aria-label="Close" (click)="dismiss()"></button>
			</div>
			<div class="modal-body">
				<p>This modal takes up the entire screen using the <code>fullscreen: true</code> option.</p>
				<p>Example content to demonstrate scroll and layout in fullscreen mode.</p>
			</div>
			<div class="modal-footer">
				<button hubButton color="success" (click)="close()">Close</button>
			</div>
		</ng-template>
	`
})
export class FullscreenModalExampleComponent {
	private modal = inject(HubModal);
	private ref?: HubModalRef<any>;

	static templateCode = `<button (click)="openFullscreen(tpl)">Open Fullscreen Modal</button>
<ng-template #tpl>
  <div class="modal-header"><h5 class="modal-title">Fullscreen Modal</h5></div>
  <div class="modal-body">...</div>
  <div class="modal-footer"><button (click)="close()">Close</button></div>
</ng-template>`;

	static componentCode = `import { Component, TemplateRef, inject } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-fullscreen-modal-example',
  standalone: true,
  template: \`...\`
})
export class FullscreenModalExampleComponent {}`;

	/**
	 * Opens the given template as a fullscreen modal.
	 * @param tpl The template reference to render inside the modal.
	 */
	openFullscreen(tpl: TemplateRef<any>) {
		this.ref = this.modal.open(tpl, { fullscreen: true });
	}

	/**
	 * Closes the open modal with a successful result.
	 */
	close() {
		this.ref?.close();
	}

	/**
	 * Dismisses the open modal without a result.
	 */
	dismiss() {
		this.ref?.dismiss();
	}
}
