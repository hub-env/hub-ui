import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * One token set themes every pack. `size` / `color` map to `--hub-icon-size` /
 * `--hub-icon-color`; Material Symbols also reads the variable-font axes
 * (`--hub-icon-fill` / `--hub-icon-weight`).
 *
 * The third row is the plain colour utility — `.text-danger` and friends, or any class
 * of your own. It paints an icon like it paints anything else, which is worth showing
 * beside the input because for a long time it did not.
 */
@Component({
	selector: 'app-icons-theming-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex align-items-center gap-4">
				<hub-icon name="cloud" size="1rem" />
				<hub-icon name="cloud" size="1.75rem" />
				<hub-icon name="cloud" size="2.75rem" />
			</div>
			<div class="d-flex align-items-center gap-4" style="font-size: 1.75rem;">
				<hub-icon name="circle" color="var(--hub-sys-color-primary)" />
				<hub-icon name="circle" color="var(--hub-sys-color-success)" />
				<hub-icon name="circle" color="var(--hub-sys-color-danger)" />
				<hub-icon name="circle" color="var(--hub-sys-color-warning)" />
			</div>
			<div class="d-flex align-items-center gap-4" style="font-size: 1.75rem;">
				<hub-icon name="circle" class="text-primary" />
				<hub-icon name="circle" class="text-success" />
				<hub-icon name="circle" class="text-danger" />
				<hub-icon name="circle" class="text-warning" />
			</div>
			<div class="d-flex align-items-center gap-4" style="font-size: 2rem;" [style]="msAxes">
				<hub-icon name="favorite" pack="ms" />
				<hub-icon name="favorite" pack="ms" style="--hub-icon-fill: 1; --hub-icon-weight: 700;" />
			</div>
		</div>
	`
})
export class IconsThemingExampleComponent {
	/** Shared Material Symbols axis defaults for the row. */
	readonly msAxes = '--hub-icon-grade: 0;';

	static readonly templateCode = `<!-- size & color tokens (any pack) -->
<hub-icon name="cloud" size="2.75rem" />
<hub-icon name="circle" color="var(--hub-sys-color-danger)" />

<!-- or a colour utility, yours or the design system's -->
<hub-icon name="circle" class="text-danger" />

<!-- Material Symbols variable-font axes -->
<hub-icon name="favorite" pack="ms" />
<hub-icon name="favorite" pack="ms"
  style="--hub-icon-fill: 1; --hub-icon-weight: 700;" />`;

	static readonly componentCode = `/* Theme many icons at once with a scope rule: */
.toolbar hub-icon {
  --hub-icon-size: 1.25rem;
  --hub-icon-color: var(--hub-sys-text-muted);
}`;
}
