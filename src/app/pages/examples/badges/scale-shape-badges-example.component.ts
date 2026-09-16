import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent, HubBadgeShape, HubBadgeSize } from 'ng-hub-ui-badges';

/**
 * Size specimen rendered by the scale showcase.
 */
interface BadgeScaleSpec {
	readonly label: string;
	readonly size: HubBadgeSize;
}

/**
 * Shape specimen rendered by the shape showcase.
 */
interface BadgeShapeSpec {
	readonly label: string;
	readonly shape: HubBadgeShape;
	readonly color: HubBadgeColor;
}

/**
 * Demonstrates the size scale and shape treatments exposed by `hub-badge`.
 */
@Component({
	selector: 'app-scale-shape-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Sizes</span>
				<div class="d-flex align-items-center flex-wrap gap-2">
					@for (spec of sizes; track spec.label) {
						<hub-badge [size]="spec.size" color="primary">{{ spec.label }}</hub-badge>
					}
				</div>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Shapes</span>
				<div class="d-flex align-items-center flex-wrap gap-2">
					@for (spec of shapes; track spec.label) {
						<hub-badge [shape]="spec.shape" [color]="spec.color">{{ spec.label }}</hub-badge>
					}
				</div>
			</div>
		</div>
	`,
	styles: []
})
export class ScaleShapeBadgesExampleComponent {
	/**
	 * Size specimens rendered in the first row.
	 */
	protected readonly sizes: readonly BadgeScaleSpec[] = [
		{ label: 'XS', size: 'xs' },
		{ label: 'SM', size: 'sm' },
		{ label: 'MD', size: 'md' },
		{ label: 'LG', size: 'lg' }
	];

	/**
	 * Shape specimens rendered in the second row.
	 */
	protected readonly shapes: readonly BadgeShapeSpec[] = [
		{ label: 'Pill', shape: 'pill', color: 'success' },
		{ label: 'Rounded', shape: 'rounded', color: 'info' },
		{ label: 'Square', shape: 'square', color: 'secondary' }
	];

	static readonly templateCode = `<div class="d-flex flex-column gap-3">
  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Sizes</span>
    <div class="d-flex align-items-center flex-wrap gap-2">
      @for (spec of sizes; track spec.label) {
        <hub-badge [size]="spec.size" color="primary">{{ spec.label }}</hub-badge>
      }
    </div>
  </div>

  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Shapes</span>
    <div class="d-flex align-items-center flex-wrap gap-2">
      @for (spec of shapes; track spec.label) {
        <hub-badge [shape]="spec.shape" [color]="spec.color">{{ spec.label }}</hub-badge>
      }
    </div>
  </div>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent, HubBadgeShape, HubBadgeSize } from 'ng-hub-ui-badges';

interface BadgeScaleSpec {
  label: string;
  size: HubBadgeSize;
}

interface BadgeShapeSpec {
  label: string;
  shape: HubBadgeShape;
  color: HubBadgeColor;
}

@Component({
  selector: 'app-scale-shape-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './scale-shape-badges-example.component.html'
})
export class ScaleShapeBadgesExampleComponent {
  protected readonly sizes: BadgeScaleSpec[] = [
    { label: 'XS', size: 'xs' },
    { label: 'SM', size: 'sm' },
    { label: 'MD', size: 'md' },
    { label: 'LG', size: 'lg' }
  ];

  protected readonly shapes: BadgeShapeSpec[] = [
    { label: 'Pill', shape: 'pill', color: 'success' },
    { label: 'Rounded', shape: 'rounded', color: 'info' },
    { label: 'Square', shape: 'square', color: 'secondary' }
  ];
}`;
}
