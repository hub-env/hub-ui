import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation, inject, signal } from '@angular/core';
import { HubModal } from 'ng-hub-ui-modal';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * A dialog's worth of copy per accent. A variant is a claim about what the dialog is for,
 * so nine of them demonstrate nothing if all nine say the same thing.
 */
interface VariantDemo {
	/** Value passed as `variant`; for the nine built-ins it is also the `--hub-sys-color-*` name. */
	readonly variant: string;
	/** What the trigger and the affirmative button are painted with. A literal for the custom one. */
	readonly accent: string;
	readonly title: string;
	readonly body: string;
	/** Label of the affirmative action — the line that decides whether a dialog reads as real. */
	readonly confirm: string;
}

/**
 * The `variant` option: one accent, and the whole dialog follows it.
 *
 * A variant re-bases a single slot, `--hub-modal-accent`. The emphasis / subtle / on / border
 * roles are derived from that slot ON THE DIALOG, so re-basing it recolours the tinted
 * background, the outer and header/footer rules and the title in one move.
 *
 * The last button is the point of 22.10.0. `brand` is not one of the library's nine, so it gets
 * the `hub-modal--brand` class and no rules at all — the six declarations in the `<style>` block
 * below are the whole custom variant, and only the first of them is a value. Until 22.10.0 that
 * did not work: the roles were declared on `:root`, where they resolved against the root's accent
 * and reached the dialog already mixed, so a custom variant got a new title over a tint still made
 * from the host's primary colour.
 *
 * The rule has to be global — the dialog is rendered in an overlay outside this component's
 * subtree — which is what `ViewEncapsulation.None` is for here. A `<style>` block in a template
 * is compiled into the component's styles, not left in the DOM, so without it the selector would
 * be rewritten with this component's `_ngcontent` attribute and never match the overlay.
 */
@Component({
	selector: 'app-modal-variants-example',
	imports: [HubButtonComponent],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	template: `
		<style>
			.hub-modal--brand {
				--hub-modal-accent: #6d28d9;
				--hub-modal-bg: var(--hub-modal-accent-subtle);
				--hub-modal-border-color: var(--hub-modal-accent-border);
				--hub-modal-header-border-color: var(--hub-modal-accent-border);
				--hub-modal-footer-border-color: var(--hub-modal-accent-border);
				--hub-modal-title-color: var(--hub-modal-accent);
			}
		</style>

		<div class="d-flex flex-column gap-3">
			<div class="d-flex gap-2 flex-wrap">
				@for (demo of builtIn; track demo.variant) {
					<button hubButton variant="outline" [color]="demo.accent" (click)="open(tpl, demo)">
						{{ demo.variant }}
					</button>
				}
			</div>

			<div class="d-flex gap-2 flex-wrap align-items-start">
				<button hubButton variant="outline" [color]="brand.accent" (click)="open(tpl, brand)">brand</button>
			</div>

			<p class="text-muted small mb-0">
				The nine on the first row are the built-ins. <code>brand</code> is not one of them: it is six declarations in
				this example's own stylesheet, five of which only name another <code>--hub-modal-accent-*</code> role.
			</p>
		</div>

		<ng-template #tpl let-close="close" let-dismiss="dismiss">
			<div class="modal-header">
				<h5 class="modal-title">{{ active().title }}</h5>
			</div>
			<div class="modal-body">
				<p class="mb-0">{{ active().body }}</p>
			</div>
			<div class="modal-footer">
				<button hubButton variant="outline" color="secondary" (click)="dismiss('cancel')">Cancel</button>
				<button hubButton [color]="active().accent" (click)="close(active().variant)">
					{{ active().confirm }}
				</button>
			</div>
		</ng-template>
	`,
	styles: []
})
export class VariantsModalExampleComponent {
	// Optional so the docs prerender and the code extraction — which reach the component outside
	// the app's provider tree — do not fail; at runtime the app provides HubModal.
	private readonly modal = inject(HubModal, { optional: true });

