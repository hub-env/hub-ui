import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Consumer-driven dark re-theming by a PLAIN TAG selector.
 *
 * Reproduces the real consumer case: a product maps the table surface to its own
 * semantic tokens with `hub-table { --hub-table-bg: var(--su-surface) }` (specificity
 * `0,0,1`) and flips those tokens with a `[data-theme='dark']` attribute. Before
 * paginable 22.6.0 the library's `:host` defaults (`0,1,0`) out-ranked that tag rule,
 * so only the header went dark while the DATA CELLS stayed white (illegible) unless
 * `!important` was used. With 22.6.0 the defaults live at zero specificity
 * (`:where(:host)`), so the cells and text follow the surface with NO `!important`.
 */
@Component({
	selector: 'app-tag-retheme-dark-table-example',
	standalone: true,
	imports: [HubTableComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<style>
			/* The consumer's own semantic surface tokens, flipped by the theme attribute. */
			.su-surface-scope {
				--su-surface: #ffffff;
				--su-on-surface: #1f2937;
				--su-surface-border: #e5e7eb;
				--su-surface-muted: rgba(15, 23, 42, 0.06);
			}
			.su-surface-scope[data-theme='dark'] {
				--su-surface: #0f172a;
				--su-on-surface: #e2e8f0;
				--su-surface-border: #334155;
				--su-surface-muted: rgba(148, 163, 184, 0.16);
			}

			/*
       * A PLAIN TAG selector (0,0,1) — the exact case that used to lose to the
       * library ':host' defaults. Identity fallbacks keep this a no-op for any table
       * rendered outside the themed scope, so it does not disturb sibling examples.
       */
			hub-table {
				--hub-table-container-bg: var(--su-surface, #fff);
				--hub-table-container-color: var(--su-on-surface, #212529);
				--hub-table-bg: var(--su-surface, #fff);
				--hub-table-color: var(--su-on-surface, #212529);
				--hub-table-border-color: var(--su-surface-border, var(--hub-sys-border-color-default, #dee2e6));
				--hub-table-hover-bg: var(--su-surface-muted, rgba(0, 0, 0, 0.075));
			}
		</style>

		<div class="d-flex align-items-center gap-3 mb-3">
			<button type="button" hubButton variant="outline" color="secondary" size="sm" (click)="dark.set(!dark())">
				Switch to {{ dark() ? 'light' : 'dark' }}
			</button>
			<span class="text-muted small">
				Re-themed by a bare <code>hub-table</code> tag selector — <strong>no</strong> <code>!important</code>.
			</span>
		</div>

		<div
			class="su-surface-scope p-3 rounded"
			[attr.data-theme]="dark() ? 'dark' : null"
			style="background: var(--su-surface); transition: background 0.2s ease;"
		>
			<hub-table [data]="users" [headers]="headers" [paginate]="false" [searchable]="false"></hub-table>
		</div>
	`,
	styles: []
})
export class TagRethemeDarkTableExampleComponent {
	/** Whether the consumer scope is in dark mode. */
	dark = signal(false);

	/** Demo rows. */
	users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Reviewer' }
	];

	/** Table headers. */
	headers: Array<PaginableTableHeader> = [
		{ property: 'id', title: 'ID', align: 'center' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role', align: 'end' }
	];

	static readonly templateCode = `<!-- The consumer owns the theme scope and flips a data attribute -->
<div class="su-surface-scope" [attr.data-theme]="dark() ? 'dark' : null">
  <hub-table [data]="users" [headers]="headers" [paginate]="false"></hub-table>
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { PaginableTableHeader, HubTableComponent } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-tag-retheme-dark-table',
  standalone: true,
  imports: [HubTableComponent],
  template: \`
    <div class="su-surface-scope" [attr.data-theme]="dark() ? 'dark' : null">
      <hub-table [data]="users" [headers]="headers" [paginate]="false"></hub-table>
    </div>
  \`,
  // A PLAIN TAG selector re-maps the table surface to the app's semantic tokens.
  // Since paginable 22.6.0 this reaches the rows/cells with NO !important.
  styles: [\`
    .su-surface-scope { --su-surface: #fff; --su-on-surface: #1f2937; }
    .su-surface-scope[data-theme='dark'] { --su-surface: #0f172a; --su-on-surface: #e2e8f0; }
    hub-table {
      --hub-table-bg: var(--su-surface);
      --hub-table-color: var(--su-on-surface);
      --hub-table-container-bg: var(--su-surface);
      --hub-table-container-color: var(--su-on-surface);
    }
  \`]
})
export class TagRethemeDarkTableComponent {
  dark = signal(false);
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' }
  ];
  headers: PaginableTableHeader[] = [
    { property: 'id', title: 'ID' },
    { property: 'name', title: 'Name' },
    { property: 'email', title: 'Email' },
    { property: 'role', title: 'Role' }
  ];
}`;
}
