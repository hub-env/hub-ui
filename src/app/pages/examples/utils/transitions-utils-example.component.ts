import {
	afterNextRender,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	NgZone,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { hubCompleteTransition, hubRunTransition, type TransitionOptions } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `hubRunTransition()` turning a CSS transition into an observable that completes when the
 * transition does — which is the only reliable moment to destroy the element it was running on.
 *
 * Three behaviours are worth watching in the log. With `animation: false` the observable
 * completes synchronously, the same path taken when the computed `transition-property` is
 * `none`, so a reduced-motion user never waits. With `animation: true` the helper sizes a
 * safety timer from the element's own `transition-duration` and `transition-delay`, because
 * `transitionend` never fires if the element is scrolled out of view or the tab goes
 * inactive. And `hubCompleteTransition()` releases a run that is still in flight.
 */
@Component({
	selector: 'app-utils-transitions-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-2 mb-3">
			<button type="button" hubButton color="primary" (click)="toggle(true)">
				{{ expanded() ? 'Collapse' : 'Expand' }} (animation: true)
			</button>
			<button type="button" hubButton variant="outline" color="primary" (click)="toggle(false)">
				{{ expanded() ? 'Collapse' : 'Expand' }} (animation: false)
			</button>
			<button type="button" hubButton variant="outline" color="secondary" [disabled]="!running()" (click)="cutShort()">
				hubCompleteTransition()
			</button>
		</div>

		<div #panel class="transition-panel" [class.transition-panel--running]="running()">
			<span class="small">transition: height 600ms · measured at {{ measuredDurationMs() }} ms</span>
		</div>

		<ol class="small font-monospace text-muted mt-3 mb-0 ps-3">
			@for (entry of log(); track $index) {
				<li>{{ entry }}</li>
			} @empty {
				<li class="list-unstyled">Run a transition to see when the observable completes.</li>
			}
		</ol>
	`,
	styles: `
		.transition-panel {
			display: flex;
			align-items: flex-end;
			padding: 0.5rem 0.75rem;
			height: 3rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			transition: height 600ms ease;
		}
		.transition-panel.is-expanded {
			height: 9rem;
		}
		.transition-panel--running {
			border-color: var(--hub-sys-color-primary, #0d6efd);
		}
	`
})
export class TransitionsUtilsExampleComponent {
	private readonly zone = inject(NgZone);
	private readonly destroyRef = inject(DestroyRef);

	/** The element whose height transition is being driven. */
	private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

	/** Whether the panel is currently in its expanded state. */
	protected readonly expanded = signal(false);

	/** Whether a transition is in flight, which is when cutting it short means anything. */
	protected readonly running = signal(false);

	/** What the helper reported, newest last. */
	protected readonly log = signal<string[]>([]);

	/** The duration read off the element, the same figure the helper uses for its timer. */
	protected readonly measuredDurationMs = signal(0);

	constructor() {
		// getComputedStyle needs a laid-out element, so the reading waits for the first render.
		afterNextRender(() => this.measuredDurationMs.set(this.readDurationMs(this.panel().nativeElement)));
	}

	/**
	 * Toggles the panel through `hubRunTransition()`.
	 *
	 * `runningTransition: 'stop'` is what makes the toggle survive an impatient reader: a
	 * second click completes the run already in flight instead of queueing behind it.
	 */
	protected toggle(animation: boolean): void {
		const element = this.panel().nativeElement;
		const expanded = !this.expanded();
		const startedAt = performance.now();

		const options: TransitionOptions<void> = { animation, runningTransition: 'stop' };

		this.running.set(true);
		this.note(`hubRunTransition(zone, panel, fn, { animation: ${animation}, runningTransition: 'stop' })`);

		hubRunTransition(
			this.zone,
			element,
			(target) => {
				target.classList.toggle('is-expanded', expanded);
			},
			options
		)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				complete: () => {
					this.expanded.set(element.classList.contains('is-expanded'));
					this.running.set(false);
					this.note(`completed after ${Math.round(performance.now() - startedAt)} ms`);
				}
			});
	}

	/** Releases the run in flight, so a caller waiting on it is not left hanging. */
	protected cutShort(): void {
		this.note('hubCompleteTransition(panel)');
		hubCompleteTransition(this.panel().nativeElement);
	}

	/** Appends a line to the log, keeping only the last few. */
	private note(entry: string): void {
		this.log.update((entries) => [...entries, entry].slice(-6));
	}

	/** The element's own transition budget, delay included, in milliseconds. */
	private readDurationMs(element: HTMLElement): number {
		const { transitionDelay, transitionDuration } = window.getComputedStyle(element);
		return Math.round((parseFloat(transitionDelay) + parseFloat(transitionDuration)) * 1000);
	}

	static readonly templateCode = `<button (click)="toggle(true)">Expand</button>
<button (click)="cutShort()">hubCompleteTransition()</button>

<div #panel class="transition-panel"></div>`;

	static readonly componentCode = `import { Component, ElementRef, NgZone, inject, signal, viewChild } from '@angular/core';
import { hubCompleteTransition, hubRunTransition, type TransitionOptions } from 'ng-hub-ui-utils';

@Component({ /* … */ })
export class TransitionsExampleComponent {
  private readonly zone = inject(NgZone);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');

  protected readonly expanded = signal(false);

  toggle(animation: boolean): void {
    const element = this.panel().nativeElement;
    const expanded = !this.expanded();

    // 'stop' completes a run already in flight instead of queueing behind it;
    // 'continue' would cancel this call and let the running one finish.
    const options: TransitionOptions<void> = { animation, runningTransition: 'stop' };

    hubRunTransition(this.zone, element, (target) => {
      // The start function may return a teardown to run when the transition ends;
      // returning anything else is a type error, which is why this is a block.
      target.classList.toggle('is-expanded', expanded);
    }, options)
      // Completes when the CSS transition ends — or immediately when animation is false, or
      // when the computed transition-property is 'none' (reduced motion). Either way it
      // completes exactly once, which is what makes it safe to destroy the element here.
      .subscribe({ complete: () => this.expanded.set(expanded) });
  }

  cutShort(): void {
    // Releases the element and completes the observable without waiting out the duration.
    hubCompleteTransition(this.panel().nativeElement);
  }
}`;
}
