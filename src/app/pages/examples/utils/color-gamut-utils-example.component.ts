import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { clampToSrgbGamut, isInSrgbGamut, maxSrgbChroma, oklchToRgb, toHex } from 'ng-hub-ui-utils';

/**
 * Why a palette cannot give every role the same chroma.
 *
 * The sRGB gamut is not a cylinder. Drag the lightness slider and watch the bars move
 * independently: at 0.578 — the design system's own primary — blue reaches a chroma of 0.232
 * while amber stops at 0.119, barely half. Ask for the brand's chroma on an amber hue and the
 * colour falls outside sRGB, where it gets clipped per channel, which shifts hue and lightness
 * both. That is the failure `clampToSrgbGamut()` exists to avoid: it reduces chroma until the
 * colour fits and leaves lightness and hue where they were.
 *
 * The practical consequence for a generated palette is that roles share a *relative* chroma —
 * the same fraction of their own hue's ceiling — rather than an absolute one.
 */
@Component({
	selector: 'app-utils-color-gamut-example',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label class="d-flex flex-column gap-1 mb-4" style="max-width: 28rem;">
			<span class="small d-flex justify-content-between">
				<span class="fw-semibold">Lightness</span>
				<span class="text-muted font-monospace">{{ lightness() }}</span>
			</span>
			<input
				type="range"
				class="form-range"
				min="0.2"
				max="0.95"
				step="0.001"
				[value]="lightness()"
				(input)="lightness.set(readNumber($event))"
			/>
		</label>

		<div class="d-flex flex-column gap-2 mb-4">
			@for (hue of hues(); track hue.name) {
				<div class="d-flex align-items-center gap-3">
					<span class="small text-muted" style="width: 5.5rem;">{{ hue.name }}</span>
					<span
						class="rounded border flex-shrink-0"
						style="width: 2rem; height: 2rem;"
						[style.background]="hue.swatch"
					></span>
					<div class="flex-grow-1 bg-body-secondary rounded" style="height: 0.75rem;">
						<div class="rounded h-100" [style.width.%]="hue.share" [style.background]="hue.swatch"></div>
					</div>
					<span class="small font-monospace text-muted" style="width: 4rem;">{{ hue.max }}</span>
				</div>
			}
		</div>

		<div class="border rounded-3 p-3">
			<p class="small fw-semibold mb-2">clampToSrgbGamut()</p>
			<p class="small text-muted mb-3">Asking for chroma {{ requested }} on the amber hue at the current lightness.</p>
			<div class="d-flex flex-wrap gap-4">
				<div>
					<span
						class="d-block rounded border mb-1"
						style="width: 5rem; height: 3rem;"
						[style.background]="clipped()"
					></span>
					<span class="small text-muted d-block">clipped per channel</span>
					<span class="small font-monospace">{{ clipped() }}</span>
				</div>
				<div>
					<span
						class="d-block rounded border mb-1"
						style="width: 5rem; height: 3rem;"
						[style.background]="clamped()"
					></span>
					<span class="small text-muted d-block">chroma reduced</span>
					<span class="small font-monospace">{{ clamped() }}</span>
				</div>
				<div class="small align-self-center">
					<div>
						in gamut as asked: <code>{{ fits() }}</code>
					</div>
					<div>
						chroma kept: <code>{{ keptChroma() }}</code>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: []
})
export class ColorGamutUtilsExampleComponent {
	/** The lightness every measurement below is taken at. */
	protected readonly lightness = signal(0.578);

	/** A chroma no hue reaches at any lightness, so the clamp always has work to do. */
	protected readonly requested = 0.35;

	/** The hue of the design system's `warning`, used for the clamp demonstration. */
	private readonly amberHue = 85;

	/** The hue anchors of the design system's own semantic roles. */
	private readonly anchors: ReadonlyArray<{ name: string; hue: number }> = [
		{ name: 'red 21°', hue: 21 },
		{ name: 'amber 85°', hue: 85 },
		{ name: 'green 157°', hue: 157 },
		{ name: 'cyan 218°', hue: 218 },
		{ name: 'blue 260°', hue: 260 },
		{ name: 'purple 320°', hue: 320 }
	];

