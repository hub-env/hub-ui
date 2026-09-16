import { ChangeDetectionStrategy, Component, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubModal } from 'ng-hub-ui-modal';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `hub-datepicker` inside a modal — the calendar renders above the dialog.
 *
 * The sibling case to the select's, and it had the same shape of bug for a different reason. The
 * calendar lives in an overlay that opens on the dropdown layer (`1000`) with its backdrop one
 * under it, and `HubModal` sits at `1055`: a date field inside a dialog opened a calendar nobody
 * could see, behind a backdrop that caught none of the clicks meant to dismiss it. Both halves
 * mattered — a panel you cannot see and a panel you cannot close are different failures.
 *
 * `--hub-datepicker-overlay-zindex` now puts it on the layer the select already used, and the
 * backdrop one below: over the dialog so it catches the click, under the calendar so it does not
 * cover it. Open the modal, then open the calendar; then click away to check it closes.
 */
@Component({
	selector: 'app-forms-datepicker-in-modal-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<button hubButton color="primary" (click)="open(tpl)">Open a modal with a datepicker</button>

		<ng-template #tpl let-close="close">
			<div class="modal-header">
				<h5 class="modal-title">Pick a delivery date</h5>
			</div>
			<div class="modal-body">
				<p class="text-muted">Open the calendar — it renders above the dialog, and clicking away closes it.</p>
				<hub-datepicker [locale]="locale()" [formControl]="due" label="Delivery" placeholder="Pick a date" />
			</div>
			<div class="modal-footer">
				<button hubButton color="primary" (click)="close()">Done</button>
			</div>
		</ng-template>
	`
})
export class FormsDatepickerInModalExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	// Optional so the docs prerender and the code extraction — which reach the component outside
	// the app's provider tree — do not fail; at runtime the app provides HubModal.
	private readonly modal = inject(HubModal, { optional: true });

	readonly due = new FormControl<Date | null>(null);

	/** Opens the template as a modal; the calendar stacks above it. */
	open(tpl: TemplateRef<unknown>): void {
		this.modal?.open(tpl, { headerSelector: '.modal-header', footerSelector: '.modal-footer' }).result.catch(() => {});
	}

	static readonly templateCode = `<button hubButton color="primary" (click)="open(tpl)">Open modal</button>

<ng-template #tpl let-close="close">
  <div class="modal-header"><h5 class="modal-title">Pick a delivery date</h5></div>
  <div class="modal-body">
    <hub-datepicker [formControl]="due" label="Delivery" placeholder="Pick a date" />
  </div>
  <div class="modal-footer"><button hubButton color="primary" (click)="close()">Done</button></div>
</ng-template>`;

	static readonly componentCode = `import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HubModal } from 'ng-hub-ui-modal';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';

export class DatepickerInModalComponent {
  private readonly modal = inject(HubModal);
  readonly due = new FormControl<Date | null>(null);

  // --hub-datepicker-overlay-zindex stacks the calendar above HubModal, and its
  // backdrop one layer under it: over the dialog so it catches the click that
  // dismisses the calendar, under the calendar so it does not cover it.
  open(tpl: TemplateRef<unknown>) {
    this.modal.open(tpl, { headerSelector: '.modal-header', footerSelector: '.modal-footer' });
  }
}`;
}
