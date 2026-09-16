import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubChipComponent } from 'ng-hub-ui-badges';

/**
 * Demonstrates the `hub-chip` surface beyond a chip-set: the semantic colour
 * palette, a standalone two-way togglable chip, a removable tag and a disabled
 * chip — all sharing the badge accent contract.
 */
@Component({
	selector: 'app-chip-colors-badges-example',
	standalone: true,
	imports: [HubChipComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Semantic colours</span>
				<div class="d-flex flex-wrap gap-2">
					@for (color of colors; track color) {
						<hub-chip [color]="color">{{ color }}</hub-chip>
					}
				</div>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Standalone toggle (two-way <code>selected</code>)</span>
				<div class="d-flex flex-wrap gap-2 align-items-center">
					<hub-chip color="primary" [(selected)]="notifications">Notifications</hub-chip>
					<hub-chip color="success" [removable]="true" (removed)="removed.set(true)">Removable</hub-chip>
					<hub-chip color="secondary" [disabled]="true">Disabled</hub-chip>
				</div>
				<span class="text-muted small">
					notifications: <strong>{{ notifications() }}</strong>
					@if (removed()) {
						· removable dismissed
					}
				</span>
			</div>
		</div>
	`,
	styles: []
})
export class ChipColorsBadgesExampleComponent {
	/** The built-in semantic accents the chip supports out of the box. */
	protected readonly colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral', 'light', 'dark'];

	/** Two-way `selected` state of the standalone toggle chip. */
	protected readonly notifications = signal(true);

	/** Set when the removable chip is dismissed. */
	protected readonly removed = signal(false);

	static readonly templateCode = `<div class="d-flex flex-wrap gap-2">
  @for (color of colors; track color) {
    <hub-chip [color]="color">{{ color }}</hub-chip>
  }
</div>

<!-- standalone chips (no chip-set) -->
<hub-chip color="primary" [(selected)]="notifications">Notifications</hub-chip>
<hub-chip color="success" [removable]="true" (removed)="onRemove()">Removable</hub-chip>
<hub-chip color="secondary" [disabled]="true">Disabled</hub-chip>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubChipComponent } from 'ng-hub-ui-badges';

@Component({
  selector: 'app-chip-colors-badges-example',
  standalone: true,
  imports: [HubChipComponent],
  templateUrl: './chip-colors-badges-example.component.html'
})
export class ChipColorsBadgesExampleComponent {
  protected readonly colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral', 'light', 'dark'];
  protected readonly notifications = signal(true);
}`;
}
