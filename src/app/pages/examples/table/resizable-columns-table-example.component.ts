import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Resizable columns table example component
 * Demonstrates interactive column width adjustment
 */
@Component({
	selector: 'app-resizable-columns-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<div class="alert alert-info mb-3">
			<strong>Tip:</strong> Hover over column borders and drag to resize columns. Try resizing the Name and Email columns.
		</div>

		<hub-table [data]="employees" [headers]="headers"> </hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ResizableColumnsTableExampleComponent {
	/**
	 * Sample employee data for the table
	 */
	employees = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', position: 'Senior Developer' },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', position: 'Marketing Manager' },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Sales', position: 'Sales Representative' },
		{ id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', department: 'Engineering', position: 'Technical Lead' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', department: 'HR', position: 'HR Specialist' }
	];

	/**
	 * Table headers configuration with resizable enabled
	 */
	headers = [
		{ property: 'id', title: 'ID', resizable: false },
		{ property: 'name', title: 'Full Name', resizable: true },
		{ property: 'email', title: 'Email Address', resizable: true },
		{ property: 'department', title: 'Department', resizable: true },
		{ property: 'position', title: 'Position', resizable: true }
	];

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table
  [data]="employees"
  [headers]="headers">
</hub-table>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-resizable-columns-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="employees"
      [headers]="headers">
    </hub-table>
  \`
})
export class ResizableColumnsTableComponent {
  headers = [
    { property: 'id', title: 'ID', resizable: false },
    { property: 'name', title: 'Full Name', resizable: true },
    { property: 'email', title: 'Email Address', resizable: true },
    { property: 'department', title: 'Department', resizable: true },
    { property: 'position', title: 'Position', resizable: true }
  ];
}`;

	/**
	 * Data code for display
	 */
	static readonly dataCode = `employees = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', position: 'Senior Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', position: 'Marketing Manager' },
  { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', department: 'Sales', position: 'Sales Representative' },
  { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', department: 'Engineering', position: 'Technical Lead' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', department: 'HR', position: 'HR Specialist' }
];`;
}
