import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubFileInputComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Basic `hub-file-input` example: a single required file with an `accept` restriction, bound to a
 * reactive form. The control value is a plain `File`, ready for a `FormData`.
 */
@Component({
	selector: 'app-forms-file-input-basic-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubFileInputComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 32rem;">
			<hub-file-input
				formControlName="resume"
				label="Résumé"
				accept=".pdf,.doc,.docx"
				formText="Drag the file onto the box, paste it, or browse for it."
			/>
			<button type="button" hubButton color="primary" (click)="form.markAllAsTouched()">Validate</button>
			<p style="margin: 0; font-size: 0.875rem;">Selected: {{ selectedName() }}</p>
		</form>
	`
})
export class FormsFileInputBasicExampleComponent {
	readonly form = new FormGroup({
		resume: new FormControl<File | null>(null, Validators.required)
	});

	/**
	 * Reads the name of the selected file.
	 *
	 * @returns The file name, or a placeholder when nothing is selected.
	 */
	selectedName(): string {
		return this.form.controls.resume.value?.name ?? '—';
	}

	static readonly templateCode = `<form [formGroup]="form">
  <hub-file-input
    formControlName="resume"
    label="Résumé"
    accept=".pdf,.doc,.docx"
    formText="Drag the file onto the box, paste it, or browse for it." />
</form>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubFileInputComponent } from 'ng-hub-ui-forms';

@Component({
  selector: 'app-file-input-basic',
  standalone: true,
  imports: [ReactiveFormsModule, HubFileInputComponent],
  templateUrl: './file-input-basic.html'
})
export class FileInputBasicComponent {
  // The control holds a plain File — hand it straight to a FormData.
  readonly form = new FormGroup({
    resume: new FormControl<File | null>(null, Validators.required)
  });
}`;
}
