import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent, HubTextareaComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The same record, edited and consulted — which is what `plaintext` is for.
 *
 * `readonly` and `plaintext` are the two halves of a shut field, and the difference is who the
 * field is for. The reference number is `readonly` in both modes: somebody *is* filling this form
 * in, and that field is a state of it — a theme can give it a box through `--hub-input-readonly-*`.
 * The rest turn `plaintext` when the record is merely being read, because there the box is noise,
 * and having none is what `plaintext` is rather than a colour it happens to wear.
 *
 * At the shipped defaults `readonly` draws no box either: the value keeps full contrast and loses
 * only the chrome that promises typing. Left alone beside plain-text fields, the two then differ
 * by a 12px inset and nothing else, which reads as a misalignment rather than as a distinction —
 * so this demo sets `--hub-input-readonly-bg` and `--hub-input-readonly-border-color` on the
 * reference field, which is what a design system does to get Bootstrap's boxed read-only back.
 *
 * Flip the switch and watch what does *not* move. The horizontal padding goes and the border turns
 * transparent while keeping its width, so every value stays on the baseline it had. That is the
 * whole trick: a form mixing the two does not stagger.
 *
 * The notes field carries a character counter, which is the affordance worth watching: it tells
 * you how much room is left to type, so it promises typing. It goes with the box.
 *
 * The control stays a real `<input>` / `<textarea>`, so the label still points at something
 * labelable and the text stays selectable — try selecting it. A `<span>` would have looked right
 * and broken both, silently.
 */
@Component({
	selector: 'app-forms-plaintext-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent, HubTextareaComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="display: grid; gap: 1.25rem; max-width: 34rem;">
			<button
				type="button"
				hubButton
				variant="outline"
				color="secondary"
				size="sm"
				style="justify-self: start;"
				(click)="toggle()"
			>
				{{ viewing() ? 'Editing this record' : 'Viewing this record' }}
			</button>

			<form [formGroup]="form" style="display: grid; gap: 1rem;">
				<hub-input
					class="boxed-readonly"
					formControlName="reference"
					label="Reference"
					[readonly]="true"
					formText="Read-only, and given a box here by the two readonly tokens — it draws none by default."
				/>

				<hub-input formControlName="customer" label="Customer" [plaintext]="viewing()" />

				<hub-input formControlName="amount" label="Amount" [plaintext]="viewing()" />

				<hub-textarea
					formControlName="notes"
					label="Notes"
					[rows]="3"
					[counter]="true"
					[maxlength]="120"
					[plaintext]="viewing()"
				/>
			</form>
		</div>
	`,
	styles: [
		`
			/* Read-only draws no box by default — the value keeps full contrast and loses only the
			   chrome that promises you can type in it. That is deliberate, but with plain-text
			   fields underneath it leaves the two distinguishable only by a 12px inset, which
			   reads as a misalignment rather than as a difference. These are the two tokens the
			   README names, and they are what a design system sets to get Bootstrap's boxed
			   read-only back. */
			.boxed-readonly {
				--hub-input-readonly-bg: var(--hub-sys-surface-sunken, #f8f9fa);
				--hub-input-readonly-border-color: var(--hub-sys-border-subtle, var(--hub-sys-border-color-default, #dee2e6));
			}
		`
	]
})
export class FormsPlaintextExampleComponent {
	/** Starts in the reading mode, since that is the state the input exists for. */
	protected readonly viewing = signal(true);

	protected readonly form = new FormGroup({
		reference: new FormControl('ORD-2026-0448'),
		customer: new FormControl('Ferretería Mediterráneo, S.L.'),
		amount: new FormControl('1.240,00 €'),
		notes: new FormControl('Delivered to the loading bay. Two pallets short, credited on the next invoice.')
	});

	protected toggle(): void {
		this.viewing.update((v) => !v);
	}

	static readonly cssCode = `/* Read-only draws no box by default. These two tokens are what a
   design system sets to get Bootstrap's boxed read-only back. */
.boxed-readonly {
  --hub-input-readonly-bg: var(--hub-sys-surface-sunken, #f8f9fa);
  --hub-input-readonly-border-color: var(--hub-sys-border-subtle, var(--hub-sys-border-color-default, #dee2e6));
}`;

	static readonly templateCode = `<!-- readonly: still being filled in, so it keeps the box -->
<hub-input formControlName="reference" label="Reference" [readonly]="true" class="boxed-readonly" />

<!-- plaintext: merely being read, so the box is noise -->
<hub-input formControlName="customer" label="Customer" [plaintext]="viewing()" />
<hub-input formControlName="amount" label="Amount" [plaintext]="viewing()" />
<hub-textarea formControlName="notes" label="Notes" [rows]="3" [counter]="true" [maxlength]="120" [plaintext]="viewing()" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export class RecordComponent {
  readonly viewing = signal(true);

  // plaintext implies readonly, so the two can never be passed in disagreement.
  readonly form = new FormGroup({
    reference: new FormControl('ORD-2026-0448'),
    customer: new FormControl('Ferretería Mediterráneo, S.L.'),
    amount: new FormControl('1.240,00 €'),
    notes: new FormControl('Delivered to the loading bay.')
  });
}`;
}
