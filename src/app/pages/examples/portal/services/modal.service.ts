import { Injectable, inject, Injector } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { ModalComponent, ModalData } from '../components/modal.component';

export type { ModalConfig } from './modal.service.model';
import type { ModalConfig } from './modal.service.model';

@Injectable({
	providedIn: 'root'
})
export class ModalService {
	private portal = inject(HubPortal);
	private injector = inject(Injector);

	/**
	 * Opens a confirmation modal and resolves with the portal result.
	 *
	 * @param title - Text rendered in the modal header.
	 * @param content - HTML content rendered in the modal body.
	 * @param config - Optional portal configuration overrides.
	 * @returns A promise resolving with the confirmation result or rejecting on dismissal.
	 */
	openConfirmDialog(title: string, content: string, config?: ModalConfig): Promise<any> {
		const portalRef = this.portal.open(ModalComponent, {
			windowClass: `modal-portal ${config?.windowClass || ''}`,
			scrollable: config?.scrollable ?? false,
			keyboard: config?.keyboard ?? true,
			container: config?.container || 'body',
			injector: this.createModalInjector({
				type: 'confirm',
				title,
				content
			})
		});

		// Listen for confirmation
		if (portalRef.componentInstance) {
			portalRef.componentInstance.confirmed.subscribe(() => {
				portalRef.close('confirmed');
			});
		}

		return portalRef.result;
	}

	/**
	 * Opens a custom-content modal and returns its portal reference.
	 *
	 * @param title - Text rendered in the modal header.
	 * @param content - HTML content rendered in the modal body.
	 * @param config - Optional portal configuration overrides.
	 * @returns The reference to the opened portal.
	 */
	openCustomModal(title: string, content: string, config?: ModalConfig): HubPortalRef {
		return this.portal.open(ModalComponent, {
			windowClass: `modal-portal ${config?.windowClass || ''}`,
			scrollable: config?.scrollable ?? false,
			keyboard: config?.keyboard ?? true,
			container: config?.container || 'body',
			injector: this.createModalInjector({
				type: 'custom',
				title,
				content
			})
		});
	}

	/**
	 * Opens a fullscreen modal and returns its portal reference.
	 *
	 * @param title - Text rendered in the modal header.
	 * @param content - HTML content rendered in the modal body.
	 * @param config - Optional portal configuration overrides.
	 * @returns The reference to the opened portal.
	 */
	openFullscreenModal(title: string, content: string, config?: ModalConfig): HubPortalRef {
		return this.portal.open(ModalComponent, {
			windowClass: `modal-portal ${config?.windowClass || ''}`,
			scrollable: config?.scrollable ?? true,
			keyboard: config?.keyboard ?? true,
			container: config?.container || 'body',
			injector: this.createModalInjector({
				type: 'fullscreen',
				title,
				content
			})
		});
	}

	/**
	 * Creates a child injector used to provide modal data to the portal content.
	 *
	 * @param _data - The modal data payload to associate with the portal.
	 * @returns A child injector parented to the service injector.
	 */
	private createModalInjector(_data: ModalData): Injector {
		return Injector.create({
			providers: [],
			parent: this.injector
		});
	}

	/**
	 * Dismisses every open modal portal managed by the underlying portal service.
	 */
	closeAll(): void {
		this.portal.dismissAll('service_close_all');
	}
}
