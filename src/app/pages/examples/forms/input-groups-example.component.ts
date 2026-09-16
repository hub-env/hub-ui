import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';

/**
 * Input groups (prepend / append addons), the deprecated file picker and the floating label type.
 *
 * The file field is kept because the format still exists and someone maintaining an older form
 * needs to see it — but it is deprecated in favour of `<hub-file-input>`. Marked here as well,
 * since the example is what gets copied and the `@deprecated` tag only shows on hover.
 */
@Component({
	selector: 'app-forms-input-groups-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input formControlName="price" label="Price" prepend="$" append=".00" placeholder="0" />
			<hub-input formControlName="user" label="Username" prepend="@" />
			<hub-input
				formControlName="resume"
				type="file"
				label="Resume"
				accept=".pdf,.doc,.docx"
				buttonLabel="Browse…"
				placeholder="No file selected"
				formText="Deprecated since 22.6.0 — use <hub-file-input> instead."
			/>
			<hub-input formControlName="city" label="City" labelType="floating" />
		</form>
	`
})
export class FormsInputGroupsExampleComponent {
	readonly form = new FormGroup({
		price: new FormControl(''),
		user: new FormControl(''),
		resume: new FormControl<File | null>(null),
		city: new FormControl('')
	});

	static readonly templateCode = `<!-- input group: prepend + append -->
<hub-input formControlName="price" label="Price" prepend="$" append=".00" placeholder="0" />
<hub-input formControlName="user" label="Username" prepend="@" />

<!-- file picker -->
<hub-input formControlName="resume" type="file" label="Resume"
  accept=".pdf,.doc,.docx" buttonLabel="Browse…" placeholder="No file selected" />

<!-- floating label -->
<hub-input formControlName="city" label="City" labelType="floating" />`;

	static readonly componentCode = `readonly form = new FormGroup({
  price: new FormControl(''),
  user: new FormControl(''),
  resume: new FormControl<File | null>(null),
  city: new FormControl('')
});`;
}
