import { Component, TemplateRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubModal, HubModalRef } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-ref-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex gap-2 align-items-center">
			<button hubButton color="primary" (click)="openAndControl(tpl)">Open and Control</button>
			@if (message) {
				<span class="text-success ms-2">{{ message }}</span>
			}
		</div>

		<!-- Simulated control interface outside the modal -->
		@if (currentRef) {
			<div class="mt-3 p-3 border rounded bg-light">
				<h6>External Control (HubModalRef)</h6>
				<div class="d-flex gap-2">
					<button hubButton color="success" size="sm" (click)="closeExternal()">Ref.close('From outside')</button>
					<button hubButton color="danger" size="sm" (click)="dismissExternal()">Ref.dismiss('Forced')</button>
				</div>
			</div>
		}

		<ng-template #tpl let-d="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">Controlled Modal</h5>
			</div>
			<div class="modal-body">
				<p>This modal can be controlled from the parent component using <code>HubModalRef</code>.</p>
				<p>Wait 3 seconds and it will close automatically...</p>
			</div>
		</ng-template>
	`
})
export class RefModalExampleComponent {
	private modal = inject(HubModal);
	currentRef?: HubModalRef;
	message = '';

	/**
	 * Opens the template as a modal, keeps its reference for external control,
	 * and auto-closes it after a delay.
	 * @param tpl The template reference to render inside the modal.
	 */
	openAndControl(tpl: TemplateRef<any>) {
		this.message = 'Modal opened...';

		// Save reference
		this.currentRef = this.modal.open(tpl);

		// Handle result (Close/Dismiss Promise)
		this.currentRef.result
			.then((res) => {
				this.message = `Closed with: ${res}`;
				this.currentRef = undefined;
			})
			.catch((reason) => {
				this.message = `Dismissed with: ${reason}`;
				this.currentRef = undefined;
			});

		// Example: automatically close after 3s
		setTimeout(() => {
			if (this.currentRef) {
				this.currentRef.close('Auto-Timer');
			}
		}, 5000); // 5s to allow time to play
	}

	/**
	 * Closes the tracked modal from outside its content using the saved reference.
	 */
	closeExternal() {
		this.currentRef?.close('External Button');
	}

	/**
	 * Dismisses the tracked modal from outside its content using the saved reference.
	 */
	dismissExternal() {
		this.currentRef?.dismiss('External Button');
	}

	// ===========================================
	// CODE FOR TABS (STATIC)
	// ===========================================

	static templateCode = `<button (click)="openAndControl(tpl)">Open</button>
<button (click)="currentRef?.close('val')">Close from outside</button>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubModalRef } from 'ng-hub-ui-modal';

@Component({...})
export class RefExampleComponent {
  private modal = inject(HubModal);
  currentRef?: HubModalRef;

  open() {
    this.currentRef = this.modal.open(this.tpl);
    
    // Access result promise
    this.currentRef.result.then(
      result => console.log('Closed', result),
      reason => console.log('Dismissed', reason)
    );
  }

  closeProgrammatically() {
    this.currentRef?.close('Value from parent');
  }
}`;
}
