import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RowClass, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
	selector: 'app-row-class-table-example',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-table [data]="users" [headers]="headers" [rowClass]="getRowClass"> </hub-table> `
})
/**
 * Example component demonstrating the usage of the `rowClass` input on the `hub-table` component.
 * This component shows how to apply dynamic classes to rows based on their data.
 *
 * @export
 * @class RowClassTableExampleComponent
 */
export class RowClassTableExampleComponent {
	/**
	 * Sample user data for the table.
	 *
	 * @type {({ id: number; name: string; email: string; role: string; status: string; })[]}
	 * @memberof RowClassTableExampleComponent
	 */
	users = [
		{ id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'active', selected: false },
		{ id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'inactive', selected: false },
		{ id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'pending', selected: false },
		{ id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', status: 'active', selected: true },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'deleted', selected: false }
	];

	/**
	 * Table headers configuration.
	 *
	 * @type {({ property: string; title: string; })[]}
	 * @memberof RowClassTableExampleComponent
	 */
	headers = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' },
		{ property: 'status', title: 'Status' }
	];

	/**
	 * Function that returns a CSS class for a given user based on their status.
	 *
	 * @memberof RowClassTableExampleComponent
	 */
	getRowClass = (user: { status: string; selected?: boolean }): string => {
		// A consumer-set hub-table__row--selected class reuses the built-in selected
		// tint (--hub-table-selected-bg / --hub-table-selected-color) without repainting.
		if (user.selected) {
			return 'hub-table__row--selected';
		}
		switch (user.status) {
			case 'active':
				return RowClass.SUCCESS;
			case 'inactive':
				return RowClass.WARNING;
			case 'deleted':
				return RowClass.DANGER;
			default:
				return '';
		}
	};

	/**
	 * The template code to be displayed in the example.
	 *
	 * @type {string}
	 * @memberof RowClassTableExampleComponent
	 */
	static readonly templateCode = `<hub-table 
  [data]="users"
  [headers]="headers"
  [rowClass]="getRowClass">
</hub-table>`;

	/**
	 * The component code to be displayed in the example.
	 *
	 * @type {string}
	 * @memberof RowClassTableExampleComponent
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { RowClass, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-row-class-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table 
      [data]="users"
      [headers]="headers"
      [rowClass]="getRowClass">
    </hub-table>
  \`
})
export class RowClassTableExampleComponent {
  headers = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Name' },
    { property: 'status', title: 'Status' }];

  users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'active', selected: false },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', status: 'inactive', selected: false },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'pending', selected: false },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Editor', status: 'active', selected: true },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'deleted', selected: false }];

  getRowClass = (user: { status: string; selected?: boolean }): string => {
    // A consumer-set hub-table__row--selected class reuses the built-in selected
    // tint (--hub-table-selected-bg / --hub-table-selected-color) without repainting.
    if (user.selected) {
      return 'hub-table__row--selected';
    }
    switch (user.status) {
      case 'active':
        return RowClass.SUCCESS;
      case 'inactive':
        return RowClass.WARNING;
      case 'deleted':
        return RowClass.DANGER;
      default:
        return '';
    }
  };
}`;
}
