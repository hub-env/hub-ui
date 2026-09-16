import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelFooterDirective, HubPanelHeaderDirective, HubPanelsComponent } from 'ng-hub-ui-panels';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Card example — the chromeless `card` visualization plus the `hubPanelHeader`
 * and `hubPanelFooter` content slots. The last panel shows a standalone
 * `<hub-panel>` used outside any `<hub-panels>` container.
 */
@Component({
	selector: 'app-card-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels type="card">
			<hub-panel>
				<div hubPanelHeader>Project summary</div>
				No tabs, no pills — every panel is always visible and styled as a card.
				<div hubPanelFooter>Updated 2 hours ago</div>
			</hub-panel>
			<hub-panel>
				<div hubPanelHeader>Team</div>
				The same <code>hubPanelHeader</code> / <code>hubPanelFooter</code> slots work in tabs, pills and accordion too.
			</hub-panel>
		</hub-panels>

		<p class="mt-4 mb-2 text-muted">A single standalone <code>&lt;hub-panel&gt;</code> (no container):</p>
		<hub-panel>
			<div hubPanelHeader>Standalone card</div>
			Dropped on its own, a <code>hub-panel</code> renders as a card by itself.
			<div hubPanelFooter>
				<button type="button" hubButton color="primary" size="sm">Action</button>
			</div>
		</hub-panel>
	`
})
export class CardPanelsExampleComponent {
	static readonly templateCode = `<!-- Card container: a stack of always-visible cards -->
<hub-panels type="card">
  <hub-panel>
    <div hubPanelHeader>Project summary</div>
    No tabs, no pills — every panel is always visible and styled as a card.
    <div hubPanelFooter>Updated 2 hours ago</div>
  </hub-panel>
  <hub-panel>
    <div hubPanelHeader>Team</div>
    The same hubPanelHeader / hubPanelFooter slots work in tabs, pills and accordion too.
  </hub-panel>
</hub-panels>

<!-- A single standalone <hub-panel>, no container needed -->
<hub-panel>
  <div hubPanelHeader>Standalone card</div>
  Dropped on its own, a hub-panel renders as a card by itself.
  <div hubPanelFooter>
    <button type="button" hubButton color="primary" size="sm">Action</button>
  </div>
</hub-panel>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelsComponent, HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-card-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective],
  templateUrl: './card-panels-example.component.html'
})
export class CardPanelsExampleComponent {}`;
}
