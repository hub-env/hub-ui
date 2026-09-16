import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Live demo for the `hub-icon-theme` SCSS mixin. The `.icon-mixin-scope` block sets
 * the same `--hub-icon-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. The left group is unthemed; the
 * right group is re-toned and resized by the scope.
 */
@Component({
	selector: 'app-mixin-icons-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.icon-mixin-scope {
				--hub-icon-color: #7c3aed;
				--hub-icon-size: 2rem;
			}
		</style>
		<div class="d-flex flex-wrap align-items-center gap-4">
			<div class="d-flex flex-wrap align-items-center gap-3" style="font-size: 1.5rem;">
				<hub-icon name="cloud" />
				<hub-icon name="bell" />
				<hub-icon name="star" />
			</div>
			<div class="icon-mixin-scope d-flex flex-wrap align-items-center gap-3">
				<hub-icon name="cloud" />
				<hub-icon name="bell" />
				<hub-icon name="star" />
			</div>
		</div>
	`,
	styles: []
})
export class MixinIconsExampleComponent {}
