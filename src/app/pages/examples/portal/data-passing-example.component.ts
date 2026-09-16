import { JsonPipe } from '@angular/common';
import { Component, inject, Injector, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubActivePortal, HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

// Injectable data token
export const PORTAL_DATA = 'PORTAL_DATA';

/**
 * Portal content component that receives injected data
 */
@Component({
	selector: 'app-data-portal-content',
	standalone: true,
	imports: [JsonPipe, HubButtonComponent],
	template: `
		<div class="data-portal-card">
			<div class="portal-header">
				<h5>Data Injection Portal</h5>
				<button class="close-btn" (click)="activePortal.close()">×</button>
			</div>
			<div class="portal-body">
				<h6>Received Data:</h6>
				<pre class="data-display">{{ dataReceived | json }}</pre>
				<div class="actions mt-3">
					<button hubButton color="secondary" (click)="activePortal.dismiss()">Cancel</button>
					<button hubButton color="primary" (click)="sendDataBack()">Send Data Back</button>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.data-portal-card {
				background: white;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 500px;
			}
			.portal-header {
				padding: 1rem;
				border-bottom: 1px solid #e2e8f0;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.portal-header h5 {
				margin: 0;
			}
			.close-btn {
				background: none;
				border: none;
				font-size: 1.5rem;
				cursor: pointer;
				line-height: 1;
			}
			.portal-body {
				padding: 1.5rem;
			}
			.data-display {
				background: #f1f5f9;
				padding: 1rem;
				border-radius: 4px;
				font-size: 0.875rem;
			}
			.actions {
				display: flex;
				gap: 0.5rem;
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
			.btn-secondary {
				background: #64748b;
				color: white;
			}
		`
	]
})
export class DataPortalContentComponent {
	activePortal = inject(HubActivePortal);
	private injector = inject(Injector);

	dataReceived: any = {};

	/**
	 * Resolves the data injected into the portal via the PORTAL_DATA token and
	 * stores it for display.
	 */
	constructor() {
		// Get injected data
		this.dataReceived = this.injector.get(PORTAL_DATA, null);
	}

	/**
	 * Closes the portal, returning a result payload derived from the received
	 * data back to the opener.
	 */
	sendDataBack() {
		this.activePortal.close({
			userId: this.dataReceived.userId,
			action: 'confirmed',
			timestamp: new Date().toISOString()
		});
	}
}

@Component({
	selector: 'app-data-passing-example',
	standalone: true,
	imports: [JsonPipe, HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" (click)="openDataPortal()">Open Portal with Data</button>

				@if (returnedData()) {
					<div class="result-box mt-3">
						<strong>Returned Data:</strong>
						<pre>{{ returnedData() | json }}</pre>
					</div>
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
			}
			.btn-primary {
				background: #3b82f6;
				color: white;
			}
			.result-box {
				padding: 1rem;
				background: #f1f5f9;
				border-radius: 6px;
			}
			.result-box pre {
				margin: 0.5rem 0 0 0;
				font-size: 0.875rem;
			}
			:host ::ng-deep .data-portal {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1050;
			}
		`
	]
})
export class DataPassingExampleComponent {
	private _portal = inject(HubPortal);
	returnedData = signal<any>(null);

	/**
	 * Opens the data portal with a custom injector that provides the payload
	 * through the PORTAL_DATA token, then captures the result returned on close.
	 */
	openDataPortal() {
		this.returnedData.set(null);

		// Create custom injector with data
		const customInjector = Injector.create({
			providers: [
				{
					provide: PORTAL_DATA,
					useValue: {
						userId: 123,
						userName: 'John Doe',
						role: 'Admin',
						timestamp: new Date().toISOString()
					}
				}
			],
			parent: inject(Injector)
		});

		const portalRef = this._portal.open(DataPortalContentComponent, {
			windowClass: 'data-portal',
			injector: customInjector,
			animation: true
		});

		portalRef.closed.subscribe((data) => {
			this.returnedData.set(data);
		});
	}

	static readonly templateCode = `<button (click)="openDataPortal()">
  Open Portal with Data
</button>`;

	static readonly componentCode = `import { Component, inject, Injector } from '@angular/core';
import { HubPortal, HubActivePortal } from 'ng-hub-ui-portal';

// Data token
export const PORTAL_DATA = 'PORTAL_DATA';

// Portal content component
@Component({
  selector: 'app-portal-content',
  template: "
    <div>
      <h5>Received Data:</h5>
      <pre>{{ dataReceived | json }}</pre>
      <button (click)="sendBack()">Send Back</button>
    </div>
  "
})
export class PortalContentComponent {
  activePortal = inject(HubActivePortal);
  injector = inject(Injector);
  
  dataReceived: any;

  constructor() {
    this.dataReceived = this.injector.get(PORTAL_DATA, null);
  }

  sendBack() {
    this.activePortal.close({ result: 'confirmed' });
  }
}

// Parent component
@Component({...})
export class Example {
  portal = inject(HubPortal);

  openDataPortal() {
    const customInjector = Injector.create({
      providers: [{
        provide: PORTAL_DATA,
        useValue: { userId: 123, userName: 'John' }
      }],
      parent: inject(Injector)
    });

    const ref = this.portal.open(PortalContentComponent, {
      injector: customInjector
    });

    ref.closed.subscribe(data => console.log(data));
  }
}`;
}
