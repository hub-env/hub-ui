import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/**
 * Live theming through the `--hub-loading-*` tokens.
 *
 * Every knob below writes one custom property on the wrapper element, and the component
 * reads it from there. That is the whole contract: the tokens are declared on
 * `:where(.hub-loading)`, so any ancestor can set them and the component never has to expose
 * an input for something that is purely visual. It is also why one wrapper themes both
 * previews at once, and why the same override works from a stylesheet, from a `[style]`
 * binding, or from the `hub-loading-theme()` mixin in the CSS tab.
 *
 * Two of the tokens only do anything in `overlay` and `fullscreen` modes — the backdrop tint
 * and its blur — which is why the second preview exists. Drag the tint to zero and the card
 * underneath stays fully legible; that is the setting for a background refresh, as opposed to
 * work that invalidates what is on screen.
 */
@Component({
	selector: 'app-loading-css-variables-example',
	standalone: true,
	imports: [HubLoadingComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="row g-4">
			<div class="col-12 col-lg-5">
				<div class="d-flex flex-column gap-3">
					<label class="d-flex align-items-center gap-2">
						<span class="small flex-grow-1"><code>--hub-loading-accent</code></span>
						<input
							type="color"
							class="form-control form-control-color"
							[value]="accent()"
							(input)="accent.set(readText($event))"
						/>
					</label>

					<label class="d-flex flex-column gap-1">
						<span class="small d-flex justify-content-between">
							<code>--hub-loading-size</code>
							<span class="text-muted">{{ size() }}px</span>
						</span>
						<input
							type="range"
							class="form-range"
							min="24"
							max="96"
							step="2"
							[value]="size()"
							(input)="size.set(readNumber($event))"
						/>
					</label>

					<label class="d-flex flex-column gap-1">
						<span class="small d-flex justify-content-between">
							<code>--hub-loading-speed</code>
							<span class="text-muted">{{ speed() }}ms</span>
						</span>
						<input
							type="range"
							class="form-range"
							min="400"
							max="2400"
							step="50"
							[value]="speed()"
							(input)="speed.set(readNumber($event))"
						/>
					</label>

					<label class="d-flex flex-column gap-1">
						<span class="small d-flex justify-content-between">
							<code>--hub-loading-thickness</code>
							<span class="text-muted">{{ thickness() }}px</span>
						</span>
						<input
							type="range"
							class="form-range"
							min="2"
							max="12"
							step="1"
							[value]="thickness()"
							(input)="thickness.set(readNumber($event))"
						/>
					</label>

					<label class="d-flex flex-column gap-1">
						<span class="small d-flex justify-content-between">
							<code>--hub-loading-backdrop-bg</code>
							<span class="text-muted">{{ backdropTint() }}% surface</span>
						</span>
						<input
							type="range"
							class="form-range"
							min="0"
							max="95"
							step="5"
							[value]="backdropTint()"
							(input)="backdropTint.set(readNumber($event))"
						/>
					</label>

					<label class="d-flex flex-column gap-1">
						<span class="small d-flex justify-content-between">
							<code>--hub-loading-backdrop-blur</code>
							<span class="text-muted">{{ backdropBlur() }}px</span>
						</span>
						<input
							type="range"
							class="form-range"
							min="0"
							max="10"
							step="1"
							[value]="backdropBlur()"
							(input)="backdropBlur.set(readNumber($event))"
						/>
					</label>
				</div>
			</div>

			<div class="col-12 col-lg-7">
				<div class="d-flex flex-column gap-3" [style]="tokens()">
					<div class="border rounded-3 p-4 d-flex justify-content-center">
						<hub-loading variant="ring" message="Inline — accent, size, speed, thickness" />
					</div>

					<hub-panel class="position-relative">
						<div style="min-height: 11rem;">
							<h6 class="card-title mb-1">Overlay preview</h6>
							<p class="card-text small text-muted mb-0">
								The backdrop tint and blur only apply in <code>overlay</code> and <code>fullscreen</code> modes.
								The tint is mixed from <code>--hub-sys-surface-page</code>, so it veils this text with the
								theme's own surface instead of a fixed colour — drop it to zero and the card stays fully legible
								underneath.
							</p>
						</div>
						<hub-loading mode="overlay" variant="ring" message="Refreshing" />
					</hub-panel>
				</div>
			</div>
		</div>

		<p class="text-muted small mb-0 mt-3">
			The same overrides written once, in Sass, are in the CSS tab — that is what
			<code>hub-loading-theme()</code> is for.
		</p>
	`,
	styles: []
})
export class CssVariablesLoadingExampleComponent {
	/** Indicator colour. Written to `--hub-loading-accent` verbatim. */
	protected readonly accent = signal('#0d6efd');

	/** Indicator box, in pixels. */
	protected readonly size = signal(48);

	/** One full animation cycle, in milliseconds. Lower is faster. */
	protected readonly speed = signal(1200);

	/** Stroke width of the `spinner` and `ring` indicators, in pixels. */
	protected readonly thickness = signal(4);

	/**
	 * How much of the page surface the scrim mixes in, as a percentage. Zero leaves the
	 * covered content fully legible.
	 *
	 * Mixing the theme's own surface rather than a fixed colour is what the library itself
	 * does, and it is the reason the default dark message text stays readable: a hardcoded
	 * dark scrim would put dark text on a dark veil in a light theme.
	 */
	protected readonly backdropTint = signal(72);

	/** Backdrop blur radius, in pixels. */
	protected readonly backdropBlur = signal(2);

	/**
	 * The live token map applied to the wrapper.
	 *
	 * Angular writes keys starting with `--` through `style.setProperty`, so a plain object
	 * binding is enough — no sanitizer bypass and no per-token `[style.--x]` binding needed.
	 */
	protected readonly tokens = computed<Record<string, string>>(() => ({
		'--hub-loading-accent': this.accent(),
		'--hub-loading-size': `${this.size()}px`,
		'--hub-loading-speed': `${this.speed()}ms`,
		'--hub-loading-thickness': `${this.thickness()}px`,
		'--hub-loading-backdrop-bg': `color-mix(in srgb, var(--hub-sys-surface-page, #ffffff) ${this.backdropTint()}%, transparent)`,
		'--hub-loading-backdrop-blur': `${this.backdropBlur()}px`
	}));

	/** Reads a numeric value off an `<input>` event without widening the template to `any`. */
	protected readNumber(event: Event): number {
		return Number((event.target as HTMLInputElement).value);
	}

	/** Reads a string value off an `<input>` event without widening the template to `any`. */
	protected readText(event: Event): string {
		return (event.target as HTMLInputElement).value;
	}

	static readonly templateCode = `<!-- One wrapper themes every hub-loading inside it -->
<div [style]="tokens()">
  <hub-loading variant="ring" message="Inline — accent, size, speed, thickness" />

  <hub-panel class="position-relative">
    <div>…</div>
    <hub-loading mode="overlay" variant="ring" message="Refreshing" />
  </hub-panel>
</div>`;

	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingComponent],
  templateUrl: './css-variables-loading-example.component.html'
})
export class CssVariablesLoadingExampleComponent {
  protected readonly accent = signal('#0d6efd');
  protected readonly size = signal(48);
  protected readonly speed = signal(1200);
  protected readonly thickness = signal(4);
  protected readonly backdropTint = signal(72);
  protected readonly backdropBlur = signal(2);

