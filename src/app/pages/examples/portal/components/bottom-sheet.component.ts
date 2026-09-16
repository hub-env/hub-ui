import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

@Component({
	selector: 'app-bottom-sheet',
	standalone: true,
	template: `
		<div class="bottom-sheet-backdrop" (click)="close()"></div>
		<div class="bottom-sheet-content">
			<div class="bottom-sheet-handle"></div>
			<div class="bottom-sheet-header">
				<h5>Bottom Sheet</h5>
			</div>
			<div class="bottom-sheet-body">
				<div class="sheet-option" (click)="selectOption('call')">📞 Llamar</div>
				<div class="sheet-option" (click)="selectOption('email')">📧 Enviar Email</div>
				<div class="sheet-option" (click)="selectOption('message')">💬 Mensaje</div>
				<div class="sheet-option" (click)="selectOption('location')">📍 Ubicación</div>
				<div class="sheet-option sheet-option--danger" (click)="selectOption('delete')">🗑️ Eliminar</div>
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
				z-index: 1050;
			}

			.bottom-sheet-backdrop {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.3);
				cursor: pointer;
			}

			.bottom-sheet-content {
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				background: white;
				border-radius: 1rem 1rem 0 0;
				box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
				animation: bottomSheetSlideIn 0.3s ease-out;

				.bottom-sheet-handle {
					width: 40px;
					height: 4px;
					background: #dee2e6;
					border-radius: 2px;
					margin: 0.75rem auto;
				}

				.bottom-sheet-header {
					padding: 0 1.5rem 1rem;

					h5 {
						margin: 0;
						color: var(--hub-sys-text-primary, #212529);
						text-align: center;
					}
				}

				.bottom-sheet-body {
					padding: 0 0 1.5rem;

					.sheet-option {
						padding: 1rem 1.5rem;
						border-top: 1px solid #f1f1f1;
						cursor: pointer;
						transition: background 0.15s ease;

						&:hover {
							background: var(--hub-sys-surface-elevated, #f8f9fa);
						}

						&--danger {
							color: #dc3545;
						}
					}
				}
			}

			@keyframes bottomSheetSlideIn {
				from {
					transform: translateY(100%);
				}
				to {
					transform: translateY(0);
				}
			}
		`
	]
})
export class BottomSheetComponent {
	private activePortal = inject(HubActivePortal);

	/**
	 * Closes the bottom sheet portal, resolving it with the chosen option.
	 *
	 * @param option The option selected by the user.
	 */
	selectOption(option: string) {
		console.log('Selected option:', option);
		// In a real app, you might perform different actions based on the option
		this.activePortal.close(option);
	}

	/**
	 * Dismisses the bottom sheet portal without selecting an option.
	 */
	close() {
		this.activePortal.dismiss();
	}
}
