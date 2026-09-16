import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-toggle-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" class="me-2" (click)="togglePortal('A')">Toggle Portal A</button>
				<button hubButton color="secondary" class="me-2" (click)="togglePortal('B')">Toggle Portal B</button>
				<button hubButton color="success" (click)="togglePortal('C')">Toggle Portal C</button>

				<div class="status-info mt-3"><strong>Active Portal:</strong> {{ activePortal() || 'None' }}</div>
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
			.btn-secondary {
				background: #64748b;
				color: white;
			}
			.btn-success {
				background: #22c55e;
				color: white;
			}
			.status-info {
				padding: 1rem;
				background: #f1f5f9;
				border-radius: 6px;
			}
			:host ::ng-deep .toggle-portal {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1050;
			}
			:host ::ng-deep .toggle-content {
				background: white;
				padding: 2rem;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 400px;
			}
			:host ::ng-deep .portal-a {
				border-left: 4px solid #3b82f6;
			}
			:host ::ng-deep .portal-b {
				border-left: 4px solid #64748b;
			}
			:host ::ng-deep .portal-c {
				border-left: 4px solid #22c55e;
			}
		`
	]
})
export class ToggleExampleComponent {
	private _portal = inject(HubPortal);
	activePortal = signal<string>('');

	/**
	 * Toggles an exclusive portal identified by name, closing any previously
	 * open portal before opening the requested one.
	 *
	 * @param name The label of the portal to toggle.
	 */
	togglePortal(name: string) {
		const content = `
			<div class="toggle-content portal-\${name.toLowerCase()}">
				<h5>Portal \${name}</h5>
				<p>This is an exclusive portal. Opening another will close this one.</p>
				<button hubButton color="secondary" data-dismiss="portal">Close</button>
			</div>
		`;

		const portalRef = this._portal.toggle(content, {
			windowClass: 'toggle-portal',
			animation: true
		});

		this.activePortal.set(name);

		portalRef.closed.subscribe(() => {
			this.activePortal.set('');
		});

		portalRef.dismissed.subscribe(() => {
			this.activePortal.set('');
		});
	}

	static readonly templateCode = `<button (click)="togglePortal('A')">Toggle Portal A</button>
<button (click)="togglePortal('B')">Toggle Portal B</button>
<button (click)="togglePortal('C')">Toggle Portal C</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class ToggleExample {
  portal = inject(HubPortal);

  togglePortal(name: string) {
    // toggle() automatically closes any existing portal
    // before opening the new one
    const content = "
      <div>
        <h5>Portal \${name}</h5>
        <p>Only one portal can be active at a time.</p>
        <button data-dismiss="portal">Close</button>
      </div>
    ";

    const ref = this.portal.toggle(content, {
      windowClass: 'exclusive-portal',
      animation: true
    });

    ref.closed.subscribe(() => 
      console.log('Portal closed')
    );
  }
}`;
}
