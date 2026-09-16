import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Standalone preview wrapper for the `hub-avatar` component.
 *
 * The library `HubAvatarComponent` is standalone and its services
 * (`HubAvatarService`, `SourceFactory`, `AvatarConfigService`) are `providedIn: 'root'`,
 * so this wrapper imports the component directly and re-exposes every configurable
 * `@Input` 1:1 as its own signal input, mapping straight through to the live
 * `hub-avatar` element.
 *
 * It is fully SSR-safe: no `document` / `window` / `localStorage` access at
 * construction or in any lifecycle hook.
 */
@Component({
	selector: 'app-avatar-playground-preview',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-avatar
			[name]="name()"
			[size]="size()"
			[round]="round()"
			[cornerRadius]="cornerRadius()"
			[textSizeRatio]="textSizeRatio()"
			[initialsSize]="initialsSize()"
			[bgColor]="bgColorOrUndefined()"
			[autoColor]="autoColor()"
			[fgColor]="fgColor()"
			[borderColor]="borderColorOrUndefined()"
			[value]="valueOrNull()"
		></hub-avatar>
	`
})
export class AvatarPlaygroundPreviewComponent {
	/** Name used to derive the avatar initials. */
	readonly name = input('Jane Doe');
	/** Avatar size in pixels. */
	readonly size = input<string | number>(64);
	/** Whether the avatar is rendered as a circle. */
	readonly round = input(true);
	/** Corner radius (px) applied when `round` is false. */
	readonly cornerRadius = input<string | number>(0);
	/** Ratio dividing the size to compute the initials font size. */
	readonly textSizeRatio = input(3);
	/** Maximum number of initials to display (0 = no limit). */
	readonly initialsSize = input<string | number>(0);
	/** Background colour for the text avatar (empty = auto-generated, or the token when auto colour is off). */
	readonly bgColor = input('#6f42c1');
	/** Whether the initials background is derived from a hash of the name and written inline. */
	readonly autoColor = input(true);
	/** Foreground (text) colour for the initials. */
	readonly fgColor = input('#ffffff');
	/** Border colour around the avatar (empty = no border). */
	readonly borderColor = input('');
	/** Optional custom value rendered instead of initials (e.g. "+5", "75%"). */
	readonly value = input('');

	/** Maps an empty background to `undefined` so the hash colour — or the token — takes over. */
	readonly bgColorOrUndefined = computed(() => this.bgColor() || undefined);

	/** Maps an empty border colour to `undefined` so the component skips the border. */
	readonly borderColorOrUndefined = computed(() => this.borderColor() || undefined);

	/** Maps an empty value to `null` so initials are rendered instead. */
	readonly valueOrNull = computed(() => this.value() || null);
}

/**
 * Interactive playground definitions for the ng-hub-ui-avatar documentation page.
 *
 * Every control maps to a real `@Input` exposed by
 * {@link AvatarPlaygroundPreviewComponent} (which forwards 1:1 to `hub-avatar`),
 * and every CSS variable is a token actually consumed by the component stylesheet
 * (`projects/avatar/src/lib/avatar.component.scss`) that a consumer can still move.
 * Tokens the host writes inline — `--hub-avatar-size`, from the `size` input — are
 * deliberately absent: a control over them would be inert.
 */
export const AVATAR_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'avatar',
		title: 'Avatar',
		tag: 'hub-avatar',
		description:
			'A universal avatar. Tweak the size, shape, colours and initials, or theme it live through its --hub-avatar-* CSS variables.',
		component: AvatarPlaygroundPreviewComponent,
		controls: [
			{
				name: 'name',
				label: 'Name (initials)',
				type: 'text',
				default: 'Jane Doe',
				description: 'Initials are derived from the name when no image source is provided.'
			},
			{
				name: 'value',
				label: 'Custom value',
				type: 'text',
				default: '',
				description: 'Overrides the initials with literal text such as "+5" or "75%".'
			},
			{ name: 'size', label: 'Size (px)', type: 'range', default: 64, min: 24, max: 160, step: 2 },
			{ name: 'round', label: 'Round', type: 'boolean', default: true },
			{
				name: 'cornerRadius',
				label: 'Corner radius (px)',
				type: 'number',
				default: 0,
				min: 0,
				max: 80,
				step: 1,
				description: 'Applied only when "Round" is off.'
			},
			{
				name: 'textSizeRatio',
				label: 'Text size ratio',
				type: 'number',
				default: 3,
				min: 1,
				max: 8,
				step: 0.5,
				description: 'Initials font size = size / ratio.'
			},
			{
				name: 'initialsSize',
				label: 'Max initials',
				type: 'number',
				default: 0,
				min: 0,
				max: 5,
				step: 1,
				description: '0 keeps all initials; 1 shows a single letter.'
			},
			{
				name: 'bgColor',
				label: 'Background colour',
				type: 'text',
				default: '#6f42c1',
				description:
					'Any CSS colour; leave empty to fall back to the hash colour, or to the token below with auto colour off.'
			},
			{
				name: 'autoColor',
				label: 'Auto colour',
				type: 'boolean',
				default: true,
				description:
					'Derives the initials background from the name and writes it inline. Turn it off to theme through --hub-avatar-bg-color.'
			},
			{ name: 'fgColor', label: 'Text colour', type: 'color', default: '#ffffff' },
			{
				name: 'borderColor',
				label: 'Border colour',
				type: 'text',
				default: '',
				description: 'Any CSS colour; leave empty for no border.'
			}
		],
		cssVariables: [
			{
				name: '--hub-avatar-bg-color',
				label: 'Background',
				type: 'color',
				default: '#0d6efd',
				description:
					'Background of the avatar content — the design-system accent by default. An initials avatar paints its own background inline, so clear "Background colour" and turn "Auto colour" off to see this token take over.'
			},
			{ name: '--hub-avatar-fg-color', label: 'Text colour', type: 'color', default: '#ffffff' },
			{
				name: '--hub-avatar-border-color',
				label: 'Border colour',
				type: 'color',
				default: '#dee2e6',
				description: 'Defaults to transparent; pick a colour to reveal the border (raise the border width too).'
			},
			{ name: '--hub-avatar-border-width', label: 'Border width', type: 'text', default: '0' },
			{
				name: '--hub-avatar-border-radius',
				label: 'Border radius',
				type: 'text',
				default: '50%',
				description: 'Rounding of the container and content.'
			},
			{ name: '--hub-avatar-font-weight', label: 'Font weight', type: 'text', default: '400' },
			{ name: '--hub-avatar-text-transform', label: 'Text transform', type: 'text', default: 'uppercase' },
			{ name: '--hub-avatar-object-fit', label: 'Image object-fit', type: 'text', default: 'cover' }
		]
	}
];
