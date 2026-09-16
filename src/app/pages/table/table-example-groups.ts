/**
 * Section headings for the ng-hub-ui-paginable Examples tab and its nav panel.
 *
 * Forty-two examples read as one undifferentiated run; these split them by what the reader is
 * trying to do. Separate from a `*-functionalities.ts` on purpose: those are prose blocks for
 * the Overview tab, and this page has none — a heading is an ordering, not a feature pitch.
 *
 * Ids reference examples registered with the `ExampleRegistry` in `table.component.ts`. An
 * example missing from every group still renders, in a trailing untitled section.
 */
export const TABLE_EXAMPLE_GROUPS: ReadonlyArray<{ title: string; exampleIds: string[] }> = [
	{
		title: 'DOCS.TABLE.GROUP.GETTING_STARTED.TITLE',
		exampleIds: ['table-basic', 'list-basic', 'table-resource', 'list-resource']
	},
	{
		title: 'DOCS.TABLE.GROUP.PAGING_SORTING_FILTERING.TITLE',
		exampleIds: [
			'table-pagination',
			'table-client-pagination',
			'table-pagination-position',
			'table-sorting-filtering',
			'table-advanced-filtering',
			'table-menu-filters',
			'table-custom-filter-templates',
			'table-server-side-operations',
			'table-bottom-bar-ordering',
			'table-compare-search-fn',
			'paginator-basic'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.SELECTION_ROW_ACTIONS.TITLE',
		exampleIds: [
			'table-selection',
			'table-master-detail-selection',
			'table-row-click',
			'table-select-while-selecting',
			'table-action-buttons',
			'table-action-variants',
			'table-row-menus',
			'table-batch-actions',
			'table-form-controls',
			'table-editable'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.COLUMNS_LAYOUT.TITLE',
		exampleIds: [
			'table-expandable-sticky',
			'table-multiple-sticky',
			'table-sticky-header-scroll',
			'table-column-visibility',
			'table-resizable-columns',
			'table-responsive-states'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.TEMPLATES_STATES.TITLE',
		exampleIds: [
			'table-custom-templates',
			'table-row-class',
			'table-empty-error-states',
			'table-default-state-components',
			'list-states'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.LISTS_DRAG.TITLE',
		exampleIds: [
			'list-connected',
			'list-selection',
			'list-group-selection',
			'list-flush',
			'list-cards',
			'list-nested',
			'list-drag-drop',
			'list-whole-item-drag',
			'list-nested-drag'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.THEMING_ICONS.TITLE',
		exampleIds: [
			'table-filter-theming',
			'table-css-variables',
			'table-themeable-header',
			'table-tag-retheme-dark',
			'table-caret-icons',
			'table-custom-icons',
			'table-mixin-theme',
			'list-css-variables'
		]
	},
	{
		title: 'DOCS.TABLE.GROUP.INTERNATIONALIZATION.TITLE',
		exampleIds: ['table-i18n', 'table-rtl']
	}
];
