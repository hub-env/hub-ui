import { Component, TemplateRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

// Simple Component to demonstrate opening
@Component({
	selector: 'app-simple-modal-content',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="modal-header">
			<h5 class="modal-title">I am a Component</h5>
			<button class="btn-close" (click)="activeModal.dismiss()"></button>
		</div>
		<div class="modal-body">
			<p>I was passed as <code>Type&lt;any&gt;</code> to the <code>open()</code> method.</p>
		</div>
		<div class="modal-footer">
			<button hubButton color="primary" (click)="activeModal.close()">OK</button>
		</div>
	`
})
export class SimpleModalContent {
	activeModal = inject(HubActiveModal);
}

@Component({
	selector: 'app-content-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3">
			<p class="mb-0">The <code>open()</code> method accepts various content types:</p>

			<div class="d-flex gap-2 flex-wrap">
				<!-- 1. TemplateRef -->
				<button hubButton color="primary" (click)="openTemplate(tpl)">
					<i class="bi bi-code-slash me-2"></i>TemplateRef
				</button>

				<!-- 2. Component -->
				<button hubButton variant="outline" color="primary" (click)="openComponent()">
					<i class="bi bi-box me-2"></i>Component Class
				</button>

				<!-- 3. String -->
				<button hubButton variant="outline" color="secondary" (click)="openString()">
					<i class="bi bi-fonts me-2"></i>String (Text)
				</button>
			</div>

			@if (message) {
				<div class="alert alert-info py-2">
					<small>{{ message }}</small>
				</div>
			}
		</div>

		<!-- Template Definition -->
		<ng-template #tpl let-c="close" let-d="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">I am a Template</h5>
				<button class="btn-close" (click)="d('cross')"></button>
			</div>
			<div class="modal-body">
				<p>I was passed as a <code>TemplateRef</code>.</p>
			</div>
			<div class="modal-footer">
				<button hubButton color="primary" (click)="c('ok')">OK</button>
			</div>
		</ng-template>
	`
})
export class ContentModalExampleComponent {
	private modal = inject(HubModal);
	message = '';

	/**
	 * Opens a modal whose content is provided as a template reference.
	 * @param tpl The template reference to render inside the modal.
	 */
	openTemplate(tpl: TemplateRef<any>) {
		this.modal.open(tpl, { size: 'sm' }).result.then(
			() => (this.message = 'Template Closed'),
			() => (this.message = 'Template Dismissed')
		);
	}

	/**
	 * Opens a modal whose content is provided as a component.
	 */
	openComponent() {
		this.modal.open(SimpleModalContent).result.then(
			() => (this.message = 'Component Closed'),
			() => (this.message = 'Component Dismissed')
		);
	}

	/**
	 * Opens a modal whose content is provided as a plain string.
	 */
	openString() {
		// Note: The string is rendered as is. For complex HTML use Component or Template.
		this.modal.open('Hello World (Simple text)', { size: 'sm' }).result.catch(() => {});
		this.message = 'String Opened';
	}

	// ===========================================
	// CODE FOR TABS (STATIC)
	// ===========================================

	static templateCode = `<!-- Buttons -->
<button (click)="openTemplate(tpl)">TemplateRef</button>
<button (click)="openComponent()">Component Type</button>
<button (click)="openString()">String</button>

<!-- Template Definition -->
<ng-template #tpl let-modal>
  <div class="modal-body">From Template</div>
</ng-template>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

// Simple Component Definition
@Component({
  template: \`
    <div class="modal-body">From Component</div>
    <button (click)="activeModal.close()">Close</button>
  \`
})
export class SimpleContent {
  activeModal = inject(HubActiveModal);
}

@Component({ ... })
export class ExampleComponent {
  private modal = inject(HubModal);

  openTemplate(tpl: TemplateRef<any>) {
    this.modal.open(tpl);
  }

  openComponent() {
    this.modal.open(SimpleContent);
  }

  openString() {
    this.modal.open('Just some text');
  }
}`;
}
