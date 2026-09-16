import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMetricsColor, HubProgressComponent } from 'ng-hub-ui-metrics';

/**
 * A single upload task rendered as a labelled progress bar.
 */
interface ProgressTask {
	readonly label: string;
	readonly value: number;
	readonly color: HubMetricsColor;
}

/**
 * Demonstrates `hub-progress`: determinate bars with value labels, the size
 * scale and an indeterminate bar for work of unknown duration.
 */
@Component({
	selector: 'app-progress-metrics-example',
	standalone: true,
	imports: [HubProgressComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Determinate progress with value labels</span>
				@for (task of tasks; track task.label) {
					<hub-progress [value]="task.value" [color]="task.color" [label]="task.label" showValue></hub-progress>
				}
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Size scale</span>
				<hub-progress [value]="40" size="sm" color="info"></hub-progress>
				<hub-progress [value]="60" size="md" color="info"></hub-progress>
				<hub-progress [value]="80" size="lg" color="info"></hub-progress>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Indeterminate</span>
				<hub-progress indeterminate color="primary" label="Syncing workspace"></hub-progress>
			</div>
		</div>
	`,
	styles: []
})
export class ProgressMetricsExampleComponent {
	/**
	 * Upload tasks used to keep the template concise while the demo stays rich.
	 */
	protected readonly tasks: readonly ProgressTask[] = [
		{ label: 'Documents', value: 92, color: 'success' },
		{ label: 'Images', value: 68, color: 'primary' },
		{ label: 'Videos', value: 34, color: 'warning' },
		{ label: 'Archives', value: 12, color: 'danger' }
	];

	static readonly templateCode = `<div class="d-flex flex-column gap-4">
  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Determinate progress with value labels</span>
    @for (task of tasks; track task.label) {
      <hub-progress [value]="task.value" [color]="task.color" [label]="task.label" showValue></hub-progress>
    }
  </div>

  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Size scale</span>
    <hub-progress [value]="40" size="sm" color="info"></hub-progress>
    <hub-progress [value]="60" size="md" color="info"></hub-progress>
    <hub-progress [value]="80" size="lg" color="info"></hub-progress>
  </div>

  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Indeterminate</span>
    <hub-progress indeterminate color="primary" label="Syncing workspace"></hub-progress>
  </div>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubMetricsColor, HubProgressComponent } from 'ng-hub-ui-metrics';

interface ProgressTask {
  label: string;
  value: number;
  color: HubMetricsColor;
}

@Component({
  selector: 'app-progress-metrics-example',
  standalone: true,
  imports: [HubProgressComponent],
  templateUrl: './progress-metrics-example.component.html'
})
export class ProgressMetricsExampleComponent {
  protected readonly tasks: ProgressTask[] = [
    { label: 'Documents', value: 92, color: 'success' },
    { label: 'Images', value: 68, color: 'primary' },
    { label: 'Videos', value: 34, color: 'warning' },
    { label: 'Archives', value: 12, color: 'danger' }
  ];
}`;
}
