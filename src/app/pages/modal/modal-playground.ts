import { PlaygroundConfig } from '../../shared/playground/playground.interface';
import { ModalPreviewComponent } from './modal-preview.component';

/**
 * Interactive playground definition for the ng-hub-ui-modal documentation page.
 *
 * The real modal opens through `HubModal` into a body-level overlay, which cannot
 * be embedded in a static inline playground. This config drives
 * {@link ModalPreviewComponent}, a thin SSR-safe wrapper that renders only the
 * modal's visual surface (dialog, header, body, footer, close) so the visual
 * options and every `--hub-modal-*` token can be explored live. The `tag` is the
 * modal window selector emitted by the library; the generated snippet shows the
 * equivalent `HubModal.open()` options rather than a template binding.
 */
export const MODAL_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'modal',
		title: 'Modal',
		tag: 'hub-modal-window',
		description:
			'A static preview of the modal dialog surface. Tweak the visual options and theme every --hub-modal-* token live; the real dialog is opened with HubModal.open() using the matching options below.',
		component: ModalPreviewComponent,
		controls: [
			{ name: 'title', label: 'Header title', type: 'text', default: 'Confirm action' },
			{
				name: 'body',
				label: 'Body text',
				type: 'text',
				default: 'Are you sure you want to continue? This action cannot be undone.'
			},
			{
				name: 'size',
				label: 'Size',
				type: 'select',
				default: 'default',
				options: [
					{ label: 'default', value: 'default' },
					{ label: 'sm', value: 'sm' },
					{ label: 'lg', value: 'lg' },
					{ label: 'xl', value: 'xl' }
				]
			},
			{
				name: 'placement',
				label: 'Placement',
				type: 'select',
				default: 'center',
				options: [
					{ label: 'center', value: 'center' },
					{ label: 'start', value: 'start' },
					{ label: 'end', value: 'end' },
					{ label: 'top', value: 'top' },
					{ label: 'bottom', value: 'bottom' }
				]
			},
			{ name: 'centered', label: 'Vertically centered', type: 'boolean', default: false },
			{ name: 'scrollable', label: 'Scrollable body', type: 'boolean', default: false },
			{ name: 'fullscreen', label: 'Fullscreen', type: 'boolean', default: false },
			{ name: 'showHeader', label: 'Show header', type: 'boolean', default: true },
			{ name: 'showFooter', label: 'Show footer', type: 'boolean', default: true }
		],
		cssVariables: [
			{ name: '--hub-modal-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-modal-color', label: 'Text color', type: 'color', default: '#212529' },
			{ name: '--hub-modal-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-modal-border-width', label: 'Border width', type: 'text', default: '1px' },
			{ name: '--hub-modal-border-radius', label: 'Border radius', type: 'text', default: '0.5rem' },
			{ name: '--hub-modal-box-shadow', label: 'Box shadow', type: 'text', default: '0 1rem 3rem rgba(0, 0, 0, 0.175)' },
			{ name: '--hub-modal-padding-y', label: 'Padding Y', type: 'text', default: '1rem' },
			{ name: '--hub-modal-padding-x', label: 'Padding X', type: 'text', default: '1rem' },
			{ name: '--hub-modal-header-border-color', label: 'Header border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-modal-title-font-size', label: 'Title font size', type: 'text', default: '1.25rem' },
			{ name: '--hub-modal-title-font-weight', label: 'Title font weight', type: 'text', default: '500' },
			{ name: '--hub-modal-footer-bg', label: 'Footer background', type: 'color', default: '#ffffff' },
			{ name: '--hub-modal-footer-border-color', label: 'Footer border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-modal-footer-gap', label: 'Footer gap', type: 'text', default: '0.5rem' },
			{ name: '--hub-modal-close-opacity', label: 'Close opacity', type: 'text', default: '0.5' }
		],
		codeTemplate: (inputs) => {
			const options: string[] = [];
			if (inputs['size'] !== 'default') options.push(`size: '${inputs['size']}'`);
			if (inputs['placement'] !== 'center')
				options.push(`placement: HubModalPlacement.${capitalize(String(inputs['placement']))}`);
			if (inputs['centered']) options.push('centered: true');
			if (inputs['scrollable']) options.push('scrollable: true');
			if (inputs['fullscreen']) options.push('fullscreen: true');

			const optionsCode = options.length ? `, {\n\t${options.join(',\n\t')}\n}` : '';
			return `this.modal.open(MyDialogComponent${optionsCode});`;
		}
	}
];

/** Upper-cases the first character of a string (used to build HubModalPlacement enum keys). */
function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
