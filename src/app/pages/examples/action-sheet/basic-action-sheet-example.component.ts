import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The smallest useful sheet: a header, a few actions and a way out.
 *
 * Nothing about the sheet lives in this template — it is opened from the service and
 * torn down when it answers, which is why a closed sheet costs the page nothing. The
 * call resolves once, with the action the reader chose or with how they dismissed it.
 */
@Component({
	selector: 'app-action-sheet-basic-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3">
			<button type="button" hubButton color="primary" (click)="open()">Open the sheet</button>
			<span class="small" style="color: var(--hub-sys-text-muted)">
				@if (outcome()) {
					Last answer: <code>{{ outcome() }}</code>
				} @else {
					Nothing chosen yet
				}
			</span>
		</div>
	`,
	styles: []
})
export class BasicActionSheetExampleComponent {
	readonly #sheet = inject(HubActionSheet);

	/** Last answer, so the demo shows what the call actually resolves with. */
	protected readonly outcome = signal('');

	protected async open(): Promise<void> {
		const { role, data } = await this.#sheet.open<string>({
			header: 'Invoice 2026-0184',
			subHeader: 'Issued 12 August · 1.240,00 €',
			buttons: [
				{ text: 'Download PDF', icon: 'fa-solid fa-download', data: 'pdf' },
				{ text: 'Send by email', icon: 'fa-solid fa-envelope', data: 'email' },
				{ text: 'Duplicate', icon: 'fa-solid fa-copy', data: 'duplicate' },
				{ text: 'Cancel', role: 'cancel' }
			]
		}).result;

		this.outcome.set(data ?? `dismissed (${role})`);
	}

	static readonly templateCode = `<button type="button" hubButton color="primary" (click)="open()">Open the sheet</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';

@Component({
  selector: 'app-example',
  standalone: true,
  template: \`<button type="button" (click)="open()">Open the sheet</button>\`
})
export class ExampleComponent {
  readonly #sheet = inject(HubActionSheet);

  async open(): Promise<void> {
    // Resolves once: with the chosen action's role and data, or with
    // { role: 'backdrop' | 'escape' | 'swipe' } when it was dismissed.
    const { role, data } = await this.#sheet.open<string>({
      header: 'Invoice 2026-0184',
      subHeader: 'Issued 12 August · 1.240,00 €',
      buttons: [
        { text: 'Download PDF', icon: 'fa-solid fa-download', data: 'pdf' },
        { text: 'Send by email', icon: 'fa-solid fa-envelope', data: 'email' },
        { text: 'Duplicate', icon: 'fa-solid fa-copy', data: 'duplicate' },
        { text: 'Cancel', role: 'cancel' }
      ]
    }).result;

    console.log(role, data);
  }
}`;
}
