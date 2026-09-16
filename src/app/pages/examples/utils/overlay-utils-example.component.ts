import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	inject,
	TemplateRef,
	viewChild,
	ViewContainerRef
} from '@angular/core';
import { ConnectionPosition, OverlayRef, OverlayService } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the real {@link OverlayService}: a connected, positioned overlay
 * attached to a trigger element with a backdrop that closes it on outside click.
 */
@Component({
	selector: 'app-overlay-utils-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-2">
			<p class="text-muted small mb-1">
				A connected overlay positioned below the trigger, with a backdrop that closes it on outside click.
			</p>
			<div>
				<button #trigger type="button" hubButton color="primary" (click)="toggleOverlay()">
					{{ overlayRef ? 'Close overlay' : 'Open overlay' }}
				</button>
			</div>
		</div>

		<ng-template #overlayContent>
			<div class="overlay-panel">
				<strong>Overlay content</strong>
				<p class="mb-0 text-muted small">Positioned with <code>flexibleConnectedTo</code>.</p>
			</div>
		</ng-template>
	`,
	styles: [
		`
			.overlay-panel {
				min-width: 14rem;
				padding: 0.75rem 1rem;
				background: var(--hub-sys-surface-page, #fff);
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: 0.5rem;
				box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
			}
		`
	]
})
export class OverlayUtilsExampleComponent {
	private readonly overlay = inject(OverlayService);
	private readonly viewContainerRef = inject(ViewContainerRef);

	protected readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
	protected readonly overlayContent = viewChild.required<TemplateRef<unknown>>('overlayContent');

	/** Active overlay reference, or `null` when closed. */
	protected overlayRef: OverlayRef | null = null;

	/** Connection points: drop the overlay below the trigger, left-aligned. */
	private readonly positions: ConnectionPosition[] = [
		{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
	];

	/** Opens the overlay when closed, closes it when open. */
	protected toggleOverlay(): void {
		if (this.overlayRef) {
			this.closeOverlay();
			return;
		}

		const positionStrategy = this.overlay.position().flexibleConnectedTo(this.trigger()).withPositions(this.positions);

		this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });
		this.overlayRef.onBackdropClick(() => this.closeOverlay());
		this.overlayRef.attach(this.overlayContent(), this.viewContainerRef);
	}

	/** Disposes the overlay and resets the reference. */
	protected closeOverlay(): void {
		this.overlayRef?.dispose();
		this.overlayRef = null;
	}

	static readonly templateCode = `<button #trigger (click)="toggle()">{{ overlayRef ? 'Close' : 'Open' }}</button>

<ng-template #overlayContent>
  <div class="overlay-panel">Overlay content</div>
</ng-template>`;

	static readonly componentCode = `import { Component, ElementRef, inject, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { ConnectionPosition, OverlayRef, OverlayService } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  templateUrl: './overlay-demo.component.html'
})
export class OverlayDemoComponent {
  private overlay = inject(OverlayService);
  private viewContainerRef = inject(ViewContainerRef);

  trigger = viewChild.required<ElementRef>('trigger');
  overlayContent = viewChild.required<TemplateRef<unknown>>('overlayContent');
  overlayRef: OverlayRef | null = null;

  private positions: ConnectionPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }
  ];

  toggle() {
    if (this.overlayRef) {
      this.close();
      return;
    }
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.trigger())
      .withPositions(this.positions);

    this.overlayRef = this.overlay.create({ positionStrategy, hasBackdrop: true });
    this.overlayRef.onBackdropClick(() => this.close());
    this.overlayRef.attach(this.overlayContent(), this.viewContainerRef);
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}`;
}