  // Angular writes '--' keys through style.setProperty, so a plain object is enough.
  protected readonly tokens = computed<Record<string, string>>(() => ({
    '--hub-loading-accent': this.accent(),
    '--hub-loading-size': this.size() + 'px',
    '--hub-loading-speed': this.speed() + 'ms',
    '--hub-loading-thickness': this.thickness() + 'px',
    // Mix the theme's own surface instead of a fixed colour, so the scrim veils
    // light themes with white and dark ones with their own background — and the
    // default dark message text stays legible either way.
    '--hub-loading-backdrop-bg':
      'color-mix(in srgb, var(--hub-sys-surface-page, #ffffff) ' + this.backdropTint() + '%, transparent)',
    '--hub-loading-backdrop-blur': this.backdropBlur() + 'px'
  }));
}`;

	static readonly cssCode = `// The same overrides, written once. Import the public styles entry, then theme
// in a single include — every parameter is optional and defaults to null, so only
// what you pass is emitted as a --hub-loading-* declaration. Passing nothing for a
// token leaves it free rather than freezing it at today's default.
@use 'ng-hub-ui-loading/styles' as loading;

.checkout-panel {
  @include loading.hub-loading-theme(
    $accent:        var(--hub-sys-color-brand, #0d6efd),
    $size:          3rem,
    $speed:         1200ms,
    $thickness:     4px,
    $backdrop-bg:   color-mix(in srgb, var(--hub-sys-surface-page, #fff) 72%, transparent),
    $backdrop-blur: 2px
  );
}

// The mixin covers all eleven tokens — $gap, $text-color, $font-size, $z-index and
// $image-size are the ones this example leaves alone. Reach for a raw custom property
// only when you are overriding a single token from a component's own stylesheet.
.checkout-panel__logo-slot {
  --hub-loading-image-size: 4rem;
}`;
}
