import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { HubLoadingService } from 'ng-hub-ui-loading';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Hard ceiling on how long the fullscreen overlay may stay up, in milliseconds.
 *
 * A fullscreen overlay covers the button that would dismiss it, so a lost `hide()` is not a
 * cosmetic bug in a documentation page — it locks the reader out of the site. Every path here
 * is already paired, and this watchdog exists for the paths that are not: it force-releases
 * every reference regardless of what the demo thinks it is holding.
 */
const MAX_VISIBLE_MS = 5000;

/** How long the single-request demo pretends to work. */
const SINGLE_MS = 2000;

/** Durations of the two overlapping requests, and when the message is rewritten mid-flight. */
const FIRST_MS = 1500;
const SECOND_MS = 3200;
const UPDATE_AT_MS = 1800;

/** Most log lines kept on screen. */
const LOG_LIMIT = 6;

/**
 * `HubLoadingService` — the fullscreen overlay driven from TypeScript rather than a template.
 *
 * The point of the service is the reference counter, and the second button is what makes it
 * visible. Two requests start together and finish at different times; the first `hide()` does
 * not tear the overlay down, because the second request still holds a reference. Only when the
 * count reaches zero does the overlay go away. That is the behaviour a naive boolean flag gets
 * wrong: whichever request finishes first switches the flag off and the screen unblocks while
 * the other is still in flight.
 *
 * `update()` is the other half. It rewrites the message on the live overlay without touching
 * the counter, so a long operation can narrate itself instead of showing one frozen sentence.
 *
 * Note how this component treats the overlay as a resource rather than a state: every `show()`
 * has exactly one `hide()`, `ngOnDestroy` releases whatever is still held, and a watchdog
 * force-releases everything after {@link MAX_VISIBLE_MS}. In production the pairing usually
 * belongs in a `finalize()` on the request, not in a timer.
 */
