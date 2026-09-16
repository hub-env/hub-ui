import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubOtpInputComponent } from 'ng-hub-ui-forms';

/**
 * One-time-code (`hub-otp-input`) fields: segmented cells with auto-advance, backspace
 * navigation and full-code paste. The form value is the concatenated string.
 */
@Component({
	selector: 'app-forms-input-otp-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubOtpInputComponent, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.5rem; max-width: 28rem;">
			<hub-otp-input
				formControlName="code"
				[length]="6"
				label="Verification code"
				formText="Paste the 6-digit code we sent you."
			/>
			<hub-otp-input formControlName="pin" [length]="4" mode="numeric" [secret]="true" label="PIN" />
			<hub-otp-input formControlName="coupon" [length]="9" mode="alphanumeric" [separatorEvery]="3" label="Coupon" />

			<p style="font-size: 0.85rem; color: var(--hub-sys-text-muted);">
				Form value: <code>{{ form.value | json }}</code>
			</p>
		</form>
	`
})
export class FormsInputOtpExampleComponent {
	readonly form = new FormGroup({
		code: new FormControl('', Validators.required),
		pin: new FormControl(''),
		coupon: new FormControl('')
	});

	static readonly templateCode = `<!-- 6-digit verification code -->
<hub-otp-input formControlName="code" [length]="6" label="Verification code"
  formText="Paste the 6-digit code we sent you." />

<!-- 4-digit masked PIN -->
<hub-otp-input formControlName="pin" [length]="4" mode="numeric" [secret]="true" label="PIN" />

<!-- alphanumeric coupon, grouped every 3 cells -->
<hub-otp-input formControlName="coupon" [length]="9" mode="alphanumeric"
  [separatorEvery]="3" label="Coupon" />`;

	static readonly componentCode = `// length · mode ('numeric' | 'alphanumeric' | 'alpha') · secret · separatorEvery.
// Auto-advance, backspace navigation, arrow keys and full-code paste are built in.
// The form value is the concatenated string; (completed) fires when all cells fill.
readonly form = new FormGroup({
  code: new FormControl('', Validators.required),
  pin: new FormControl(''),
  coupon: new FormControl('')
});`;
}
