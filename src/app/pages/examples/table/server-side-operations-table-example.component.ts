import { Component, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Server-side operations table example component
 * Demonstrates pagination, sorting, and filtering with server-side data
 */
@Component({
	selector: 'app-server-side-operations-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<hub-table
			[data]="users()"
			[headers]="headers"
			[totalItems]="totalItems()"
			[(page)]="currentPage"
			[(perPage)]="perPage"
			[loading]="isLoading()"
			[searchable]="true"
			[(searchTerm)]="searchTerm"
			[(ordination)]="ordination"
		>
		</hub-table>

		<div class="alert alert-secondary mt-3">
			<h6>Server Request Info:</h6>
			<ul class="mb-0">
				<li><strong>Page:</strong> {{ currentPage() }}</li>
				<li><strong>Search:</strong> {{ searchTerm() || 'None' }}</li>
				<li><strong>Sort:</strong> {{ ordination()?.column || 'None' }} ({{ ordination()?.order || 'None' }})</li>
				<li><strong>Total Items:</strong> {{ totalItems() }}</li>
			</ul>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: []
})
export class ServerSideOperationsTableExampleComponent {
	/**
	 * Users data from server
	 */
	users = signal<any[]>([]);

	/**
	 * Total items count
	 */
	totalItems = signal<number>(0);

	/**
	 * Loading state
	 */
	isLoading = signal<boolean>(false);

	/**
	 * Current page
	 */
	currentPage = signal<number>(1);

	/**
	 * Items per page
	 */
	perPage = signal<number>(10);

	/**
	 * Search term
	 */
	searchTerm = signal<string>('');

	/**
	 * Ordination state
	 */
	ordination = signal<any>(null);

	/**
	 * Table headers configuration
	 */
	headers = [
		{ property: 'id', title: 'ID', sortable: true },
		{ property: 'name', title: 'Name', sortable: true },
		{ property: 'email', title: 'Email', sortable: true },
		{ property: 'role', title: 'Role', sortable: true },
		{ property: 'status', title: 'Status', sortable: true }
	];

	/**
	 * Mock database with 50 users
	 */
	private mockDatabase = this.generateMockData(50);

	/**
	 * Sets up a reactive effect that reloads server data whenever the
	 * pagination, search term or sorting signals change.
	 */
	constructor() {
		// React to changes in pagination, search, and sorting
		effect(() => {
			const page = this.currentPage();
			const perPage = this.perPage();
			const search = this.searchTerm();
			const sort = this.ordination();
			this.loadServerData(page, perPage, search, sort);
		});
	}

	/**
	 * Simulate loading data from server
	 */
	private loadServerData(page: number, perPage: number, search: string, sort: any): void {
		this.isLoading.set(true);

		// Simulate API delay
		setTimeout(() => {
			let filteredData = [...this.mockDatabase];

			// Apply search filter
			if (search) {
				const searchLower = search.toLowerCase();
				filteredData = filteredData.filter(
					(user) =>
						user.name.toLowerCase().includes(searchLower) ||
						user.email.toLowerCase().includes(searchLower) ||
						user.role.toLowerCase().includes(searchLower)
				);
			}

			// Apply sorting
			if (sort?.column) {
				filteredData.sort((a, b) => {
					const aVal = a[sort.column];
					const bVal = b[sort.column];
					const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
					return sort.order === 'asc' ? comparison : -comparison;
				});
			}

			// Apply pagination
			const startIndex = (page - 1) * perPage;
			const endIndex = startIndex + perPage;
			const paginatedData = filteredData.slice(startIndex, endIndex);

			this.totalItems.set(filteredData.length);
			this.users.set(paginatedData);
			this.isLoading.set(false);
		}, 500);
	}

	/**
	 * Generate mock data
	 */
	private generateMockData(count: number): any[] {
		const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah'];
		const surnames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Wilson', 'Martinez', 'Taylor', 'Anderson', 'Lee', 'White'];
		const roles = ['Admin', 'Editor', 'User', 'Moderator'];
		const statuses = ['Active', 'Inactive', 'Pending'];

		return Array.from({ length: count }, (_, i) => ({
			id: i + 1,
			name: `${names[i % names.length]} ${surnames[i % surnames.length]}`,
			email: `user${i + 1}@example.com`,
			role: roles[i % roles.length],
			status: statuses[i % statuses.length]
		}));
	}

	/**
	 * Template code for display
	 */
	static readonly templateCode = `<hub-table
  [data]="users()"
  [headers]="headers"
  [totalItems]="totalItems()"
  [(page)]="currentPage"
  [(perPage)]="perPage"
  [loading]="isLoading()"
  [searchable]="true"
  [(searchTerm)]="searchTerm"
  [(ordination)]="ordination">
</hub-table>

<div class="alert alert-secondary mt-3">
  <h6>Server Request Info:</h6>
  <ul class="mb-0">
    <li><strong>Page:</strong> {{ currentPage() }}</li>
    <li><strong>Search:</strong> {{ searchTerm() || 'None' }}</li>
    <li>
      <strong>Sort:</strong> {{ ordination()?.column || 'None' }} ({{
        ordination()?.order || 'None'
      }})
    </li>
    <li><strong>Total Items:</strong> {{ totalItems() }}</li>
  </ul>
</div>`;

	/**
	 * Component code for display
	 */
	static readonly componentCode = `import { Component, effect, signal } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-server-side-operations-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <hub-table
      [data]="users()"
      [headers]="headers"
      [totalItems]="totalItems()"
      [(page)]="currentPage"
      [(perPage)]="perPage"
      [loading]="isLoading()"
      [searchable]="true"
      [(searchTerm)]="searchTerm"
      [(ordination)]="ordination">
    </hub-table>
  \`
})
export class ServerSideOperationsTableComponent {
  users = signal<any[]>([]);
  totalItems = signal<number>(0);
  isLoading = signal<boolean>(false);
  currentPage = signal<number>(1);
  perPage = signal<number>(10);
  searchTerm = signal<string>('');
  ordination = signal<any>(null);

  headers = [
    { property: 'id', title: 'ID', sortable: true },
    { property: 'name', title: 'Name', sortable: true },
    { property: 'email', title: 'Email', sortable: true },
    { property: 'role', title: 'Role', sortable: true },
    { property: 'status', title: 'Status', sortable: true }
  ];

  private mockDatabase = this.generateMockData(50);

  constructor() {
    effect(() => {
      const page = this.currentPage();
      const perPage = this.perPage();
      const search = this.searchTerm();
      const sort = this.ordination();
      this.loadServerData(page, perPage, search, sort);
    });
  }

  private loadServerData(page: number, perPage: number, search: string, sort: any): void {
    this.isLoading.set(true);

    setTimeout(() => {
      let filteredData = [...this.mockDatabase];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = filteredData.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.role.toLowerCase().includes(searchLower)
        );
      }

      if (sort?.column) {
        filteredData.sort((a, b) => {
          const aVal = a[sort.column];
          const bVal = b[sort.column];
          const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
          return sort.order === 'asc' ? comparison : -comparison;
        });
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      this.totalItems.set(filteredData.length);
      this.users.set(paginatedData);
      this.isLoading.set(false);
    }, 500);
  }

  private generateMockData(count: number): any[] {
    const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie'];
    const surnames = ['Doe', 'Smith', 'Johnson', 'Brown', 'Wilson'];
    const roles = ['Admin', 'Editor', 'User', 'Moderator'];
    const statuses = ['Active', 'Inactive', 'Pending'];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: \`\${names[i % names.length]} \${surnames[i % surnames.length]}\`,
      email: \`user\${i + 1}@example.com\`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
    }));
  }
}`;

	/**
	 * Template snippet exposed for the example viewer.
	 * Kept as instance property for backwards compatibility.
	 */
	readonly templateCode = ServerSideOperationsTableExampleComponent.templateCode;

	/**
	 * TypeScript snippet exposed for the example viewer.
	 * Kept as instance property for backwards compatibility.
	 */
	readonly componentCode = ServerSideOperationsTableExampleComponent.componentCode;
}
