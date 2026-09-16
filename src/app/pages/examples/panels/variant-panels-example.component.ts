import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Group-variant example — `<hub-panels [variant]="…">` recolours the navigation
 * strip's semantic accent (active/hover tab, active pill, active accordion
 * header). Each variant re-bases the single `--hub-panels-accent` token at the
 * design-system `--hub-sys-color-<variant>` family through a CSS loop, so there
 * is no per-colour token set and dark mode / theming come for free.
 */
@Component({
	selector: 'app-variant-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-4">
			<hub-panels type="tabs" variant="success">
				<hub-panel heading="Overview">The active tab follows the success accent.</hub-panel>
				<hub-panel heading="Activity">Switch tabs to see the accent move.</hub-panel>
				<hub-panel heading="Settings">No per-colour CSS — one accent drives it all.</hub-panel>
			</hub-panels>

			<hub-panels type="pills" variant="danger">
				<hub-panel heading="Errors">The active pill fills with the danger accent.</hub-panel>
				<hub-panel heading="Warnings">Hover the inactive pills too.</hub-panel>
				<hub-panel heading="Logs">Everything derives from a single token.</hub-panel>
			</hub-panels>

			<hub-panels type="pills" variant="warning">
				<hub-panel heading="Draft">A custom or built-in variant works the same way.</hub-panel>
				<hub-panel heading="Review">Active pill uses the warning accent.</hub-panel>
			</hub-panels>
		</div>
	`
})
export class VariantPanelsExampleComponent {
	static readonly templateCode = `<!-- The strip accent follows the variant — built-in or custom -->
<hub-panels type="tabs" variant="success">
  <hub-panel heading="Overview">The active tab follows the success accent.</hub-panel>
  <hub-panel heading="Activity">Switch tabs to see the accent move.</hub-panel>
  <hub-panel heading="Settings">No per-colour CSS — one accent drives it all.</hub-panel>
</hub-panels>

<hub-panels type="pills" variant="danger">
  <hub-panel heading="Errors">The active pill fills with the danger accent.</hub-panel>
  <hub-panel heading="Warnings">Hover the inactive pills too.</hub-panel>
  <hub-panel heading="Logs">Everything derives from a single token.</hub-panel>
</hub-panels>

<!-- variant accepts any string backed by --hub-sys-color-<variant> -->
<hub-panels type="pills" variant="warning">
  <hub-panel heading="Draft">A custom or built-in variant works the same way.</hub-panel>
  <hub-panel heading="Review">Active pill uses the warning accent.</hub-panel>
</hub-panels>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-variant-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent],
  templateUrl: './variant-panels-example.component.html'
})
export class VariantPanelsExampleComponent {}`;
}
