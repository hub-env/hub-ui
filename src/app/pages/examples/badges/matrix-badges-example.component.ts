import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent, HubBadgeVariant } from 'ng-hub-ui-badges';

/**
 * Semantic row rendered by the matrix showcase.
 */
interface BadgeMatrixRow {
	readonly label: string;
	readonly badges: readonly BadgeMatrixItem[];
}

/**
 * Single badge specimen used in the semantic matrix example.
 */
interface BadgeMatrixItem {
	readonly label: string;
	readonly color: HubBadgeColor;
	readonly variant?: HubBadgeVariant;
}

/**
 * Demonstrates the semantic colours and visual variants of `hub-badge`.
 */
@Component({
	selector: 'app-matrix-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-3">
			@for (row of rows; track row.label) {
				<div class="d-flex flex-column gap-2">
					<span class="text-muted small">{{ row.label }}</span>
					<div class="d-flex flex-wrap gap-2">
						@for (badge of row.badges; track badge.label) {
							<hub-badge [variant]="badge.variant ?? 'solid'" [color]="badge.color">{{ badge.label }}</hub-badge>
						}
					</div>
				</div>
			}
		</div>
	`,
	styles: []
})
export class MatrixBadgesExampleComponent {
	/**
	 * Matrix rows used to keep the template concise while the demo stays rich.
	 */
	protected readonly rows: readonly BadgeMatrixRow[] = [
		{
			label: 'Semantic colours',
			badges: [
				{ label: 'Primary', color: 'primary' },
				{ label: 'Secondary', color: 'secondary' },
				{ label: 'Success', color: 'success' },
				{ label: 'Danger', color: 'danger' },
				{ label: 'Warning', color: 'warning' },
				{ label: 'Info', color: 'info' }
			]
		},
		{
			label: 'Visual variants',
			badges: [
				{ label: 'Solid', color: 'primary', variant: 'solid' },
				{ label: 'Soft', color: 'primary', variant: 'soft' },
				{ label: 'Outline', color: 'primary', variant: 'outline' },
				{ label: 'Ghost', color: 'primary', variant: 'ghost' },
				{ label: 'Subtle', color: 'primary', variant: 'subtle' },
				{ label: 'Surface', color: 'primary', variant: 'surface' }
			]
		}
	];

	static readonly templateCode = `<div class="d-flex flex-column gap-3">
  @for (row of rows; track row.label) {
    <div class="d-flex flex-column gap-2">
      <span class="text-muted small">{{ row.label }}</span>
      <div class="d-flex flex-wrap gap-2">
        @for (badge of row.badges; track badge.label) {
          <hub-badge [variant]="badge.variant ?? 'solid'" [color]="badge.color">{{ badge.label }}</hub-badge>
        }
      </div>
    </div>
  }
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBadgeColor, HubBadgeComponent, HubBadgeVariant } from 'ng-hub-ui-badges';

interface BadgeMatrixRow {
  label: string;
  badges: BadgeMatrixItem[];
}

interface BadgeMatrixItem {
  label: string;
  color: HubBadgeColor;
  variant?: HubBadgeVariant;
}

@Component({
  selector: 'app-matrix-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './matrix-badges-example.component.html'
})
export class MatrixBadgesExampleComponent {
  protected readonly rows: BadgeMatrixRow[] = [
    {
      label: 'Semantic colours',
      badges: [
        { label: 'Primary', color: 'primary' },
        { label: 'Secondary', color: 'secondary' },
        { label: 'Success', color: 'success' },
        { label: 'Danger', color: 'danger' },
        { label: 'Warning', color: 'warning' },
        { label: 'Info', color: 'info' }
      ]
    },
    {
      label: 'Visual variants',
      badges: [
        { label: 'Solid', color: 'primary', variant: 'solid' },
        { label: 'Soft', color: 'primary', variant: 'soft' },
        { label: 'Outline', color: 'primary', variant: 'outline' },
        { label: 'Ghost', color: 'primary', variant: 'ghost' },
        { label: 'Subtle', color: 'primary', variant: 'subtle' },
        { label: 'Surface', color: 'primary', variant: 'surface' }
      ]
    }
  ];
}`;
}
