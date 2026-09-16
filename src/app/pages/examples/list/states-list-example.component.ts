import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import {
	HubListComponent,
	HubPaginableErrorDirective,
	HubPaginableListItemDirective,
	HubPaginableLoadingDirective
} from 'ng-hub-ui-paginable';

/**
 * Demonstrates the list's loading, error and empty states.
 *
 * The list now renders the same three states as the table and shares the
 * element-agnostic state directives (`loadingTpt` / `errorTpt` / `noResultsTpt`).
 * Here the loading and error states are customised via projected templates,
 * while the empty state falls back to the built-in default.
 */
@Component({
	selector: 'app-states-list-example',
	standalone: true,
	imports: [
		HubListComponent,
		HubPaginableListItemDirective,
		HubPaginableLoadingDirective,
		HubPaginableErrorDirective,
		HubButtonComponent
	],
	template: `
		<div class="d-flex gap-1 mb-3" role="group">
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="showData()">Show data</button>
			<button type="button" hubButton variant="outline" color="info" size="sm" (click)="showLoading()">Loading</button>
			<button type="button" hubButton variant="outline" color="danger" size="sm" (click)="showError()">Error</button>
			<button type="button" hubButton variant="outline" color="warning" size="sm" (click)="showEmpty()">Empty</button>
		</div>

		<hub-list [items]="items()" [loading]="loading()" [error]="error()" [bindLabel]="'name'">
			<ng-template listItemTpt let-item="data">
				<div class="d-flex align-items-center p-2">
					<i class="fa-solid fa-user text-primary me-3"></i>
					<div>
						<h6 class="mb-0">{{ item.name }}</h6>
						<small class="text-muted">{{ item.email }}</small>
					</div>
				</div>
			</ng-template>

			<ng-template loadingTpt>
				<div class="text-center py-4">
					<div class="spinner-border text-primary mb-2" role="status">
						<span class="visually-hidden">Loading…</span>
					</div>
					<p class="text-muted mb-0">Loading people…</p>
				</div>
			</ng-template>

			<ng-template errorTpt>
				<div class="text-center py-4 text-danger">
					<i class="fa-solid fa-triangle-exclamation fa-lg mb-2"></i>
					<p class="mb-0">Could not load the list. Please try again.</p>
				</div>
			</ng-template>
		</hub-list>
	`,
	changeDetection: ChangeDetectionStrategy.Eager
})
export class StatesListExampleComponent {
	private readonly fullData = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' }
	];

	/** Items currently bound to the list. */
	readonly items = signal<Array<{ id: number; name: string; email: string }>>(this.fullData);
	/** Loading flag driving the loading state. */
	readonly loading = signal(false);
	/** Error holder driving the error state. */
	readonly error = signal<unknown | null>(null);

	/** Restore the populated, idle state. */
	showData(): void {
		this.items.set(this.fullData);
		this.loading.set(false);
		this.error.set(null);
	}

	/** Force the loading state, then restore after a short delay. */
	showLoading(): void {
		this.error.set(null);
		this.loading.set(true);
		setTimeout(() => this.showData(), 1500);
	}

	/** Force the error state. */
	showError(): void {
		this.loading.set(false);
		this.error.set(new Error('Network error'));
	}

	/** Force the empty state (built-in default no-results template). */
	showEmpty(): void {
		this.loading.set(false);
		this.error.set(null);
		this.items.set([]);
	}

	static readonly templateCode = `<hub-list [items]="items()" [loading]="loading()" [error]="error()" [bindLabel]="'name'">
  <ng-template listItemTpt let-item="data">
    <div class="d-flex align-items-center p-2">
      <div>
        <h6 class="mb-0">{{ item.name }}</h6>
        <small class="text-muted">{{ item.email }}</small>
      </div>
    </div>
  </ng-template>

  <!-- The state directives are shared with the table, so the same three names work on both -->
  <ng-template loadingTpt>
    <div class="text-center py-4">Loading people…</div>
  </ng-template>

  <ng-template errorTpt>
    <div class="text-center py-4 text-danger">Could not load the list.</div>
  </ng-template>

  <!-- No noResultsTpt here: the empty state falls back to the built-in default -->
</hub-list>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  HubListComponent,
  HubPaginableErrorDirective,
  HubPaginableListItemDirective,
  HubPaginableLoadingDirective
} from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  // Every projected template needs its directive imported: they are standalone, and
  // an unimported one is dropped in silence, leaving the built-in state on screen.
  imports: [HubListComponent, HubPaginableListItemDirective, HubPaginableLoadingDirective, HubPaginableErrorDirective],
  templateUrl: './people.component.html'
})
export class PeopleComponent {
  readonly items = signal<Person[]>([]);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);
}`;
}
