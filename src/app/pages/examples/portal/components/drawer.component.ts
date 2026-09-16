import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal } from 'ng-hub-ui-portal';

@Component({
	selector: 'app-drawer',
	standalone: true,
	template: `
		<div class="drawer-backdrop" (click)="close()"></div>
		<div class="drawer-content">
			<div class="drawer-header">
				<h5>Drawer Lateral</h5>
				<button class="close-btn" (click)="close()">×</button>
			</div>
			<div class="drawer-body">
				<div class="drawer-section">
					<h6>Navegación</h6>
					<div class="drawer-item" (click)="selectItem('Dashboard')">📊 Dashboard</div>
					<div class="drawer-item" (click)="selectItem('Usuarios')">👥 Usuarios</div>
					<div class="drawer-item" (click)="selectItem('Configuración')">⚙️ Configuración</div>
				</div>
				<div class="drawer-section">
					<h6>Acciones</h6>
					<div class="drawer-item" (click)="selectItem('Crear Nuevo')">➕ Crear Nuevo</div>
					<div class="drawer-item" (click)="selectItem('Exportar')">📋 Exportar</div>
					<div class="drawer-item" (click)="selectItem('Buscar')">🔍 Buscar</div>
				</div>
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

			.drawer-backdrop {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.3);
				cursor: pointer;
			}

			.drawer-content {
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				width: 300px;
				background: white;
				box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
				animation: drawerSlideIn 0.3s ease-out;

				.drawer-header {
					padding: 1rem 1.5rem;
					border-bottom: 1px solid var(--hub-sys-border-color-default, #dee2e6);
					display: flex;
					justify-content: space-between;
					align-items: center;

					h5 {
						margin: 0;
						color: var(--hub-sys-text-primary, #212529);
					}

					.close-btn {
						background: none;
						border: none;
						font-size: 1.2em;
						cursor: pointer;
						color: var(--hub-sys-text-muted, #6c757d);
						padding: 0;

						&:hover {
							color: var(--hub-sys-text-secondary, #495057);
						}
					}
				}

				.drawer-body {
					padding: 1rem;

					.drawer-section {
						margin-bottom: 2rem;

						h6 {
							margin-bottom: 0.75rem;
							color: var(--hub-sys-text-secondary, #495057);
							font-size: 0.9em;
							text-transform: uppercase;
							letter-spacing: 0.5px;
						}
					}

					.drawer-item {
						padding: 0.75rem 1rem;
						border-radius: 0.25rem;
						cursor: pointer;
						transition: background 0.15s ease;

						&:hover {
							background: var(--hub-sys-surface-elevated, #f8f9fa);
						}
					}
				}
			}

			@keyframes drawerSlideIn {
				from {
					transform: translateX(100%);
				}
				to {
					transform: translateX(0);
				}
			}
		`
	]
})
export class DrawerComponent {
	private activePortal = inject(HubActivePortal);

	/**
	 * Closes the drawer portal, resolving it with the selected navigation item.
	 *
	 * @param item The item selected by the user.
	 */
	selectItem(item: string) {
		console.log('Selected item:', item);
		// In a real app, you might navigate or perform an action
		// For now, just close the drawer
		this.activePortal.close(item);
	}

	/**
	 * Dismisses the drawer portal without selecting an item.
	 */
	close() {
		this.activePortal.dismiss();
	}
}
