import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HUB_MODAL_DATA, HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/** Strongly-typed payload delivered to the modal content component. */
interface UserCardData {
	name: string;
	role: string;
}

// MODAL CONTENT COMPONENT — reads the typed payload, no monkey-patched `data` field.
@Component({
	selector: 'app-typed-data-modal-content',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="modal-header">
			<h5 class="modal-title">{{ data.name }}</h5>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
		</div>
		<div class="modal-body">
			<p class="mb-2">
				Role: <strong>{{ data.role }}</strong>
			</p>
			<p class="text-muted small mb-0">
				Read via <code>inject(HUB_MODAL_DATA)</code> — fully typed, no instance monkey-patching.
			</p>
		</div>
		<div class="modal-footer">
			<button hubButton variant="outline" color="dark" (click)="activeModal.close()">Done</button>
		</div>
	`
})
export class TypedDataModalContentComponent {
	/** Typed payload — equivalent to `inject(HubActiveModal<UserCardData>).data`. */
	protected readonly data = inject<UserCardData>(HUB_MODAL_DATA);
	protected readonly activeModal = inject(HubActiveModal);
}

// MAIN EXAMPLE COMPONENT
@Component({
	selector: 'app-typed-data-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <button hubButton color="primary" (click)="open()">Open with typed data</button> `
})
export class TypedDataModalExampleComponent {
	private readonly modal = inject(HubModal);

	/** Opens the content component, passing a typed `data` payload. */
	open(): void {
		this.modal.open(TypedDataModalContentComponent, {
			data: { name: 'Ada Lovelace', role: 'Administrator' } as UserCardData
		});
	}

	static readonly templateCode = `<button hubButton color="primary" (click)="open()">Open with typed data</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HUB_MODAL_DATA, HubActiveModal, HubModal } from 'ng-hub-ui-modal';

interface UserCardData { name: string; role: string; }

// Content component — reads the payload TYPED, with no monkey-patched 'data' field:
@Component({
  selector: 'app-user-card-modal',
  standalone: true,
  template: \`
    <div class="modal-header"><h5 class="modal-title">{{ data.name }}</h5></div>
    <div class="modal-body">Role: {{ data.role }}</div>
    <div class="modal-footer"><button (click)="activeModal.close()">Done</button></div>
  \`
})
export class UserCardModal {
  protected readonly data = inject<UserCardData>(HUB_MODAL_DATA);
  // equivalently: inject(HubActiveModal<UserCardData>).data
  protected readonly activeModal = inject(HubActiveModal);
}

// Opening it:
export class Demo {
  private readonly modal = inject(HubModal);
  open() {
    this.modal.open(UserCardModal, { data: { name: 'Ada Lovelace', role: 'Administrator' } });
  }
}`;
}
