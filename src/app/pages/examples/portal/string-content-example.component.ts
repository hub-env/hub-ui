import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-string-content-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div>
			<div class="demo-controls">
				<button hubButton color="primary" class="me-2" (click)="openSimpleString()">Open Simple String</button>
				<button hubButton color="secondary" (click)="openMarkupString()">Markup As Text</button>

				@if (portalResult()) {
					<div class="result-box mt-3">
						{{ portalResult() }}
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
				margin-bottom: 0.5rem;
			}
			.btn-primary {
				background: #3b82f6;
				color: white;
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
			:host ::ng-deep .string-portal {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: white;
				padding: 2rem;
				border-radius: 8px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
				max-width: 500px;
				z-index: 1050;
			}
		`
	]
})
export class StringContentExampleComponent {
	private _portal = inject(HubPortal);
	portalResult = signal<string>('');

	/**
	 * Opens a portal whose content is a plain string and reports when it closes.
	 */
	openSimpleString() {
		this.portalResult.set('');

		const portalRef = this._portal.open('This is a simple string rendered in a portal. Press Esc to close it.', {
			windowClass: 'string-portal',
			animation: true
		});

		portalRef.closed.subscribe(() => this.portalResult.set('Simple string portal closed'));
		portalRef.dismissed.subscribe(() => this.portalResult.set('Simple string portal dismissed'));
	}

	/**
	 * Shows what a string portal does with markup: nothing. `open()` inserts the string as a
	 * text node, so tags arrive as characters rather than as elements. Anything that has to
	 * render is a component or a `TemplateRef`.
	 */
	openMarkupString() {
		this.portalResult.set('');

		const portalRef = this._portal.open('<strong>Not bold</strong> — a string is inserted as text. Press Esc to close.', {
			windowClass: 'string-portal',
			animation: true
		});

		portalRef.closed.subscribe(() => this.portalResult.set('Markup string portal closed'));
		portalRef.dismissed.subscribe(() => this.portalResult.set('Markup string portal dismissed'));
	}

	static readonly templateCode = `<button (click)="openSimpleString()">Simple String</button>
<button (click)="openMarkupString()">Markup As Text</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubPortal } from 'ng-hub-ui-portal';

@Component({...})
export class StringContentExample {
  private portal = inject(HubPortal);

  openSimpleString() {
    this.portal.open('Simple string content!', {
      windowClass: 'custom-portal'
    });
  }

  // A string is inserted as a text node, so markup arrives as characters.
  // Use a component or a TemplateRef when something has to render.
  openMarkupString() {
    this.portal.open('<strong>Not bold</strong>', {
      windowClass: 'custom-portal'
    });
  }
}`;
}
