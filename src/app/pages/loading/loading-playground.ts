import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HubLoadingBarComponent, HubLoadingComponent } from 'ng-hub-ui-loading';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';
import { HubPanelComponent } from 'ng-hub-ui-panels';

/** Mirrors the component's `variant` union without importing a type alias from the package. */
type LoadingVariant = 'spinner' | 'dots' | 'bars' | 'pulse' | 'ring';

/** Mirrors the component's `size` union. */
type LoadingSize = 'sm' | 'md' | 'lg';

/** Indicator options offered by every playground entry. */
const VARIANT_OPTIONS = [
	{ label: 'spinner', value: 'spinner' },
	{ label: 'dots', value: 'dots' },
	{ label: 'bars', value: 'bars' },
	{ label: 'pulse', value: 'pulse' },
	{ label: 'ring', value: 'ring' }
];

/** Size options offered by every playground entry. */
const SIZE_OPTIONS = [
	{ label: 'sm', value: 'sm' },
	{ label: 'md', value: 'md' },
	{ label: 'lg', value: 'lg' }
];

/**
 * The `--hub-loading-*` tokens exposed under the playground's Styling tab.
 *
 * Shared by both entries so a reader who themes the inline preview finds the same knobs
 * after switching to the overlay one.
 */
const LOADING_CSS_VARIABLES = [
	{ name: '--hub-loading-accent', label: 'Accent', type: 'color' as const, default: '#0d6efd' },
	{ name: '--hub-loading-size', label: 'Indicator size', type: 'text' as const, default: '3rem' },
	{ name: '--hub-loading-speed', label: 'Animation speed', type: 'text' as const, default: '1200ms' },
	{ name: '--hub-loading-thickness', label: 'Stroke thickness', type: 'text' as const, default: '4px' },
	{ name: '--hub-loading-gap', label: 'Gap', type: 'text' as const, default: '0.75rem' },
	{ name: '--hub-loading-backdrop-bg', label: 'Backdrop tint', type: 'text' as const, default: 'rgba(15, 23, 42, 0.55)' },
	{ name: '--hub-loading-backdrop-blur', label: 'Backdrop blur', type: 'text' as const, default: '2px' }
];

/**
 * Wrapper that gives the overlay mode something to cover.
 *
 * `mode="overlay"` is positioned against its nearest positioned ancestor, so previewing it
 * needs a real container — dropping a bare overlay onto the playground stage would either
 * cover the stage or escape it, and neither shows what the mode is for. The card here carries
 * `position-relative` for exactly that reason.
 *
 * The flat string controls are normalised back to `null` before reaching the component, since
 * an empty text field means "no message" / "no accent", not an empty string.
 */
