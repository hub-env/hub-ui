import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { HubToastRef, HubToastService } from 'ng-hub-ui-toast';
import { Subscription } from 'rxjs';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the `HubToastRef` lifecycle observables — `onShown`, `onHidden`,
 * `onTap` — and the imperative methods `manualClose()` and `resetTimeout()`.
 */
@Component({
	selector: 'app-lifecycle-toast-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-wrap gap-2 mb-3">
			<button hubButton color="primary" (click)="showTracked()">Show tracked toast (10 s)</button>
			@if (activeRef()) {
				<button hubButton color="warning" (click)="resetTimeout()">Reset timer</button>
				<button hubButton color="danger" (click)="manualClose()">Close now</button>
			}
		</div>
		<div class="border rounded p-3 bg-body-tertiary font-monospace small" style="min-height: 3rem">
			@if (log().length === 0) {
				<span class="text-body-secondary">Events will appear here…</span>
			}
			@for (entry of log(); track $index) {
				<div>{{ entry }}</div>
			}
		</div>
	`
})
export class LifecycleToastExampleComponent implements OnDestroy {
	private readonly _toast = inject(HubToastService);

	protected readonly activeRef = signal<HubToastRef | null>(null);
	protected readonly log = signal<string[]>([]);

	private _subs: Subscription[] = [];

	showTracked(): void {
		this._subs.forEach((s) => s.unsubscribe());
		this._subs = [];
		this.log.set([]);

		const ref = this._toast.success('Watching lifecycle events…', 'Lifecycle demo', {
			timeOut: 10_000,
			progressBar: true,
			closeButton: true
		});

		this.activeRef.set(ref);

		this._subs.push(
			ref.onShown.subscribe(() => {
				this.log.update((l) => [...l, `[${ts()}] onShown — toast #${ref.toastId} entered DOM`]);
			}),
			ref.onHidden.subscribe(() => {
				this.log.update((l) => [...l, `[${ts()}] onHidden — toast #${ref.toastId} removed`]);
				this.activeRef.set(null);
			}),
			ref.onTap.subscribe(() => {
				this.log.update((l) => [...l, `[${ts()}] onTap — user clicked toast body`]);
			})
		);
	}

	resetTimeout(): void {
		this.activeRef()?.resetTimeout();
		this.log.update((l) => [...l, `[${ts()}] resetTimeout() called`]);
	}

	manualClose(): void {
		this.activeRef()?.manualClose();
		this.log.update((l) => [...l, `[${ts()}] manualClose() called`]);
	}

	ngOnDestroy(): void {
		this._subs.forEach((s) => s.unsubscribe());
	}

	static readonly templateCode = `<button hubButton color="primary" (click)="showTracked()">Show tracked toast</button>
@if (activeRef()) {
  <button (click)="resetTimeout()">Reset timer</button>
  <button (click)="manualClose()">Close now</button>
}
@for (entry of log(); track $index) {
  <div>{{ entry }}</div>
}`;

	static readonly componentCode = `import { Component, inject, OnDestroy, signal } from '@angular/core';
import { HubToastRef, HubToastService } from 'ng-hub-ui-toast';
import { Subscription } from 'rxjs';

@Component({ standalone: true, templateUrl: './lifecycle-toast-example.component.html' })
export class LifecycleToastExampleComponent implements OnDestroy {
  private readonly toast = inject(HubToastService);

  readonly activeRef = signal<HubToastRef | null>(null);
  readonly log = signal<string[]>([]);
  private subs: Subscription[] = [];

  showTracked() {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];

    const ref = this.toast.success('Watching lifecycle…', 'Demo', {
      timeOut: 10_000, progressBar: true
    });
    this.activeRef.set(ref);

    this.subs.push(
      ref.onShown.subscribe(() => this.log.update(l => [...l, 'onShown'])),
      ref.onHidden.subscribe(() => { this.log.update(l => [...l, 'onHidden']); this.activeRef.set(null); }),
      ref.onTap.subscribe(() => this.log.update(l => [...l, 'onTap']))
    );
  }

  resetTimeout() { this.activeRef()?.resetTimeout(); }
  manualClose()  { this.activeRef()?.manualClose(); }
  ngOnDestroy()  { this.subs.forEach(s => s.unsubscribe()); }
}`;
}

/** Returns a short HH:MM:SS timestamp string. */
function ts(): string {
	return new Date().toLocaleTimeString('en-GB', { hour12: false });
}
