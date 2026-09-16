import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMeterComponent } from 'ng-hub-ui-metrics';

/**
 * A graded capacity reading rendered as a `hub-meter`.
 */
interface CapacityGauge {
	readonly label: string;
	readonly caption: string;
	readonly value: number;
}

/**
 * Demonstrates `hub-meter`: a graded gauge following HTML `<meter>` semantics,
 * where the fill colour reflects the band the value falls into relative to the
 * `[low, high]` plateau and the `optimum` point, plus the `label` input that
 * gives each gauge the accessible name `role="meter"` can only take from the author.
 */
@Component({
	selector: 'app-meter-metrics-example',
	standalone: true,
	imports: [HubMeterComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<p class="small text-muted mb-0">
				The caption beside each bar is plain text: it is not attached to the gauge, and a meter is named by its author
				alone. <code>label</code> is what a screen reader reads out — it renders nothing, so the demo looks the same
				with it and without it.
			</p>

			@for (gauge of gauges; track gauge.label) {
				<div class="d-flex flex-column gap-1">
					<div class="d-flex justify-content-between small">
						<span>{{ gauge.label }}</span>
						<span class="text-muted">{{ gauge.caption }}</span>
					</div>
					<hub-meter
						[value]="gauge.value"
						[min]="0"
						[max]="1"
						[low]="0.3"
						[high]="0.8"
						[optimum]="0.5"
						[label]="gauge.label"
					></hub-meter>
				</div>
			}
		</div>
	`,
	styles: []
})
export class MeterMetricsExampleComponent {
	/**
	 * Capacity readings sharing one grading scale so each band renders distinctly:
	 * on-target (optimum), over-target (high) and under-target (low).
	 */
	protected readonly gauges: readonly CapacityGauge[] = [
		{ label: 'Primary storage', caption: '40% used', value: 0.4 },
		{ label: 'Media library', caption: '90% used', value: 0.9 },
		{ label: 'Battery reserve', caption: '10% left', value: 0.1 }
	];

	static readonly templateCode = `<div class="d-flex flex-column gap-3">
  @for (gauge of gauges; track gauge.label) {
    <div class="d-flex flex-column gap-1">
      <div class="d-flex justify-content-between small">
        <span>{{ gauge.label }}</span>
        <span class="text-muted">{{ gauge.caption }}</span>
      </div>

      <!-- The visible caption above names nothing: role="meter" takes its name from
           the author, so 'label' is the whole of what a screen reader announces. -->
      <hub-meter
        [value]="gauge.value"
        [min]="0"
        [max]="1"
        [low]="0.3"
        [high]="0.8"
        [optimum]="0.5"
        [label]="gauge.label"
      ></hub-meter>
    </div>
  }
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubMeterComponent } from 'ng-hub-ui-metrics';

interface CapacityGauge {
  label: string;
  caption: string;
  value: number;
}

@Component({
  selector: 'app-meter-metrics-example',
  standalone: true,
  imports: [HubMeterComponent],
  templateUrl: './meter-metrics-example.component.html'
})
export class MeterMetricsExampleComponent {
  protected readonly gauges: CapacityGauge[] = [
    { label: 'Primary storage', caption: '40% used', value: 0.4 },
    { label: 'Media library', caption: '90% used', value: 0.9 },
    { label: 'Battery reserve', caption: '10% left', value: 0.1 }
  ];
}`;
}