	/** The nine the library ships, each mapping to a `--hub-sys-color-*` family. */
	protected readonly builtIn: readonly VariantDemo[] = [
		{
			variant: 'primary',
			accent: 'primary',
			title: 'Publish release 22.10.0',
			body: 'The changelog and the migration notes go live on hubui.dev as soon as you confirm. Nothing reaches npm until you run the publish step yourself.',
			confirm: 'Publish'
		},
		{
			variant: 'secondary',
			accent: 'secondary',
			title: 'Save as draft',
			body: 'Quote Q-2026-0184 keeps its number and stays out of the ledger until you issue it.',
			confirm: 'Save draft'
		},
		{
			variant: 'success',
			accent: 'success',
			title: 'Invoice sent',
			body: 'Invoice 2026-0184 went out to its recipient. A copy is in your outbox and the ledger is already updated.',
			confirm: 'Done'
		},
		{
			variant: 'danger',
			accent: 'danger',
			title: 'Delete the «Blueprint front» workspace?',
			body: 'The workspace and its 42 documents are removed for every member. There is no undo and no restore window.',
			confirm: 'Delete workspace'
		},
		{
			variant: 'warning',
			accent: 'warning',
			title: 'Your session expires in two minutes',
			body: 'The quote you are editing has unsaved changes. Stay signed in to keep them.',
			confirm: 'Stay signed in'
		},
		{
			variant: 'info',
			accent: 'info',
			title: 'Version 22.10.0 is available',
			body: 'It fixes the token derivation on themed dialogs. Reloading takes a couple of seconds and leaves your open tabs where they are.',
			confirm: 'Reload now'
		},
		{
			variant: 'neutral',
			accent: 'neutral',
			title: 'Move this project to the archive',
			body: 'It stops appearing in the sidebar and in search. You can restore it from Archived whenever you want.',
			confirm: 'Archive'
		},
		{
			variant: 'light',
			accent: 'light',
			title: 'Keyboard shortcuts',
			body: 'Press ? anywhere in the app to bring this panel back, and Esc to close it.',
			confirm: 'Got it'
		},
		{
			variant: 'dark',
			accent: 'dark',
			title: 'Export this board as PDF',
			body: 'The board is rendered at A3 with the filters you have applied. Boards this size take a few seconds.',
			confirm: 'Export'
		}
	];

	/**
	 * The open-set case. The accent is a literal because there is no `--hub-sys-color-brand` to
	 * point at — the button resolver passes a literal colour through to its own accent slot
	 * unchanged, exactly as the `<style>` block above hands one to the dialog.
	 */
	protected readonly brand: VariantDemo = {
		variant: 'brand',
		accent: '#6d28d9',
		title: 'Welcome to Hub UI',
		body: 'This dialog is a custom variant. One declaration names the accent; the tint, the outer and inner rules and the title are all derived from it on the dialog itself.',
		confirm: 'Start the tour'
	};

	protected readonly active = signal<VariantDemo>(this.builtIn[0]);

	/**
	 * Opens the shared template under the given accent.
	 *
	 * The active demo is set before opening because the same template serves all ten dialogs —
	 * a variant changes the dialog's colour, not its structure.
	 */
	protected open(tpl: TemplateRef<unknown>, demo: VariantDemo): void {
		this.active.set(demo);

		this.modal
			?.open(tpl, {
				variant: demo.variant,
				headerSelector: '.modal-header',
				footerSelector: '.modal-footer'
			})
			.result.catch(() => {});
	}

	static readonly templateCode = `<button hubButton variant="outline" color="danger" (click)="open(tpl, demo)">danger</button>

<ng-template #tpl let-close="close" let-dismiss="dismiss">
  <div class="modal-header">
    <h5 class="modal-title">{{ active().title }}</h5>
  </div>
  <div class="modal-body">
    <p class="mb-0">{{ active().body }}</p>
  </div>
  <div class="modal-footer">
    <button hubButton variant="outline" color="secondary" (click)="dismiss('cancel')">Cancel</button>
    <button hubButton [color]="active().accent" (click)="close(active().variant)">
      {{ active().confirm }}
    </button>
  </div>
</ng-template>`;

	static readonly componentCode = `import { HubModal } from 'ng-hub-ui-modal';

export class VariantsComponent {
  private readonly modal = inject(HubModal);

  // A variant re-bases one slot, --hub-modal-accent. The emphasis / subtle / on /
  // border roles derive from it ON THE DIALOG, so the tinted surface, the outer and
  // header/footer rules and the title all move together. (A top accent bar is part
  // of the set too, but ships at zero width — set --hub-modal-accent-bar-width.)
  //
  //   this.modal.open(tpl, { variant: 'danger' });
  //
  // The nine built-ins are primary, secondary, success, danger, warning, info,
  // neutral, light and dark. Any other string is accepted and applies
  // hub-modal--<name> to the window, which is the open-set escape hatch: give that
  // class an accent in a GLOBAL stylesheet and the rest re-derives, no recompile.
  //
  //   .hub-modal--brand {
  //     --hub-modal-accent: #6d28d9;
  //     --hub-modal-bg: var(--hub-modal-accent-subtle);
  //     --hub-modal-border-color: var(--hub-modal-accent-border);
  //     --hub-modal-header-border-color: var(--hub-modal-accent-border);
  //     --hub-modal-footer-border-color: var(--hub-modal-accent-border);
  //     --hub-modal-title-color: var(--hub-modal-accent);
  //   }
  //
  // Global, because the dialog is rendered in an overlay outside the component's
  // own subtree. This only works from 22.10.0 on: the roles used to be declared on
  // :root, where they resolved against the root's accent rather than the dialog's.
  open(tpl: TemplateRef<unknown>, variant: string) {
    this.modal.open(tpl, {
      variant,
      headerSelector: '.modal-header',
      footerSelector: '.modal-footer'
    });
  }
}`;
}
