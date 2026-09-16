import { ActionButtonsTableExampleComponent } from './action-buttons-table-example.component';
import { ActionVariantsTableExampleComponent } from './action-variants-table-example.component';
import { AdvancedFilteringTableExampleComponent } from './advanced-filtering-table-example.component';
import { BasicTableExampleComponent } from './basic-table-example.component';
import { BatchActionsTableExampleComponent } from './batch-actions-table-example.component';
import { BottomBarOrderingPaginableExampleComponent } from './bottom-bar-ordering-paginable-example.component';
import { CaretIconsTableExampleComponent } from './caret-icons-table-example.component';
import { CompareSearchFnTableExampleComponent } from './compare-search-fn-table-example.component';
import { ClientPaginationTableExampleComponent } from './client-pagination-table-example.component';
import { ColumnVisibilityTableExampleComponent } from './column-visibility-table-example.component';
import { CssVariablesTableExampleComponent } from './css-variables-table-example.component';
import { CustomFilterTemplatesTableExampleComponent } from './custom-filter-templates-table-example.component';
import { CustomIconsTableExampleComponent } from './custom-icons-table-example.component';
import { CustomTemplatesTableExampleComponent } from './custom-templates-table-example.component';
import { DefaultStateComponentsTableExampleComponent } from './default-state-components-table-example.component';
import { EditableTableExampleComponent } from './editable-table-example.component';
import { EmptyErrorStatesTableExampleComponent } from './empty-error-states-table-example.component';
import { ExpandableStickyTableExampleComponent } from './expandable-sticky-table-example.component';
import { FilterThemingTableExampleComponent } from './filter-theming-table-example.component';
import { FormControlsTableExampleComponent } from './form-controls-table-example.component';
import { I18nTableExampleComponent } from './i18n-table-example.component';
import { MasterDetailSelectionTableExampleComponent } from './master-detail-selection-table-example.component';
import { MixinThemeTableExampleComponent } from './mixin-theme-table-example.component';
import { MultipleStickyColumnsTableExampleComponent } from './multiple-sticky-columns-table-example.component';
import { PaginatedTableExampleComponent } from './paginated-table-example.component';
import { PaginationPositionTableExampleComponent } from './pagination-position-table-example.component';
import { ResizableColumnsTableExampleComponent } from './resizable-columns-table-example.component';
import { ResourceTableExampleComponent } from './resource-table-example.component';
import { ResponsiveStatesTableExampleComponent } from './responsive-states-table-example.component';
import { RowClassTableExampleComponent } from './row-class-table-example.component';
import { RowClickTableExampleComponent } from './row-click-table-example.component';
import { RowMenusTableExampleComponent } from './row-menus-table-example.component';
import { RtlPaginableExampleComponent } from './rtl-paginable-example.component';
import { SelectWhileSelectingTableExampleComponent } from './select-while-selecting-table-example.component';
import { SelectionTableExampleComponent } from './selection-table-example.component';
import { ServerSideOperationsTableExampleComponent } from './server-side-operations-table-example.component';
import { SortingFilteringTableExampleComponent } from './sorting-filtering-table-example.component';
import { StickyHeaderScrollTableExampleComponent } from './sticky-header-scroll-table-example.component';
import { TagRethemeDarkTableExampleComponent } from './tag-retheme-dark-table-example.component';
import { ThemeableHeaderTableExampleComponent } from './themeable-header-table-example.component';

/**
 * ExampleViewer builds the code tabs from `templateCode` / `componentCode` / `dataCode` /
 * `cssCode`, reading them off the class first and only falling back to `new Component()` when
 * the class carries none of them. Two things follow, and both have bitten this folder:
 * a snippet left on the instance vanishes the moment a sibling snippet on the same class turns
 * static, and every snippet vanishes the first time an example reaches for inject(), because
 * the fallback constructor then throws NG0203 outside an injection context.
 */
const CODE_KEYS = ['templateCode', 'componentCode', 'dataCode', 'cssCode'] as const;

type CodeKey = (typeof CODE_KEYS)[number];
type CodeCarrier = Partial<Record<CodeKey, string>>;

