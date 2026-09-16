import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-progressive-open-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" (click)="openPortal(1)">Open Portal Level 1</button>

				<div class="status-info mt-3"><strong>Active Portals:</strong> {{ activePortalCount() }}</div>
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
			.status-info {
				padding: 1rem;
				background: #f1f5f9;
				border-radius: 6px;
			}
			:host ::ng-deep .stacked-portal {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			:host ::ng-deep .portal-content {
				background: white;
				padding: 2rem;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 400px;
			}
		`
	]
})
export class ProgressiveOpenExampleComponent {
	private _portal = inject(HubPortal);
	activePortalCount = signal(0);

	/**
	 * Opens a stacked portal for the given level and wires up its controls so
	 * the next level can be opened, keeping the active portal count in sync.
	 *
	 * @param level The depth level of the portal being opened.
	 */
	openPortal(level: number) {
		const content = `
			<div class="portal-content">
				<h5>Portal Level \${level}</h5>
				<p>This is portal number \${level} in the stack.</p>
				<button hubButton color="primary" onclick="this.closest('.portal-content').parentNode.querySelector('[data-dismiss]').click()">
					Open Level \${level + 1}
				</button>
				<br><br>
				<button hubButton color="secondary" data-dismiss="portal">Close This Portal</button>
			</div>
		`;

		const portalRef = this._portal.open(content, {
			windowClass: 'stacked-portal',
			animation: true
		});

		this.updatePortalCount();

		portalRef.closed.subscribe(() => {
			this.updatePortalCount();
		});

		portalRef.dismissed.subscribe(() => {
			this.updatePortalCount();
		});

		// Set up button to open next level
		setTimeout(() => {
			const btn = document.querySelector('.stacked-portal .btn-primary');
			if (btn) {
				btn.addEventListener('click', () => this.openPortal(level + 1));
			}
		}, 100);
	}

	/**
	 * Refreshes the count of currently open stacked portals after a short delay
	 * to allow the DOM to settle.
	 */
	private updatePortalCount() {
		setTimeout(() => {
			this.activePortalCount.set(this._portal.hasOpenPortals() ? document.querySelectorAll('.stacked-portal').length : 0);
		}, 50);
	}

	static readonly templateCode = `<button (click)="openPortal(1)">Open Portal Level 1</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class ProgressiveOpenExample {
  portal = inject(HubPortal);

  openPortal(level: number) {
    // Each call to open() creates a new portal instance
    // They stack on top of each other automatically
    const content = "
      <div>
        <h5>Portal Level \${level}</h5>
        <button onclick="openNext()">Open Level \${level + 1}</button>
        <button data-dismiss="portal">Close</button>
      </div>
    ";

    const ref = this.portal.open(content, {
      windowClass: 'stacked-portal',
      animation: true
    });

    ref.closed.subscribe(() => console.log("Level \${level} closed"));
  }
}`;
}
