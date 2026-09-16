import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubFormTextDirective, HubValidationErrorDirective } from 'ng-hub-ui-forms';
import { HubIconComponent } from 'ng-hub-ui-icons';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * The two slots of `ng-hub-ui-forms` a signature can be dressed with, on a field nothing lets you
 * skip: helper text as markup, and the `required` message written in the product's own words.
 *
 * `[formText]` and the default message builder both take a string, so a keyboard hint with real
 * `<kbd>` keys, or an error with an icon beside it, had nowhere to go. Projecting
 * `<ng-template hubFormText>` replaces the helper block, and
 * `<ng-template hubValidationError key="required">` replaces the message for that one error key —
 * every other key still falls back to the builder. Submit without signing to see it.
 */
@Component({
	selector: 'app-signature-projected-templates-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubSignatureComponent,
		HubFormTextDirective,
		HubValidationErrorDirective,
		HubButtonComponent,
		HubIconComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column gap-3">
			<hub-signature formControlName="signature" [label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.PROJECTED.LABEL')">
				<ng-template hubFormText>
					<span>{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.PROJECTED.HELP') }}</span>
					<!-- The sentence above already names the keys, so the caps are decoration and are
					     hidden from the reader that would otherwise hear each one twice. -->
					<span class="d-inline-flex align-items-center gap-1 ms-1" aria-hidden="true">
						<kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>&uarr;</kbd><kbd>&darr;</kbd><kbd>Space</kbd>
					</span>
				</ng-template>

				<ng-template hubValidationError key="required">
					<span class="hub-field__feedback-text d-inline-flex align-items-center gap-2">
						<hub-icon name="fa:solid:triangle-exclamation" aria-hidden="true" />
						{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.PROJECTED.REQUIRED') }}
					</span>
				</ng-template>
			</hub-signature>

			<div class="d-flex align-items-center gap-3 flex-wrap">
				<button type="submit" hubButton color="primary" size="sm">
					{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.PROJECTED.SUBMIT') }}
				</button>

				@if (filed()) {
					<span class="text-success">{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.PROJECTED.FILED') }}</span>
				}
			</div>
		</form>
	`,
	styles: []
})
export class ProjectedTemplatesSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);
	private readonly fb = inject(FormBuilder);

	protected readonly form = this.fb.group({
		signature: ['', Validators.required]
	});

	/** Whether the last submission carried a signature, so the demo says what happened. */
	protected readonly filed = signal(false);

	/**
	 * Marking the tree as touched is what reveals the error on a field the reader never focused —
	 * `isInvalid` is touched *and* invalid, so a submit that skipped the box would otherwise pass
	 * in silence.
	 */
	protected submit(): void {
		this.form.markAllAsTouched();
		this.filed.set(this.form.valid);
	}

	static readonly templateCode = `<hub-signature formControlName="signature" label="Signature">
  <!-- Helper text as markup: [formText] takes a string, so <kbd> had nowhere to go. -->
  <ng-template hubFormText>
    <span>Sign with a pointer, or carry the pen with the arrow keys and lower it with Space.</span>
    <span aria-hidden="true">
      <kbd>&larr;</kbd><kbd>&rarr;</kbd><kbd>&uarr;</kbd><kbd>&darr;</kbd><kbd>Space</kbd>
    </span>
  </ng-template>

  <!-- One error key, in the product's own words. Every other key still falls
       back to the invalidFeedbackTemplateFn message builder. -->
  <ng-template hubValidationError key="required">
    <span class="hub-field__feedback-text">
      <hub-icon name="fa:solid:triangle-exclamation" aria-hidden="true" />
      The contract cannot be filed without a signature.
    </span>
  </ng-template>
</hub-signature>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Both directives are public exports of ng-hub-ui-forms, which is the point:
// markup written for hub-input moves to hub-signature unchanged.
import { HubFormTextDirective, HubValidationErrorDirective } from 'ng-hub-ui-forms';
import { HubSignatureComponent } from 'ng-hub-ui-signature';

@Component({
  imports: [ReactiveFormsModule, HubSignatureComponent, HubFormTextDirective, HubValidationErrorDirective],
  // ...
})
export class ContractComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    signature: ['', Validators.required]
  });

  submit() {
    // isInvalid is touched AND invalid, so a submit that skipped the box has to
    // mark the tree before the projected message can appear.
    this.form.markAllAsTouched();
  }
}`;
}
