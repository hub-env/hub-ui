import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {
	HubPaginableErrorDirective,
	HubPaginableLoadingDirective,
	HubPaginableNoResultsDirective,
	HubTableComponent
} from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Empty and error states table example component
 * Demonstrates custom templates for empty data and error states
 */
@Component({
	selector: 'app-empty-error-states-table-example',
	standalone: true,
	imports: [
		HubTableComponent,
		HubPaginableNoResultsDirective,
		HubPaginableErrorDirective,
		HubPaginableLoadingDirective,
		HubButtonComponent
	],
	template: `
		<div class="d-flex gap-1 mb-3" role="group">
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="showNormal()">
				Show Normal Data
			</button>
			<button type="button" hubButton variant="outline" color="warning" size="sm" (click)="showEmpty()">
				Show Empty State
			</button>
			<button type="button" hubButton variant="outline" color="danger" size="sm" (click)="showError()">
				Show Error State
			</button>
			<button type="button" hubButton variant="outline" color="info" size="sm" (click)="showLoading()">
				Show Loading State
			</button>
		</div>

		<hub-table [data]="users()" [headers]="headers" [loading]="isLoading()" [error]="failure()">
			<ng-template noResultsTpt>
				<div class="text-center py-5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						fill="currentColor"
						class="bi bi-inbox text-muted mb-3"
						viewBox="0 0 16 16"
					>
						<path
							d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm-1.17-.437A1.5 1.5 0 0 1 4.98 3h6.04a1.5 1.5 0 0 1 1.17.563l3.7 4.625a.5.5 0 0 1 .106.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z"
						/>
					</svg>
					<h5 class="text-muted">No Users Found</h5>
					<p class="text-muted">There are no users to display at this time.</p>
				</div>
			</ng-template>

			<ng-template errorTpt>
				<div class="text-center py-5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						fill="currentColor"
						class="bi bi-exclamation-triangle text-danger mb-3"
						viewBox="0 0 16 16"
					>
						<path
							d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"
						/>
						<path
							d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"
						/>
					</svg>
					<h5 class="text-danger">Error Loading Data</h5>
					<p class="text-muted">There was an error loading the users. Please try again later.</p>
					<button hubButton color="danger" size="sm" (click)="showNormal()">Retry</button>
				</div>
			</ng-template>

			<ng-template loadingTpt>
				<div class="text-center py-5">
					<div class="spinner-border text-primary mb-3" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					<h5 class="text-muted">Loading Users...</h5>
				</div>
			</ng-template>
		</hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class EmptyErrorStatesTableExampleComponent {
	/**
	 * Sample user data for the table
	 */
	private fullUsers = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User' }
	];

	/**
	 * Table headers configuration
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' }
	];

	/**
	 * Current users displayed in table
	 */
	users = signal<any[]>(this.fullUsers);

	/**
	 * Loading state signal
	 */
	isLoading = signal<boolean>(false);

	/**
	 * The failure the table draws its error state from. `[error]` takes the failure itself, not a
	 * flag, so the projected template — and any registered default component — can report it.
	 */
	failure = signal<unknown | null>(null);

	/**
	 * Show normal data state
	 */
	showNormal(): void {
		this.users.set(this.fullUsers);
		this.isLoading.set(false);
		this.failure.set(null);
	}

	/**
	 * Show empty state
	 */
	showEmpty(): void {
		this.users.set([]);
		this.isLoading.set(false);
		this.failure.set(null);
	}

	/**
	 * Show error state
	 */
	showError(): void {
		this.users.set([]);
		this.isLoading.set(false);
		this.failure.set(new Error('The directory service is not answering'));
	}

	/**
	 * Show loading state
	 */
	showLoading(): void {
		this.isLoading.set(true);
		this.failure.set(null);
		setTimeout(() => this.showNormal(), 2000);
	}

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table
  [data]="users()"
  [headers]="headers"
  [loading]="isLoading()"
  [error]="failure()">

  <ng-template noResultsTpt>
    <div class="text-center py-5">
      <h5>No Users Found</h5>
      <p>There are no users to display.</p>
    </div>
  </ng-template>

  <ng-template errorTpt>
    <div class="text-center py-5">
      <h5 class="text-danger">Error Loading Data</h5>
      <button hubButton color="danger" (click)="retry()">Retry</button>
    </div>
  </ng-template>

  <ng-template loadingTpt>
    <div class="text-center py-5">
      <div class="spinner-border"></div>
      <h5>Loading...</h5>
    </div>
  </ng-template>
</hub-table>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import {
  HubPaginableErrorDirective,
  HubPaginableLoadingDirective,
  HubPaginableNoResultsDirective,
  HubTableComponent
} from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-empty-error-states-table',
  standalone: true,
  // The state directives are standalone: without them in imports the projected
  // templates match nothing and the table quietly draws its own defaults.
  imports: [HubTableComponent, HubPaginableNoResultsDirective, HubPaginableErrorDirective, HubPaginableLoadingDirective],
  template: \`
    <hub-table
      [data]="users()"
      [headers]="headers"
      [loading]="isLoading()"
      [error]="failure()">

      <ng-template noResultsTpt>
        <div class="text-center py-5">
          <h5>No Data</h5>
        </div>
      </ng-template>

      <ng-template errorTpt>
        <div class="text-center py-5">
          <h5 class="text-danger">Error</h5>
        </div>
      </ng-template>
    </hub-table>
  \`
})
export class EmptyErrorStatesTableComponent {
  users = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  failure = signal<unknown | null>(null);

  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Name' }
  ];
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `users = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User' }
];`;
}
