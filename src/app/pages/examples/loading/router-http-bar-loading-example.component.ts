import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubLoadingBarComponent, HubLoadingBarService } from 'ng-hub-ui-loading';

/** Duration of each simulated caller, in milliseconds. */
const NAVIGATION_MS = 2600;
const REQUEST_MS = [900, 1700, 3400];

/** Hard ceiling, so no simulated caller can strand the bar. */
const MAX_RUNNING_MS = 6000;

/** Most log lines kept on screen. */
const LOG_LIMIT = 7;

/**
 * Why the bar counts its callers instead of holding a boolean.
 *
 * A single page load is rarely a single wait. The route resolves, and then the page fires
 * three requests of its own. With a boolean, the first one to come back switches the bar
 * off and the reader watches an empty page with nothing loading on it. With a counter, the
 * bar finishes when the last caller does.
 *
 * That is also what lets the two integrations be combined without either knowing about the
 * other: `provideHubLoadingBarRouter()` holds one reference for the navigation,
 * `hubLoadingBarInterceptor` holds one per request, and hand-written `start()` calls add
 * theirs. Nobody coordinates; the count does.
 *
 * The last button is the escape hatch that stops the whole arrangement from being a
 * footgun. A poll on a timer is a request the reader never asked about, and left visible it
 * would hold the bar open forever — `withoutHubLoadingBar()` takes it out of the count.
 */
@Component({
	selector: 'app-loading-router-http-bar-example',
	standalone: true,
	imports: [HubButtonComponent, HubLoadingBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HubLoadingBarService],
	template: `
		<div class="border rounded-3 overflow-hidden mb-3">
			<div class="position-relative px-3 py-2 bg-body-tertiary border-bottom">
				<span class="fw-semibold small">Dashboard</span>
				<hub-loading-bar mode="overlay" placement="bottom" style="--hub-loading-bar-height: 4px;" />
			</div>

			<div class="d-flex flex-wrap gap-4 p-3 bg-body">
				<div>
					<div class="text-uppercase text-muted small">Callers</div>
					<div class="fs-lg fw-semibold font-tabular-nums">{{ held() }}</div>
				</div>
				<div>
					<div class="text-uppercase text-muted small">isActive()</div>
					<div class="fs-lg fw-semibold">{{ bar.isActive() }}</div>
				</div>
				<div>
					<div class="text-uppercase text-muted small">progress()</div>
					<div class="fs-lg fw-semibold font-tabular-nums">{{ roundedProgress() }}%</div>
				</div>
				<div class="flex-grow-1" style="min-width: 15rem;">
					<div class="text-uppercase text-muted small mb-1">Calls</div>
					@if (log().length) {
						<ul class="list-unstyled mb-0 small font-monospace">
							@for (entry of log(); track $index) {
								<li>{{ entry }}</li>
							}
						</ul>
					} @else {
						<p class="text-muted small mb-0">Nothing yet.</p>
					}
				</div>
			</div>
		</div>

		<div class="d-flex flex-wrap gap-2">
			<button type="button" hubButton color="primary" [disabled]="bar.isActive()" (click)="loadPage()">
				Navigate, then fetch its data
			</button>
			<button type="button" hubButton variant="outline" color="secondary" (click)="poll()">
				Background poll (opted out)
			</button>
			<button type="button" hubButton variant="ghost" color="secondary" [disabled]="!bar.isActive()" (click)="abort()">
				completeAll()
			</button>
		</div>
	`,
	styles: []
})
export class RouterHttpBarLoadingExampleComponent implements OnDestroy {
	/** Public so the template can read the bar's own signals directly. */
	protected readonly bar = inject(HubLoadingBarService);

	/** This demo's mirror of the counter, so the two can be compared on screen. */
	protected readonly held = signal(0);

	/** Rolling call log, oldest first. */
	protected readonly log = signal<string[]>([]);

	/** Whole-number fill, so the readout does not jitter through fifteen decimals. */
	protected readonly roundedProgress = computed(() => Math.round(this.bar.progress()));

	/** Pending timers, so a destroyed example cannot release a caller into the void. */
	private readonly timers = new Set<ReturnType<typeof setTimeout>>();

	ngOnDestroy(): void {
		this.abort();
	}

	/**
	 * One navigation plus the three requests the page fires once it is there — four
	 * overlapping callers, one bar.
	 */
	protected loadPage(): void {
		this.log.set([]);
		this.acquire('router: NavigationStart', NAVIGATION_MS);

		REQUEST_MS.forEach((duration, index) => {
			this.acquire(`http: GET /api/widget-${index + 1}`, duration);
		});

		this.schedule(MAX_RUNNING_MS, () => this.abort());
	}

	/**
	 * A request the reader never asked about. It is opted out, so the counter does not move
	 * and the bar stays exactly as it was.
	 */
	protected poll(): void {
		this.append('http: GET /api/heartbeat — skipped');
	}

	/** Drops every outstanding caller at once, the way an error handler would. */
	protected abort(): void {
		this.timers.forEach((handle) => clearTimeout(handle));
		this.timers.clear();
		this.bar.completeAll();
		this.held.set(0);
	}

	/** Registers one caller and schedules its release. */
	private acquire(label: string, duration: number): void {
		this.bar.start();
		this.held.update((count) => count + 1);
		this.append(`start() — ${label}`);

		this.schedule(duration, () => {
			this.bar.complete();
			this.held.update((count) => Math.max(0, count - 1));
			this.append(`complete() — ${label}`);
		});
	}

	/** Registers a timer so it can be cancelled on destroy. */
	private schedule(delay: number, task: () => void): void {
		const handle = setTimeout(() => {
			this.timers.delete(handle);
			task();
		}, delay);
		this.timers.add(handle);
	}

	/** Appends one line to the rolling log. */
	private append(entry: string): void {
		this.log.update((entries) => [...entries, entry].slice(-LOG_LIMIT));
	}

	static readonly templateCode = `<!-- One bar in the shell is all the application needs -->
<nav class="navbar position-relative">
  …
  <hub-loading-bar mode="overlay" placement="bottom" />
</nav>`;

	static readonly componentCode = `import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  hubLoadingBarInterceptor,
  provideHubLoadingBar,
  provideHubLoadingBarRouter,
  withoutHubLoadingBar
} from 'ng-hub-ui-loading';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    // One reference per navigation, released when it settles — including when a
    // guard rejects it, which is how a bar normally gets stranded.
    provideHubLoadingBarRouter(),

    // One reference per request. finalize() balances it on success, on error and
    // on cancellation alike.
    provideHttpClient(withInterceptors([hubLoadingBarInterceptor])),

    provideHubLoadingBar({ color: 'primary', delay: 120 })
  ]
});

// A poll the reader never asked about would hold the bar open forever.
this.http.get('/api/heartbeat', { context: withoutHubLoadingBar() });`;
}
