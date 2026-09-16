import { Component, signal, inject, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { ToastService } from './services/toast.service';
import { ModalService } from './services/modal.service';
import { DrawerComponent } from './components/drawer.component';
import { BottomSheetComponent } from './components/bottom-sheet.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-service-portal-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div class="demo-section">
			<!-- Service Controls -->
			<div class="service-controls">
				<h5>Gestión Programática de Portales</h5>

				<div class="control-group">
					<h6>Notificaciones Toast</h6>
					<div class="button-group">
						<button hubButton color="success" (click)="showSuccessToast()">✅ Éxito</button>
						<button hubButton color="warning" (click)="showWarningToast()">⚠️ Advertencia</button>
						<button hubButton color="danger" (click)="showErrorToast()">❌ Error</button>
						<button hubButton color="info" (click)="showInfoToast()">ℹ️ Información</button>
					</div>
				</div>

				<div class="control-group">
					<h6>Modales Dinámicos</h6>
					<div class="button-group">
						<button hubButton color="primary" (click)="showConfirmDialog()">🔔 Diálogo de Confirmación</button>
						<button hubButton color="secondary" (click)="showCustomModal()">📋 Modal Personalizado</button>
						<button hubButton color="dark" (click)="showFullscreenModal()">🖥️ Modal Pantalla Completa</button>
					</div>
				</div>

				<div class="control-group">
					<h6>Overlays Complejos</h6>
					<div class="button-group">
						<button hubButton color="primary" (click)="showDrawer()">📄 Drawer Lateral</button>
						<button hubButton color="secondary" (click)="showBottomSheet()">📱 Bottom Sheet</button>
						<button hubButton color="success" (click)="showTooltipPopover()">💬 Tooltip Avanzado</button>
					</div>
				</div>

				<div class="control-group">
					<h6>Gestión Global</h6>
					<div class="button-group">
						<button hubButton color="warning" (click)="showMultiplePortals()">🚀 Múltiples Portales</button>
						<button hubButton color="danger" (click)="closeAllPortals()">🚫 Cerrar Todos</button>
						<button hubButton color="info" (click)="getOpenPortals()">
							📊 Portales Abiertos: {{ openPortalsCount() }}
						</button>
					</div>
				</div>
			</div>

			<!-- Status Display -->
			<div class="status-display">
				<h6>Estado del Sistema de Portales</h6>
				<div class="status-grid">
					<div class="status-item">
						<span class="status-label">Portales Activos:</span>
						<span class="status-value">{{ activePortals().length }}</span>
					</div>
					<div class="status-item">
						<span class="status-label">Último Portal:</span>
						<span class="status-value">{{ lastPortalType() || 'Ninguno' }}</span>
					</div>
					<div class="status-item">
						<span class="status-label">Z-Index Actual:</span>
						<span class="status-value">{{ currentZIndex() }}</span>
					</div>
					<div class="status-item">
						<span class="status-label">Auto-increment ID:</span>
						<span class="status-value">{{ nextPortalId() }}</span>
					</div>
				</div>
			</div>

			<!-- Active Portals List -->
			@if (activePortals().length > 0) {
				<div class="active-portals">
					<h6>Portales Activos</h6>
					<div class="portal-list">
						@for (portal of activePortals(); track $index) {
							<div class="portal-item">
								<div class="portal-info">
									<span class="portal-id">Portal-{{ $index + 1 }}</span>
									<span class="portal-type">{{ getPortalType(portal) }}</span>
									<span class="portal-status">Active</span>
								</div>
								<button class="close-portal-btn" (click)="closePortal(portal)">×</button>
							</div>
						}
					</div>
				</div>
			}
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-section {
				max-width: 1200px;
				margin: 0 auto;
			}

			.service-controls {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				padding: 1.5rem;
				border-radius: 0.375rem;
				margin-bottom: 2rem;

				h5 {
					margin-top: 0;
					margin-bottom: 1.5rem;
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			.control-group {
				margin-bottom: 1.5rem;

				h6 {
					margin-bottom: 0.75rem;
					color: var(--hub-sys-text-muted, #6c757d);
					font-size: 0.9em;
					text-transform: uppercase;
					letter-spacing: 0.5px;
				}
			}

			.button-group {
				display: flex;
				gap: 0.75rem;
				flex-wrap: wrap;
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
				&.btn-success {
					background: #28a745;
					color: white;
					&:hover {
						background: #1e7e34;
					}
				}
				&.btn-warning {
					background: #ffc107;
					color: var(--hub-sys-text-primary, #212529);
					&:hover {
						background: #e0a800;
					}
				}
				&.btn-danger {
					background: #dc3545;
					color: white;
					&:hover {
						background: #c82333;
					}
				}
				&.btn-info {
					background: #17a2b8;
					color: white;
					&:hover {
						background: #117a8b;
					}
				}
				&.btn-dark {
					background: #343a40;
					color: white;
					&:hover {
						background: #23272b;
					}
				}
			}

			.status-display {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 0.375rem;
				padding: 1.5rem;
				margin-bottom: 2rem;

				h6 {
					margin-top: 0;
					margin-bottom: 1rem;
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			.status-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
				gap: 1rem;
			}

			.status-item {
				display: flex;
				justify-content: space-between;
				padding: 0.5rem;
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				border-radius: 0.25rem;

				.status-label {
					color: var(--hub-sys-text-muted, #6c757d);
					font-size: 0.9em;
				}

				.status-value {
					font-weight: 600;
					color: #007bff;
				}
			}

			.active-portals {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 0.375rem;
				padding: 1.5rem;
				margin-bottom: 2rem;

				h6 {
					margin-top: 0;
					margin-bottom: 1rem;
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			.portal-list {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.portal-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.75rem;
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				border-radius: 0.25rem;

				.portal-info {
					display: flex;
					gap: 1rem;

					.portal-id {
						font-family: monospace;
						color: #007bff;
						font-weight: 600;
					}

					.portal-type {
						color: var(--hub-sys-text-muted, #6c757d);
						font-size: 0.9em;
					}

					.portal-status {
						color: #28a745;
						font-size: 0.8em;
						text-transform: uppercase;
					}
				}

				.close-portal-btn {
					background: #dc3545;
					color: white;
					border: none;
					width: 24px;
					height: 24px;
					border-radius: 50%;
					cursor: pointer;
					font-size: 0.9em;

					&:hover {
						background: #c82333;
					}
				}
			}
		`
	]
})
export class ServicePortalExampleComponent implements OnDestroy {
	private destroy$ = new Subject<void>();
	private portal = inject(HubPortal);
	private toastService = inject(ToastService);
	private modalService = inject(ModalService);

	// Portal management
	activePortals = signal<HubPortalRef[]>([]);
	openPortalsCount = signal(0);
	lastPortalType = signal('');
	currentZIndex = signal(1000);
	nextPortalId = signal(1);

	/**
	 * Subscribes to the portal service active-instances stream to mirror the
	 * list and count of open portals into local signals.
	 */
	constructor() {
		// Subscribe to portal changes
		this.portal.activeInstances.pipe(takeUntil(this.destroy$)).subscribe((instances) => {
			this.activePortals.set(instances);
			this.openPortalsCount.set(instances.length);
		});
	}

	/**
	 * Completes the teardown subject to release the active-instances
	 * subscription.
	 */
	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Displays a success toast and updates the portal statistics.
	 */
	showSuccessToast() {
		const portalRef = this.toastService.success('¡Éxito!', 'Operación completada correctamente');
		this.updatePortalStats('toast');

		// Set toast data
		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'success',
				title: '¡Éxito!',
				message: 'Operación completada correctamente',
				duration: 5000
			});
		}
	}

	/**
	 * Displays a warning toast and updates the portal statistics.
	 */
	showWarningToast() {
		const portalRef = this.toastService.warning('Advertencia', 'Ten cuidado con esta acción');
		this.updatePortalStats('toast');

		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'warning',
				title: 'Advertencia',
				message: 'Ten cuidado con esta acción',
				duration: 5000
			});
		}
	}

	/**
	 * Displays an error toast and updates the portal statistics.
	 */
	showErrorToast() {
		const portalRef = this.toastService.error('Error', 'Algo salió mal, por favor intenta de nuevo');
		this.updatePortalStats('toast');

		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'error',
				title: 'Error',
				message: 'Algo salió mal, por favor intenta de nuevo',
				duration: 5000
			});
		}
	}

	/**
	 * Displays an informational toast and updates the portal statistics.
	 */
	showInfoToast() {
		const portalRef = this.toastService.info('Información', 'Aquí tienes información importante');
		this.updatePortalStats('toast');

		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'info',
				title: 'Información',
				message: 'Aquí tienes información importante',
				duration: 5000
			});
		}
	}

	/**
	 * Opens a confirmation modal and reacts to its resolution by surfacing a
	 * success toast when confirmed.
	 */
	showConfirmDialog() {
		this.modalService
			.openConfirmDialog(
				'Confirmar Acción',
				'¿Estás seguro de que deseas continuar con esta acción? Esta operación no se puede deshacer.'
			)
			.then((result) => {
				console.log('Confirmation result:', result);
				if (result === 'confirmed') {
					this.toastService.success('Confirmado', 'La acción se ha ejecutado correctamente');
				}
			})
			.catch((reason) => {
				console.log('Dialog dismissed:', reason);
			});

		this.updatePortalStats('modal');
	}

	/**
	 * Opens a custom-content modal and seeds its data payload.
	 */
	showCustomModal() {
		const portalRef = this.modalService.openCustomModal(
			'Modal Personalizado',
			`
        <p>Este es un modal creado programáticamente usando el servicio de portales.</p>
        <ul>
          <li>Contenido dinámico</li>
          <li>Configuración flexible</li>
          <li>Gestión automática del ciclo de vida</li>
        </ul>
      `
		);

		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'custom',
				title: 'Modal Personalizado',
				content: `
          <p>Este es un modal creado programáticamente usando el servicio de portales.</p>
          <ul>
            <li>Contenido dinámico</li>
            <li>Configuración flexible</li>
            <li>Gestión automática del ciclo de vida</li>
          </ul>
        `
			});
		}

		this.updatePortalStats('modal');
	}

	/**
	 * Opens a fullscreen modal and seeds its data payload.
	 */
	showFullscreenModal() {
		const portalRef = this.modalService.openFullscreenModal(
			'Modal Pantalla Completa',
			`
        <h5>Vista de Pantalla Completa</h5>
        <p>Este modal ocupa casi toda la pantalla, ideal para formularios complejos o vistas detalladas.</p>
        <p>Perfecto para:</p>
        <ul>
          <li>Editores de contenido</li>
          <li>Formularios largos</li>
          <li>Galerías de imágenes</li>
          <li>Dashboards temporales</li>
        </ul>
      `
		);

		if (portalRef.componentInstance) {
			portalRef.componentInstance.data.set({
				type: 'fullscreen',
				title: 'Modal Pantalla Completa',
				content: `
          <h5>Vista de Pantalla Completa</h5>
          <p>Este modal ocupa casi toda la pantalla, ideal para formularios complejos o vistas detalladas.</p>
          <p>Perfecto para:</p>
          <ul>
            <li>Editores de contenido</li>
            <li>Formularios largos</li>
            <li>Galerías de imágenes</li>
            <li>Dashboards temporales</li>
          </ul>
        `
			});
		}

		this.updatePortalStats('modal');
	}

	/**
	 * Opens a side drawer portal and reports the user's selection through a toast.
	 */
	showDrawer() {
		const portalRef = this.portal.open(DrawerComponent, {
			windowClass: 'drawer-portal'
		});

		portalRef.result
			.then((result) => {
				if (result) {
					console.log('Drawer selection:', result);
					this.toastService.info('Selección', `Seleccionaste: ${result}`);
				}
			})
			.catch((reason) => {
				console.log('Drawer dismissed:', reason);
			});

		this.updatePortalStats('drawer');
	}

	/**
	 * Opens a bottom sheet portal and reports the user's selection through a toast.
	 */
	showBottomSheet() {
		const portalRef = this.portal.open(BottomSheetComponent, {
			windowClass: 'bottom-sheet-portal'
		});

		portalRef.result
			.then((result) => {
				if (result) {
					console.log('Bottom sheet option:', result);
					this.toastService.info('Acción', `Seleccionaste: ${result}`);
				}
			})
			.catch((reason) => {
				console.log('Bottom sheet dismissed:', reason);
			});

		this.updatePortalStats('bottom-sheet');
	}

	/**
	 * Demonstrates an advanced tooltip by surfacing an informational toast.
	 */
	showTooltipPopover() {
		this.toastService.info('Tooltip Avanzado', 'Este sería un tooltip con contenido rico y posicionamiento inteligente');
	}

	/**
	 * Opens several portals in sequence to demonstrate concurrent portal
	 * management.
	 */
	showMultiplePortals() {
		this.showSuccessToast();
		setTimeout(() => this.showWarningToast(), 200);
		setTimeout(() => this.showCustomModal(), 400);
		setTimeout(() => this.showDrawer(), 600);
	}

	/**
	 * Dismisses every open portal, clears tracked toasts and confirms the
	 * cleanup with a short delayed toast.
	 */
	closeAllPortals() {
		this.portal.dismissAll('user_close_all');
		this.toastService.clear();

		// Show confirmation after a brief delay
		setTimeout(() => {
			this.toastService.info('Limpieza', 'Todos los portales han sido cerrados');
		}, 100);
	}

	/**
	 * Returns the number of currently open portals, or zero when none are open.
	 *
	 * @returns The count of open portals.
	 */
	getOpenPortals() {
		return this.portal.hasOpenPortals() ? this.activePortals().length : 0;
	}

	/**
	 * Dismisses a single portal individually.
	 *
	 * @param portalRef - The reference to the portal to dismiss.
	 */
	closePortal(portalRef: HubPortalRef) {
		portalRef.dismiss('user_close_individual');
	}

	/**
	 * Updates the displayed portal statistics after a new portal is opened.
	 *
	 * @param type - The kind of portal that was just opened.
	 */
	private updatePortalStats(type: string) {
		this.lastPortalType.set(type);
		this.currentZIndex.update((z) => z + 1);
		this.nextPortalId.update((id) => id + 1);
	}

	/**
	 * Resolves a human-readable label describing the component rendered by a
	 * portal.
	 *
	 * @param portalRef - The reference to the portal to inspect.
	 * @returns A friendly portal type label.
	 */
	getPortalType(portalRef: HubPortalRef): string {
		if (!portalRef.componentInstance) {
			return 'Unknown';
		}

		const componentName = portalRef.componentInstance.constructor.name;
		switch (componentName) {
			case 'ToastComponent':
				return 'Toast';
			case 'ModalComponent':
				return 'Modal';
			case 'DrawerComponent':
				return 'Drawer';
			case 'BottomSheetComponent':
				return 'Bottom Sheet';
			default:
				return 'Component';
		}
	}

	static readonly templateCode = `<button (click)="openModal()">Open Modal</button>
<button (click)="showToast()">Show Toast</button>
<button (click)="showDrawer()">Show Drawer</button>
<button (click)="closeAll()">Close All</button>`;

	static readonly componentCode = `import { Component, inject, OnDestroy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { ToastService } from './services/toast.service';
import { ModalService } from './services/modal.service';
import { DrawerComponent } from './components/drawer.component';

@Component({
  selector: 'app-portal-demo',
  standalone: true,
  template: \`
    <button (click)="openModal()">Open Modal</button>
    <button (click)="showToast()">Show Toast</button>
    <button (click)="showDrawer()">Show Drawer</button>
    <button (click)="closeAll()">Close All</button>
  \`
})
export class PortalDemoComponent {
  private portal = inject(HubPortal);
  private toastService = inject(ToastService);
  private modalService = inject(ModalService);

  openModal() {
    this.modalService.openConfirmDialog(
      'Confirm Action',
      'Are you sure you want to proceed?'
    ).then(result => {
      if (result === 'confirmed') {
        this.toastService.success('Success!', 'Action confirmed');
      }
    });
  }

  showToast() {
    this.toastService.success('Success!', 'Operation completed');
  }

  showDrawer() {
    const portalRef = this.portal.open(DrawerComponent);
    portalRef.result.then(selection => {
      console.log('Drawer selection:', selection);
    });
  }

  closeAll() {
    this.portal.dismissAll();
    this.toastService.clear();
  }
}`;
}
