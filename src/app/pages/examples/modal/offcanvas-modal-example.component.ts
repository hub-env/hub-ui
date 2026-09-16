import { ChangeDetectionStrategy, Component, TemplateRef, inject, signal } from '@angular/core';
import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The same panel with and without `offcanvas`, because the flag is only legible as a contrast.
 *
 * `placement` alone slides a *floating* dialog in from an edge and keeps everything a floating
 * dialog has: margins, rounding on all four corners, and a height taken from its content. Open it
 * with the switch off and the three costs are all visible at once — a strip of page showing along
 * the bottom, rounded corners on the side it is attached to, and a panel that stops wherever its
 * content does rather than reaching the floor.
 *
 * Turn the switch on and it becomes a drawer: flush, square on that side, floor to ceiling, with
 * the body scrolling so the footer never leaves. The list is deliberately long enough to prove
 * that last part.
 */
@Component({
	selector: 'app-offcanvas-modal-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="form-check form-switch">
				<input
					id="offcanvas-switch"
					class="form-check-input"
					type="checkbox"
					[checked]="offcanvas()"
					(change)="offcanvas.set($any($event.target).checked)"
				/>
				<label class="form-check-label" for="offcanvas-switch">
					<code>offcanvas</code>: <strong>{{ offcanvas() }}</strong>
				</label>
			</div>

			<div class="d-flex gap-2 flex-wrap">
				<button hubButton variant="outline" color="secondary" (click)="open(tpl, placements.Start)">Start</button>
				<button hubButton variant="outline" color="secondary" (click)="open(tpl, placements.End)">End</button>
				<button hubButton variant="outline" color="secondary" (click)="open(tpl, placements.Top)">Top</button>
				<button hubButton variant="outline" color="secondary" (click)="open(tpl, placements.Bottom)">Bottom</button>
			</div>

			<p class="text-muted small mb-0">
				With the switch off, look at the bottom edge and at the corners on the side it slid out of.
			</p>
		</div>

		<ng-template #tpl let-close="close">
			<div class="modal-header">
				<h5 class="modal-title">Activity</h5>
			</div>
			<div class="modal-body">
				<ul class="list-unstyled mb-0">
					@for (entry of entries; track entry) {
						<li class="border-bottom py-2">{{ entry }}</li>
					}
				</ul>
			</div>
			<div class="modal-footer">
				<button hubButton color="primary" (click)="close()">Done</button>
			</div>
		</ng-template>
	`
})
export class OffcanvasModalExampleComponent {
	// Optional so the docs prerender and the code extraction — which reach the component outside
	// the app's provider tree — do not fail; at runtime the app provides HubModal.
	private readonly modal = inject(HubModal, { optional: true });

	protected readonly placements = HubModalPlacement;
	protected readonly offcanvas = signal(true);

	/** Long enough that the footer would be pushed off a dialog that did not scroll its body. */
	protected readonly entries = Array.from({ length: 24 }, (_, i) => `Entry ${24 - i} — status changed by an operator`);

	protected open(tpl: TemplateRef<unknown>, placement: HubModalPlacement): void {
		this.modal
			?.open(tpl, {
				placement,
				offcanvas: this.offcanvas(),
				headerSelector: '.modal-header',
				footerSelector: '.modal-footer'
			})
			.result.catch(() => {});
	}

	static readonly templateCode = `<button (click)="open(tpl, placements.End)">End</button>

<ng-template #tpl let-close="close">
  <div class="modal-header"><h5 class="modal-title">Activity</h5></div>
  <div class="modal-body">…</div>
  <div class="modal-footer"><button (click)="close()">Done</button></div>
</ng-template>`;

	static readonly componentCode = `import { HubModal, HubModalPlacement } from 'ng-hub-ui-modal';

export class OffcanvasComponent {
  private readonly modal = inject(HubModal);

  // A drawer is one decision: with no placement it opens from the end edge.
  //   this.modal.open(tpl, { offcanvas: true });
  //
  // Flush against its edge, square on the side it is attached to, full height, and
  // scrolling in the body so the header and footer stay put. Its width comes from
  // --hub-modal-offcanvas-width, not from the size scale: size: 'lg' is 800px, which
  // on a narrow window covers the document the drawer is meant to be read against.
  open(tpl: TemplateRef<unknown>, placement: HubModalPlacement) {
    this.modal.open(tpl, {
      placement,
      offcanvas: true,
      headerSelector: '.modal-header',
      footerSelector: '.modal-footer'
    });
  }
}`;
}
