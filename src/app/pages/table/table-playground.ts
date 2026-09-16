import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TableBreakpoint, HubTableComponent } from 'ng-hub-ui-paginable';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Canonical column set rendered by the table playground preview.
 * Kept small so the live table stays readable inside the preview stage.
 */
const PLAYGROUND_HEADERS = [
	{ property: 'id', title: 'ID', align: 'center' as const },
	{ property: 'name', title: 'Name', icon: 'fa-solid fa-user' },
	{ property: 'email', title: 'Email', icon: 'fa-solid fa-envelope' },
	{ property: 'role', title: 'Role', align: 'end' as const }
];

/**
 * Sample dataset (~5 rows) used by the table playground preview.
 */
const PLAYGROUND_DATA = [
	{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
	{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
	{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
	{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor' },
	{ id: 5, name: 'Mark Lee', email: 'mark@example.com', role: 'User' }
];

/**
 * Thin, SSR-safe preview wrapper for the ng-hub-ui-paginable table.
 *
 * The real `hub-table` needs `headers` + `data` to render anything, so this
 * wrapper supplies a canonical dataset and re-exposes the table's configurable
 * visual / behavioural options as its own signal `input()`s. Each input maps 1:1
 * to a playground control; the boolean/enum options that live inside the table's
 * `options` object are recomposed into a single `options` binding via a computed
 * signal. No browser-only APIs are touched, so it renders safely under SSR.
 */
@Component({
	selector: 'app-table-playground-preview',
	standalone: true,
	imports: [HubTableComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-table
			[headers]="headers"
			[data]="data"
			[options]="options()"
			[searchable]="searchable()"
			[selectable]="selectable()"
			[multiple]="multiple()"
			[paginate]="paginate()"
			[paginationPosition]="paginationPosition()"
			[paginationInfo]="paginationInfo()"
			[perPage]="perPage()"
			[totalItems]="data.length"
			[responsive]="responsiveValue()"
		/>
	`
})
export class TablePlaygroundPreviewComponent {
	/** Canonical headers handed to the real table. */
	protected readonly headers = PLAYGROUND_HEADERS;
	/** Canonical sample data handed to the real table. */
	protected readonly data = PLAYGROUND_DATA;

	/** Alternating background style applied to rows / columns. */
	readonly striped = input<'rows-odd' | 'rows-even' | 'columns-odd' | 'columns-even' | 'none'>('rows-odd');
	/** Whether rows highlight on hover. */
	readonly hoverableRows = input<boolean>(true);
	/** Pointer cursor over rows. */
	readonly cursor = input<'pointer' | 'default'>('default');
	/** Right-to-left layout. */
	readonly rtl = input<boolean>(false);

	/** Whether the search input is shown. */
	readonly searchable = input<boolean>(true);
	/** Whether rows can be selected (adds the selection column). */
	readonly selectable = input<boolean>(false);
	/** Allow selecting more than one row at a time. */
	readonly multiple = input<boolean>(false);

	/** Enable client-side pagination. */
	readonly paginate = input<boolean>(true);
	/** Where pagination controls render. */
	readonly paginationPosition = input<'bottom' | 'top' | 'both'>('bottom');
	/** Whether the "Showing X of Y" summary is shown. */
	readonly paginationInfo = input<boolean>(true);
	/** Rows shown per page. */
	readonly perPage = input<number>(10);

	/** Responsive breakpoint at which the table becomes horizontally scrollable. */
	readonly responsive = input<string>('');

	/**
	 * Recomposes the discrete visual inputs into the single `options` object the
	 * real table consumes. `striped: 'none'` is mapped to `null` so the control can
	 * expose a readable "none" choice while the table receives its native value.
	 */
	protected readonly options = computed(() => {
		const striped = this.striped();
		return {
			striped: striped === 'none' ? null : striped,
			hoverableRows: this.hoverableRows(),
			cursor: this.cursor(),
			rtl: this.rtl()
		};
	});

	/** Maps the playground's string breakpoint (empty = none) to the table's enum. */
	protected readonly responsiveValue = computed<TableBreakpoint | null>(() => {
		const map: Record<string, TableBreakpoint> = {
			sm: TableBreakpoint.Small,
			md: TableBreakpoint.Medium,
			lg: TableBreakpoint.Large,
			xl: TableBreakpoint.ExtraLarge
		};
		return map[this.responsive()] ?? null;
	});
}

/**
 * Builds the generated code snippet shown next to the live table preview.
 * Mirrors the wrapper's bindings using the real `hub-table` selector and inputs.
 *
 * @param inputs Current live values keyed by control name.
 * @returns A ready-to-paste `<hub-table>` template string.
 */
const buildTableSnippet = (inputs: Record<string, unknown>): string => {
	const striped = inputs['striped'] === 'none' ? 'null' : `'${inputs['striped']}'`;
	const optionParts = [
		`striped: ${striped}`,
		`hoverableRows: ${inputs['hoverableRows']}`,
		`cursor: '${inputs['cursor']}'`,
		`rtl: ${inputs['rtl']}`
	];

	const attrs: string[] = [
		'[headers]="headers"',
		'[data]="data"',
		`[options]="{ ${optionParts.join(', ')} }"`,
		`[searchable]="${inputs['searchable']}"`,
		`[selectable]="${inputs['selectable']}"`,
		`[multiple]="${inputs['multiple']}"`,
		`[paginate]="${inputs['paginate']}"`,
		`paginationPosition="${inputs['paginationPosition']}"`,
		`[paginationInfo]="${inputs['paginationInfo']}"`,
		`[perPage]="${inputs['perPage']}"`
	];

	if (inputs['responsive']) {
		attrs.push(`responsive="${inputs['responsive']}"`);
	}

	return `<hub-table\n\t${attrs.join('\n\t')}>\n</hub-table>`;
};

/**
 * Interactive playground definition for the ng-hub-ui-paginable documentation page.
 * Exposes the table's visual and behavioural options as live controls, plus the
 * canonical `--hub-table-*` theming tokens.
 */
export const TABLE_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'table',
		title: 'Table',
		tag: 'hub-table',
		description:
			'A feature-rich data table. Toggle striping, hover, selection, search, pagination and responsiveness, and theme it live with the --hub-table-* tokens.',
		component: TablePlaygroundPreviewComponent,
		controls: [
			{
				name: 'striped',
				label: 'Striped',
				type: 'select',
				default: 'rows-odd',
				options: [
					{ label: 'none', value: 'none' },
					{ label: 'rows-odd', value: 'rows-odd' },
					{ label: 'rows-even', value: 'rows-even' },
					{ label: 'columns-odd', value: 'columns-odd' },
					{ label: 'columns-even', value: 'columns-even' }
				]
			},
			{ name: 'hoverableRows', label: 'Hoverable rows', type: 'boolean', default: true },
			{
				name: 'cursor',
				label: 'Row cursor',
				type: 'select',
				default: 'default',
				options: [
					{ label: 'default', value: 'default' },
					{ label: 'pointer', value: 'pointer' }
				]
			},
			{ name: 'rtl', label: 'Right-to-left', type: 'boolean', default: false },
			{ name: 'searchable', label: 'Searchable', type: 'boolean', default: true },
			{ name: 'selectable', label: 'Selectable rows', type: 'boolean', default: false },
			{
				name: 'multiple',
				label: 'Multiple selection',
				type: 'boolean',
				default: false,
				description: 'Only applies when "Selectable rows" is enabled.'
			},
			{ name: 'paginate', label: 'Paginate', type: 'boolean', default: true },
			{
				name: 'paginationPosition',
				label: 'Pagination position',
				type: 'select',
				default: 'bottom',
				options: [
					{ label: 'bottom', value: 'bottom' },
					{ label: 'top', value: 'top' },
					{ label: 'both', value: 'both' }
				]
			},
			{ name: 'paginationInfo', label: 'Pagination info', type: 'boolean', default: true },
			{ name: 'perPage', label: 'Rows per page', type: 'number', default: 10, min: 1, max: 100, step: 1 },
			{
				name: 'responsive',
				label: 'Responsive breakpoint',
				type: 'select',
				default: '',
				description: 'Below this breakpoint the table scrolls horizontally. Empty = always full width.',
				options: [
					{ label: 'none', value: '' },
					{ label: 'sm', value: 'sm' },
					{ label: 'md', value: 'md' },
					{ label: 'lg', value: 'lg' },
					{ label: 'xl', value: 'xl' }
				]
			}
		],
		cssVariables: [
			{ name: '--hub-table-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-table-color', label: 'Text color', type: 'color', default: '#212529' },
			{ name: '--hub-table-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-table-border-width', label: 'Border width', type: 'text', default: '1px' },
			{ name: '--hub-table-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-table-striped-bg', label: 'Striped row background', type: 'text', default: 'rgba(0, 0, 0, 0.05)' },
			{ name: '--hub-table-hover-bg', label: 'Hover background', type: 'text', default: 'rgba(0, 0, 0, 0.075)' },
			{ name: '--hub-table-active-bg', label: 'Active row background', type: 'text', default: 'rgba(0, 0, 0, 0.1)' },
			{ name: '--hub-table-cell-padding-x', label: 'Cell padding X', type: 'text', default: '1rem' },
			{ name: '--hub-table-cell-padding-y', label: 'Cell padding Y', type: 'text', default: '0.5rem' },
			{ name: '--hub-table-cell-vertical-align', label: 'Cell vertical align', type: 'text', default: 'middle' },
			{ name: '--hub-table-icon-color', label: 'Icon color', type: 'text', default: 'currentColor' }
		],
		codeTemplate: buildTableSnippet
	}
];
