import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';
import type { DynamicPanel } from './removable-panels.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

export type { DynamicPanel } from './removable-panels.model';

/**
 * Removable & dynamic panels example — add panels at runtime and remove them
 * with the ✕ affordance or the Delete key. The `removed` output keeps the
 * data source in sync.
 */
@Component({
	selector: 'app-removable-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<button type="button" hubButton color="primary" size="sm" class="mb-3" (click)="addPanel()">Add panel</button>
		<hub-panels>
			@for (panel of panels(); track panel.id) {
				<hub-panel
					[heading]="panel.title"
					removable
					[removeLabel]="'Remove ' + panel.title"
					(removed)="removePanel(panel)"
				>
					Content for {{ panel.title }}.
				</hub-panel>
			}
		</hub-panels>
	`
})
export class RemovablePanelsExampleComponent {
	private nextId = 4;
	readonly panels = signal<DynamicPanel[]>([
		{ id: 1, title: 'Tab 1' },
		{ id: 2, title: 'Tab 2' },
		{ id: 3, title: 'Tab 3' }
	]);

	/** Appends a new panel with an auto-generated id and title. */
	addPanel(): void {
		const id = this.nextId++;
		this.panels.update((panels) => [...panels, { id, title: `Tab ${id}` }]);
	}

	/**
	 * Removes the given panel from the data source.
	 *
	 * @param panel Panel to remove.
	 */
	removePanel(panel: DynamicPanel): void {
		this.panels.update((panels) => panels.filter((candidate) => candidate.id !== panel.id));
	}

	static readonly templateCode = `<button type="button" hubButton color="primary" size="sm" class="mb-3" (click)="addPanel()">
  Add panel
</button>
<hub-panels>
  @for (panel of panels(); track panel.id) {
    <hub-panel
      [heading]="panel.title"
      removable
      [removeLabel]="'Remove ' + panel.title"
      (removed)="removePanel(panel)"
    >
      Content for {{ panel.title }}.
    </hub-panel>
  }
</hub-panels>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

interface DynamicPanel { id: number; title: string; }

@Component({
  selector: 'app-removable-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './removable-panels-example.component.html'
})
export class RemovablePanelsExampleComponent {
  private nextId = 4;
  readonly panels = signal<DynamicPanel[]>([
    { id: 1, title: 'Tab 1' },
    { id: 2, title: 'Tab 2' },
    { id: 3, title: 'Tab 3' }
  ]);

  addPanel(): void {
    const id = this.nextId++;
    this.panels.update((panels) => [...panels, { id, title: \`Tab \${id}\` }]);
  }

  removePanel(panel: DynamicPanel): void {
    this.panels.update((panels) => panels.filter((p) => p.id !== panel.id));
  }
}`;
}
