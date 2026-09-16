import { JsonPipe } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { createHistoryStore } from 'ng-hub-ui-history';

export type { InvoiceLine, ComplexInvoice } from './nested-history-example.component.model';
import type { ComplexInvoice } from './nested-history-example.component.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates nested objects and array mutations with diff patches.
 */
@Component({
	selector: 'app-nested-history-example',
	standalone: true,
	imports: [JsonPipe, HubButtonComponent],
	template: `
		<div class="d-flex flex-wrap gap-2 mb-3">
			<button hubButton color="primary" (click)="updateCustomerCity()">Change customer city</button>
			<button hubButton color="primary" (click)="addLine()">Add line</button>
			<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
			<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>
		</div>

		<pre class="rounded p-3" style="background: var(--hub-sys-surface-elevated, #f8f9fa);">{{ invoice() | json }}</pre>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class NestedHistoryExampleComponent {
	private readonly objectId = 'invoice-1';
	private readonly historyStore = createHistoryStore<ComplexInvoice, string>({
		maxEntries: 60,
		maxBytes: 120_000
	});

	readonly invoice = computed(() => this.historyStore.states().get(this.objectId)!);
	readonly canUndo = computed(() => this.historyStore.canUndo(this.objectId));
	readonly canRedo = computed(() => this.historyStore.canRedo(this.objectId));

	/**
	 * Registers the initial invoice state with the history store.
	 */
	constructor() {
		this.historyStore.registerObject(this.objectId, {
			id: this.objectId,
			customer: {
				name: 'Acme Corp',
				city: 'Madrid'
			},
			lines: [{ name: 'Support plan', quantity: 1, unitPrice: 150 }]
		});
	}

	/**
	 * Commits a nested update by toggling the customer's city between two
	 * values.
	 */
	updateCustomerCity(): void {
		const current = this.invoice();
		const nextCity = current.customer.city === 'Madrid' ? 'Barcelona' : 'Madrid';
		this.historyStore.commit(
			this.objectId,
			{
				...current,
				customer: {
					...current.customer,
					city: nextCity
				}
			},
			{ label: 'Customer city change' }
		);
	}

	/**
	 * Commits an array append by adding a new line item to the invoice.
	 */
	addLine(): void {
		const current = this.invoice();
		const lineNumber = current.lines.length + 1;
		this.historyStore.commit(
			this.objectId,
			{
				...current,
				lines: [...current.lines, { name: `Extra item ${lineNumber}`, quantity: 1, unitPrice: 50 * lineNumber }]
			},
			{ label: 'Add line' }
		);
	}

	/**
	 * Moves one step backwards in the invoice history.
	 */
	undo(): void {
		this.historyStore.undo(this.objectId);
	}

	/**
	 * Moves one step forward in the invoice history.
	 */
	redo(): void {
		this.historyStore.redo(this.objectId);
	}

	static readonly templateCode = `<!-- One edits a nested property, the other appends to an array;
     both are recorded as a patch, not as a copy of the invoice. -->
<button hubButton color="primary" (click)="updateCustomerCity()">Change customer city</button>
<button hubButton color="primary" (click)="addLine()">Add line</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>

<pre>{{ invoice() | json }}</pre>`;

	static readonly componentCode = `
const historyStore = createHistoryStore<ComplexInvoice, string>();
historyStore.registerObject('invoice-1', initialInvoice);

historyStore.commit('invoice-1', {
  ...current,
  customer: { ...current.customer, city: 'Barcelona' }
}, { label: 'Customer city change' });

historyStore.undo('invoice-1');
historyStore.redo('invoice-1');
`;
}
