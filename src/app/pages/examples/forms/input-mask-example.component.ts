import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';

/**
 * Pattern-masked `hub-input` fields. The `mask` input tells the field how the data
 * should be entered — tokens `0` (digit), `A` (letter), `*` (alphanumeric) accept
 * input and every other character is an auto-inserted literal separator. Use
 * `unmaskValue` to store the raw characters (no separators) in the form.
 */
@Component({
	selector: 'app-forms-input-mask-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input
				formControlName="card"
				label="Card number"
				mask="0000 0000 0000 0000"
				placeholder="0000 0000 0000 0000"
				[unmaskValue]="true"
			/>
			<hub-input formControlName="expiry" label="Expiry" mask="00/00" placeholder="MM/YY" />
			<hub-input
				formControlName="iban"
				label="IBAN"
				mask="AA00 0000 0000 0000 0000 0000"
				placeholder="ES00 0000 0000 0000 0000 0000"
			/>
			<hub-input formControlName="phone" label="Phone" mask="+00 000 000 000" placeholder="+34 600 000 000" />
			<hub-input formControlName="date" label="Date" mask="00/00/0000" placeholder="DD/MM/YYYY" />

			<p style="font-size: 0.85rem; color: var(--hub-sys-text-muted);">
				Form value: <code>{{ form.value | json }}</code>
			</p>
		</form>
	`
})
export class FormsInputMaskExampleComponent {
	readonly form = new FormGroup({
		card: new FormControl(''),
		expiry: new FormControl(''),
		iban: new FormControl(''),
		phone: new FormControl(''),
		date: new FormControl('')
	});

	static readonly templateCode = `<!-- card: stores the raw digits via unmaskValue -->
<hub-input formControlName="card" label="Card number"
  mask="0000 0000 0000 0000" [unmaskValue]="true" />

<!-- expiry MM/YY -->
<hub-input formControlName="expiry" label="Expiry" mask="00/00" placeholder="MM/YY" />

<!-- IBAN: 2 letters + digits -->
<hub-input formControlName="iban" label="IBAN"
  mask="AA00 0000 0000 0000 0000 0000" />

<!-- phone -->
<hub-input formControlName="phone" label="Phone" mask="+00 000 000 000" />

<!-- date DD/MM/YYYY -->
<hub-input formControlName="date" label="Date" mask="00/00/0000" placeholder="DD/MM/YYYY" />`;

	static readonly componentCode = `// Mask tokens: 0 = digit · A = letter · * = alphanumeric.
// Any other character is an auto-inserted literal separator.
// unmaskValue=true stores only the typed characters (no separators).
readonly form = new FormGroup({
  card: new FormControl(''),
  expiry: new FormControl(''),
  iban: new FormControl(''),
  phone: new FormControl(''),
  date: new FormControl('')
});`;
}
