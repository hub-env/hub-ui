import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Font Awesome pack (`faPack`). Names map to `fa-<variant> fa-<name>`; the style
 * family is chosen with `variant` (solid / regular / brands…) or the pack
 * default. Brands can also be reached with the `fa:brands:<name>` shorthand.
 * The Font Awesome CSS is loaded by the app — the library bundles none.
 */
@Component({
	selector: 'app-icons-font-awesome-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Solid</span>
				<hub-icon name="house" label="Home" />
				<hub-icon name="gear" />
				<hub-icon name="heart" />
				<hub-icon name="star" />
				<hub-icon name="bell" />
				<hub-icon name="magnifying-glass" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Regular</span>
				<hub-icon name="heart" variant="regular" />
				<hub-icon name="star" variant="regular" />
				<hub-icon name="bell" variant="regular" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Brands</span>
				<hub-icon name="fa:brands:github" />
				<hub-icon name="angular" variant="brands" />
				<hub-icon name="react" variant="brands" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Spin</span>
				<hub-icon name="spinner" [spin]="true" />
			</div>
		</div>
	`
})
export class IconsFontAwesomeExampleComponent {
	static readonly templateCode = `<!-- default pack is fa; variant selects the style family -->
<hub-icon name="house" label="Home" />
<hub-icon name="heart" variant="regular" />
<hub-icon name="github" variant="brands" />
<hub-icon name="fa:brands:github" />   <!-- pack:variant:name shorthand -->
<hub-icon name="spinner" [spin]="true" />`;

	static readonly componentCode = `// app.config.ts
import { provideHubIcons, faPack } from 'ng-hub-ui-icons';

providers: [
  provideHubIcons({ defaultPack: 'fa', packs: { fa: faPack({ defaultVariant: 'solid' }) } })
];

// Load the set once (browse icons: https://fontawesome.com/icons):
// <link rel="stylesheet"
//   href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css">`;
}
