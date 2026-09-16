import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * SSR-safe preview wrapper for the badges playground.
 *
 * The generic playground can bind plain inputs, but this wrapper gives the badge
 * a realistic shell with a companion badge and a removable preview flow.
 */
@Component({
	selector: 'app-badges-playground-preview',
	standalone: true,
	imports: [HubBadgeComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="badge-playground-scope d-flex flex-column gap-3">
			<div class="d-flex flex-wrap gap-2 align-items-center">
				@if (isVisible()) {
					<hub-badge
						[variant]="variant()"
						[color]="color()"
						[size]="size()"
						[shape]="shape()"
						[dot]="dot()"
						[removable]="removable()"
						[disabled]="disabled()"
						[removeLabel]="removeLabel()"
						(removed)="dismiss()"
					>
						@if (leadingIconOrNull(); as iconClass) {
							<i [class]="iconClass" aria-hidden="true"></i>
						}
						{{ label() }}
						@if (trailingIconOrNull(); as iconClass) {
							<i [class]="iconClass" aria-hidden="true"></i>
						}
					</hub-badge>
				} @else {
					<span class="text-muted small">Badge dismissed in preview.</span>
				}

				<hub-badge variant="surface" color="secondary">Companion</hub-badge>
			</div>

			@if (!isVisible()) {
				<div>
					<button type="button" hubButton variant="outline" color="secondary" size="sm" (click)="resetPreview()">
						Reset preview badge
					</button>
				</div>
			}
		</div>
	`
})
export class BadgesPlaygroundPreviewComponent {
	/** Preview label text. */
	readonly label = input('Active');

	/** Visual treatment of the preview badge. */
	readonly variant = input<'solid' | 'soft' | 'outline' | 'ghost' | 'subtle' | 'surface'>('solid');

	/** Semantic accent of the preview badge. */
	readonly color = input('primary');

	/** Preview size scale. */
	readonly size = input<'xs' | 'sm' | 'md' | 'lg'>('md');

	/** Preview shell shape. */
	readonly shape = input<'pill' | 'rounded' | 'square'>('pill');

	/** Whether a status dot is shown. */
	readonly dot = input(false);

	/** Optional leading icon CSS class, projected as badge content. */
	readonly icon = input('');

	/** Optional trailing icon CSS class, projected as badge content. */
	readonly trailingIcon = input('');

	/** Enables the dismiss action. */
	readonly removable = input(false);

	/** Disables the dismiss action. */
	readonly disabled = input(false);

	/** Accessible label of the dismiss action. */
	readonly removeLabel = input('Remove badge');

	/** Local preview visibility state, reset whenever the driven inputs change. */
	protected readonly isVisible = signal(true);

	/** Null when the text control is empty so no icon is rendered. */
	protected readonly leadingIconOrNull = computed(() => this.icon().trim() || null);

	/** Null when the text control is empty so no icon is rendered. */
	protected readonly trailingIconOrNull = computed(() => this.trailingIcon().trim() || null);

	constructor() {
		effect(() => {
			this.label();
			this.variant();
			this.color();
			this.size();
			this.shape();
			this.dot();
			this.icon();
			this.trailingIcon();
			this.removable();
			this.disabled();
			this.removeLabel();
			this.isVisible.set(true);
		});
	}

	/** Handles the dismiss action in the preview. */
	protected dismiss(): void {
		this.isVisible.set(false);
	}

	/** Restores the preview badge after a dismiss action. */
	protected resetPreview(): void {
		this.isVisible.set(true);
	}
}

/**
 * Interactive playground definition for the ng-hub-ui-badges documentation page.
 */
export const BADGES_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'badge',
		title: 'Badge',
		tag: 'hub-badge',
		description:
			'A compact semantic label for statuses, counters and removable filters. Switch variant, color, size and shell geometry, then theme the real `--hub-badge-*` token contract live.',
		component: BadgesPlaygroundPreviewComponent,
		cssVarTargetSelector: '.badge-playground-scope .hub-badge',
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Active' },
			{
				name: 'variant',
				label: 'Variant',
				type: 'select',
				default: 'solid',
				options: [
					{ label: 'solid', value: 'solid' },
					{ label: 'soft', value: 'soft' },
					{ label: 'outline', value: 'outline' },
					{ label: 'ghost', value: 'ghost' },
					{ label: 'subtle', value: 'subtle' },
					{ label: 'surface', value: 'surface' }
				]
			},
			{
				name: 'color',
				label: 'Color',
				type: 'select',
				default: 'primary',
				options: [
					{ label: 'primary', value: 'primary' },
					{ label: 'secondary', value: 'secondary' },
					{ label: 'success', value: 'success' },
					{ label: 'danger', value: 'danger' },
					{ label: 'warning', value: 'warning' },
					{ label: 'info', value: 'info' },
					{ label: 'neutral', value: 'neutral' },
					{ label: 'light', value: 'light' },
					{ label: 'dark', value: 'dark' }
				]
			},
			{
				name: 'size',
				label: 'Size',
				type: 'select',
				default: 'md',
				options: [
					{ label: 'xs', value: 'xs' },
					{ label: 'sm', value: 'sm' },
					{ label: 'md', value: 'md' },
					{ label: 'lg', value: 'lg' }
				]
			},
			{
				name: 'shape',
				label: 'Shape',
				type: 'select',
				default: 'pill',
				options: [
					{ label: 'pill', value: 'pill' },
					{ label: 'rounded', value: 'rounded' },
					{ label: 'square', value: 'square' }
				]
			},
			{ name: 'dot', label: 'Status dot', type: 'boolean', default: false },
			{ name: 'icon', label: 'Leading icon class', type: 'text', default: '' },
			{ name: 'trailingIcon', label: 'Trailing icon class', type: 'text', default: '' },
			{ name: 'removable', label: 'Removable', type: 'boolean', default: false },
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
			{ name: 'removeLabel', label: 'Remove aria-label', type: 'text', default: 'Remove badge' }
		],
		cssVariables: [
			{ name: '--hub-badge-font-size', label: 'Font size', type: 'text', default: '0.875rem' },
			{ name: '--hub-badge-padding-x', label: 'Padding X', type: 'text', default: '0.5rem' },
			{ name: '--hub-badge-padding-y', label: 'Padding Y', type: 'text', default: '0.25rem' },
			{ name: '--hub-badge-border-radius', label: 'Border radius', type: 'text', default: '50rem' },
			{ name: '--hub-badge-gap', label: 'Content gap', type: 'text', default: '0.25rem' },
			{ name: '--hub-badge-direction', label: 'Content direction', type: 'text', default: 'row' },
			{ name: '--hub-badge-dot-size', label: 'Dot size', type: 'text', default: '0.5rem' },
			{ name: '--hub-badge-remove-size', label: 'Dismiss size', type: 'text', default: '1rem' },
			{ name: '--hub-badge-accent', label: 'Accent', type: 'color', default: '#0d6efd' },
			{ name: '--hub-badge-accent-subtle', label: 'Accent subtle', type: 'color', default: '#cfe2ff' },
			{ name: '--hub-badge-accent-emphasis', label: 'Accent emphasis', type: 'color', default: '#0a58ca' },
			{ name: '--hub-badge-accent-border', label: 'Accent border', type: 'color', default: '#9ec5fe' }
		]
	}
];
