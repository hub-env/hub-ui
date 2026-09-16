import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubLoadingBarComponent, HubLoadingBarService } from 'ng-hub-ui-loading';

/** How long each simulated route takes to resolve, in milliseconds. */
const ROUTE_DURATION: Record<string, number> = {
	Orders: 1400,
	Reports: 3200,
	Settings: 40
};

/**
 * Hard ceiling on how long a simulated navigation may run.
 *
 * The bar does not cover anything, so a stranded one cannot lock the reader out — but it
 * would sit there claiming the page is still loading, which is its own kind of lie.
 */
const MAX_RUNNING_MS = 6000;

/**
 * The page-level bar: the thin strip under the navbar that reports navigation.
 *
 * Everything here hangs off `HubLoadingBarService`. In a real application nobody calls it
 * by hand — `provideHubLoadingBarRouter()` starts it on `NavigationStart` and completes it
 * when the navigation settles — but the buttons make the three behaviours visible one at a
 * time:
 *
 * - **Orders** is an ordinary route. The bar appears, trickles towards the end without
 *   ever arriving, and only jumps to 100% when the navigation actually settles.
 * - **Reports** is slow. Watch the trickle decelerate: the steps shrink as it fills, which
 *   is what keeps an invented number from running out of road before the real work ends.
 * - **Settings** resolves in 40 ms, and **no bar is ever painted**. That is the grace
 *   period doing its job — a cached route that flashes a progress bar reads as a glitch,
 *   not as speed.
 *
 * The service is provided on this component rather than taken from the root, so the demo
 * drives its own bar instead of whatever else the page is doing.
 */
@Component({
	selector: 'app-loading-page-progress-example',
	standalone: true,
	imports: [HubButtonComponent, HubLoadingBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [HubLoadingBarService],
	template: `
		<div class="border rounded-3 overflow-hidden mb-3">
			<!-- The mock application chrome. position-relative is what confines the
			     overlay bar to the navbar's box, so it hangs off its bottom edge. -->
			<div
				class="position-relative d-flex align-items-center justify-content-between px-3 py-2 bg-body-tertiary border-bottom"
			>
				<span class="fw-semibold">Acme</span>

				<nav class="d-flex gap-3 small">
					@for (route of routes; track route) {
						<span [class.fw-semibold]="route === current()" [class.text-muted]="route !== current()">
							{{ route }}
						</span>
					}
				</nav>

				<hub-loading-bar mode="overlay" placement="bottom" style="--hub-loading-bar-height: 4px;" />
			</div>

			<div class="p-4 bg-body">
				<h6 class="mb-1">{{ current() }}</h6>
				<p class="text-muted small mb-0">
					{{ bar.isActive() ? 'Resolving the route…' : 'This page arrived without you watching a spinner.' }}
				</p>
			</div>
		</div>

		<div class="d-flex flex-wrap gap-2 align-items-center">
			@for (route of routes; track route) {
				<button
					type="button"
					hubButton
					[variant]="route === 'Orders' ? 'solid' : 'outline'"
					color="primary"
					[disabled]="bar.isActive()"
					(click)="navigate(route)"
				>
					{{ route }} ({{ durationLabel(route) }})
				</button>
			}

			<span class="text-muted small ms-2"> progress {{ roundedProgress() }}% · painted: {{ bar.isVisible() }} </span>
		</div>
	`,
	styles: []
})
export class PageProgressLoadingExampleComponent implements OnDestroy {
	/** Public so the template can read the bar's own signals directly. */
	protected readonly bar = inject(HubLoadingBarService);

	/** The routes offered, in the order the buttons render them. */
	protected readonly routes = Object.keys(ROUTE_DURATION);

	/** Which mock page is currently shown. */
	protected readonly current = signal('Orders');

	/** Whole-number fill, so the readout does not jitter through fifteen decimals. */
	protected readonly roundedProgress = computed(() => Math.round(this.bar.progress()));

	/** Pending timers, so a destroyed example cannot complete a navigation into the void. */
	private readonly timers = new Set<ReturnType<typeof setTimeout>>();

	/** Releases the bar if the reader leaves while a simulated navigation is in flight. */
	ngOnDestroy(): void {
		this.timers.forEach((handle) => clearTimeout(handle));
		this.timers.clear();
		this.bar.reset();
	}

	/**
	 * Runs one simulated navigation.
	 *
	 * @param route Name of the mock route to resolve.
	 */
	protected navigate(route: string): void {
		this.bar.start();

		this.schedule(ROUTE_DURATION[route], () => {
			this.current.set(route);
			this.bar.complete();
		});

		// The demo equivalent of a `finalize()`: whatever happens, the bar is released.
		this.schedule(MAX_RUNNING_MS, () => this.bar.completeAll());
	}

	/** Human-readable duration for the button label. */
	protected durationLabel(route: string): string {
		const ms = ROUTE_DURATION[route];
		return ms < 1000 ? `${ms} ms` : `${ms / 1000} s`;
	}

	/** Registers a timer so it can be cancelled on destroy. */
	private schedule(delay: number, task: () => void): void {
		const handle = setTimeout(() => {
			this.timers.delete(handle);
			task();
		}, delay);
		this.timers.add(handle);
	}

	static readonly templateCode = `<!-- position-relative is what confines the bar to the navbar's box -->
<nav class="navbar position-relative">
  <span class="brand">Acme</span>
  …

  <hub-loading-bar mode="overlay" placement="bottom" />
</nav>

<!-- Or, hanging off a navbar that is itself fixed: -->
<hub-loading-bar mode="fixed" style="--hub-loading-bar-offset: 56px;" />`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubLoadingBarComponent, HubLoadingBarService } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingBarComponent],
  templateUrl: './page-progress-loading-example.component.html'
})
export class PageProgressLoadingExampleComponent {
  private readonly bar = inject(HubLoadingBarService);

  /**
   * In a real application you never write this: provideHubLoadingBarRouter()
   * starts the bar on NavigationStart and completes it when the navigation
   * settles. The pairing is the whole contract — every start() needs exactly
   * one complete(), which is why production code puts it in finalize().
   */
  protected navigate(route: string): void {
    this.bar.start();
    this.api.load(route).subscribe({
      complete: () => this.bar.complete()
    });
  }
}`;
}
