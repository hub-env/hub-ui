import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

/** The five bundled indicators, in the order the `variant` union declares them. */
const VARIANTS = ['spinner', 'dots', 'bars', 'pulse', 'ring'] as const;

/** The three size steps, each a preset value for `--hub-loading-size`. */
const SIZES = ['sm', 'md', 'lg'] as const;

/**
 * The whole visual surface of the component in one screen: five indicators, three sizes
 * and the three shapes an accent can take.
 *
 * The accent row is the part worth reading twice. `color` is not a colour property in the
 * CSS sense — it is handed to `resolveHubAccent()` from `ng-hub-ui-utils`, which treats a
 * bare identifier as a design-system token and everything else as a literal CSS value.
 * So `color="success"` resolves to `var(--hub-sys-color-success, success)` and follows the
 * theme, while `color="#7c3aed"` and `color="var(--hub-sys-color-warning)"` are passed
 * through untouched. That is why a semantic name survives a theme switch and a hex does not.
 */
@Component({
	selector: 'app-loading-indicator-variants-example',
	standalone: true,
	imports: [HubLoadingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<section>
				<h6 class="text-uppercase text-muted small mb-3">Variants</h6>
				<div class="d-flex flex-wrap gap-3">
					@for (variant of variants; track variant) {
						<div
							class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-end gap-3 flex-grow-1"
							style="min-width: 9rem;"
						>
							<hub-loading [variant]="variant" />
							<code class="small">{{ variant }}</code>
						</div>
					}
				</div>
			</section>

			<section>
				<h6 class="text-uppercase text-muted small mb-3">Sizes</h6>
				<div class="d-flex flex-wrap align-items-end gap-4 border rounded-3 p-4">
					@for (size of sizes; track size) {
						<div class="d-flex flex-column align-items-center gap-3">
							<hub-loading variant="ring" [size]="size" />
							<code class="small">size="{{ size }}"</code>
						</div>
					}
				</div>
				<p class="text-muted small mb-0 mt-2">
					Each step is a preset for the <code>--hub-loading-size</code> token. Override that token directly when a
					layout needs a size the three steps do not cover.
				</p>
			</section>

			<section>
				<h6 class="text-uppercase text-muted small mb-3">Accents</h6>
				<div class="d-flex flex-wrap align-items-end gap-4 border rounded-3 p-4">
					<div class="d-flex flex-column align-items-center gap-3">
						<hub-loading variant="ring" color="primary" />
						<code class="small">color="primary"</code>
					</div>
					<div class="d-flex flex-column align-items-center gap-3">
						<hub-loading variant="ring" color="success" />
						<code class="small">color="success"</code>
					</div>
					<div class="d-flex flex-column align-items-center gap-3">
						<hub-loading variant="ring" color="danger" />
						<code class="small">color="danger"</code>
					</div>
					<div class="d-flex flex-column align-items-center gap-3">
						<hub-loading variant="ring" color="#7c3aed" />
						<code class="small">color="#7c3aed"</code>
					</div>
					<div class="d-flex flex-column align-items-center gap-3">
						<hub-loading variant="ring" color="var(--hub-sys-color-warning)" />
						<code class="small">color="var(--hub-sys-color-warning)"</code>
					</div>
				</div>
				<p class="text-muted small mb-0 mt-2">
					A bare name resolves to <code>var(--hub-sys-color-&lt;name&gt;)</code> and tracks the active theme. A hex,
					an <code>oklch()</code> or a <code>var(...)</code> is used verbatim.
				</p>
			</section>
		</div>
	`,
	styles: []
})
export class IndicatorVariantsLoadingExampleComponent {
	/** Exposed to the template so the variant row stays in sync with the union type. */
	protected readonly variants = VARIANTS;

	/** Exposed to the template so the size row stays in sync with the union type. */
	protected readonly sizes = SIZES;

	static readonly templateCode = `<!-- Every bundled indicator -->
<hub-loading variant="spinner" />
<hub-loading variant="dots" />
<hub-loading variant="bars" />
<hub-loading variant="pulse" />
<hub-loading variant="ring" />

<!-- Three size steps, each a preset for --hub-loading-size -->
<hub-loading variant="ring" size="sm" />
<hub-loading variant="ring" size="md" />
<hub-loading variant="ring" size="lg" />

<!-- A bare name is a design-system token; anything else is a literal CSS colour -->
<hub-loading variant="ring" color="success" />
<hub-loading variant="ring" color="#7c3aed" />
<hub-loading variant="ring" color="var(--hub-sys-color-warning)" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

const VARIANTS = ['spinner', 'dots', 'bars', 'pulse', 'ring'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

@Component({
  standalone: true,
  imports: [HubLoadingComponent],
  template: \`
    @for (variant of variants; track variant) {
      <hub-loading [variant]="variant" />
    }
  \`
})
export class IndicatorVariantsLoadingExampleComponent {
  protected readonly variants = VARIANTS;
  protected readonly sizes = SIZES;
}`;
}
