import { DatePipe, JsonPipe } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { createHistoryStore } from 'ng-hub-ui-history';

export type { EditorState } from './transaction-limits-history-example.component.model';
import type { EditorState } from './transaction-limits-history-example.component.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates transactions and retention limits in a linear history timeline.
 */
@Component({
	selector: 'app-transaction-limits-history-example',
	standalone: true,
	imports: [DatePipe, JsonPipe, HubButtonComponent],
	template: `
		<div class="d-flex flex-wrap gap-2 mb-3">
			<button hubButton color="primary" (click)="runBatch()">Run transaction commit</button>
			<button hubButton color="primary" (click)="commitSingle()">Commit single change</button>
			<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
			<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>
		</div>

		<p>
			<strong>Pointer:</strong> {{ history().pointer }} / <strong>Entries:</strong> {{ history().length }} /
			<strong>Bytes:</strong> {{ history().bytes }}
		</p>
		<ul>
			@for (entry of history().entries; track entry.timestamp) {
				<li>{{ entry.timestamp | date: 'mediumTime' }} - {{ entry.label || 'No label' }} ({{ entry.bytes }} bytes)</li>
			}
		</ul>

		<pre class="rounded p-3" style="background: var(--hub-sys-surface-elevated, #f8f9fa);">{{ state() | json }}</pre>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class TransactionLimitsHistoryExampleComponent {
	private readonly objectId = 'transaction-editor';
	private readonly historyStore = createHistoryStore<EditorState, string>({
		maxEntries: 3,
		maxBytes: 1_500
	});

	readonly state = computed(() => this.historyStore.states().get(this.objectId)!);
	readonly history = computed(() => this.historyStore.history(this.objectId));
	readonly canUndo = computed(() => this.historyStore.canUndo(this.objectId));
	readonly canRedo = computed(() => this.historyStore.canRedo(this.objectId));

	/**
	 * Registers the initial editor state with the history store.
	 */
	constructor() {
		this.historyStore.registerObject(this.objectId, {
			id: this.objectId,
			title: 'Release notes draft',
			content: 'Initial draft content.',
			tags: ['draft']
		});
	}

	/**
	 * Uses a transaction to merge several updates into a single undo step.
	 */
	runBatch(): void {
		const current = this.state();
		this.historyStore.beginTransaction(this.objectId, 'Batch editorial pass');
		this.historyStore.commit(this.objectId, {
			...current,
			title: `${current.title} (reviewed)`
		});
		this.historyStore.commit(this.objectId, {
			...this.state(),
			content: `${this.state().content}\n\nReviewed by legal team.`
		});
		this.historyStore.commit(this.objectId, {
			...this.state(),
			tags: Array.from(new Set([...this.state().tags, 'reviewed']))
		});
		this.historyStore.endTransaction(this.objectId);
	}

	/**
	 * Creates a single commit to illustrate retention trimming over time.
	 */
	commitSingle(): void {
		const current = this.state();
		this.historyStore.commit(
			this.objectId,
			{
				...current,
				content: `${current.content}\nQuick edit at ${new Date().toISOString()}`
			},
			{ label: 'Single edit' }
		);
	}

	/**
	 * Moves one step backwards in the editor history.
	 */
	undo(): void {
		this.historyStore.undo(this.objectId);
	}

	/**
	 * Moves one step forward in the editor history.
	 */
	redo(): void {
		this.historyStore.redo(this.objectId);
	}

	static readonly templateCode = `<button hubButton color="primary" (click)="runBatch()">Run transaction commit</button>
<button hubButton color="primary" (click)="commitSingle()">Commit single change</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>

<!-- history() is the readonly metadata: where the pointer sits and what is still retained. -->
<p>
  <strong>Pointer:</strong> {{ history().pointer }} /
  <strong>Entries:</strong> {{ history().length }} /
  <strong>Bytes:</strong> {{ history().bytes }}
</p>
<ul>
  @for (entry of history().entries; track entry.timestamp) {
    <li>{{ entry.timestamp | date: 'mediumTime' }} - {{ entry.label || 'No label' }} ({{ entry.bytes }} bytes)</li>
  }
</ul>

<pre>{{ state() | json }}</pre>`;

	static readonly componentCode = `
const store = createHistoryStore<EditorState, string>({ maxEntries: 3, maxBytes: 1_500 });
store.registerObject('transaction-editor', initialState);

store.beginTransaction('transaction-editor', 'Batch editorial pass');
store.commit('transaction-editor', { ...state, title: 'Updated title' });
store.commit('transaction-editor', { ...state, content: 'Updated content' });
store.endTransaction('transaction-editor');
`;
}
