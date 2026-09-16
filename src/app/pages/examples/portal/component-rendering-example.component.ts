import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal, HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Simple Component to be rendered inside the portal
 */
@Component({
	selector: 'app-portal-demo-content',
	imports: [HubButtonComponent],
	standalone: true,
	template: `
		<div class="portal-demo-card">
			<div class="portal-demo-header">
				<h5>{{ title }}</h5>
				<button class="close-btn" (click)="activePortal.close('Closed from component')">×</button>
			</div>
			<div class="portal-demo-body">
				<p>This is a component rendered inside a portal.</p>
				<p class="text-muted">Message: {{ message }}</p>
				<div class="mt-3">
					<button hubButton color="secondary" size="sm" class="me-2" (click)="activePortal.dismiss('Dismissed')">
						Dismiss
					</button>
					<button hubButton color="primary" size="sm" (click)="activePortal.close('Confirmed')">Confirm</button>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.portal-demo-card {
				background: white;
				border-radius: 8px;
				box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
				max-width: 400px;
			}
			.portal-demo-header {
				padding: 1rem;
				border-bottom: 1px solid #e2e8f0;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.portal-demo-header h5 {
				margin: 0;
				font-size: 1.1rem;
			}
			.close-btn {
				background: none;
				border: none;
				font-size: 1.5rem;
				cursor: pointer;
				color: #64748b;
				line-height: 1;
			}
			.close-btn:hover {
				color: #334155;
			}
			.portal-demo-body {
				padding: 1.5rem;
			}
			.btn {
				padding: 0.5rem 1rem;
				border-radius: 6px;
				border: none;
				cursor: pointer;
				font-weight: 500;
			}
			.btn-primary {
				background: #3b82f6;
				color: white;
			}
			.btn-primary:hover {
				background: #2563eb;
			}
			.btn-secondary {
				background: #64748b;
				color: white;
			}
			.btn-secondary:hover {
				background: #475569;
			}
		`
	]
})
export class PortalDemoContentComponent {
	activePortal = inject(HubActivePortal);

	title = 'Component Portal';
	message = 'Injected via component instance!';
}

@Component({
	selector: 'app-component-rendering-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" (click)="openComponentPortal()">Open Component Portal</button>

				@if (portalResult()) {
					<div class="result-box mt-3"><strong>Portal Result:</strong> {{ portalResult() }}</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-controls {
				padding: 1.5rem;
			}
			.btn {
				padding: 0.75rem 1.5rem;
				border-radius: 6px;
				border: none;
				cursor: pointer;
				font-weight: 500;
				font-size: 1rem;
			}
			.btn-primary {
				background: #3b82f6;
				color: white;
			}
			.btn-primary:hover {
				background: #2563eb;
			}
			.result-box {
				padding: 1rem;
				background: #f1f5f9;
				border-radius: 6px;
				border-left: 4px solid #3b82f6;
			}
			:host ::ng-deep .component-portal-window {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1050;
			}
		`
	]
})
export class ComponentRenderingExampleComponent {
	private _portal = inject(HubPortal);
	private _portalRef: HubPortalRef | null = null;

	portalResult = signal<string>('');

	/**
	 * Opens a portal that renders a standalone component and reads back the
	 * result emitted by the rendered component instance.
	 */
	openComponentPortal() {
		this.portalResult.set('');

		this._portalRef = this._portal.open(PortalDemoContentComponent, {
			windowClass: 'component-portal-window',
			animation: true
		});

		// Access component instance
		if (this._portalRef.componentInstance) {
			this._portalRef.componentInstance.title = 'Dynamic Component';
			this._portalRef.componentInstance.message = 'Data set from parent!';
		}

		// Subscribe to results
		this._portalRef.closed.subscribe((_result) => {
			this.portalResult.set(`Closed: \${result}`);
			this._portalRef = null;
		});

		this._portalRef.dismissed.subscribe((_reason) => {
			this.portalResult.set(`Dismissed: \${reason}`);
			this._portalRef = null;
		});
	}

	// =====================================
	// CODE FOR EXAMPLE VIEWER
	// =====================================

	static readonly templateCode = `<button (click)="openComponentPortal()">
  Open Component Portal
</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubPortal, HubActivePortal } from 'ng-hub-ui-portal';

// Content Component
@Component({
  selector: 'app-portal-content',
  standalone: true,
  template: "
    <div class="portal-card">
      <h5>{{ title }}</h5>
      <p>{{ message }}</p>
      <button (click)="activePortal.close('result')">Close</button>
    </div>
  "
})
export class PortalContentComponent {
  activePortal = inject(HubActivePortal);
  title = 'Component Portal';
  message = 'Hello from component!';
}

// Parent Component
@Component({...})
export class ExampleComponent {
  private portal = inject(HubPortal);
  
  openComponentPortal() {
    const portalRef = this.portal.open(PortalContentComponent, {
      windowClass: 'custom-portal',
      animation: true
    });
    
    // Access and modify component instance
    if (portalRef.componentInstance) {
      portalRef.componentInstance.title = 'Modified Title';
      portalRef.componentInstance.message = 'Data from parent!';
    }
    
    // Subscribe to close event
    portalRef.closed.subscribe(result => {
      console.log('Portal closed with:', result);
    });
  }
}`;
}
