import { Component, signal, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

export type { ModalData } from './modal.component.model';
import type { ModalData } from './modal.component.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-modal',
	imports: [HubButtonComponent],
	standalone: true,
	template: `
		<div class="portal-backdrop" (click)="dismiss()"></div>
		<div class="modal-content" [class]="'modal-' + data().type">
			<div class="modal-header">
				<h4>{{ data().title }}</h4>
				<button class="close-btn" (click)="dismiss()">×</button>
			</div>
			<div class="modal-body">
				<div [innerHTML]="data().content"></div>
				@if (data().type === 'confirm') {
					<div class="modal-actions">
						<button hubButton color="secondary" (click)="dismiss()">Cancelar</button>
						<button hubButton color="primary" (click)="confirm()">Confirmar</button>
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			:host {
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 1050;
			}

			.portal-backdrop {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.5);
				cursor: pointer;
			}

			.modal-content {
				position: relative;
				background: white;
				border-radius: 0.5rem;
				box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
				width: 90%;
				max-width: 500px;
				animation: modalSlideIn 0.3s ease-out;

				&.modal-fullscreen {
					width: 95vw;
					height: 90vh;
					max-width: none;
				}
			}

			.modal-header {
				padding: 1rem 1.5rem;
				border-bottom: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				display: flex;
				justify-content: space-between;
				align-items: center;

				h4 {
					margin: 0;
					color: var(--hub-sys-text-primary, #212529);
				}

				.close-btn {
					background: none;
					border: none;
					font-size: 1.5em;
					cursor: pointer;
					color: var(--hub-sys-text-muted, #6c757d);
					padding: 0;

					&:hover {
						color: var(--hub-sys-text-secondary, #495057);
					}
				}
			}

			.modal-body {
				padding: 1.5rem;

				p {
					margin-bottom: 1rem;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}

			.modal-actions {
				margin-top: 1.5rem;
				display: flex;
				justify-content: flex-end;
				gap: 0.5rem;
			}

			.btn {
				padding: 0.5rem 1rem;
				border: none;
				border-radius: 0.375rem;
				cursor: pointer;
				font-size: 0.9em;
				font-weight: 500;
				transition: all 0.15s ease;

				&.btn-primary {
					background: #007bff;
					color: white;

					&:hover {
						background: #0056b3;
					}
				}

				&.btn-secondary {
					background: #6c757d;
					color: white;

					&:hover {
						background: #545b62;
					}
				}
			}

			@keyframes modalSlideIn {
				from {
					opacity: 0;
					transform: scale(0.9);
				}
				to {
					opacity: 1;
					transform: scale(1);
				}
			}
		`
	]
})
export class ModalComponent {
	private activePortal = inject(HubActivePortal);

	readonly confirmed = output<void>();

	data = signal<ModalData>({
		type: 'custom',
		title: 'Modal',
		content: 'Content'
	});

	/**
	 * Emits the confirmation event and closes the portal with a "confirmed"
	 * result.
	 */
	confirm() {
		this.confirmed.emit();
		this.activePortal.close('confirmed');
	}

	/**
	 * Dismisses the portal with a "dismissed" reason without confirming.
	 */
	dismiss() {
		this.activePortal.dismiss('dismissed');
	}
}
