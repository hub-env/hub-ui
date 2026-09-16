import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Variants per pack: Font Awesome style families (solid / regular / brands) and
 * Material Symbols families (outlined / rounded / sharp). Set a per-call `variant`
 * or a pack default in `provideHubIcons`.
 */
@Component({
	selector: 'app-icons-variants-example',
	standalone: true,
	imports: [HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-3" style="font-size: 1.75rem;">
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 9rem;">FA solid / regular</span>
				<hub-icon name="bell" variant="solid" />
				<hub-icon name="bell" variant="regular" />
				<hub-icon name="star" variant="solid" />
				<hub-icon name="star" variant="regular" />
			</div>
			<div class="d-flex align-items-center gap-4">
				<span class="text-muted small" style="font-size: 0.8rem; width: 9rem;">MS outlined/round/sharp</span>
				<hub-icon name="favorite" pack="ms" variant="outlined" />
				<hub-icon name="favorite" pack="ms" variant="rounded" />
				<hub-icon name="favorite" pack="ms" variant="sharp" />
			</div>
		</div>
	`
})
export class IconsVariantsExampleComponent {
	static readonly templateCode = `<!-- Font Awesome families -->
<hub-icon name="bell" variant="solid" />
<hub-icon name="bell" variant="regular" />

<!-- Material Symbols families -->
<hub-icon name="favorite" pack="ms" variant="outlined" />
<hub-icon name="favorite" pack="ms" variant="rounded" />
<hub-icon name="favorite" pack="ms" variant="sharp" />`;

	static readonly componentCode = `// A pack default variant applies when no per-call variant is given:
provideHubIcons({
  packs: {
    fa: faPack({ defaultVariant: 'regular' }),
    ms: materialSymbolsPack({ variant: 'rounded' })
  }
});`;
}
