import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';

/**
 * Opt-in nav title truncation with overflow tooltip.
 *
 * With `truncateTitles`, long step titles are clipped to
 * `--hub-stepper-nav-title-max-width` with an ellipsis; hovering a clipped title
 * reveals its full text via the hub-ui tooltip — automatically and only when the
 * title overflows. Off by default, so the standard nav layout is unchanged.
 */
@Component({
	selector: 'app-truncated-titles-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-stepper [truncateTitles]="true">
			<hub-step title="Personal Information & Contact Details">
				<p>Long step titles are clipped to an ellipsis. Hover the nav title above to read the full text.</p>
			</hub-step>
			<hub-step title="Billing Address and Payment Method">
				<p>The tooltip only appears when a title actually overflows.</p>
			</hub-step>
			<hub-step title="Review and Confirm Your Order">
				<p>Disable truncateTitles and the titles wrap as before.</p>
			</hub-step>
		</hub-stepper>
	`
})
export class TruncatedTitlesStepperExampleComponent {
	/** Template snippet shown in the code panel. */
	static readonly templateCode = `<hub-stepper [truncateTitles]="true">
  <hub-step title="Personal Information & Contact Details">…</hub-step>
  <hub-step title="Billing Address and Payment Method">…</hub-step>
  <hub-step title="Review and Confirm Your Order">…</hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

// Truncation is opt-in via [truncateTitles]. The overflow tooltip defaults to
// the hub-ui tooltip and is swappable with provideHubTooltip(...).
// Cap the width with --hub-stepper-nav-title-max-width (default 12rem).
// Import the tooltip styles once: @use 'ng-hub-ui-utils/styles/tooltip';

@Component({
  selector: 'app-truncated-titles-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`
    <hub-stepper [truncateTitles]="true">
      <hub-step title="Personal Information & Contact Details">…</hub-step>
      <hub-step title="Billing Address and Payment Method">…</hub-step>
      <hub-step title="Review and Confirm Your Order">…</hub-step>
    </hub-stepper>
  \`
})
export class TruncatedTitlesStepperExampleComponent {}`;

	readonly templateCode = TruncatedTitlesStepperExampleComponent.templateCode;
	readonly componentCode = TruncatedTitlesStepperExampleComponent.componentCode;
}