const EXAMPLES = [
	['ActionButtonsTableExampleComponent', ActionButtonsTableExampleComponent],
	['ActionVariantsTableExampleComponent', ActionVariantsTableExampleComponent],
	['AdvancedFilteringTableExampleComponent', AdvancedFilteringTableExampleComponent],
	['BasicTableExampleComponent', BasicTableExampleComponent],
	['BatchActionsTableExampleComponent', BatchActionsTableExampleComponent],
	['BottomBarOrderingPaginableExampleComponent', BottomBarOrderingPaginableExampleComponent],
	['CaretIconsTableExampleComponent', CaretIconsTableExampleComponent],
	['CompareSearchFnTableExampleComponent', CompareSearchFnTableExampleComponent],
	['ClientPaginationTableExampleComponent', ClientPaginationTableExampleComponent],
	['ColumnVisibilityTableExampleComponent', ColumnVisibilityTableExampleComponent],
	['CssVariablesTableExampleComponent', CssVariablesTableExampleComponent],
	['CustomFilterTemplatesTableExampleComponent', CustomFilterTemplatesTableExampleComponent],
	['CustomIconsTableExampleComponent', CustomIconsTableExampleComponent],
	['CustomTemplatesTableExampleComponent', CustomTemplatesTableExampleComponent],
	['DefaultStateComponentsTableExampleComponent', DefaultStateComponentsTableExampleComponent],
	['EditableTableExampleComponent', EditableTableExampleComponent],
	['EmptyErrorStatesTableExampleComponent', EmptyErrorStatesTableExampleComponent],
	['ExpandableStickyTableExampleComponent', ExpandableStickyTableExampleComponent],
	['FilterThemingTableExampleComponent', FilterThemingTableExampleComponent],
	['FormControlsTableExampleComponent', FormControlsTableExampleComponent],
	['I18nTableExampleComponent', I18nTableExampleComponent],
	['MasterDetailSelectionTableExampleComponent', MasterDetailSelectionTableExampleComponent],
	['MixinThemeTableExampleComponent', MixinThemeTableExampleComponent],
	['MultipleStickyColumnsTableExampleComponent', MultipleStickyColumnsTableExampleComponent],
	['PaginatedTableExampleComponent', PaginatedTableExampleComponent],
	['PaginationPositionTableExampleComponent', PaginationPositionTableExampleComponent],
	['ResizableColumnsTableExampleComponent', ResizableColumnsTableExampleComponent],
	['ResourceTableExampleComponent', ResourceTableExampleComponent],
	['ResponsiveStatesTableExampleComponent', ResponsiveStatesTableExampleComponent],
	['RowClassTableExampleComponent', RowClassTableExampleComponent],
	['RowClickTableExampleComponent', RowClickTableExampleComponent],
	['RowMenusTableExampleComponent', RowMenusTableExampleComponent],
	['RtlPaginableExampleComponent', RtlPaginableExampleComponent],
	['SelectWhileSelectingTableExampleComponent', SelectWhileSelectingTableExampleComponent],
	['SelectionTableExampleComponent', SelectionTableExampleComponent],
	['ServerSideOperationsTableExampleComponent', ServerSideOperationsTableExampleComponent],
	['SortingFilteringTableExampleComponent', SortingFilteringTableExampleComponent],
	['StickyHeaderScrollTableExampleComponent', StickyHeaderScrollTableExampleComponent],
	['TagRethemeDarkTableExampleComponent', TagRethemeDarkTableExampleComponent],
	['ThemeableHeaderTableExampleComponent', ThemeableHeaderTableExampleComponent]
] as const;

describe('table examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its template snippet on the class', (_name, ctor) => {
		const asStatic = ctor as unknown as CodeCarrier;

		expect(typeof asStatic.templateCode).toBe('string');
		expect(asStatic.templateCode).not.toBe('');
	});

	it.each(EXAMPLES)('%s hides no snippet behind an instance', (_name, ctor) => {
		let instance: CodeCarrier;

		try {
			instance = new (ctor as unknown as new () => CodeCarrier)();
		} catch {
			// A component that cannot be built with `new` makes the point on its own: the viewer's
			// fallback would throw too, so the class is the only place a snippet can survive.
			return;
		}

		const asStatic = ctor as unknown as CodeCarrier;

		for (const key of CODE_KEYS) {
			if (instance[key]) {
				expect(asStatic[key]).toBe(instance[key]);
			}
		}
	});
});