@Component({
	selector: 'app-loading-fullscreen-service-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="alert alert-info small d-flex align-items-start gap-2 py-2">
			<i class="fa-solid fa-circle-info mt-1"></i>
			<span>
				The overlay covers the whole viewport, so this demo dismisses it for you: every request releases its own
				reference, and a watchdog forces a <code>hideAll()</code> after {{ maxVisibleSeconds }} seconds no matter what.
			</span>
		</div>

		<div class="d-flex flex-wrap gap-2 mb-3">
			<button type="button" hubButton color="primary" [disabled]="held() > 0" (click)="runSingleRequest()">
				One request ({{ singleSeconds }} s)
			</button>
			<button
				type="button"
				hubButton
				variant="outline"
				color="primary"
				[disabled]="held() > 0"
				(click)="runConcurrentRequests()"
			>
				Two concurrent requests
			</button>
			<button type="button" hubButton variant="outline" color="secondary" [disabled]="held() === 0" (click)="forceHide()">
				hideAll()
			</button>
		</div>

		<div class="d-flex flex-wrap gap-4 border rounded-3 p-3">
			<div>
				<div class="text-uppercase text-muted small">References held</div>
				<div class="fs-4 fw-semibold">{{ held() }}</div>
			</div>
			<div>
				<div class="text-uppercase text-muted small">isLoading()</div>
				<div class="fs-4 fw-semibold">{{ loading.isLoading() }}</div>
			</div>
			<div class="flex-grow-1" style="min-width: 16rem;">
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
	`,
	styles: []
})
export class FullscreenServiceLoadingExampleComponent implements OnDestroy {
	/** Public so the template can read the service's own `isLoading` signal directly. */
	protected readonly loading = inject(HubLoadingService);

	/** This demo's mirror of the service counter, so the two can be compared on screen. */
	protected readonly held = signal(0);

	/** Rolling call log, oldest first. */
	protected readonly log = signal<string[]>([]);

	/** Every pending timer, so a destroyed component cannot fire a `hide()` into the void. */
	private readonly timers = new Set<ReturnType<typeof setTimeout>>();

	/** The force-release timer. Re-armed on each `show()`, cleared when the count reaches zero. */
	private watchdog: ReturnType<typeof setTimeout> | null = null;

	/** Seconds shown in the demo copy, derived so the text cannot drift from the constants. */
	protected readonly maxVisibleSeconds = MAX_VISIBLE_MS / 1000;
	protected readonly singleSeconds = SINGLE_MS / 1000;

	/**
	 * Releases anything still held when the reader navigates away mid-request. Without this,
	 * a lazily destroyed example would leave a fullscreen overlay attached to `document.body`.
	 */
	ngOnDestroy(): void {
		this.releaseEverything();
	}

	/** One request: a single `show()` / `hide()` pair. */
	protected runSingleRequest(): void {
		this.log.set([]);
		this.acquire('saving changes', 'Saving your changes', SINGLE_MS);
	}

	/**
	 * Two overlapping requests. The first finishes while the second is still running, so the
	 * overlay survives the first `hide()` — which is the whole reason the counter exists.
	 */
	protected runConcurrentRequests(): void {
		this.log.set([]);
		// Both requests open with the same message: there is one overlay, so the second show()
		// would otherwise overwrite the first one's text the instant it starts.
		this.acquire('request A', 'Fetching the first batch', FIRST_MS);
		this.acquire('request B', 'Fetching the first batch', SECOND_MS);

		this.schedule(UPDATE_AT_MS, () => {
			if (this.held() === 0) {
				return;
			}
			this.loading.update({ message: 'Still fetching the second batch' });
			this.append('update({ message })');
		});
	}

	/** Drops every outstanding reference at once, the way an error handler would. */
	protected forceHide(): void {
		this.releaseEverything();
		this.append('hideAll()');
	}

	/**
	 * Shows the overlay for one logical request and schedules the matching release.
	 *
	 * @param label Name used in the on-screen log.
	 * @param message Message shown on the overlay.
	 * @param duration How long the fake request takes, in milliseconds.
	 */
	private acquire(label: string, message: string, duration: number): void {
		this.loading.show({ message });
		this.held.update((count) => count + 1);
		this.append(`show() — ${label}`);
		this.armWatchdog();
		this.schedule(duration, () => this.release(label));
	}

	/** Releases one reference. The overlay only disappears when the last one is released. */
	private release(label: string): void {
		this.loading.hide();
		const remaining = Math.max(0, this.held() - 1);
		this.held.set(remaining);
		this.append(`hide() — ${label}`);

		if (remaining === 0) {
			this.clearWatchdog();
		}
	}

	/** Clears every timer and forces the service back to zero references. */
	private releaseEverything(): void {
		this.timers.forEach((handle) => clearTimeout(handle));
		this.timers.clear();
		this.clearWatchdog();
		this.loading.hideAll();
		this.held.set(0);
	}

	/** Registers a timer so it can be cancelled on destroy. */
	private schedule(delay: number, task: () => void): void {
		const handle = setTimeout(() => {
			this.timers.delete(handle);
			task();
		}, delay);
		this.timers.add(handle);
	}

	/** (Re)arms the force-release timer that guarantees the overlay cannot outlive the demo. */
	private armWatchdog(): void {
		this.clearWatchdog();
		this.watchdog = setTimeout(() => {
			this.releaseEverything();
			this.append('hideAll() — watchdog');
		}, MAX_VISIBLE_MS);
	}

	/** Cancels the force-release timer. */
	private clearWatchdog(): void {
		if (this.watchdog !== null) {
			clearTimeout(this.watchdog);
			this.watchdog = null;
		}
	}

	/** Appends one line to the rolling log. */
	private append(entry: string): void {
		this.log.update((entries) => [...entries, entry].slice(-LOG_LIMIT));
	}

	static readonly templateCode = `<button type="button" (click)="runConcurrentRequests()">Two concurrent requests</button>
<button type="button" [disabled]="held() === 0" (click)="forceHide()">hideAll()</button>

<p>References held: {{ held() }} — isLoading(): {{ loading.isLoading() }}</p>`;

	static readonly componentCode = `import { Component, OnDestroy, inject, signal } from '@angular/core';
import { HubLoadingService } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  templateUrl: './fullscreen-service-loading-example.component.html'
})
export class FullscreenServiceLoadingExampleComponent implements OnDestroy {
  protected readonly loading = inject(HubLoadingService);
  protected readonly held = signal(0);

  /**
   * Two overlapping requests. The first hide() does NOT tear the overlay down,
   * because the second request still holds a reference — that is the counter.
   */
  protected runConcurrentRequests(): void {
    this.acquire('Fetching the first batch', 1500);
    this.acquire('Fetching the first batch', 3200);

    // update() rewrites the live message without touching the counter.
    setTimeout(() => this.loading.update({ message: 'Still fetching the second batch' }), 1800);
  }

  private acquire(message: string, duration: number): void {
    this.loading.show({ message });
    this.held.update((count) => count + 1);
    // In production this pairing belongs in finalize(), not in a timer.
    setTimeout(() => {
      this.loading.hide();
      this.held.update((count) => Math.max(0, count - 1));
    }, duration);
  }

  /** A fullscreen overlay covers its own dismiss button — never leave one behind. */
  ngOnDestroy(): void {
    this.loading.hideAll();
    this.held.set(0);
  }
}`;
}
