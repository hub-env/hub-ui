import { Component, inject, TemplateRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-content-projection-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" (click)="openPortalWithProjection()">Open Portal with Projection</button>
			</div>

			<!-- Portal Template with Projected Content -->
			<ng-template #projectionTemplate>
				<div class="projection-portal">
					<!-- Header Slot -->
					<div class="portal-header" data-portal-section="header">
						<h5>Projected Header</h5>
						<button class="close-btn" data-dismiss="portal">×</button>
					</div>

					<!-- Body - Main Content -->
					<div class="portal-body">
						<p>This portal demonstrates content projection.</p>
						<p>The header and footer use specific selectors for targeting.</p>
					</div>

					<!-- Footer Slot -->
					<div class="portal-footer" data-portal-section="footer">
						<button hubButton color="secondary" data-dismiss="portal">Cancel</button>
						<button hubButton color="primary" data-close="portal">Confirm</button>
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
			.btn-secondary {
				background: #64748b;
				color: white;
			}
			:host ::ng-deep .projection-portal-window {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 1050;
			}
			:host ::ng-deep .projection-portal {
				background: white;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 500px;
			}
			:host ::ng-deep .portal-header {
				padding: 1rem;
				background: linear-gradient(to right, #3b82f6, #2563eb);
				color: white;
				border-radius: 8px 8px 0 0;
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
				color: white;
				font-size: 1.5rem;
				cursor: pointer;
				line-height: 1;
			}
			:host ::ng-deep .portal-body {
				padding: 1.5rem;
			}
			:host ::ng-deep .portal-footer {
				padding: 1rem;
				background: #f8fafc;
				border-top: 1px solid #e2e8f0;
				border-radius: 0 0 8px 8px;
				display: flex;
				justify-content: flex-end;
				gap: 0.5rem;
			}
		`
	]
})
export class ContentProjectionExampleComponent {
	private _portal = inject(HubPortal);
	public projectionTemplate = viewChild.required<TemplateRef<any>>('projectionTemplate');

	/**
	 * Opens a portal from the local template, projecting the header and footer
	 * sections into the portal window using the configured selectors.
	 */
	openPortalWithProjection() {
		this._portal.open(this.projectionTemplate(), {
			windowClass: 'projection-portal-window',
			headerSelector: '[data-portal-section="header"]',
			footerSelector: '[data-portal-section="footer"]',
			animation: true
		});
	}

	static readonly templateCode = `<!-- Portal template with projected sections -->
<ng-template #portalTemplate>
  <div class="portal-wrapper">
    <!-- Header section (identified by custom selector) -->
    <div data-portal-section="header">
      <h5>Custom Header</h5>
      <button data-dismiss="portal">×</button>
    </div>

    <!-- Main body content -->
    <div class="portal-body">
      <p>Main content here</p>
    </div>

    <!-- Footer section (identified by custom selector) -->
    <div data-portal-section="footer">
      <button data-dismiss="portal">Cancel</button>
      <button data-close="portal">OK</button>
    </div>
  </div>
</ng-template>

<button (click)="openPortal()">Open Portal</button>`;

	static readonly componentCode = `import { Component, inject, viewChild, TemplateRef } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class ContentProjectionExample {
  portal = inject(HubPortal);
  projectionTemplate = viewChild.required<TemplateRef<any>>('portalTemplate');

  openPortal() {
    this.portal.open(this.projectionTemplate(), {
      windowClass: 'custom-portal',
      // Specify custom selectors for header/footer
      headerSelector: '[data-portal-section="header"]',
      footerSelector: '[data-portal-section="footer"]',
      animation: true
    });
  }
}`;
}
