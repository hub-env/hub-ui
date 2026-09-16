import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StepComponent, StepperComponent, StepperLayout, StepperOptions } from '../../../../projects/stepper/src/public-api';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * SSR-safe preview wrapper for the stepper playground.
 *
 * The real `hub-stepper` requires content-projected `hub-step` children, so it
 * cannot be driven directly by the generic playground host (which only binds
 * flat `@Input`s). This thin wrapper renders a canonical three-step stepper and
 * re-exposes the stepper's configurable surface as flat `input()` signals mapped
 * 1:1 to the playground controls.
 *
 * The stepper's options are split across three binding shapes: the `options`
 * object (`layout`, `rtl`), host CSS classes (`stepper--animated`,
 * `stepper--anim-fade`, `stepper--anim-slide`) and label inputs
 * (`backLabel`, `continueLabel`, `submitLabel`). The wrapper recomposes the flat
 * inputs into those shapes for the underlying component.
 *
 * It performs no `document`/`window` access during construction or init, keeping
 * the preview safe to render under SSR.
 */
@Component({
	selector: 'app-stepper-playground-preview',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-stepper
			[options]="stepperOptions()"
			[backLabel]="backLabel() || null"
			[continueLabel]="continueLabel() || null"
			[submitLabel]="submitLabel() || null"
			[class.stepper--animated]="animated()"
			[class.stepper--anim-fade]="animated() && animation() === 'fade'"
			[class.stepper--anim-slide]="animated() && animation() === 'slide'"
		>
			<hub-step title="Account">
				<p>Create your account by choosing a username and a secure password.</p>
			</hub-step>
			<hub-step title="Profile">
				<p>Tell us a little about yourself so we can personalise your experience.</p>
			</hub-step>
			<hub-step title="Confirm">
				<p>Review everything and confirm to finish the workflow.</p>
			</hub-step>
		</hub-stepper>
	`,
	styles: []
})
export class StepperPlaygroundPreviewComponent {
	/** Layout mode forwarded to the stepper `options.layout`. */
	readonly layout = input<StepperLayout>(StepperLayout.Vertical);

	/** Right-to-left mode forwarded to the stepper `options.rtl`. */
	readonly rtl = input<boolean>(false);

	/** Whether content transitions are enabled (toggles the `stepper--animated` host class). */
	readonly animated = input<boolean>(false);

	/** Animation style applied while `animated` is true. */
	readonly animation = input<'slide' | 'fade'>('slide');

	/** Custom label for the back button. */
	readonly backLabel = input<string>('');

	/** Custom label for the continue button. */
	readonly continueLabel = input<string>('');

	/** Custom label for the submit button. */
	readonly submitLabel = input<string>('');

	/**
	 * Builds the `StepperOptions` object consumed by the underlying stepper from
	 * the flat `layout` and `rtl` inputs.
	 *
	 * @returns The recomposed stepper options.
	 */
	readonly stepperOptions = computed<StepperOptions>(() => ({
		layout: this.layout(),
		rtl: this.rtl()
	}));
}

/**
 * Interactive playground definitions for the ng-hub-ui-stepper documentation page.
 *
 * A single config exposes the stepper's real, user-facing options through the
 * SSR-safe wrapper above. All CSS variables are the concrete `--hub-stepper-*`
 * tokens declared on the component host, with their shipped fallback values.
 */
export const STEPPER_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'stepper',
		title: 'Stepper',
		tag: 'hub-stepper',
		description:
			'A multi-step workflow. Switch the layout between the stacked vertical default and a sidebar, toggle RTL and content animations, and relabel the navigation buttons.',
		component: StepperPlaygroundPreviewComponent,
		controls: [
			{
				name: 'layout',
				label: 'Layout',
				type: 'select',
				default: StepperLayout.Vertical,
				options: [
					{ label: 'vertical', value: StepperLayout.Vertical },
					{ label: 'sidebar', value: StepperLayout.Sidebar }
				]
			},
			{ name: 'rtl', label: 'Right-to-left', type: 'boolean', default: false },
			{ name: 'animated', label: 'Animate transitions', type: 'boolean', default: false },
			{
				name: 'animation',
				label: 'Animation',
				type: 'select',
				default: 'slide',
				options: [
					{ label: 'slide', value: 'slide' },
					{ label: 'fade', value: 'fade' }
				],
				description: 'Only applies while "Animate transitions" is on.'
			},
			{ name: 'backLabel', label: 'Back label', type: 'text', default: '' },
			{ name: 'continueLabel', label: 'Continue label', type: 'text', default: '' },
			{ name: 'submitLabel', label: 'Submit label', type: 'text', default: '' }
		],
		cssVariables: [
			{ name: '--hub-stepper-primary-color', label: 'Primary color', type: 'color', default: '#0d6efd' },
			{ name: '--hub-stepper-background-color', label: 'Surface (back button)', type: 'color', default: '#f3f6f9' },
			{ name: '--hub-stepper-text-color', label: 'Text color', type: 'color', default: '#181c32' },
			{ name: '--hub-stepper-border-color', label: 'Border color', type: 'color', default: '#d8dde6' },
			{ name: '--hub-stepper-surface-color', label: 'Content background', type: 'color', default: '#ffffff' },
			{ name: '--hub-stepper-nav-link-color', label: 'Nav link color', type: 'color', default: '#495057' },
			{ name: '--hub-stepper-nav-link-active-bg', label: 'Active nav background', type: 'color', default: '#0d6efd' },
			{ name: '--hub-stepper-nav-link-active-color', label: 'Active nav text', type: 'color', default: '#ffffff' },
			{ name: '--hub-stepper-nav-link-disabled-color', label: 'Disabled nav color', type: 'color', default: '#adb5bd' },
			{ name: '--hub-stepper-gap', label: 'Grid gap', type: 'text', default: '1rem' },
			{ name: '--hub-stepper-controls-gap', label: 'Controls gap', type: 'text', default: '0.5rem' },
			{ name: '--hub-stepper-disabled-opacity', label: 'Disabled opacity', type: 'text', default: '0.5' },
			{ name: '--hub-stepper-sidebar-width', label: 'Sidebar width', type: 'text', default: 'clamp(160px, 20vw, 240px)' },
			{ name: '--hub-stepper-animation-duration', label: 'Animation duration', type: 'text', default: '260ms' }
		]
	}
];
