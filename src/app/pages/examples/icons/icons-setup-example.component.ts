import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Setup, pack selection & which sets you can use. Packs are registered once with
 * `provideHubIcons`; the key you give each pack (`fa`, `bi`, `ms`, `solar`…) is
 * exactly what you pass to `pack="…"`. An icon is resolved three ways: the
 * `defaultPack` when no `pack` is set, an explicit `pack` input, or the
 * `pack:variant:name` shorthand. The library bundles no icon assets — you load
 * each set's stylesheet once (see the links and `componentCode`), and any other
 * set works through a custom pack.
 */
@Component({
	selector: 'app-icons-setup-example',
	standalone: true,
	imports: [HubIconComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
				<div class="d-flex align-items-center gap-4">
					<span class="text-muted small" style="font-size: 0.8rem; width: 12rem;">Default pack (fa)</span>
					<hub-icon name="house" label="Home" />
					<code class="small text-muted">&lt;hub-icon name="house" /&gt;</code>
				</div>
				<div class="d-flex align-items-center gap-4">
					<span class="text-muted small" style="font-size: 0.8rem; width: 12rem;">Explicit pack="bi"</span>
					<hub-icon name="house" pack="bi" />
					<code class="small text-muted">pack="bi"</code>
				</div>
				<div class="d-flex align-items-center gap-4">
					<span class="text-muted small" style="font-size: 0.8rem; width: 12rem;">Explicit pack="ms"</span>
					<hub-icon name="home" pack="ms" />
					<code class="small text-muted">pack="ms"</code>
				</div>
				<div class="d-flex align-items-center gap-4">
					<span class="text-muted small" style="font-size: 0.8rem; width: 12rem;">Shorthand</span>
					<hub-icon name="fa:brands:github" />
					<code class="small text-muted">name="fa:brands:github"</code>
				</div>
			</div>

			<div>
				<p class="text-muted small mb-2">
					Built-in presets — load the set's stylesheet once, then register its pack. Any other set works via a custom
					pack.
				</p>
				<div class="d-flex flex-wrap gap-2">
					<a
						hubButton
						variant="outline"
						color="secondary"
						size="sm"
						href="https://fontawesome.com/icons"
						target="_blank"
						rel="noopener"
					>
						<hub-icon name="font-awesome" variant="brands" /> Font Awesome
					</a>
					<a
						hubButton
						variant="outline"
						color="secondary"
						size="sm"
						href="https://icons.getbootstrap.com/"
						target="_blank"
						rel="noopener"
					>
						<hub-icon name="bootstrap" variant="brands" /> Bootstrap Icons
					</a>
					<a
						hubButton
						variant="outline"
						color="secondary"
						size="sm"
						href="https://fonts.google.com/icons"
						target="_blank"
						rel="noopener"
					>
						<hub-icon name="google" variant="brands" /> Material Symbols
					</a>
					<a
						hubButton
						variant="outline"
						color="secondary"
						size="sm"
						href="https://icon-sets.iconify.design/solar/"
						target="_blank"
						rel="noopener"
					>
						<hub-icon name="sun" /> Solar
					</a>
				</div>
			</div>
		</div>
	`
})
export class IconsSetupExampleComponent {
	static readonly templateCode = `<!-- 1) default pack (defaultPack: 'fa') — no pack needed -->
<hub-icon name="house" label="Home" />

<!-- 2) explicit pack — the key you registered in provideHubIcons -->
<hub-icon name="house" pack="bi" />
<hub-icon name="home" pack="ms" />

<!-- 3) pack:variant:name shorthand -->
<hub-icon name="fa:brands:github" />`;

	static readonly componentCode = `// 1) Load each set's stylesheet once — e.g. in index.html (the library
//    bundles none). Use only the sets you need.
//
//   Font Awesome     https://fontawesome.com/icons
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css">
//   Bootstrap Icons  https://icons.getbootstrap.com
//   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
//   Material Symbols https://fonts.google.com/icons
//   <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">
//   Solar (Iconify)  https://icon-sets.iconify.design/solar
//   <link rel="stylesheet" href="https://api.iconify.design/solar.css?icons=home-bold,star-bold">

// 2) app.config.ts — register each set's pack; the map key is the value you
//    later pass to pack="…".
import { provideHubIcons, faPack, bootstrapPack, materialSymbolsPack, solarPack } from 'ng-hub-ui-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHubIcons({
      defaultPack: 'fa',                 // used when <hub-icon> has no pack
      packs: {
        fa: faPack({ defaultVariant: 'solid' }),   // → pack="fa"
        bi: bootstrapPack(),                        // → pack="bi"
        ms: materialSymbolsPack({ variant: 'outlined' }), // → pack="ms"
        solar: solarPack({ variant: 'bold' })       // → pack="solar"
        // bring your own: classPack / ligaturePack / svgPack, or { resolve }
      }
    })
  ]
};`;
}
