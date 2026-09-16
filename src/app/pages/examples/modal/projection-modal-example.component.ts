import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { HubActiveModal, HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Internal component that projects content into specific slots.
 */
@Component({
	selector: 'app-projection-content',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="projected-example-header">
			<h5 class="modal-title">Projected Title</h5>
		</div>
		<div class="projected-example-body">
			<p>This content is projected inside <code>ng-content select="[modal-body]"</code>.</p>
			<p>The modal structure (header, body, footer) is defined by the <code>app-projection-content</code> component.</p>
			<p>
				The × up in the corner is the library's own, and it carries no text — its glyph is painted by CSS. Its
				<code>aria-label</code> is therefore the whole of its name, and this modal set it to
				<code>"Close the projected dialog"</code> through <code>closeAriaLabel</code>.
			</p>
		</div>
		<div class="projected-example-footer">
			<button hubButton color="secondary" (click)="dismiss()">Cancel</button>
			<button hubButton color="primary" (click)="close()">Accept</button>
		</div>
	`
})
export class ProjectionContentComponent {
	private activeModal = inject(HubActiveModal);

	/**
	 * Dismisses the active modal without a result.
	 */
	dismiss(): void {
		this.activeModal.dismiss();
	}

	/**
	 * Closes the active modal with a successful result.
	 */
	close(): void {
		this.activeModal.close();
	}
}

/**
 * Example demonstrating content projection with ng-content selectors.
 */
@Component({
	selector: 'app-projection-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="mb-3">
			<p>This example demonstrates how to create reusable wrapper components for modal content.</p>
			<p>
				Naming the header and footer slots is also what makes the library draw its own header, dismiss button included.
				That button ships named <code>"Close"</code>, in English, and the library translates nothing:
				<code>closeAriaLabel</code> is how the application passes the string it has already translated — per call, as
				here, or once for the whole application on <code>HubModalConfig</code>.
			</p>
		</div>

		<button hubButton color="primary" (click)="openModal()">Open Projection Modal</button>
	`
})
export class ProjectionModalExampleComponent {
	private readonly modal = inject(HubModal);

	static templateCode = `<button hubButton color="primary" (click)="openModal()">Open Projection Modal</button>`;

	static componentCode = `import { Component, inject } from '@angular/core';
import { HubModal, HubActiveModal } from 'ng-hub-ui-modal';

// 1. Component defining the structure (slots)
@Component({
  selector: 'app-projection-content',
  standalone: true,
  template: \`
    <!-- We use custom classes to identify header/footer -->
    <div class="projected-example-header">
      <h5 class="modal-title">Projected Title</h5>
    </div>
    <div class="projected-example-body">
      <!-- Content here -->
    </div>
    <div class="projected-example-footer">
      <button hubButton color="secondary" (click)="dismiss()">Cancel</button>
      <button hubButton color="primary" (click)="close()">Accept</button>
    </div>
  \`
})
export class ProjectionContentComponent {
  private activeModal = inject(HubActiveModal);

  dismiss(): void {
    this.activeModal.dismiss();
  }

  close(): void {
    this.activeModal.close();
  }
}

// 2. Main component opening the modal
@Component({
  selector: 'app-projection-modal-example',
  standalone: true,
  imports: [ProjectionContentComponent, HubButtonComponent],
  template: \`...\`
})
export class ProjectionModalExampleComponent {
  private readonly modal = inject(HubModal);

  openModal(): void {
    this.modal.open(ProjectionContentComponent, {
      headerSelector: '.projected-example-header',
      footerSelector: '.projected-example-footer',
      // Naming a slot is what makes the library draw its own header, and with it the
      // dismiss button. That button has no text, so this string is its entire name;
      // it ships as the English 'Close' and the library translates nothing.
      closeAriaLabel: 'Close the projected dialog'
    });
  }
}

// One translation for the whole application instead of one per call site:
//
//   export class AppComponent {
//     constructor(config: HubModalConfig, translate: TranslateService) {
//       config.closeAriaLabel = translate.instant('COMMON.CLOSE');
//     }
//   }`;

	/**
	 * Opens the projection content component as a modal with header and footer projection.
	 *
	 * Naming those two slots is what makes the library draw its own header, so this is the
	 * example where `closeAriaLabel` has something to name.
	 */
	openModal(): void {
		this.modal.open(ProjectionContentComponent, {
			headerSelector: '.projected-example-header',
			footerSelector: '.projected-example-footer',
			closeAriaLabel: 'Close the projected dialog'
		});
	}
}
