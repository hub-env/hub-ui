import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

// SECOND MODAL
@Component({
	selector: 'app-stack-two',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="modal-header">
			<h5 class="modal-title">Second Modal</h5>
		</div>
		<div class="modal-body">
			<p>I am the second modal in the stack.</p>
		</div>
		<div class="modal-footer">
			<button hubButton color="primary" (click)="activeModal.close()">Close All</button>
		</div>
	`
})
export class StackTwoComponent {
	activeModal = inject(HubActiveModal);
}

// FIRST MODAL
@Component({
	selector: 'app-stack-one',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="modal-header">
			<h5 class="modal-title">First Modal</h5>
		</div>
		<div class="modal-body">
			<p>I am the first modal. You can open another one from here.</p>
			<button hubButton color="warning" (click)="openSecond()">Open Second Modal</button>
		</div>
		<div class="modal-footer">
			<button hubButton color="secondary" (click)="activeModal.close()">Close</button>
		</div>
	`
})
export class StackOneComponent {
	activeModal = inject(HubActiveModal);
	private modalService = inject(HubModal);

	/**
	 * Opens a second modal on top of the current one in the stack.
	 */
	openSecond() {
		this.modalService.open(StackTwoComponent, { size: 'sm' });
	}
}

// MAIN EXAMPLE
@Component({
	selector: 'app-stack-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<p>HubModal supports multiple stacked modals. The last modal has focus.</p>
		<button hubButton color="primary" (click)="openFirst()">Open Modal Stack</button>
	`
})
export class StackModalExampleComponent {
	private modal = inject(HubModal);

	/**
	 * Opens the first modal of the stack demonstration.
	 */
	openFirst() {
		this.modal.open(StackOneComponent);
	}

	// ===========================================
	// CODE FOR TABS (STATIC)
	// ===========================================

	static templateCode = `<button (click)="openFirst()">Open Stack</button>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

@Component({
  template: \`
    <p>First modal</p>
    <button (click)="openSecond()">Open Second</button>
  \`
})
class FirstModal {
  modal = inject(HubModal);
  openSecond() {
    this.modal.open(SecondModal);
  }
}

@Component({ ... })
export class StackExample {
  modal = inject(HubModal);
  openFirst() {
    this.modal.open(FirstModal);
  }
}`;
}
