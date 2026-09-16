import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Options, SortableDirective } from 'ng-hub-ui-sortable';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * SSR-safe preview wrapper for the ng-hub-ui-sortable directive.
 *
 * The sortable behaviour is delivered by the `hubSortable` directive, which has no
 * styled host of its own — list items are styled by the consumer. This wrapper renders
 * a canonical, drag-and-drop list of five items and maps the directive's behavioural
 * inputs (`animation`, `handle`, `disabled`, `sort`, `direction`, `swapThreshold`,
 * `ghostClass`) to its own `input()`s so the playground can drive them live.
 *
 * The directive itself is SSR-safe (it only instantiates SortableJS when `window`
 * exists), so this wrapper renders identically on the server and the client.
 */
@Component({
	selector: 'hub-sortable-preview',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SortableDirective],
	template: `
		<ul
			class="hub-sortable-preview"
			[class.is-horizontal]="direction() === 'horizontal'"
			[hubSortable]="items"
			[animation]="animation()"
			[handle]="useHandle() ? '.hub-sortable-preview__handle' : undefined"
			[disabled]="disabled()"
			[sort]="sort()"
			[direction]="direction()"
			[swapThreshold]="swapThreshold()"
			[ghostClass]="ghostClass()"
		>
			@for (item of items; track item) {
				<li class="hub-sortable-preview__item">
					@if (useHandle()) {
						<span class="hub-sortable-preview__handle" aria-hidden="true">⋮⋮</span>
					}
					<span class="hub-sortable-preview__label">{{ item }}</span>
				</li>
			}
		</ul>
	`,
	styles: [
		`
			.hub-sortable-preview {
				display: flex;
				flex-direction: column;
				gap: var(--demo-sortable-item-gap, 0.5rem);
				margin: 0;
				padding: 0;
				list-style: none;
			}

			.hub-sortable-preview.is-horizontal {
				flex-direction: row;
				flex-wrap: wrap;
			}

			.hub-sortable-preview__item {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: var(--demo-sortable-item-padding-y, 0.625rem) var(--demo-sortable-item-padding-x, 0.875rem);
				background: var(--demo-sortable-item-bg, #ffffff);
				color: var(--demo-sortable-item-color, #212529);
				border: 1px solid var(--demo-sortable-item-border-color, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--demo-sortable-item-border-radius, 0.375rem);
				cursor: grab;
				user-select: none;
			}

			.hub-sortable-preview__item:active {
				cursor: grabbing;
			}

			.hub-sortable-preview__handle {
				cursor: grab;
				color: var(--demo-sortable-handle-color, #adb5bd);
				font-weight: 700;
				letter-spacing: -0.15em;
			}

			.hub-sortable-preview__ghost {
				opacity: 0.4;
				background: var(--demo-sortable-ghost-bg, #e9ecef);
			}
		`
	]
})
export class SortablePreviewComponent {
	/** Animation speed in milliseconds applied while reordering. */
	readonly animation = input<number>(150);
	/** When `true`, only a dedicated handle initiates the drag. */
	readonly useHandle = input<boolean>(false);
	/** Disables sorting entirely when `true`. */
	readonly disabled = input<boolean>(false);
	/** Allows or freezes reordering within the list. */
	readonly sort = input<boolean>(true);
	/** Layout axis of the sortable list. */
	readonly direction = input<Options['direction']>('vertical');
	/** Threshold of the swap zone (0–1). */
	readonly swapThreshold = input<number>(1);
	/** CSS class applied to the drag placeholder (ghost). */
	readonly ghostClass = input<string>('hub-sortable-preview__ghost');

	/** Canonical five-item dataset rendered in the preview list. */
	protected readonly items = ['Design', 'Develop', 'Review', 'Test', 'Release'];
}

/**
 * Interactive playground definitions for the ng-hub-ui-sortable documentation page.
 *
 * The library is a directive applied to an existing list, so there is a single config
 * that exposes the directive's behavioural inputs. The CSS variables drive the
 * wrapper's own list-item styling (the directive does not ship styled markup), giving
 * users a live sense of how a themed sortable list looks.
 */
export const SORTABLE_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'sortable',
		title: 'Sortable list',
		tag: 'ul [hubSortable]',
		description: 'Drag the items to reorder them. Tweak the directive options to see how the interaction changes.',
		component: SortablePreviewComponent,
		controls: [
			{
				name: 'direction',
				label: 'Direction',
				type: 'select',
				default: 'vertical',
				options: [
					{ label: 'vertical', value: 'vertical' },
					{ label: 'horizontal', value: 'horizontal' }
				],
				description: 'Layout axis of the list. SortableJS auto-detects it, but it can be forced.'
			},
			{ name: 'animation', label: 'Animation (ms)', type: 'range', default: 150, min: 0, max: 600, step: 10 },
			{
				name: 'useHandle',
				label: 'Drag handle only',
				type: 'boolean',
				default: false,
				description: 'Restrict the drag start to the ⋮⋮ handle.'
			},
			{
				name: 'sort',
				label: 'Allow sorting',
				type: 'boolean',
				default: true,
				description: 'Set to false to freeze the order (useful for clone-only sources).'
			},
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false },
			{
				name: 'swapThreshold',
				label: 'Swap threshold',
				type: 'range',
				default: 1,
				min: 0.1,
				max: 1,
				step: 0.1,
				description: 'Size of the swap zone, from 0.1 to 1.'
			},
			{
				name: 'ghostClass',
				label: 'Ghost class',
				type: 'text',
				default: 'hub-sortable-preview__ghost',
				description: 'CSS class applied to the drop placeholder during drag.'
			}
		],
		// Demo-local `--demo-sortable-*` variables styling this preview wrapper — NOT part of the library's API (the directive ships no styles).
		cssVariables: [
			{ name: '--demo-sortable-item-bg', label: 'Item background', type: 'color', default: '#ffffff' },
			{ name: '--demo-sortable-item-color', label: 'Item text', type: 'color', default: '#212529' },
			{ name: '--demo-sortable-item-border-color', label: 'Item border', type: 'color', default: '#dee2e6' },
			{ name: '--demo-sortable-item-border-radius', label: 'Item radius', type: 'text', default: '0.375rem' },
			{ name: '--demo-sortable-item-padding-y', label: 'Item padding Y', type: 'text', default: '0.625rem' },
			{ name: '--demo-sortable-item-padding-x', label: 'Item padding X', type: 'text', default: '0.875rem' },
			{ name: '--demo-sortable-item-gap', label: 'Gap between items', type: 'text', default: '0.5rem' },
			{ name: '--demo-sortable-handle-color', label: 'Handle color', type: 'color', default: '#adb5bd' },
			{ name: '--demo-sortable-ghost-bg', label: 'Ghost background', type: 'color', default: '#e9ecef' }
		]
	}
];
