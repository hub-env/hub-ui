import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Custom-SVG pack (`svgPack`). Plug your own inline SVG artwork into the same
 * `<hub-icon>` API with zero dependency on any third-party set. SVGs that use
 * `fill="currentColor"` inherit `--hub-icon-color` and scale with
 * `--hub-icon-size`, so they theme exactly like every other pack.
 */
@Component({
	selector: 'app-icons-svg-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex align-items-center gap-4" style="font-size: 1.75rem;">
				<hub-icon name="bolt" pack="svg" label="Energy" />
				<hub-icon name="star" pack="svg" />
				<hub-icon name="heart" pack="svg" />
				<hub-icon name="check" pack="svg" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<hub-icon name="bolt" pack="svg" size="1rem" />
				<hub-icon name="bolt" pack="svg" size="1.75rem" color="var(--hub-sys-color-warning)" />
				<hub-icon name="bolt" pack="svg" size="2.75rem" color="var(--hub-sys-color-primary)" />
			</div>
		</div>
	`
})
export class IconsSvgExampleComponent {
	static readonly templateCode = `<!-- your own artwork, same API and theming -->
<hub-icon name="bolt" pack="svg" label="Energy" />
<hub-icon name="bolt" pack="svg" size="2.75rem"
  color="var(--hub-sys-color-primary)" />`;

	static readonly componentCode = `// app.config.ts — register your inline SVGs as a pack
import { provideHubIcons, svgPack } from 'ng-hub-ui-icons';

const MY_ICONS = {
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="…"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="…"/></svg>'
};

providers: [
  provideHubIcons({ packs: { svg: svgPack({ map: MY_ICONS }) } })
];
// Use fill="currentColor" so icons inherit --hub-icon-color.`;
}
