import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Material Symbols pack (`materialSymbolsPack`, ligature-based: the icon name is
 * the element's text). The class is `material-symbols-<variant>` and the
 * variable-font axes (`FILL`, `wght`, `GRAD`, `opsz`) are driven by the
 * `--hub-icon-fill` / `--hub-icon-weight` / … tokens. The Material Symbols fonts
 * are loaded by the app.
 */
@Component({
	selector: 'app-icons-material-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 8rem;">Glyphs</span>
				<hub-icon name="home" pack="ms" label="Home" />
				<hub-icon name="settings" pack="ms" />
				<hub-icon name="favorite" pack="ms" />
				<hub-icon name="search" pack="ms" />
				<hub-icon name="notifications" pack="ms" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 8rem;">Families</span>
				<hub-icon name="favorite" pack="ms" variant="outlined" />
				<hub-icon name="favorite" pack="ms" variant="rounded" />
				<hub-icon name="favorite" pack="ms" variant="sharp" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 8rem;">FILL axis</span>
				<hub-icon name="favorite" pack="ms" />
				<hub-icon name="favorite" pack="ms" style="--hub-icon-fill: 1; --hub-icon-weight: 600;" />
			</div>
		</div>
	`
})
export class IconsMaterialExampleComponent {
	static readonly templateCode = `<!-- the name is rendered as a ligature -->
<hub-icon name="home" pack="ms" label="Home" />

<!-- families -->
<hub-icon name="favorite" pack="ms" variant="rounded" />
<hub-icon name="favorite" pack="ms" variant="sharp" />

<!-- variable-font axes via tokens -->
<hub-icon name="favorite" pack="ms"
  style="--hub-icon-fill: 1; --hub-icon-weight: 600;" />`;

	static readonly componentCode = `// app.config.ts
import { provideHubIcons, materialSymbolsPack } from 'ng-hub-ui-icons';

providers: [
  provideHubIcons({ packs: { ms: materialSymbolsPack({ variant: 'outlined' }) } })
];

// Load the set once (browse icons: https://fonts.google.com/icons):
// <link rel="stylesheet"
//   href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">`;
}
