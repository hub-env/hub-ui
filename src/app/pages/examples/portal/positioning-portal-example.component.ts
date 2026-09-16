import { Component, inject, signal, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-positioning-portal-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div class="demo-section">
			<!-- Position Controls -->
			<div class="position-controls">
				<h5>Configuración de Posicionamiento</h5>
				<div class="control-row">
					<label>
						Posición:
						<select [value]="selectedPosition()" (change)="selectedPosition.set($any($event.target).value)">
							@for (pos of positionOptions; track pos.value) {
								<option [value]="pos.value">{{ pos.label }}</option>
							}
						</select>
					</label>

					<label>
						Target:
						<select [value]="selectedTarget()" (change)="selectedTarget.set($any($event.target).value)">
							@for (target of targetOptions; track target.value) {
								<option [value]="target.value">{{ target.label }}</option>
							}
						</select>
					</label>
				</div>

				<div class="control-row">
					<label>
						Offset X:
						<input
							type="range"
							min="-50"
							max="50"
							[value]="offsetX()"
							(input)="offsetX.set(+$any($event.target).value)"
						/>
						<span class="offset-value">{{ offsetX() }}px</span>
					</label>

					<label>
						Offset Y:
						<input
							type="range"
							min="-50"
							max="50"
							[value]="offsetY()"
							(input)="offsetY.set(+$any($event.target).value)"
						/>
						<span class="offset-value">{{ offsetY() }}px</span>
					</label>
				</div>

				<div class="control-row">
					<label>
						<input
							type="checkbox"
							[checked]="hasBackdrop()"
							(change)="hasBackdrop.set($any($event.target).checked)"
						/>
						Con Backdrop
					</label>

					<label>
						<input
							type="checkbox"
							[checked]="autoPosition()"
							(change)="autoPosition.set($any($event.target).checked)"
						/>
						Posicionamiento Automático
					</label>
				</div>

				<button hubButton color="primary" (click)="togglePositionedPortal()">
					{{ showPositionedPortal() ? 'Cerrar' : 'Mostrar' }} Portal
				</button>
			</div>

			<!-- Demo Containers -->
			<div class="demo-containers">
				<!-- Reference Elements -->
				<div class="reference-elements">
					<h5>Elementos de Referencia</h5>
					<div class="elements-grid">
						<div class="ref-element" id="top-left-ref">
							<span>Top Left</span>
							<small>Esquina superior izquierda</small>
						</div>

						<div class="ref-element" id="top-right-ref">
							<span>Top Right</span>
							<small>Esquina superior derecha</small>
						</div>

						<div class="ref-element center-element" id="center-ref">
							<span>Center</span>
							<small>Elemento central</small>
						</div>

						<div class="ref-element" id="bottom-left-ref">
							<span>Bottom Left</span>
							<small>Esquina inferior izquierda</small>
						</div>

						<div class="ref-element" id="bottom-right-ref">
							<span>Bottom Right</span>
							<small>Esquina inferior derecha</small>
						</div>
					</div>
				</div>

				<!-- Portal Targets -->
				<div class="portal-targets">
					<h5>Targets de Portal</h5>
					<div class="targets-grid">
						<div class="target-area" id="target-1">Target 1</div>
						<div class="target-area" id="target-2">Target 2</div>
						<div class="target-area" id="target-3">Target 3</div>
					</div>
				</div>
			</div>

			<!-- Configuration Display -->
			<div class="config-display">
				<h6>Configuración Actual</h6>
				<div class="config-info">
					<div class="config-item"><strong>Posición:</strong> {{ selectedPosition() }}</div>
					<div class="config-item"><strong>Target:</strong> {{ selectedTarget() }}</div>
					<div class="config-item"><strong>Offset:</strong> X: {{ offsetX() }}px, Y: {{ offsetY() }}px</div>
					<div class="config-item"><strong>Backdrop:</strong> {{ hasBackdrop() ? 'Sí' : 'No' }}</div>
				</div>
			</div>

			<!-- Portal Templates -->
			<ng-template #positionedPortalTemplate>
				<div class="positioned-portal-content">
					<div class="portal-header">
						<h6>Portal Posicionado</h6>
						<button class="close-btn" data-close="portal">×</button>
					</div>
					<div class="portal-body">
						<p><strong>Posición:</strong> {{ selectedPosition() }}</p>
						<p><strong>Target:</strong> {{ selectedTarget() }}</p>
						<p><strong>Offset:</strong> ({{ offsetX() }}, {{ offsetY() }})</p>
						<div class="portal-indicator">
							<div class="indicator-dot"></div>
							<small>Punto de anclaje</small>
						</div>
					</div>
				</div>
			</ng-template>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-section {
				max-width: 1200px;
				margin: 0 auto;
			}

			.position-controls {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				padding: 1.5rem;
				border-radius: 0.375rem;
				margin-bottom: 2rem;

				h5 {
					margin-top: 0;
					margin-bottom: 1rem;
				}
			}

			.control-row {
				display: flex;
				gap: 2rem;
				margin-bottom: 1rem;
				flex-wrap: wrap;

				label {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					font-size: 0.9em;

					select,
					input[type='range'] {
						padding: 0.25rem 0.5rem;
						border: 1px solid var(--hub-sys-border-color-default, #ced4da);
						border-radius: 0.25rem;
					}

					input[type='range'] {
						width: 100px;
					}

					input[type='checkbox'] {
						width: auto;
					}
				}
			}

			.offset-value {
				font-family: monospace;
				font-size: 0.8em;
				color: #007bff;
				min-width: 40px;
			}

			.btn {
				padding: 0.5rem 1rem;
				background: #007bff;
				color: white;
				border: none;
				border-radius: 0.375rem;
				cursor: pointer;

				&:hover {
					background: #0056b3;
				}
			}

			.demo-containers {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 2rem;
				margin-bottom: 2rem;
			}

			.reference-elements,
			.portal-targets {
				h5 {
					margin-bottom: 1rem;
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			.elements-grid {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-template-rows: auto auto auto;
				gap: 1rem;
				min-height: 200px;
				position: relative;

				.center-element {
					grid-column: 1 / 3;
					justify-self: center;
				}
			}

			.ref-element {
				background: var(--hub-sys-state-hover-bg, #e9ecef);
				border: 2px solid #adb5bd;
				border-radius: 0.375rem;
				padding: 1rem;
				text-align: center;
				cursor: pointer;
				transition: all 0.15s ease;

				span {
					display: block;
					font-weight: bold;
					color: var(--hub-sys-text-secondary, #495057);
					margin-bottom: 0.25rem;
				}

				small {
					color: var(--hub-sys-text-muted, #6c757d);
					font-size: 0.8em;
				}

				&:hover {
					background: #dee2e6;
					border-color: #007bff;
				}
			}

			.targets-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
				gap: 1rem;
			}

			.target-area {
				background: #fff3cd;
				border: 2px dashed #ffc107;
				border-radius: 0.375rem;
				padding: 1rem;
				text-align: center;
				color: #856404;
				font-weight: bold;
				min-height: 80px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.config-display {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 0.375rem;
				padding: 1rem;
				margin-bottom: 2rem;

				h6 {
					margin-top: 0;
					margin-bottom: 1rem;
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			.config-info {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
				gap: 0.5rem;
			}

			.config-item {
				font-size: 0.9em;

				strong {
					color: var(--hub-sys-text-secondary, #495057);
				}
			}

			/* Portal Content Styles */
			:host ::ng-deep .positioned-portal-content {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 0.5rem;
				box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
				min-width: 280px;
				animation: portalFadeIn 0.2s ease-out;

				.portal-header {
					padding: 0.75rem 1rem;
					border-bottom: 1px solid var(--hub-sys-border-color-default, #dee2e6);
					display: flex;
					justify-content: space-between;
					align-items: center;

					h6 {
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
						width: 24px;
						height: 24px;
						display: flex;
						align-items: center;
						justify-content: center;

						&:hover {
							color: var(--hub-sys-text-secondary, #495057);
						}
					}
				}

				.portal-body {
					padding: 1rem;

					p {
						margin-bottom: 0.5rem;
						font-size: 0.9em;

						&:last-of-type {
							margin-bottom: 1rem;
						}
					}

					strong {
						color: var(--hub-sys-text-secondary, #495057);
					}
				}

				.portal-indicator {
					text-align: center;

					.indicator-dot {
						width: 8px;
						height: 8px;
						background: #007bff;
						border-radius: 50%;
						margin: 0 auto 0.25rem;
					}

					small {
						color: var(--hub-sys-text-muted, #6c757d);
						font-size: 0.8em;
					}
				}
			}

			/* Portal Window Classes */
			:host ::ng-deep .positioned-portal {
				position: fixed !important;
			}

			:host ::ng-deep .absolute-portal {
				position: absolute !important;
			}

			:host ::ng-deep .connected-portal {
				position: absolute !important;
			}

			@keyframes portalFadeIn {
				from {
					opacity: 0;
					transform: scale(0.95);
				}
				to {
					opacity: 1;
					transform: scale(1);
				}
			}

			@media (max-width: 768px) {
				.control-row {
					flex-direction: column;
					gap: 1rem;
				}

				.demo-containers {
					grid-template-columns: 1fr;
				}

				.config-info {
					grid-template-columns: 1fr;
				}
			}
		`
	]
})
export class PositioningPortalExampleComponent {
	readonly positionedPortalTemplate = viewChild.required<TemplateRef<any>>('positionedPortalTemplate');

	showPositionedPortal = signal(false);
	selectedPosition = signal('absolute');
	selectedTarget = signal('body');
	offsetX = signal(0);
	offsetY = signal(0);
	hasBackdrop = signal(false);
	autoPosition = signal(false);

	private currentPortal: HubPortalRef | null = null;

	/** The portal service used to open positioned portals. */
	private portal = inject(HubPortal);

	positionOptions = [
		{ value: 'static', label: 'Static' },
		{ value: 'relative', label: 'Relative' },
		{ value: 'absolute', label: 'Absolute' },
		{ value: 'fixed', label: 'Fixed' },
		{ value: 'connected', label: 'Connected' }
	];

	targetOptions = [
		{ value: 'body', label: 'Body' },
		{ value: '#target-1', label: 'Target 1' },
		{ value: '#target-2', label: 'Target 2' },
		{ value: '#target-3', label: 'Target 3' },
		{ value: '#center-ref', label: 'Centro' }
	];

	/**
	 * Toggles the positioned portal, opening it when closed and closing it when
	 * already open.
	 */
	togglePositionedPortal() {
		if (this.showPositionedPortal()) {
			this.closePortal();
		} else {
			this.openPortal();
		}
	}

	/**
	 * Opens the positioned portal with the current configuration and subscribes
	 * to its close and dismiss events to keep local state in sync.
	 */
	openPortal() {
		const options = this.getPortalOptions();

		this.currentPortal = this.portal.open(this.positionedPortalTemplate(), options);
		this.showPositionedPortal.set(true);

		// Subscribe to portal events
		this.currentPortal.closed.subscribe(() => {
			this.showPositionedPortal.set(false);
			this.currentPortal = null;
		});

		this.currentPortal.dismissed.subscribe(() => {
			this.showPositionedPortal.set(false);
			this.currentPortal = null;
		});
	}

	/**
	 * Closes the currently open positioned portal, if any.
	 */
	closePortal() {
		if (this.currentPortal) {
			this.currentPortal.close();
		}
	}

	/**
	 * Builds the portal options object from the current container and window
	 * class selections.
	 *
	 * @returns The portal options used when opening the positioned portal.
	 */
	private getPortalOptions() {
		const windowClass = this.getWindowClass();
		const container = this.getContainerElement();

		return {
			container,
			windowClass,
			animation: true,
			keyboard: true
		};
	}

	/**
	 * Derives the CSS window class string from the selected positioning
	 * strategy.
	 *
	 * @returns A space-separated list of CSS classes for the portal window.
	 */
	private getWindowClass(): string {
		const classes = ['positioned-portal'];

		switch (this.selectedPosition()) {
			case 'absolute':
				classes.push('absolute-portal');
				break;
			case 'connected':
				classes.push('connected-portal');
				break;
			case 'fixed':
				classes.push('fixed-portal');
				break;
		}

		return classes.join(' ');
	}

	/**
	 * Resolves the DOM container element matching the selected target, falling
	 * back to the document body when no element is found.
	 *
	 * @returns The container element where the portal will be appended.
	 */
	private getContainerElement(): HTMLElement {
		const target = this.selectedTarget();

		if (target === 'body') {
			return document.body;
		}

		const element = document.querySelector(target);
		return (element as HTMLElement) || document.body;
	}

	static readonly templateCode = `<!-- Portal Template -->
<ng-template #positionedPortalTemplate>
  <div class="positioned-portal-content">
    <div class="portal-header">
      <h6>Portal Posicionado</h6>
      <button class="close-btn" data-close="portal">×</button>
    </div>
    <div class="portal-body">
      <p><strong>Posición:</strong> {{ selectedPosition() }}</p>
      <p><strong>Target:</strong> {{ selectedTarget() }}</p>
      <p><strong>Offset:</strong> ({{ offsetX() }}, {{ offsetY() }})</p>
    </div>
  </div>
</ng-template>

<!-- Controls -->
<div class="controls">
  <button (click)="togglePositionedPortal()">
    {{ showPositionedPortal() ? 'Cerrar' : 'Abrir' }} Portal
  </button>
</div>`;

	static readonly componentCode = `import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';

@Component({
  selector: 'app-positioning-example',
  standalone: true,
  template: \`<!-- Template code -->\`
})
export class PositioningExampleComponent {
  @ViewChild('positionedPortalTemplate', { static: true }) 
  positionedPortalTemplate!: TemplateRef<any>;

  showPositionedPortal = signal(false);
  selectedPosition = signal('absolute');
  selectedTarget = signal('body');
  offsetX = signal(0);
  offsetY = signal(0);
  hasBackdrop = signal(false);

  private currentPortal: HubPortalRef | null = null;

  constructor(private portal: HubPortal) {}

  togglePositionedPortal() {
    if (this.showPositionedPortal()) {
      this.closePortal();
    } else {
      this.openPortal();
    }
  }

  openPortal() {
    const options = this.getPortalOptions();
    
    this.currentPortal = this.portal.open(this.positionedPortalTemplate, options);
    this.showPositionedPortal.set(true);

    this.currentPortal.closed.subscribe(() => {
      this.showPositionedPortal.set(false);
      this.currentPortal = null;
    });
  }

  private getPortalOptions() {
    return {
      container: this.getContainerElement(),
      windowClass: this.getWindowClass(),
      animation: true,
      keyboard: true
    };
  }
}`;
}
