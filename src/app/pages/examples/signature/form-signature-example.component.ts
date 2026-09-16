import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * The field as a form control, which is what the SVG value exists for.
 *
 * The required marker and the error message are derived from the control's validators, not bound
 * by hand; the success message needs both halves of the opt-in, `[showValid]` and
 * `[validFeedback]`. Leave the box empty, tab past it, and the error appears — the field is
 * marked touched when focus leaves it, like any other.
 */
@Component({
	selector: 'app-signature-form-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSignatureComponent, HubButtonComponent, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column gap-3">
			<hub-signature
				formControlName="signature"
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.FORM.LABEL')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.FORM.HELP')"
				[showValid]="true"
				[validFeedback]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.FORM.VALID')"
				[strokeColor]="'#212529'"
			/>

			<div class="d-flex align-items-center gap-3 flex-wrap">
				<button type="submit" hubButton color="primary" size="sm" [disabled]="form.invalid">
					{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.FORM.SUBMIT') }}
				</button>

				@if (savedBytes(); as bytes) {
					<hub-badge color="success" shape="rounded">
						{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.FORM.SUBMITTED', { bytes }) }}
					</hub-badge>
				}
			</div>
		</form>
	`,
	styles: []
})
export class FormSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);
	private readonly fb = inject(FormBuilder);

	/** The control's value is the SVG string the field serializes itself into. */
	protected readonly form = this.fb.group({
		signature: ['', Validators.required]
	});

	/** Size of the last submitted signature, which is what a backend would actually receive. */
	protected readonly savedBytes = signal(0);

	protected submit(): void {
		this.savedBytes.set(this.form.value.signature?.length ?? 0);
	}

	static readonly templateCode = `<form [formGroup]="form" (ngSubmit)="submit()">
  <hub-signature
    formControlName="signature"
    label="Signature"
    formText="Sign inside the box with a pointer or the keyboard."
    [showValid]="true"
    validFeedback="Signature captured."
    [strokeColor]="'#212529'"
  />

  <button type="submit" [disabled]="form.invalid">Send</button>
</form>`;

	static readonly componentCode = `import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubSignatureComponent } from 'ng-hub-ui-signature';

@Component({
  // ReactiveFormsModule is required here: HubFormControl declares its own
  // formControlName input, so Angular raises no error when the directive is
  // missing — the field would just never sync with the form.
  imports: [ReactiveFormsModule, HubSignatureComponent],
  // ...
})
export class ConsentFormComponent {
  private readonly fb = inject(FormBuilder);

  // The control's value is the SVG produced by toSvg(), or '' while empty.
  readonly form = this.fb.group({
    signature: ['', Validators.required]
  });

  readonly savedBytes = signal(0);

  submit() {
    this.savedBytes.set(this.form.value.signature?.length ?? 0);
  }

  // Disable through the control, never with [disabled]: that input collides
  // with FormControlName's own and leaves two sources of truth.
  lock() {
    this.form.controls.signature.disable();
  }
}`;
}
