import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastConfigService, HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates configuration on both levels: the application-wide defaults a call
 * inherits (`provideToast()`, read back here through `HubToastConfigService.defaults`)
 * and the per-call overrides that beat them — progressBar, closeButton, tapToDismiss,
 * the accessible name of the close button and a persistent toast with timeOut=0.
 */
@Component({
	selector: 'app-config-toast-example',
	standalone: true,
	imports: [FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="row g-3 mb-3">
			<div class="col-auto">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" id="progressBar" [(ngModel)]="progressBar" />
					<label class="form-check-label" for="progressBar">Progress bar</label>
				</div>
			</div>
			<div class="col-auto">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" id="closeButton" [(ngModel)]="closeButton" />
					<label class="form-check-label" for="closeButton">Close button</label>
				</div>
			</div>
			<div class="col-auto">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" id="tapToDismiss" [(ngModel)]="tapToDismiss" />
					<label class="form-check-label" for="tapToDismiss">Tap to dismiss</label>
				</div>
			</div>
		</div>

		<div class="row g-2 align-items-end mb-3">
			<div class="col-auto">
				<label class="form-label small mb-1" for="closeButtonAriaLabel">Close button name</label>
				<input
					class="form-control form-control-sm"
					type="text"
					id="closeButtonAriaLabel"
					[(ngModel)]="closeButtonAriaLabel"
				/>
			</div>
			<div class="col">
				<p class="small text-muted mb-1">
					The × is decorative, so this string is the whole name a screen reader announces for the toast's only
					control. The library ships it as the English <code>"{{ globalCloseButtonAriaLabel }}"</code> and translates
					nothing: set it once for the application with
					<code>provideToast({{ '{' }} closeButtonAriaLabel {{ '}' }})</code>, or per call as this demo does.
				</p>
			</div>
		</div>

		<div class="d-flex flex-wrap gap-2">
			<button hubButton color="primary" (click)="showConfigured()">Show toast with options</button>
			<button hubButton variant="outline" color="secondary" (click)="showPersistent()">
				Show persistent (timeOut=0)
			</button>
		</div>
	`
})
export class ConfigToastExampleComponent {
	private readonly _toast = inject(HubToastService);
	private readonly _config = inject(HubToastConfigService);

	progressBar = true;
	closeButton = true;
	tapToDismiss = true;

	/**
	 * What a call inherits when it says nothing: the library defaults with whatever
	 * `provideToast()` set over them. Read rather than repeated, so the demo cannot
	 * claim a default the library does not actually ship.
	 */
	readonly globalCloseButtonAriaLabel = this._config.defaults.closeButtonAriaLabel;

	/** Seeded from the global default, then overridden per call by the field above. */
	closeButtonAriaLabel = this.globalCloseButtonAriaLabel;

	showConfigured(): void {
		this._toast.info('Configured toast notification.', 'Options', {
			progressBar: this.progressBar,
			closeButton: this.closeButton,
			tapToDismiss: this.tapToDismiss,
			closeButtonAriaLabel: this.closeButtonAriaLabel
		});
	}

	showPersistent(): void {
		this._toast.warning('This toast will not auto-dismiss. Click the × to close it.', 'Persistent', {
			timeOut: 0,
			closeButton: true,
			tapToDismiss: false,
			closeButtonAriaLabel: this.closeButtonAriaLabel
		});
	}

	static readonly templateCode = `<div class="form-check form-switch mb-2">
  <input class="form-check-input" type="checkbox" [(ngModel)]="progressBar" />
  <label class="form-check-label">Progress bar</label>
</div>

<label class="form-label small" for="closeButtonAriaLabel">Close button name</label>
<input class="form-control form-control-sm" id="closeButtonAriaLabel" [(ngModel)]="closeButtonAriaLabel" />

<button hubButton color="primary" (click)="showConfigured()">Show</button>
<button hubButton variant="outline" color="secondary" (click)="showPersistent()">Persistent</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastConfigService, HubToastService } from 'ng-hub-ui-toast';

// Application-wide defaults, set once. Everything a call does not name is inherited
// from here — including closeButtonAriaLabel, which the library ships as the English
// 'Close' and never translates.
//
//   export const appConfig: ApplicationConfig = {
//     providers: [provideToast({ closeButtonAriaLabel: 'Cerrar', progressBar: true })]
//   };

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './config-toast-example.component.html'
})
export class ConfigToastExampleComponent {
  private readonly toast = inject(HubToastService);
  private readonly config = inject(HubToastConfigService);

  progressBar = true;
  closeButton = true;
  tapToDismiss = true;

  // What a call inherits when it says nothing, read instead of repeated.
  readonly globalCloseButtonAriaLabel = this.config.defaults.closeButtonAriaLabel;
  closeButtonAriaLabel = this.globalCloseButtonAriaLabel;

  showConfigured() {
    this.toast.info('Configured toast.', 'Options', {
      progressBar: this.progressBar,
      closeButton: this.closeButton,
      tapToDismiss: this.tapToDismiss,
      closeButtonAriaLabel: this.closeButtonAriaLabel
    });
  }

  showPersistent() {
    this.toast.warning('Click × to close.', 'Persistent', {
      timeOut: 0,
      closeButton: true,
      tapToDismiss: false,
      closeButtonAriaLabel: this.closeButtonAriaLabel
    });
  }
}`;
}
