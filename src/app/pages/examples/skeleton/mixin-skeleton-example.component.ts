import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Live demo for the `hub-skeleton-theme` SCSS mixin. The `.skeleton-mixin-scope` block sets
 * the same `--hub-skeleton-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-skeleton-bg` and
 * `--hub-skeleton-highlight` re-tone the shimmer, `--hub-skeleton-radius` rounds each block
 * and `--hub-skeleton-gap` loosens the vertical rhythm of the card preset.
 */
@Component({
	selector: 'app-mixin-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.skeleton-mixin-scope {
				--hub-skeleton-bg: rgba(124, 58, 237, 0.14);
				--hub-skeleton-highlight: rgba(124, 58, 237, 0.32);
				--hub-skeleton-radius: 0.75rem;
				--hub-skeleton-gap: 0.85rem;
			}

			.skeleton-mixin-scope {
				display: block;
				max-width: 22rem;
			}
		</style>
		<div class="skeleton-mixin-scope">
			<hub-skeleton preset="card"></hub-skeleton>
		</div>
	`,
	styles: []
})
export class MixinSkeletonExampleComponent {}
