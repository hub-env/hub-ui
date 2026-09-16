import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Solar pack (`solarPack`). Solar ships no universal webfont, so this app loads
 * it as Iconify CSS (`.icon--solar--<name>-<variant>`) and adapts the pack
 * `template` to that convention. `variant` selects the Solar style family
 * (linear / bold / broken / bold-duotone…). Mask-based icons stay themeable
 * through `--hub-icon-color`.
 */
@Component({
	selector: 'app-icons-solar-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Bold</span>
				<hub-icon name="home" pack="solar" label="Home" />
				<hub-icon name="settings" pack="solar" />
				<hub-icon name="heart" pack="solar" />
				<hub-icon name="star" pack="solar" />
				<hub-icon name="bell" pack="solar" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 7rem;">Families</span>
				<hub-icon name="home" pack="solar" variant="linear" />
				<hub-icon name="home" pack="solar" variant="bold" />
				<hub-icon name="home" pack="solar" variant="broken" />
				<hub-icon name="home" pack="solar" variant="boldduotone" />
			</div>
		</div>
	`
})
export class IconsSolarExampleComponent {
	static readonly templateCode = `<!-- bold family (pack default) -->
<hub-icon name="home" pack="solar" label="Home" />
<hub-icon name="heart" pack="solar" />

<!-- pick a Solar style family per call -->
<hub-icon name="home" pack="solar" variant="linear" />
<hub-icon name="home" pack="solar" variant="boldduotone" />`;

	static readonly componentCode = `// app.config.ts — Solar has no webfont; load it as Iconify CSS and
// point the pack template at Iconify's class convention.
import { provideHubIcons, solarPack } from 'ng-hub-ui-icons';

const SUFFIX = { linear: 'linear', bold: 'bold', broken: 'broken',
  outline: 'outline', lineduotone: 'line-duotone', boldduotone: 'bold-duotone' };

providers: [
  provideHubIcons({
    packs: {
      solar: solarPack({
        variant: 'bold',
        template: (name, v) => \`icon--solar icon--solar--\${name}-\${SUFFIX[v ?? 'bold'] ?? v}\`
      })
    }
  })
];
// Browse Solar at https://icon-sets.iconify.design/solar and load the glyphs
// you use via Iconify CSS:
// <link rel="stylesheet" href="https://api.iconify.design/solar.css?icons=home-bold,star-bold">`;
}
