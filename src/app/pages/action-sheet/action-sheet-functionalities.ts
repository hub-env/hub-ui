/**
 * Feature groups for the ng-hub-ui-action-sheet documentation page.
 *
 * Each group references example IDs registered with the `ExampleRegistry` in
 * `action-sheet.component.ts`. The same constant is consumed by the app shell to give the
 * examples panel its section headings, so the panel order and the page order cannot drift.
 */
export const ACTION_SHEET_FUNCTIONALITIES = [
	{
		title: 'DOCS.ACTION_SHEET.FEATURE.OPENING.TITLE',
		description: 'DOCS.ACTION_SHEET.FEATURE.OPENING.DESCRIPTION',
		exampleIds: ['action-sheet-basic']
	},
	{
		title: 'DOCS.ACTION_SHEET.FEATURE.ROLES.TITLE',
		description: 'DOCS.ACTION_SHEET.FEATURE.ROLES.DESCRIPTION',
		exampleIds: ['action-sheet-roles']
	},
	{
		title: 'DOCS.ACTION_SHEET.FEATURE.GROUPS.TITLE',
		description: 'DOCS.ACTION_SHEET.FEATURE.GROUPS.DESCRIPTION',
		exampleIds: ['action-sheet-groups']
	},
	{
		title: 'DOCS.ACTION_SHEET.FEATURE.THEMING.TITLE',
		description: 'DOCS.ACTION_SHEET.FEATURE.THEMING.DESCRIPTION',
		exampleIds: ['action-sheet-theming']
	}
];