	/** Each anchor's ceiling at the current lightness, as a value, a bar and a swatch. */
	protected readonly hues = computed(() => {
		const l = this.lightness();
		const measured = this.anchors.map(({ name, hue }) => ({ name, hue, max: maxSrgbChroma(l, hue) }));
		const widest = Math.max(...measured.map((entry) => entry.max), 0.001);

		return measured.map(({ name, hue, max }) => ({
			name,
			max: this.round(max, 3),
			share: (max / widest) * 100,
			swatch: toHex(oklchToRgb({ l, c: max, h: hue, a: 1 })) ?? '#000000'
		}));
	});

	/** Whether the requested chroma fits at the current lightness. */
	protected readonly fits = computed(() => isInSrgbGamut({ l: this.lightness(), c: this.requested, h: this.amberHue, a: 1 }));

	/** The naive result: convert anyway and let the channels clip. */
	protected readonly clipped = computed(() => {
		const rgb = oklchToRgb({ l: this.lightness(), c: this.requested, h: this.amberHue, a: 1 });
		return toHex({ r: this.clamp(rgb.r), g: this.clamp(rgb.g), b: this.clamp(rgb.b), a: 1 }) ?? '#000000';
	});

	/** The correct result: reduce chroma until it fits, keeping lightness and hue. */
	protected readonly clamped = computed(
		() =>
			toHex(oklchToRgb(clampToSrgbGamut({ l: this.lightness(), c: this.requested, h: this.amberHue, a: 1 }))) ?? '#000000'
	);

	/** How much of the requested chroma survived the clamp. */
	protected readonly keptChroma = computed(() =>
		this.round(clampToSrgbGamut({ l: this.lightness(), c: this.requested, h: this.amberHue, a: 1 }).c, 3)
	);

	/** Reads a numeric value off an `<input>` event without widening the template to `any`. */
	protected readNumber(event: Event): number {
		return Number((event.target as HTMLInputElement).value);
	}

	/** Channel clipping, shown here only to contrast it with the gamut-aware alternative. */
	private clamp(channel: number): number {
		return Math.min(Math.max(channel, 0), 255);
	}

	/** Fixed-decimal rounding, kept here so the template stays free of arithmetic. */
	protected round(value: number, decimals: number): number {
		const factor = 10 ** decimals;
		return Math.round(value * factor) / factor;
	}

	static readonly templateCode = `@for (hue of hues(); track hue.name) {
  <div>
    <span>{{ hue.name }}</span>
    <div [style.width.%]="hue.share" [style.background]="hue.swatch"></div>
    <span>{{ hue.max }}</span>
  </div>
}`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { clampToSrgbGamut, maxSrgbChroma, oklchToRgb, toHex } from 'ng-hub-ui-utils';

@Component({ /* … */ })
export class ColorGamutExampleComponent {
  protected readonly lightness = signal(0.578);

  // The sRGB gamut is not a cylinder. At L 0.578 blue reaches ~0.232 and amber ~0.119,
  // so a palette cannot hand every role the brand's absolute chroma — roles share a
  // FRACTION of their own hue's ceiling instead.
  protected readonly hues = computed(() =>
    this.anchors.map(({ name, hue }) => ({
      name,
      max: maxSrgbChroma(this.lightness(), hue),
      swatch: toHex(oklchToRgb({ l: this.lightness(), c: maxSrgbChroma(this.lightness(), hue), h: hue, a: 1 }))
    }))
  );

  // Reduces chroma until the colour fits, preserving lightness and hue — unlike clipping
  // the RGB channels, which shifts both, and shifts them most on saturated colours.
  protected readonly clamped = computed(() =>
    toHex(oklchToRgb(clampToSrgbGamut({ l: this.lightness(), c: 0.35, h: 85, a: 1 })))
  );
}`;
}
