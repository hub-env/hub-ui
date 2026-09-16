import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HubSkeletonAppearance, HubSkeletonComponent, HubSkeletonParams } from 'ng-hub-ui-skeleton';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/** Appearance options shared by every skeleton playground entry. */
const APPEARANCE_OPTIONS = [
	{ label: 'default', value: 'default' },
	{ label: 'subtle', value: 'subtle' },
	{ label: 'contrast', value: 'contrast' }
];

/** Bundled preset names exposed in the preset switcher. */
const PRESET_OPTIONS = [
	{ label: 'card', value: 'card' },
	{ label: 'list-item', value: 'list-item' },
	{ label: 'table-row', value: 'table-row' },
	{ label: 'detail-view', value: 'detail-view' },
	{ label: 'form-section', value: 'form-section' },
	{ label: 'dashboard-widget', value: 'dashboard-widget' },
	{ label: 'stat-card', value: 'stat-card' },
	{ label: 'chart-panel', value: 'chart-panel' },
	{ label: 'profile-summary', value: 'profile-summary' },
	{ label: 'master-detail', value: 'master-detail' },
	{ label: 'kanban-card', value: 'kanban-card' },
	{ label: 'feed-item', value: 'feed-item' },
	{ label: 'search-result', value: 'search-result' },
	{ label: 'table-toolbar', value: 'table-toolbar' },
	{ label: 'filter-bar', value: 'filter-bar' },
	{ label: 'empty-state-skeleton', value: 'empty-state-skeleton' }
];

/** Variant options offered for presets that expose a `compact` variant. */
const VARIANT_OPTIONS = [
	{ label: '(none)', value: '' },
	{ label: 'compact', value: 'compact' }
];

/**
 * SSR-safe thin preview wrapper that maps the flat scalar controls exposed by the
 * playground onto the `hub-skeleton` object inputs.
 *
 * The skeleton component renders standalone from a `preset` plus a single `params`
 * object input. Since the playground binds one scalar value per control, this wrapper
 * collects the structural knobs (`columns`, `rows`, `fields`) into a `params` map and
 * normalises the empty-string "none" variant back to `null` before delegating to the
 * real component.
 */
