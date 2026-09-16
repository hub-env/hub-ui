import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HUB_PAGINABLE_FORM_CONTROLS, HubTableComponent } from 'ng-hub-ui-paginable';
import { hubFormControlAdapter } from 'ng-hub-ui-forms';

/**
 * Agnostic form-controls example.
 *
 * The table renders native `<input>` / `<select>` by default. Provide the
 * adapter from `ng-hub-ui-forms` (here scoped to this example via the
 * `HUB_PAGINABLE_FORM_CONTROLS` token) and the global search and the rows-per-page
 * selector upgrade to `hub-input` / `hub-select` automatically — no template
 * changes, no hard dependency on the forms package.
 */
@Component({
	selector: 'app-form-controls-table-example',
	standalone: true,
	imports: [HubTableComponent],
	// Scoped to this example so the other table demos keep their native controls.
	// App-wide, you would use provideHubPaginableFormControls(hubFormControlAdapter).
	providers: [{ provide: HUB_PAGINABLE_FORM_CONTROLS, useValue: hubFormControlAdapter }],
	template: `
		<hub-table
			[data]="users"
			[headers]="headers"
			[searchable]="true"
			[perPageOptions]="[5, 10, 20]"
			[(page)]="page"
			[(perPage)]="perPage"
			[(searchTerm)]="searchTerm"
		>
		</hub-table>

		<p class="text-muted small mt-2">
			Search and rows-per-page are rendered by <code>ng-hub-ui-forms</code> (hub-input / hub-select). Remove the provider
			and they fall back to native controls.
		</p>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class FormControlsTableExampleComponent {
	/** Two-way bound search term. */
	searchTerm = signal<string>('');

	/** Two-way bound current page (enables the bottom bar with the page-size select). */
	page = signal<number>(1);

	/** Two-way bound page size. */
	perPage = signal<number>(5);

	/** Sample data. */
	users = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', department: 'IT' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', department: 'Marketing' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', department: 'Sales' },
		{ id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', department: 'IT' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', department: 'HR' },
		{ id: 6, name: 'Diana Martinez', email: 'diana.martinez@example.com', role: 'Admin', department: 'Finance' },
		{ id: 7, name: 'Edward Taylor', email: 'edward.taylor@example.com', role: 'User', department: 'Operations' },
		{ id: 8, name: 'Fiona Anderson', email: 'fiona.anderson@example.com', role: 'Editor', department: 'Marketing' }
	];

	/** Table headers. */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' },
		{ property: 'department', title: 'Department' }
	];

	/** Template code shown in the docs. */
	static readonly templateCode = `<hub-table
  [data]="users"
  [headers]="headers"
  [searchable]="true"
  [perPageOptions]="[5, 10, 20]"
  [(page)]="page"
  [(perPage)]="perPage"
  [(searchTerm)]="searchTerm">
</hub-table>`;

	/** Component code shown in the docs. */
	static readonly componentCode = `// The table is agnostic: by default it renders native <input>/<select>.
// Provide the forms adapter to upgrade them to hub-input / hub-select.

// app.config.ts (app-wide)
import { provideHubPaginableFormControls } from 'ng-hub-ui-paginable';
import { hubFormControlAdapter } from 'ng-hub-ui-forms';

export const appConfig = {
  providers: [provideHubPaginableFormControls(hubFormControlAdapter)]
};

// …or scoped to a single component:
import { Component, signal } from '@angular/core';
import { HUB_PAGINABLE_FORM_CONTROLS, HubTableComponent } from 'ng-hub-ui-paginable';
import { hubFormControlAdapter } from 'ng-hub-ui-forms';

@Component({
  selector: 'app-form-controls-table',
  standalone: true,
  imports: [HubTableComponent],
  providers: [{ provide: HUB_PAGINABLE_FORM_CONTROLS, useValue: hubFormControlAdapter }],
  template: \`<hub-table [data]="users" [headers]="headers" [searchable]="true"
    [(perPage)]="perPage" [(searchTerm)]="searchTerm"></hub-table>\`
})
export class FormControlsTableComponent {
  searchTerm = signal('');
  perPage = signal(5);
}`;
}
