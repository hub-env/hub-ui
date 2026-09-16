import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Bootstrap Icons pack (`bootstrapPack`). Names map to `bi bi-<name>`. Bootstrap
 * Icons has no style families: the filled glyphs are distinct names ending in
 * `-fill`, so pass them as the name (e.g. `heart-fill`). The Bootstrap Icons CSS
 * is loaded by the app.
 */
@Component({
	selector: 'app-icons-bootstrap-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Outline</span>
				<hub-icon name="house" pack="bi" label="Home" />
				<hub-icon name="gear" pack="bi" />
				<hub-icon name="heart" pack="bi" />
				<hub-icon name="star" pack="bi" />
				<hub-icon name="bell" pack="bi" />
				<hub-icon name="search" pack="bi" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Filled (-fill)</span>
				<hub-icon name="house-fill" pack="bi" />
				<hub-icon name="gear-fill" pack="bi" />
				<hub-icon name="heart-fill" pack="bi" />
				<hub-icon name="star-fill" pack="bi" />
				<hub-icon name="bell-fill" pack="bi" />
			</div>
		</div>
	`
})
export class IconsBootstrapExampleComponent {
	static readonly templateCode = `<!-- outline glyphs -->
<hub-icon name="house" pack="bi" label="Home" />
<hub-icon name="gear" pack="bi" />

<!-- filled glyphs are separate names ending in -fill -->
<hub-icon name="heart-fill" pack="bi" />
<hub-icon name="star-fill" pack="bi" />`;

	static readonly componentCode = `// app.config.ts
import { provideHubIcons, bootstrapPack } from 'ng-hub-ui-icons';

providers: [
  provideHubIcons({ packs: { bi: bootstrapPack() } })
];

// Load the set once (browse icons: https://icons.getbootstrap.com):
// <link rel="stylesheet"
//   href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">`;
}
