import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Live demo for the `hub-badge-theme` SCSS mixin. The `.badge-mixin-scope` block sets
 * the same `--hub-badge-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. The left group is unthemed; the right
 * group is re-toned by the scope.
 */
@Component({
	selector: 'app-mixin-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.badge-mixin-scope {
				--hub-badge-accent: #7c3aed;
				--hub-badge-border-radius: 0.5rem;
				--hub-badge-font-weight: 600;
			}
		</style>
		<div class="d-flex flex-wrap align-items-center gap-4">
			<div class="d-flex flex-wrap gap-2">
				<hub-badge>Default</hub-badge>
				<hub-badge variant="soft">Soft</hub-badge>
				<hub-badge variant="outline">Outline</hub-badge>
			</div>
			<div class="badge-mixin-scope d-flex flex-wrap gap-2">
				<hub-badge>Themed</hub-badge>
				<hub-badge variant="soft">Themed soft</hub-badge>
				<hub-badge variant="outline">Themed outline</hub-badge>
			</div>
		</div>
	`,
	styles: []
})
export class MixinBadgesExampleComponent {}
