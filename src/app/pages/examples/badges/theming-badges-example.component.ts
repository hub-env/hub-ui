import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Demonstrates registering a custom semantic colour from design-system tokens.
 */
@Component({
	selector: 'app-theming-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.badge-theme-scope {
				--hub-sys-color-brand: #7c3aed;
				--hub-sys-color-brand-subtle: #ede9fe;
				--hub-sys-color-brand-emphasis: #5b21b6;
				--hub-sys-color-brand-border-subtle: #c4b5fd;
			}
		</style>

		<div class="badge-theme-scope">
			<div class="d-flex flex-wrap gap-2">
				<hub-badge color="brand">Brand solid</hub-badge>
				<hub-badge variant="soft" color="brand">Brand soft</hub-badge>
				<hub-badge variant="outline" color="brand">Brand outline</hub-badge>
				<hub-badge variant="ghost" color="brand">Brand ghost</hub-badge>
				<hub-badge variant="surface" color="brand">Brand surface</hub-badge>
			</div>
		</div>
	`,
	styles: []
})
export class ThemingBadgesExampleComponent {
	static readonly templateCode = `<style>
  .badge-theme-scope {
    --hub-sys-color-brand: #7c3aed;
    --hub-sys-color-brand-subtle: #ede9fe;
    --hub-sys-color-brand-emphasis: #5b21b6;
    --hub-sys-color-brand-border-subtle: #c4b5fd;
  }
</style>

<div class="badge-theme-scope">
  <div class="d-flex flex-wrap gap-2">
    <hub-badge color="brand">Brand solid</hub-badge>
    <hub-badge variant="soft" color="brand">Brand soft</hub-badge>
    <hub-badge variant="outline" color="brand">Brand outline</hub-badge>
    <hub-badge variant="ghost" color="brand">Brand ghost</hub-badge>
    <hub-badge variant="surface" color="brand">Brand surface</hub-badge>
  </div>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

@Component({
  selector: 'app-theming-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './theming-badges-example.component.html'
})
export class ThemingBadgesExampleComponent {}`;
}
