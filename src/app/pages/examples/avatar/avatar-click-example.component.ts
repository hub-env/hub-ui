import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent, Source } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-click-example',
	standalone: true,
	imports: [HubAvatarComponent],
	template: `
		<div class="demo">
			<hub-avatar name="Click Me" bgColor="#ff5722" size="60" interactive (clickOnAvatar)="onClick($event)"> </hub-avatar>
			<span>{{ message() }}</span>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.demo {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		/* The library makes the avatar a control, but leaves the pointer to the consumer. */
		hub-avatar {
			cursor: pointer;
		}
	`
})
export class AvatarClickExampleComponent {
	message = signal<string>('Click the avatar, or focus it and press Enter…');

	/**
	 * Updates the demo message with the source type of the clicked avatar. The payload is
	 * `null` when no source has resolved — an avatar drawn from projected content alone, or
	 * one whose whole fallback chain failed.
	 * @param source The source painting the avatar when it was clicked.
	 */
	onClick(source: Source | null): void {
		this.message.set(source ? `Clicked source: ${source.sourceType}` : 'Clicked, but no source has resolved');
	}

	static readonly templateCode = `<!-- \`interactive\` makes it focusable and activates it with Enter/Space -->
<hub-avatar name="Click Me" interactive (clickOnAvatar)="onClick($event)"></hub-avatar>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubAvatarComponent, Source } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-click-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`<hub-avatar name="Click Me" interactive (clickOnAvatar)="onClick($event)"></hub-avatar>\`
})
export class AvatarClickExampleComponent {
    message = signal('Click the avatar, or focus it and press Enter…');

    onClick(source: Source | null) {
        this.message.set(source ? \`Clicked source: \${source.sourceType}\` : 'Clicked, but no source has resolved');
    }
}`;
}
