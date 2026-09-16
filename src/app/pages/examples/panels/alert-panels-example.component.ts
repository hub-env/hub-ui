import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubPanelComponent, HubPanelFooterDirective, HubPanelHeaderDirective } from 'ng-hub-ui-panels';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Alert example — a standalone `<hub-panel appearance="alert">` rendered as a
 * semantic callout. Each `variant` re-points the generic alert tokens at the
 * design-system `--hub-sys-color-<variant>-*` family, so there is no per-colour
 * token set and dark mode / theming come for free.
 */
@Component({
	selector: 'app-alert-panels-example',
	standalone: true,
	imports: [HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-2">
			<hub-panel appearance="alert" variant="info">Heads up — a new version is available.</hub-panel>
			<hub-panel appearance="alert" variant="success">Your changes were saved successfully.</hub-panel>
			<hub-panel appearance="alert" variant="warning">Your trial ends in 3 days.</hub-panel>
			<hub-panel appearance="alert" variant="danger">Something went wrong while saving.</hub-panel>
			<hub-panel appearance="alert" variant="primary">Tip: you can pin panels for quick access.</hub-panel>
			<hub-panel appearance="alert">A neutral notice with no semantic variant.</hub-panel>
		</div>

		<p class="mt-4 mb-2 text-muted">An alert can use the same header/footer slots as a card:</p>
		<hub-panel appearance="alert" variant="danger">
			<div hubPanelHeader>Payment failed</div>
			We couldn't process your card. Update your billing details to keep your subscription active.
			<div hubPanelFooter>
				<button type="button" hubButton color="danger" size="sm">Update billing</button>
			</div>
		</hub-panel>
	`
})
export class AlertPanelsExampleComponent {
	static readonly templateCode = `<!-- Semantic alerts: one tag, a variant per colour -->
<hub-panel appearance="alert" variant="info">Heads up — a new version is available.</hub-panel>
<hub-panel appearance="alert" variant="success">Your changes were saved successfully.</hub-panel>
<hub-panel appearance="alert" variant="warning">Your trial ends in 3 days.</hub-panel>
<hub-panel appearance="alert" variant="danger">Something went wrong while saving.</hub-panel>
<hub-panel appearance="alert" variant="primary">Tip: you can pin panels for quick access.</hub-panel>

<!-- Omit the variant for a neutral alert -->
<hub-panel appearance="alert">A neutral notice with no semantic variant.</hub-panel>

<!-- Alerts support the same header/footer slots as cards -->
<hub-panel appearance="alert" variant="danger">
  <div hubPanelHeader>Payment failed</div>
  We couldn't process your card. Update your billing details to keep your subscription active.
  <div hubPanelFooter>
    <button type="button" hubButton color="danger" size="sm">Update billing</button>
  </div>
</hub-panel>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-alert-panels-example',
  standalone: true,
  imports: [HubPanelComponent, HubPanelHeaderDirective, HubPanelFooterDirective],
  templateUrl: './alert-panels-example.component.html'
})
export class AlertPanelsExampleComponent {}`;
}
