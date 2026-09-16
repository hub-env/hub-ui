import {
	HubDatepickerComponent,
	HubInputComponent,
	HubSelectComponent,
	HubSliderComponent,
	HubTextareaComponent
} from 'ng-hub-ui-forms';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/** Label-placement options shared by every field. */
const LABEL_TYPE_OPTIONS = [
	{ label: 'stacked', value: 'stacked' },
	{ label: 'floating', value: 'floating' },
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'visually-hidden', value: 'visually-hidden' }
];

/** Sample option set used by the select playground. */
const SELECT_ITEMS = [
	{ id: 1, name: 'Angular' },
	{ id: 2, name: 'React' },
	{ id: 3, name: 'Vue' },
	{ id: 4, name: 'Svelte' },
	{ id: 5, name: 'Solid' }
];

/**
 * Interactive playground definitions for the ng-hub-ui-forms documentation page.
 * Each entry maps a live hub component to the inputs users can tweak in real time.
 */
export const FORMS_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'input',
		title: 'Input',
		tag: 'hub-input',
		description: 'A single text field. Switch the format to see number, password, color, switch, counter and more.',
		component: HubInputComponent,
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Email' },
			{ name: 'placeholder', label: 'Placeholder', type: 'text', default: 'you@example.com' },
			{
				name: 'type',
				label: 'Format',
				type: 'select',
				default: 'email',
				options: [
					{ label: 'text', value: 'text' },
					{ label: 'number', value: 'number' },
					{ label: 'password', value: 'password' },
					{ label: 'email', value: 'email' },
					{ label: 'tel', value: 'tel' },
					{ label: 'url', value: 'url' },
					{ label: 'color', value: 'color' },
					{ label: 'checkbox', value: 'checkbox' },
					{ label: 'switch', value: 'switch' },
					{ label: 'counter', value: 'counter' },
					{ label: 'file', value: 'file' }
				]
			},
			{ name: 'labelType', label: 'Label type', type: 'select', default: 'stacked', options: LABEL_TYPE_OPTIONS },
			{ name: 'formText', label: 'Helper text', type: 'text', default: "We'll never share it." },
			{ name: 'readonly', label: 'Read-only', type: 'boolean', default: false },
			{
				name: 'passwordToggle',
				label: 'Password toggle',
				type: 'boolean',
				default: true,
				description: 'Only applies to the password format: shows or hides the reveal toggle.'
			},
			{
				name: 'passwordStrength',
				label: 'Strength meter',
				type: 'boolean',
				default: false,
				description: 'Only applies to the password format: shows the 4-segment strength meter.'
			},
			{
				name: 'capsLockWarning',
				label: 'Caps Lock warning',
				type: 'boolean',
				default: true,
				description: 'Only applies to the password format: shows a hint under the field while Caps Lock is active.'
			},
			{
				name: 'hideOnBlur',
				label: 'Hide on blur',
				type: 'boolean',
				default: true,
				description: 'Only applies to the password format: re-masks a revealed password when focus leaves the field.'
			},
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-input-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-input-color', label: 'Text color', type: 'color', default: '#212529' },
			{ name: '--hub-input-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-input-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-input-focus-border-color', label: 'Focus border', type: 'color', default: '#0d6efd' },
			{ name: '--hub-input-padding-y', label: 'Padding Y', type: 'text', default: '0.375rem' },
			{ name: '--hub-input-padding-x', label: 'Padding X', type: 'text', default: '0.75rem' },
			{ name: '--hub-label-color', label: 'Label color', type: 'color', default: '#212529' },
			{ name: '--hub-label-font-weight', label: 'Label weight', type: 'text', default: '500' },
			{
				name: '--hub-form-label-horizontal-max-width',
				label: 'Horizontal label max width',
				type: 'text',
				default: '12rem',
				description: 'Only affects the "horizontal" label type; the label ellipsizes past this width.'
			}
		]
	},
	{
		id: 'select',
		title: 'Select',
		tag: 'hub-select',
		description:
			'Forked ng-select themed with hub tokens. Switch the format to render the same value as buttons, radios or checkboxes.',
		component: HubSelectComponent,
		staticInputs: { items: SELECT_ITEMS, bindLabel: 'name', bindValue: 'id' },
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Framework' },
			{ name: 'placeholder', label: 'Placeholder', type: 'text', default: 'Select a framework' },
			{
				name: 'format',
				label: 'Format',
				type: 'select',
				default: 'dropdown',
				options: [
					{ label: 'dropdown', value: 'dropdown' },
					{ label: 'buttons', value: 'buttons' },
					{ label: 'radio', value: 'radio' },
					{ label: 'checkbox', value: 'checkbox' }
				]
			},
			{ name: 'multiple', label: 'Multiple', type: 'boolean', default: false },
			{ name: 'prepend', label: 'Prepend addon', type: 'text', default: '' },
			{ name: 'append', label: 'Append addon', type: 'text', default: '' },
			{ name: 'searchable', label: 'Searchable', type: 'boolean', default: true },
			{ name: 'clearable', label: 'Clearable', type: 'boolean', default: true },
			{ name: 'vertical', label: 'Vertical (buttons/radio/checkbox)', type: 'boolean', default: false },
			{ name: 'labelType', label: 'Label type', type: 'select', default: 'stacked', options: LABEL_TYPE_OPTIONS },
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-select-bg', label: 'Background (dropdown)', type: 'color', default: '#ffffff' },
			{ name: '--hub-select-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-select-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-select-focus-border-color', label: 'Focus border', type: 'color', default: '#0d6efd' },
			{
				name: '--hub-select-option-selected-bg',
				label: 'Selected option bg (open dropdown)',
				type: 'color',
				default: '#0d6efd'
			},
			{
				name: '--hub-select-option-marked-bg',
				label: 'Highlighted option bg (open dropdown)',
				type: 'color',
				default: '#f1f3f5'
			},
			{ name: '--hub-select-value-bg', label: 'Chip background (multiple)', type: 'color', default: '#f8f9fa' },
			{
				name: '--hub-select-group-addon-bg',
				label: 'Addon background (prepend/append)',
				type: 'color',
				default: '#f8f9fa'
			},
			{ name: '--hub-select-group-addon-color', label: 'Addon text (prepend/append)', type: 'color', default: '#6c757d' },
			{ name: '--hub-select-button-bg', label: 'Button bg (buttons format)', type: 'color', default: '#ffffff' },
			{ name: '--hub-select-button-color', label: 'Button text (buttons format)', type: 'color', default: '#212529' },
			{
				name: '--hub-select-button-border-color',
				label: 'Button border (buttons format)',
				type: 'color',
				default: '#dee2e6'
			},
			{
				name: '--hub-select-button-selected-bg',
				label: 'Selected button bg (buttons format)',
				type: 'color',
				default: '#0d6efd'
			},
			{
				name: '--hub-select-button-selected-color',
				label: 'Selected button text (buttons format)',
				type: 'color',
				default: '#ffffff'
			}
		]
	},
	{
		id: 'slider',
		title: 'Slider',
		tag: 'hub-slider',
		description: 'A range input. Enable "range" for a dual-thumb slider whose value becomes a [lower, upper] tuple.',
		component: HubSliderComponent,
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Volume' },
			{ name: 'min', label: 'Min', type: 'number', default: 0 },
			{ name: 'max', label: 'Max', type: 'number', default: 100 },
			{ name: 'step', label: 'Step', type: 'number', default: 1, min: 1 },
			{ name: 'range', label: 'Dual-thumb range', type: 'boolean', default: false },
			{ name: 'showValue', label: 'Show value', type: 'boolean', default: true },
			{ name: 'labelType', label: 'Label type', type: 'select', default: 'stacked', options: LABEL_TYPE_OPTIONS },
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-slider-track-bg', label: 'Track color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-slider-track-fill-bg', label: 'Fill color', type: 'color', default: '#0d6efd' },
			{ name: '--hub-slider-thumb-bg', label: 'Thumb color', type: 'color', default: '#0d6efd' },
			{ name: '--hub-slider-track-height', label: 'Track height', type: 'text', default: '0.375rem' },
			{ name: '--hub-slider-thumb-width', label: 'Thumb width', type: 'text', default: '1.1rem' },
			{ name: '--hub-slider-thumb-height', label: 'Thumb height', type: 'text', default: '1.1rem' }
		]
	},
	{
		id: 'textarea',
		title: 'Textarea',
		tag: 'hub-textarea',
		description: 'A multiline field with optional auto-resize and a character counter.',
		component: HubTextareaComponent,
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Bio' },
			{ name: 'placeholder', label: 'Placeholder', type: 'text', default: 'Tell us about yourself' },
			{ name: 'rows', label: 'Rows', type: 'number', default: 4, min: 1 },
			{ name: 'maxlength', label: 'Max length', type: 'number', default: 200, min: 0 },
			{ name: 'autoresize', label: 'Auto-resize', type: 'boolean', default: false },
			{ name: 'counter', label: 'Character counter', type: 'boolean', default: false },
			{ name: 'readonly', label: 'Read-only', type: 'boolean', default: false },
			{ name: 'labelType', label: 'Label type', type: 'select', default: 'stacked', options: LABEL_TYPE_OPTIONS },
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-input-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-input-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-input-focus-border-color', label: 'Focus border', type: 'color', default: '#0d6efd' },
			{ name: '--hub-textarea-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-textarea-padding-x', label: 'Padding X', type: 'text', default: '0.75rem' },
			{ name: '--hub-textarea-padding-y', label: 'Padding Y', type: 'text', default: '0.375rem' },
			{ name: '--hub-textarea-min-height', label: 'Min height', type: 'text', default: '4.5rem' }
		]
	},
	{
		id: 'datepicker',
		title: 'Datepicker',
		tag: 'hub-datepicker',
		description:
			'A from-scratch date / time / range picker on native Date + the ng-hub-ui-utils overlay, at any granularity from a year to a second, with full localisation.',
		component: HubDatepickerComponent,
		controls: [
			{ name: 'label', label: 'Label', type: 'text', default: 'Date' },
			{ name: 'placeholder', label: 'Placeholder', type: 'text', default: 'Pick a date' },
			{
				name: 'mode',
				label: 'Mode',
				type: 'select',
				default: 'single',
				options: [
					{ label: 'single', value: 'single' },
					{ label: 'range', value: 'range' }
				]
			},
			{
				name: 'granularity',
				label: 'Granularity',
				type: 'select',
				default: 'day',
				options: [
					{ label: 'year', value: 'year' },
					{ label: 'month', value: 'month' },
					{ label: 'day', value: 'day' },
					{ label: 'hour', value: 'hour' },
					{ label: 'minute', value: 'minute' },
					{ label: 'second', value: 'second' }
				]
			},
			{
				name: 'valueFormat',
				label: 'Value format',
				type: 'select',
				default: 'iso',
				options: [
					{ label: 'iso', value: 'iso' },
					{ label: 'date', value: 'date' },
					{ label: 'timestamp', value: 'timestamp' }
				]
			},
			{
				name: 'minuteStep',
				label: 'Minute step',
				type: 'select',
				default: 5,
				options: [
					{ label: '1', value: 1 },
					{ label: '5', value: 5 },
					{ label: '15', value: 15 },
					{ label: '30', value: 30 }
				]
			},
			{
				name: 'hourFormat',
				label: 'Hour format',
				type: 'select',
				default: '',
				options: [
					{ label: 'from locale', value: '' },
					{ label: '12', value: '12' },
					{ label: '24', value: '24' }
				]
			},
			{
				name: 'locale',
				label: 'Locale',
				type: 'select',
				default: 'en-US',
				options: [
					{ label: 'en-US', value: 'en-US' },
					{ label: 'es-ES', value: 'es-ES' },
					{ label: 'fr-FR', value: 'fr-FR' },
					{ label: 'de-DE', value: 'de-DE' }
				]
			},
			{ name: 'clearable', label: 'Clearable', type: 'boolean', default: true },
			{ name: 'showToday', label: 'Show "Today"', type: 'boolean', default: true },
			{ name: 'closeOnSelect', label: 'Close on select', type: 'boolean', default: true },
			{ name: 'labelType', label: 'Label type', type: 'select', default: 'stacked', options: LABEL_TYPE_OPTIONS },
			{ name: 'disabled', label: 'Disabled', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-input-bg', label: 'Trigger background', type: 'color', default: '#ffffff' },
			{ name: '--hub-input-border-color', label: 'Trigger border', type: 'color', default: '#dee2e6' },
			{ name: '--hub-input-focus-border-color', label: 'Focus border', type: 'color', default: '#0d6efd' },
			{ name: '--hub-input-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{
				name: '--hub-datepicker-icon-width',
				label: 'Icon width',
				type: 'text',
				default: '2.5rem',
				description:
					'Calendar-panel tokens (--hub-daterangepicker-*) live in an overlay outside the preview, so they are themed globally rather than here.'
			}
		]
	}
];
