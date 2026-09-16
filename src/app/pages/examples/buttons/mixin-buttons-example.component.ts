import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Live demo for the `hub-btn-theme` SCSS mixin. The `.btn-mixin-scope` block sets
 * the same `--hub-btn-*` / `--hub-button-*` custom properties the mixin emits, so the
 * rendered result matches the SCSS shown alongside it in the docs. The left group is
 * unthemed; the right group is re-toned by the scope.
 */
@Component({
	selector: 'app-mixin-buttons-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.btn-mixin-scope {
				--hub-btn-accent: #7c3aed;
				--hub-button-border-radius: 999px;
			}
		</style>
		<div class="d-flex flex-wrap align-items-center gap-4">
			<div class="d-flex flex-wrap gap-2">
				<button hubButton variant="solid" color="primary">Solid</button>
				<button hubButton variant="soft" color="primary">Soft</button>
				<button hubButton variant="outline" color="primary">Outline</button>
			</div>
			<div class="btn-mixin-scope d-flex flex-wrap gap-2">
				<button hubButton variant="solid" color="primary">Themed</button>
				<button hubButton variant="soft" color="primary">Themed soft</button>
				<button hubButton variant="outline" color="primary">Themed outline</button>
			</div>
		</div>
	`,
	styles: []
})
export class MixinButtonsExampleComponent {}
