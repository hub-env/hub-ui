import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Image pack (`{ kind: 'img' }`). Some "icons" are real raster/vector images —
 * flags, brand logos, emoji — that can't be drawn as a glyph. An image pack
 * resolves a name to `{ kind: 'img', src, alt }` and the component renders an
 * `<img>`. `size` still applies (`--hub-icon-size` sets width/height), but
 * `color` does not: images keep their own colors. Here the `flag` pack maps an
 * ISO country code to a circular flag from a CDN.
 */
@Component({
	selector: 'app-icons-img-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex align-items-center gap-4" style="font-size: 1.75rem;">
				<hub-icon name="es" pack="flag" label="Spain" />
				<hub-icon name="fr" pack="flag" label="France" />
				<hub-icon name="de" pack="flag" label="Germany" />
				<hub-icon name="jp" pack="flag" label="Japan" />
				<hub-icon name="us" pack="flag" label="United States" />
				<hub-icon name="br" pack="flag" label="Brazil" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<hub-icon name="es" pack="flag" size="1rem" label="Spain" />
				<hub-icon name="es" pack="flag" size="1.75rem" label="Spain" />
				<hub-icon name="es" pack="flag" size="2.75rem" label="Spain" />
			</div>
		</div>
	`
})
export class IconsImgExampleComponent {
	static readonly templateCode = `<!-- images render as <img>; size applies, color does not -->
<hub-icon name="es" pack="flag" label="Spain" />
<hub-icon name="jp" pack="flag" label="Japan" />
<hub-icon name="es" pack="flag" size="2.75rem" label="Spain" />`;

	static readonly componentCode = `// app.config.ts — an image pack maps a name to an <img> source
import { provideHubIcons, type HubIconPack } from 'ng-hub-ui-icons';

const flagPack: HubIconPack = {
  resolve: (name) => ({
    kind: 'img',
    src: \`https://hatscripts.github.io/circle-flags/flags/\${name}.svg\`,
    alt: \`\${name} flag\`
  })
};

providers: [
  provideHubIcons({ packs: { flag: flagPack } })
];
// Any image works: brand logos, emoji (e.g. Twemoji PNGs), avatars…`;
}
