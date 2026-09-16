import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ScrollBar } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Example demonstrating scrollbar utilities
 */
@Component({
	selector: 'app-scrollbar-utils-example',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div class="examples-container">
			<h4>ScrollBar Service</h4>
			<p class="description">
				The ScrollBar service helps manage scrollbar visibility and compensate for layout shifts when hiding scrollbars
				(e.g., when opening modals).
			</p>

			<h4 class="mt-4">Use Case: Modal Body Lock</h4>
			<p class="description">
				When opening a modal, you typically hide the body scrollbar. The ScrollBar.hide() method handles this
				automatically and returns a reverter function.
			</p>

			<div class="controls">
				<button hubButton color="primary" (click)="simulateModalOpen()" [disabled]="isModalOpen()">
					Simulate Modal Open
				</button>
				<button hubButton color="secondary" (click)="simulateModalClose()" [disabled]="!isModalOpen()">
					Simulate Modal Close
				</button>
			</div>

			<div class="demo-box">
				<p>
					<strong>Status:</strong>
					{{ isModalOpen() ? '🔒 Body scroll hidden (with padding compensation)' : '🔓 Normal scrolling' }}
				</p>
			</div>

			<h4 class="mt-4">Code Example</h4>
			<pre class="code-block"><code>{{ usageCode }}</code></pre>
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
		.btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		.demo-box {
			border: 2px solid var(--hub-sys-border-color-default, #dee2e6);
			padding: 1rem;
			border-radius: 8px;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
		}
		.code-block {
			background: #2d2d2d;
			color: #f8f8f2;
			padding: 1rem;
			border-radius: 8px;
			overflow-x: auto;
		}
		.code-block code {
			font-family: 'Fira Code', monospace;
			font-size: 0.875rem;
			white-space: pre;
		}
		h4 {
			color: var(--hub-sys-text-secondary, #495057);
			margin-bottom: 0.75rem;
		}
		.mt-4 {
			margin-top: 1.5rem;
		}
	`
})
export class ScrollbarUtilsExampleComponent {
	private scrollBar = inject(ScrollBar);
	private revertScrollbar: (() => void) | null = null;

	isModalOpen = signal(false);

	usageCode = `import { inject } from '@angular/core';
import { ScrollBar } from 'ng-hub-ui-utils';

export class ModalService {
  private scrollBar = inject(ScrollBar);
  private revertScrollbar: (() => void) | null = null;

  openModal() {
    // Hide scrollbar and get reverter function
    this.revertScrollbar = this.scrollBar.hide();
  }

  closeModal() {
    // Restore scrollbar
    if (this.revertScrollbar) {
      this.revertScrollbar();
      this.revertScrollbar = null;
    }
  }
}`;

	/**
	 * Simulates opening a modal by hiding the scrollbar and storing the revert
	 * callback for later restoration.
	 */
	simulateModalOpen(): void {
		this.revertScrollbar = this.scrollBar.hide();
		this.isModalOpen.set(true);
	}

	/**
	 * Simulates closing a modal by restoring the scrollbar through the stored
	 * revert callback.
	 */
	simulateModalClose(): void {
		if (this.revertScrollbar) {
			this.revertScrollbar();
			this.revertScrollbar = null;
		}
		this.isModalOpen.set(false);
	}

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<!-- The ScrollBar service handles body styles automatically -->
<button (click)="openModal()">Open Modal</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { ScrollBar } from 'ng-hub-ui-utils';

@Component({
  selector: 'app-modal',
  template: \`
    <button (click)="open()">Open Modal</button>
    <button (click)="close()">Close Modal</button>
  \`
})
export class ModalComponent {
  private scrollBar = inject(ScrollBar);
  private revertScrollbar: (() => void) | null = null;

  open() {
    // Hide body scrollbar and compensate padding
    this.revertScrollbar = this.scrollBar.hide();
    // Show your modal...
  }

  close() {
    // Restore body scrollbar
    if (this.revertScrollbar) {
      this.revertScrollbar();
      this.revertScrollbar = null;
    }
  }
}`;
}
