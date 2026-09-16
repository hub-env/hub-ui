import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * SVG sprite pack (`{ kind: 'use' }`). A sprite defines each glyph once as an
 * `<svg><symbol id="…">` and every icon references it with `<use href="#id">`,
 * so the markup is shared instead of duplicated. The `sprite` pack resolves a
 * name to `{ kind: 'use', href: '#spr-<name>' }`; symbols using
 * `fill="currentColor"` stay themeable through `--hub-icon-color`.
 */
@Component({
	selector: 'app-icons-sprite-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<!-- The sprite: each glyph defined once, referenced many times below. -->
		<svg width="0" height="0" aria-hidden="true" style="position: absolute">
			<symbol id="spr-home" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.69-8.69a2.25 2.25 0 0 0-3.18 0l-8.69 8.69a.75.75 0 0 0 1.06 1.06z"
				/>
				<path
					d="m12 5.43 8.16 8.16q.045.043.09.085v6.2A1.875 1.875 0 0 1 18.375 21.75H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625A1.875 1.875 0 0 1 3.75 19.875v-6.2q.046-.042.09-.085z"
				/>
			</symbol>
			<symbol id="spr-bolt" viewBox="0 0 24 24" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143z"
					clip-rule="evenodd"
				/>
			</symbol>
			<symbol id="spr-heart" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0z"
				/>
			</symbol>
			<symbol id="spr-check" viewBox="0 0 24 24" fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z"
					clip-rule="evenodd"
				/>
			</symbol>
		</svg>

		<div class="d-flex flex-column gap-4">
			<div class="d-flex align-items-center gap-4" style="font-size: 1.75rem;">
				<hub-icon name="home" pack="sprite" label="Home" />
				<hub-icon name="bolt" pack="sprite" />
				<hub-icon name="heart" pack="sprite" />
				<hub-icon name="check" pack="sprite" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<hub-icon name="heart" pack="sprite" size="1rem" />
				<hub-icon name="heart" pack="sprite" size="1.75rem" color="var(--hub-sys-color-danger)" />
				<hub-icon name="heart" pack="sprite" size="2.75rem" color="var(--hub-sys-color-primary)" />
			</div>
		</div>
	`
})
export class IconsSpriteExampleComponent {
	static readonly templateCode = `<!-- define the sprite once (e.g. in index.html or a shared component) -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="spr-home" viewBox="0 0 24 24" fill="currentColor"><path d="…"/></symbol>
  <symbol id="spr-heart" viewBox="0 0 24 24" fill="currentColor"><path d="…"/></symbol>
</svg>

<!-- reference symbols by name; the pack maps name → <use href="#spr-name"> -->
<hub-icon name="home" pack="sprite" label="Home" />
<hub-icon name="heart" pack="sprite" size="2.75rem"
  color="var(--hub-sys-color-danger)" />`;

	static readonly componentCode = `// app.config.ts — a sprite pack just emits a 'use' render spec
import { provideHubIcons, type HubIconPack } from 'ng-hub-ui-icons';

const spritePack: HubIconPack = {
  resolve: (name) => ({ kind: 'use', href: \`#spr-\${name}\` })
};

providers: [
  provideHubIcons({ packs: { sprite: spritePack } })
];
// External sprite file works too: href: \`assets/icons.svg#\${name}\`.`;
}
