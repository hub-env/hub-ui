import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent, HubSegmentedComponent, HubSegmentedOption } from 'ng-hub-ui-forms';

/**
 * Live demo for the `hub-forms-theme` and `hub-segmented-theme` SCSS mixins. The
 * `.forms-mixin-scope` block sets the same `--hub-segmented-*` and `--hub-form-*` custom
 * properties the mixins emit, so the rendered result matches the SCSS shown alongside it in
 * the docs — no SCSS is compiled at runtime.
 *
 * `hub-segmented-theme` re-tones the selected pill (`--hub-segmented-selected-bg` /
 * `--hub-segmented-selected-color`), rounds the bar (`--hub-segmented-radius`) and loosens the
 * option padding (`--hub-segmented-padding-y`). `hub-forms-theme` recolours the shared focus
 * ring (`--hub-form-focus-ring-color`), which both the segmented options and the input read on
 * `:focus-visible` — tab into either control to see it.
 */
@Component({
	selector: 'app-mixin-forms-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSegmentedComponent, HubInputComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.forms-mixin-scope {
				/* hub-segmented-theme */
				--hub-segmented-selected-bg: #7c3aed;
				--hub-segmented-selected-color: #ffffff;
				--hub-segmented-radius: 0.75rem;
				--hub-segmented-padding-y: 0.375rem;

				/* hub-forms-theme */
				--hub-form-focus-ring-color: rgba(124, 58, 237, 0.35);
			}
		</style>
		<div class="forms-mixin-scope" style="display: grid; gap: 1.5rem; max-width: 28rem;">
			<hub-segmented
				label="View"
				[options]="viewOptions"
				[value]="'grid'"
				formText="The selected pill follows the themed accent and radius."
			/>

			<hub-input
				[formControl]="name"
				label="Full name"
				placeholder="Jane Doe"
				formText="Focus me to see the themed focus ring."
			/>
		</div>
	`,
	styles: []
})
export class MixinFormsExampleComponent {
	/** Options for the themed segmented control. */
	readonly viewOptions: HubSegmentedOption[] = [
		{ value: 'list', label: 'List' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'board', label: 'Board' }
	];

	/** Standalone control backing the themed input. */
	readonly name = new FormControl('');
}
