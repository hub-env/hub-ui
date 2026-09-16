import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

/**
 * Table CSS variables example component.
 * Demonstrates how to customize the table, rows, and paginator using the public CSS tokens.
 */
@Component({
	selector: 'app-css-variables-table-example',
	standalone: true,
	imports: [HubTableComponent],
	template: `
		<div class="table-theme-samples">
			<div class="theme-sample theme-sample--sunrise">
				<h6>Sunrise Theme</h6>
				<hub-table [data]="users" [headers]="headers" [page]="1" [perPage]="10" [totalItems]="users.length"></hub-table>
			</div>

			<div class="theme-sample theme-sample--midnight">
				<h6>Midnight Theme</h6>
				<hub-table [data]="users" [headers]="headers" [page]="1" [perPage]="10" [totalItems]="users.length"></hub-table>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.table-theme-samples {
				display: grid;
				gap: 1.75rem;
			}

			.theme-sample {
				display: grid;
				gap: 0.85rem;
				padding: 1rem;
				border-radius: 1rem;
				background: var(--hub-sys-surface-page, #ffffff);
				box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
			}

			.theme-sample h6 {
				margin: 0;
				font-weight: 700;
			}

			.theme-sample--sunrise .hub-table {
				--hub-table-container-bg: #fff7ed;
				--hub-table-container-color: #7c2d12;
				--hub-table-border-color: #fdba74;
				--hub-table-border-radius: 1rem;
				--hub-table-bg: #fffdf9;
				--hub-table-color: #7c2d12;
				--hub-table-cell-padding-x: 1rem;
				--hub-table-cell-padding-y: 0.85rem;
				--hub-table-hover-bg: rgba(249, 115, 22, 0.12);
				--hub-table-hover-color: #7c2d12;
				--hub-table-striped-bg: rgba(251, 146, 60, 0.1);
				--hub-table-striped-color: #7c2d12;
				--hub-table-cell-vertical-align: middle;
				--hub-table-icon-color: #c2410c;
				--hub-paginator-font-size: 0.95rem;
				--hub-paginator-gap: 0.4rem;
				--hub-paginator-info-color: #9a3412;
				--hub-paginator-label-color: #9a3412;
				--hub-paginator-icon-color: #c2410c;
				--hub-paginator-icon-size: 1.05em;
				--hub-paginator-link-active-bg: #ea580c;
				--hub-paginator-link-active-border-color: #ea580c;
				--hub-paginator-link-active-color: #ffffff;
				--hub-paginator-link-bg: #fffaf4;
				--hub-paginator-link-border-color: #fdba74;
				--hub-paginator-link-border-radius: 0.65rem;
				--hub-paginator-link-color: #c2410c;
				--hub-paginator-link-hover-bg: #ffedd5;
				--hub-paginator-link-hover-border-color: #fb923c;
				--hub-paginator-link-hover-color: #9a3412;
				--hub-paginator-link-disabled-bg: #fff7ed;
				--hub-paginator-link-disabled-border-color: #fed7aa;
				--hub-paginator-link-disabled-color: #fdba74;
				--hub-paginator-select-bg: #fffaf4;
				--hub-paginator-select-border-color: #fdba74;
				--hub-paginator-select-border-radius: 0.65rem;
				--hub-paginator-select-color: #9a3412;
				--hub-paginator-settings-gap: 0.6rem;
			}

			.theme-sample--midnight .hub-table {
				--hub-table-container-bg: #0f172a;
				--hub-table-container-color: #e2e8f0;
				--hub-table-border-color: #334155;
				--hub-table-border-radius: 1rem;
				--hub-table-bg: #111827;
				--hub-table-color: #e2e8f0;
				--hub-table-cell-padding-x: 1rem;
				--hub-table-cell-padding-y: 0.85rem;
				--hub-table-hover-bg: rgba(59, 130, 246, 0.14);
				--hub-table-hover-color: #eff6ff;
				--hub-table-striped-bg: rgba(148, 163, 184, 0.08);
				--hub-table-striped-color: #e2e8f0;
				--hub-table-cell-vertical-align: middle;
				--hub-table-icon-color: #93c5fd;
				--hub-paginator-font-size: 0.95rem;
				--hub-paginator-gap: 0.4rem;
				--hub-paginator-info-color: #cbd5e1;
				--hub-paginator-label-color: #cbd5e1;
				--hub-paginator-icon-color: #93c5fd;
				--hub-paginator-icon-size: 1.05em;
				--hub-paginator-link-active-bg: #2563eb;
				--hub-paginator-link-active-border-color: #2563eb;
				--hub-paginator-link-active-color: #ffffff;
				--hub-paginator-link-bg: #111827;
				--hub-paginator-link-border-color: #334155;
				--hub-paginator-link-border-radius: 0.65rem;
				--hub-paginator-link-color: #93c5fd;
				--hub-paginator-link-hover-bg: #1e293b;
				--hub-paginator-link-hover-border-color: #475569;
				--hub-paginator-link-hover-color: #bfdbfe;
				--hub-paginator-link-disabled-bg: #111827;
				--hub-paginator-link-disabled-border-color: #334155;
				--hub-paginator-link-disabled-color: #64748b;
				--hub-paginator-select-bg: #111827;
				--hub-paginator-select-border-color: #334155;
				--hub-paginator-select-border-radius: 0.65rem;
				--hub-paginator-select-color: #e2e8f0;
				--hub-paginator-settings-gap: 0.6rem;
			}
		`
	]
})
export class CssVariablesTableExampleComponent {
	/**
	 * Demo rows displayed in the tables.
	 */
	users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Reviewer' }
	];

	/**
	 * Table headers used by the visual demo.
	 */
	headers = [
		{ property: 'id', title: 'ID', align: 'center' as const },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role', align: 'end' as const }
	];

	static readonly templateCode = `<div class="theme-sample theme-sample--sunrise">
  <hub-table [data]="users" [headers]="headers" [page]="1" [perPage]="10" [totalItems]="users.length"></hub-table>
</div>

<div class="theme-sample theme-sample--midnight">
  <hub-table [data]="users" [headers]="headers" [page]="1" [perPage]="10" [totalItems]="users.length"></hub-table>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-css-variables-table-example',
  standalone: true,
  imports: [HubTableComponent],
  template: \`...\`,
  styles: [\`
    .theme-sample--sunrise .hub-table {
      --hub-table-container-bg: #fff7ed;
      --hub-table-bg: #fffdf9;
      --hub-table-color: #7c2d12;
      --hub-table-hover-bg: rgba(249, 115, 22, 0.12);
      --hub-table-cell-padding-x: 1rem;
      --hub-table-cell-padding-y: 0.85rem;
    }
  \`]
})
export class CssVariablesTableExampleComponent {
  users = [...];
  headers = [...];
}`;

	static readonly cssCode = `/*
 * Table and paginator variables can both be set on .hub-table.
 * Paginator variables cascade naturally from the table host element
 * down to the nested paginator component.
 */
.theme-sample--sunrise .hub-table {
  /* Table tokens */
  --hub-table-container-bg: #fff7ed;
  --hub-table-container-color: #7c2d12;
  --hub-table-border-color: #fdba74;
  --hub-table-border-radius: 1rem;
  --hub-table-bg: #fffdf9;
  --hub-table-color: #7c2d12;
  --hub-table-hover-bg: rgba(249, 115, 22, 0.12);
  --hub-table-hover-color: #7c2d12;
  --hub-table-icon-color: #c2410c;
  /* Paginator tokens — cascade into the nested paginator */
  --hub-paginator-link-active-bg: #ea580c;
  --hub-paginator-link-active-color: #ffffff;
  --hub-paginator-link-color: #c2410c;
  --hub-paginator-link-bg: #fffaf4;
  --hub-paginator-link-border-color: #fdba74;
  --hub-paginator-icon-color: #c2410c;
}

.theme-sample--midnight .hub-table {
  /* Table tokens */
  --hub-table-container-bg: #0f172a;
  --hub-table-container-color: #e2e8f0;
  --hub-table-border-color: #334155;
  --hub-table-border-radius: 1rem;
  --hub-table-bg: #111827;
  --hub-table-color: #e2e8f0;
  --hub-table-hover-bg: rgba(59, 130, 246, 0.14);
  --hub-table-hover-color: #eff6ff;
  --hub-table-icon-color: #93c5fd;
  /* Paginator tokens — cascade into the nested paginator */
  --hub-paginator-link-active-bg: #2563eb;
  --hub-paginator-link-active-color: #ffffff;
  --hub-paginator-link-color: #93c5fd;
  --hub-paginator-link-bg: #111827;
  --hub-paginator-link-border-color: #334155;
  --hub-paginator-icon-color: #93c5fd;
}`;
}
