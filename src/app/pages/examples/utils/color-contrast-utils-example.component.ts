import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { compositeOver, contrastAPCA, contrastRatio, readableOn, relativeLuminance } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * `readableOn()` choosing the ink for the nine semantic accents, under each of its metrics.
 *
 * Switch the selector to `wcag` and three chips flip to black text — primary, success and
 * danger. That is not a rendering artefact: maximising the WCAG 2 contrast ratio genuinely
 * scores black higher on those three, because the formula underweights blue at mid lightness.
 * Nobody ships that, which is why it is not the default.
 *
 * The default, `lightness`, thresholds OKLCh perceptual lightness at 0.62 — the same decision
 * `--hub-sys-color-*-on` computes in CSS. Keeping the two in step is the point: a component
 * that resolves its ink in TypeScript must not disagree with the stylesheet that paints it.
 * `apca` agrees with the default on all nine.
 */
@Component({
	selector: 'app-utils-color-contrast-example',
	imports: [HubButtonComponent, HubBadgeComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3 mb-4">
			<span class="small fw-semibold">readableOn(accent, metric)</span>
			<div class="d-flex gap-1 d-flex gap-1-sm" role="group" aria-label="Contrast metric">
				@for (option of metrics; track option) {
					<button
						type="button"
						hubButton
						color="primary"
						[variant]="metric() === option ? 'solid' : 'outline'"
						(click)="metric.set(option)"
					>
						{{ option }}
					</button>
				}
			</div>
			@if (disagreements().length) {
				<hub-badge color="warning" shape="rounded">
					{{ disagreements().length }} differ from the design-system token: {{ disagreements().join(', ') }}
				</hub-badge>
			} @else {
				<hub-badge color="success" shape="rounded">Agrees with the design-system token on all nine</hub-badge>
			}
		</div>

		<div class="row g-3">
			@for (role of roles(); track role.name) {
				<div class="col-6 col-md-4 col-xl-3">
					<div
						class="rounded-3 p-3 h-100 border"
						[style.background]="role.accent"
						[style.color]="role.ink"
						[class.border-warning]="role.differs"
						[class.border-3]="role.differs"
					>
						<div class="fw-semibold">{{ role.name }}</div>
						<div class="font-monospace small opacity-75">{{ role.accent }}</div>
						<hr class="my-2 opacity-25" />
						<div class="small d-flex justify-content-between">
							<span>ink</span>
							<span class="font-monospace">{{ role.ink }}</span>
						</div>
						<div class="small d-flex justify-content-between">
							<span>WCAG</span>
							<span class="font-monospace">{{ role.ratio }}:1</span>
						</div>
						<div class="small d-flex justify-content-between">
							<span>APCA</span>
							<span class="font-monospace">{{ role.apca }}</span>
						</div>
					</div>
				</div>
			}
		</div>

		<p class="text-muted small mb-0 mt-3">
			A highlighted border marks a chip whose ink differs from what
			<code>--hub-sys-color-&#42;-on</code> paints in CSS.
		</p>

		<hr class="my-4" />

		<h6 class="fw-semibold">Translucent ink has to be composited before it is measured</h6>
		<p class="text-muted small">
			<code>relativeLuminance()</code> ignores alpha, because a translucent colour has no luminance of its own until
			something is behind it. Measure the ink as written and you are scoring solid black;
			<code>compositeOver()</code> blends it onto the surface first, which is what the eye is reading.
		</p>

		<div class="row g-3 align-items-center">
			<div class="col-12 col-md-4">
				<label class="form-label small fw-semibold" for="contrast-ink-alpha">Ink alpha: {{ alpha() }}</label>
				<input
					id="contrast-ink-alpha"
					type="range"
					class="form-range"
					min="0.1"
					max="1"
					step="0.05"
					[value]="alpha()"
					(input)="alpha.set(readNumber($event))"
				/>
			</div>
			<div class="col-12 col-md-4">
				<div class="rounded-3 p-3 text-center" [style.background]="surface">
					<span [style.color]="ink()">Sample text</span>
				</div>
			</div>
			<div class="col-12 col-md-4">
				<table class="table table-sm mb-0">
					<tbody>
						<tr>
							<th scope="row" class="fw-normal text-muted small">relativeLuminance(surface)</th>
							<td class="font-monospace small">{{ surfaceLuminance() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">contrastRatio(ink, surface)</th>
							<td class="font-monospace small">{{ naiveRatio() }}:1</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">…with compositeOver(ink, surface)</th>
							<td class="font-monospace small">{{ compositedRatio() }}:1</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	styles: []
})
export class ColorContrastUtilsExampleComponent {
	/** The metrics `readableOn()` accepts, in the order they are offered. */
	protected readonly metrics = ['lightness', 'apca', 'wcag'] as const;

	/** The metric currently driving every chip. */
	protected readonly metric = signal<'lightness' | 'apca' | 'wcag'>('lightness');

	/** The design system's nine semantic accents, at their default values. */
	private readonly accents: ReadonlyArray<{ name: string; accent: string }> = [
		{ name: 'primary', accent: '#0d6efd' },
		{ name: 'secondary', accent: '#6c757d' },
		{ name: 'success', accent: '#198754' },
		{ name: 'danger', accent: '#dc3545' },
		{ name: 'warning', accent: '#ffc107' },
		{ name: 'info', accent: '#0dcaf0' },
		{ name: 'neutral', accent: '#6c757d' },
		{ name: 'light', accent: '#f8f9fa' },
		{ name: 'dark', accent: '#212529' }
	];

	/** Each accent with its chosen ink and both contrast scores under the active metric. */
	protected readonly roles = computed(() =>
		this.accents.map(({ name, accent }) => {
			const ink = readableOn(accent, this.metric());
			return {
				name,
				accent,
				ink,
				differs: ink !== readableOn(accent),
				ratio: this.round(contrastRatio(ink, accent) ?? 0, 2),
				apca: this.round(contrastAPCA(ink, accent) ?? 0, 1)
			};
		})
	);

	/** The roles where the active metric parts company with the design-system token. */
	protected readonly disagreements = computed(() =>
		this.roles()
			.filter((role) => role.differs)
			.map((role) => role.name)
	);

	/** The surface the translucent ink is laid over. */
	protected readonly surface = '#0d6efd';

	/** How opaque the ink is, from barely there to solid. */
	protected readonly alpha = signal(0.55);

	/** Black at the chosen alpha, written the way a stylesheet would. */
	protected readonly ink = computed(() => `rgba(0, 0, 0, ${this.alpha()})`);

	/** The surface's own luminance, the figure both WCAG scores are built from. */
	protected readonly surfaceLuminance = computed(() => this.round(relativeLuminance(this.surface) ?? 0, 4));

	/** What the ink scores when its alpha is taken at face value: solid black. */
	protected readonly naiveRatio = computed(() => this.round(contrastRatio(this.ink(), this.surface) ?? 0, 2));

	/** What it scores once blended onto the surface — the ratio a reader actually gets. */
	protected readonly compositedRatio = computed(() =>
		this.round(contrastRatio(compositeOver(this.ink(), this.surface), this.surface) ?? 0, 2)
	);

	/** Reads a numeric value off a range input without widening the template to `any`. */
	protected readNumber(event: Event): number {
		return Number((event.target as HTMLInputElement).value);
	}

	/** Fixed-decimal rounding, kept here so the template stays free of arithmetic. */
	protected round(value: number, decimals: number): number {
		const factor = 10 ** decimals;
		return Math.round(value * factor) / factor;
	}

	static readonly templateCode = `@for (role of roles(); track role.name) {
  <div [style.background]="role.accent" [style.color]="role.ink">
    <span>{{ role.name }}</span>
    <span>{{ role.ratio }}:1</span>
    <span>{{ role.apca }}</span>
  </div>
}

<input type="range" min="0.1" max="1" step="0.05" [value]="alpha()" (input)="alpha.set(readNumber($event))" />

<div [style.background]="surface">
  <span [style.color]="ink()">Sample text</span>
</div>

<p>{{ naiveRatio() }}:1 as written, {{ realRatio() }}:1 once composited</p>`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { compositeOver, contrastAPCA, contrastRatio, readableOn, relativeLuminance } from 'ng-hub-ui-utils';

@Component({ /* … */ })
export class ColorContrastExampleComponent {
  protected readonly metric = signal<'lightness' | 'apca' | 'wcag'>('lightness');

  protected readonly roles = computed(() =>
    this.accents.map(({ name, accent }) => ({
      name,
      accent,
      // 'lightness' is the default: it thresholds OKLCh perceptual lightness at 0.62,
      // the same decision --hub-sys-color-*-on computes in CSS, so TypeScript and the
      // stylesheet cannot paint two different inks on the same accent.
      //
      // 'wcag' maximises the WCAG 2 ratio, and on this palette it puts BLACK text on
      // primary, success and danger — the formula underweights blue at mid lightness.
      ink: readableOn(accent, this.metric()),
      ratio: contrastRatio(readableOn(accent, this.metric()), accent),
      apca: contrastAPCA(readableOn(accent, this.metric()), accent)
    }))
  );

  protected readonly ink = computed(() => \`rgba(0, 0, 0, \${this.alpha()})\`);

  // Alpha is ignored by relativeLuminance() — a translucent colour has no luminance until
  // something is behind it — so measuring the ink as written scores it as solid black.
  protected readonly naiveRatio = computed(() => contrastRatio(this.ink(), this.surface));

  // compositeOver() blends it onto the surface first, which is the ratio a reader gets.
  protected readonly realRatio = computed(() =>
    contrastRatio(compositeOver(this.ink(), this.surface), this.surface)
  );

  protected readonly surfaceLuminance = computed(() => relativeLuminance(this.surface));
}`;
}
