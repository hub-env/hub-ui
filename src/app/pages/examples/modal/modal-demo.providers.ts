import { Provider } from '@angular/core';
import { HubModalConfig } from '../../../../../projects/modal/src/public-api';
import type { ModalExampleContent } from './modal-demo.model';

export type { ModalExampleContent } from './modal-demo.model';

/**
 * Configuration object for modal examples with demo-specific settings
 */
export const DEMO_MODAL_CONFIG: Partial<HubModalConfig> = {
	animation: true,
	backdrop: true,
	keyboard: true,
	centered: false
};

/**
 * Provides a component-scoped HubModalConfig for modal examples
 */
export function provideExampleModalConfig(config?: Partial<HubModalConfig>): Provider {
	return {
		provide: HubModalConfig,
		useFactory: () => ({ ...DEMO_MODAL_CONFIG, ...config })
	};
}

export const EXAMPLE_MODAL_CONTENTS: Record<string, ModalExampleContent> = {
	basic: {
		title: 'Basic Modal',
		body: 'This is a basic modal example with simple content.',
		type: 'info'
	},
	confirmation: {
		title: 'Confirm Action',
		body: 'Are you sure you want to perform this action? This operation cannot be undone.',
		type: 'warning'
	},
	error: {
		title: 'Error',
		body: 'An unexpected error has occurred. Please try again.',
		type: 'error'
	},
	success: {
		title: 'Success',
		body: 'The operation completed successfully.',
		type: 'success'
	}
};
