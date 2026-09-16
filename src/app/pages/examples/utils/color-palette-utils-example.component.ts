import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
	HUB_MAX_HUE_SHIFT,
	HUB_MAX_NEUTRAL_CHROMA,
	HUB_NEUTRAL_ANCHORS,
	HUB_SEMANTIC_ANCHORS,
	harmoniseSemantics,
	readableOn,
	tintNeutrals
} from 'ng-hub-ui-utils';

/**
 * One brand colour, the whole palette — and the two numbers that keep it honest.
 *
 * Move the brand hue and watch the four semantic roles lean towards it without ever leaving
 * their own territory: the rotation stops at 15°, which is what keeps success green next to a
 * red brand and keeps success and danger more than 90° apart, the distance a red-green
 * colour-blind reader depends on. The greys lean too, but at a chroma of at most 0.015 — under
 * the most chromatic step the design system's own ramp already ships.
 */
@Component({
	selector: 'app-utils-color-palette-example',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<label class="d-flex flex-column gap-1 mb-4" style="max-width: 28rem;">
			<span class="small d-flex justify-content-between">
				<span class="fw-semibold">Brand hue</span>
				<span class="text-muted font-monospace">{{ hue() }}°</span>
			</span>
			<input
				type="range"
				class="form-range"
				min="0"
				max="359"
				step="1"
				[value]="hue()"
				(input)="hue.set(readNumber($event))"
			/>
		</label>

		<div class="d-flex align-items-center gap-3 mb-4">
			<span class="rounded border flex-shrink-0" style="width: 3rem; height: 3rem;" [style.background]="brand()"></span>
			<div class="small">
				<div class="fw-semibold">Primary</div>
				<div class="font-monospace text-muted">{{ brand() }}</div>
			</div>
		</div>

		<div class="d-flex flex-wrap gap-3 mb-4">
			@for (role of roles(); track role.name) {
				<div class="text-center">
					<span
						class="d-flex align-items-center justify-content-center rounded border mb-1 small fw-semibold"
						style="width: 6.5rem; height: 3rem;"
						[style.background]="role.derived"
						[style.color]="role.ink"
					>
						{{ role.name }}
					</span>
					<span class="small font-monospace text-muted d-block">{{ role.derived }}</span>
					<span class="small text-muted d-block">was {{ role.anchor }}</span>
				</div>
			}
		</div>

		<div class="d-flex gap-1 mb-2">
			@for (step of neutrals(); track step.step) {
				<div class="text-center flex-grow-1">
					<span class="d-block rounded border" style="height: 2.5rem;" [style.background]="step.color"></span>
					<span class="small text-muted">{{ step.step }}</span>
				</div>
			}
		</div>

		<p class="small text-muted mb-0">
			Hue rotation capped at {{ maxHueShift }}°; neutral chroma capped at {{ maxNeutralChroma }}. Success and danger stay
			<code>{{ separation() }}°</code> apart.
		</p>
	`,
	styles: []
})
export class ColorPaletteUtilsExampleComponent {
	/** The brand hue the whole palette is derived from. */
	protected readonly hue = signal(260);

	/** The library's defaults, printed so the demo and the source cannot disagree. */
	protected readonly maxHueShift = HUB_MAX_HUE_SHIFT;
	protected readonly maxNeutralChroma = HUB_MAX_NEUTRAL_CHROMA;

	/** The brand colour at the chosen hue, at a lightness and chroma a real brand would have. */
	protected readonly brand = computed(() => `oklch(0.55 0.17 ${this.hue()})`);

	/** Each semantic role, before and after harmonisation, with the ink that reads on it. */
	protected readonly roles = computed(() => {
		const derived = harmoniseSemantics(this.brand());

		return (Object.keys(HUB_SEMANTIC_ANCHORS) as Array<keyof typeof HUB_SEMANTIC_ANCHORS>).map((name) => ({
			name,
			anchor: HUB_SEMANTIC_ANCHORS[name],
			derived: derived?.[name] ?? HUB_SEMANTIC_ANCHORS[name],
			ink: readableOn(derived?.[name] ?? HUB_SEMANTIC_ANCHORS[name])
		}));
	});

	/** The tinted neutral ramp, step by step. */
	protected readonly neutrals = computed(() => {
		const ramp = tintNeutrals(this.brand());

		return (Object.keys(HUB_NEUTRAL_ANCHORS) as unknown as Array<keyof typeof HUB_NEUTRAL_ANCHORS>).map((step) => ({
			step,
			color: ramp?.[step] ?? HUB_NEUTRAL_ANCHORS[step]
		}));
	});

	/**
	 * The distance between success and danger after harmonisation — the number the 15° cap exists
	 * to protect, shown live so the guarantee is visible rather than asserted.
	 */
	protected readonly separation = computed(() => {
		const derived = harmoniseSemantics(this.brand());
		if (!derived) {
			return 0;
		}

		const hueOf = (color: string) => {
			const parsed = /^#(..)(..)(..)$/.exec(color);
			if (!parsed) {
				return 0;
			}
			const [r, g, b] = parsed.slice(1).map((pair) => parseInt(pair, 16));
			return (Math.atan2(0.7071 * (g - b), r - (g + b) / 2) * 180) / Math.PI;
		};

		return Math.round(Math.abs(((((hueOf(derived.danger) - hueOf(derived.success)) % 360) + 540) % 360) - 180));
	});

	/** Reads a numeric value off an `<input>` event without widening the template to `any`. */
	protected readNumber(event: Event): number {
		return Number((event.target as HTMLInputElement).value);
	}

	static readonly templateCode = `@for (role of roles(); track role.name) {
  <span [style.background]="role.derived" [style.color]="role.ink">{{ role.name }}</span>
}
@for (step of neutrals(); track step.step) {
  <span [style.background]="step.color"></span>
}`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { harmoniseSemantics, readableOn, tintNeutrals } from 'ng-hub-ui-utils';

@Component({ /* … */ })
export class ColorPaletteExampleComponent {
  protected readonly brand = signal('#6f42c1');

  // Rotates success / warning / danger / info towards the brand hue, by at most 15°.
  // Lightness is untouched, so the contrast each role was chosen for survives.
  protected readonly roles = computed(() => harmoniseSemantics(this.brand()));

  // Leans the grey ramp the same way, with chroma capped at 0.015 — the tint changes
  // which way the grey leans, not how grey it is.
  protected readonly neutrals = computed(() => tintNeutrals(this.brand()));

  // The ink that reads on a derived accent, by the same rule the CSS token uses.
  protected readonly successInk = computed(() => readableOn(this.roles()!.success));
}`;
}
