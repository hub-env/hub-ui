import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Password field example: a realistic register scenario (current + new password)
 * demonstrating the integrated reveal toggle, the opt-in strength meter, external
 * two-way control of `passwordRevealed`, and hiding the toggle altogether.
 */
@Component({
	selector: 'app-forms-input-password-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input
				formControlName="current"
				type="password"
				label="Current password"
				autocomplete="current-password"
				[(passwordRevealed)]="revealed"
			/>
			<button type="button" hubButton variant="outline" color="secondary" (click)="revealed = !revealed">
				Toggle from outside
			</button>

			<hub-input
				formControlName="newPassword"
				type="password"
				label="New password"
				autocomplete="new-password"
				passwordStrength
			/>

			<hub-input formControlName="pin" type="password" label="Without toggle" [passwordToggle]="false" />

			<p>While typing with Caps Lock on, a warning hint appears automatically under the field.</p>
		</form>
	`
})
export class FormsInputPasswordExampleComponent {
	/** Externally-controlled reveal state for the "current" field, proving two-way binding. */
	revealed = false;

	readonly form = new FormGroup({
		current: new FormControl(''),
		newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
		pin: new FormControl('')
	});

	static readonly templateCode = `<form [formGroup]="form">
  <!-- external control via [(passwordRevealed)] -->
  <hub-input formControlName="current" type="password" label="Current password"
    autocomplete="current-password" [(passwordRevealed)]="revealed" />
  <button type="button" hubButton variant="outline" color="secondary" (click)="revealed = !revealed">Toggle from outside</button>

  <!-- opt-in strength meter -->
  <hub-input formControlName="newPassword" type="password" label="New password"
    autocomplete="new-password" passwordStrength />

  <!-- toggle hidden -->
  <hub-input formControlName="pin" type="password" label="Without toggle" [passwordToggle]="false" />
</form>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';

@Component({
  selector: 'app-input-password',
  standalone: true,
  imports: [ReactiveFormsModule, HubInputComponent],
  templateUrl: './input-password.html'
})
export class InputPasswordComponent {
  revealed = false;

  readonly form = new FormGroup({
    current: new FormControl(''),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    pin: new FormControl('')
  });
}`;
}
