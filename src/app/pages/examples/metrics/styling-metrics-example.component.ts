import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubMeterComponent, HubProgressComponent, HubRingComponent } from 'ng-hub-ui-metrics';

/**
 * Theming ng-hub-ui-metrics three ways: per-instance semantic `color` inputs
 * (which read the design-system `--hub-sys-color-*` families), the one-call
 * `hub-metrics-theme()` SCSS mixin, and direct `--hub-*` custom-property overrides.
 */
@Component({
	selector: 'app-styling-metrics-example',
	standalone: true,
	imports: [HubProgressComponent, HubMeterComponent, HubRingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small"
					>Semantic colours — the <code>color</code> input reads the design-system
					<code>--hub-sys-color-*</code> families</span
				>
				<hub-progress [value]="70" color="primary" label="primary" showValue></hub-progress>
				<hub-progress [value]="70" color="success" label="success" showValue></hub-progress>
				<hub-progress [value]="70" color="warning" label="warning" showValue></hub-progress>
				<hub-progress [value]="70" color="danger" label="danger" showValue></hub-progress>
				<hub-progress [value]="70" color="neutral" label="neutral" showValue></hub-progress>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small"
					>Custom theme — one <code>hub-metrics-theme()</code> include retints all three primitives at once (see the
					CSS tab)</span
				>
				<div class="metrics-brand-theme d-flex align-items-center gap-4 flex-wrap">
					<hub-progress class="flex-grow-1" [value]="64" label="Coverage" showValue></hub-progress>
					<hub-meter [value]="0.82" [max]="1" [low]="0.4" [high]="0.75" [optimum]="1" label="Disk usage"></hub-meter>
					<hub-ring [value]="0.86" label="Quality score"><span>Score</span></hub-ring>
				</div>
			</div>
		</div>
	`,
	styleUrl: './styling-metrics-example.component.scss'
})
export class StylingMetricsExampleComponent {
	static readonly templateCode = `<!-- 1) Per-instance semantic colour — no CSS needed, just the input -->
<hub-progress [value]="70" color="success" label="Documents" showValue></hub-progress>

<!-- 2) A custom theme applied through a wrapper class (see the CSS tab).
     'label' is the accessible name of a meter and of a ring: neither renders one,
     and the ring's projected caption is decoration, not a name. -->
<div class="metrics-brand-theme d-flex align-items-center gap-4">
  <hub-progress class="flex-grow-1" [value]="64" label="Coverage" showValue></hub-progress>
  <hub-meter [value]="0.82" [max]="1" [low]="0.4" [high]="0.75" [optimum]="1" label="Disk usage"></hub-meter>
  <hub-ring [value]="0.86" label="Quality score"><span>Score</span></hub-ring>
</div>`;

	static readonly cssCode = `// Import the public styles entry once, then theme in a single include.
@use 'ng-hub-ui-metrics/styles' as hub;

.metrics-brand-theme {
  // One call retints the shared surfaces of all three primitives:
  //   $accent  -> the progress + ring indicators
  //   $track   -> every track / background
  //   $low / $optimum / $high -> the meter bands AND the ring thresholds
  //   $radius  -> the linear track corners
  @include hub.hub-metrics-theme(
    $accent:  var(--hub-sys-color-brand, #6f42c1),
    $track:   color-mix(in oklch, var(--hub-sys-color-brand, #6f42c1) 14%, transparent),
    $low:     var(--hub-sys-color-danger),
    $optimum: var(--hub-sys-color-success),
    $high:    var(--hub-sys-color-warning),
    $radius:  0.5rem
  );
}

// Tokens the mixin does not expose — set them ON the components, as descendants of
// the scope, which is what the mixin itself emits. Each component declares its own
// defaults on ':where(.hub-<comp>)', and a custom property set on the element beats
// one inherited from a bare '.metrics-brand-theme { … }' ancestor.
.metrics-brand-theme :where(.hub-ring) {
  --hub-ring-caption-color: var(--hub-sys-color-brand, #6f42c1);

  // The geometry is themeable from here as of 22.3.0: 'size' and 'thickness' used to
  // write a length inline on every render, which shadowed these two tokens. Leave both
  // inputs unset — an input still wins, because it is a per-instance override.
  --hub-ring-size: 5.5rem;
  --hub-ring-thickness: 0.55rem;
}

// Prefer the per-instance 'color' input for one-off semantic tints — it maps
// straight to the ds --hub-sys-color-<name> families (primary/success/danger/…),
// so no CSS is required for the common case.`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubProgressComponent, HubMeterComponent, HubRingComponent } from 'ng-hub-ui-metrics';

@Component({
  selector: 'app-styling-metrics-example',
  standalone: true,
  imports: [HubProgressComponent, HubMeterComponent, HubRingComponent],
  templateUrl: './styling-metrics-example.component.html',
  styleUrl: './styling-metrics-example.component.scss'
})
export class StylingMetricsExampleComponent {}`;
}
