import { JsonPipe } from '@angular/common';
import { Component, computed, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createHistoryStore } from 'ng-hub-ui-history';

export type { BasicDocumentState } from './basic-history-example.component.model';
import type { BasicDocumentState } from './basic-history-example.component.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the minimal manual commit flow with undo and redo.
 */
@Component({
	selector: 'app-basic-history-example',
	standalone: true,
	imports: [JsonPipe, FormsModule, HubButtonComponent],
	template: `
		<div class="d-grid gap-3" style="max-width: 720px;">
			<label>
				Title
				<input class="form-control" [(ngModel)]="draftTitle" />
			</label>

			<label>
				Description
				<textarea class="form-control" rows="3" [(ngModel)]="draftDescription"></textarea>
			</label>

			<div class="d-flex flex-wrap gap-2">
				<button hubButton color="primary" (click)="save()">Commit</button>
				<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
				<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>
			</div>

			<pre class="rounded p-3" style="background: var(--hub-sys-surface-elevated, #f8f9fa);">{{
				currentState() | json
			}}</pre>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class BasicHistoryExampleComponent {
	private readonly objectId = 'basic-document';

	// A simple history store using string ids.
	private readonly historyStore = createHistoryStore<BasicDocumentState, string>({
		maxEntries: 40,
		maxBytes: 80_000
	});

	readonly currentState = computed(() => this.historyStore.states().get(this.objectId)!);
	readonly canUndo = computed(() => this.historyStore.canUndo(this.objectId));
	readonly canRedo = computed(() => this.historyStore.canRedo(this.objectId));

	draftTitle = 'Getting Started with History';
	draftDescription = 'Edit and commit to create undo/redo entries.';

	/**
	 * Registers the initial document state with the history store exactly once.
	 */
	constructor() {
		// Register the initial state once.
		this.historyStore.registerObject(this.objectId, {
			title: this.draftTitle,
			description: this.draftDescription
		});
	}

	/**
	 * Creates a manual commit from the current form values.
	 */
	save(): void {
		this.historyStore.commit(
			this.objectId,
			{
				title: this.draftTitle,
				description: this.draftDescription
			},
			{ label: 'Manual edit' }
		);
	}

	/**
	 * Moves one step backwards in history and reflects the restored state into
	 * the editable form fields.
	 */
	undo(): void {
		if (!this.historyStore.undo(this.objectId)) {
			return;
		}
		const state = this.currentState();
		this.draftTitle = state.title;
		this.draftDescription = state.description;
	}

	/**
	 * Moves one step forward in history and reflects the restored state into
	 * the editable form fields.
	 */
	redo(): void {
		if (!this.historyStore.redo(this.objectId)) {
			return;
		}
		const state = this.currentState();
		this.draftTitle = state.title;
		this.draftDescription = state.description;
	}

	static readonly templateCode = `<label>
  Title
  <input class="form-control" [(ngModel)]="draftTitle" />
</label>

<label>
  Description
  <textarea class="form-control" rows="3" [(ngModel)]="draftDescription"></textarea>
</label>

<!-- Undo and redo stay disabled while the timeline has nowhere to go. -->
<button hubButton color="primary" (click)="save()">Commit</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>

<pre>{{ currentState() | json }}</pre>`;

	static readonly componentCode = `
const historyStore = createHistoryStore<BasicDocumentState, string>({ maxEntries: 40, maxBytes: 80_000 });
historyStore.registerObject('basic-document', { title: 'Initial title', description: 'Initial description' });

historyStore.commit('basic-document', {
  title: 'Edited title',
  description: 'Edited description'
}, { label: 'Manual edit' });

historyStore.undo('basic-document');
historyStore.redo('basic-document');
`;
}
