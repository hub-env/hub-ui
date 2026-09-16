import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Two ways to dress a sheet: the semantic accent, and the tokens.
 *
 * `variant` re-bases the single accent slot, exactly as it does across the rest of the
 * family. Anything finer goes through the `--hub-action-sheet-*` tokens, reached with a
 * class handed to the sheet via `panelClass`.
 *
 * The stylesheet is unencapsulated on purpose: the sheet is mounted on `document.body`,
 * outside this component, so a scoped rule would never reach it. In an application the
 * same rules live in a global stylesheet.
 */
@Component({
	selector: 'app-action-sheet-theming-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	template: `
		<div class="d-flex flex-wrap gap-2">
			<button type="button" hubButton color="success" (click)="open('success')">Success accent</button>
			<button type="button" hubButton color="danger" (click)="open('danger')">Danger accent</button>
			<button type="button" hubButton variant="outline" color="primary" (click)="openBranded()">Branded tokens</button>
		</div>

		<p class="small mb-0 mt-3" style="color: var(--hub-sys-text-muted)">
			The accent colours the selected action; the branded sheet also changes its radius, its touch targets and the width
			it is allowed to take.
		</p>
	`,
	styles: [
		`
			.docs-branded-sheet {
				--hub-action-sheet-border-radius: 1.25rem;
				--hub-action-sheet-accent: #7c3aed;
				--hub-action-sheet-action-min-height: 3.5rem;
				--hub-action-sheet-action-radius: 0.75rem;
				--hub-action-sheet-max-width: 26rem;
			}
		`
	]
})
export class ThemingActionSheetExampleComponent {
	readonly #sheet = inject(HubActionSheet);

	protected open(variant: string): void {
		this.#sheet.open({
			header: 'Notification schedule',
			variant,
			buttons: [
				{ text: 'Every hour' },
				{ text: 'Twice a day', role: 'selected' },
				{ text: 'Only weekdays' },
				{ text: 'Cancel', role: 'cancel' }
			]
		});
	}

	protected openBranded(): void {
		this.#sheet.open({
			header: 'Notification schedule',
			panelClass: 'docs-branded-sheet',
			buttons: [
				{ text: 'Every hour' },
				{ text: 'Twice a day', role: 'selected' },
				{ text: 'Only weekdays' },
				{ text: 'Cancel', role: 'cancel' }
			]
		});
	}

	static readonly templateCode = `<button type="button" (click)="open('success')">Success accent</button>
<button type="button" (click)="openBranded()">Branded tokens</button>`;

	static readonly componentCode = `// The accent slot, re-based per sheet
this.sheet.open({ variant: 'success', buttons: [...] });

// Anything finer: a class on the sheet, and the tokens under it
this.sheet.open({ panelClass: 'branded-sheet', buttons: [...] });`;

	static readonly cssCode = `/* The sheet is mounted on document.body, so these rules belong to a global
   stylesheet — a component-scoped rule never reaches it. */
.branded-sheet {
  --hub-action-sheet-border-radius: 1.25rem;
  --hub-action-sheet-accent: #7c3aed;
  --hub-action-sheet-action-min-height: 3.5rem;
  --hub-action-sheet-action-radius: 0.75rem;
  --hub-action-sheet-max-width: 26rem;
}`;
}
