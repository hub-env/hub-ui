import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Grouped actions, for a sheet long enough that a flat list would stop reading as one.
 *
 * A group is a title and its actions; the blocks are separated by a rule. The `selected`
 * role marks the option currently in force — here the export format — and a disabled
 * action stays visible and inert rather than disappearing, so the list does not change
 * shape between visits.
 */
@Component({
	selector: 'app-action-sheet-groups-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3">
			<button type="button" hubButton color="primary" (click)="open()">Document actions</button>
			<span class="small" style="color: var(--hub-sys-text-muted)">
				Export format: <code>{{ format() }}</code>
			</span>
		</div>
	`,
	styles: []
})
export class GroupsActionSheetExampleComponent {
	readonly #sheet = inject(HubActionSheet);

	/** Current export format, marked with the `selected` role on the next open. */
	protected readonly format = signal('pdf');

	protected async open(): Promise<void> {
		const { data } = await this.#sheet.open<string>({
			header: 'Quarterly report',
			buttons: [
				{
					title: 'Export as',
					buttons: [
						{ text: 'PDF', data: 'pdf', role: this.format() === 'pdf' ? 'selected' : undefined },
						{ text: 'Spreadsheet', data: 'xlsx', role: this.format() === 'xlsx' ? 'selected' : undefined },
						{ text: 'CSV', data: 'csv', role: this.format() === 'csv' ? 'selected' : undefined }
					]
				},
				{
					title: 'Share',
					buttons: [
						{ text: 'Copy link', icon: 'fa-solid fa-link', data: 'link' },
						{ text: 'Send by email', icon: 'fa-solid fa-envelope', data: 'email' },
						{ text: 'Publish to the portal', icon: 'fa-solid fa-globe', disabled: true }
					]
				},
				{ text: 'Cancel', role: 'cancel' }
			]
		}).result;

		if (data === 'pdf' || data === 'xlsx' || data === 'csv') {
			this.format.set(data);
		}
	}

	static readonly templateCode = `<button type="button" hubButton color="primary" (click)="open()">Document actions</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubActionSheet } from 'ng-hub-ui-action-sheet';

@Component({ /* … */ })
export class ExampleComponent {
  readonly #sheet = inject(HubActionSheet);

  async open(): Promise<void> {
    const { data } = await this.#sheet.open<string>({
      header: 'Quarterly report',
      buttons: [
        {
          title: 'Export as',
          buttons: [
            // 'selected' marks the option currently in force
            { text: 'PDF', data: 'pdf', role: 'selected' },
            { text: 'Spreadsheet', data: 'xlsx' },
            { text: 'CSV', data: 'csv' }
          ]
        },
        {
          title: 'Share',
          buttons: [
            { text: 'Copy link', icon: 'fa-solid fa-link', data: 'link' },
            { text: 'Send by email', icon: 'fa-solid fa-envelope', data: 'email' },
            // Disabled actions stay in place, so the list keeps its shape
            { text: 'Publish to the portal', icon: 'fa-solid fa-globe', disabled: true }
          ]
        },
        // Declared last or first, a cancel action always ends up set apart at the end
        { text: 'Cancel', role: 'cancel' }
      ]
    }).result;

    console.log(data);
  }
}`;
}
