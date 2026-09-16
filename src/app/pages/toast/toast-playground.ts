import {
	afterNextRender,
	booleanAttribute,
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	inject,
	input
} from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * SSR-safe preview wrapper for the toast playground.
 *
 * Toast notifications are imperative — they appear as overlays appended to
 * `document.body`. This wrapper exposes the most useful per-call config inputs
 * and fires a sample toast when the trigger button is clicked, forwarding all
 * playground-controlled options to the service call.
 *
 * CSS variable theming: the playground applies `--hub-toast-*` variables to the
 * `#stage` wrapper element, but toasts render on `document.body` (outside that
 * subtree). A MutationObserver watches the stage's inline style and mirrors any
 * `--hub-toast-*` variables to `document.body` so live toasts reflect the changes.
 * Forwarded variables are removed on component destroy.
 */
@Component({
	selector: 'app-toast-playground-preview',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex gap-2 flex-wrap">
			<button hubButton color="success" (click)="fire('success')">Success</button>
			<button hubButton color="danger" (click)="fire('error')">Error</button>
			<button hubButton color="warning" (click)="fire('warning')">Warning</button>
			<button hubButton color="info" (click)="fire('info')">Info</button>
		</div>
	`
})
export class ToastPlaygroundPreviewComponent {
	private readonly _toast = inject(HubToastService);
	private readonly _el = inject(ElementRef<HTMLElement>);
	private readonly _destroyRef = inject(DestroyRef);

	/** CSS variables forwarded to document.body, tracked for cleanup. */
	private readonly _forwardedVars = new Set<string>();
	private _stageObserver: MutationObserver | null = null;

	/** Auto-dismiss timeout in milliseconds. 0 = persistent. */
	readonly timeOut = input(5000);

	/** Show a progress bar counting down to dismissal. */
	readonly progressBar = input(false, { transform: booleanAttribute });

	/** Show a × close button on the toast. */
	readonly closeButton = input(true, { transform: booleanAttribute });

	/** Close the toast when the user clicks anywhere on it. */
	readonly tapToDismiss = input(true, { transform: booleanAttribute });

	/** Ignore new toasts that match an already-visible message. */
	readonly preventDuplicates = input(false, { transform: booleanAttribute });

	/** CSS position class for the container. */
	readonly positionClass = input('toast-top-right');

	constructor() {
		afterNextRender(() => {
			// The playground renders this component inside a .hub-playground__stage div.
			// CSS variables set by the playground control panel are applied to that element.
			const stage = this._el.nativeElement.parentElement;
			if (!stage) return;

			this._stageObserver = new MutationObserver(() => this._syncToastVars(stage));
			this._stageObserver.observe(stage, { attributes: true, attributeFilter: ['style'] });

			this._destroyRef.onDestroy(() => {
				this._stageObserver?.disconnect();
				this._clearForwardedVars();
			});
		});
	}

	fire(type: 'success' | 'error' | 'warning' | 'info'): void {
		const messages: Record<string, string> = {
			success: 'Changes saved successfully.',
			error: 'An unexpected error occurred.',
			warning: 'Your session is about to expire.',
			info: 'A new version is available.'
		};

		this._toast[type](messages[type], type.charAt(0).toUpperCase() + type.slice(1), {
			timeOut: this.timeOut(),
			progressBar: this.progressBar(),
			closeButton: this.closeButton(),
			tapToDismiss: this.tapToDismiss(),
			preventDuplicates: this.preventDuplicates(),
			positionClass: this.positionClass()
		});
	}

	/**
	 * Mirrors `--hub-toast-*` variables from the playground stage element to
	 * `document.body` so they cascade to the dynamically-mounted toast container.
	 */
	private _syncToastVars(stage: HTMLElement): void {
		this._clearForwardedVars();
		const style = stage.style;
		for (let i = 0; i < style.length; i++) {
			const prop = style[i];
			if (prop.startsWith('--hub-toast')) {
				document.body.style.setProperty(prop, style.getPropertyValue(prop));
				this._forwardedVars.add(prop);
			}
		}
	}

	/** Removes all forwarded CSS variables from `document.body`. */
	private _clearForwardedVars(): void {
		this._forwardedVars.forEach((v) => document.body.style.removeProperty(v));
		this._forwardedVars.clear();
	}
}

/**
 * Interactive playground definitions for the ng-hub-ui-toast documentation page.
 */
export const TOAST_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'toast',
		title: 'Toast',
		tag: 'hub-toast',
		description:
			'An imperative toast service that stacks animated notifications on screen. Use the controls to configure timeout, progress bar, close button and position, then click a type button to fire a sample notification.',
		component: ToastPlaygroundPreviewComponent,
		controls: [
			{
				name: 'timeOut',
				label: 'Timeout (ms)',
				type: 'number',
				default: 5000,
				description: 'Auto-dismiss delay in milliseconds. Set to 0 for a persistent toast.'
			},
			{
				name: 'progressBar',
				label: 'Progress bar',
				type: 'boolean',
				default: false,
				description: 'Show a countdown bar below the toast body.'
			},
			{
				name: 'closeButton',
				label: 'Close button',
				type: 'boolean',
				default: true,
				description: 'Render a × button in the top-right corner of the toast.'
			},
			{
				name: 'tapToDismiss',
				label: 'Tap to dismiss',
				type: 'boolean',
				default: true,
				description: 'Close the toast when the user clicks anywhere on it.'
			},
			{
				name: 'preventDuplicates',
				label: 'Prevent duplicates',
				type: 'boolean',
				default: false,
				description: 'Silently drop new toasts that match an already-visible message.'
			},
			{
				name: 'positionClass',
				label: 'Position',
				type: 'select',
				default: 'toast-top-right',
				options: [
					{ label: 'Top right', value: 'toast-top-right' },
					{ label: 'Top left', value: 'toast-top-left' },
					{ label: 'Top center', value: 'toast-top-center' },
					{ label: 'Bottom right', value: 'toast-bottom-right' },
					{ label: 'Bottom left', value: 'toast-bottom-left' },
					{ label: 'Bottom center', value: 'toast-bottom-center' }
				]
			}
		],
		cssVariables: [
			{ name: '--hub-toast-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-toast-color', label: 'Text color', type: 'color', default: '#212529' },
			{ name: '--hub-toast-accent', label: 'Accent / left border', type: 'color', default: '#dee2e6' },
			{ name: '--hub-toast-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-toast-padding-x', label: 'Padding X', type: 'text', default: '1rem' },
			{ name: '--hub-toast-padding-y', label: 'Padding Y', type: 'text', default: '1rem' },
			{ name: '--hub-toast-shadow', label: 'Box shadow', type: 'text', default: '0 0.25rem 0.75rem rgba(0,0,0,.1)' },
			{ name: '--hub-toast-max-width', label: 'Max width', type: 'text', default: '26rem' },
			{ name: '--hub-toast-progress-height', label: 'Progress bar height', type: 'text', default: '0.25rem' },
			{ name: '--hub-toast-progress-bg', label: 'Progress bar color', type: 'color', default: 'rgba(0,0,0,.1)' }
		]
	}
];
