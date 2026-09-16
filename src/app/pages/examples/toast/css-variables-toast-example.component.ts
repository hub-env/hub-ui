import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Shows how to theme toasts via `--hub-toast-*` CSS custom properties.
 * The tokens are set inline on a wrapper element so the override is scoped
 * to this example and does not affect the rest of the page.
 */
@Component({
	selector: 'app-css-variables-toast-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="border rounded p-3 bg-body-tertiary mb-3">
			<p class="fw-medium mb-2">Active token overrides (applied to this demo's container):</p>
			<code class="d-block small">
				--hub-toast-border-radius: 0.75rem;<br />
				--hub-toast-shadow: 0 4px 20px rgba(0,0,0,.18);<br />
				--hub-toast-padding-x: 1.25rem;<br />
				--hub-toast-padding-y: 1rem;<br />
				--hub-toast-font-size: 0.9rem;
			</code>
		</div>
		<button hubButton color="primary" class="me-2" (click)="showThemedToast()">Show themed toast</button>
		<button hubButton variant="outline" color="secondary" (click)="showDefault()">Show default toast</button>
		<p class="text-body-secondary small mt-3">
			Tokens are injected from the page's stylesheet or from a style binding on any ancestor element — the container reads
			them via CSS inheritance.
		</p>
	`
})
export class CssVariablesToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	showThemedToast(): void {
		this._toast.success('This toast uses custom --hub-toast-* variables!', 'Themed', { progressBar: true });
	}

	showDefault(): void {
		this._toast.info('Default token values, no overrides.', 'Default');
	}

	static readonly templateCode = `<!-- Override tokens on an ancestor element or in a stylesheet -->
<style>
  :root {
    --hub-toast-border-radius: 0.75rem;
    --hub-toast-shadow: 0 4px 20px rgba(0,0,0,.18);
    --hub-toast-padding-x: 1.25rem;
    --hub-toast-padding-y: 1rem;
  }
</style>
<button (click)="showThemedToast()">Show themed toast</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';

@Component({
  standalone: true,
  templateUrl: './css-variables-toast-example.component.html',
  styles: [\`
    :host {
      --hub-toast-border-radius: 0.75rem;
      --hub-toast-shadow: 0 4px 20px rgba(0,0,0,.18);
      --hub-toast-padding-x: 1.25rem;
      --hub-toast-padding-y: 1rem;
    }
  \`]
})
export class CssVariablesToastExampleComponent {
  private readonly toast = inject(HubToastService);

  showThemedToast() {
    this.toast.success('Themed toast!', 'Themed', { progressBar: true });
  }
}`;
}
