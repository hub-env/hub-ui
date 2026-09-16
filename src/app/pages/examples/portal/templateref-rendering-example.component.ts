import { Component, inject, signal, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-templateref-rendering-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" (click)="openTemplatePortal()">Open Template Portal</button>

				@if (portalResult()) {
					<div class="result-box mt-3"><strong>Result:</strong> {{ portalResult() }}</div>
				}
			</div>

			<!-- Portal Template Definition -->
			<ng-template #portalTemplate let-userName="name" let-count="count">
				<div class="template-portal-card">
					<div class="portal-header">
						<h5>Template Portal</h5>
						<button class="close-btn" data-dismiss="portal">×</button>
					</div>
					<div class="portal-body">
						<p>
							Hello, <strong>{{ userName }}</strong
							>!
						</p>
						<p>
							This portal has been opened <strong>{{ count }}</strong> times.
						</p>
						<div class="actions">
							<button hubButton color="secondary" data-dismiss="portal">Dismiss</button>
							<button hubButton color="primary" data-close="portal">Close</button>
						</div>
					</div>
				</div>
			</ng-template>
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
			.btn-primary:hover {
				background: #2563eb;
			}
			.btn-secondary {
				background: #64748b;
				color: white;
			}
			.result-box {
				padding: 1rem;
				background: #f1f5f9;
				border-radius: 6px;
			}
			:host ::ng-deep .template-portal-window {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1050;
			}
			:host ::ng-deep .template-portal-card {
				background: white;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 400px;
			}
			:host ::ng-deep .portal-header {
				padding: 1rem;
				border-bottom: 1px solid #e2e8f0;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			:host ::ng-deep .portal-header h5 {
				margin: 0;
			}
			:host ::ng-deep .close-btn {
				background: none;
				border: none;
				font-size: 1.5rem;
				cursor: pointer;
				line-height: 1;
			}
			:host ::ng-deep .portal-body {
				padding: 1.5rem;
			}
			:host ::ng-deep .actions {
				margin-top: 1rem;
				display: flex;
				gap: 0.5rem;
			}
		`
	]
})
export class TemplaterefRenderingExampleComponent {
	private _portal = inject(HubPortal);
	public portalTemplate = viewChild.required<TemplateRef<any>>('portalTemplate');

	portalResult = signal<string>('');
	private openCount = 0;

	/**
	 * Opens a portal that renders the local TemplateRef and reports the result
	 * once the portal is closed.
	 */
	openTemplatePortal() {
		this.openCount++;
		this.portalResult.set('');

		const portalRef = this._portal.open(this.portalTemplate(), {
			windowClass: 'template-portal-window',
			animation: true
		});

		portalRef.closed.subscribe(() => {
			this.portalResult.set('Portal closed successfully');
		});

		portalRef.dismissed.subscribe(() => {
			this.portalResult.set('Portal was dismissed');
		});
	}

	static readonly templateCode = `<!-- Define template with context variables -->
<ng-template #portalTemplate let-userName="name" let-count="count">
  <div class="portal-card">
    <h5>Hello, {{ userName }}!</h5>
    <p>Opened {{ count }} times</p>
    <button data-dismiss="portal">Close</button>
  </div>
</ng-template>

<button (click)="openTemplatePortal()">Open Portal</button>`;

	static readonly componentCode = `import { Component, inject, viewChild, TemplateRef } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class TemplateExampleComponent {
  private portal = inject(HubPortal);
  portalTemplate = viewChild.required<TemplateRef<any>>('portalTemplate');
  
  private openCount = 0;

  openTemplatePortal() {
    this.openCount++;
    
    const portalRef = this.portal.open(this.portalTemplate(), {
      windowClass: 'custom-portal',
      animation: true
    });
    
    // Subscribe to events
    portalRef.closed.subscribe(() => {
      console.log('Portal closed');
    });
  }
}`;
}
