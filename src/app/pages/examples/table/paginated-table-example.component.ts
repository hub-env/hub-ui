import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Paginated table example component demonstrating pagination functionality
 * Shows a table with pagination controls and configurable page sizes
 */
@Component({
	selector: 'app-paginated-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<hub-table
			[data]="pagedEmployees()"
			[headers]="headers"
			[(page)]="page"
			[(perPage)]="perPage"
			[perPageOptions]="perPageOptions"
			[totalItems]="totalItems()"
		>
		</hub-table>

		<div class="mt-3">
			<small class="text-muted">
				Total employees: {{ totalItems() }} | Current page: {{ page() }} | Page size: {{ perPage() }}
			</small>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class PaginatedTableExampleComponent {
	/**
	 * Employee data for the paginated table
	 */
	employees = [
		{
			id: 1,
			name: 'John Doe',
			department: 'Engineering',
			position: 'Senior Developer',
			salary: 85000,
			email: 'john.doe@company.com'
		},
		{
			id: 2,
			name: 'Jane Smith',
			department: 'Marketing',
			position: 'Marketing Manager',
			salary: 72000,
			email: 'jane.smith@company.com'
		},
		{
			id: 3,
			name: 'Bob Johnson',
			department: 'Engineering',
			position: 'Frontend Developer',
			salary: 65000,
			email: 'bob.johnson@company.com'
		},
		{
			id: 4,
			name: 'Alice Brown',
			department: 'HR',
			position: 'HR Specialist',
			salary: 58000,
			email: 'alice.brown@company.com'
		},
		{
			id: 5,
			name: 'Charlie Wilson',
			department: 'Sales',
			position: 'Sales Representative',
			salary: 55000,
			email: 'charlie.wilson@company.com'
		},
		{
			id: 6,
			name: 'Diana Martinez',
			department: 'Engineering',
			position: 'DevOps Engineer',
			salary: 78000,
			email: 'diana.martinez@company.com'
		},
		{
			id: 7,
			name: 'Edward Davis',
			department: 'Finance',
			position: 'Financial Analyst',
			salary: 62000,
			email: 'edward.davis@company.com'
		},
		{
			id: 8,
			name: 'Fiona Garcia',
			department: 'Marketing',
			position: 'Content Creator',
			salary: 48000,
			email: 'fiona.garcia@company.com'
		},
		{
			id: 9,
			name: 'George Miller',
			department: 'Engineering',
			position: 'Backend Developer',
			salary: 70000,
			email: 'george.miller@company.com'
		},
		{
			id: 10,
			name: 'Helen Taylor',
			department: 'Sales',
			position: 'Sales Manager',
			salary: 82000,
			email: 'helen.taylor@company.com'
		},
		{
			id: 11,
			name: 'Ivan Rodriguez',
			department: 'IT',
			position: 'System Administrator',
			salary: 67000,
			email: 'ivan.rodriguez@company.com'
		},
		{
			id: 12,
			name: 'Julia Anderson',
			department: 'HR',
			position: 'HR Manager',
			salary: 75000,
			email: 'julia.anderson@company.com'
		},
		{
			id: 13,
			name: 'Kevin Thompson',
			department: 'Finance',
			position: 'Accountant',
			salary: 54000,
			email: 'kevin.thompson@company.com'
		},
		{
			id: 14,
			name: 'Laura White',
			department: 'Marketing',
			position: 'Digital Marketer',
			salary: 52000,
			email: 'laura.white@company.com'
		},
		{
			id: 15,
			name: 'Michael Harris',
			department: 'Engineering',
			position: 'Tech Lead',
			salary: 95000,
			email: 'michael.harris@company.com'
		},
		{
			id: 16,
			name: 'Nancy Lewis',
			department: 'Sales',
			position: 'Account Executive',
			salary: 61000,
			email: 'nancy.lewis@company.com'
		},
		{
			id: 17,
			name: 'Oscar Clark',
			department: 'IT',
			position: 'Network Engineer',
			salary: 69000,
			email: 'oscar.clark@company.com'
		},
		{
			id: 18,
			name: 'Patricia Walker',
			department: 'Finance',
			position: 'Controller',
			salary: 88000,
			email: 'patricia.walker@company.com'
		},
		{
			id: 19,
			name: 'Quentin Hall',
			department: 'Engineering',
			position: 'QA Engineer',
			salary: 63000,
			email: 'quentin.hall@company.com'
		},
		{
			id: 20,
			name: 'Rachel Young',
			department: 'HR',
			position: 'Recruiter',
			salary: 51000,
			email: 'rachel.young@company.com'
		}
	];

	/**
	 * Table headers configuration
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'department', title: 'Department' },
		{ property: 'position', title: 'Position' },
		{ property: 'salary', title: 'Salary' },
		{ property: 'email', title: 'Email' }
	];

	/**
	 * Pagination state
	 */
	page = signal(1);
	perPage = signal(5);
	perPageOptions = [5, 10, 20];
	totalItems = computed(() => this.employees.length);
	pagedEmployees = computed(() => {
		const start = (this.page() - 1) * this.perPage();
		return this.employees.slice(start, start + this.perPage());
	});

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table 
  [data]="pagedEmployees()"
  [headers]="headers"
  [(page)]="page"
  [(perPage)]="perPage"
  [perPageOptions]="perPageOptions"
  [totalItems]="totalItems()">
</hub-table>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, computed, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table 
      [data]="pagedEmployees()"
      [headers]="headers"
      [(page)]="page"
      [(perPage)]="perPage"
      [perPageOptions]="perPageOptions"
      [totalItems]="totalItems()">
    </hub-table>
  \`
})
export class PaginatedTableComponent {
  employees = [];
  headers = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Name' },
    { key: 'department', title: 'Department' },
    { key: 'position', title: 'Position' },
    { key: 'salary', title: 'Salary' },
    { key: 'email', title: 'Email' }
  ];

  page = signal(1);
  perPage = signal(5);
  perPageOptions = [5, 10, 20];
  totalItems = computed(() => this.employees.length);
  pagedEmployees = computed(() => {
    const start = (this.page() - 1) * this.perPage();
    return this.employees.slice(start, start + this.perPage());
  });
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `employees = [
  { id: 1, name: 'John Doe', department: 'Engineering', position: 'Senior Developer', salary: 85000, email: 'john.doe@company.com' },
  { id: 2, name: 'Jane Smith', department: 'Marketing', position: 'Marketing Manager', salary: 72000, email: 'jane.smith@company.com' },
  { id: 3, name: 'Bob Johnson', department: 'Engineering', position: 'Frontend Developer', salary: 65000, email: 'bob.johnson@company.com' },
  // ... more employees (20 total)
];`;
}