@Component({
	selector: 'app-loading-overlay-preview',
	standalone: true,
	imports: [HubLoadingComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-panel class="position-relative" style="min-height: 11rem;">
			<div>
				<h6 class="card-title mb-1">Team members</h6>
				<p class="card-text small text-muted mb-0">
					The content the overlay holds back while this region refreshes. Turn the backdrop off to keep it readable
					underneath.
				</p>
			</div>

			<hub-loading
				mode="overlay"
				[variant]="variant()"
				[size]="size()"
				[message]="resolvedMessage()"
				[color]="resolvedColor()"
				[backdrop]="backdrop()"
			/>
		</hub-panel>
	`
})
export class LoadingOverlayPreviewComponent {
	/** Indicator rendered inside the overlay. */
	readonly variant = input<LoadingVariant>('ring');

	/** Indicator size step. */
	readonly size = input<LoadingSize>('md');

	/** Message shown under the indicator; empty means none. */
	readonly message = input<string>('Refreshing the list');

	/** Accent passed through `resolveHubAccent`; empty means the inherited default. */
	readonly color = input<string>('');

	/** Whether the translucent layer is drawn over the covered content. */
	readonly backdrop = input<boolean>(true);

	/** Normalises the empty-string sentinel back to `null` for the component input. */
	readonly resolvedMessage = computed<string | null>(() => this.message() || null);

	/** Normalises the empty-string sentinel back to `null` for the component input. */
	readonly resolvedColor = computed<string | null>(() => this.color() || null);
}

/** Mirrors the bar's `mode` union without importing a type alias from the package. */
type LoadingBarMode = 'inline' | 'overlay' | 'fixed';

/** Mirrors the bar's `placement` union. */
type LoadingBarPlacement = 'top' | 'bottom';

/**
 * The `--hub-loading-bar-*` tokens exposed under the bar playground's Styling tab.
 */
const LOADING_BAR_CSS_VARIABLES = [
	{ name: '--hub-loading-bar-accent', label: 'Accent', type: 'color' as const, default: '#0d6efd' },
	{ name: '--hub-loading-bar-height', label: 'Thickness', type: 'text' as const, default: '4px' },
	{ name: '--hub-loading-bar-track-bg', label: 'Track', type: 'text' as const, default: 'transparent' },
	{ name: '--hub-loading-bar-radius', label: 'Corner radius', type: 'text' as const, default: '0' },
	{ name: '--hub-loading-bar-speed', label: 'Fill speed', type: 'text' as const, default: '200ms' },
	{ name: '--hub-loading-bar-fade', label: 'Fade', type: 'text' as const, default: '300ms' },
	{ name: '--hub-loading-bar-easing', label: 'Fill easing', type: 'text' as const, default: 'linear' },
	{ name: '--hub-loading-bar-glow-color', label: 'Glow colour', type: 'text' as const, default: 'currentColor' },
	{ name: '--hub-loading-bar-glow-blur', label: 'Glow blur', type: 'text' as const, default: '10px' },
	{ name: '--hub-loading-bar-glow-spread', label: 'Glow spread', type: 'text' as const, default: '1px' },
	{
		name: '--hub-loading-bar-indeterminate-speed',
		label: 'Sweep period',
		type: 'text' as const,
		default: '1.6s',
		description: 'Only the indeterminate sweep uses it; a bar reporting a value never runs one.'
	},
	{
		name: '--hub-loading-bar-offset',
		label: 'Edge offset',
		type: 'text' as const,
		default: '0px',
		description: 'How far under the navbar the overlay and fixed modes hang.'
	}
];

/**
 * Wrapper that gives the bar a navbar to hang from.
 *
 * `mode="overlay"` attaches to the nearest positioned ancestor, so previewing it needs a real
 * one — a bare overlay bar on the playground stage would attach to whatever happened to be
 * positioned further up and appear somewhere the reader cannot explain. The mock navbar here
 * carries `position-relative` for exactly that reason, and doubles as the visual answer to
 * "where is this thing supposed to go?".
 *
 * `fixed` is offered but pins to the viewport, so in the preview it leaves the stage and lands
 * against the browser window — which is honest about what the mode does, and is why the copy
 * under the navbar says so.
 */
@Component({
	selector: 'app-loading-bar-preview',
	standalone: true,
	imports: [HubLoadingBarComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="border rounded-3 overflow-hidden w-100">
			<div class="position-relative d-flex align-items-center justify-content-between px-3 py-2 bg-body-tertiary">
				<span class="fw-semibold small">Acme</span>
				<span class="text-muted small">Orders · Reports · Settings</span>

				@if (mode() !== 'inline') {
					<hub-loading-bar
						[mode]="mode()"
						[placement]="placement()"
						[progress]="progress()"
						[indeterminate]="indeterminate()"
						[glow]="glow()"
						[color]="resolvedColor()"
						[ariaLabel]="ariaLabel()"
					/>
				}
			</div>

			@if (mode() === 'inline') {
				<hub-loading-bar
					[progress]="progress()"
					[indeterminate]="indeterminate()"
					[glow]="glow()"
					[color]="resolvedColor()"
					[ariaLabel]="ariaLabel()"
				/>
			}

			<p class="text-muted small mb-0 p-3">
				{{ hint() }}
			</p>
		</div>
	`
})
export class LoadingBarPreviewComponent {
	/** Where the strip sits relative to the mock navbar. */
	readonly mode = input<LoadingBarMode>('overlay');

	/** Edge the positioned modes attach to. */
	readonly placement = input<LoadingBarPlacement>('bottom');

	/** Fill, 0-100. Bound rather than left to the service so the preview always shows something. */
	readonly progress = input<number>(64);

	/** Sweeps instead of filling. */
	readonly indeterminate = input<boolean>(false);

	/** Soft glow at the leading edge. */
	readonly glow = input<boolean>(true);

	/** Accent passed through `resolveHubAccent`; empty means the inherited default. */
	readonly color = input<string>('');

	/** Accessible name for the progressbar role. */
	readonly ariaLabel = input<string>('Loading');

	/** Normalises the empty-string sentinel back to `null` for the component input. */
	readonly resolvedColor = computed<string | null>(() => this.color() || null);

	/** One line explaining what the chosen mode does to the preview. */
	readonly hint = computed(() => {
		if (this.mode() === 'fixed') {
			return 'fixed pins the bar to the viewport, so it has left this card and is sitting against the browser window — offset by --hub-loading-bar-offset.';
		}
		if (this.mode() === 'inline') {
			return 'inline takes part in the flow and reserves its own row under the navbar, so nothing shifts when it appears.';
		}
		return 'overlay attaches to the navbar above, which carries position: relative. That is what confines the bar to it.';
	});
}

/**
 * Interactive playground definitions for the ng-hub-ui-loading documentation page.
 *
 * The first entry drives the real component in its default inline mode. The second wraps it in
 * a positioned container so the overlay mode — and the backdrop tokens, which do nothing
 * inline — can actually be seen.
 *
 * Both pin `cssVarTargetSelector` to the `hub-loading` element: the component declares its own
 * tokens on itself, and a declaration on the element always beats a value inherited from the
 * stage, however low the declaring selector's specificity.
 */
export const LOADING_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'inline',
		title: 'Inline',
		tag: 'hub-loading',
		description: 'The default mode: a block that takes part in normal flow and reserves the space it occupies.',
		component: HubLoadingComponent,
		cssVarTargetSelector: 'hub-loading',
		controls: [
			{ name: 'variant', label: 'Variant', type: 'select', default: 'spinner', options: VARIANT_OPTIONS },
			{ name: 'size', label: 'Size', type: 'select', default: 'md', options: SIZE_OPTIONS },
			{ name: 'message', label: 'Message', type: 'text', default: 'Loading your workspace' },
			{
				name: 'color',
				label: 'Accent',
				type: 'text',
				default: '',
				description: 'A bare name resolves to a --hub-sys-color-* token; a hex, oklch() or var(...) is literal.'
			},
			{ name: 'ariaLabel', label: 'ARIA label', type: 'text', default: 'Loading' }
		],
		cssVariables: LOADING_CSS_VARIABLES
	},
	{
		id: 'overlay',
		title: 'Container overlay',
		tag: 'hub-loading',
		description: 'Covers one positioned container instead of the page, leaving the rest of the screen usable.',
		component: LoadingOverlayPreviewComponent,
		cssVarTargetSelector: 'hub-loading',
		controls: [
			{ name: 'variant', label: 'Variant', type: 'select', default: 'ring', options: VARIANT_OPTIONS },
			{ name: 'size', label: 'Size', type: 'select', default: 'md', options: SIZE_OPTIONS },
			{ name: 'message', label: 'Message', type: 'text', default: 'Refreshing the list' },
			{ name: 'color', label: 'Accent', type: 'text', default: '' },
			{
				name: 'backdrop',
				label: 'Backdrop',
				type: 'boolean',
				default: true,
				description: 'Only drawn in overlay and fullscreen modes.'
			}
		],
		cssVariables: LOADING_CSS_VARIABLES,
		codeTemplate: (inputs) => {
			const attrs = ['mode="overlay"', `variant="${inputs['variant'] ?? 'ring'}"`];

			if (inputs['size'] && inputs['size'] !== 'md') {
				attrs.push(`size="${inputs['size']}"`);
			}
			if (inputs['message']) {
				attrs.push(`message="${inputs['message']}"`);
			}
			if (inputs['color']) {
				attrs.push(`color="${inputs['color']}"`);
			}
			if (inputs['backdrop'] === false) {
				attrs.push('[backdrop]="false"');
			}

			return `<!-- position-relative is what confines the overlay to this container -->
<hub-panel class="position-relative">
\t<div>…</div>

\t<hub-loading
\t\t${attrs.join('\n\t\t')}
\t/>
</hub-panel>`;
		}
	},
	{
		id: 'loading-bar',
		title: 'Page progress bar',
		tag: 'hub-loading-bar',
		description:
			'The strip under the navbar. Bind a value to drive it here; in an application it follows HubLoadingBarService.',
		component: LoadingBarPreviewComponent,
		cssVarTargetSelector: 'hub-loading-bar',
		controls: [
			{
				name: 'mode',
				label: 'Mode',
				type: 'select',
				default: 'overlay',
				options: [
					{ label: 'inline', value: 'inline' },
					{ label: 'overlay', value: 'overlay' },
					{ label: 'fixed', value: 'fixed' }
				]
			},
			{
				name: 'placement',
				label: 'Placement',
				type: 'select',
				default: 'bottom',
				options: [
					{ label: 'top', value: 'top' },
					{ label: 'bottom', value: 'bottom' }
				],
				description: 'Only the overlay and fixed modes attach to an edge.'
			},
			{ name: 'progress', label: 'Progress', type: 'range', default: 64, min: 0, max: 100, step: 1 },
			{
				name: 'indeterminate',
				label: 'Indeterminate',
				type: 'boolean',
				default: false,
				description: 'Sweeps instead of filling, and withholds aria-valuenow.'
			},
			{ name: 'glow', label: 'Glow', type: 'boolean', default: true },
			{ name: 'color', label: 'Accent', type: 'text', default: '' },
			{ name: 'ariaLabel', label: 'ARIA label', type: 'text', default: 'Loading' }
		],
		cssVariables: LOADING_BAR_CSS_VARIABLES,
		codeTemplate: (inputs) => {
			const mode = (inputs['mode'] as string) ?? 'overlay';
			const attrs: string[] = [];

			if (mode !== 'inline') {
				attrs.push(`mode="${mode}"`);
				attrs.push(`placement="${inputs['placement'] ?? 'bottom'}"`);
			}
			if (inputs['indeterminate'] === true) {
				attrs.push('indeterminate');
			}
			if (inputs['glow'] === false) {
				attrs.push('[glow]="false"');
			}
			if (inputs['color']) {
				attrs.push(`color="${inputs['color']}"`);
			}
			if (inputs['ariaLabel'] && inputs['ariaLabel'] !== 'Loading') {
				attrs.push(`ariaLabel="${inputs['ariaLabel']}"`);
			}

			const bar = `<hub-loading-bar${attrs.length ? '\n\t\t' + attrs.join('\n\t\t') + '\n\t' : ' '}/>`;

			return mode === 'overlay'
				? `<!-- position: relative on the navbar is what confines the bar to it -->
<nav class="navbar position-relative">
\t…
\t${bar}
</nav>

<!-- Left unbound, the bar follows HubLoadingBarService -->`
				: `${bar.replace(/^\t/gm, '')}

<!-- Left unbound, the bar follows HubLoadingBarService -->`;
		}
	}
];
