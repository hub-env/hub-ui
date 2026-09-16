import { ChangeDetectionStrategy, Component, TemplateRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubModal } from 'ng-hub-ui-modal';
import { HubSelectComponent } from 'ng-hub-ui-forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `hub-select` inside a modal — the dropdown renders above the dialog.
 *
 * The vendored ng-select hard-codes `z-index: 1050` on its panel, one below
 * `HubModal` (`1055`), so a select opened inside a modal used to be clipped
 * underneath it. The `--hub-select-dropdown-z-index` token now stacks the panel
 * above the modal. Open the modal, then open the select to see the dropdown on top.
 */
@Component({
	selector: 'app-forms-select-in-modal-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<button hubButton color="primary" (click)="open(tpl)">Open a modal with a select</button>

		<ng-template #tpl let-close="close">
			<div class="modal-header">
				<h5 class="modal-title">Choose a country</h5>
			</div>
			<div class="modal-body">
				<p class="text-muted">Open the dropdown — it now renders above the dialog.</p>
				<hub-select
					[formControl]="country"
					label="Country"
					[items]="countries"
					bindLabel="name"
					bindValue="code"
					placeholder="Select a country"
				/>
			</div>
			<div class="modal-footer">
				<button hubButton color="primary" (click)="close()">Done</button>
			</div>
		</ng-template>
	`
})
export class FormsSelectInModalExampleComponent {
	// Optional so the docs prerender/code-extraction (which instantiates the
	// component outside the app's provider tree) does not fail; at runtime the
	// app provides HubModal and the button works normally.
	private readonly modal = inject(HubModal, { optional: true });

	readonly country = new FormControl<string | null>(null);

	countries = [
		{ code: 'es', name: 'Spain' },
		{ code: 'fr', name: 'France' },
		{ code: 'de', name: 'Germany' },
		{ code: 'jp', name: 'Japan' },
		{ code: 'us', name: 'United States' }
	];

	/** Opens the template as a modal; the select dropdown stacks above it. */
	open(tpl: TemplateRef<unknown>): void {
		this.modal?.open(tpl, { headerSelector: '.modal-header', footerSelector: '.modal-footer' }).result.catch(() => {});
	}

	static readonly templateCode = `<button hubButton color="primary" (click)="open(tpl)">Open modal</button>

<ng-template #tpl let-close="close">
  <div class="modal-header"><h5 class="modal-title">Choose a country</h5></div>
  <div class="modal-body">
    <hub-select [formControl]="country" [items]="countries"
      bindLabel="name" bindValue="code" placeholder="Select a country" />
  </div>
  <div class="modal-footer"><button hubButton color="primary" (click)="close()">Done</button></div>
</ng-template>`;

	static readonly componentCode = `import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HubModal } from 'ng-hub-ui-modal';
import { HubSelectComponent } from 'ng-hub-ui-forms';

export class SelectInModalComponent {
  private readonly modal = inject(HubModal);
  readonly country = new FormControl<string | null>(null);
  // The --hub-select-dropdown-z-index token stacks the panel above HubModal.
  open(tpl: TemplateRef<unknown>) {
    this.modal.open(tpl, { headerSelector: '.modal-header', footerSelector: '.modal-footer' });
  }
}`;
}
