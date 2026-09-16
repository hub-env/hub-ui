import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the loading / busy state of ng-hub-ui-buttons.
 *
 * While `loading` is true a button shows the animated spinner and is fully inert:
 * it reflects `aria-busy` + the native `disabled` attribute, drops out of the tab
 * order and ignores pointer / keyboard activation. The last button swaps the
 * spinner glyph itself through the `--hub-button-spinner` token (any SVG works).
 */
@Component({
	selector: 'app-loading-buttons-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.dots-loader {
				--hub-button-spinner: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='4' cy='12' r='3'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3Ccircle cx='20' cy='12' r='3'/%3E%3C/svg%3E");
				--hub-button-spinner-duration: 1.2s;
			}
		</style>
		<div class="d-flex flex-wrap align-items-center gap-2">
			<button hubButton variant="solid" color="primary" [loading]="saving()" (click)="toggle()">
				{{ saving() ? 'Saving… (click to stop)' : 'Save' }}
			</button>
			<button hubButton variant="outline" color="success" [loading]="true">Inert while loading</button>
			<button hubButton variant="soft" color="danger" [loading]="true" class="dots-loader">Custom SVG spinner</button>
		</div>
	`
})
export class LoadingButtonsExampleComponent {
	/** Drives the first button's spinner; toggled on click to show the round-trip. */
	protected readonly saving = signal(false);

	/** Flips the busy state so the spinner and inert treatment can be observed. */
	protected toggle(): void {
		this.saving.update((busy) => !busy);
	}

	static readonly templateCode = `<button hubButton color="primary" [loading]="saving()" (click)="toggle()">
  {{ saving() ? 'Saving…' : 'Save' }}
</button>

<!-- Swap the spinner glyph for any SVG through the token -->
<style>
  .dots-loader {
    --hub-button-spinner: url("data:image/svg+xml,%3Csvg …three dots…%3E");
    --hub-button-spinner-duration: 1.2s;
  }
</style>
<button hubButton color="danger" [loading]="true" class="dots-loader">Custom SVG spinner</button>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-loading-buttons-example',
  standalone: true,
  imports: [HubButtonComponent],
  templateUrl: './loading-buttons-example.component.html'
})
export class LoadingButtonsExampleComponent {
  // While loading, the button is busy + disabled: aria-busy, native disabled,
  // out of the tab order and inert to pointer/keyboard — no double submit.
  protected readonly saving = signal(false);
  protected toggle() { this.saving.update((busy) => !busy); }
}`;
}
