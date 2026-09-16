import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubTooltipDirective } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the `[hubTooltip]` directive: placements and CSS-variable theming.
 */
@Component({
	selector: 'app-tooltip-utils-example',
	standalone: true,
	imports: [HubTooltipDirective, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Placements (hover the buttons)</span>
				<div class="d-flex flex-wrap gap-2">
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						hubTooltip="Tooltip on top"
						hubTooltipPlacement="top"
					>
						Top
					</button>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						hubTooltip="Tooltip on the right"
						hubTooltipPlacement="right"
					>
						Right
					</button>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						hubTooltip="Tooltip on the bottom"
						hubTooltipPlacement="bottom"
					>
						Bottom
					</button>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						hubTooltip="Tooltip on the left"
						hubTooltipPlacement="left"
					>
						Left
					</button>
				</div>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Themed with <code>--hub-tooltip-*</code> variables</span>
				<div class="tooltip-theme-scope">
					<button type="button" hubButton color="primary" hubTooltip="Themed tooltip" hubTooltipPlacement="top">
						Hover me
					</button>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.tooltip-theme-scope {
				--hub-tooltip-bg: var(--hub-sys-color-primary, #0d6efd);
				--hub-tooltip-color: #fff;
				--hub-tooltip-border-radius: 999px;
				--hub-tooltip-padding-x: 0.75rem;
				--hub-tooltip-opacity: 1;
			}
		`
	]
})
export class TooltipUtilsExampleComponent {
	static readonly templateCode = `<button hubTooltip="Tooltip on top" hubTooltipPlacement="top">Top</button>
<button hubTooltip="Tooltip on the right" hubTooltipPlacement="right">Right</button>
<button hubTooltip="Tooltip on the bottom" hubTooltipPlacement="bottom">Bottom</button>
<button hubTooltip="Tooltip on the left" hubTooltipPlacement="left">Left</button>

<!-- Theme any scope with the --hub-tooltip-* variables -->
<div class="tooltip-theme-scope">
  <button hubTooltip="Themed tooltip">Hover me</button>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTooltipDirective } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [HubTooltipDirective],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.css'
})
export class TooltipDemoComponent {}`;

	static readonly cssCode = `.tooltip-theme-scope {
  --hub-tooltip-bg: var(--hub-sys-color-primary, #0d6efd);
  --hub-tooltip-color: #fff;
  --hub-tooltip-border-radius: 999px;
  --hub-tooltip-padding-x: 0.75rem;
  --hub-tooltip-opacity: 1;
}`;
}
