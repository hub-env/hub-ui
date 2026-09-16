import { Component, TemplateRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-options-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex gap-2 flex-wrap flex-column align-items-start">
			<div class="d-flex gap-2 align-items-center">
				<strong style="min-width: 120px">Sizes:</strong>
				<button hubButton variant="outline" color="secondary" size="sm" (click)="openSize(tpl, 'sm')">
					Small ('sm')
				</button>
				<button hubButton variant="outline" color="secondary" size="sm" (click)="openSize(tpl, 'lg')">
					Large ('lg')
				</button>
				<button hubButton variant="outline" color="secondary" size="sm" (click)="openSize(tpl, 'xl')">
					Extra Large ('xl')
				</button>
			</div>

			<div class="d-flex gap-2 align-items-center">
				<strong style="min-width: 120px">Position:</strong>
				<button hubButton variant="outline" color="info" size="sm" (click)="openCentered(tpl)">
					Vertically Centered
				</button>
			</div>

			<div class="d-flex gap-2 align-items-center">
				<strong style="min-width: 120px">Behavior:</strong>
				<button hubButton variant="outline" color="warning" size="sm" (click)="openStatic(tpl)">Static Backdrop</button>
				<button hubButton variant="outline" color="danger" size="sm" (click)="openNoKeyboard(tpl)">
					No Keyboard (Mask ESC)
				</button>
			</div>

			<div class="d-flex gap-2 align-items-center">
				<strong style="min-width: 120px">Content:</strong>
				<button hubButton variant="outline" color="primary" size="sm" (click)="openScrollable(longTpl)">
					Scrollable
				</button>
			</div>
		</div>

		<ng-template #tpl let-d="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">Configured Modal</h5>
			</div>
			<div class="modal-body">
				<p>This modal was opened with a specific configuration.</p>
			</div>
			<div class="modal-footer">
				<button hubButton color="secondary" (click)="d('cross')">Close</button>
			</div>
		</ng-template>

		<ng-template #longTpl let-d="dismiss">
			<div class="modal-header"><h5 class="modal-title">Long Content</h5></div>
			<div class="modal-body">
				@for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; track i) {
					<p>Content line {{ i }} to demonstrate scroll...</p>
				}
			</div>
			<div class="modal-footer"><button hubButton color="secondary" (click)="d()">Close</button></div>
		</ng-template>
	`
})
export class OptionsModalExampleComponent {
	private modal = inject(HubModal);

	/**
	 * Opens the template as a modal with the given size.
	 * @param tpl The template reference to render inside the modal.
	 * @param size The modal size to apply.
	 */
	openSize(tpl: TemplateRef<any>, size: 'sm' | 'lg' | 'xl') {
		this.modal.open(tpl, { size }).result.catch(() => {});
	}

	/**
	 * Opens the template as a vertically centered modal.
	 * @param tpl The template reference to render inside the modal.
	 */
	openCentered(tpl: TemplateRef<any>) {
		this.modal.open(tpl, { centered: true }).result.catch(() => {});
	}

	/**
	 * Opens the template as a modal with a static backdrop.
	 * @param tpl The template reference to render inside the modal.
	 */
	openStatic(tpl: TemplateRef<any>) {
		this.modal.open(tpl, { backdrop: 'static' }).result.catch(() => {});
	}

	/**
	 * Opens the template as a modal that cannot be dismissed with the keyboard.
	 * @param tpl The template reference to render inside the modal.
	 */
	openNoKeyboard(tpl: TemplateRef<any>) {
		this.modal.open(tpl, { keyboard: false }).result.catch(() => {});
	}

	/**
	 * Opens the template as a scrollable modal.
	 * @param tpl The template reference to render inside the modal.
	 */
	openScrollable(tpl: TemplateRef<any>) {
		this.modal.open(tpl, { scrollable: true }).result.catch(() => {});
	}

	// ===========================================
	// CODE FOR TABS (STATIC)
	// ===========================================

	static templateCode = `<!-- Example buttons -->
<button (click)="openSize(tpl, 'lg')">Large</button>
<button (click)="openStatic(tpl)">Static Backdrop</button>
<button (click)="openCentered(tpl)">Centered</button>

<!-- Template -->
<ng-template #tpl let-d="dismiss">...</ng-template>`;

	static componentCode = `import { Component, TemplateRef, inject } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';

@Component({
  selector: 'app-options-modal-example',
  standalone: true,
  template: \`<!-- see HTML for buttons -->\`
})
export class OptionsModalExampleComponent {
  private modal = inject(HubModal);

  openSize(tpl: TemplateRef<any>, size: string) {
    this.modal.open(tpl, { size });
  }

  openCentered(tpl: TemplateRef<any>) {
    this.modal.open(tpl, { centered: true });
  }

  openStatic(tpl: TemplateRef<any>) {
    this.modal.open(tpl, { backdrop: 'static' });
  }
}`;
}
