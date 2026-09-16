import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

/**
 * Demonstrates projecting custom content (icons, inline SVG, emoji) into
 * `<hub-avatar>`. The avatar sizes, centers and pads the content agnostically
 * and clips it to the avatar shape; `bgColor` / `fgColor` theme it.
 */
@Component({
	selector: 'app-avatar-custom-content-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-3">
			<!-- FontAwesome icon — default accent circle, white icon -->
			<hub-avatar><i class="fa-solid fa-user"></i></hub-avatar>

			<!-- Larger, still the default accent -->
			<hub-avatar size="64"><i class="fa-solid fa-rocket"></i></hub-avatar>

			<!-- Themed with a different bgColor -->
			<hub-avatar size="64" bgColor="#198754"><i class="fa-solid fa-bell"></i></hub-avatar>

			<!-- Inline SVG (fills the avatar) -->
			<hub-avatar size="64">
				<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path
						d="M12 2 2 7l10 5 10-5-10-5Zm0 7.5L4.21 6 12 2.5 19.79 6 12 9.5ZM2 17l10 5 10-5-2.18-1.09L12 19.5 4.18 15.91 2 17Zm0-5 10 5 10-5-2.18-1.09L12 14.5 4.18 10.91 2 12Z"
					/>
				</svg>
			</hub-avatar>

			<!-- Emoji -->
			<hub-avatar size="64">🚀</hub-avatar>

			<!-- Square avatar with an icon, themed -->
			<hub-avatar size="64" [round]="false" cornerRadius="14" bgColor="#6f42c1"
				><i class="fa-solid fa-image"></i
			></hub-avatar>
		</div>
	`
})
export class AvatarCustomContentExampleComponent {
	static readonly templateCode = `<!-- Any icon font — default accent circle, white icon -->
<hub-avatar><i class="fa-solid fa-user"></i></hub-avatar>

<!-- Theme it with the regular bgColor / fgColor inputs -->
<hub-avatar size="64" bgColor="#198754">
  <i class="fa-solid fa-bell"></i>
</hub-avatar>

<!-- Inline SVG (fills the avatar) -->
<hub-avatar size="64">
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Z" /></svg>
</hub-avatar>

<!-- Emoji, or a square themed avatar with an icon -->
<hub-avatar size="64">🚀</hub-avatar>
<hub-avatar size="64" [round]="false" cornerRadius="14" bgColor="#6f42c1">
  <i class="fa-solid fa-image"></i>
</hub-avatar>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-custom-content-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-custom-content-example.component.html'
})
export class AvatarCustomContentExampleComponent {}`;
}
