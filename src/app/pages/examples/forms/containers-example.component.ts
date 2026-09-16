import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import {
	hubAreEqual,
	HubFieldsetComponent,
	HubFormComponent,
	HubInputComponent,
	HubLegendComponent,
	HubValidationErrorDirective
} from 'ng-hub-ui-forms';

/** Root-level cross-field rule: name and nickname must differ. */
function nameNickDiffer(group: AbstractControl): ValidationErrors | null {
	const name = (group.get('name')?.value ?? '').trim();
	const nick = (group.get('nick')?.value ?? '').trim();
	return name && nick && name === nick ? { nameNickSame: true } : null;
}

/** Group-level rule: a contact needs one channel, and either one will do. */
function oneContactChannel(group: AbstractControl): ValidationErrors | null {
	const email = (group.get('email')?.value ?? '').trim();
	const phone = (group.get('phone')?.value ?? '').trim();
	return email || phone ? null : { noContactChannel: true };
}

/**
 * Automatic error display at all three levels: control (`hub-input`), group (the fieldset) and
 * form (`form[hubForm]`). Cross-field errors surface with zero wiring.
 *
 * The legend, too, has one shape: a `<hub-legend>`. The Password group projects one, so it can
 * carry the required marker and turn red with the group; the Contact group uses `legend="…"`,
 * which builds the same element for you when the legend is only text.
 *
 * The two groups below are the two interchangeable forms of the same component. `<fieldset
 * hubFieldset>` dresses the native element it is written on; `<hub-fieldset>` emits a `<fieldset>`
 * of its own inside the host, which is one element deeper — a box with no meaning between the
 * form's grid and the children it lays out. Same inputs, same legend, same group-level errors, so
 * the choice is only ever about that extra element. The attribute form is restricted to
 * `<fieldset>` on purpose: on a `<div>` it would draw a legend over a group with none of the
 * semantics assistive technology reads from a real fieldset.
 *
 * They also differ in how each finds its group, which is orthogonal to the tag: `[group]` names
 * the control directly, `groupName` resolves it from the parent container.
 */
@Component({
	selector: 'app-forms-containers-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubInputComponent,
		HubFieldsetComponent,
		HubFormComponent,
		HubValidationErrorDirective,
		HubButtonComponent,
		HubLegendComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" hubForm (submit)="onSubmit()" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input formControlName="name" label="Name" />
			<hub-input formControlName="nick" label="Nickname" />

			<fieldset hubFieldset [group]="form.controls.credentials">
				<hub-legend [required]="true" [invalid]="form.controls.credentials.invalid">Password</hub-legend>

				<div [formGroup]="form.controls.credentials" style="display: grid; gap: 1.25rem;">
					<hub-input formControlName="password" type="password" label="Password" />
					<hub-input formControlName="confirm" type="password" label="Confirm" />
				</div>
			</fieldset>

			<hub-fieldset legend="Contact" groupName="contact">
				<div [formGroup]="form.controls.contact" style="display: grid; gap: 1.25rem;">
					<hub-input formControlName="email" type="email" label="Email" />
					<hub-input formControlName="phone" type="tel" label="Phone" />
				</div>

				<ng-template hubValidationError key="noContactChannel">
					<span class="hub-field__feedback-text">Leave us an email address or a phone number.</span>
				</ng-template>
			</hub-fieldset>

			<ng-template hubValidationError key="nameNickSame">
				<span class="hub-field__feedback-text">Name and nickname must be different.</span>
			</ng-template>

			<button type="submit" hubButton color="primary">Submit</button>
		</form>
	`
})
export class FormsContainersExampleComponent {
	readonly form = new FormGroup(
		{
			name: new FormControl('', Validators.required),
			nick: new FormControl('', Validators.required),
			credentials: new FormGroup(
				{
					password: new FormControl('', Validators.required),
					confirm: new FormControl('', Validators.required)
				},
				{ validators: hubAreEqual('password', 'confirm') }
			),
			contact: new FormGroup(
				{
					email: new FormControl(''),
					phone: new FormControl('')
				},
				{ validators: oneContactChannel }
			)
		},
		{ validators: nameNickDiffer }
	);

	/**
	 * Handles the form submission event. Used purely for demonstration
	 * purposes in this example.
	 */
	onSubmit(): void {}

	static readonly templateCode = `<!-- hubForm is an attribute on the native <form>: there is no element form of the
     container, because the formGroup directive has to sit on the same host. -->
<form [formGroup]="form" hubForm (submit)="onSubmit()">
  <hub-input formControlName="name" label="Name" />
  <hub-input formControlName="nick" label="Nickname" />

  <!-- Attribute form: the host already is the <fieldset>, so the group costs one
       element. Group-level (cross-field) errors are shown automatically.
       A projected <hub-legend> is lifted into the native <legend>, and is where the
       required marker and the invalid state live. legend="…" builds the same element
       for you when the legend is just text. -->
  <fieldset hubFieldset [group]="form.controls.credentials">
    <hub-legend [required]="true" [invalid]="form.controls.credentials.invalid">Password</hub-legend>

    <div [formGroup]="form.controls.credentials">
      <hub-input formControlName="password" type="password" label="Password" />
      <hub-input formControlName="confirm" type="password" label="Confirm" />
    </div>
  </fieldset>

  <!-- Element form: same component, same inputs, and a <fieldset> emitted inside
       the host — one element deeper. groupName resolves against the parent form. -->
  <hub-fieldset legend="Contact" groupName="contact">
    <div [formGroup]="form.controls.contact">
      <hub-input formControlName="email" type="email" label="Email" />
      <hub-input formControlName="phone" type="tel" label="Phone" />
    </div>

    <!-- custom message for a group-level error -->
    <ng-template hubValidationError key="noContactChannel">
      <span class="hub-field__feedback-text">Leave us an email address or a phone number.</span>
    </ng-template>
  </hub-fieldset>

  <!-- custom message for a form-level error -->
  <ng-template hubValidationError key="nameNickSame">
    <span class="hub-field__feedback-text">Name and nickname must be different.</span>
  </ng-template>

  <button type="submit" hubButton color="primary">Submit</button>
</form>`;

	static readonly componentCode = `// cross-field validators (group + root)
const credentials = new FormGroup(
  { password: new FormControl('', Validators.required), confirm: new FormControl('', Validators.required) },
  { validators: hubAreEqual('password', 'confirm') }
);

// A contact needs one channel, and either one will do.
function oneContactChannel(group: AbstractControl): ValidationErrors | null {
  const email = (group.get('email')?.value ?? '').trim();
  const phone = (group.get('phone')?.value ?? '').trim();
  return email || phone ? null : { noContactChannel: true };
}

const contact = new FormGroup(
  { email: new FormControl(''), phone: new FormControl('') },
  { validators: oneContactChannel }
);

readonly form = new FormGroup(
  { name: new FormControl('', Validators.required), nick: new FormControl('', Validators.required), credentials, contact },
  { validators: nameNickDiffer }
);`;
}