@Component({
	selector: 'app-skeleton-preset-preview',
	standalone: true,
	imports: [HubSkeletonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-skeleton
			[preset]="preset()"
			[variant]="resolvedVariant()"
			[params]="resolvedParams()"
			[animated]="animated()"
			[appearance]="appearance()"
			[ariaLabel]="ariaLabel()"
		></hub-skeleton>
	`
})
export class SkeletonPresetPreviewComponent {
	/** Bundled preset name rendered by the underlying component. */
	readonly preset = input<string>('card');

	/** Optional preset variant; an empty string is treated as "no variant". */
	readonly variant = input<string>('');

	/** Toggles the shimmer animation. */
	readonly animated = input<boolean>(true);

	/** Visual appearance preset. */
	readonly appearance = input<HubSkeletonAppearance>('default');

	/** Accessible label forwarded to the skeleton container. */
	readonly ariaLabel = input<string>('Loading placeholder');

	/** Column count consumed by grid-based presets such as `table-row` / `filter-bar`. */
	readonly columns = input<number>(4);

	/** Body line count consumed by the `card` preset. */
	readonly rows = input<number>(2);

	/** Field count consumed by the `form-section` preset. */
	readonly fields = input<number>(4);

	/** Normalises the empty-string sentinel back to `null` for the component input. */
	readonly resolvedVariant = computed<string | null>(() => this.variant() || null);

	/**
	 * Assembles the structural knobs into a single `params` object. Unknown keys are
	 * harmlessly ignored by presets that do not reference them.
	 */
	readonly resolvedParams = computed<HubSkeletonParams>(() => ({
		columns: this.columns(),
		rows: this.rows(),
		fields: this.fields(),
		filters: this.columns()
	}));
}

/**
 * Interactive playground definitions for the ng-hub-ui-skeleton documentation page.
 *
 * The first entry drives the bundled presets through a flat-control wrapper, while the
 * second targets the real component directly to author inline compact-DSL templates.
 */
export const SKELETON_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'preset',
		title: 'Preset',
		tag: 'hub-skeleton',
		description: 'Render any bundled preset and tune its structural params, appearance and shimmer in real time.',
		component: SkeletonPresetPreviewComponent,
		controls: [
			{ name: 'preset', label: 'Preset', type: 'select', default: 'card', options: PRESET_OPTIONS },
			{
				name: 'variant',
				label: 'Variant',
				type: 'select',
				default: '',
				options: VARIANT_OPTIONS,
				description: 'Only `card` and `list-item` ship a `compact` variant; other presets ignore it.'
			},
			{
				name: 'appearance',
				label: 'Appearance',
				type: 'select',
				default: 'default',
				options: APPEARANCE_OPTIONS
			},
			{ name: 'animated', label: 'Animated', type: 'boolean', default: true },
			{
				name: 'columns',
				label: 'Columns',
				type: 'number',
				default: 4,
				min: 1,
				max: 8,
				description: 'Used by grid presets (`table-row`, `filter-bar`).'
			},
			{
				name: 'rows',
				label: 'Body rows',
				type: 'number',
				default: 2,
				min: 0,
				max: 8,
				description: 'Used by the `card` preset body.'
			},
			{
				name: 'fields',
				label: 'Form fields',
				type: 'number',
				default: 4,
				min: 1,
				max: 8,
				description: 'Used by the `form-section` preset.'
			},
			{ name: 'ariaLabel', label: 'ARIA label', type: 'text', default: 'Loading placeholder' }
		],
		cssVariables: [
			{ name: '--hub-skeleton-bg', label: 'Base color', type: 'color', default: 'rgba(148, 163, 184, 0.18)' },
			{ name: '--hub-skeleton-highlight', label: 'Highlight color', type: 'color', default: 'rgba(255, 255, 255, 0.52)' },
			{ name: '--hub-skeleton-radius', label: 'Border radius', type: 'text', default: '12px' },
			{ name: '--hub-skeleton-gap', label: 'Gap', type: 'text', default: '12px' },
			{ name: '--hub-skeleton-animation-duration', label: 'Animation duration', type: 'text', default: '1.35s' }
		],
		codeTemplate: (inputs) => {
			const preset = String(inputs['preset'] ?? 'card');
			const variant = String(inputs['variant'] ?? '');
			const params: string[] = [];
			if (['table-row', 'filter-bar'].includes(preset)) {
				params.push(`columns: ${inputs['columns'] ?? 4}`);
			}
			if (preset === 'card') {
				params.push(`rows: ${inputs['rows'] ?? 2}`);
			}
			if (preset === 'form-section') {
				params.push(`fields: ${inputs['fields'] ?? 4}`);
			}
			const attrs = [`preset="${preset}"`];
			if (variant) attrs.push(`variant="${variant}"`);
			if (params.length) attrs.push(`[params]="{ ${params.join(', ')} }"`);
			if (inputs['appearance'] && inputs['appearance'] !== 'default') attrs.push(`appearance="${inputs['appearance']}"`);
			if (inputs['animated'] === false) attrs.push(`[animated]="false"`);
			return attrs.length === 1
				? `<hub-skeleton ${attrs[0]}></hub-skeleton>`
				: `<hub-skeleton\n\t${attrs.join('\n\t')}\n></hub-skeleton>`;
		}
	},
	{
		id: 'template',
		title: 'Inline DSL',
		tag: 'hub-skeleton',
		description:
			'Author a custom skeleton with the compact Emmet-like DSL: `+` for siblings, `>` for nesting, `*N` to repeat.',
		component: HubSkeletonComponent,
		controls: [
			{
				name: 'template',
				label: 'Template (DSL)',
				type: 'text',
				default:
					'stack(gap:12)>circle(size:48)+stack(gap:8,grow:1)>line(height:14,width:42%)+line(height:10,width:72%)',
				description: 'Compact DSL string parsed and rendered live.'
			},
			{
				name: 'appearance',
				label: 'Appearance',
				type: 'select',
				default: 'default',
				options: APPEARANCE_OPTIONS
			},
			{ name: 'animated', label: 'Animated', type: 'boolean', default: true },
			{ name: 'ariaLabel', label: 'ARIA label', type: 'text', default: 'Loading placeholder' }
		],
		cssVariables: [
			{ name: '--hub-skeleton-bg', label: 'Base color', type: 'color', default: 'rgba(148, 163, 184, 0.18)' },
			{ name: '--hub-skeleton-highlight', label: 'Highlight color', type: 'color', default: 'rgba(255, 255, 255, 0.52)' },
			{ name: '--hub-skeleton-radius', label: 'Border radius', type: 'text', default: '12px' },
			{ name: '--hub-skeleton-gap', label: 'Gap', type: 'text', default: '12px' },
			{ name: '--hub-skeleton-animation-duration', label: 'Animation duration', type: 'text', default: '1.35s' }
		]
	}
];
