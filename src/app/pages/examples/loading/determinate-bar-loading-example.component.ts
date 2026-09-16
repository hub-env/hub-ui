import { ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubLoadingBarComponent } from 'ng-hub-ui-loading';

/** How often the simulated upload reports, in milliseconds. */
const TICK_MS = 220;

/** How much of the file each report accounts for. */
const TICK_STEP = 7;

/**
 * The two honest answers to "how far along is this?", side by side.
 *
 * Binding `progress` takes the bar off the shared page state and hands it to the caller.
 * Use it when the percentage is real — an upload that reports bytes, an import that knows
 * its row count. The bar then publishes `aria-valuenow`, because for once there is a
 * number worth announcing.
 *
 * `indeterminate` is the other honest answer: a sweep, for work with no measurable
 * progress at all. Note what it does to the accessibility contract — the value is
 * withheld again, which is precisely how ARIA marks a progressbar whose position is
 * unknown. The alternative, announcing a made-up percentage, is the thing worth avoiding.
 *
 * The third state is `null`, which hides the bar. Together the three cover the whole
 * input: unbound follows the service, a number drives the bar, `null` puts it away.
 */
@Component({
	selector: 'app-loading-determinate-bar-example',
	standalone: true,
	imports: [HubButtonComponent, HubLoadingBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-3 align-items-stretch mb-3">
			<div class="border rounded-3 p-3 flex-grow-1" style="min-width: 18rem;">
				<div class="d-flex align-items-baseline justify-content-between mb-2">
					<h6 class="mb-0">Known percentage</h6>
					<span class="font-monospace small text-muted">[progress]="{{ uploaded() ?? 'null' }}"</span>
				</div>

				<hub-loading-bar [progress]="uploaded()" color="success" ariaLabel="Uploading the archive" />

				<p class="text-muted small mb-3 mt-2">
					A real value, so the bar announces it. Reaching 100% is the caller's call, not the trickle's.
				</p>

				<div class="d-flex flex-wrap gap-2">
					<button type="button" hubButton color="success" [disabled]="running()" (click)="upload()">
						Upload a file
					</button>
					<button type="button" hubButton variant="outline" color="secondary" (click)="clear()">Hide (null)</button>
				</div>
			</div>

			<div class="border rounded-3 p-3 flex-grow-1" style="min-width: 18rem;">
				<div class="d-flex align-items-baseline justify-content-between mb-2">
					<h6 class="mb-0">No percentage at all</h6>
					<span class="font-monospace small text-muted">indeterminate</span>
				</div>

				<hub-loading-bar
					[progress]="sweeping() ? 100 : null"
					indeterminate
					color="primary"
					ariaLabel="Streaming results"
				/>

				<p class="text-muted small mb-3 mt-2">
					A sweep instead of a fill, for a stream or a job that reports no stages. No value is announced, because
					there is none.
				</p>

				<button type="button" hubButton variant="outline" color="primary" (click)="sweeping.set(!sweeping())">
					{{ sweeping() ? 'Stop' : 'Start' }} the sweep
				</button>
			</div>
		</div>

		<p class="text-muted small mb-0">
			Both bars are <code>mode="inline"</code>, so each reserves its own row and nothing on the card moves when a bar
			appears or goes away.
		</p>
	`,
	styles: []
})
export class DeterminateBarLoadingExampleComponent implements OnDestroy {
	/** Percentage uploaded, or `null` while there is nothing to report. */
	protected readonly uploaded = signal<number | null>(null);

	/** Whether the sweeping bar is on screen. */
	protected readonly sweeping = signal(true);

	/** True while the simulated upload is running, so the button cannot be double-fired. */
	protected readonly running = signal(false);

	/** The reporting timer, cleared on destroy so it cannot outlive the example. */
	private ticker: ReturnType<typeof setInterval> | null = null;

	ngOnDestroy(): void {
		this.stop();
	}

	/** Runs a simulated upload that reports a real percentage as it goes. */
	protected upload(): void {
		this.stop();
		this.uploaded.set(0);
		this.running.set(true);

		this.ticker = setInterval(() => {
			const next = (this.uploaded() ?? 0) + TICK_STEP;

			if (next >= 100) {
				this.uploaded.set(100);
				this.stop();
				return;
			}

			this.uploaded.set(next);
		}, TICK_MS);
	}

	/** Puts the bar away by binding `null`, which is the third meaning of the input. */
	protected clear(): void {
		this.stop();
		this.uploaded.set(null);
	}

	/** Stops the reporting timer. */
	private stop(): void {
		if (this.ticker !== null) {
			clearInterval(this.ticker);
			this.ticker = null;
		}

		this.running.set(false);
	}

	static readonly templateCode = `<!-- A real percentage: the bar publishes aria-valuenow -->
<hub-loading-bar [progress]="uploaded()" color="success" ariaLabel="Uploading the archive" />

<!-- No percentage worth inventing: a sweep, and no value announced -->
<hub-loading-bar [progress]="100" indeterminate color="primary" ariaLabel="Streaming results" />

<!-- Binding null puts the bar away -->
<hub-loading-bar [progress]="null" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubLoadingBarComponent } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingBarComponent],
  templateUrl: './determinate-bar-loading-example.component.html'
})
export class DeterminateBarLoadingExampleComponent {
  /**
   * The three states of the input, in one signal:
   * a number drives the bar, null hides it, and leaving it unbound
   * would hand the bar back to HubLoadingBarService.
   */
  protected readonly uploaded = signal<number | null>(null);

  protected upload(): void {
    this.uploaded.set(0);
    this.http.post('/api/files', body, { reportProgress: true, observe: 'events' }).subscribe((event) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        this.uploaded.set(Math.round((100 * event.loaded) / event.total));
      }
    });
  }
}`;
}
