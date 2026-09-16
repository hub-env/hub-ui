import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Basic `hub-input` example: text / email / password fields bound to a reactive form,
 * showing the automatic, zero-wiring error display.
 */
@Component({
	selector: 'app-forms-input-basic-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input formControlName="name" label="Full name" placeholder="Jane Doe" />
			<hub-input
				formControlName="email"
				type="email"
				label="Email"
				placeholder="jane@acme.com"
				formText="We'll never share it."
			/>
			<hub-input formControlName="password" type="password" label="Password" labelType="floating" />
			<button type="button" hubButton color="primary" (click)="form.markAllAsTouched()">Validate</button>
		</form>
	`
})
export class FormsInputBasicExampleComponent {
	readonly form = new FormGroup({
		name: new FormControl('', Validators.required),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(8)])
	});

	static readonly templateCode = `<form [formGroup]="form">
  <hub-input formControlName="name" label="Full name" placeholder="Jane Doe" />
  <hub-input formControlName="email" type="email" label="Email" formText="We'll never share it." />
  <hub-input formControlName="password" type="password" label="Password" labelType="floating" />
</form>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';

@Component({
  selector: 'app-input-basic',
  standalone: true,
  imports: [ReactiveFormsModule, HubInputComponent],
  templateUrl: './input-basic.html'
})
export class InputBasicComponent {
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
}`;
}
