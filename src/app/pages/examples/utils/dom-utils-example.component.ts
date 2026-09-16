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
import { closest, getActiveElement, reflow, runInZone } from 'ng-hub-ui-utils';
import { interval } from 'rxjs';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The four helpers that exist because the browser does not quite offer them: `closest()`,
 * `reflow()`, `getActiveElement()` and the `runInZone()` operator.
 *
 * Each panel shows the difference the helper makes rather than only its return value —
 * skipping `reflow()` leaves the animation dead, `document.activeElement` stops at the shadow
 * host where `getActiveElement()` walks in, and a stream created outside Angular reports
 * `isInAngularZone() === false` until the operator puts it back.
 */
@Component({
	selector: 'app-utils-dom-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'(document:focusin)': 'readActiveElement()'
	},
	template: `
		<div class="row g-4">
			<div class="col-12 col-lg-6">
				<h6 class="fw-semibold">closest()</h6>
				<p class="small text-muted">Click anywhere inside; the helper walks up to the nearest panel.</p>
				<div class="dom-panel" data-panel="outer" (click)="readClosestPanel($event)">
					<span class="small">outer</span>
					<div class="dom-panel" data-panel="inner">
						<span class="small">inner</span>
						<button type="button" hubButton variant="outline" color="secondary" size="sm">a button</button>
					</div>
				</div>
				<p class="small font-monospace mt-2 mb-0">closest(target, '[data-panel]') → {{ closestPanel() }}</p>
			</div>

			<div class="col-12 col-lg-6">
				<h6 class="fw-semibold">reflow()</h6>
				<p class="small text-muted">
					Replaying an animation means removing the class and adding it back. Without a forced reflow the browser
					coalesces both into no change at all.
				</p>
				<div class="d-flex align-items-center gap-3">
					<span #badge class="dom-badge">replay me</span>
					<button type="button" hubButton color="primary" size="sm" (click)="replay()">Replay</button>
				</div>
				<div class="form-check mt-2">
					<input
						id="dom-skip-reflow"
						class="form-check-input"
						type="checkbox"
						[checked]="skipReflow()"
						(change)="skipReflow.set(readChecked($event))"
					/>
					<label class="form-check-label small" for="dom-skip-reflow">Skip the reflow() call</label>
				</div>
			</div>

			<div class="col-12 col-lg-6">
				<h6 class="fw-semibold">getActiveElement()</h6>
				<p class="small text-muted">Focus either control. The second one lives inside a shadow root.</p>
				<div class="d-flex align-items-center gap-2 flex-wrap">
					<input id="dom-plain-input" class="form-control form-control-sm w-auto" type="text" value="plain input" />
					<span #shadowHost></span>
				</div>
				<p class="small font-monospace mt-2 mb-0">document.activeElement → {{ nativeActive() }}</p>
				<p class="small font-monospace mb-0">getActiveElement() → {{ piercedActive() }}</p>
			</div>

			<div class="col-12 col-lg-6">
				<h6 class="fw-semibold">runInZone()</h6>
				<p class="small text-muted">
					Both streams are created with <code>runOutsideAngular</code>; only one is piped through the operator.
				</p>
				<table class="table table-sm mb-0">
					<tbody>
						<tr>
							<th scope="row" class="fw-normal text-muted small">plain subscriber</th>
							<td class="font-monospace small">isInAngularZone() → {{ outsideInZone() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">piped through runInZone(zone)</th>
							<td class="font-monospace small">isInAngularZone() → {{ pipedInZone() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">ticks</th>
							<td class="font-monospace small">{{ ticks() }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	styles: `
		.dom-panel {
			padding: 0.75rem;
			border: 1px dashed var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
		}
		.dom-panel .dom-panel {
			margin-top: 0.5rem;
		}
		.dom-badge {
			display: inline-block;
			padding: 0.25rem 0.75rem;
			border-radius: 999px;
			background: var(--hub-sys-color-primary, #0d6efd);
			color: #fff;
		}
		.dom-badge.is-pulsing {
			animation: dom-utils-pulse 600ms ease;
		}
		@keyframes dom-utils-pulse {
			0% {
				transform: scale(1);
			}
			40% {
				transform: scale(1.25);
			}
			100% {
				transform: scale(1);
			}
		}
	`
})
export class DomUtilsExampleComponent {
	private readonly zone = inject(NgZone);
	private readonly destroyRef = inject(DestroyRef);

	/** The badge whose animation is replayed. */
	private readonly badge = viewChild.required<ElementRef<HTMLElement>>('badge');

	/** The host a shadow root is attached to, so the focus demo has something to walk into. */
	private readonly shadowHost = viewChild.required<ElementRef<HTMLElement>>('shadowHost');

	/** The panel the last click resolved to. */
	protected readonly closestPanel = signal('—');

	/** Whether the replay button skips the reflow, which is what kills the animation. */
	protected readonly skipReflow = signal(false);

	/** What the platform reports as focused: the shadow host, not what is inside it. */
	protected readonly nativeActive = signal('—');

	/** What the helper reports, having walked into any shadow root on the way. */
	protected readonly piercedActive = signal('—');

	/** Zone membership of a subscriber that was never put back. */
	protected readonly outsideInZone = signal('—');

	/** Zone membership of the same source once the operator has run. */
	protected readonly pipedInZone = signal('—');

	/** Emissions received so far, so the panel is visibly alive. */
	protected readonly ticks = signal(0);

	constructor() {
		// Both halves touch the platform, so they wait for the browser: attaching a shadow root
		// and starting timers during prerendering would either throw or hold the render open.
		afterNextRender(() => {
			this.attachShadowButton();
			this.startZoneComparison();
		});
	}

	/** Reports the nearest ancestor panel of whatever was clicked. */
	protected readClosestPanel(event: Event): void {
		const panel = closest(event.target as HTMLElement, '[data-panel]');
		this.closestPanel.set(panel ? `<${panel.tagName.toLowerCase()} data-panel="${panel.dataset['panel']}">` : 'null');
	}

	/**
	 * Restarts the CSS animation.
	 *
	 * Removing and re-adding the class within the same task is a no-op as far as the browser is
	 * concerned — it only compares the computed style once. Reading a layout property in between
	 * forces the intermediate state to be flushed, which is the whole job of `reflow()`.
	 */
	protected replay(): void {
		const element = this.badge().nativeElement;
		element.classList.remove('is-pulsing');

		if (!this.skipReflow()) {
			reflow(element);
		}

		element.classList.add('is-pulsing');
	}

	/** Refreshes both readings of the focused element. */
	protected readActiveElement(): void {
		this.nativeActive.set(this.describe(document.activeElement));
		this.piercedActive.set(this.describe(getActiveElement()));
	}

	/** Reads a checkbox state without widening the template to `any`. */
	protected readChecked(event: Event): boolean {
		return (event.target as HTMLInputElement).checked;
	}

	/** A short, readable label for an element. */
	private describe(element: Element | null): string {
		if (!element) {
			return 'null';
		}
		return element.id ? `<${element.tagName.toLowerCase()} id="${element.id}">` : `<${element.tagName.toLowerCase()}>`;
	}

	/** Puts a focusable button behind a shadow boundary, unreachable to `document.activeElement`. */
	private attachShadowButton(): void {
		const root = this.shadowHost().nativeElement.attachShadow({ mode: 'open' });
		const button = document.createElement('button');
		button.type = 'button';
		button.id = 'dom-shadow-button';
		button.textContent = 'inside a shadow root';
		button.setAttribute('style', 'padding: 0.25rem 0.75rem; border-radius: 0.25rem;');
		root.append(button);
	}

	/** Subscribes to the same source twice, once through the operator, once not. */
	private startZoneComparison(): void {
		this.zone.runOutsideAngular(() => {
			interval(1000)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe(() => this.outsideInZone.set(String(NgZone.isInAngularZone())));

			interval(1000)
				.pipe(runInZone(this.zone), takeUntilDestroyed(this.destroyRef))
				.subscribe((tick) => {
					this.pipedInZone.set(String(NgZone.isInAngularZone()));
					this.ticks.set(tick + 1);
				});
		});
	}

	static readonly templateCode = `<div class="dom-panel" data-panel="outer" (click)="readClosestPanel($event)">
  <div class="dom-panel" data-panel="inner">
    <button type="button">a button</button>
  </div>
</div>

<span #badge class="dom-badge">replay me</span>
<button type="button" (click)="replay()">Replay</button>

<input type="text" />
<span #shadowHost></span>`;

	static readonly componentCode = `import { Component, ElementRef, NgZone, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { closest, getActiveElement, reflow, runInZone } from 'ng-hub-ui-utils';
import { interval } from 'rxjs';

@Component({
  // A document listener keeps both readings of the focused element current.
  host: { '(document:focusin)': 'readActiveElement()' }
  /* … */
})
export class DomExampleComponent {
  private readonly zone = inject(NgZone);
  private readonly badge = viewChild.required<ElementRef<HTMLElement>>('badge');

  readClosestPanel(event: Event): void {
    // Same contract as Element.closest(), plus null for a missing selector or an
    // engine without the method, so callers do not have to guard either case.
    const panel = closest(event.target as HTMLElement, '[data-panel]');
  }

  replay(): void {
    const element = this.badge().nativeElement;
    element.classList.remove('is-pulsing');
    // Removing and re-adding a class in one task changes nothing: the browser only
    // compares the computed style once. Reading layout in between flushes it.
    reflow(element);
    element.classList.add('is-pulsing');
  }

  readActiveElement(): void {
    // document.activeElement stops at the shadow host; this walks the shadow roots down
    // to the element that actually has focus.
    const focused = getActiveElement();
  }

  start(): void {
    this.zone.runOutsideAngular(() => {
      interval(1000)
        // Without the operator the subscriber runs outside Angular, and anything it
        // touches that is not a signal goes unnoticed until the next tick from elsewhere.
        .pipe(runInZone(this.zone))
        .subscribe(() => console.log(NgZone.isInAngularZone())); // true
    });
  }
}`;
}
