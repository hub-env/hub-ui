import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Live demo for the `hub-toast-theme` SCSS mixin.
 *
 * Toasts render inside a GLOBAL overlay container appended to `document.body`,
 * so they cannot be themed with tokens scoped to a local component class. This
 * demo instead ships a GLOBAL `<style>` block — a `<style>` written directly in
 * an Angular template is NOT processed by view encapsulation, so it leaks into
 * the document and reaches the overlay. The rule targets the custom semantic
 * type `hub-toast[data-type='brand']` (the same selector the `hub-toast-theme`
 * `@example` uses) and sets the `--hub-toast-*` tokens the mixin would emit.
 *
 * The `fire()` button dispatches a toast with `HubToastService.show()` passing the
 * `'brand'` type, which the component applies as the `data-type` host attribute,
 * matching the themed selector. No toast is fired on construction/init so the
 * button prerenders cleanly.
 */
@Component({
	selector: 'app-mixin-toast-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			hub-toast[data-type='brand'] {
				--hub-toast-accent: #6f42c1;
				--hub-toast-bg: #f5f0fb;
				--hub-toast-color: #4a2c82;
				--hub-toast-border-radius: 0.75rem;
				--hub-toast-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18);
			}
		</style>
		<button hubButton color="primary" (click)="fire()">Show themed toast</button>
	`,
	styles: []
})
export class MixinToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	/**
	 * Fires a toast with the custom `'brand'` type. The type becomes the
	 * `data-type` attribute on the overlay `<hub-toast>` element, so the global
	 * `hub-toast[data-type='brand']` rule above applies the branded tokens.
	 */
	fire(): void {
		this._toast.show('This toast is themed with the hub-toast-theme mixin.', 'Brand', { progressBar: true }, 'brand');
	}
}
