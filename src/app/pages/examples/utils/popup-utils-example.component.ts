import { ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, signal, viewChild } from '@angular/core';
import { PopupService } from 'ng-hub-ui-utils';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The window `PopupService` instantiates.
 *
 * The service toggles `show` on this host to drive the open and close transitions, so the
 * fade belongs here rather than in the page that opens it: a window styled from the outside
 * would fade only for whoever remembered to write the rule.
 */
@Component({
	selector: 'app-utils-popup-window',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="popup-window__body">
			<ng-content />
		</div>
	`,
	styles: `
		:host {
			display: block;
			margin-top: 0.75rem;
			opacity: 0;
			transform: translateY(-0.35rem);
			transition:
				opacity 220ms ease,
				transform 220ms ease;
		}
		:host(.show) {
			opacity: 1;
			transform: none;
		}
		.popup-window__body {
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.5rem;
			background: var(--hub-sys-surface-elevated, #fff);
			padding: 0.75rem 1rem;
		}
	`
})
export class PopupWindowUtilsExampleComponent {}

/**
 * `PopupService<T>` opening a window component from TypeScript, with either a string or a
 * `TemplateRef` as its content.
 *
 * The service resolves `ViewContainerRef` from whoever constructs it, which is why it is
 * built in a field initializer: the window is created as the next sibling of this host, not
 * appended to the body. Both halves of its contract are worth watching in the status line —
 * `open()` hands back a `transition$` that completes once the window is on screen, and
 * `close()` only destroys the window and its content view after the fade has finished.
 */
@Component({
	selector: 'app-utils-popup-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-2 mb-3">
			<button type="button" hubButton color="primary" [disabled]="isOpen()" (click)="openText()">
				Open with a string
			</button>
			<button type="button" hubButton variant="outline" color="primary" [disabled]="isOpen()" (click)="openTemplate()">
				Open with a TemplateRef
			</button>
			<button type="button" hubButton variant="outline" color="secondary" [disabled]="!isOpen()" (click)="close()">
				Close
			</button>
		</div>

		<p class="small text-muted mb-0 font-monospace">{{ status() }}</p>

		<ng-template #richContent>
			<strong>Rendered from a TemplateRef.</strong>
			<span class="text-muted"> Its embedded view is attached to the application and destroyed with the window.</span>
		</ng-template>
	`,
	styles: []
})
export class PopupUtilsExampleComponent implements OnDestroy {
	/**
	 * Built here rather than in a method: the service reaches for `ViewContainerRef`,
	 * `Injector` and `NgZone` through `inject()`, so it has to be constructed while this
	 * component's injection context is still open.
	 */
	private readonly popup = new PopupService(PopupWindowUtilsExampleComponent);

	/** The template handed to `open()` in the second demo. */
	private readonly richContent = viewChild.required<TemplateRef<unknown>>('richContent');

	/** Whether a window is currently open, so the buttons cannot fight each other. */
	protected readonly isOpen = signal(false);

	/** What the service is doing, written as the observables it returns resolve. */
	protected readonly status = signal('Nothing open.');

	/** Opens the window with plain text, which the service wraps in a text node. */
	protected openText(): void {
		this.openWith('Opened with a string — PopupService projects it as a text node.');
	}

	/** Opens the window with a template, rendered through an embedded view. */
	protected openTemplate(): void {
		this.openWith(this.richContent());
	}

	/** Closes the window, destroying it only once the fade has run. */
	protected close(): void {
		if (!this.isOpen()) {
			return;
		}

		this.status.set('close(true) called — fading out…');
		this.popup.close(true).subscribe(() => {
			this.isOpen.set(false);
			this.status.set('Closed — the window and its content view were destroyed.');
		});
	}

	/**
	 * A window created through the service outlives this view, because it is attached to the
	 * view container rather than to the template. Closing it without animation destroys it
	 * synchronously.
	 */
	ngOnDestroy(): void {
		this.popup.close().subscribe();
	}

	/** Shared body of both open buttons. */
	private openWith(content: string | TemplateRef<unknown>): void {
		if (this.isOpen()) {
			return;
		}

		this.isOpen.set(true);
		this.status.set('open(content, undefined, true) called — waiting for the show transition…');
		this.popup
			.open(content, undefined, true)
			.transition$.subscribe(() => this.status.set('transition$ completed — the window is on screen.'));
	}

	static readonly templateCode = `<button (click)="open()">Open</button>
<button (click)="close()">Close</button>

<ng-template #richContent>
  <strong>Rendered from a TemplateRef.</strong>
</ng-template>`;

	static readonly componentCode = `import { Component, OnDestroy, TemplateRef, signal, viewChild } from '@angular/core';
import { PopupService } from 'ng-hub-ui-utils';
import { PopupWindowComponent } from './popup-window.component';

@Component({ /* … */ })
export class PopupExampleComponent implements OnDestroy {
  // Built in a field initializer: PopupService resolves ViewContainerRef, Injector and
  // NgZone through inject(), so it needs this component's injection context.
  private readonly popup = new PopupService(PopupWindowComponent);

  private readonly richContent = viewChild.required<TemplateRef<unknown>>('richContent');

  open(): void {
    // Content may be a string or a TemplateRef; the third argument turns the transition on.
    const { windowRef, transition$ } = this.popup.open(this.richContent(), undefined, true);

    // Completes once the 'show' class has finished transitioning on windowRef's host.
    transition$.subscribe(() => console.log('on screen'));
  }

  close(): void {
    // Destroys the window and its content view only after the fade out.
    this.popup.close(true).subscribe();
  }

  ngOnDestroy(): void {
    // The window is attached to the view container, not to the template: close it.
    this.popup.close().subscribe();
  }
}`;
}
