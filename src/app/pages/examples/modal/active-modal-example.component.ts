import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

// MODAL CONTENT COMPONENT
@Component({
	selector: 'app-modal-content',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="modal-header">
			<h5 class="modal-title">I am a Component</h5>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>I have injected <code>HubActiveModal</code> to control myself.</p>
		</div>
		<div class="modal-footer">
			<button hubButton variant="outline" color="dark" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`
})
export class ModalContentComponent {
	// We inject HubActiveModal to interact with the modal instance
	activeModal = inject(HubActiveModal);
}

// MAIN EXAMPLE COMPONENT
@Component({
	selector: 'app-active-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div>
			<p>This example opens a component (not a template) that injects <code>HubActiveModal</code>.</p>
			<button hubButton color="primary" (click)="open()">Open Component</button>
			<div class="mt-2 text-muted">{{ message }}</div>
		</div>
	`
})
export class ActiveModalExampleComponent {
	private modal = inject(HubModal);
	message = '';

	/**
	 * Opens the modal content component and records its close or dismiss result.
	 */
	open() {
		const ref = this.modal.open(ModalContentComponent);

		ref.result.then(
			(res) => (this.message = `Closed with: ${res}`),
			(err) => (this.message = `Dismissed with: ${err}`)
		);
	}

	// ===========================================
	// CODE FOR TABS (STATIC)
	// ===========================================

	static templateCode = `<button (click)="open()">Open Component</button>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

// 1. Define content component
@Component({
  template: \`
    <div class="modal-header">
      <h5 class="modal-title">Hello</h5>
      <button class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <button hubButton color="primary" (click)="activeModal.close('ok')">OK</button>
    </div>
  \`
})
export class ContentComponent {
  activeModal = inject(HubActiveModal);
}

// 2. Open it from parent
@Component({...})
export class ParentComponent {
  private modal = inject(HubModal);

  open() {
    this.modal.open(ContentComponent);
  }
}`;
}
