import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSegmentedComponent, HubSegmentedOption, HubSegmentedOptionDirective } from 'ng-hub-ui-forms';

/**
 * `hub-segmented` custom option template — a projected `hubSegmentedOption`
 * `<ng-template>` replaces each segment's content (icon + label + selected
 * marker) while the component keeps owning selection, keyboard navigation and
 * ARIA. Context: the option (implicit), `selected` and `index`.
 */
@Component({
	selector: 'app-forms-segmented-template-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSegmentedComponent, HubSegmentedOptionDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.75rem; max-width: 28rem;">
			<hub-segmented
				formControlName="transport"
				label="Transport"
				color="primary"
				[options]="transportOptions"
				formText="Single-select — the template renders an icon, the label and a check on the selected segment."
			>
				<ng-template hubSegmentedOption let-option let-selected="selected">
					<span aria-hidden="true">{{ iconFor(option) }}</span>
					{{ option.label }}
					@if (selected) {
						<span aria-hidden="true">✓</span>
					}
				</ng-template>
			</hub-segmented>

			<hub-segmented
				formControlName="channels"
				label="Notification channels"
				color="success"
				[options]="channelOptions"
				[multiple]="true"
				formText="Multiple-select — the same template contract; index comes from the context."
			>
				<ng-template hubSegmentedOption let-option let-index="index">
					<span aria-hidden="true">{{ iconFor(option) }}</span>
					{{ index + 1 }}. {{ option.label }}
				</ng-template>
			</hub-segmented>

			<p class="mb-0 text-body-secondary">
				transport: <strong>{{ form.controls.transport.value }}</strong> · channels:
				<strong>{{ form.controls.channels.value?.join(', ') || '—' }}</strong>
			</p>
		</form>
	`
})
export class SegmentedTemplateFormsExampleComponent {
	readonly transportOptions: HubSegmentedOption[] = [
		{ value: 'walk', label: 'Walk' },
		{ value: 'bike', label: 'Bike' },
		{ value: 'car', label: 'Car' }
	];

	readonly channelOptions: HubSegmentedOption[] = [
		{ value: 'email', label: 'Email' },
		{ value: 'sms', label: 'SMS' },
		{ value: 'push', label: 'Push' }
	];

	/** Emoji glyph per option value, resolved by the projected template. */
	private readonly icons: Record<string, string> = {
		walk: '🚶',
		bike: '🚲',
		car: '🚗',
		email: '✉️',
		sms: '💬',
		push: '🔔'
	};

	readonly form = new FormGroup({
		transport: new FormControl<string>('bike'),
		channels: new FormControl<string[]>(['email'])
	});

	/**
	 * Resolves the emoji glyph for a segmented option.
	 *
	 * @param option Option handed to the template as implicit context.
	 * @returns The matching emoji, or an empty string.
	 */
	iconFor(option: HubSegmentedOption): string {
		return this.icons[String(option.value)] ?? '';
	}

	static readonly templateCode = `<!-- hubSegmentedOption replaces each segment's content; selection/keyboard/ARIA stay owned by the component -->
<hub-segmented formControlName="transport" label="Transport" color="primary" [options]="transportOptions">
  <ng-template hubSegmentedOption let-option let-selected="selected">
    <span aria-hidden="true">{{ iconFor(option) }}</span>
    {{ option.label }}
    @if (selected) { <span aria-hidden="true">✓</span> }
  </ng-template>
</hub-segmented>

<!-- same contract in multiple mode; the context also carries the option index -->
<hub-segmented formControlName="channels" label="Notification channels" color="success" [options]="channelOptions" [multiple]="true">
  <ng-template hubSegmentedOption let-option let-index="index">
    <span aria-hidden="true">{{ iconFor(option) }}</span>
    {{ index + 1 }}. {{ option.label }}
  </ng-template>
</hub-segmented>`;

	static readonly componentCode = `// Context: $implicit (the HubSegmentedOption), selected: boolean, index: number
readonly transportOptions: HubSegmentedOption[] = [
  { value: 'walk', label: 'Walk' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' }
];

iconFor(option: HubSegmentedOption): string {
  return this.icons[String(option.value)] ?? '';
}

readonly form = new FormGroup({
  transport: new FormControl<string>('bike'),
  channels: new FormControl<string[]>(['email'])   // multiple → array
});`;
}
