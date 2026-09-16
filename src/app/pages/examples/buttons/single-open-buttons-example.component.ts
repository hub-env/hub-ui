import { ChangeDetectionStrategy, Component, viewChildren } from '@angular/core';
import {
	HubButtonComponent,
	HubDropdownDirective,
	HubDropdownItemComponent,
	HubDropdownPanelComponent
} from 'ng-hub-ui-buttons';

/**
 * Only one dropdown is open at a time, however it was opened.
 *
 * Clicking the second trigger has always closed the first, because opening it is itself a click
 * outside the first — so that half of the rule looked solved. The keyboard shortcut below is the
 * half that was not: a keypress opens a panel from code, producing no click anywhere, and
 * before this release both panels stayed up at once. That is what a keyboard shortcut does, or a
 * menu restored after a re-render, or a table row opening its own.
 *
 * Click the box, open one menu with the mouse, then press a number key and watch the first go.
 */
@Component({
	selector: 'app-single-open-buttons-example',
	standalone: true,
	imports: [HubButtonComponent, HubDropdownDirective, HubDropdownPanelComponent, HubDropdownItemComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	host: { tabindex: '0', '(keydown)': 'onKeydown($event)', style: 'display: block; outline: none;' },
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex gap-3 flex-wrap">
				@for (menu of menus; track menu.label) {
					<button hubButton variant="outline" color="primary" [hubDropdown]="panel">
						{{ menu.label }} <i class="fa-solid fa-chevron-down ms-1"></i>
					</button>

					<ng-template #panel>
						<hub-dropdown-panel>
							@for (item of menu.items; track item) {
								<hub-dropdown-item>{{ item }}</hub-dropdown-item>
							}
						</hub-dropdown-panel>
					</ng-template>
				}
			</div>

			<p class="text-muted small mb-0">
				Click this box, open a menu, then press <kbd>1</kbd>, <kbd>2</kbd> or <kbd>3</kbd>. A keypress opens the menu
				from code with no click anywhere — the case the click-outside rule never covered.
			</p>
		</div>
	`,
	styles: []
})
export class SingleOpenButtonsExampleComponent {
	private readonly dropdowns = viewChildren(HubDropdownDirective);

	protected readonly menus = [
		{ label: 'File', items: ['New', 'Open', 'Save as…'] },
		{ label: 'Edit', items: ['Undo', 'Redo', 'Find…'] },
		{ label: 'View', items: ['Zoom in', 'Zoom out', 'Full screen'] }
	];

	/**
	 * Opens a panel from a keypress. No pointer event is involved, so the click-outside listener
	 * that used to carry the one-at-a-time rule never fires — which is precisely the case where
	 * two panels used to stay up at once.
	 */
	protected onKeydown(event: KeyboardEvent): void {
		const index = Number(event.key) - 1;

		if (Number.isInteger(index) && index >= 0 && index < this.menus.length) {
			event.preventDefault();
			this.dropdowns()[index]?.open();
		}
	}

	static readonly templateCode = `<button hubButton variant="outline" color="primary" [hubDropdown]="fileMenu">File</button>
<ng-template #fileMenu>
  <hub-dropdown-panel>
    <hub-dropdown-item>New</hub-dropdown-item>
    <hub-dropdown-item>Open</hub-dropdown-item>
  </hub-dropdown-panel>
</ng-template>`;

	static readonly componentCode = `import { Component, viewChildren } from '@angular/core';
import { HubDropdownDirective } from 'ng-hub-ui-buttons';

export class SingleOpenComponent {
  private readonly dropdowns = viewChildren(HubDropdownDirective);

  // A keypress, so no pointer event is involved and the click-outside listener that
  // used to carry the one-at-a-time rule never fires. The directive enforces it
  // directly: opening any dropdown closes whichever was already open.
  onKeydown(event: KeyboardEvent) {
    const index = Number(event.key) - 1;
    if (Number.isInteger(index) && index >= 0 && index < this.menus.length) {
      this.dropdowns()[index]?.open();
    }
  }
}`;
}
