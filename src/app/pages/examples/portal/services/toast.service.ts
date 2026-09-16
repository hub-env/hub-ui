import { Injectable, inject, Injector } from '@angular/core';
import { HubPortal, HubPortalRef } from 'ng-hub-ui-portal';
import { ToastComponent, ToastData } from '../components/toast.component';

export type { ToastConfig } from './toast.service.model';
import type { ToastConfig } from './toast.service.model';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	private portal = inject(HubPortal);
	private injector = inject(Injector);
	private toasts: Map<string, HubPortalRef> = new Map();
	private toastCounter = 0;

	/**
	 * Shows a success toast.
	 *
	 * @param title - Toast title text.
	 * @param message - Toast message body.
	 * @param config - Optional toast configuration overrides.
	 * @returns The reference to the opened toast portal.
	 */
	success(title: string, message: string, config?: ToastConfig): HubPortalRef {
		return this.show('success', title, message, config);
	}

	/**
	 * Shows an error toast.
	 *
	 * @param title - Toast title text.
	 * @param message - Toast message body.
	 * @param config - Optional toast configuration overrides.
	 * @returns The reference to the opened toast portal.
	 */
	error(title: string, message: string, config?: ToastConfig): HubPortalRef {
		return this.show('error', title, message, config);
	}

	/**
	 * Shows a warning toast.
	 *
	 * @param title - Toast title text.
	 * @param message - Toast message body.
	 * @param config - Optional toast configuration overrides.
	 * @returns The reference to the opened toast portal.
	 */
	warning(title: string, message: string, config?: ToastConfig): HubPortalRef {
		return this.show('warning', title, message, config);
	}

	/**
	 * Shows an informational toast.
	 *
	 * @param title - Toast title text.
	 * @param message - Toast message body.
	 * @param config - Optional toast configuration overrides.
	 * @returns The reference to the opened toast portal.
	 */
	info(title: string, message: string, config?: ToastConfig): HubPortalRef {
		return this.show('info', title, message, config);
	}

	/**
	 * Opens a toast portal of the given severity, positions it relative to the
	 * existing toasts and wires up cleanup when it is hidden.
	 *
	 * @param type - Severity of the toast to display.
	 * @param title - Toast title text.
	 * @param message - Toast message body.
	 * @param config - Optional toast configuration overrides.
	 * @returns The reference to the opened toast portal.
	 */
	private show(type: ToastData['type'], title: string, message: string, config?: ToastConfig): HubPortalRef {
		const toastId = `toast-${++this.toastCounter}`;
		const position = config?.position || 'top-right';
		const duration = config?.duration ?? 5000;

		// Calculate position based on existing toasts
		const existingToastsCount = Array.from(this.toasts.values()).filter((t) => !t.hidden).length;
		const offset = existingToastsCount * 80; // 80px spacing between toasts

		const positionStyles = this.getPositionStyles(position, offset);

		const portalRef = this.portal.open(ToastComponent, {
			windowClass: `toast-portal ${config?.windowClass || ''}`,
			container: 'body',
			injector: this.createToastInjector(type, title, message, duration)
		});

		// Apply positioning styles
		if (portalRef.componentInstance) {
			const toastElement = (portalRef.componentInstance as any)._elementRef?.nativeElement?.parentElement;
			if (toastElement) {
				Object.assign(toastElement.style, {
					position: 'fixed',
					zIndex: '1060',
					...positionStyles
				});
			}
		}

		this.toasts.set(toastId, portalRef);

		// Clean up when toast is hidden
		portalRef.hidden.subscribe(() => {
			this.toasts.delete(toastId);
			this.repositionToasts(position);
		});

		return portalRef;
	}

	/**
	 * Creates a child injector used to provide toast data to the portal content.
	 *
	 * @param _type - Severity of the toast.
	 * @param _title - Toast title text.
	 * @param _message - Toast message body.
	 * @param _duration - Auto-dismiss delay in milliseconds.
	 * @returns A child injector parented to the service injector.
	 */
	private createToastInjector(_type: ToastData['type'], _title: string, _message: string, _duration: number): Injector {
		return Injector.create({
			providers: [],
			parent: this.injector
		});
	}

	/**
	 * Computes the CSS positioning styles for a toast anchored at the given
	 * corner and vertical offset.
	 *
	 * @param position - The screen corner where the toast is anchored.
	 * @param offset - Vertical offset in pixels applied to stack multiple toasts.
	 * @returns A partial style object with the resolved edge coordinates.
	 */
	private getPositionStyles(position: string, offset: number) {
		switch (position) {
			case 'top-right':
				return { top: `${20 + offset}px`, right: '20px' };
			case 'top-left':
				return { top: `${20 + offset}px`, left: '20px' };
			case 'bottom-right':
				return { bottom: `${20 + offset}px`, right: '20px' };
			case 'bottom-left':
				return { bottom: `${20 + offset}px`, left: '20px' };
			default:
				return { top: `${20 + offset}px`, right: '20px' };
		}
	}

	/**
	 * Recomputes and applies stacking offsets for all currently visible toasts
	 * after one has been removed.
	 *
	 * @param position - The screen corner where the toasts are anchored.
	 */
	private repositionToasts(position: string) {
		// Reposition remaining toasts
		let index = 0;
		this.toasts.forEach((portalRef) => {
			const toastElement = (portalRef.componentInstance as any)._elementRef?.nativeElement?.parentElement;
			if (toastElement) {
				const offset = index * 80;
				const positionStyles = this.getPositionStyles(position, offset);
				Object.assign(toastElement.style, positionStyles);
				index++;
			}
		});
	}

	/**
	 * Closes every tracked toast portal and clears the internal registry.
	 */
	clear(): void {
		this.toasts.forEach((portalRef) => portalRef.close());
		this.toasts.clear();
	}

	/**
	 * Returns the portal references for all currently tracked toasts.
	 *
	 * @returns An array of active toast portal references.
	 */
	getActiveToasts(): HubPortalRef[] {
		return Array.from(this.toasts.values());
	}
}
