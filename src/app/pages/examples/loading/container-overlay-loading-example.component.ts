import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/**
 * `mode="overlay"` covers one region instead of the whole page.
 *
 * The single hard requirement is the one this example makes visible: the overlay is
 * positioned absolutely, so its nearest positioned ancestor decides what gets covered.
 * The card below carries Bootstrap's `position-relative`, which is why the overlay stops
 * at the card border. Forget it and the overlay escapes upwards to whatever ancestor
 * happens to be positioned — usually the page — and the bug reads as "the overlay is in
 * the wrong place" when it is really "the container was never positioned".
 *
 * Scoping it this way keeps the surrounding page live: the reader can still scroll, use the
 * navigation and read the numbers that are not being recalculated. That is the argument for
 * an overlay over a fullscreen block whenever the work affects only part of the screen.
 */
@Component({
	selector: 'app-loading-container-overlay-example',
	standalone: true,
	imports: [HubLoadingComponent, HubButtonComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3 mb-3">
			<button type="button" hubButton color="primary" (click)="toggle()">
				{{ busy() ? 'Stop recalculating' : 'Recalculate totals' }}
			</button>

			<div class="form-check form-switch mb-0">
				<input
					id="loading-overlay-backdrop"
					class="form-check-input"
					type="checkbox"
					[checked]="backdrop()"
					(change)="backdrop.set(!backdrop())"
				/>
				<label class="form-check-label small" for="loading-overlay-backdrop">Backdrop</label>
			</div>
		</div>

		<!-- position-relative is what confines the overlay to this card -->
		<hub-panel class="position-relative" style="max-width: 30rem;">
			<div>
				<h5 class="card-title mb-1">Order #4821</h5>
				<p class="card-subtitle text-muted small mb-3">3 items &middot; delivered 14 Aug 2026</p>

				<dl class="row mb-0 small">
					@for (line of lines; track line.label) {
						<dt class="col-7 fw-normal text-muted">{{ line.label }}</dt>
						<dd class="col-5 text-end mb-1">{{ line.amount }}</dd>
					}
					<dt class="col-7 border-top pt-2">Total</dt>
					<dd class="col-5 border-top pt-2 text-end fw-semibold mb-0">248.60 &euro;</dd>
				</dl>
			</div>

			@if (busy()) {
				<hub-loading mode="overlay" variant="ring" [backdrop]="backdrop()" message="Recalculating totals" />
			}
		</hub-panel>

		<p class="text-muted small mb-0 mt-3">
			Turn the backdrop off to keep the content readable underneath — useful when the work is a background refresh rather
			than something that invalidates what is on screen.
		</p>
	`,
	styles: []
})
export class ContainerOverlayLoadingExampleComponent {
	/** Whether the card is covered right now. */
	protected readonly busy = signal(false);

	/** Drives the `backdrop` input so the demo can show both states of the same overlay. */
	protected readonly backdrop = signal(true);

	/** Static rows, present only so there is real content for the overlay to cover. */
	protected readonly lines = [
		{ label: 'Subtotal', amount: '212.00 €' },
		{ label: 'Shipping', amount: '9.90 €' },
		{ label: 'VAT (21%)', amount: '26.70 €' }
	];

	/** Toggles the overlay from the demo button. */
	protected toggle(): void {
		this.busy.update((value) => !value);
	}

	static readonly templateCode = `<!-- position-relative is what confines the overlay to this card -->
<hub-panel class="position-relative">
  <div>
    <h5 class="card-title">Order #4821</h5>
    <!-- ... the content the overlay covers ... -->
  </div>

  @if (busy()) {
    <hub-loading
      mode="overlay"
      variant="ring"
      [backdrop]="backdrop()"
      message="Recalculating totals"
    />
  }
</hub-panel>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingComponent],
  templateUrl: './container-overlay-loading-example.component.html'
})
export class ContainerOverlayLoadingExampleComponent {
  protected readonly busy = signal(false);
  protected readonly backdrop = signal(true);

  protected toggle(): void {
    this.busy.update((value) => !value);
  }
}`;
}
