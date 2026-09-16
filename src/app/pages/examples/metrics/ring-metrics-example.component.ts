import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubRingComponent, HubRingThresholds } from 'ng-hub-ui-metrics';

/**
 * A normalized score rendered as a circular `hub-ring` gauge.
 */
interface RingScore {
	readonly label: string;
	readonly value: number;
}

/**
 * Demonstrates `hub-ring`: circular gauges rendering a normalized score, with
 * colour thresholds recolouring the arc by band, a caption projected through
 * `<ng-content>` alongside (or instead of) the built-in percentage, and the
 * `label` input that names the gauge for assistive technology.
 */
@Component({
	selector: 'app-ring-metrics-example',
	standalone: true,
	imports: [HubRingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<p class="small text-muted mb-0">
				The projected caption is decoration, and so is the percentage in the middle: neither names a
				<code>role="meter"</code>. <code>label</code> does, and it is the only way in — a ring used to announce itself
				as "92%", which says nothing about what was measured.
			</p>

			<div class="d-flex flex-wrap align-items-center gap-4">
				@for (score of scores; track score.label) {
					<div class="d-flex flex-column align-items-center gap-2">
						<hub-ring
							[value]="score.value"
							[thresholds]="thresholds"
							[size]="'6rem'"
							[thickness]="'0.6rem'"
							[label]="score.label + ' score'"
						>
							<span class="small text-muted">{{ score.label }}</span>
						</hub-ring>
					</div>
				}

				<div class="d-flex flex-column align-items-center gap-2">
					<hub-ring [value]="0.66" [showValue]="false" [size]="'6rem'" [thickness]="'0.6rem'" label="Overall grade">
						<span class="fw-semibold fs-5">A+</span>
					</hub-ring>
					<span class="small text-muted">Custom caption</span>
				</div>
			</div>
		</div>
	`,
	styles: []
})
export class RingMetricsExampleComponent {
	/** Colour thresholds shared by the scored rings. */
	protected readonly thresholds: HubRingThresholds = { low: 0.4, high: 0.75 };

	/**
	 * Quality scores landing in each threshold band: above `high` (success),
	 * between the thresholds (neutral) and below `low` (danger).
	 */
	protected readonly scores: readonly RingScore[] = [
		{ label: 'Coverage', value: 0.92 },
		{ label: 'Performance', value: 0.58 },
		{ label: 'SEO', value: 0.34 }
	];

	static readonly templateCode = `<div class="d-flex flex-wrap align-items-center gap-4">
  @for (score of scores; track score.label) {
    <div class="d-flex flex-column align-items-center gap-2">
      <!-- The caption below is projected decoration; 'label' is the accessible name. -->
      <hub-ring
        [value]="score.value"
        [thresholds]="thresholds"
        [size]="'6rem'"
        [thickness]="'0.6rem'"
        [label]="score.label + ' score'"
      >
        <span class="small text-muted">{{ score.label }}</span>
      </hub-ring>
    </div>
  }

  <div class="d-flex flex-column align-items-center gap-2">
    <hub-ring [value]="0.66" [showValue]="false" [size]="'6rem'" [thickness]="'0.6rem'" label="Overall grade">
      <span class="fw-semibold fs-5">A+</span>
    </hub-ring>
    <span class="small text-muted">Custom caption</span>
  </div>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubRingComponent, HubRingThresholds } from 'ng-hub-ui-metrics';

interface RingScore {
  label: string;
  value: number;
}

@Component({
  selector: 'app-ring-metrics-example',
  standalone: true,
  imports: [HubRingComponent],
  templateUrl: './ring-metrics-example.component.html'
})
export class RingMetricsExampleComponent {
  protected readonly thresholds: HubRingThresholds = { low: 0.4, high: 0.75 };

  protected readonly scores: RingScore[] = [
    { label: 'Coverage', value: 0.92 },
    { label: 'Performance', value: 0.58 },
    { label: 'SEO', value: 0.34 }
  ];
}`;
}
