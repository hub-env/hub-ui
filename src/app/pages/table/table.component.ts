import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';

// Table Functional Examples
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { TABLE_PLAYGROUND } from './table-playground';
import { BasicTableExampleComponent } from '../examples/table/basic-table-example.component';
import { CssVariablesTableExampleComponent } from '../examples/table/css-variables-table-example.component';
import { PaginatedTableExampleComponent } from '../examples/table/paginated-table-example.component';
import { ClientPaginationTableExampleComponent } from '../examples/table/client-pagination-table-example.component';
import { ActionButtonsTableExampleComponent } from '../examples/table/action-buttons-table-example.component';
import { RowMenusTableExampleComponent } from '../examples/table/row-menus-table-example.component';
import { FilterThemingTableExampleComponent } from '../examples/table/filter-theming-table-example.component';
import { ColumnVisibilityTableExampleComponent } from '../examples/table/column-visibility-table-example.component';
import { CustomFilterTemplatesTableExampleComponent } from '../examples/table/custom-filter-templates-table-example.component';
import { EmptyErrorStatesTableExampleComponent } from '../examples/table/empty-error-states-table-example.component';
import { ResizableColumnsTableExampleComponent } from '../examples/table/resizable-columns-table-example.component';
import { RowClickTableExampleComponent } from '../examples/table/row-click-table-example.component';
import { SortingFilteringTableExampleComponent } from '../examples/table/sorting-filtering-table-example.component';
import { AdvancedFilteringTableExampleComponent } from '../examples/table/advanced-filtering-table-example.component';
import { SelectionTableExampleComponent } from '../examples/table/selection-table-example.component';
import { ExpandableStickyTableExampleComponent } from '../examples/table/expandable-sticky-table-example.component';
import { CustomTemplatesTableExampleComponent } from '../examples/table/custom-templates-table-example.component';
import { ResponsiveStatesTableExampleComponent } from '../examples/table/responsive-states-table-example.component';
import { ListExampleComponent } from '../examples/list/list-example.component';
import { CssVariablesListExampleComponent } from '../examples/list/css-variables-list-example.component';
import { CardsListExampleComponent } from '../examples/list/cards-list-example.component';
import { NestedListExampleComponent } from '../examples/list/nested-list-example.component';
import { DragDropListExampleComponent } from '../examples/list/drag-drop-list-example.component';
import { WholeItemDragListExampleComponent } from '../examples/list/whole-item-drag-list-example.component';
import { NestedDragListExampleComponent } from '../examples/list/nested-drag-list-example.component';
import { RowClassTableExampleComponent } from '../examples/table/row-class-table-example.component';
import { I18nTableExampleComponent } from '../examples/table/i18n-table-example.component';
import { BatchActionsTableExampleComponent } from '../examples/table/batch-actions-table-example.component';
import { RtlPaginableExampleComponent } from '../examples/table/rtl-paginable-example.component';
import { ServerSideOperationsTableExampleComponent } from '../examples/table/server-side-operations-table-example.component';
import { BottomBarOrderingPaginableExampleComponent } from '../examples/table/bottom-bar-ordering-paginable-example.component';
import { DefaultStateComponentsTableExampleComponent } from '../examples/table/default-state-components-table-example.component';
import { StatesListExampleComponent } from '../examples/list/states-list-example.component';
import { FormControlsTableExampleComponent } from '../examples/table/form-controls-table-example.component';
import { MultipleStickyColumnsTableExampleComponent } from '../examples/table/multiple-sticky-columns-table-example.component';
import { ThemeableHeaderTableExampleComponent } from '../examples/table/themeable-header-table-example.component';
import { StickyHeaderScrollTableExampleComponent } from '../examples/table/sticky-header-scroll-table-example.component';
import { CaretIconsTableExampleComponent } from '../examples/table/caret-icons-table-example.component';
import { ConnectedListExampleComponent } from '../examples/list/connected-list-example.component';
import { CustomIconsTableExampleComponent } from '../examples/table/custom-icons-table-example.component';
import { MixinThemeTableExampleComponent } from '../examples/table/mixin-theme-table-example.component';
import { EditableTableExampleComponent } from '../examples/table/editable-table-example.component';
import { FlushListExampleComponent } from '../examples/list/flush-list-example.component';
import { GroupSelectionListExampleComponent } from '../examples/list/group-selection-list-example.component';
import { SelectionListExampleComponent } from '../examples/list/selection-list-example.component';
import { TagRethemeDarkTableExampleComponent } from '../examples/table/tag-retheme-dark-table-example.component';
import { MasterDetailSelectionTableExampleComponent } from '../examples/table/master-detail-selection-table-example.component';
import { PaginationPositionTableExampleComponent } from '../examples/table/pagination-position-table-example.component';
import { TABLE_EXAMPLE_GROUPS } from './table-example-groups';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const TABLE_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'table-basic': BasicTableExampleComponent,
	'table-form-controls': FormControlsTableExampleComponent,
	'table-css-variables': CssVariablesTableExampleComponent,
	'table-pagination': PaginatedTableExampleComponent,
	'table-client-pagination': ClientPaginationTableExampleComponent,
	'table-action-buttons': ActionButtonsTableExampleComponent,
	'table-row-menus': RowMenusTableExampleComponent,
	'table-filter-theming': FilterThemingTableExampleComponent,
	'table-column-visibility': ColumnVisibilityTableExampleComponent,
	'table-custom-filter-templates': CustomFilterTemplatesTableExampleComponent,
	'table-empty-error-states': EmptyErrorStatesTableExampleComponent,
	'table-resizable-columns': ResizableColumnsTableExampleComponent,
	'table-row-click': RowClickTableExampleComponent,
	'table-sorting-filtering': SortingFilteringTableExampleComponent,
	'table-advanced-filtering': AdvancedFilteringTableExampleComponent,
	'table-selection': SelectionTableExampleComponent,
	'table-expandable-sticky': ExpandableStickyTableExampleComponent,
	'table-multiple-sticky': MultipleStickyColumnsTableExampleComponent,
	'table-themeable-header': ThemeableHeaderTableExampleComponent,
	'table-sticky-header-scroll': StickyHeaderScrollTableExampleComponent,
	'table-tag-retheme-dark': TagRethemeDarkTableExampleComponent,
	'table-master-detail-selection': MasterDetailSelectionTableExampleComponent,
	'table-caret-icons': CaretIconsTableExampleComponent,
	'table-custom-icons': CustomIconsTableExampleComponent,
	'table-mixin-theme': MixinThemeTableExampleComponent,
	'list-connected': ConnectedListExampleComponent,
	'list-flush': FlushListExampleComponent,
	'table-editable': EditableTableExampleComponent,
	'list-group-selection': GroupSelectionListExampleComponent,
	'list-selection': SelectionListExampleComponent,
	'table-custom-templates': CustomTemplatesTableExampleComponent,
	'table-responsive-states': ResponsiveStatesTableExampleComponent,
	'list-basic': ListExampleComponent,
	'list-css-variables': CssVariablesListExampleComponent,
	'list-cards': CardsListExampleComponent,
	'list-nested': NestedListExampleComponent,
	'list-drag-drop': DragDropListExampleComponent,
	'list-whole-item-drag': WholeItemDragListExampleComponent,
	'list-nested-drag': NestedDragListExampleComponent,
	'table-row-class': RowClassTableExampleComponent,
	'table-i18n': I18nTableExampleComponent,
	'table-batch-actions': BatchActionsTableExampleComponent,
	'table-rtl': RtlPaginableExampleComponent,
	'table-pagination-position': PaginationPositionTableExampleComponent,
	'table-server-side-operations': ServerSideOperationsTableExampleComponent,
	'table-bottom-bar-ordering': BottomBarOrderingPaginableExampleComponent,
	'table-default-state-components': DefaultStateComponentsTableExampleComponent,
	'list-states': StatesListExampleComponent
};

/**
 * Table library main documentation page component
 * Uses the standardized LibraryPageComponent structure for consistent UI/UX
 * across all ng-hub-ui library documentation pages
 */
