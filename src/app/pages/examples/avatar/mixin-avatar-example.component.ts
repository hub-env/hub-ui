import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

/**
 * Live demo for the `hub-avatar-theme` SCSS mixin. The `.avatar-mixin-scope` block sets
 * the same `--hub-avatar-*` custom properties the mixin emits, so the rendered result
 * matches the SCSS shown alongside it in the docs. `--hub-avatar-bg-color` /
 * `--hub-avatar-fg-color` recolour the initials chip, `--hub-avatar-border-radius`
 * softens the square corners and `--hub-avatar-badge-color` tints the corner badge.
 *
 * `[autoColor]="false"` frees `--hub-avatar-bg-color` from the inline hash colour, and
 * `[round]="false"` lets the themed border-radius read clearly.
 */
@Component({
	selector: 'app-mixin-avatar-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.avatar-mixin-scope {
				--hub-avatar-bg-color: #ede9fe;
				--hub-avatar-fg-color: #5b21b6;
				--hub-avatar-border-radius: 0.75rem;
				--hub-avatar-badge-color: #f43f5e;
			}
		</style>
		<div class="avatar-mixin-scope" style="display: flex; gap: 1rem; align-items: center;">
			<hub-avatar name="Ada Lovelace" [autoColor]="false" [round]="false" size="64" badge="5"></hub-avatar>
			<hub-avatar name="Grace Hopper" [autoColor]="false" [round]="false" size="64" [badge]="true"></hub-avatar>
		</div>
	`,
	styles: []
})
export class MixinAvatarExampleComponent {}
