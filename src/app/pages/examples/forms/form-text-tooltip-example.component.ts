import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent, HubSelectComponent, HubTextareaComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The rule this settles: one sentence goes below, more than one goes behind the question mark.
 *
 * Helper text under a control works for a sentence. It stops working the moment the text
 * *explains* something — a paragraph under every field turns a form into a document, pushes the
 * next field off the screen, and is read by nobody who already knew what the field was for.
 *
 * Flip the switch and watch the column, not the individual field. The marks line up at the end of
 * every label row rather than scattering wherever each label happens to stop, which is what makes
 * a form of them scannable instead of ragged.
 *
 * The trigger is a `<button>` beside the label, never inside it: activating a label focuses the
 * control it names, so a mark nested in one would open the tooltip *and* jump the caret into the
 * field. Its accessible name is the helper text itself, so a screen reader is told what a pointer
 * learns by hovering, rather than being handed a button called "question mark".
 */
@Component({
	selector: 'app-forms-form-text-tooltip-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubTextareaComponent, HubSelectComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="display: grid; gap: 1.25rem; max-width: 32rem;">
			<button
				type="button"
				hubButton
				variant="outline"
				color="secondary"
				size="sm"
				style="justify-self: start;"
				(click)="toggle()"
			>
				{{ tooltip() ? 'Helper text below each field' : 'Helper text behind the mark' }}
			</button>

			<form [formGroup]="form" style="display: grid; gap: 1rem;">
				<hub-input
					formControlName="iban"
					label="IBAN"
					[formTextType]="type()"
					formText="The account the refund is paid into. It must belong to the cardholder — a transfer to a third party is rejected by the bank and the refund starts again from the beginning."
				/>

				<hub-select
					formControlName="regime"
					label="Tax regime"
					[items]="regimes"
					[formTextType]="type()"
					formText="Changing this re-issues every invoice of the current quarter. Invoices already sent keep the regime they were issued under."
				/>

				<hub-textarea
					formControlName="notes"
					label="Delivery notes"
					[rows]="2"
					[formTextType]="type()"
					formText="Read by the driver, not by the warehouse. Anything the warehouse needs goes on the order line instead, where it is printed on the picking list."
				/>
			</form>
		</div>
	`
})
export class FormsFormTextTooltipExampleComponent {
	protected readonly tooltip = signal(true);

	/** `formTextType` takes the literal union, so the toggle hands it one of the two values. */
	protected type(): 'bottom' | 'tooltip' {
		return this.tooltip() ? 'tooltip' : 'bottom';
	}

	protected readonly regimes = ['General', 'Simplified', 'Equivalence surcharge'];

	protected readonly form = new FormGroup({
		iban: new FormControl('ES91 2100 0418 4502 0005 1332'),
		regime: new FormControl('General'),
		notes: new FormControl('')
	});

	protected toggle(): void {
		this.tooltip.update((v) => !v);
	}

	static readonly templateCode = `<!-- one sentence: below, where it is read without being asked for -->
<hub-input label="Name" formText="As it appears on the card." />

<!-- more than one: behind the mark, so it does not push the form apart -->
<hub-input
  label="IBAN"
  formTextType="tooltip"
  formText="The account the refund is paid into. It must belong to the cardholder — a transfer to a third party is rejected by the bank."
/>`;

	static readonly componentCode = `// formTextType is inherited from HubFieldControl, so every field that carries
// helper text takes it: input, textarea, select, datepicker, timepicker,
// otp-input, segmented, slider and file-input — plus hub-signature.
//
// The mark is a <button> beside the label, never inside it: activating a label
// focuses the control it names, so a mark nested in one would open the tooltip
// and jump the caret into the field at the same time.`;
}
