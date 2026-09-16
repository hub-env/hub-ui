import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubAppendDirective, HubPrependDirective, HubTimepickerComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `hub-timepicker` — a time of day, as `HH:MM`.
 *
 * The family had a date and no hour, so a product needing one reached for a text field with
 * an `HH:MM` pattern. A pattern is the wrong tool three times over: no numeric keyboard on a
 * phone, nothing offered when the field is focused, and "8:00" waved through until the form
 * is submitted rather than refused while it is typed.
 *
 * Built on `<input type="time">`, so the keyboard, the stepper and the reader's own 12- or
 * 24-hour presentation come from the platform — while what the form holds is always `HH:MM`,
 * unchanged by the reader's locale. Watch the emitted value while switching fields: an empty
 * one publishes `null` rather than an empty string, because "no time" is an absence and a
 * zero-length string sails straight past a `required` written as a null check.
 */
@Component({
	selector: 'app-forms-timepicker-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubTimepickerComponent,
		HubPrependDirective,
		HubAppendDirective,
		JsonPipe,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 46rem;">
			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-timepicker formControlName="opensAt" label="Opens at" formText="Required." />

				<hub-timepicker
					formControlName="closesAt"
					label="Closes at"
					[min]="'08:00'"
					[max]="'22:00'"
					[step]="900"
					formText="Between 08:00 and 22:00, in quarters."
				/>
			</div>

			<hub-timepicker
				formControlName="fromApi"
				label="Read back from an API"
				readonly
				formText="Fed '09:30:00' — the seconds are trimmed instead of showing nothing."
			/>

			<!-- The shape a time field is asked for most often: a label on the leading edge and the
			     zone on the trailing one, closing as a single box. Text addons and projected content
			     compose — the strings render first, so a button in a slot always sits outermost. -->
			<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
				<hub-timepicker formControlName="shiftFrom" label="Shift" prepend="From" append="UTC" />

				<hub-timepicker formControlName="shiftTo" label="Until">
					<ng-template hubAppend>
						<button type="button" hubButton variant="outline" color="secondary" (click)="setNow('shiftTo')">
							Now
						</button>
					</ng-template>
				</hub-timepicker>
			</div>

			<div
				style="display: grid; gap: 0.35rem; padding: 0.75rem 1rem; border-radius: 0.5rem; background: var(--hub-ref-color-gray-100, #f8f9fa);"
			>
				<strong style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.04em;">Emitted value</strong>
				<code style="font-size: 0.8rem;">{{ form.value | json }}</code>
				<span style="font-size: 0.8rem;">
					opensAt is <strong>{{ form.controls.opensAt.valid ? 'valid' : 'required' }}</strong>
				</span>
			</div>
		</form>
	`
})
export class FormsTimepickerExampleComponent {
	readonly form = new FormGroup({
		opensAt: new FormControl<string | null>(null, Validators.required),
		closesAt: new FormControl<string | null>('09:00'),
		// An instant straight from a server, which the control trims to the hour it shows.
		fromApi: new FormControl<string | null>('09:30:00'),
		shiftFrom: new FormControl<string | null>('09:00'),
		shiftTo: new FormControl<string | null>('18:00')
	});

	/** Stamps the current time, so the projected action does something worth seeing. */
	setNow(control: 'shiftTo'): void {
		const now = new Date();
		const pad = (n: number) => String(n).padStart(2, '0');
		this.form.patchValue({ [control]: `${pad(now.getHours())}:${pad(now.getMinutes())}` });
	}

	static readonly templateCode = `<hub-timepicker formControlName="opensAt" label="Opens at" />

<hub-timepicker
  formControlName="closesAt"
  label="Closes at"
  [min]="'08:00'"
  [max]="'22:00'"
  [step]="900"
/>

<!-- Group addons and a projected action, like every other box-shaped field -->
<hub-timepicker formControlName="shiftFrom" label="Shift" prepend="From" append="UTC" />

<hub-timepicker formControlName="shiftTo" label="Until">
  <ng-template hubAppend>
    <button type="button" (click)="setNow('shiftTo')">Now</button>
  </ng-template>
</hub-timepicker>`;

	static readonly componentCode = `readonly form = new FormGroup({
  opensAt: new FormControl<string | null>(null, Validators.required),
  closesAt: new FormControl<string | null>('09:00'),
  // '09:30:00' shows 09:30 rather than nothing: the seconds are trimmed on the way in.
  fromApi: new FormControl<string | null>('09:30:00')
});`;
}