@Component({
	selector: 'app-table',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="libraryData"
			[package]="'table'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		></app-library-page>
	`
})
export class TableComponent implements OnInit {
	protected readonly exampleGroups = TABLE_EXAMPLE_GROUPS;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = TABLE_PLAYGROUND;

	/**
	 * Library data object containing all table documentation information
	 * following the standardized Library interface structure
	 */
	libraryData: Library = {
		title: 'ng-hub-ui-paginable',
		description:
			'A comprehensive solution for displaying paginated data in Angular applications. Includes both Table and List components, sharing a powerful core for pagination, sorting, filtering, and selection.',
		overview: {
			text: 'The Paginable library provides a unified approach to data display, offering both a feature-rich Table component and a flexible List component. Built on a shared core, these components support server-side and client-side pagination, complex filtering, sorting, and selection models. Whether you need a dense data grid or a custom-card list, Paginable handles the data management complexity for you. The API tables below describe hub-table; the inputs of hub-list and hub-paginator are listed in the package README.',
			highlights: [
				{
					icon: 'fa-solid fa-table',
					title: 'Sortable Columns',
					description:
						'Click any column header to sort ascending or descending with fully typed sort-change events for server-side integration.'
				},
				{
					icon: 'fa-solid fa-filter',
					title: 'Built-In Column Filtering',
					description:
						'Per-column text filters with debounce emit filter-change events so you can drive client-side or server-side filtering.'
				},
				{
					icon: 'fa-solid fa-right-left',
					title: 'Client & Server Pagination',
					description:
						'Switch between in-memory pagination and server-driven pagination by responding to page-change events.'
				},
				{
					icon: 'fa-solid fa-check-double',
					title: 'Row Selection & Checkboxes',
					description:
						'Single and multi-row selection with an indeterminate "select all" checkbox. The selection travels through ControlValueAccessor, so it binds with [(ngModel)] or a reactive form control.'
				},
				{
					icon: 'fa-solid fa-arrows-up-down',
					title: 'Drag-to-Reorder Lists',
					description:
						'Enable native drag-and-drop reordering on the List with a single [sortable] input — list and cards layouts, nested trees, cross-list transfer via [dragGroup], a touch fallback and opt-in keyboard reordering.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Custom Cell Templates',
					description:
						'Project any Angular template into a cell column with the cellTpt directive for buttons, badges, and links.'
				},
				{
					icon: 'fa-solid fa-expand',
					title: 'Expandable Row Detail',
					description:
						'Expand any row to reveal a detail panel rendered from a custom template — great for master/detail layouts.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Header background, row hover colour, border style, pagination controls, and spacing are all CSS custom properties.'
				}
			],
			changelog: [
				{
					version: '22.22.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'The icon component is HubPaginableIconComponent, and hub-icon is no longer one of its element names. ng-hub-ui-icons exports a HubIconComponent matching hub-icon too, so the two packages claimed one class name and one tag — and a component importing both and writing hub-icon did not compile at all, rejected with NG8023, which reads as a bug in the application rather than as two libraries colliding. The tag now belongs to ng-hub-ui-icons alone; this component keeps ng-hub-ui-icon, which it has always matched, and gains hub-paginable-icon. The class is exported under its new name with HubIconComponent kept as a deprecated alias that goes in 23.0.0, and the component itself is unchanged. Breaking for a template writing hub-icon — see BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.21.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'placement on hub-paginator, so two paginators are not one name twice. A nav is a landmark, and with paginationPosition="both" the table drew two of them announcing the same "Pagination": a screen reader listed two identical regions and offered no way to choose between them. Each bar now says which end of the table it sits at, translated in every dictionary the package ships, while a lone paginator keeps the plain name it always had. The input is optional and unset by default.'
						},
						{
							type: 'fixed',
							description:
								'The JSDoc of five components reaches the published .d.ts. ListComponent, TableComponent, PaginatorComponent, ResizableComponent and PaginableTableRangeInputComponent carried their class documentation between the decorator and the class, where TypeScript associates it with nothing, so it never reached the type declarations and a consumer hovering any of them saw no description at all. The comments sit above the decorator now and travel with the build. Nothing about the API changes.'
						}
					]
				},
				{
					version: '22.20.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'removed',
							description:
								"The TooltipDirective re-export. The directive lived in ng-hub-ui-utils and was forwarded here for the consumers who had imported it from this package before it moved; ng-hub-ui-utils 22.14.0 removes it, because a bare [tooltip] selector is a name in the application namespace rather than a library one, so the forward has nothing left to point at. The table's own tooltips are drawn by HubTableTooltipDirective and are unaffected. Breaking for an application importing TooltipDirective from ng-hub-ui-paginable — see BREAKING_CHANGES.md."
						}
					]
				},
				{
					version: '22.19.1',
					date: '2026-09-07',
					changes: [
						{
							type: 'changed',
							description:
								'The documentation says where the keyboard marks a row. With selectWhileSelecting on and no clickFn the row carries no tabindex, which reads as a keyboard hole and was reported as one. It is not: every row of a selectable table already draws its own checkbox, a native control that sits in the natural tab order and marks the row when it is ticked, so the row click is a pointer shortcut for a path the keyboard has had all along. Giving the row a stop of its own would double the tab stops of a two-hundred-row table to reach something already reachable. Nothing in the behaviour changes; the input documentation, both READMEs and FUNCTIONALITIES.md now say it, and a test pins it.'
						}
					]
				},
				{
					version: '22.19.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'changed',
							description:
								'Single selection draws a radio, not a checkbox. With [selectable]="true" and no [multiple], the table drew a checkbox per row and then released the previous pick when a second one was ticked: a checkbox says the rows are independent, so the control described something the table does not do, and a screen reader announced it that way too. hub-list in this same package has always drawn a radio here. The radios of one table share a name of that table own, so two single-selection tables on a page do not fight over one choice, and clicking the chosen radio again still clears the selection, which a native radio cannot do on its own. Multiple selection is untouched; the change is announced in BREAKING_CHANGES.md because a stylesheet reaching the box through input[type="checkbox"] stops matching.'
						},
						{
							type: 'fixed',
							description:
								'The select-all box in the header lines up with the boxes in the rows again. 22.18.0 gave the row checkbox the whole cell as its hit area, wrapped in a label that centres it, and the header kept a bare input: the two were centred by different rules and the selection column read as two columns that did not quite meet. The header now wears the same label, which also gives the select-all box the generous hit area the row boxes got.'
						}
					]
				},
				{
					version: '22.18.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'The table and the list accept a resource whole, through [resource]. It is typed by its shape rather than by importing ResourceRef, so the package keeps supporting Angular from 18 onwards: any object exposing value, isLoading and error as no-argument functions will do. The value goes through the same reading that [data] already used, so an array becomes rows and a paginated object also sets the page, the size and the total. Bound alongside [data] the resource wins, and changing page does not reload it: the load cycle stays where the consumer put it. A failure is read before the value and the value only when there is none, because a resource in the error state has nothing to hand over and says so by rethrowing from value(); the rows of the last good load stay behind the error state, so a refresh that fails does not cost the reader the table they were looking at.'
						},
						{
							type: 'added',
							description:
								'selectWhileSelecting makes a row click mark the row while a selection is under way. Off by default, because changing it for everybody would break consumers who navigate while selecting, and on the desktop a click that suddenly does nothing is more confusing than one that acts. With the input on and at least one row marked, clicking a row toggles it instead of invoking clickFn, and Enter and Space follow the same rule. The mode holds no state of its own: it starts when the first box is ticked and ends when the last one is cleared.'
						},
						{
							type: 'added',
							description:
								'A clickable row can be reached and activated from the keyboard. A row given clickFn is a control in every way except the one that matters to somebody not holding a mouse: it had no tab stop and answered to no key, so the action was not there for them. The row now takes focus when clickFn is set and runs on Enter and Space, and it keeps its implicit row role rather than taking role=button, which would nest interactive controls and cost the table its grid semantics. The handler acts only when the row itself has focus, so ticking a checkbox with the keyboard no longer opens the record too.'
						},
						{
							type: 'added',
							description:
								'hub-ui-paginator is a name the paginator answers to. The hub-ui- spelling was on the table, the list and the dropdown but not on the paginator, so a template that reached for it matched nothing and rendered an empty element, and this repository CSS reference had been teaching that spelling for as long as it was wrong. hub-paginator and paginable-table-paginator are untouched, and it is the only alias added: nothing documents one for the element names left.'
						},
						{
							type: 'changed',
							description:
								'BREAKING - searchFn and compareFn do what the table has been publishing them as. Both were declared inputs the component never read, so binding either changed nothing. searchFn now decides whether a row survives the global search in client mode, and compareFn decides when two selection values are the same record, in markSelected and in both toggles. searchFn changes shape to do it: (a, b) => boolean could not drive a search because it never received a term, so it is now (item, term) => boolean, the same contract hub-list already honours, with the term already trimmed and lowercased. Neither input changes anything while unbound. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'BREAKING - every remaining @Input() is a signal input, and the host bindings live in the metadata. ListComponent items, options and batchActions, MenuFilterComponent header, HubIconComponent config and PaginableTableDropdownComponent options were accessor inputs whose setters wrote sibling fields, so those fields were only ever right in the order the setters happened to run. They are inputs with a transform now, and what used to be written by hand is derived. Template bindings are unchanged; reading any of them from TypeScript means calling it. Every component also declares OnPush explicitly, which buys nothing on Angular 22 but puts consumers on Angular 18 to 21 on the strategy the components are written and tested for. See BREAKING_CHANGES.md.'
						},
						{
							type: 'deprecated',
							description:
								'HubUITableModule, and the TableModule alias it is exported under. The module declares and exports nothing, so all it does today is carry providers through forRoot(); providePaginable() does that in one line and works in a route providers as well as at bootstrap. Nothing about its behaviour changes, and it is removed in 23.0.0, the release that moves this family to Angular 23. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'Missing the row checkbox by a few pixels no longer opens the row. Only the input stopped the click from reaching the row, and a native checkbox is a fraction of the cell it sits in, so a pointer landing anywhere else in that cell ran the consumer clickFn instead. That commonly navigates, which took the selection built up so far with it. The whole selection cell now stops the click and the control fills it, so there is no near-miss left to catch.'
						},
						{
							type: 'changed',
							description:
								'The filter panel, the dropdown and the legacy row-actions menu answer to names this library owns. .filter__* became hub-filter__*, .dropdown__* became hub-dropdown__* and .table-dropdown__* became hub-table-dropdown__*, in line with the hub-table__* and hub-list__* blocks migrated before them. The internal menu-filter element is hub-menu-filter for the same reason: an un-prefixed element name is a global name, and this one was never exported for a consumer to use. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'The package declares a styles entry point, so the theming mixins can be reached the way the README says they can. package.json carried no exports map at all, which left the styles folder ng-packagr copies into the distribution undeclared: the only thing a consumer could import by name was the JavaScript entry. ng-hub-ui-paginable/styles now forwards hub-table-theme and hub-list-theme from one place, and each partial keeps its own subpath.'
						},
						{
							type: 'fixed',
							description:
								'The filter panel, the dropdown and the row menus draw themselves, in a product with Bootstrap or without it. They named their appearance after Bootstrap classes, and that failed in both directions at once: without Bootstrap the names resolved to nothing, so the column filter came out as bare text on a transparent box; with Bootstrap the host application owned the appearance of the library internals, and a theme change there reshaped them unasked. Each surface now ships the rules it used to borrow, drawn from the system tokens.'
						},
						{
							type: 'fixed',
							description:
								'The paginator speaks the language it was configured in. Its first, previous, next and last controls are icon-only, so the aria-label is the entire accessible name a screen reader gets, and in nine of the eleven shipped languages that name fell through to English because only en and es ever defined those keys. Someone browsing in Catalan or German heard the English words announced with no marked language change. The nine remaining dictionaries now carry their own wording.'
						},
						{
							type: 'fixed',
							description:
								'The styling section of the README no longer sends readers to a file that never existed. It told them to import a paginable.scss that is nowhere in the repository, under a src/lib layout the published package does not have, while a later section of the same document gave the path that works.'
						},
						{
							type: 'fixed',
							description:
								'paginationInfo actually hides the "showing X of Y" line. The input existed, read the application-wide default and was documented as a working switch, but the template never consulted it, so the line was drawn whatever the consumer asked for.'
						},
						{
							type: 'fixed',
							description:
								'paginationPosition puts the pagination bar where it says it does. The READMEs, the functionality table and the playground control all described its three values as placements, but the template drew a single bar under the rows and asked the input only whether to put a paginator inside it: top deleted the paginator instead of moving it, and both was indistinguishable from bottom. The bar is one template now — paginator, page-size selector and row count together — drawn above the rows for top, under them for bottom and in both places for both, each carrying a hub-table__bottom-bar--top or --bottom modifier. No signature changes, and bottom renders exactly what it did before.'
						},
						{
							type: 'fixed',
							description:
								'Opening a hub-dropdown no longer writes to the browser console. A debug console.warn about a missing content template fired on every open where the projected content had not landed yet, with no environment guard and no once-only flag.'
						},
						{
							type: 'added',
							description:
								"The list, the column filter panel and the row-actions menu publish icon variables of their own. All three drew their glyphs with the table's, so a product that wanted another chevron in the list had to redefine a variable named after the table and got the table changed along with it. Each component declares its own family now, with classes to match: --hub-list-icon-* and .hub-list__icon--*, --hub-filter-icon-* and .hub-filter__icon--*, --hub-table-dropdown-icon-* and .hub-table-dropdown__icon--*. Every default is the glyph that was already there, and the list's magnifier, which had no variable at all, is --hub-list-icon-search."
						},
						{
							type: 'fixed',
							description:
								"The glyphs of the list, the filter panel and the row-actions menu are drawn at all. They asked for hub-table__icon, and a component stylesheet is scoped to that component's own view: the class reached the table and nothing else. The trigger that folds a group of list items was an empty box, the loading, error and no-results messages had no symbol in front of them, the filter panel's add and remove rules were bare words, and the row-actions menu had no dots to click."
						},
						{
							type: 'fixed',
							description:
								"Two arrow glyphs were drawn with a control point on the wrong side of the curve. --hub-table-icon-chevron-down was the mirror of chevron-up in nine of its ten segments, and in the tenth a minus sign was missing, so one arm opened wider than the other. --hub-paginator-icon-angle-double-right, on the last-page button of every paginated table and list, had every vertical offset negated in the closing curve of its second chevron, which hooked that chevron's lower arm upwards. A spec now walks each arrow pair into points and reflects one onto the other, so the next dropped sign fails a test."
						},
						{
							type: 'fixed',
							description:
								"The token catalogue stops promising eight table glyph variables that theme nothing. --hub-table-icon-chevron-up, -down, -left, -right, -angle-left, -angle-right, -angle-double-left and -angle-double-right are each consumed by a .hub-table__icon--* rule, but no template in the package paints those classes and the rules are scoped to the table's own view, so a consumer cannot reach them either. Overriding any of the eight changes nothing on screen, and the reference now says so. The variables stay: removing published API is a decision for a release, not for a documentation pass."
						}
					]
				},
				{
					version: '22.17.0',
					date: '2026-09-02',
					changes: [
						{
							type: 'fixed',
							description:
								'The column-filter row is visible again. Its controls were dressed in form-control / form-select and the clear button in btn btn-outline-danger — Bootstrap names that resolve to nothing in a product that does not ship Bootstrap, so the row rendered as bare text on the header surface and a filterable column looked exactly like one that offers no filter. The row is now drawn from the table own tokens, exactly as the search field beside it already was.'
						},
						{
							type: 'fixed',
							description:
								'The filter row draws its controls on the first render. They are built from filtersFG, and addControl is invisible to change detection: the cells asked the group once, got null, and kept the empty answer until some unrelated event redrew the table. The set of controls is published as a signal now, so a cell appears when its control does.'
						},
						{
							type: 'added',
							description:
								'A clear affordance in the search box. While the box holds a term an × appears between the field and the magnifier and empties it in one click, including the keystroke still inside the debounce window. Themed through --hub-table-search-clear-*, labelled by the new CLEAR_SEARCH key in all eleven shipped languages.'
						},
						{
							type: 'added',
							description:
								'A filter that holds a value says so: the cell takes hub-table__filter-cell--active and the field wears the same green the menu-filter trigger already uses. An emptied range reads as inactive, so clearing a filter clears its state too.'
						},
						{
							type: 'added',
							description:
								'The --hub-table-filter-row-bg / --hub-table-filter-cell-* / --hub-table-filter-control-* families for the filter row and its fields, --hub-table-delete-filters-* for the clear-filters button (toolbar chrome at rest, destructive under the cursor) and --hub-table-search-clear-* with --hub-table-icon-close for the new affordance.'
						}
					]
				},
				{
					version: '22.16.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'added',
							description:
								'provideHubPaginableActions, so the table row buttons and menus are drawn by a real component library instead of by the table itself. What the table drew was markup in Bootstrap class names, which resolve to nothing in a product that does not ship Bootstrap: the menu trigger fell back to the browser default grey button and the panel was a transparent box with no border, shadow or padding. Rather than restyle a second dropdown implementation, the table now describes what a row offers and an adapter draws it. Same arrangement as provideHubPaginableFormControls, and with the same consequence: no new dependency in either direction. Nothing changes in how actions are declared.'
						},
						{
							type: 'added',
							description:
								'hidden and disabled on PaginableTableDropdown, so a menu can be refused on a row like any other action.'
						},
						{
							type: 'deprecated',
							description:
								'PaginableTableDropdownComponent, and the built-in markup the table falls back to when no adapter is registered. Both still work and nothing breaks by upgrading; the table says so once per application, in production builds, naming the one line that fixes it.'
						}
					]
				},
				{
					version: '22.15.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'added',
							description:
								'disabled on a row action (PaginableActionButton.disabled), boolean or predicate, shaped exactly like hidden. hidden was the only thing you could say about an action that does not apply, and it says the wrong thing half the time: a cancelled payment is not a row where editing does not exist, it is a row where editing has nothing left to act on. Forced to choose, consumers hid the action — so the column changed shape row by row and nothing on screen said why. It reaches the rendered button, so the browser refuses the click and announces the state, and the tooltip still shows, which is where the reason belongs. Row actions only: a batch action is refused by an empty selection, and the predicate is handed a row a batch action does not have.'
						},
						{
							type: 'added',
							description:
								'--hub-table-action-disabled-opacity, how far a refused action is faded. The table draws its own buttons, so the browser default never reached them: a disabled action kept its full tint and its pointer and read as pressable. The hover response is cancelled with it.'
						}
					]
				},
				{
					version: '22.14.1',
					date: '2026-08-24',
					changes: [
						{
							type: 'fixed',
							description:
								"The search field's geometry actually reaches it. 22.14.0 claimed this and shipped it inert: the rule was written as ::ng-deep and nested by accident inside the right-to-left block, compiling to a selector confined to a direction most tables are not in and unmatchable even there. It is not a ::ng-deep rule any more, and that is the repair rather than a corrected selector — reaching into a component this table does not own was the wrong shape. Custom properties inherit, so the container states the radius on its own element and whatever fills it reads it; nothing names the control."
						}
					]
				},
				{
					version: '22.14.0',
					date: '2026-08-21',
					changes: [
						{
							type: 'added',
							description:
								'variant and color on a row action, so it can look like the buttons beside it. The table draws these buttons itself, and hub-buttons styles appearance through :host(...), which matches nothing on an element the primitive did not create — so a consumer who wanted a tinted row action rebuilt the tint in its own stylesheet.'
						},
						{
							type: 'changed',
							description:
								"A row action's colour is resolved, not enumerated. color is typed to accept any string on purpose, but the accent arrived as a class the stylesheet matched against seven built-in names: anything else produced a class matching no rule and a button with no accent, no error and no warning. It is a value now, written through resolveHubAccent, so both system roles and a consumer's own colours resolve."
						}
					]
				},
				{
					version: '22.13.0',
					date: '2026-08-18',
					changes: [
						{
							type: 'added',
							description:
								'flushFields on hub-table: the controls in the cells drawn as a spreadsheet, not as a form. The fields lose their border and surface, a static addon reads as its own content rather than as a chip, and a projected button stops being welded to its neighbour — corners back, a gap, and its own border colour, since two actions in a cell are two things to press. Done by assigning ng-hub-ui-forms tokens to the cells, which is why it reaches your own cell templates; it needs forms 22.21.0 for the seam tokens.'
						}
					]
				},
				{
					version: '22.12.3',
					date: '2026-08-18',
					changes: [
						{
							type: 'fixed',
							description:
								'`flush` keeps the horizontal padding, in the list and in the table. The variant zeroed `--hub-list-item-padding-x` and `--hub-table-cell-padding-x` along with the border, the radius and the surface, which left a checkbox hard against one edge and ran the table columns into each other. Flush drops the chrome, not the space to read in; a consumer who does want the text bleeding to the edge sets the padding token to 0 from outside.'
						}
					]
				},
				{
					version: '22.12.2',
					date: '2026-08-18',
					changes: [
						{
							type: 'removed',
							description:
								'An XML namespace that was declared and never used: the loading spinner carried `xmlns:xlink` on its inline SVG and `xlink:href` appears nowhere in the library. It surfaced as a supply-chain scanner reporting the URL; `http://www.w3.org/2000/svg` stays, because the icons are `data:image/svg+xml` URLs parsed as XML and would not render without it.'
						}
					]
				},
				{
					version: '22.12.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'A group row gets no radio in single selection. The control was drawn on every row, so in a list grouped with `bindChildren` a heading became one of the things to choose — picking a building answered with a building, which nobody can book. Only leaves carry a radio now, which is the single-selection twin of the cascade 22.12.0 gave `multiple`.'
						}
					]
				},
				{
					version: '22.12.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING — `clickFn` hands over the item, not the internal wrapper. `ListClickEvent.item` carried the form group wrapping each row (`{selected, collapsed, data, children}`) while the published type said `item: T`, so a consumer reading `event.item.<field>` by the types got `undefined`: no error, no warning, every guard silently false. It is the item now; `value` reads `bindLabel` from the item rather than from the wrapper, and a new `children: T[]` hands over a group's children as items. Adding an alias and deprecating `item` was rejected: it would leave the library carrying, for ever, a field documented as the item that is not one, to protect code depending on a contradiction between the runtime and the type."
						},
						{
							type: 'changed',
							description:
								'BREAKING — a group row selects its children instead of itself. With `bindChildren`, a group\'s checkbox put the group\'s own value into the selection and left its children alone, so ticking a building meant "the building", which nobody can book, and a building with one room chosen looked exactly like one with none. Ticking a group now takes everything under it, a partly-selected group renders indeterminate, and only leaves travel in the value.'
						},
						{
							type: 'fixed',
							description:
								'Rebuilding `items` no longer clears the selection, nor claims the user did. The setter emptied the form and published the empty selection through the CVA, so a list that merely re-read its data dropped the choice and told the consumer the user had cleared it, with no way to tell a refresh from an edit. The selection is carried across and matched by `bindValue`, only what the new items no longer offer falls out, and nothing is published unless something really went.'
						},
						{
							type: 'fixed',
							description:
								'`setDisabledState` disables. It assigned a flag the template never read, so a disabled list still changed its selection. It now disables the form, reaching every `selected` control however deep — through the form and not a `[disabled]` binding, because Angular ignores that binding on a reactive control: it warns and the box stays live.'
						},
						{
							type: 'fixed',
							description:
								'`options.searchable` searches. The component rendered a search box wired to a `filter()` whose body was entirely commented out. It filters now, with a `searchTerm` model and an optional `searchFn` — the same two names `hub-table` uses, so the components do not disagree about what "searchable" means. A group survives while any descendant matches, and submitting returns to the first page.'
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'`flush` on `hub-list` and `hub-table`: the collection drawn as a list rather than as a stack of cards. Every row wears its own border, radius and surface by default — right for a collection standing on a page, wrong for a list of choices inside a dialog, where a bordered box per row reads as a region of its own and the surface has already drawn the frame. It had to be an input rather than something CSS can reach, and the reason is a trap the whole token catalogue shares: the defaults are declared on the host, which is the very element a consumer puts a class on, so their assignment ties on specificity and loses on source order — silently, which reads as "the token does nothing". Two tokens come with it, read only under the variant: --hub-list-divider-width and --hub-list-divider-color, the rule that stands in for the gap. It falls between siblings only, a group and the collection it opens keep none, and the cards display gets none at all because a grid separated by rules would draw them across the gaps. On the table the row divider survives on purpose.'
						},
						{
							type: 'fixed',
							description:
								"The single-selection radio has a rule. It shipped with the mode in 22.10.0 and had no CSS at all — .hub-list__radio matched nothing in the component — so the control rendered at the browser's own size beside a themed list, visibly not part of it. It now takes --hub-list-radio-size, defaulting to the checkbox's since the two are the same control wearing a different rule about how many may be on, and the list's accent."
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'hub-list single selection actually selects. selectable has enumerated single since it shipped and nothing read the value, so a consumer writing selectable="single" got a pointer cursor and silence. Single now renders a radio per row, grouped per list instance so two lists on one page cannot fight over one selection, and it emits the bare value rather than a list of one.'
						},
						{
							type: 'fixed',
							description:
								'A value written by the form repainted nothing in single mode. writeValue runs outside the component change detection and the radio is a plain [checked] binding, so patching the control from the consumer form moved the selection internally and left the rendered choice behind.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'provideHubTableTooltip, to give the table own controls a themed tooltip. Row actions and dropdown entries are drawn from the headers configuration, so their labels were stuck on the native title; registering an adapter routes them to whatever tooltip the application already uses, and without one the native title stays exactly as before.'
						},
						{
							type: 'fixed',
							description:
								'Icon-only row actions had no accessible name — title was quietly serving as it. The text is now mirrored to aria-label, but only where the control renders no text of its own, since overriding a visible label with different words breaks WCAG 2.5.3.'
						}
					]
				},
				{
					version: '22.8.1',
					date: '2026-08-16',
					changes: [
						{
							type: 'fixed',
							description:
								'Row-action icons sat low in their buttons. The button took its height from the line box of the glyph, and an icon font glyph is an inline-block resting on the baseline, so a 16px glyph in a 24px line box left the descender gap underneath — 4px above and 8px below on a 28px button. The content row now carries an explicit height and centres the glyph in it: 28px tall, 6/6 exactly. Worth recording that both obvious repairs make it worse — display: flex on the button or the icon host removes the line box that sets the height and collapses it to 20px, and vertical-align: middle overshoots to 7.78/4.22.'
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'changed',
							description:
								'Translation lookups now resolve HUBUI.PAGINABLE.* before the legacy flat keys. The table, list and paginator provide the namespace through HUB_TRANSLATION_PREFIX, so an application dictionary can feed them via provideHubTranslationAdapter() without reserving generic top-level keys. Existing flat dictionaries keep working — the bare key is still the fallback.'
						},
						{
							type: 'added',
							description:
								'README documentation for the application-wide translation adapter (provideHubTranslationAdapter() from ng-hub-ui-utils).'
						},
						{
							type: 'removed',
							description:
								'Removed the @angular/animations peer dependency and the unused table fadeInOut trigger declaration. The package is deprecated upstream and the trigger was never bound in the template. Applications that installed it only for ng-hub-ui-paginable can drop it.'
						}
					]
				},
				{
					version: '22.7.1',
					date: '2026-08-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Documentation links now point at the canonical localized URLs. The README linked to https://hubui.dev/<path> with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-29',
					changes: [
						{
							type: 'added',
							description:
								"--hub-table-head-border-width — the header's bottom-border thickness, defaulting to the shared --hub-table-border-width (zero visual change); set it to calc(var(--hub-table-border-width) * 2) for the Bootstrap-style thicker header and it keeps following the base width."
						},
						{
							type: 'added',
							description:
								'--hub-table-head-text-transform (none) and --hub-table-head-letter-spacing (normal) on the header titles — uppercase or tracked column headers without reaching for a th rule.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Importing the package no longer crashes under SSR: the module-scope navigator access behind DEFAULT_LANGUAGE is now guarded.'
						},
						{
							type: 'removed',
							description:
								"Dead internal ViewsService (never exported; its only working method threw 'not developed')."
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'fixed',
							description:
								'Table: `[stickyHeader]` now pins the header inside a consumer’s OWN scroll container. The built-in container no longer traps the sticky header (new `--hub-table-container-overflow`, flipped to `visible` when `[stickyHeader]` is set), so a `max-height`/`overflow:auto` box you own keeps the header pinned.'
						},
						{
							type: 'fixed',
							description:
								'Table: row/cell background is re-themeable by a plain `hub-table { --hub-table-bg: … }` tag selector (dark mode). The surface tokens are no longer declared on `:host` (which out-ranked the tag rule); each consumption site reads them as `var(--hub-table-bg, <default>)`, so a consumer’s tag rule reaches the cells with NO `!important`, and the sticky header stays opaque via the same fallback.'
						},
						{
							type: 'added',
							description:
								'Table: optional selected-row accent bar — `--hub-table-selected-bar-width` (default `0`, no visual change) and `--hub-table-selected-bar-color`. With the `hub-table__row--selected` tint it gives the master-detail “active row” look (tint + leading bar) entirely through tokens and `[rowClass]`. RTL-aware.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'Table: `[stickyHeader]` input pins the header while the body scrolls, decoupled from the built-in scroll frame — it works inside any consumer `max-height`/`overflow:auto` container. Overridable via `--hub-table-head-position` (default `sticky`).'
						},
						{
							type: 'added',
							description:
								'Table: themeable header typography and padding — `--hub-table-head-font-size`, `--hub-table-head-font-weight`, `--hub-table-head-padding-x`, `--hub-table-head-padding-y` (surface/text already existed as `--hub-table-head-bg`/`--hub-table-head-color`). All default to existing values (no visual change).'
						},
						{
							type: 'changed',
							description:
								'Table: the selected-row tint now also applies to a consumer-set `hub-table__row--selected` class, so a product can drive the selected look from its own state via `[rowClass]` instead of repainting the row.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'Table: themeable header, row divider and scroll/sticky-header slots — `--hub-table-head-bg`/`--hub-table-head-color`, `--hub-table-row-divider-color`, and `--hub-table-container-max-block-size`/`--hub-table-head-sticky-top` (a fixed-height scroll body with `options.scrollable` now engages a sticky header). All default to existing values (no visual change).'
						},
						{
							type: 'added',
							description:
								'Table: overridable row-expander caret icons via `--hub-table-icon-caret-up`/`--hub-table-icon-caret-down` (same var indirection as the sort icons).'
						},
						{
							type: 'added',
							description:
								'List: opt-in item connector (timeline/pipeline) via the `connected` input, themed with `--hub-list-connector-color`/`-width`/`-style`/`-offset`. Default-off, list display only.'
						},
						{
							type: 'fixed',
							description:
								'List (cards): long labels no longer overflow their card/grid track — `.hub-list__label` gets `min-width: 0` and wraps unbreakable tokens in cards mode.'
						}
					]
				},
				{
					version: '22.3.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'changed',
							description:
								'Hardcoded style values now read the matching design-system tokens, with the previous literals kept as fallbacks — no visual change. The CSS variables reference was resynchronised with what the code declares, and is guarded from then on by the workspace `tokens-parity` check.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								'Table: automatic client-side pagination. With a plain array in `[data]`, `paginate` true and no `totalItems`, the table searches, filters, sorts and slices the data entirely in memory and computes the total itself.'
						},
						{
							type: 'added',
							description:
								'App-wide input defaults via `providePaginable({ defaults })` (`PaginableDefaults`): `paginate`, `perPage`, `perPageOptions`, `paginationPosition`, `paginationInfo`, `searchable`, `debounce`. Instance inputs still win; unset keys keep each component default.'
						},
						{
							type: 'changed',
							description:
								'Table: the `paginate` input is now functional (previously inert) — it gates the client-side mode. Passing a `PaginationState` or setting `[totalItems]` keeps server mode. Set `[paginate]="false"` to render a full array unpaginated.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								'Agnostic form-controls integration: the table’s search input and rows-per-page select can be rendered by an external library via `provideHubPaginableFormControls()` and the `HUB_PAGINABLE_FORM_CONTROLS` token, with native `<input>` / `<select>` as the zero-dependency fallback.'
						}
					]
				},
				{
					version: '22.1.3',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'`--hub-table-accent` and `--hub-list-accent` became local accent slots: each derives its own `-emphasis`, `-subtle` and `-on` roles on the spot with `color-mix(in oklch, …)`, so overriding the single slot at runtime recomputes the whole family and any accent works — including one of your own, through the theming mixins or a plain `:host` rule.'
						},
						{
							type: 'changed',
							description:
								'The semantic `variant` set opened to the nine ng-hub-ui-ds variants (`primary`, `secondary`, `success`, `danger`, `warning`, `info`, `neutral`, `light`, `dark`); it was five.'
						},
						{
							type: 'changed',
							description:
								'The selected list item takes its text colour from the derived `--hub-list-accent-on` contrast token instead of a hard-wired white, so a light or custom accent keeps the label legible.'
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded z-index, font-weight, line-height, radii and theme-aware colours routed through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description:
								'List: native drag-and-drop reordering behind `[sortable]`, in the list and cards layouts and in nested trees, with cross-list transfer between lists sharing a `[dragGroup]`, a Pointer Events fallback for touch, opt-in keyboard reordering via `[keyboardSortable]`, and a typed `(sorted)` output carrying `ListSortEvent<T>`. Projected `[hubListDragHandle]`, `[hubListDragPlaceholder]` and `[hubListDragPreview]` directives and the `HubListDragService` coordinator came with it.'
						},
						{
							type: 'added',
							description:
								'`hub-table-theme()` and `hub-list-theme()` Sass mixins: colours, borders, density and footer layout in one call. Every parameter is optional, so only the ones you pass are emitted as `--hub-table-*` / `--hub-list-*` overrides.'
						},
						{
							type: 'added',
							description:
								'Semantic `variant` accent on table and list: `options.variant` re-bases a single accent through the `--hub-sys-color-<variant>` family, and the selected row gained styling of its own — until then the `--selected` class carried no CSS at all.'
						},
						{
							type: 'changed',
							description:
								'`TooltipDirective` moved to ng-hub-ui-utils so other libraries can reuse it, and is only re-exported here. Its base class changed from `.ng-tooltip` to `.hub-tooltip` and it is themeable through `--hub-tooltip-*`.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-23',
					changes: [
						{
							type: 'added',
							description:
								'Table: new `[loadingComponent]`, `[errorComponent]` and `[noResultsComponent]` inputs accept a `PaginableStateDefault` (eager component, lazy loader, or descriptor with input factory).'
						},
						{
							type: 'added',
							description:
								'List: same `[loadingComponent]`, `[errorComponent]` and `[noResultsComponent]` inputs added to `hub-list`.'
						},
						{
							type: 'added',
							description:
								'`providePaginable({ states })` — global app-level defaults for loading, error and no-results states shared across every paginable component.'
						},
						{
							type: 'added',
							description:
								'`PaginableStateOutlet` internal outlet renders the resolved state component with the injected context inputs.'
						},
						{
							type: 'added',
							description:
								'`PaginableLoadingDirective` (`loadingTpt`) and `PaginableErrorDirective` (`errorTpt`) exported for per-instance template-based state overrides.'
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-06-17',
					changes: [
						{
							type: 'fixed',
							description:
								'List: a nested children list rendered flush against its parent item content. A top margin now separates a nested collection from its parent, in the default list and in the card layout.'
						},
						{
							type: 'added',
							description:
								'`--hub-list-children-gap`, defaulting to `var(--hub-list-item-padding-y)`, controls that separation.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description:
								'List: the BEM block now lives on the host element and the <ul> becomes .hub-list__items; backgrounds are controlled via --hub-list-bg (host) and --hub-list-item-bg (items).'
						},
						{
							type: 'added',
							description: 'List: new --hub-list-gap, --hub-list-items-bg and --hub-list-item-bg CSS variables.'
						},
						{
							type: 'fixed',
							description:
								'The list card variables (--hub-list-cards-*) and --hub-paginator-font-size were documented but never applied; they now take effect. CSS variables reference fully synced (EN/ES).'
						},
						{
							type: 'removed',
							description:
								'Breaking: renamed list --hub-list-container-* variables and removed the non-functional table --hub-table-breakpoint-* variables.'
						}
					]
				},
				{
					version: '21.5.0',
					date: '2026-06-16',
					changes: [
						{
							type: 'added',
							description:
								'Paginator: the previously hard-coded link geometry exposed as CSS variables — `--hub-paginator-link-padding-x/y`, `--hub-paginator-link-border-width`, `--hub-paginator-link-focus-shadow`, `--hub-paginator-transition` and `--hub-paginator-select-border-width`.'
						},
						{
							type: 'added',
							description:
								'Table: CSS variables for the filter button geometry and for the active-filter count badge, plus `--hub-table-batch-actions-btn-icon-gap`.'
						},
						{
							type: 'changed',
							description:
								'The paginator focus ring derives from `--hub-sys-focus-ring-width` / `-color`, and the filter button and count badge read their colours from design-system tokens instead of Bootstrap variables and literal hexes, so both follow the active theme.'
						}
					]
				},
				{
					version: '21.4.0',
					date: '2026-06-16',
					changes: [
						{
							type: 'added',
							description:
								'List: a dedicated `--hub-list-cards-*` set so the card layout can be themed independently of the list layout, plus `--hub-list-cards-columns`, `-row-gap`, `-column-gap` and `--hub-list-item-border-width`.'
						},
						{
							type: 'changed',
							description:
								'Card items consume those variables, with defaults inherited from the existing `--hub-list-item-*` values, so the rendered output is unchanged until they are overridden.'
						}
					]
				},
				{
					version: '21.3.1',
					date: '2026-06-14',
					changes: [
						{
							type: 'changed',
							description:
								'The table dropdown menu uses the native `[style]` binding instead of the soft-deprecated `ngStyle` directive.'
						}
					]
				},
				{
					version: '21.3.0',
					date: '2026-03-31',
					changes: [
						{
							type: 'added',
							description:
								'List: `options.display = "cards"` renders the root items as a card grid, with tokens for column sizing and card spacing.'
						},
						{
							type: 'changed',
							description:
								'List: root rendering tracks by `bindValue`, `id` or index, and the internal markup and state classes were normalised so the list and card layouts share them.'
						},
						{
							type: 'fixed',
							description:
								'Table: the bottom pagination bar is rendered only when pagination is enabled, instead of leaving an empty wrapper behind.'
						}
					]
				},
				{
					version: '21.2.0',
					date: '2026-03-19',
					changes: [
						{
							type: 'added',
							description:
								'Library BEM classes for table, list and dropdown action buttons when no class list is given, plus CSS variables for the list action buttons and the top bar.'
						},
						{
							type: 'changed',
							description:
								'`color` was removed from `PaginableActionButton` to keep the action configuration CSS-framework agnostic; appearance travels through `classlist` and the normalised class helpers.'
						},
						{
							type: 'removed',
							description:
								'The legacy `RowButton` and `ListButton` interfaces, superseded by the unified `PaginableActionButton`.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-03-18',
					changes: [
						{
							type: 'added',
							description:
								'More locale dictionaries, and a bottom-bar ordering example covering table and list together.'
						},
						{
							type: 'changed',
							description:
								'Table and list bottom bars share one structure and behaviour (paginator, settings, info) with mirrored layout tokens, and the context pagination tokens `--hub-table-pagination-*` / `--hub-list-pagination-*` map onto the paginator styles.'
						},
						{
							type: 'fixed',
							description: 'The list per-page handler accepts both a plain number and an event.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-03-10',
					changes: [
						{
							type: 'changed',
							description:
								'Version aligned with Angular 21. `PaginableListComponent` was renamed to `ListComponent` and `PaginableTableNotFoundDirective` to `PaginableNoResultsDirective`; both former names are still exported, and `BREAKING_CHANGES.md` documents the migration.'
						}
					]
				},
				{
					version: '19.14.0',
					date: '2026-03-09',
					changes: [
						{
							type: 'added',
							description: 'List: a per-page selector and pagination info of its own, matching the table.'
						},
						{
							type: 'changed',
							description:
								'The paginable styles were consolidated around `src/lib/styles/paginable.scss`, and the styling sections of both READMEs now point at the CSS variables reference instead of restating it.'
						},
						{
							type: 'fixed',
							description:
								'List: `ngModel` selected items match the visual selection again, root-level pagination renders only the current slice, and the paginator arrows reappeared after its icon tokens were mapped to the shared icon variables.'
						}
					]
				},
				{
					version: '19.13.0',
					date: '2026-01-12',
					changes: [
						{
							type: 'added',
							description:
								'`tooltip` on the row button interface, and `Observable<string>` accepted for `title` and `tooltip` on `PaginableTableDropdown`, so a menu can be translated reactively.'
						},
						{
							type: 'changed',
							description:
								'Row buttons prefer `label` over `title` for the visible text, and every label, title and tooltip is unwrapped through `unwrapAsync`, so an Observable value updates in place.'
						}
					]
				},
				{
					version: '19.12.0',
					date: '2026-01-03',
					changes: [
						{
							type: 'added',
							description:
								'Table: the `rowClass` input, taking a fixed string or a function of the row, for dynamic row styling.'
						}
					]
				},
				{
					version: '19.11.5',
					date: '2026-01-02',
					changes: [
						{
							type: 'fixed',
							description:
								'`items` and the dropdown, list-button and pagination-state interfaces accept `ReadonlyArray`, so an immutable data source no longer fails to type-check.'
						},
						{
							type: 'changed',
							description:
								'List: `bindValue`, `bindLabel`, `bindChildren`, `selectable`, `clickFn` and the content queries migrated to signal inputs.'
						}
					]
				},
				{
					version: '19.11.4',
					date: '2026-01-02',
					changes: [
						{
							type: 'fixed',
							description:
								'`ListComponent`’s `items` input and `PaginationService.generate` accept a readonly array alongside a mutable one.'
						}
					]
				},
				{
					version: '19.11.3',
					date: '2026-01-02',
					changes: [{ type: 'changed', description: 'The ng-hub-ui-utils peer dependency moved to 1.2.0.' }]
				},
				{
					version: '19.11.2',
					date: '2026-01-02',
					changes: [
						{
							type: 'changed',
							description:
								'The translation service is `HubTranslationService`, replacing the paginable-specific one, and the list implementation was repaired alongside it.'
						}
					]
				},
				{
					version: '19.11.1',
					date: '2026-01-02',
					changes: [
						{
							type: 'fixed',
							description:
								'The build consumes the compiled ng-hub-ui-utils from `dist/` rather than its sources, `PaginableTableConfig` is exported from the public API again, and the conflicting `package.json` entries behind the ng-packagr warnings are gone.'
						}
					]
				},
				{
					version: '19.11.0',
					date: '2026-01-01',
					changes: [
						{
							type: 'added',
							description: 'Unit test coverage across components, directives, services and utilities.'
						},
						{
							type: 'changed',
							description:
								'The shared utility pipes moved to ng-hub-ui-utils, and the table template and the list, dropdown, paginator and resizable styles were cleaned up.'
						},
						{
							type: 'removed',
							description:
								'The Storybook configuration, the local copies of the shared pipes and the legacy `table2` stylesheet.'
						}
					]
				},
				{
					version: '19.10.2',
					date: '2025-12-23',
					changes: [{ type: 'fixed', description: 'Template typing errors resolved, so the library builds again.' }]
				},
				{
					version: '1.2.0',
					date: '2019-10-07',
					changes: [
						{ type: 'added', description: 'Ability to customize rows with templates' },
						{ type: 'changed', description: 'Replaced Lodash function calls with custom functions' }
					]
				},
				{
					version: '1.1.0',
					date: '2019-10-02',
					changes: [
						{ type: 'added', description: 'Ability to control pagination by passing a Laravel pagination object' },
						{ type: 'added', description: 'Result sorting and sort events' }
					]
				}
			]
		},
		functionalities: [], // Populated from example components
		api: {
			inputs: [
				{
					name: 'id',
					type: 'string',
					required: false,
					description:
						'Identifier of this table instance. Defaults to a generated unique id, so two tables on the same page never share one.'
				},
				{
					name: 'data',
					type: 'T[] | PaginationState<T> | null',
					required: false,
					description:
						'Table data, bound with the `data` alias. Pass a plain array to let the table paginate/filter/sort in memory (client mode, when `paginate` is true and `totalItems` is unset); pass a `PaginationState` for server mode (the table renders it as-is and reads `page`/`perPage`/`totalItems` from it).'
				},
				{
					name: 'resource',
					type: 'HubPaginableResource<T> | null',
					required: false,
					description:
						'A signal-based resource — `resource()`, `httpResource()` or anything with the same three signals — bound whole. Its value is read exactly as `data` is (array or `PaginationState`), `isLoading()` drives the loading state and `error()` the error state. Bound alongside `data` the resource wins, and changing page never calls `reload()`: whoever owns the request keeps owning it.'
				},
				{
					name: 'headers',
					type: '(PaginableTableHeader | string)[]',
					required: false,
					description:
						'Column definitions. A string is shorthand for `{ property, title }`; a `PaginableTableHeader` enables sorting, per-column filters, buttons, sticky/visibility, alignment and templates. Two-way bindable (`model`).'
				},
				{
					name: 'page',
					type: 'number | null',
					required: false,
					description: 'Current 1-based page. Two-way bindable (`model`) — emits `pageChange`. Defaults to `null`.'
				},
				{
					name: 'perPage',
					type: 'number | null',
					required: false,
					description: 'Items per page. Two-way bindable (`model`) — emits `perPageChange`. Defaults to `10`.'
				},
				{
					name: 'perPageOptions',
					type: 'number[]',
					required: false,
					description: 'Selectable page sizes shown in the per-page selector. Defaults to `[10, 20, 50, 100]`.'
				},
				{
					name: 'totalItems',
					type: 'number | null',
					required: false,
					description:
						'Total number of items across all pages (server mode). Setting it keeps the table in server mode even for a plain array. Two-way bindable (`model`) — emits `totalItemsChange`.'
				},
				{
					name: 'paginate',
					type: 'boolean',
					required: false,
					description:
						'Enables pagination. When `true` (default) with a plain array and no `totalItems`, the table searches, filters, sorts and slices in memory (client mode). Set `false` to render the whole array without pagination.'
				},
				{
					name: 'ordination',
					type: 'PaginableTableOrdination',
					required: false,
					description:
						'Active sort (`{ property, direction }`). Two-way bindable (`model`) — emits `ordinationChange` when a sortable header is clicked.'
				},
				{
					name: 'searchable',
					type: 'boolean',
					required: false,
					description: 'Shows the global search box. Defaults to `true`.'
				},
				{
					name: 'searchTerm',
					type: 'string',
					required: false,
					description:
						'Global search term. Two-way bindable (`model`) — emits `searchTermChange` (debounced by `debounce`).'
				},
				{
					name: 'searchFn',
					type: '(item: T, term: string) => boolean',
					required: false,
					description:
						'Decides row by row what survives the global search, instead of scanning the searchable columns — which is how you match on a field no column shows. Consulted in client mode only; the term arrives already trimmed and lowercased, the same contract hub-list honours.'
				},
				{
					name: 'compareFn',
					type: '(a: T, b: T) => boolean',
					required: false,
					description:
						'Decides when two selection values are the same record, everywhere the table matches the selection against the rows. It receives what the selection stores: the row data, or the `bindValue` property when one is set. Unbound, the matching is what it always was.'
				},
				{
					name: 'filters',
					type: 'Record<string, unknown> | null',
					required: false,
					description:
						'Per-column filter values keyed by `filter.key` or `property`. Two-way bindable (`model`) — emits `filtersChange`.'
				},
				{
					name: 'selectable',
					type: 'SelectionTypes | boolean | null',
					required: false,
					description:
						'Enables row selection (`true`/`single` draws a radio per row, `multiple` a checkbox). The selected value is read/written through `ControlValueAccessor` (`[(ngModel)]` or a `formControl`).'
				},
				{
					name: 'multiple',
					type: 'boolean',
					required: false,
					description: 'Forces multiple selection regardless of `selectable`. Defaults to `false`.'
				},
				{
					name: 'selectWhileSelecting',
					type: 'boolean',
					required: false,
					description:
						'While at least one row is selected, a click (or Enter/Space on a focused row) marks it instead of running `clickFn`. Off by default: on a pointer a click keeps the meaning the consumer gave it. The mode holds no state — it starts with the first row ticked and ends with the last one unticked. It is a pointer shortcut only: the keyboard marks a row through the checkbox the row itself draws, which is a tab stop already, so the row itself takes focus only when `clickFn` makes it a control in its own right.'
				},
				{
					name: 'bindValue',
					type: 'string',
					required: false,
					description: 'Property of each row used as the selection value instead of the whole object.'
				},
				{
					name: 'clickFn',
					type: '(event: TableRowEvent<T>) => void | Promise<void>',
					required: false,
					description: 'Callback invoked when a row is clicked, receiving the row data plus the originating event.'
				},
				{
					name: 'rowClass',
					type: 'string | ((item: T) => string)',
					required: false,
					description: 'CSS class applied to every row, either a fixed string or a function of the row data.'
				},
				{
					name: 'responsive',
					type: 'TableBreakpoint | null',
					required: false,
					description: 'Breakpoint at which the table switches to its responsive (stacked) layout.'
				},
				{
					name: 'paginationPosition',
					type: "'bottom' | 'top' | 'both'",
					required: false,
					description:
						'Where the pagination bar is drawn: `bottom` under the rows, `top` above them, `both` in each place. The whole bar moves — paginator, page-size selector and row count — and each one carries a `hub-table__bottom-bar--top` or `--bottom` modifier. Defaults to `bottom`.'
				},
				{
					name: 'paginationInfo',
					type: 'boolean',
					required: false,
					description: 'Shows the "Showing X of Y" info line. Defaults to `true`.'
				},
				{
					name: 'stickyActions',
					type: 'boolean',
					required: false,
					description: 'Keeps the row action column stuck to the viewport while scrolling. Defaults to `false`.'
				},
				{
					name: 'stickyHeader',
					type: 'boolean',
					required: false,
					description:
						'Pins the header (`position: sticky; top: 0`) while the body scrolls, inside any consumer `max-height`/`overflow:auto` container — decoupled from `options.scrollable`. Overridable via `--hub-table-head-position`. Defaults to `false`.'
				},
				{
					name: 'flushFields',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description:
						'Draws the form controls inside the cells as a spreadsheet does: no border, no surface of their own. A field is boxed so it can be told apart from the page around it, and a table cell already does that job — so the box gets drawn twice and an editable table reads as a form that fell into a table. Static prepend/append content loses its chip and reads as the plain text or icon it is; a projected button stops being welded to its neighbour, getting its corners back, a gap and its own border colour, because two actions in a cell are two things to press rather than one strip. The control regains its shared corners too. It is a token assignment on the cells rather than an input on each field, which is both why it reaches your own cellTpt content and why it needs ng-hub-ui-forms 22.21.0 for the seam tokens.'
				},
				{
					name: 'flush',
					type: 'boolean',
					required: false,
					description:
						'Draws the collection as a list rather than as a stack of cards: no border, radius or surface per row, a rule between them instead. On `hub-table` it drops the outer border, the radius, the head rule and the cell padding while keeping the row divider, because a table with no line between rows stops being readable across its columns. Right for a list of choices inside a dialog or a panel, where the surface has already drawn the frame. An input rather than something CSS can reach: the token defaults sit on the host, so a consumer class on the same element ties on specificity and loses on source order. Defaults to `false`.'
				},
				{
					name: 'batchActions',
					type: '(PaginableTableDropdown | PaginableActionButton)[]',
					required: false,
					description: 'Actions shown in the toolbar that operate on the currently selected rows.'
				},
				{
					name: 'debounce',
					type: 'number',
					required: false,
					description: 'Debounce in milliseconds applied to search and filter changes. Defaults to `0`.'
				},
				{
					name: 'options',
					type: 'PaginableTableOptions',
					required: false,
					description:
						'Visual/behavioural options: `striped`, `hoverableRows`, `variant`, `cursor`, `scrollable`, `rtl`…'
				},
				{
					name: 'loading',
					type: 'boolean',
					required: false,
					description: 'Renders the loading state. Two-way bindable (`model`) — emits `loadingChange`.'
				},
				{
					name: 'error',
					type: 'unknown | null',
					required: false,
					description: 'When truthy, renders the error state. Two-way bindable (`model`) — emits `errorChange`.'
				},
				{
					name: 'loadingComponent',
					type: 'PaginableStateDefault | null',
					required: false,
					description: 'Per-instance default component for the loading state.'
				},
				{
					name: 'errorComponent',
					type: 'PaginableStateDefault | null',
					required: false,
					description: 'Per-instance default component for the error state.'
				},
				{
					name: 'noResultsComponent',
					type: 'PaginableStateDefault | null',
					required: false,
					description: 'Per-instance default component for the no-results state.'
				}
			],
			outputs: [
				{
					name: 'pageChange',
					type: 'number | null',
					required: false,
					description: 'Emitted by the two-way `page` model when the current page changes.'
				},
				{
					name: 'perPageChange',
					type: 'number | null',
					required: false,
					description: 'Emitted by the two-way `perPage` model when the page size changes.'
				},
				{
					name: 'totalItemsChange',
					type: 'number | null',
					required: false,
					description: 'Emitted by the two-way `totalItems` model (e.g. when a `PaginationState` is bound).'
				},
				{
					name: 'ordinationChange',
					type: 'PaginableTableOrdination',
					required: false,
					description:
						'Emitted by the two-way `ordination` model when sorting changes — use it to drive server-side sorting.'
				},
				{
					name: 'filtersChange',
					type: 'Record<string, unknown> | null',
					required: false,
					description:
						'Emitted by the two-way `filters` model when a column filter changes — use it to drive server-side filtering.'
				},
				{
					name: 'searchTermChange',
					type: 'string',
					required: false,
					description:
						'Emitted by the two-way `searchTerm` model when the global search changes (debounced by `debounce`).'
				},
				{
					name: 'loadingChange',
					type: 'boolean',
					required: false,
					description: 'Emitted by the two-way `loading` model.'
				},
				{
					name: 'errorChange',
					type: 'unknown | null',
					required: false,
					description: 'Emitted by the two-way `error` model.'
				},
				{
					name: 'headersChange',
					type: '(PaginableTableHeader | string)[]',
					required: false,
					description: 'Emitted by the two-way `headers` model when the column configuration changes.'
				}
			],
			templates: [
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.0.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.0.DESCRIPTION',
					example: '<ng-template headerTpt header="name" let-header="header">{{ header.title }}</ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.1.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.1.DESCRIPTION',
					example: '<ng-template cellTpt header="name" let-item="item">{{ item.name }}</ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.2.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.2.DESCRIPTION',
					example: '<ng-template rowTpt let-row><tr><td>{{ row.data.name }}</td></tr></ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.3.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.3.DESCRIPTION',
					example:
						'<ng-template filterTpt header="name" let-fc="formControl"><input [formControl]="fc"></ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.4.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.4.DESCRIPTION',
					example: '<ng-template loadingTpt><div class="spinner"></div></ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.5.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.5.DESCRIPTION',
					example: '<ng-template noResultsTpt><p>No data found</p></ng-template>'
				},
				{
					name: 'DOCS.PAGINABLE.API.TEMPLATE.6.NAME',
					description: 'DOCS.PAGINABLE.API.TEMPLATE.6.DESCRIPTION',
					example: '<ng-template errorTpt><p>Something went wrong</p></ng-template>'
				}
			],
			cssVariables: MD_CSS_VARIABLES['table'] ?? []
		},
		styling: [], // Populated from styling example components
		mixins: {
			...MD_MIXINS['table'],
			demos: [
				{
					title: 'Theming with hub-table-theme',
					previewComponent: MixinThemeTableExampleComponent,
					code: `@use 'ng-hub-ui-paginable/styles' as paginable;

// The table declares its own token defaults on the host element, so the include has to
// reach the table itself: a value set on a bare wrapper is shadowed and never arrives.
.mixin-theme-scope .hub-table {
	@include paginable.hub-table-theme(
		$accent: #6a1b9a,
		$selected-bg: #f3e5f5,
		$selected-color: #4a148c,
		$hover-bg: #faf4fc,
		$border-radius: 0.75rem,
		$cell-padding-y: 0.5rem
	);
}`
				}
			]
		}
	};

	constructor() {
		this.registerExamples();
	}

	ngOnInit(): void {
		this.populateFunctionalitiesFromComponents();
	}

	/**
	 * Registers interactive examples with the ExampleRegistry
	 */
	private registerExamples(): void {
		// 1. Basic Table
		this._exampleRegistry.register({
			id: 'table-basic',
			title: 'DOCS.PAGINABLE.EXAMPLE.BASIC.TITLE',
			componentName: 'BasicTableExampleComponent',
			packagePath: 'table',
			files: ['basic-table-example.component.ts'],
			loader: () => import('../examples/table/basic-table-example.component').then((m) => m.BasicTableExampleComponent)
		});

		// 1b. Agnostic form-controls (search + page-size via ng-hub-ui-forms)
		this._exampleRegistry.register({
			id: 'table-filter-theming',
			title: 'DOCS.PAGINABLE.EXAMPLE.FILTER_THEMING.TITLE',
			componentName: 'FilterThemingTableExampleComponent',
			packagePath: 'table',
			files: ['filter-theming-table-example.component.ts'],
			loader: () =>
				import('../examples/table/filter-theming-table-example.component').then(
					(m) => m.FilterThemingTableExampleComponent
				)
		});

		this._exampleRegistry.register({
			id: 'table-row-menus',
			title: 'DOCS.PAGINABLE.EXAMPLE.ROW_MENUS.TITLE',
			componentName: 'RowMenusTableExampleComponent',
			packagePath: 'table',
			files: ['row-menus-table-example.component.ts'],
			loader: () =>
				import('../examples/table/row-menus-table-example.component').then((m) => m.RowMenusTableExampleComponent)
		});

		this._exampleRegistry.register({
			id: 'table-form-controls',
			title: 'DOCS.PAGINABLE.EXAMPLE.FORM_CONTROLS.TITLE',
			componentName: 'FormControlsTableExampleComponent',
			packagePath: 'table',
			files: ['form-controls-table-example.component.ts'],
			loader: () =>
				import('../examples/table/form-controls-table-example.component').then(
					(m) => m.FormControlsTableExampleComponent
				)
		});

		// 2. CSS Variables
		this._exampleRegistry.register({
			id: 'table-css-variables',
			title: 'DOCS.PAGINABLE.EXAMPLE.CSS_VARIABLES.TITLE',
			componentName: 'CssVariablesTableExampleComponent',
			packagePath: 'table',
			files: ['css-variables-table-example.component.ts'],
			loader: () =>
				import('../examples/table/css-variables-table-example.component').then(
					(m) => m.CssVariablesTableExampleComponent
				)
		});

		// 3. Pagination
		this._exampleRegistry.register({
			id: 'table-pagination',
			title: 'DOCS.PAGINABLE.EXAMPLE.PAGINATION.TITLE',
			componentName: 'PaginatedTableExampleComponent',
			packagePath: 'table',
			files: ['paginated-table-example.component.ts'],
			loader: () =>
				import('../examples/table/paginated-table-example.component').then((m) => m.PaginatedTableExampleComponent)
		});

		// 3b. Client-side pagination (array + paginate=true)
		this._exampleRegistry.register({
			id: 'table-client-pagination',
			title: 'DOCS.PAGINABLE.EXAMPLE.CLIENT_PAGINATION.TITLE',
			componentName: 'ClientPaginationTableExampleComponent',
			packagePath: 'table',
			files: ['client-pagination-table-example.component.ts'],
			loader: () =>
				import('../examples/table/client-pagination-table-example.component').then(
					(m) => m.ClientPaginationTableExampleComponent
				)
		});

		// 4. Sorting & Basic Filtering
		this._exampleRegistry.register({
			id: 'table-sorting-filtering',
			title: 'DOCS.PAGINABLE.EXAMPLE.SORTING_FILTERING.TITLE',
			componentName: 'SortingFilteringTableExampleComponent',
			packagePath: 'table',
			files: ['sorting-filtering-table-example.component.ts'],
			loader: () =>
				import('../examples/table/sorting-filtering-table-example.component').then(
					(m) => m.SortingFilteringTableExampleComponent
				)
		});

		// 5. Advanced Filtering
		this._exampleRegistry.register({
			id: 'table-advanced-filtering',
			title: 'DOCS.PAGINABLE.EXAMPLE.ADVANCED_FILTERING.TITLE',
			componentName: 'AdvancedFilteringTableExampleComponent',
			packagePath: 'table',
			files: ['advanced-filtering-table-example.component.ts'],
			loader: () =>
				import('../examples/table/advanced-filtering-table-example.component').then(
					(m) => m.AdvancedFilteringTableExampleComponent
				)
		});

		this._exampleRegistry.register({
			id: 'table-menu-filters',
			title: 'DOCS.PAGINABLE.EXAMPLE.MENU_FILTERS.TITLE',
			componentName: 'MenuFiltersTableExampleComponent',
			packagePath: 'table',
			files: ['menu-filters-table-example.component.ts'],
			loader: () =>
				import('../examples/table/menu-filters-table-example.component').then((m) => m.MenuFiltersTableExampleComponent)
		});

		// 6. Selection & Batch Actions
		this._exampleRegistry.register({
			id: 'table-selection',
			title: 'DOCS.PAGINABLE.EXAMPLE.SELECTION.TITLE',
			componentName: 'SelectionTableExampleComponent',
			packagePath: 'table',
			files: ['selection-table-example.component.ts'],
			loader: () =>
				import('../examples/table/selection-table-example.component').then((m) => m.SelectionTableExampleComponent)
		});

		// 7. Expandable & Sticky
		this._exampleRegistry.register({
			id: 'table-expandable-sticky',
			title: 'DOCS.PAGINABLE.EXAMPLE.EXPANDABLE_STICKY.TITLE',
			componentName: 'ExpandableStickyTableExampleComponent',
			packagePath: 'table',
			files: ['expandable-sticky-table-example.component.ts'],
			loader: () =>
				import('../examples/table/expandable-sticky-table-example.component').then(
					(m) => m.ExpandableStickyTableExampleComponent
				)
		});

		// 7b. Multiple sticky columns per side
		this._exampleRegistry.register({
			id: 'table-multiple-sticky',
			title: 'DOCS.PAGINABLE.EXAMPLE.MULTIPLE_STICKY.TITLE',
			componentName: 'MultipleStickyColumnsTableExampleComponent',
			packagePath: 'table',
			files: ['multiple-sticky-columns-table-example.component.ts'],
			loader: () =>
				import('../examples/table/multiple-sticky-columns-table-example.component').then(
					(m) => m.MultipleStickyColumnsTableExampleComponent
				)
		});

		// 7c. Themeable header + row divider
		this._exampleRegistry.register({
			id: 'table-themeable-header',
			title: 'DOCS.PAGINABLE.EXAMPLE.THEMEABLE_HEADER.TITLE',
			componentName: 'ThemeableHeaderTableExampleComponent',
			packagePath: 'table',
			files: ['themeable-header-table-example.component.ts'],
			loader: () =>
				import('../examples/table/themeable-header-table-example.component').then(
					(m) => m.ThemeableHeaderTableExampleComponent
				)
		});

		// 7d. Sticky header on scroll
		this._exampleRegistry.register({
			id: 'table-sticky-header-scroll',
			title: 'DOCS.PAGINABLE.EXAMPLE.STICKY_HEADER_SCROLL.TITLE',
			componentName: 'StickyHeaderScrollTableExampleComponent',
			packagePath: 'table',
			files: ['sticky-header-scroll-table-example.component.ts'],
			loader: () =>
				import('../examples/table/sticky-header-scroll-table-example.component').then(
					(m) => m.StickyHeaderScrollTableExampleComponent
				)
		});

		// 7d-bis. Dark re-theming by a plain tag selector (no !important)
		this._exampleRegistry.register({
			id: 'table-tag-retheme-dark',
			title: 'DOCS.PAGINABLE.EXAMPLE.TAG_RETHEME_DARK.TITLE',
			componentName: 'TagRethemeDarkTableExampleComponent',
			packagePath: 'table',
			files: ['tag-retheme-dark-table-example.component.ts'],
			loader: () =>
				import('../examples/table/tag-retheme-dark-table-example.component').then(
					(m) => m.TagRethemeDarkTableExampleComponent
				)
		});

		// 7d-ter. Master-detail selection via [rowClass] (tint + accent bar)
		this._exampleRegistry.register({
			id: 'table-master-detail-selection',
			title: 'DOCS.PAGINABLE.EXAMPLE.MASTER_DETAIL_SELECTION.TITLE',
			componentName: 'MasterDetailSelectionTableExampleComponent',
			packagePath: 'table',
			files: ['master-detail-selection-table-example.component.ts'],
			loader: () =>
				import('../examples/table/master-detail-selection-table-example.component').then(
					(m) => m.MasterDetailSelectionTableExampleComponent
				)
		});

		// 7e. Overridable expander caret icons
		this._exampleRegistry.register({
			id: 'table-caret-icons',
			title: 'DOCS.PAGINABLE.EXAMPLE.CARET_ICONS.TITLE',
			componentName: 'CaretIconsTableExampleComponent',
			packagePath: 'table',
			files: ['caret-icons-table-example.component.ts'],
			loader: () =>
				import('../examples/table/caret-icons-table-example.component').then((m) => m.CaretIconsTableExampleComponent)
		});

		// 7f. Custom icon set (override several --hub-table-icon-* at once)
		this._exampleRegistry.register({
			id: 'table-custom-icons',
			title: 'DOCS.PAGINABLE.EXAMPLE.CUSTOM_ICONS.TITLE',
			componentName: 'CustomIconsTableExampleComponent',
			packagePath: 'table',
			files: ['custom-icons-table-example.component.ts'],
			loader: () =>
				import('../examples/table/custom-icons-table-example.component').then((m) => m.CustomIconsTableExampleComponent)
		});

		// 7g. One-call theming with the hub-table-theme / hub-list-theme mixins
		this._exampleRegistry.register({
			id: 'table-mixin-theme',
			title: 'DOCS.PAGINABLE.EXAMPLE.MIXIN_THEME.TITLE',
			componentName: 'MixinThemeTableExampleComponent',
			packagePath: 'table',
			files: ['mixin-theme-table-example.component.ts'],
			loader: () =>
				import('../examples/table/mixin-theme-table-example.component').then((m) => m.MixinThemeTableExampleComponent)
		});

		// 8. Custom Templates
		this._exampleRegistry.register({
			id: 'table-custom-templates',
			title: 'DOCS.PAGINABLE.EXAMPLE.CUSTOM_TEMPLATES.TITLE',
			componentName: 'CustomTemplatesTableExampleComponent',
			packagePath: 'table',
			files: ['custom-templates-table-example.component.ts'],
			loader: () =>
				import('../examples/table/custom-templates-table-example.component').then(
					(m) => m.CustomTemplatesTableExampleComponent
				)
		});

		// 9. Responsive & States
		this._exampleRegistry.register({
			id: 'table-responsive-states',
			title: 'DOCS.PAGINABLE.EXAMPLE.RESPONSIVE_STATES.TITLE',
			componentName: 'ResponsiveStatesTableExampleComponent',
			packagePath: 'table',
			files: ['responsive-states-table-example.component.ts'],
			loader: () =>
				import('../examples/table/responsive-states-table-example.component').then(
					(m) => m.ResponsiveStatesTableExampleComponent
				)
		});

		// 10. Paginable List
		this._exampleRegistry.register({
			id: 'list-basic',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_BASIC.TITLE',
			componentName: 'ListExampleComponent',
			packagePath: 'table',
			files: ['list-example.component.ts'],
			loader: () => import('../examples/list/list-example.component').then((m) => m.ListExampleComponent)
		});

		// 10b. Connected list (timeline / pipeline)
		this._exampleRegistry.register({
			id: 'list-connected',
			title: 'DOCS.PAGINABLE.EXAMPLE.CONNECTED_LIST.TITLE',
			componentName: 'ConnectedListExampleComponent',
			packagePath: 'table',
			files: ['connected-list-example.component.ts'],
			loader: () =>
				import('../examples/list/connected-list-example.component').then((m) => m.ConnectedListExampleComponent)
		});

		// 10c. Selectable list (pointer cursor + checkbox selection)
		this._exampleRegistry.register({
			id: 'list-selection',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_SELECTION.TITLE',
			componentName: 'SelectionListExampleComponent',
			packagePath: 'table',
			files: ['selection-list-example.component.ts'],
			loader: () =>
				import('../examples/list/selection-list-example.component').then((m) => m.SelectionListExampleComponent)
		});

		// 10d. Flush — the collection as a list rather than a stack of cards
		this._exampleRegistry.register({
			id: 'list-flush',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_FLUSH.TITLE',
			componentName: 'FlushListExampleComponent',
			packagePath: 'table',
			files: ['flush-list-example.component.ts'],
			loader: () => import('../examples/list/flush-list-example.component').then((m) => m.FlushListExampleComponent)
		});

		// 10e. Selecting a tree, searching it, and what a click hands over
		this._exampleRegistry.register({
			id: 'list-group-selection',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_GROUP_SELECTION.TITLE',
			componentName: 'GroupSelectionListExampleComponent',
			packagePath: 'table',
			files: ['group-selection-list-example.component.ts'],
			loader: () =>
				import('../examples/list/group-selection-list-example.component').then(
					(m) => m.GroupSelectionListExampleComponent
				)
		});

		// 10f. Editable table — the controls in the cells drawn as a sheet
		this._exampleRegistry.register({
			id: 'table-editable',
			title: 'DOCS.PAGINABLE.EXAMPLE.TABLE_EDITABLE.TITLE',
			componentName: 'EditableTableExampleComponent',
			packagePath: 'table',
			files: ['editable-table-example.component.ts'],
			loader: () =>
				import('../examples/table/editable-table-example.component').then((m) => m.EditableTableExampleComponent)
		});

		// 11. CSS Variables for List
		this._exampleRegistry.register({
			id: 'list-css-variables',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_CSS_VARIABLES.TITLE',
			componentName: 'CssVariablesListExampleComponent',
			packagePath: 'table',
			files: ['css-variables-list-example.component.ts'],
			loader: () =>
				import('../examples/list/css-variables-list-example.component').then((m) => m.CssVariablesListExampleComponent)
		});

		// 12. Cards list display
		this._exampleRegistry.register({
			id: 'list-cards',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_CARDS.TITLE',
			componentName: 'CardsListExampleComponent',
			packagePath: 'table',
			files: ['cards-list-example.component.ts'],
			loader: () => import('../examples/list/cards-list-example.component').then((m) => m.CardsListExampleComponent)
		});

		// 12b. Nested (tree) list — default and cards layouts
		this._exampleRegistry.register({
			id: 'list-nested',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_NESTED.TITLE',
			componentName: 'NestedListExampleComponent',
			packagePath: 'table',
			files: ['nested-list-example.component.ts'],
			loader: () => import('../examples/list/nested-list-example.component').then((m) => m.NestedListExampleComponent)
		});

		// 12c. Drag & drop reordering (sortable list, handle, cross-list transfer, keyboard)
		this._exampleRegistry.register({
			id: 'list-drag-drop',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_DRAG_DROP.TITLE',
			componentName: 'DragDropListExampleComponent',
			packagePath: 'table',
			files: ['drag-drop-list-example.component.ts'],
			loader: () =>
				import('../examples/list/drag-drop-list-example.component').then((m) => m.DragDropListExampleComponent)
		});

		// 12d. Whole-item drag (no handle — the whole row is draggable)
		this._exampleRegistry.register({
			id: 'list-whole-item-drag',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_WHOLE_ITEM_DRAG.TITLE',
			componentName: 'WholeItemDragListExampleComponent',
			packagePath: 'table',
			files: ['whole-item-drag-list-example.component.ts'],
			loader: () =>
				import('../examples/list/whole-item-drag-list-example.component').then(
					(m) => m.WholeItemDragListExampleComponent
				)
		});

		// 12e. Drag & drop in nested (tree) lists
		this._exampleRegistry.register({
			id: 'list-nested-drag',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_NESTED_DRAG.TITLE',
			componentName: 'NestedDragListExampleComponent',
			packagePath: 'table',
			files: ['nested-drag-list-example.component.ts'],
			loader: () =>
				import('../examples/list/nested-drag-list-example.component').then((m) => m.NestedDragListExampleComponent)
		});

		// 13. Row Class (rowClass)
		this._exampleRegistry.register({
			id: 'table-row-class',
			title: 'DOCS.PAGINABLE.EXAMPLE.ROW_CLASS.TITLE',
			componentName: 'RowClassTableExampleComponent',
			packagePath: 'table',
			files: ['row-class-table-example.component.ts'],
			loader: () =>
				import('../examples/table/row-class-table-example.component').then((m) => m.RowClassTableExampleComponent)
		});

		// 14. Internationalization (i18n)
		this._exampleRegistry.register({
			id: 'table-i18n',
			title: 'DOCS.PAGINABLE.EXAMPLE.I18N.TITLE',
			componentName: 'I18nTableExampleComponent',
			packagePath: 'table',
			files: ['i18n-table-example.component.ts'],
			loader: () => import('../examples/table/i18n-table-example.component').then((m) => m.I18nTableExampleComponent)
		});

		// 15. Batch Actions
		this._exampleRegistry.register({
			id: 'table-batch-actions',
			title: 'DOCS.PAGINABLE.EXAMPLE.BATCH_ACTIONS.TITLE',
			componentName: 'BatchActionsTableExampleComponent',
			packagePath: 'table',
			files: ['batch-actions-table-example.component.ts'],
			loader: () =>
				import('../examples/table/batch-actions-table-example.component').then(
					(m) => m.BatchActionsTableExampleComponent
				)
		});

		// 16. RTL (right-to-left)
		this._exampleRegistry.register({
			id: 'table-rtl',
			title: 'DOCS.PAGINABLE.EXAMPLE.RTL.TITLE',
			componentName: 'RtlPaginableExampleComponent',
			packagePath: 'table',
			files: ['rtl-paginable-example.component.ts'],
			loader: () =>
				import('../examples/table/rtl-paginable-example.component').then((m) => m.RtlPaginableExampleComponent)
		});

		// 16b. Pagination bar placement
		this._exampleRegistry.register({
			id: 'table-pagination-position',
			title: 'DOCS.PAGINABLE.EXAMPLE.PAGINATION_POSITION.TITLE',
			componentName: 'PaginationPositionTableExampleComponent',
			packagePath: 'table',
			files: ['pagination-position-table-example.component.ts'],
			loader: () =>
				import('../examples/table/pagination-position-table-example.component').then(
					(m) => m.PaginationPositionTableExampleComponent
				)
		});

		// 17. Server-side Operations
		this._exampleRegistry.register({
			id: 'table-server-side-operations',
			title: 'DOCS.PAGINABLE.EXAMPLE.SERVER_SIDE_OPERATIONS.TITLE',
			componentName: 'ServerSideOperationsTableExampleComponent',
			packagePath: 'table',
			files: ['server-side-operations-table-example.component.ts'],
			loader: () =>
				import('../examples/table/server-side-operations-table-example.component').then(
					(m) => m.ServerSideOperationsTableExampleComponent
				)
		});

		// 18. Bottom bar ordering
		this._exampleRegistry.register({
			id: 'table-bottom-bar-ordering',
			title: 'DOCS.PAGINABLE.EXAMPLE.BOTTOM_BAR_ORDERING.TITLE',
			componentName: 'BottomBarOrderingPaginableExampleComponent',
			packagePath: 'table',
			files: ['bottom-bar-ordering-paginable-example.component.ts'],
			loader: () =>
				import('../examples/table/bottom-bar-ordering-paginable-example.component').then(
					(m) => m.BottomBarOrderingPaginableExampleComponent
				)
		});

		// 19. Default state components (loading / error / no-results)
		this._exampleRegistry.register({
			id: 'table-default-state-components',
			title: 'DOCS.PAGINABLE.EXAMPLE.DEFAULT_STATE_COMPONENTS.TITLE',
			componentName: 'DefaultStateComponentsTableExampleComponent',
			packagePath: 'table',
			files: ['default-state-components-table-example.component.ts'],
			loader: () =>
				import('../examples/table/default-state-components-table-example.component').then(
					(m) => m.DefaultStateComponentsTableExampleComponent
				)
		});

		// 20. List loading / error / empty states
		this._exampleRegistry.register({
			id: 'list-states',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_STATES.TITLE',
			componentName: 'StatesListExampleComponent',
			packagePath: 'table',
			files: ['states-list-example.component.ts'],
			loader: () => import('../examples/list/states-list-example.component').then((m) => m.StatesListExampleComponent)
		});

		// 21. Row action buttons
		this._exampleRegistry.register({
			id: 'table-action-buttons',
			title: 'DOCS.PAGINABLE.EXAMPLE.ACTION_BUTTONS.TITLE',
			componentName: 'ActionButtonsTableExampleComponent',
			packagePath: 'table',
			files: ['action-buttons-table-example.component.ts'],
			loader: () =>
				import('../examples/table/action-buttons-table-example.component').then(
					(m) => m.ActionButtonsTableExampleComponent
				)
		});

		// 21b. Row action variants
		this._exampleRegistry.register({
			id: 'table-action-variants',
			title: 'DOCS.PAGINABLE.EXAMPLE.ACTION_VARIANTS.TITLE',
			componentName: 'ActionVariantsTableExampleComponent',
			packagePath: 'table',
			files: ['action-variants-table-example.component.ts'],
			loader: () =>
				import('../examples/table/action-variants-table-example.component').then(
					(m) => m.ActionVariantsTableExampleComponent
				)
		});

		// 22. Column visibility
		this._exampleRegistry.register({
			id: 'table-column-visibility',
			title: 'DOCS.PAGINABLE.EXAMPLE.COLUMN_VISIBILITY.TITLE',
			componentName: 'ColumnVisibilityTableExampleComponent',
			packagePath: 'table',
			files: ['column-visibility-table-example.component.ts'],
			loader: () =>
				import('../examples/table/column-visibility-table-example.component').then(
					(m) => m.ColumnVisibilityTableExampleComponent
				)
		});

		// 23. Custom filter templates
		this._exampleRegistry.register({
			id: 'table-custom-filter-templates',
			title: 'DOCS.PAGINABLE.EXAMPLE.CUSTOM_FILTER_TEMPLATES.TITLE',
			componentName: 'CustomFilterTemplatesTableExampleComponent',
			packagePath: 'table',
			files: ['custom-filter-templates-table-example.component.ts'],
			loader: () =>
				import('../examples/table/custom-filter-templates-table-example.component').then(
					(m) => m.CustomFilterTemplatesTableExampleComponent
				)
		});

		// 24. Empty & error states
		this._exampleRegistry.register({
			id: 'table-empty-error-states',
			title: 'DOCS.PAGINABLE.EXAMPLE.EMPTY_ERROR_STATES.TITLE',
			componentName: 'EmptyErrorStatesTableExampleComponent',
			packagePath: 'table',
			files: ['empty-error-states-table-example.component.ts'],
			loader: () =>
				import('../examples/table/empty-error-states-table-example.component').then(
					(m) => m.EmptyErrorStatesTableExampleComponent
				)
		});

		// 25. Resizable columns
		this._exampleRegistry.register({
			id: 'table-resizable-columns',
			title: 'DOCS.PAGINABLE.EXAMPLE.RESIZABLE_COLUMNS.TITLE',
			componentName: 'ResizableColumnsTableExampleComponent',
			packagePath: 'table',
			files: ['resizable-columns-table-example.component.ts'],
			loader: () =>
				import('../examples/table/resizable-columns-table-example.component').then(
					(m) => m.ResizableColumnsTableExampleComponent
				)
		});

		// 26. Row click handling
		this._exampleRegistry.register({
			id: 'table-row-click',
			title: 'DOCS.PAGINABLE.EXAMPLE.ROW_CLICK.TITLE',
			componentName: 'RowClickTableExampleComponent',
			packagePath: 'table',
			files: ['row-click-table-example.component.ts'],
			loader: () =>
				import('../examples/table/row-click-table-example.component').then((m) => m.RowClickTableExampleComponent)
		});

		// 27. A table fed by a whole resource()
		this._exampleRegistry.register({
			id: 'table-resource',
			title: 'DOCS.PAGINABLE.EXAMPLE.RESOURCE.TITLE',
			componentName: 'ResourceTableExampleComponent',
			packagePath: 'table',
			files: ['resource-table-example.component.ts'],
			loader: () =>
				import('../examples/table/resource-table-example.component').then((m) => m.ResourceTableExampleComponent)
		});

		// 28. A row click that marks while a selection is under way, keyboard included
		this._exampleRegistry.register({
			id: 'table-select-while-selecting',
			title: 'DOCS.PAGINABLE.EXAMPLE.SELECT_WHILE_SELECTING.TITLE',
			componentName: 'SelectWhileSelectingTableExampleComponent',
			packagePath: 'table',
			files: ['select-while-selecting-table-example.component.ts'],
			loader: () =>
				import('../examples/table/select-while-selecting-table-example.component').then(
					(m) => m.SelectWhileSelectingTableExampleComponent
				)
		});

		// 29. searchFn and compareFn
		this._exampleRegistry.register({
			id: 'table-compare-search-fn',
			title: 'DOCS.PAGINABLE.EXAMPLE.COMPARE_SEARCH_FN.TITLE',
			componentName: 'CompareSearchFnTableExampleComponent',
			packagePath: 'table',
			files: ['compare-search-fn-table-example.component.ts'],
			loader: () =>
				import('../examples/table/compare-search-fn-table-example.component').then(
					(m) => m.CompareSearchFnTableExampleComponent
				)
		});

		// 30. A list fed by a whole resource(), whose value is a plain array
		this._exampleRegistry.register({
			id: 'list-resource',
			title: 'DOCS.PAGINABLE.EXAMPLE.LIST_RESOURCE.TITLE',
			componentName: 'ResourceListExampleComponent',
			packagePath: 'table',
			files: ['resource-list-example.component.ts'],
			loader: () => import('../examples/list/resource-list-example.component').then((m) => m.ResourceListExampleComponent)
		});

		// 31. The paginator on its own, outside a table
		this._exampleRegistry.register({
			id: 'paginator-basic',
			title: 'DOCS.PAGINABLE.EXAMPLE.PAGINATOR_BASIC.TITLE',
			componentName: 'BasicPaginatorExampleComponent',
			packagePath: 'table',
			files: ['basic-paginator-example.component.ts'],
			loader: () =>
				import('../examples/paginator/basic-paginator-example.component').then((m) => m.BasicPaginatorExampleComponent)
		});
	}

	/**
	 * Populates grouped feature data from registered examples, attaching the
	 * matching standalone component to each entry so the Overview "Feature guides"
	 * section can render a live preview.
	 */
	private populateFunctionalitiesFromComponents(): void {
		const examples = this._exampleRegistry.getAll();

		/**
		 * Maps a registered example, in the given id order, to a FeatureExample
		 * carrying its live preview component.
		 */
		const mapByIds = (ids: string[]): FeatureExample[] =>
			ids
				.map((id) => examples.find((ex) => ex.id === id))
				.filter((ex): ex is NonNullable<typeof ex> => ex !== undefined)
				.map((ex) => ({
					title: ex.title,
					description: ex.title,
					import: '',
					template: '',
					component: '',
					previewComponent: TABLE_PREVIEW_COMPONENTS[ex.id]
				}));

		this.libraryData.functionalities = [
			{
				title: 'DOCS.PAGINABLE.FEATURE.CORE_USAGE.TITLE',
				description: 'DOCS.PAGINABLE.FEATURE.CORE_USAGE.DESCRIPTION',
				examples: mapByIds(['table-basic', 'table-form-controls', 'table-pagination', 'table-css-variables'])
			},
			{
				title: 'DOCS.PAGINABLE.FEATURE.DATA_MANAGEMENT.TITLE',
				description: 'DOCS.PAGINABLE.FEATURE.DATA_MANAGEMENT.DESCRIPTION',
				examples: mapByIds([
					'table-sorting-filtering',
					'table-advanced-filtering',
					'table-selection',
					'table-batch-actions',
					'table-server-side-operations'
				])
			},
			{
				title: 'DOCS.PAGINABLE.FEATURE.ADVANCED_FEATURES.TITLE',
				description: 'DOCS.PAGINABLE.FEATURE.ADVANCED_FEATURES.DESCRIPTION',
				examples: mapByIds([
					'table-expandable-sticky',
					'table-multiple-sticky',
					'table-themeable-header',
					'table-sticky-header-scroll',
					'table-tag-retheme-dark',
					'table-caret-icons',
					'table-custom-icons',
					'table-mixin-theme',
					'table-custom-templates',
					'table-responsive-states',
					'table-default-state-components',
					'table-row-class',
					'table-master-detail-selection',
					'table-i18n',
					'table-rtl',
					'table-bottom-bar-ordering'
				])
			},
			{
				title: 'DOCS.PAGINABLE.FEATURE.LIST_COMPONENTS.TITLE',
				description: 'DOCS.PAGINABLE.FEATURE.LIST_COMPONENTS.DESCRIPTION',
				examples: mapByIds([
					'list-basic',
					'list-connected',
					'list-selection',
					'list-flush',
					'table-editable',
					'list-group-selection',
					'list-css-variables',
					'list-cards',
					'list-nested',
					'list-states'
				])
			}
		];
	}
}
