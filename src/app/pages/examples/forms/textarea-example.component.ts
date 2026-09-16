import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubTextareaComponent } from 'ng-hub-ui-forms';

/**
 * `hub-textarea` with a character counter and auto-resize.
 */
@Component({
	selector: 'app-forms-textarea-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubTextareaComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-textarea
				formControlName="bio"
				label="Biography"
				placeholder="Tell us about yourself…"
				[rows]="3"
				[maxlength]="160"
				[counter]="true"
				[autoresize]="true"
				formText="Grows as you type."
			/>
		</form>
	`
})
export class FormsTextareaExampleComponent {
	readonly form = new FormGroup({
		bio: new FormControl('', [Validators.required, Validators.maxLength(160)])
	});

	static readonly templateCode = `<hub-textarea
  formControlName="bio"
  label="Biography"
  placeholder="Tell us about yourself…"
  [rows]="3"
  [maxlength]="160"
  [counter]="true"
  [autoresize]="true"
  formText="Grows as you type." />`;

	static readonly componentCode = `readonly form = new FormGroup({
  bio: new FormControl('', [Validators.required, Validators.maxLength(160)])
});`;
}
