/**
 * Type definitions for the inline modal preview.
 *
 * These mirror the visual subset of `HubModalOptions` exposed by
 * `ModalPreviewComponent`, whose implementation lives in
 * `modal-preview.component.ts`.
 */

/**
 * Visual-surface size options exposed by the modal preview.
 *
 * These mirror the visual subset of `HubModalOptions` (size) that can be
 * rendered as a static panel without the overlay/service. Each value maps to a
 * `hub-modal__dialog--{size}` modifier.
 */
export type ModalPreviewSize = 'default' | 'sm' | 'lg' | 'xl';

/**
 * Supported placements for the inline modal preview, matching `HubModalPlacement`.
 */
export type ModalPreviewPlacement = 'center' | 'start' | 'end' | 'top' | 'bottom';
