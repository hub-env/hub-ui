import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HUB_NAMED_COLORS, isValidColor, parseColor, rgbToOklch, toHex, toRgb } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `parseColor()` resolving every syntax it accepts, with no DOM involved.
 *
 * The usual way to read a colour in a browser is to assign the string to a detached element
 * and read `getComputedStyle` back. That forces layout, and on the server it returns nothing
 * at all — so anything built on it silently stops working under SSR. Here the string is
 * parsed outright, which is why the panel below fills in during prerendering too.
 *
 * The last preset is the interesting one: `var(--x)` is perfectly valid CSS but has no value
 * of its own until the cascade resolves it, so it comes back as `null` rather than as a
 * guess. Same for `currentColor`.
 */
@Component({
	selector: 'app-utils-color-parsing-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="row g-4">
			<div class="col-12 col-lg-5">
				<label class="form-label small fw-semibold" for="color-parsing-input">Any CSS colour</label>
				<input
					id="color-parsing-input"
					type="text"
					class="form-control font-monospace"
					[class.is-invalid]="status() === 'invalid'"
					[value]="input()"
					(input)="input.set(readText($event))"
				/>
				@if (status() === 'invalid') {
					<div class="invalid-feedback d-block small">Not a colour — <code>parseColor()</code> returns null.</div>
				} @else if (status() === 'cascade') {
					<div class="form-text mt-1">
						Valid CSS, but it has no colour of its own until the cascade resolves it — so
						<code>parseColor()</code> returns null rather than guessing one.
					</div>
				}

				<p class="small text-muted mt-3 mb-2">Try one:</p>
				<div class="d-flex flex-wrap gap-2">
					@for (preset of presets; track preset) {
						<button
							type="button"
							hubButton
							variant="outline"
							color="secondary"
							size="sm"
							class="font-monospace"
							(click)="input.set(preset)"
						>
							{{ preset }}
						</button>
					}
				</div>
			</div>

			<div class="col-12 col-lg-7">
				<div class="d-flex align-items-center gap-3 mb-3">
					<span
						class="rounded-3 border flex-shrink-0"
						style="width: 4.5rem; height: 4.5rem;"
						[style.background]="parsed() ? hex() : 'repeating-linear-gradient(45deg, #eee 0 6px, #fff 6px 12px)'"
					></span>
					<div class="font-monospace">
						<div class="fs-5">{{ hex() ?? 'null' }}</div>
						<div class="small text-muted">{{ statusLabel() }}</div>
					</div>
				</div>

				<table class="table table-sm mb-0">
					<tbody>
						<tr>
							<th scope="row" class="fw-normal text-muted small">parseColor()</th>
							<td class="font-monospace small">{{ channels() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">toHex()</th>
							<td class="font-monospace small">{{ hex() ?? 'null' }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">rgbToOklch()</th>
							<td class="font-monospace small">{{ oklch() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">isValidColor()</th>
							<td class="font-monospace small">{{ valid() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">toRgb()</th>
							<td class="font-monospace small">{{ normalised() }}</td>
						</tr>
						<tr>
							<th scope="row" class="fw-normal text-muted small">HUB_NAMED_COLORS</th>
							<td class="font-monospace small">{{ named() }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	`,
	styles: []
})
export class ColorParsingUtilsExampleComponent {
	/** One preset per accepted syntax, ending with the two that deliberately fail. */
	protected readonly presets = [
		'#0d6efd',
		'#ff000080',
		'rebeccapurple',
		'rgb(255, 193, 7)',
		'rgb(13 202 240 / 60%)',
		'hsl(210deg 100% 50%)',
		'oklch(0.58 0.23 260)',
		'oklab(0.63 0.22 0.13)',
		'transparent',
		'var(--hub-sys-color-primary)'
	];

	/** The string being parsed. */
	protected readonly input = signal('oklch(0.58 0.23 260)');

	/** The parse result, or `null` when the string is not a resolvable colour. */
	protected readonly parsed = computed(() => parseColor(this.input()));

	/**
	 * Why the input did or did not resolve.
	 *
	 * `cascade` is the interesting third state: `var(--x)` and `currentColor` are valid CSS
	 * that simply has no value outside a document, so reporting them as malformed would teach
	 * the wrong lesson about what `parseColor()` refuses.
	 */
	protected readonly status = computed<'ok' | 'cascade' | 'invalid'>(() => {
		const raw = this.input().trim().toLowerCase();
		if (!raw) return 'invalid';
		if (this.parsed()) return 'ok';
		return raw.startsWith('var(') || raw === 'currentcolor' ? 'cascade' : 'invalid';
	});

	/** The one-word verdict shown under the swatch. */
	protected readonly statusLabel = computed(() =>
		this.status() === 'ok' ? 'parsed' : this.status() === 'cascade' ? 'needs the cascade' : 'not a colour'
	);

	/** The colour as hex, `#rrggbbaa` when translucent. */
	protected readonly hex = computed(() => toHex(this.input()));

	/** The parsed channels, rounded for display. */
	protected readonly channels = computed(() => {
		const rgb = this.parsed();
		if (!rgb) return 'null';
		return `{ r: ${Math.round(rgb.r)}, g: ${Math.round(rgb.g)}, b: ${Math.round(rgb.b)}, a: ${this.round(rgb.a, 2)} }`;
	});

	/** The same colour in the space the design system mixes in. */
	protected readonly oklch = computed(() => {
		const rgb = this.parsed();
		if (!rgb) return '—';
		const { l, c, h } = rgbToOklch(rgb);
		return `{ l: ${this.round(l, 3)}, c: ${this.round(c, 3)}, h: ${this.round(h, 1)} }`;
	});

	/** The same verdict as a `null` parse, for callers that only need the yes or no. */
	protected readonly valid = computed(() => isValidColor(this.input()));

	/**
	 * `toRgb()` normalising a `HubColor` — a string or an already-parsed colour.
	 *
	 * Handing it the parse result gives that very object back, which is why every helper in
	 * the module takes `HubColor` instead of a string: a pipeline parses once, not once per step.
	 */
	protected readonly normalised = computed(() => {
		const parsed = this.parsed();
		if (!parsed) {
			return 'null';
		}
		return toRgb(parsed) === parsed ? 'already parsed — same object back' : 'reparsed';
	});

	/** How many CSS named colours the table carries. */
	private readonly namedColorCount = Object.keys(HUB_NAMED_COLORS).length;

	/**
	 * The named-colour table behind a bareword.
	 *
	 * It is a plain hex map rather than a DOM lookup, which is the only reason
	 * `rebeccapurple` resolves during server-side rendering.
	 */
	protected readonly named = computed(() => {
		const hex = HUB_NAMED_COLORS[this.input().trim().toLowerCase()];
		return hex ? `${hex} (1 of ${this.namedColorCount})` : `not a bareword — ${this.namedColorCount} in the table`;
	});

	/** Reads a string value off an `<input>` event without widening the template to `any`. */
	protected readText(event: Event): string {
		return (event.target as HTMLInputElement).value;
	}

	/** Fixed-decimal rounding, kept here so the template stays free of arithmetic. */
	protected round(value: number, decimals: number): number {
		const factor = 10 ** decimals;
		return Math.round(value * factor) / factor;
	}

	static readonly templateCode = `<input type="text" [value]="input()" (input)="input.set(readText($event))" />

<span [style.background]="hex()"></span>
<p>{{ channels() }}</p>
<p>{{ oklch() }}</p>`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { HUB_NAMED_COLORS, isValidColor, parseColor, rgbToOklch, toHex, toRgb } from 'ng-hub-ui-utils';

@Component({ /* … */ })
export class ColorParsingExampleComponent {
  protected readonly input = signal('oklch(0.58 0.23 260)');

  // hex 3/4/6/8, rgb(), hsl(), oklch(), oklab(), the 148 named colours and
  // 'transparent', in modern and legacy syntax. No DOM, so this also runs on the server.
  protected readonly parsed = computed(() => parseColor(this.input()));

  // null — never a throw — for anything with no value outside the cascade:
  // var(--x) and currentColor included.
  protected readonly hex = computed(() => toHex(this.input()));

  // The same verdict without the value, for a form that only needs to reject the input.
  protected readonly valid = computed(() => isValidColor(this.input()));

  // Every helper takes HubColor — a string or an already-parsed colour — and toRgb() is
  // what makes that work: hand it a parse result and it gives the very same object back,
  // so a pipeline of helpers parses once instead of once per step.
  protected readonly rgb = computed(() => toRgb(this.parsed() ?? this.input()));

  protected readonly oklch = computed(() => {
    const rgb = this.parsed();
    return rgb ? rgbToOklch(rgb) : null;
  });

  // The bareword table itself is exported: 148 entries, a plain hex map rather than a DOM
  // lookup, which is the only reason 'rebeccapurple' resolves under server-side rendering.
  protected readonly named = computed(() => HUB_NAMED_COLORS[this.input().trim().toLowerCase()]);
}`;
}
