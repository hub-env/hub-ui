import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import {
	HubSidePanelComponent,
	HubSidePanelContainerComponent,
	HubSidePanelMode,
	HubSidePanelPosition
} from 'ng-hub-ui-panels';

/**
 * Non-modal side panel example. An assistant docks beside an invoice draft (`side`) or floats over
 * its edge (`over`); in both modes the draft stays editable and scrollable while the assistant is
 * open, which is the difference from a modal offcanvas. Messages sent in the panel survive closing
 * and reopening it, because closing hides the content instead of destroying it. The "Rendered as"
 * readout shows the breakpoint fallback at work when the demo is narrower than 768px.
 */
@Component({
	selector: 'app-side-panel-panels-example',
	standalone: true,
	imports: [HubButtonComponent, HubSidePanelContainerComponent, HubSidePanelComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="d-flex flex-wrap align-items-center gap-2">
				<button
					type="button"
					hubButton
					size="sm"
					aria-controls="side-panel-example-assistant"
					[attr.aria-expanded]="open()"
					(click)="assistant.toggle()"
				>
					{{ open() ? 'Close assistant' : 'Open assistant' }}
				</button>
				<div class="d-flex gap-1" role="group" aria-label="Mode">
					@for (option of modes; track option) {
						<button
							type="button"
							hubButton
							size="sm"
							color="secondary"
							[variant]="mode() === option ? 'solid' : 'outline'"
							[attr.aria-pressed]="mode() === option"
							(click)="mode.set(option)"
						>
							{{ option }}
						</button>
					}
				</div>
				<div class="d-flex gap-1" role="group" aria-label="Position">
					@for (option of positions; track option) {
						<button
							type="button"
							hubButton
							size="sm"
							color="secondary"
							[variant]="position() === option ? 'solid' : 'outline'"
							[attr.aria-pressed]="position() === option"
							(click)="position.set(option)"
						>
							{{ option }}
						</button>
					}
				</div>
				<span class="small text-secondary">
					Rendered as <code>{{ assistant.effectiveMode() }}</code>
				</span>
			</div>

			<hub-side-panel-container class="border rounded" style="block-size: 22rem">
				<div class="p-3">
					<h5 class="mb-1">Invoice draft</h5>
					<p class="small text-secondary">
						The page stays usable while the assistant is open: edit the field, scroll, select text.
					</p>
					<label class="form-label small" for="side-panel-example-customer">Customer</label>
					<input
						id="side-panel-example-customer"
						class="form-control form-control-sm mb-3"
						[value]="customer()"
						(input)="onCustomerInput($event)"
					/>
					@for (line of lines; track line) {
						<p class="small mb-2">{{ line }}</p>
					}
				</div>

				<hub-side-panel
					#assistant
					id="side-panel-example-assistant"
					ariaLabel="Assistant"
					autoFocus
					[(open)]="open"
					[mode]="mode()"
					[position]="position()"
				>
					<div hubSidePanelHeader class="d-flex align-items-center justify-content-between gap-2">
						<strong>Assistant</strong>
						<button
							type="button"
							hubButton
							size="sm"
							color="secondary"
							variant="outline"
							(click)="assistant.close()"
						>
							Close
						</button>
					</div>
					@for (message of messages(); track $index) {
						<p class="small mb-2">{{ message }}</p>
					}
					<form hubSidePanelFooter class="d-flex gap-2" (submit)="send($event)">
						<input
							class="form-control form-control-sm"
							aria-label="Message"
							placeholder="Ask something…"
							autofocus
							[value]="draft()"
							(input)="onDraftInput($event)"
						/>
						<button type="submit" hubButton size="sm">Send</button>
					</form>
				</hub-side-panel>
			</hub-side-panel-container>
		</div>
	`
})
export class SidePanelPanelsExampleComponent {
	protected readonly modes: HubSidePanelMode[] = ['side', 'over'];
	protected readonly positions: HubSidePanelPosition[] = ['end', 'start'];

	/** Invoice lines long enough to make the page scroll inside the container. */
	protected readonly lines = [
		'Consulting — 8 h × €60.00',
		'Design review — 3 h × €75.00',
		'Hosting, September — €19.00',
		'Domain renewal — €12.00',
		'Support plan — €45.00',
		'Travel — €38.50',
		'Training session — 2 h × €60.00',
		'Licence, annual — €240.00'
	];

	protected readonly open = signal(false);
	protected readonly mode = signal<HubSidePanelMode>('side');
	protected readonly position = signal<HubSidePanelPosition>('end');
	protected readonly customer = signal('Acme Ltd.');
	protected readonly draft = signal('');
	protected readonly messages = signal<string[]>(['Hi! Ask me to fill in any field of this invoice.']);

	protected onCustomerInput(event: Event): void {
		this.customer.set((event.target as HTMLInputElement).value);
	}

	protected onDraftInput(event: Event): void {
		this.draft.set((event.target as HTMLInputElement).value);
	}

	/** Appends the draft to the thread; the thread outlives closing the panel. */
	protected send(event: Event): void {
		event.preventDefault();
		const text = this.draft().trim();
		if (!text) {
			return;
		}
		this.messages.update((messages) => [...messages, text]);
		this.draft.set('');
	}

	static readonly templateCode = `<hub-side-panel-container style="block-size: 22rem">
  <div class="p-3">…the page stays usable…</div>

  <hub-side-panel #assistant ariaLabel="Assistant" autoFocus
    [(open)]="open" [mode]="mode()" [position]="position()">
    <div hubSidePanelHeader>
      <strong>Assistant</strong>
      <button type="button" (click)="assistant.close()">Close</button>
    </div>

    @for (message of messages(); track $index) { <p>{{ message }}</p> }

    <form hubSidePanelFooter (submit)="send($event)">
      <input aria-label="Message" autofocus [value]="draft()" (input)="onDraftInput($event)" />
      <button type="submit">Send</button>
    </form>
  </hub-side-panel>
</hub-side-panel-container>

<button type="button" (click)="assistant.toggle()">Toggle assistant</button>
<span>Rendered as {{ assistant.effectiveMode() }}</span>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  HubSidePanelComponent,
  HubSidePanelContainerComponent,
  HubSidePanelMode,
  HubSidePanelPosition
} from 'ng-hub-ui-panels';

@Component({
  selector: 'app-side-panel-panels-example',
  imports: [HubSidePanelContainerComponent, HubSidePanelComponent],
  templateUrl: './side-panel-panels-example.component.html'
})
export class SidePanelPanelsExampleComponent {
  protected readonly open = signal(false);
  protected readonly mode = signal<HubSidePanelMode>('side');
  protected readonly position = signal<HubSidePanelPosition>('end');
  protected readonly draft = signal('');
  protected readonly messages = signal<string[]>(['Hi! Ask me to fill in any field of this invoice.']);

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected send(event: Event): void {
    event.preventDefault();
    const text = this.draft().trim();
    if (text) {
      this.messages.update((messages) => [...messages, text]);
      this.draft.set('');
    }
  }
}`;
}
