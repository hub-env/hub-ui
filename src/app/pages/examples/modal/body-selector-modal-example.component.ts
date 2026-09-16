import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Content whose three slots are written OUT of order, and with something between them that
 * belongs to none of them.
 *
 * That is the shape the example exists for: with only `headerSelector` and `footerSelector`
 * the body is whatever survives the other two being taken out, so a stray node joins it and
 * the reading order of the source decides the result. Naming the body settles both.
 */
@Component({
	selector: 'app-body-selector-content',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<!-- Written last, shown first: the slot decides, not the source order. -->
		<div class="bs-example-footer">
			<button hubButton color="secondary" (click)="dismiss()">Cancel</button>
			<button hubButton color="primary" (click)="close()">Accept</button>
		</div>

		<div class="bs-example-header">
			<h5 class="modal-title">Named slots</h5>
		</div>

		<div class="bs-example-body">
			<p>This block is the body because <code>bodySelector</code> says so.</p>
			<p>It is written after the footer in the template, and lands above it anyway.</p>
		</div>
	`
})
export class BodySelectorContentComponent {
	private activeModal = inject(HubActiveModal);

	/** Dismisses the active modal without a result. */
	dismiss(): void {
		this.activeModal.dismiss();
	}

	/** Closes the active modal with a successful result. */
	close(): void {
		this.activeModal.close();
	}
}

/**
 * Example for `bodySelector`: the body as a slot with a name rather than as the leftovers.
 */
@Component({
	selector: 'app-body-selector-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-3">
			<p>
				The body used to be the one slot with no name — whatever survived the header and the footer being taken out.
				<code>bodySelector</code> gives it one, so the order the content happens to be written in stops deciding what
				the body is.
			</p>
			<p>Nothing is ever dropped: what no selector claims still follows the named body.</p>
		</div>

		<button hubButton color="primary" (click)="openModal()">Open modal with a named body</button>
	`
})
export class BodySelectorModalExampleComponent {
	private readonly modal = inject(HubModal);

	static templateCode = `<button hubButton color="primary" (click)="openModal()">Open modal with a named body</button>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

// The three slots, deliberately written out of order.
@Component({
  selector: 'app-body-selector-content',
  standalone: true,
  template: \`
    <div class="bs-example-footer">
      <button hubButton color="secondary" (click)="dismiss()">Cancel</button>
      <button hubButton color="primary" (click)="close()">Accept</button>
    </div>

    <div class="bs-example-header">
      <h5 class="modal-title">Named slots</h5>
    </div>

    <div class="bs-example-body">
      <p>This block is the body because <code>bodySelector</code> says so.</p>
    </div>
  \`
})
export class BodySelectorContentComponent {
  private activeModal = inject(HubActiveModal);

  dismiss(): void { this.activeModal.dismiss(); }
  close(): void { this.activeModal.close(); }
}

// Opening it: all three slots named.
@Component({ /* ... */ })
export class BodySelectorModalExampleComponent {
  private readonly modal = inject(HubModal);

  openModal(): void {
    this.modal.open(BodySelectorContentComponent, {
      headerSelector: '.bs-example-header',
      bodySelector: '.bs-example-body',
      footerSelector: '.bs-example-footer'
    });
  }
}

// Without bodySelector the body is still the leftovers, so adding it to
// content that already works can reorder that content but never lose it.`;

	/** Opens the content with all three slots named. */
	openModal(): void {
		this.modal.open(BodySelectorContentComponent, {
			headerSelector: '.bs-example-header',
			bodySelector: '.bs-example-body',
			footerSelector: '.bs-example-footer'
		});
	}
}
