import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelHeaderDirective } from 'ng-hub-ui-panels';

/**
 * Standalone `<hub-panel>` card slots — the semantic `variant` tint, the `flush`
 * body (zero padding, edge-to-edge content) and the `fill` height mode (the card
 * fills its parent and its body scrolls).
 */
@Component({
	selector: 'app-card-slots-panels-example',
	standalone: true,
	imports: [HubPanelComponent, HubPanelHeaderDirective],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-4">
			<!-- variant tint: one accent drives bg / text / border -->
			<div class="d-flex flex-wrap gap-3">
				<hub-panel variant="success" style="flex: 1 1 12rem;">
					<div hubPanelHeader>Success</div>
					A plain card honours [variant] — one accent tints the whole frame.
				</hub-panel>
				<hub-panel variant="danger" style="flex: 1 1 12rem;">
					<div hubPanelHeader>Danger</div>
					No colour values added — derived by color-mix like the alert.
				</hub-panel>
				<hub-panel variant="info" style="flex: 1 1 12rem;">
					<div hubPanelHeader>Info</div>
					Set --hub-panels-card-border-style: dashed for an empty-state look.
				</hub-panel>
			</div>

			<!-- flush vs normal — the tinted strip shows the body-padding difference;
			     align-items:flex-start so each card hugs its own content height -->
			<div class="d-flex flex-wrap gap-3 align-items-start">
				<hub-panel style="flex: 1 1 13rem;">
					<div hubPanelHeader>Normal padding</div>
					<div style="background: #cfe2ff; border-radius: 0.25rem; padding: 0.5rem;">
						Padded body — there is a gap around this strip.
					</div>
				</hub-panel>
				<hub-panel flush style="flex: 1 1 13rem;">
					<div hubPanelHeader>Flush</div>
					<div style="background: #cfe2ff; padding: 0.5rem;">
						Flush body — this strip runs edge-to-edge to the card sides.
					</div>
				</hub-panel>
			</div>

			<!-- fill: the card fills a fixed-height box and its body scrolls -->
			<div style="height: 180px; display: flex; max-width: 22rem;">
				<hub-panel fill style="flex: 1;">
					<div hubPanelHeader>Fill + scroll</div>
					@for (n of rows; track n) {
						<p class="mb-2">Row {{ n }} — the body scrolls; the header stays put.</p>
					}
				</hub-panel>
			</div>
		</div>
	`
})
export class CardSlotsPanelsExampleComponent {
	readonly rows = Array.from({ length: 20 }, (_, i) => i + 1);

	static readonly templateCode = `<!-- variant tint (standalone card) -->
<hub-panel variant="success">
  <div hubPanelHeader>Success</div>
  One accent tints bg / text / border.
</hub-panel>

<!-- flush: zero body padding for edge-to-edge content -->
<hub-panel flush>
  <div hubPanelHeader>Flush</div>
  <div style="background: #cfe2ff">Runs edge-to-edge to the card sides.</div>
</hub-panel>

<!-- fill: card fills a fixed-height parent, body scrolls -->
<div style="height: 180px; display: flex;">
  <hub-panel fill style="flex: 1;">
    <div hubPanelHeader>Fill + scroll</div>
    …long content…
  </hub-panel>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelComponent, HubPanelHeaderDirective } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-card-slots-panels-example',
  standalone: true,
  imports: [HubPanelComponent, HubPanelHeaderDirective],
  templateUrl: './card-slots-panels-example.component.html'
})
export class CardSlotsPanelsExampleComponent {}`;
}
