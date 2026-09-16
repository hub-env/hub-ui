/**
 * Feature groups for the `ng-hub-ui` (installer) documentation page.
 *
 * Each group references example IDs registered with the `ExampleRegistry` in
 * `installer.component.ts`. The same constant is consumed by the app shell to give the
 * examples panel its section headings, so the panel order and the page order cannot drift.
 */
export const INSTALLER_FUNCTIONALITIES = [
	{
		title: 'DOCS.INSTALLER.FEATURE.ONE_COMMAND.TITLE',
		description: 'DOCS.INSTALLER.FEATURE.ONE_COMMAND.DESCRIPTION',
		exampleIds: ['installer-interactive']
	},
	{
		title: 'DOCS.INSTALLER.FEATURE.SCRIPTABLE.TITLE',
		description: 'DOCS.INSTALLER.FEATURE.SCRIPTABLE.DESCRIPTION',
		exampleIds: ['installer-non-interactive']
	},
	{
		title: 'DOCS.INSTALLER.FEATURE.RESOLVED_DEPENDENCIES.TITLE',
		description: 'DOCS.INSTALLER.FEATURE.RESOLVED_DEPENDENCIES.DESCRIPTION',
		exampleIds: ['installer-resolved-dependencies']
	}
];
