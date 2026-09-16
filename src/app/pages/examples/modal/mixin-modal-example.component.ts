import { ChangeDetectionStrategy, Component, TemplateRef, inject } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Live demo for the `hub-modal-theme` SCSS mixin.
 *
 * A modal is rendered in an OVERLAY outside the component's own DOM subtree, so it
 * cannot be themed with tokens scoped to a local host class. The idiomatic approach —
 * the one the mixin itself documents — is to open the modal with a `windowClass` and
 * define that class with the `--hub-modal-*` tokens in a GLOBAL stylesheet.
 *
 * The `<style>` block below lives inside an Angular component template, which Angular
 * injects GLOBALLY (it is NOT view-encapsulated), so the `.modal-mixin-demo` rule can
 * reach the overlay window created by {@link HubModal.open}.
 *
 * The demo renders during prerender because only the trigger button is emitted on the
 * server; the modal is opened exclusively on the client via the `(click)` handler.
 */
@Component({
	selector: 'app-mixin-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			.modal-mixin-demo {
				--hub-modal-accent: #10b981;
				--hub-modal-bg: #f6fff9;
				--hub-modal-border-radius: 0.75rem;
			}
		</style>

		<button hubButton color="primary" (click)="open(tpl)">Open themed modal</button>

		<ng-template #tpl let-close="close" let-dismiss="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">Themed with hub-modal-theme</h5>
			</div>
			<div class="modal-body">
				<p class="mb-0">
					This dialog is styled through the <code>.modal-mixin-demo</code> window class, applied via
					<code>windowClass</code>. The accent bar, surface background and corner radius all come from
					<code>--hub-modal-*</code> tokens set in a global stylesheet.
				</p>
			</div>
			<div class="modal-footer">
				<button hubButton color="secondary" (click)="dismiss('cancel')">Cancel</button>
				<button hubButton color="primary" (click)="close('ok')">OK</button>
			</div>
		</ng-template>
	`,
	styles: []
})
export class MixinModalExampleComponent {
	private modal = inject(HubModal);

	/**
	 * Opens the template as a modal themed through the `.modal-mixin-demo` window class.
	 *
	 * The class is not applied to the trigger's host element but forwarded to the overlay
	 * window via `windowClass`, so the globally-declared `--hub-modal-*` tokens take effect.
	 *
	 * @param tpl The template reference to render inside the modal.
	 */
	open(tpl: TemplateRef<unknown>): void {
		this.modal
			.open(tpl, {
				windowClass: 'modal-mixin-demo',
				headerSelector: '.modal-header',
				footerSelector: '.modal-footer'
			})
			.result.catch(() => {});
	}
}
