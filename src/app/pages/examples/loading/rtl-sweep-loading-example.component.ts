import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubLoadingBarComponent } from 'ng-hub-ui-loading';

/**
 * The indeterminate sweep travelling with the text.
 *
 * A sweep that always runs left-to-right reads as backwards in Arabic or Hebrew: it
 * arrives from where the reader's eye has already been. The bar keeps the direction in
 * `--hub-loading-bar-sweep-direction`, flipped to `-1` by a rule keyed off `dir` wherever it
 * sits, so nothing has to be bound, configured or duplicated per locale — the same
 * `<hub-loading-bar indeterminate />` sweeps the right way on both sides.
 *
 * Both cards below hold identical markup. The only difference is the `dir` of the element
 * around them, which is where a real application already declares it.
 */
@Component({
	selector: 'app-loading-rtl-sweep-example',
	standalone: true,
	imports: [HubButtonComponent, HubLoadingBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-3 align-items-stretch mb-3">
			<div class="border rounded-3 p-3 flex-grow-1" style="min-width: 16rem;" dir="ltr">
				<div class="d-flex align-items-baseline justify-content-between mb-2">
					<h6 class="mb-0">Loading results…</h6>
					<span class="font-monospace small text-muted">dir="ltr"</span>
				</div>

				<hub-loading-bar [progress]="sweeping() ? 100 : null" indeterminate ariaLabel="Loading results" />

				<p class="small mb-0 mt-2" style="color: var(--hub-sys-text-muted)">Sweeps left to right, with the text.</p>
			</div>

			<div class="border rounded-3 p-3 flex-grow-1" style="min-width: 16rem;" dir="rtl">
				<div class="d-flex align-items-baseline justify-content-between mb-2">
					<h6 class="mb-0">جارٍ تحميل النتائج…</h6>
					<!-- Code is LTR text: left to the paragraph's direction, bidi reorders the quotes. -->
					<span class="font-monospace small text-muted" dir="ltr">dir="rtl"</span>
				</div>

				<hub-loading-bar [progress]="sweeping() ? 100 : null" indeterminate ariaLabel="جارٍ التحميل" />

				<p class="small mb-0 mt-2" style="color: var(--hub-sys-text-muted)">
					يمسح من اليمين إلى اليسار، مع اتجاه النص.
				</p>
			</div>
		</div>

		<button type="button" hubButton variant="outline" color="primary" (click)="sweeping.set(!sweeping())">
			{{ sweeping() ? 'Stop' : 'Start' }} both sweeps
		</button>

		<p class="small mb-0 mt-3" style="color: var(--hub-sys-text-muted)">
			The flip comes from <code>[dir='rtl'] .hub-loading-bar, .hub-loading-bar[dir='rtl']</code>, so the attribute counts
			wherever it sits — on <code>&lt;html&gt;</code>, on the region that changes direction, or on the
			<code>&lt;hub-loading-bar&gt;</code> element itself. The determinate fill needs no such treatment: it grows along
			the inline axis, which already reverses on its own.
		</p>
	`,
	styles: []
})
export class RtlSweepLoadingExampleComponent {
	/** Whether both bars are on screen, so the sweep can be stopped while reading. */
	protected readonly sweeping = signal(true);

	static readonly templateCode = `<!-- Same element on both sides; only the direction around it changes -->
<div dir="ltr">
  <hub-loading-bar [progress]="100" indeterminate ariaLabel="Loading results" />
</div>

<div dir="rtl">
  <hub-loading-bar [progress]="100" indeterminate ariaLabel="جارٍ التحميل" />
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubLoadingBarComponent } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingBarComponent],
  templateUrl: './rtl-sweep-loading-example.component.html'
})
export class RtlSweepLoadingExampleComponent {}

// Nothing to wire. The sweep direction lives in --hub-loading-bar-sweep-direction,
// which [dir='rtl'] flips to -1, so an application that already sets dir on <html>
// gets the right sweep in every locale without touching the component.`;

	static readonly cssCode = `/* What the stylesheet does, in case you are re-implementing the strip:
   the keyframes multiply by the direction token instead of hard-coding a sign.
   Both selectors are needed — dir is inherited, so it may sit on the bar itself,
   which a descendant combinator alone would never reach. */
[dir='rtl'] .hub-loading-bar,
.hub-loading-bar[dir='rtl'] {
  --hub-loading-bar-sweep-direction: -1;
}

@keyframes hub-loading-bar-sweep {
  0%   { transform: translateX(calc(-100% * var(--hub-loading-bar-sweep-direction))); }
  100% { transform: translateX(calc(300% * var(--hub-loading-bar-sweep-direction))); }
}`;
}
