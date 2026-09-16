import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { PaginableStateContext, PaginableStateDefault, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Branded loading state used as the table's default loading component.
 */
@Component({
	selector: 'app-demo-table-loading',
	standalone: true,
	template: `
		<div class="text-center py-5">
			<div class="spinner-border text-primary mb-3" role="status">
				<span class="visually-hidden">Loading…</span>
			</div>
			<h5 class="text-muted mb-0">Loading records…</h5>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager
})
export class DemoTableLoadingComponent {}

/**
 * Branded error state. Receives the captured error through an input mapped from
 * the state context by the descriptor's `inputs` factory.
 */
@Component({
	selector: 'app-demo-table-error',
	standalone: true,
	template: `
		<div class="text-center py-5">
			<i class="fa-solid fa-triangle-exclamation fa-2x text-danger mb-3"></i>
			<h5 class="text-danger">Something went wrong</h5>
			<p class="text-muted mb-0">{{ message }}</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager
})
export class DemoTableErrorComponent {
	/** Human-readable error message provided by the state context. */
	@Input() message = 'Unexpected error.';
}

/**
 * Branded empty state used as the table's default no-results component.
 */
@Component({
	selector: 'app-demo-table-empty',
	standalone: true,
	template: `
		<div class="text-center py-5">
			<i class="fa-solid fa-inbox fa-2x text-muted mb-3"></i>
			<h5 class="text-muted mb-0">No records to display</h5>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager
})
export class DemoTableEmptyComponent {}

/**
 * Demonstrates the default state-component system. Instead of projecting a
 * template per table, you register a component once and reuse it everywhere.
 *
 * Global registration (applies to every paginable component in the app):
 *
 * ```ts
 * // app.config.ts
 * providePaginable({
 *   states: {
 *     loading: DemoTableLoadingComponent,
 *     error: { component: DemoTableErrorComponent, inputs: (ctx) => ({ message: String(ctx.error) }) },
 *     noResults: () => import('./demo-table-empty.component').then((m) => m.DemoTableEmptyComponent)
 *   }
 * })
 * ```
 *
 * This example wires the same descriptors per instance via the
 * `[loadingComponent]` / `[errorComponent]` / `[noResultsComponent]` inputs so
 * the behaviour is visible without changing the documentation app's global
 * configuration.
 */
@Component({
	selector: 'app-default-state-components-table-example',
	standalone: true,
	imports: [HubTableComponent, HubButtonComponent],
	template: `
		<div class="d-flex gap-1 mb-3" role="group">
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="showData()">Show data</button>
			<button type="button" hubButton variant="outline" color="info" size="sm" (click)="showLoading()">Loading</button>
			<button type="button" hubButton variant="outline" color="danger" size="sm" (click)="showError()">Error</button>
			<button type="button" hubButton variant="outline" color="warning" size="sm" (click)="showEmpty()">Empty</button>
		</div>

		<hub-table
			[data]="rows()"
			[headers]="headers"
			[loading]="loading()"
			[error]="error()"
			[loadingComponent]="loadingComponent"
			[errorComponent]="errorComponent"
			[noResultsComponent]="emptyComponent"
		></hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager
})
export class DefaultStateComponentsTableExampleComponent {
	/** Table headers. */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'role', title: 'Role' }
	];

	private readonly fullData = [
		{ id: 1, name: 'John Doe', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', role: 'User' }
	];

	/** Rows currently bound to the table. */
	readonly rows = signal<Array<{ id: number; name: string; role: string }>>(this.fullData);
	/** Loading flag driving the loading state. */
	readonly loading = signal(false);
	/** Error holder driving the error state. */
	readonly error = signal<unknown | null>(null);

	/** Default component for the loading state. */
	readonly loadingComponent: PaginableStateDefault = DemoTableLoadingComponent;
	/** Default descriptor for the error state, mapping the context error to an input. */
	readonly errorComponent: PaginableStateDefault = {
		component: DemoTableErrorComponent,
		inputs: (ctx: PaginableStateContext) => ({
			message: ctx.error instanceof Error ? ctx.error.message : String(ctx.error)
		})
	};
	/** Default component for the no-results state. */
	readonly emptyComponent: PaginableStateDefault = DemoTableEmptyComponent;

	/** Restore the populated, idle state. */
	showData(): void {
		this.rows.set(this.fullData);
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
		this.error.set(new Error('Could not reach the server (HTTP 503).'));
	}

	/** Force the empty state. */
	showEmpty(): void {
		this.loading.set(false);
		this.error.set(null);
		this.rows.set([]);
	}

	static readonly templateCode = `<hub-table
  [data]="rows()"
  [headers]="headers"
  [loading]="loading()"
  [error]="error()"
  [loadingComponent]="loadingComponent"
  [errorComponent]="errorComponent"
  [noResultsComponent]="emptyComponent" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { PaginableStateContext, PaginableStateDefault, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubTableComponent],
  templateUrl: './records.component.html'
})
export class RecordsComponent {
  readonly rows = signal<Record[]>([]);
  readonly loading = signal(false);
  readonly error = signal<unknown | null>(null);

  // A bare component is enough when the state needs no data.
  readonly loadingComponent: PaginableStateDefault = DemoTableLoadingComponent;

  // A descriptor when it does: \`inputs\` maps the state context onto the
  // component's own inputs, which is how the failure reaches the message.
  readonly errorComponent: PaginableStateDefault = {
    component: DemoTableErrorComponent,
    inputs: (ctx: PaginableStateContext) => ({
      message: ctx.error instanceof Error ? ctx.error.message : String(ctx.error)
    })
  };

  readonly emptyComponent: PaginableStateDefault = DemoTableEmptyComponent;
}

// Registering the same three once, for every paginable component in the application:
providePaginable({
  states: {
    loading: DemoTableLoadingComponent,
    error: { component: DemoTableErrorComponent, inputs: (ctx) => ({ message: String(ctx.error) }) },
    noResults: () => import('./demo-table-empty.component').then((m) => m.DemoTableEmptyComponent)
  }
});`;
}
