import { Component, inject, signal, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-basic-portal-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-section">
				<!-- Controls -->
				<div class="controls-card">
					<h5>Portal Controls</h5>
					<div class="control-actions">
						<button hubButton color="primary" (click)="toggleModal()">
							{{ isModalOpen() ? 'Close' : 'Open' }} Modal
						</button>

						<button hubButton color="secondary" (click)="toggleTooltip($event)">
							{{ isTooltipOpen() ? 'Hide' : 'Show' }} Tooltip (Connected)
						</button>

						<button hubButton color="success" (click)="toggleNotification()">
							{{ isNotificationOpen() ? 'Hide' : 'Show' }} Notification
						</button>
					</div>
				</div>

				<!-- Target Containers (for visualization only, usually hidden/structural) -->
				<div class="info-box">
					<p class="text-muted small">
						Content is rendered dynamically into the DOM (typically <code>body</code>) using the
						<code>HubPortal</code> service, completely detaching it from this component's DOM hierarchy while
						preserving Angular context.
					</p>
				</div>

				<!-- Templates (Rendered via Portal) -->
				<ng-template #modalTemplate>
					<div class="portal-card modal-theme">
						<div class="portal-header">
							<h6>Portal Modal</h6>
							<button class="icon-btn" (click)="closeModal()">×</button>
						</div>
						<div class="portal-body">
							<p>This content is rendered directly into the <code>body</code> tag.</p>
							<p>It sits on top of everything else.</p>
						</div>
						<div class="portal-footer">
							<button hubButton color="secondary" size="sm" (click)="closeModal()">Close</button>
							<button hubButton color="primary" size="sm" (click)="closeModal()">Confirm</button>
						</div>
					</div>
				</ng-template>

				<ng-template #tooltipTemplate>
					<div class="portal-card tooltip-theme">
						<div class="tooltip-content">
							<strong>Connected Portal</strong><br />
							<span>Aligned to the trigger button.</span>
						</div>
						<div class="tooltip-arrow"></div>
					</div>
				</ng-template>

				<ng-template #notificationTemplate>
					<div class="portal-card notification-theme">
						<div class="notification-content">
							<span class="icon">🔔</span>
							<div class="text">
								<strong>New Notification</strong>
								<span>Portal system is active!</span>
							</div>
							<button class="icon-btn" (click)="closeNotification()">×</button>
						</div>
					</div>
				</ng-template>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-section {
				padding: 1rem;
			}

			.controls-card {
				background: var(--hub-sys-surface-page, #fff);
				border: 1px solid #e2e8f0;
				border-radius: 8px;
				padding: 1.5rem;
				margin-bottom: 1.5rem;

				h5 {
					margin: 0 0 1rem 0;
					font-size: 1.1rem;
					color: #1e293b;
				}
			}

			.control-actions {
				display: flex;
				flex-wrap: wrap;
				gap: 1rem;
			}

			.info-box {
				margin-top: 1rem;
				padding: 1rem;
				background: #f8fafc;
				border-radius: 6px;
				border-left: 4px solid #3b82f6;
			}

			.btn {
				padding: 0.5rem 1rem;
				border-radius: 6px;
				font-weight: 500;
				border: none;
				cursor: pointer;
				transition: all 0.2s;

				&.btn-primary {
					background: #3b82f6;
					color: white;
					&:hover {
						background: #2563eb;
					}
				}
				&.btn-secondary {
					background: #64748b;
					color: white;
					&:hover {
						background: #475569;
					}
				}
				&.btn-success {
					background: #22c55e;
					color: white;
					&:hover {
						background: #16a34a;
					}
				}
				&.btn-sm {
					padding: 0.25rem 0.5rem;
					font-size: 0.875rem;
				}
			}

			.icon-btn {
				background: none;
				border: none;
				font-size: 1.25rem;
				line-height: 1;
				cursor: pointer;
				color: #94a3b8;
				&:hover {
					color: #64748b;
				}
			}

			/* Portal Theme Styles */
			:host ::ng-deep {
				.portal-card {
					background: white;
					border-radius: 8px;
					box-shadow:
						0 10px 15px -3px rgba(0, 0, 0, 0.1),
						0 4px 6px -2px rgba(0, 0, 0, 0.05);
					overflow: hidden;
					animation: fadeIn 0.2s ease-out;

					&.modal-theme {
						width: 90vw;
						max-width: 500px;
						border: 1px solid #e2e8f0;

						.portal-header {
							padding: 1rem;
							border-bottom: 1px solid #f1f5f9;
							display: flex;
							justify-content: space-between;
							align-items: center;
							h6 {
								margin: 0;
								font-size: 1.1rem;
							}
						}
						.portal-body {
							padding: 1.5rem;
						}
						.portal-footer {
							padding: 1rem;
							background: #f8fafc;
							border-top: 1px solid #f1f5f9;
							display: flex;
							justify-content: flex-end;
							gap: 0.5rem;
						}
					}

					&.tooltip-theme {
						background: #1e293b;
						color: white;
						padding: 0.5rem 0.75rem;
						font-size: 0.875rem;
						max-width: 200px;
						position: relative;

						.tooltip-arrow {
							position: absolute;
							top: -4px;
							left: 50%;
							transform: translateX(-50%);
							border-left: 4px solid transparent;
							border-right: 4px solid transparent;
							border-bottom: 4px solid #1e293b;
						}
					}

					&.notification-theme {
						width: 300px;
						border-left: 4px solid #22c55e;

						.notification-content {
							padding: 1rem;
							display: flex;
							gap: 0.75rem;
							align-items: flex-start;

							.icon {
								font-size: 1.25rem;
							}
							.text {
								flex: 1;
								display: flex;
								flex-direction: column;
								font-size: 0.875rem;
							}
						}
					}
				}

				/* Backdrop styles specifically for this demo */
				.cdk-overlay-backdrop {
					background: rgba(15, 23, 42, 0.4);
					backdrop-filter: blur(2px);
				}
			}

			@keyframes fadeIn {
				from {
					opacity: 0;
					transform: scale(0.95);
				}
				to {
					opacity: 1;
					transform: scale(1);
				}
			}
		`
	]
})
export class BasicPortalExampleComponent {
	private _portal = inject(HubPortal);

	// View Children
	public modalTpl = viewChild.required<TemplateRef<any>>('modalTemplate');
	public tooltipTpl = viewChild.required<TemplateRef<any>>('tooltipTemplate');
	public notificationTpl = viewChild.required<TemplateRef<any>>('notificationTemplate');

	// State Signals
	isModalOpen = signal(false);
	isTooltipOpen = signal(false);
	isNotificationOpen = signal(false);

	// References
	private _modalRef: HubPortalRef | null = null;
	private _tooltipRef: HubPortalRef | null = null;
	private _notificationRef: HubPortalRef | null = null;

	/**
	 * Toggles the modal portal, opening it when closed and closing it when open.
	 */
	toggleModal() {
		if (this.isModalOpen()) {
			this.closeModal();
		} else {
			this.openModal();
		}
	}

	/**
	 * Opens the modal portal and subscribes to its close event to keep the
	 * local open state in sync.
	 */
	openModal() {
		this._modalRef = this._portal.open(this.modalTpl(), {
			// CSS class handles backdrop and positioning
			windowClass: 'modal-portal-backdrop',
			animation: true
		});

		this.isModalOpen.set(true);

		// Use .closed observable
		this._modalRef.closed.subscribe(() => {
			this.isModalOpen.set(false);
			this._modalRef = null;
		});
	}

	/**
	 * Closes the modal portal if it is currently open.
	 */
	closeModal() {
		this._modalRef?.close();
	}

	/**
	 * Toggles the tooltip portal, opening it when closed and closing it when open.
	 *
	 * @param _event The mouse event that triggered the toggle.
	 */
	toggleTooltip(_event: MouseEvent) {
		if (this.isTooltipOpen()) {
			this.closeTooltip();
		} else {
			this.openTooltip();
		}
	}

	/**
	 * Opens the tooltip portal and subscribes to its close event to keep the
	 * local open state in sync.
	 */
	openTooltip() {
		// Centered tooltip for basic demo
		this._tooltipRef = this._portal.open(this.tooltipTpl(), {
			windowClass: 'tooltip-portal-position',
			animation: true
		});

		this.isTooltipOpen.set(true);
		this._tooltipRef.closed.subscribe(() => {
			this.isTooltipOpen.set(false);
			this._tooltipRef = null;
		});
	}

	/**
	 * Closes the tooltip portal if it is currently open.
	 */
	closeTooltip() {
		this._tooltipRef?.close();
	}

	/**
	 * Toggles the notification portal, opening it when closed and closing it
	 * when open.
	 */
	toggleNotification() {
		if (this.isNotificationOpen()) {
			this.closeNotification();
		} else {
			this.openNotification();
		}
	}

	/**
	 * Opens the notification portal and subscribes to its close event to keep
	 * the local open state in sync.
	 */
	openNotification() {
		this._notificationRef = this._portal.open(this.notificationTpl(), {
			windowClass: 'notification-portal-position',
			animation: true
		});

		this.isNotificationOpen.set(true);
		this._notificationRef.closed.subscribe(() => {
			this.isNotificationOpen.set(false);
			this._notificationRef = null;
		});
	}

	/**
	 * Closes the notification portal if it is currently open.
	 */
	closeNotification() {
		this._notificationRef?.close();
	}

	// =====================================
	// STATIC CODE FOR EXAMPLE VIEWER
	// =====================================

	static readonly templateCode = `<ng-template #modalTemplate>
  <div class="portal-card modal-theme">
    <div class="portal-header">
      <h6>Portal Modal</h6>
      <button (click)="closeModal()">×</button>
    </div>
    <div class="portal-body">
      <p>Rendered directly into body.</p>
    </div>
  </div>
</ng-template>

<button (click)="toggleModal()">Toggle Modal</button>`;

	static readonly componentCode = `import { Component, inject, viewChild, TemplateRef, signal } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';

@Component({...})
export class BasicPortalExample {
  private _portal = inject(HubPortal);
  public modalTpl = viewChild.required<TemplateRef<any>>('modalTemplate');
  
  isModalOpen = signal(false);
  private _modalRef: HubPortalRef | null = null;

  openModal() {
    this._modalRef = this._portal.open(this.modalTpl(), {
      windowClass: 'modal-portal-backdrop', // CSS handles position
      animation: true
    });
    
    this.isModalOpen.set(true);
    this._modalRef.closed.subscribe(() => 
      this.isModalOpen.set(false)
    );
  }

  closeModal() {
    this._modalRef?.close();
  }
}`;

	static readonly cssCode = `/* Global Portal Styles */
:host ::ng-deep {
  /* Modal Backdrop & Centering */
  .modal-portal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }

  /* Notification Positioning */
  .notification-portal-position {
    position: fixed;
    top: 20px; 
    right: 20px;
    z-index: 1100;
  }

  /* Tooltip Positioning (Centered for demo) */
  .tooltip-portal-position {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1060;
  }
}`;
}
