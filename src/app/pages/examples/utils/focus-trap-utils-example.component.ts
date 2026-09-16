import { Component, ElementRef, inject, NgZone, OnDestroy, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { getFocusableBoundaryElements, hubFocusTrap } from 'ng-hub-ui-utils';
import { Subject } from 'rxjs';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Example demonstrating focus trap functionality
 */
@Component({
	selector: 'app-focus-trap-utils-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div class="examples-container">
			<h4>Focus Trap Demo</h4>
			<p class="description">
				Click "Enable Focus Trap" and try to Tab outside the blue box. Focus will stay trapped inside.
			</p>

			<div class="controls">
				<button hubButton color="primary" (click)="enableFocusTrap()" [disabled]="isFocusTrapActive()">
					Enable Focus Trap
				</button>
				<button hubButton color="secondary" (click)="disableFocusTrap()" [disabled]="!isFocusTrapActive()">
					Disable Focus Trap
				</button>
			</div>

			<div #trapContainer class="trap-container" [class.active]="isFocusTrapActive()">
				<h5>Focus Trap Area</h5>
				<input type="text" placeholder="First input" class="form-control mb-2" />
				<input type="text" placeholder="Second input" class="form-control mb-2" />
				<button hubButton variant="outline" color="primary" class="me-2">Button 1</button>
				<button hubButton variant="outline" color="secondary">Button 2</button>
				<p class="mt-2 status">Status: {{ isFocusTrapActive() ? '🔒 Trapped' : '🔓 Free' }}</p>
			</div>

			<h4 class="mt-4">Focusable Elements</h4>
			<p class="description">The selector <code>FOCUSABLE_ELEMENTS_SELECTOR</code> finds all focusable elements.</p>
			<div class="example-row">
				<code>getFocusableBoundaryElements(container)</code>
				<span class="result">→ [first, last] elements</span>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.examples-container {
			padding: 1rem;
		}
		.description {
			color: var(--hub-sys-text-muted, #6c757d);
			margin-bottom: 1rem;
		}
		.controls {
			margin-bottom: 1rem;
			display: flex;
			gap: 0.5rem;
		}
		.btn {
			padding: 0.5rem 1rem;
			border-radius: 4px;
			cursor: pointer;
			border: 1px solid;
		}
		.btn-primary {
			background: #007bff;
			color: white;
			border-color: #007bff;
		}
		.btn-secondary {
			background: #6c757d;
			color: white;
			border-color: var(--hub-sys-text-muted, #6c757d);
		}
		.btn-outline-primary {
			background: transparent;
			color: #007bff;
			border-color: #007bff;
		}
		.btn-outline-secondary {
			background: transparent;
			color: var(--hub-sys-text-muted, #6c757d);
			border-color: var(--hub-sys-text-muted, #6c757d);
		}
		.btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		.trap-container {
			border: 2px dashed var(--hub-sys-border-color-default, #dee2e6);
			padding: 1rem;
			border-radius: 8px;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			transition: all 0.3s;
		}
		.trap-container.active {
			border-color: #007bff;
			background: #e7f1ff;
		}
		.form-control {
			display: block;
			width: 100%;
			padding: 0.5rem;
			border: 1px solid var(--hub-sys-border-color-default, #ced4da);
			border-radius: 4px;
		}
		.mb-2 {
			margin-bottom: 0.5rem;
		}
		.mt-2 {
			margin-top: 0.5rem;
		}
		.mt-4 {
			margin-top: 1.5rem;
		}
		.me-2 {
			margin-right: 0.5rem;
		}
		.status {
			font-weight: 500;
		}
		.example-row {
			display: flex;
			gap: 1rem;
			align-items: center;
			padding: 0.5rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 4px;
		}
		.example-row code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.25rem 0.5rem;
			border-radius: 4px;
		}
		.result {
			color: #28a745;
			font-weight: 500;
		}
		h4,
		h5 {
			color: var(--hub-sys-text-secondary, #495057);
		}
	`
})
export class FocusTrapUtilsExampleComponent implements OnDestroy {
	private zone = inject(NgZone);
	private stopFocusTrap$ = new Subject<void>();

	trapContainer = viewChild<ElementRef<HTMLElement>>('trapContainer');
	isFocusTrapActive = signal(false);

	/**
	 * Activates the focus trap on the demo container and moves focus to its
	 * first focusable element.
	 */
	enableFocusTrap(): void {
		const container = this.trapContainer()?.nativeElement;
		if (container) {
			this.isFocusTrapActive.set(true);
			hubFocusTrap(this.zone, container, this.stopFocusTrap$);

			// Focus first element
			const [first] = getFocusableBoundaryElements(container);
			first?.focus();
		}
	}

	/**
	 * Deactivates the active focus trap by completing the stop notifier stream.
	 */
	disableFocusTrap(): void {
		this.stopFocusTrap$.next();
		this.isFocusTrapActive.set(false);
	}

	/**
	 * Cleans up the focus trap subscription when the component is destroyed.
	 */
	ngOnDestroy(): void {
		this.stopFocusTrap$.next();
		this.stopFocusTrap$.complete();
	}

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<div #trapContainer class="modal-content">
  <input type="text" placeholder="First input">
  <input type="text" placeholder="Second input">
  <button>Save</button>
  <button (click)="close()">Cancel</button>
</div>`;

	static readonly componentCode = `import { Component, ElementRef, inject, NgZone, OnDestroy, viewChild } from '@angular/core';
import { hubFocusTrap, getFocusableBoundaryElements } from 'ng-hub-ui-utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  template: \`
    <div #trapContainer class="modal-content">
      <input type="text" placeholder="First input">
      <button>Save</button>
      <button (click)="close()">Cancel</button>
    </div>
  \`
})
export class ModalComponent implements OnDestroy {
  private zone = inject(NgZone);
  private stopFocusTrap$ = new Subject<void>();
  
  trapContainer = viewChild<ElementRef>('trapContainer');

  ngAfterViewInit() {
    const container = this.trapContainer()?.nativeElement;
    if (container) {
      // Enable focus trap
      hubFocusTrap(this.zone, container, this.stopFocusTrap$);
      
      // Focus first element
      const [first] = getFocusableBoundaryElements(container);
      first?.focus();
    }
  }

  close() {
    this.stopFocusTrap$.next(); // Disable trap
  }

  ngOnDestroy() {
    this.stopFocusTrap$.next();
    this.stopFocusTrap$.complete();
  }
}`;
}
