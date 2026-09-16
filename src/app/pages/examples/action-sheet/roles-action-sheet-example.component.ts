import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * What a role buys, and what a handler can refuse.
 *
 * `cancel` is lifted out of the list and set apart at the end wherever it was declared,
 * and it is what a dismissal by backdrop, `Escape` or swipe reports. `destructive` reads
 * in the danger colour. The delete action here runs a request that fails the first time:
 * its handler returns `false`, so the sheet stays open and the reader can try again —
 * which is the whole point of letting a handler answer.
 */
@Component({
	selector: 'app-action-sheet-roles-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3">
			<button type="button" hubButton variant="outline" color="danger" (click)="open()">Delete invoice…</button>
			<span class="small" style="color: var(--hub-sys-text-muted)">
				@if (log().length) {
					{{ log().join(' · ') }}
				} @else {
					The first attempt always fails, on purpose
				}
			</span>
		</div>
	`,
	styles: []
})
export class RolesActionSheetExampleComponent {
	readonly #sheet = inject(HubActionSheet);

	/** What happened, so the refusal is visible rather than merely described. */
	protected readonly log = signal<string[]>([]);

	#attempts = 0;

	protected async open(): Promise<void> {
		this.#attempts = 0;
		this.log.set([]);

		const { role } = await this.#sheet.open({
			header: 'Delete invoice 2026-0184',
			subHeader: 'This cannot be undone',
			buttons: [
				{ text: 'Archive instead', icon: 'fa-solid fa-box-archive' },
				{
					text: 'Delete',
					role: 'destructive',
					icon: 'fa-solid fa-trash',
					handler: () => this.deleteInvoice()
				},
				{ text: 'Cancel', role: 'cancel', handler: () => this.note('cancelled') }
			]
		}).result;

		this.note(`closed with role “${role}”`);
	}

	/** Fails once, then succeeds — a refusal the reader can actually see. */
	private deleteInvoice(): boolean {
		this.#attempts++;

		if (this.#attempts === 1) {
			this.note('delete failed, sheet stays open');
			return false;
		}

		this.note('deleted');
		return true;
	}

	private note(entry: string): void {
		this.log.update((entries) => [...entries, entry]);
	}

	static readonly templateCode = `<button type="button" hubButton variant="outline" color="danger" (click)="open()">Delete invoice…</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';

@Component({ /* … */ })
export class ExampleComponent {
  readonly #sheet = inject(HubActionSheet);

  async open(): Promise<void> {
    const { role } = await this.#sheet.open({
      header: 'Delete invoice 2026-0184',
      subHeader: 'This cannot be undone',
      buttons: [
        { text: 'Archive instead', icon: 'fa-solid fa-box-archive' },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'fa-solid fa-trash',
          // Returning false — or a promise of it — keeps the sheet open,
          // so a failed request does not lose the reader's place.
          handler: async () => await this.api.delete(this.invoice.id)
        },
        // A cancel action is set apart at the end, and its handler also runs
        // when the sheet is dismissed by backdrop, Escape or swipe.
        { text: 'Cancel', role: 'cancel' }
      ]
    }).result;

    console.log(role); // 'destructive' | 'cancel' | 'backdrop' | 'escape' | 'swipe'
  }
}`;
}
