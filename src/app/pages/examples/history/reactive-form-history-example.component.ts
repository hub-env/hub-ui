import { JsonPipe } from '@angular/common';
import { Component, computed, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createHistoryStore } from 'ng-hub-ui-history';

export type { ProfileFormValue } from './reactive-form-history-example.component.model';
import type { ProfileFormValue } from './reactive-form-history-example.component.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates automatic commits from Reactive Forms value changes.
 */
@Component({
	selector: 'app-reactive-form-history-example',
	standalone: true,
	imports: [JsonPipe, ReactiveFormsModule, HubButtonComponent],
	template: `
		<form class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));" [formGroup]="form">
			<label>
				Name
				<input class="form-control" formControlName="name" />
			</label>
			<label>
				Email
				<input class="form-control" formControlName="email" />
			</label>
			<label>
				Role
				<input class="form-control" formControlName="role" />
			</label>
		</form>

		<div class="d-flex gap-2 mb-3">
			<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
			<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>
		</div>

		<pre class="rounded p-3" style="background: var(--hub-sys-surface-elevated, #f8f9fa);">{{ state() | json }}</pre>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ReactiveFormHistoryExampleComponent implements OnDestroy {
	private readonly objectId = 'profile-form';
	private readonly historyStore = createHistoryStore<ProfileFormValue, string>();
	private readonly stopWatching: () => void;

	readonly form = new FormGroup({
		name: new FormControl('Maria', { nonNullable: true }),
		email: new FormControl('maria@demo.local', { nonNullable: true }),
		role: new FormControl('Editor', { nonNullable: true })
	});

	readonly state = computed(() => this.historyStore.states().get(this.objectId)!);
	readonly canUndo = computed(() => this.historyStore.canUndo(this.objectId));
	readonly canRedo = computed(() => this.historyStore.canRedo(this.objectId));

	/**
	 * Registers the initial form value and starts watching the form so value
	 * changes are committed to the history store automatically.
	 */
	constructor() {
		this.historyStore.registerObject(this.objectId, this.form.getRawValue());
		this.stopWatching = this.historyStore.watchForm(this.objectId, this.form, { label: 'Form edit' });
	}

	/**
	 * Applies an undo and reflects the restored state back into the form
	 * without re-triggering commits.
	 */
	undo(): void {
		if (!this.historyStore.undo(this.objectId)) {
			return;
		}
		this.form.patchValue(this.state(), { emitEvent: false });
	}

	/**
	 * Applies a redo and reflects the restored state back into the form
	 * without re-triggering commits.
	 */
	redo(): void {
		if (!this.historyStore.redo(this.objectId)) {
			return;
		}
		this.form.patchValue(this.state(), { emitEvent: false });
	}

	/**
	 * Stops watching the form to release the value-changes subscription.
	 */
	ngOnDestroy(): void {
		this.stopWatching();
	}

	static readonly templateCode = `<!-- No commit button: watchForm() is already subscribed to valueChanges. -->
<form [formGroup]="form">
  <label>
    Name
    <input class="form-control" formControlName="name" />
  </label>
  <label>
    Email
    <input class="form-control" formControlName="email" />
  </label>
  <label>
    Role
    <input class="form-control" formControlName="role" />
  </label>
</form>

<button hubButton variant="outline" color="secondary" [disabled]="!canUndo()" (click)="undo()">Undo</button>
<button hubButton variant="outline" color="secondary" [disabled]="!canRedo()" (click)="redo()">Redo</button>

<pre>{{ state() | json }}</pre>`;

	static readonly componentCode = `
const form = new FormGroup({
  name: new FormControl('Maria', { nonNullable: true }),
  email: new FormControl('maria@demo.local', { nonNullable: true }),
  role: new FormControl('Editor', { nonNullable: true })
});

const store = createHistoryStore<ProfileFormValue, string>();
store.registerObject('profile-form', form.getRawValue());
const stop = store.watchForm('profile-form', form, { label: 'Form edit' });
`;
}
