import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Multiple sticky columns example.
 *
 * Pins TWO columns to the start (ID + Full Name) and TWO to the end (Salary +
 * Status). The table's sticky-columns directive measures each pinned column and
 * gives it a cumulative offset, so columns on the same side stack side by side
 * instead of collapsing onto each other.
 */
@Component({
	selector: 'app-multiple-sticky-columns-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="alert alert-info mb-3">
			<strong>Scroll horizontally.</strong> Two columns pin to the left (ID + Full Name) and two to the right (Salary +
			Status) — each offset by the width of its sticky neighbours, so they never overlap.
		</div>

		<hub-table [data]="employees" [headers]="headers"></hub-table>
	`
})
export class MultipleStickyColumnsTableExampleComponent {
	employees = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			department: 'Engineering',
			position: 'Senior Developer',
			location: 'New York',
			salary: '$120,000',
			status: 'Active'
		},
		{
			id: 2,
			name: 'Jane Smith',
			email: 'jane.smith@example.com',
			department: 'Marketing',
			position: 'Marketing Manager',
			location: 'Los Angeles',
			salary: '$95,000',
			status: 'Active'
		},
		{
			id: 3,
			name: 'Bob Johnson',
			email: 'bob.johnson@example.com',
			department: 'Sales',
			position: 'Sales Representative',
			location: 'Chicago',
			salary: '$75,000',
			status: 'On leave'
		},
		{
			id: 4,
			name: 'Alice Brown',
			email: 'alice.brown@example.com',
			department: 'Engineering',
			position: 'Technical Lead',
			location: 'San Francisco',
			salary: '$140,000',
			status: 'Active'
		},
		{
			id: 5,
			name: 'Charlie Wilson',
			email: 'charlie.wilson@example.com',
			department: 'HR',
			position: 'HR Specialist',
			location: 'Boston',
			salary: '$65,000',
			status: 'Active'
		}
	];

	/** Two sticky-start columns (id, name) and two sticky-end columns (salary, status). */
	headers: Array<PaginableTableHeader> = [
		{ property: 'id', title: 'ID', sticky: 'start' },
		{ property: 'name', title: 'Full Name', sticky: 'start' },
		{ property: 'email', title: 'Email Address' },
		{ property: 'department', title: 'Department' },
		{ property: 'position', title: 'Position' },
		{ property: 'location', title: 'Office Location' },
		{ property: 'salary', title: 'Salary', sticky: 'end' },
		{ property: 'status', title: 'Status', sticky: 'end' }
	];

	static readonly templateCode = `<hub-table [data]="employees" [headers]="headers"></hub-table>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-multiple-sticky-columns-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`<hub-table [data]="employees" [headers]="headers"></hub-table>\`
})
export class MultipleStickyColumnsTableComponent {
  // Two columns pinned to each side — they stack with cumulative offsets,
  // no overlap, no extra config beyond \`sticky\`.
  headers: PaginableTableHeader[] = [
    { property: 'id',     title: 'ID',        sticky: 'start' },
    { property: 'name',   title: 'Full Name', sticky: 'start' },
    { property: 'email',  title: 'Email' },
    { property: 'department', title: 'Department' },
    { property: 'position',   title: 'Position' },
    { property: 'location',   title: 'Location' },
    { property: 'salary', title: 'Salary',    sticky: 'end' },
    { property: 'status', title: 'Status',    sticky: 'end' }
  ];
}`;
}
