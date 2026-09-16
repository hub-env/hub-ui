import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * A workflow status rendered inside a narrow column, long enough to overflow.
 */
interface WorkflowStatus {
	readonly label: string;
	readonly color: HubBadgeColor;
}

/**
 * Demonstrates badge text truncation and the tooltip fallback story.
 *
 * Badges live in a deliberately narrow column (like a sidebar), so their labels
 * overflow and are clipped with an ellipsis. Hovering reveals the full text:
 * the native `title` attribute by default, or the richer hub-ui tooltip once
 * `provideHubBadgeTooltip(hubTooltipAdapter)` is wired (as this docs app does).
 */
@Component({
	selector: 'app-truncation-tooltip-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3" style="max-width: 200px;">
			<span class="text-muted small">Narrow column — long labels truncate; hover a badge for the full text.</span>

			<div class="d-flex flex-column gap-2 align-items-start">
				@for (status of statuses; track status.label) {
					<hub-badge [color]="status.color" [dot]="true">{{ status.label }}</hub-badge>
				}
			</div>

			<span class="text-muted small">Explicit tooltip overrides the label, even when it fits:</span>
			<hub-badge color="info" tooltip="Synced 2 minutes ago · 1,204 records">Synced</hub-badge>

			<span class="text-muted small">Cap the width per badge with --hub-badge-max-width:</span>
			<hub-badge color="primary" [style.--hub-badge-max-width.px]="120">A very long capped label</hub-badge>
		</div>
	`,
	styles: []
})
export class TruncationTooltipBadgesExampleComponent {
	/**
	 * Sample workflow states whose labels are long enough to overflow the column.
	 */
	protected readonly statuses: readonly WorkflowStatus[] = [
		{ label: 'Processing invoice export', color: 'primary' },
		{ label: 'Completed with warnings', color: 'success' },
		{ label: 'Completed', color: 'success' },
		{ label: 'Waiting for manual approval', color: 'warning' }
	];

	static readonly templateCode = `<!-- A narrow container forces the labels to overflow -->
<div class="d-flex flex-column gap-2 align-items-start" style="max-width: 200px;">
  @for (status of statuses; track status.label) {
    <hub-badge [color]="status.color" [dot]="true">{{ status.label }}</hub-badge>
  }
</div>

<!-- Explicit tooltip wins even when the text fits -->
<hub-badge color="info" tooltip="Synced 2 minutes ago · 1,204 records">Synced</hub-badge>

<!-- Cap a single badge's width (otherwise it clips at the parent width) -->
<hub-badge color="primary" [style.--hub-badge-max-width.px]="120">A very long capped label</hub-badge>`;

	static readonly componentCode = `// 1) Out of the box, long badge text is truncated with an ellipsis and the
//    full text is exposed through the NATIVE \`title\` attribute — zero deps.
//
// 2) To upgrade EVERY badge to the themeable hub-ui tooltip, wire the adapter
//    from ng-hub-ui-utils ONCE in your app config. No per-badge changes needed;
//    the native \`title\` is automatically suppressed to avoid double tooltips.
//
// app.config.ts
import { provideHubBadgeTooltip } from 'ng-hub-ui-badges';
import { hubTooltipAdapter } from 'ng-hub-ui-utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHubBadgeTooltip(hubTooltipAdapter) // remove this line → native title
  ]
};

// Also import the tooltip styles once (global styles):
//   @use 'ng-hub-ui-utils/styles/tooltip';

// example.component.ts
import { Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent } from 'ng-hub-ui-badges';

@Component({
  selector: 'app-truncation-tooltip-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './truncation-tooltip-badges-example.component.html'
})
export class TruncationTooltipBadgesExampleComponent {
  protected readonly statuses: { label: string; color: HubBadgeColor }[] = [
    { label: 'Processing invoice export', color: 'primary' },
    { label: 'Completed with warnings', color: 'success' },
    { label: 'Completed', color: 'success' },
    { label: 'Waiting for manual approval', color: 'warning' }
  ];
}`;
}
