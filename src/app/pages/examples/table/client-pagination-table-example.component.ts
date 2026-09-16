import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Demonstrates the table's automatic client-side pagination mode.
 *
 * The whole array is handed to `[data]` and, because `paginate` defaults to `true`
 * and no `totalItems` is provided, the table searches, filters, sorts and paginates
 * the data entirely in memory — no parent wiring required.
 */
@Component({
	selector: 'app-client-pagination-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<hub-table
			[data]="employees"
			[headers]="headers"
			[(page)]="page"
			[(perPage)]="perPage"
			[perPageOptions]="perPageOptions"
			[searchable]="true"
		>
		</hub-table>

		<div class="mt-3">
			<small class="text-muted">
				The full array ({{ employees.length }} rows) is handed to the table — it searches, filters, sorts and paginates
				entirely in memory. No <code>totalItems</code>, no parent logic.
			</small>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ClientPaginationTableExampleComponent {
	/** Current page (two-way bound; the table defaults it to 1 in client mode). */
	page = signal(1);
	/** Page size. */
	perPage = signal(5);
	/** Selectable page sizes. */
	perPageOptions = [5, 10, 20];

	/** Department options for the dropdown column filter. */
	departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT'].map((d) => ({
		id: d,
		name: d
	}));

	/**
	 * Headers with a searchable text filter, a dropdown filter and sortable columns.
	 * In client mode the table resolves all of them in memory.
	 */
	headers = [
		{ property: 'name', title: 'Name', sortable: true, filter: { type: 'text' as const } },
		{
			property: 'department',
			title: 'Department',
			filter: { type: 'dropdown' as const, options: this.departments, placeholder: 'All' }
		},
		{ property: 'position', title: 'Position' },
		{ property: 'salary', title: 'Salary', sortable: true }
	];

	/** The full, in-memory dataset handed to the table. */
	employees = [
		{ id: 1, name: 'John Doe', department: 'Engineering', position: 'Senior Developer', salary: 85000 },
		{ id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager', salary: 72000 },
		{ id: 3, name: 'Bob Johnson', department: 'Engineering', position: 'Frontend Developer', salary: 65000 },
		{ id: 4, name: 'Alice Brown', department: 'HR', position: 'HR Specialist', salary: 58000 },
		{ id: 5, name: 'Charlie Wilson', department: 'Sales', position: 'Sales Representative', salary: 55000 },
		{ id: 6, name: 'Diana Martinez', department: 'Engineering', position: 'DevOps Engineer', salary: 78000 },
		{ id: 7, name: 'Edward Davis', department: 'Finance', position: 'Financial Analyst', salary: 62000 },
		{ id: 8, name: 'Fiona Garcia', department: 'Marketing', position: 'Content Creator', salary: 48000 },
		{ id: 9, name: 'George Miller', department: 'Engineering', position: 'Backend Developer', salary: 70000 },
		{ id: 10, name: 'Helen Taylor', department: 'Sales', position: 'Sales Manager', salary: 82000 },
		{ id: 11, name: 'Ivan Rodriguez', department: 'IT', position: 'System Administrator', salary: 67000 },
		{ id: 12, name: 'Julia Anderson', department: 'HR', position: 'HR Manager', salary: 75000 },
		{ id: 13, name: 'Kevin Thompson', department: 'Finance', position: 'Accountant', salary: 54000 },
		{ id: 14, name: 'Laura White', department: 'Marketing', position: 'Digital Marketer', salary: 52000 },
		{ id: 15, name: 'Michael Harris', department: 'Engineering', position: 'Tech Lead', salary: 95000 },
		{ id: 16, name: 'Nancy Lewis', department: 'Sales', position: 'Account Executive', salary: 61000 },
		{ id: 17, name: 'Oscar Clark', department: 'IT', position: 'Network Engineer', salary: 69000 },
		{ id: 18, name: 'Patricia Walker', department: 'Finance', position: 'Controller', salary: 88000 },
		{ id: 19, name: 'Quentin Hall', department: 'Engineering', position: 'QA Engineer', salary: 63000 },
		{ id: 20, name: 'Rachel Young', department: 'HR', position: 'Recruiter', salary: 51000 },
		{ id: 21, name: 'Steve Adams', department: 'IT', position: 'Support Engineer', salary: 49000 },
		{ id: 22, name: 'Tina Baker', department: 'Marketing', position: 'SEO Specialist', salary: 56000 },
		{ id: 23, name: 'Uma Patel', department: 'Engineering', position: 'Mobile Developer', salary: 73000 }
	];

	/** Template code shown in the documentation viewer. */
	static readonly templateCode = `<hub-table
  [data]="employees"
  [headers]="headers"
  [(page)]="page"
  [(perPage)]="perPage"
  [perPageOptions]="perPageOptions"
  [searchable]="true">
</hub-table>`;

	/** Component code shown in the documentation viewer. */
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-client-pagination-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="employees"
      [headers]="headers"
      [(page)]="page"
      [(perPage)]="perPage"
      [perPageOptions]="perPageOptions"
      [searchable]="true">
    </hub-table>
  \`
})
export class ClientPaginationTableComponent {
  // paginate defaults to true; passing the whole array (and no totalItems)
  // makes the table search, filter, sort and slice in memory.
  page = signal(1);
  perPage = signal(5);
  perPageOptions = [5, 10, 20];

  headers = [
    { property: 'name', title: 'Name', sortable: true, filter: { type: 'text' } },
    { property: 'department', title: 'Department', filter: { type: 'dropdown', options: [
      { id: 'Engineering', name: 'Engineering' },
      { id: 'Marketing', name: 'Marketing' }
    ] } },
    { property: 'position', title: 'Position' },
    { property: 'salary', title: 'Salary', sortable: true }
  ];

  employees = [ /* ...full dataset... */ ];
}`;
}
