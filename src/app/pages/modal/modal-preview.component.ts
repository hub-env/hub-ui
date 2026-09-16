import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ModalPreviewPlacement, ModalPreviewSize } from './modal-preview.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

export type { ModalPreviewSize, ModalPreviewPlacement } from './modal-preview.model';

/**
 * Standalone, SSR-safe preview of the ng-hub-ui-modal visual surface.
 *
 * The real modal is opened through `HubModal` into a body-level overlay, which
 * cannot be embedded in a static inline playground. This wrapper renders the
 * dialog panel only — reusing the modal's own BEM classes (`hub-modal`,
 * `hub-modal__dialog`, `hub-modal__content`, `hub-modal__header`,
 * `hub-modal__body`, `hub-modal__footer`, `hub-modal__close`) so every
 * `--hub-modal-*` custom property cascades into it from the playground stage.
 *
 * It depends on neither `HubModal` nor the overlay and touches no browser APIs,
 * so it is safe to render during server-side rendering. Its styles are a
 * self-contained, encapsulated copy of the modal's visual surface (the library
 * stylesheet is not loaded globally on the docs site) that reads the same
 * `--hub-modal-*` tokens with the library's concrete fallbacks, so live theming
 * through the playground's CSS-variable controls works identically.
 */
@Component({
	selector: 'app-modal-preview',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div [class]="hostClasses()">
			<div [class]="dialogClasses()" role="document">
				<div class="hub-modal__content">
					@if (showHeader()) {
						<div class="hub-modal__header">
							<h5 class="modal-title">{{ title() }}</h5>
							<button type="button" class="hub-modal__close" aria-label="Close"></button>
						</div>
					}
					<div class="hub-modal__body">
						<p class="hub-modal-preview__lead">{{ body() }}</p>
						@if (scrollable()) {
							@for (line of fillerLines(); track line) {
								<p class="hub-modal-preview__filler">{{ line }}</p>
							}
						}
					</div>
					@if (showFooter()) {
						<div class="hub-modal__footer">
							<button type="button" hubButton color="secondary" size="sm">Cancel</button>
							<button type="button" hubButton color="primary" size="sm">Confirm</button>
						</div>
					}
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}

			/* Self-contained copy of the modal visual surface. Every --hub-modal-* token is
			   read through var(token, fallback) only — never re-declared here — so the values
			   the playground sets inline on the preview stage (an ancestor) inherit in and
			   drive live theming. Fallbacks are copied verbatim from
			   projects/modal/src/lib/modal.scss. The derived --hub-modal-inner-border-radius
			   is computed locally from the inherited radius/width tokens. */
			.hub-modal {
				--hub-modal-inner-border-radius: calc(
					var(--hub-modal-border-radius, var(--hub-ref-radius-lg, 0.5rem)) - var(
							--hub-modal-border-width,
							var(--hub-ref-border-width, 1px)
						)
				);

				display: flex;
				justify-content: center;
				align-items: center;
				min-height: 18rem;
				color: var(--hub-modal-color, var(--hub-sys-text-primary, #212529));
			}

			.hub-modal--top-aligned {
				align-items: flex-start;
			}

			.hub-modal--placement-start {
				justify-content: flex-start;
			}

			.hub-modal--placement-end {
				justify-content: flex-end;
			}

			.hub-modal--placement-top {
				align-items: flex-start;
			}

			.hub-modal--placement-bottom {
				align-items: flex-end;
			}

			.hub-modal__dialog {
				position: relative;
				width: var(--hub-modal-width, auto);
				max-width: var(--hub-modal-max-width, 500px);
				margin: 0;
				flex: 0 1 auto;
			}

			.hub-modal__dialog--sm {
				--hub-modal-max-width: 300px;
			}

			.hub-modal__dialog--lg {
				--hub-modal-max-width: 800px;
			}

			.hub-modal__dialog--xl {
				--hub-modal-max-width: 1140px;
			}

			.hub-modal__dialog--scrollable {
				display: flex;
				max-height: 22rem;
			}

			.hub-modal__dialog--fullscreen {
				width: 100%;
				max-width: 100%;
				margin: 0;
			}

			.hub-modal__content {
				position: relative;
				display: flex;
				flex-direction: column;
				width: 100%;
				color: var(--hub-modal-color, var(--hub-sys-text-primary, #212529));
				background-color: var(--hub-modal-bg, var(--hub-sys-surface-page, #ffffff));
				border: var(--hub-modal-border-width, var(--hub-ref-border-width, 1px)) solid
					var(
						--hub-modal-border-color,
						var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6))
					);
				border-radius: var(--hub-modal-border-radius, var(--hub-ref-radius-lg, 0.5rem));
				box-shadow: var(--hub-modal-box-shadow, var(--hub-sys-shadow-lg, 0 1rem 3rem rgba(0, 0, 0, 0.175)));
			}

			.hub-modal__dialog--scrollable .hub-modal__content {
				max-height: 100%;
				overflow: hidden;
			}

			.hub-modal__dialog--fullscreen .hub-modal__content {
				border: 0;
				border-radius: 0;
			}

			.hub-modal__header {
				display: flex;
				align-items: center;
				gap: var(--hub-modal-header-gap, var(--hub-ref-space-2, 0.5rem));
				padding: var(--hub-modal-header-padding-y, var(--hub-modal-padding-y, var(--hub-ref-space-3, 1rem)))
					var(--hub-modal-header-padding-x, var(--hub-modal-padding-x, var(--hub-ref-space-3, 1rem)));
				border-bottom: var(--hub-modal-header-border-width, var(--hub-ref-border-width, 1px)) solid
					var(
						--hub-modal-header-border-color,
						var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6))
					);
				border-top-left-radius: var(--hub-modal-inner-border-radius);
				border-top-right-radius: var(--hub-modal-inner-border-radius);
			}

			.hub-modal__header .modal-title {
				font-size: var(--hub-modal-title-font-size, var(--hub-ref-font-size-lg, 1.25rem));
				font-weight: var(--hub-modal-title-font-weight, 500);
				line-height: var(--hub-modal-title-line-height, var(--hub-ref-line-height-base, 1.5));
				margin: var(--hub-modal-title-margin-y, 0) var(--hub-modal-title-margin-x, 0);
			}

			.hub-modal__body {
				position: relative;
				flex: 1 1 auto;
				padding: var(--hub-modal-body-padding-y, var(--hub-modal-padding-y, var(--hub-ref-space-3, 1rem)))
					var(--hub-modal-body-padding-x, var(--hub-modal-padding-x, var(--hub-ref-space-3, 1rem)));
			}

			.hub-modal__dialog--scrollable .hub-modal__body {
				overflow-y: auto;
			}

			.hub-modal-preview__lead {
				margin: 0;
			}

			.hub-modal-preview__filler {
				margin: 0.5rem 0 0;
				color: var(--hub-sys-text-muted, #6c757d);
			}

			.hub-modal__footer {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-end;
				gap: var(--hub-modal-footer-gap, var(--hub-ref-space-2, 0.5rem));
				padding: var(--hub-modal-footer-padding-y, var(--hub-modal-padding-y, var(--hub-ref-space-3, 1rem)))
					var(--hub-modal-footer-padding-x, var(--hub-modal-padding-x, var(--hub-ref-space-3, 1rem)));
				color: var(--hub-modal-color, var(--hub-sys-text-primary, #212529));
				background-color: var(--hub-modal-footer-bg, var(--hub-modal-bg, var(--hub-sys-surface-page, #ffffff)));
				border-top: var(--hub-modal-footer-border-width, var(--hub-ref-border-width, 1px)) solid
					var(
						--hub-modal-footer-border-color,
						var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6))
					);
				border-bottom-right-radius: var(--hub-modal-inner-border-radius);
				border-bottom-left-radius: var(--hub-modal-inner-border-radius);
			}

			.hub-modal__close {
				margin-left: auto;
				padding: var(--hub-modal-close-padding-y, 0) var(--hub-modal-close-padding-x, 0);
				font-size: var(--hub-modal-close-size, 1.25rem);
				line-height: var(--hub-modal-close-line-height, 1);
				background: transparent;
				border: 0;
				cursor: pointer;
				color: var(--hub-modal-close-color, var(--hub-sys-text-primary, #212529));
				opacity: var(--hub-modal-close-opacity, 0.5);
			}

			.hub-modal__close::before {
				content: '\\00D7';
			}

			.hub-modal__close:hover,
			.hub-modal__close:focus {
				opacity: var(--hub-modal-close-hover-opacity, 0.75);
			}
		`
	]
})
export class ModalPreviewComponent {
	/** Modal size preset, mapped to `hub-modal__dialog--{size}`. */
	readonly size = input<ModalPreviewSize>('default');

	/** Where the dialog anchors inside the preview stage (mirrors `HubModalPlacement`). */
	readonly placement = input<ModalPreviewPlacement>('center');

	/** Whether the dialog is vertically centered (`centered` modal option). */
	readonly centered = input<boolean>(false);

	/** Whether the body scrolls independently with a capped height (`scrollable` option). */
	readonly scrollable = input<boolean>(false);

	/** Whether the dialog stretches to fill its container width (`fullscreen` option). */
	readonly fullscreen = input<boolean>(false);

	/** Whether the header (title + close button) is rendered. */
	readonly showHeader = input<boolean>(true);

	/** Whether the footer (action buttons) is rendered. */
	readonly showFooter = input<boolean>(true);

	/** Title text shown in the header. */
	readonly title = input<string>('Modal title');

	/** Lead paragraph shown in the body. */
	readonly body = input<string>('This is the modal body. Use the controls to theme its visual surface.');

	/** Filler paragraphs rendered only when `scrollable` is enabled, to demonstrate scrolling. */
	protected readonly fillerLines = computed<string[]>(() =>
		Array.from({ length: 8 }, (_, i) => `Scrollable content line ${i + 1} demonstrating the capped body height.`)
	);

	/**
	 * Builds the host wrapper class string. The host carries the `hub-modal` base
	 * (which holds the `--hub-modal-*` token declarations) plus the placement
	 * modifier and a vertical-centering flag mirroring the modal's `centered` option.
	 */
	protected readonly hostClasses = computed<string>(() => {
		const classes = ['hub-modal'];
		const placement = this.placement();

		if (placement !== 'center') {
			classes.push(`hub-modal--placement-${placement}`);
		}
		if (!this.centered() && (placement === 'center' || placement === 'start' || placement === 'end')) {
			classes.push('hub-modal--top-aligned');
		}

		return classes.join(' ');
	});

	/** Builds the `hub-modal__dialog` class string from the active visual options. */
	protected readonly dialogClasses = computed<string>(() => {
		const classes = ['hub-modal__dialog'];

		if (this.size() !== 'default') {
			classes.push(`hub-modal__dialog--${this.size()}`);
		}
		if (this.scrollable()) {
			classes.push('hub-modal__dialog--scrollable');
		}
		if (this.fullscreen()) {
			classes.push('hub-modal__dialog--fullscreen');
		}

		return classes.join(' ');
	});
}
