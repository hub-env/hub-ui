import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubProgressComponent, HubRingComponent } from 'ng-hub-ui-metrics';

/**
 * Live demo for the `hub-metrics-theme` SCSS mixin. The demo sets the same `--hub-*` custom
 * properties the mixin emits, and on the same selector — the metrics elements as descendants
 * of the scope — because each component declares its own defaults on `:where(.hub-<comp>)`,
 * which shadows a value inherited from a bare ancestor. `$accent` re-tones both the progress
 * bar (`--hub-progress-accent`) and the ring indicator (`--hub-ring-indicator`) in one call,
 * while `$radius` rounds the progress track (`--hub-progress-radius`) and meter
 * (`--hub-meter-radius`).
 */
@Component({
	selector: 'app-mixin-metrics-example',
	standalone: true,
	imports: [HubProgressComponent, HubRingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<style>
			.metrics-mixin-scope :where(.hub-progress, .hub-meter, .hub-ring) {
				--hub-progress-accent: #0ea5e9;
				--hub-ring-indicator: #0ea5e9;
				--hub-progress-radius: 0.75rem;
				--hub-meter-radius: 0.75rem;
			}
		</style>
		<div class="metrics-mixin-scope d-flex flex-wrap align-items-center gap-4">
			<div class="d-flex flex-column gap-2" style="min-width: 16rem">
				<hub-progress [value]="72" label="Storage used" showValue></hub-progress>
				<hub-progress [value]="48" label="Bandwidth" showValue></hub-progress>
			</div>
			<hub-ring [value]="0.72" [size]="'6rem'" [thickness]="'0.6rem'" label="Service health">
				<span class="small text-muted">Health</span>
			</hub-ring>
		</div>
	`,
	styles: []
})
export class MixinMetricsExampleComponent {
	static readonly templateCode = `<div class="metrics-mixin-scope d-flex flex-wrap align-items-center gap-4">
  <div class="d-flex flex-column gap-2" style="min-width: 16rem">
    <hub-progress [value]="72" label="Storage used" showValue></hub-progress>
    <hub-progress [value]="48" label="Bandwidth" showValue></hub-progress>
  </div>
  <hub-ring [value]="0.72" [size]="'6rem'" [thickness]="'0.6rem'" label="Service health">
    <span class="small text-muted">Health</span>
  </hub-ring>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubProgressComponent, HubRingComponent } from 'ng-hub-ui-metrics';

@Component({
  selector: 'app-mixin-metrics-example',
  standalone: true,
  imports: [HubProgressComponent, HubRingComponent],
  templateUrl: './mixin-metrics-example.component.html',
  styleUrl: './mixin-metrics-example.component.scss'
})
export class MixinMetricsExampleComponent {}`;

	static readonly cssCode = `@use 'ng-hub-ui-metrics/styles' as hub;

.metrics-mixin-scope {
  @include hub.hub-metrics-theme($accent: #0ea5e9, $radius: 0.75rem);
}`;
}
