import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Keyboard navigation & accessibility example — focus a header and use the
 * arrow keys, Home and End to move between panels. Removable panels also
 * respond to the Delete key. ARIA roles are applied automatically.
 */
@Component({
	selector: 'app-keyboard-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<p class="text-muted small mb-2">Focus a tab, then use ← → Home End. Press Delete on a removable tab to close it.</p>
		<hub-panels>
			<hub-panel heading="First">Use the arrow keys to move focus between headers.</hub-panel>
			<hub-panel heading="Second">Home and End jump to the first and last enabled header.</hub-panel>
			<hub-panel heading="Removable" removable>Press Delete while focused to remove this panel.</hub-panel>
		</hub-panels>
	`
})
export class KeyboardPanelsExampleComponent {
	static readonly templateCode = `<hub-panels>
  <hub-panel heading="First">
    Use the arrow keys to move focus between headers.
  </hub-panel>
  <hub-panel heading="Second">
    Home and End jump to the first and last enabled header.
  </hub-panel>
  <hub-panel heading="Removable" removable>
    Press Delete while focused to remove this panel.
  </hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-keyboard-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './keyboard-panels-example.component.html'
})
export class KeyboardPanelsExampleComponent {}`;
}
