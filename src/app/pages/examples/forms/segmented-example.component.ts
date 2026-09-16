import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSegmentedComponent, HubSegmentedOption } from 'ng-hub-ui-forms';

/**
 * `hub-segmented` — a segmented control bound like any form field: single or
 * multiple selection, horizontal or vertical, with label / helper text.
 */
@Component({
	selector: 'app-forms-segmented-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSegmentedComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.75rem; max-width: 28rem;">
			<hub-segmented
				formControlName="view"
				label="View"
				color="primary"
				[options]="viewOptions"
				formText="Single-select — the selected pill slides between options."
			/>

			<hub-segmented
				formControlName="perks"
				label="Perks"
				color="success"
				[options]="perkOptions"
				[multiple]="true"
				formText="Multiple-select — the value is an array."
			/>

			<hub-segmented formControlName="plan" label="Plan" [options]="planOptions" [vertical]="true" size="sm" />

			<!-- [color] accepts any value: a semantic name, a registered accent, or a literal colour. -->
			<div style="display: grid; gap: 0.75rem;">
				<hub-segmented label="Named accent" color="info" [options]="viewOptions" [value]="'grid'" />
				<hub-segmented label="Literal #hex" color="#e11d48" [options]="viewOptions" [value]="'grid'" />
				<hub-segmented label="Literal oklch()" color="oklch(0.72 0.19 145)" [options]="viewOptions" [value]="'grid'" />
			</div>

			<p class="mb-0 text-body-secondary">
				view: <strong>{{ form.controls.view.value }}</strong> · perks:
				<strong>{{ form.controls.perks.value?.join(', ') || '—' }}</strong>
			</p>
		</form>
	`
})
export class FormsSegmentedExampleComponent {
	readonly viewOptions: HubSegmentedOption[] = [
		{ value: 'list', label: 'List' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'board', label: 'Board' }
	];

	readonly perkOptions: HubSegmentedOption[] = [
		{ value: 'wifi', label: 'Wi-Fi' },
		{ value: 'parking', label: 'Parking' },
		{ value: 'breakfast', label: 'Breakfast' }
	];

	readonly planOptions: HubSegmentedOption[] = [
		{ value: 'free', label: 'Free' },
		{ value: 'pro', label: 'Pro' },
		{ value: 'enterprise', label: 'Enterprise', disabled: true }
	];

	readonly form = new FormGroup({
		view: new FormControl<string>('list'),
		perks: new FormControl<string[]>(['wifi']),
		plan: new FormControl<string>('pro')
	});

	static readonly templateCode = `<!-- single-select (radiogroup) — a semantic color + a sliding selected pill -->
<hub-segmented formControlName="view" label="View" color="primary" [options]="viewOptions" />

<!-- multiple-select — value is an array, buttons toggle with aria-pressed -->
<hub-segmented formControlName="perks" label="Perks" color="success" [options]="perkOptions" [multiple]="true" />

<!-- vertical layout -->
<hub-segmented formControlName="plan" label="Plan" [options]="planOptions" [vertical]="true" size="sm" />

<!-- [color] accepts a semantic name, a registered accent, or a literal colour -->
<hub-segmented color="info" [options]="viewOptions" />
<hub-segmented color="#e11d48" [options]="viewOptions" />
<hub-segmented color="oklch(0.72 0.19 145)" [options]="viewOptions" />

<!-- one-call theming (SCSS): @use 'ng-hub-ui-forms/styles' as *;  @include hub-segmented-theme($selected-bg: gold, $radius: 999px); -->`;

	static readonly componentCode = `readonly form = new FormGroup({
  view: new FormControl<string>('list'),
  perks: new FormControl<string[]>(['wifi']),   // multiple → array
  plan: new FormControl<string>('pro')
});`;
}
