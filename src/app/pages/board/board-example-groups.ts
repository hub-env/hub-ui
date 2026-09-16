/**
 * Section headings for the ng-hub-ui-board Examples tab and its nav panel.
 *
 * Sixteen examples, most of them about dragging something somewhere; the split separates what
 * the board *is* from how it *moves*, so the reader looking for a template does not scroll past
 * six drag variants to find it.
 *
 * Ids reference examples registered with the `ExampleRegistry` in `board.component.ts`. An
 * example missing from every group still renders, in a trailing untitled section.
 */
export const BOARD_EXAMPLE_GROUPS: ReadonlyArray<{ title: string; exampleIds: string[] }> = [
	{
		title: 'DOCS.BOARD.GROUP.BASICS.TITLE',
		exampleIds: ['board-basic', 'board-card-click', 'board-events', 'board-infinite-scroll']
	},
	{
		title: 'DOCS.BOARD.GROUP.DRAG_AND_DROP.TITLE',
		exampleIds: [
			'board-card-drag-drop',
			'board-keyboard-accessibility',
			'board-column-reordering',
			'board-disable-sorting',
			'board-drag-behavior',
			'board-drag-preview'
		]
	},
	{
		title: 'DOCS.BOARD.GROUP.TEMPLATES.TITLE',
		exampleIds: ['board-custom-card-template', 'board-custom-header-template', 'board-custom-footer-template']
	},
	{
		title: 'DOCS.BOARD.GROUP.PLACEHOLDERS_STYLING.TITLE',
		exampleIds: ['board-card-placeholder', 'board-column-placeholder', 'board-styling-customization']
	}
];
