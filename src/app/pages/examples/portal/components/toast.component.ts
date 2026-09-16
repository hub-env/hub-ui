import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

export type { ToastData } from './toast.component.model';
import type { ToastData } from './toast.component.model';

@Component({
	selector: 'app-toast',
	standalone: true,
	template: `
		<div class="toast-content" [class]="'toast-' + data().type">
			<div class="toast-icon">{{ getIcon() }}</div>
			<div class="toast-body">
				<div class="toast-title">{{ data().title }}</div>
				<div class="toast-message">{{ data().message }}</div>
			</div>
			<button class="toast-close" (click)="close()">×</button>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.toast-content {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 0.375rem;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				padding: 1rem;
				display: flex;
				align-items: flex-start;
				gap: 0.75rem;
				min-width: 300px;
				animation: toastSlideIn 0.3s ease-out;
				position: relative;
				max-width: 400px;

				&.toast-success {
					border-left: 4px solid #28a745;
				}
				&.toast-warning {
					border-left: 4px solid #ffc107;
				}
				&.toast-error {
					border-left: 4px solid #dc3545;
				}
				&.toast-info {
					border-left: 4px solid #17a2b8;
				}
			}

			.toast-icon {
				font-size: 1.2em;
				flex-shrink: 0;
			}

			.toast-body {
				flex-grow: 1;

				.toast-title {
					font-weight: 600;
					color: var(--hub-sys-text-primary, #212529);
					margin-bottom: 0.25rem;
				}

				.toast-message {
					color: var(--hub-sys-text-muted, #6c757d);
					font-size: 0.9em;
					margin: 0;
				}
			}

			.toast-close {
				background: none;
				border: none;
				cursor: pointer;
				color: var(--hub-sys-text-muted, #6c757d);
				font-size: 1.2em;
				flex-shrink: 0;
				padding: 0;
				width: 20px;
				height: 20px;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover {
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			@keyframes toastSlideIn {
				from {
					opacity: 0;
					transform: translateX(100%);
				}
				to {
					opacity: 1;
					transform: translateX(0);
				}
			}
		`
	]
})
export class ToastComponent implements OnInit {
	private activePortal = inject(HubActivePortal);

	data = signal<ToastData>({
		type: 'info',
		title: 'Toast',
		message: 'Message',
		duration: 5000
	});

	/**
	 * Schedules the toast to auto-dismiss once its configured duration elapses.
	 * A duration of zero or less disables the automatic dismissal.
	 */
	ngOnInit() {
		// Auto-dismiss after duration
		const duration = this.data().duration || 5000;
		if (duration > 0) {
			setTimeout(() => {
				this.close();
			}, duration);
		}
	}

	/**
	 * Resolves the emoji icon that represents the current toast severity.
	 *
	 * @returns The icon matching the toast type, defaulting to the info icon.
	 */
	getIcon(): string {
		const icons = {
			success: '✅',
			warning: '⚠️',
			error: '❌',
			info: 'ℹ️'
		};
		return icons[this.data().type] || 'ℹ️';
	}

	/**
	 * Closes the toast portal.
	 */
	close() {
		this.activePortal.close();
	}
}
