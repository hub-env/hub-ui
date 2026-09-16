/**
 * Feature groups for the ng-hub-ui-loading documentation page.
 *
 * Each group references example IDs registered with the `ExampleRegistry` in
 * `loading.component.ts`. The same constant is consumed by the app shell to give the
 * examples panel its section headings, so the panel order and the page order cannot drift.
 */
export const LOADING_FUNCTIONALITIES = [
	{
		title: 'DOCS.LOADING.FEATURE.INLINE_BLOCK.TITLE',
		description: 'DOCS.LOADING.FEATURE.INLINE_BLOCK.DESCRIPTION',
		exampleIds: ['loading-basic-usage']
	},
	{
		title: 'DOCS.LOADING.FEATURE.INDICATORS_AND_ACCENTS.TITLE',
		description: 'DOCS.LOADING.FEATURE.INDICATORS_AND_ACCENTS.DESCRIPTION',
		exampleIds: ['loading-indicator-variants']
	},
	{
		title: 'DOCS.LOADING.FEATURE.OVERLAY_AND_FULLSCREEN.TITLE',
		description: 'DOCS.LOADING.FEATURE.OVERLAY_AND_FULLSCREEN.DESCRIPTION',
		exampleIds: ['loading-container-overlay', 'loading-fullscreen-service']
	},
	{
		title: 'DOCS.LOADING.FEATURE.BRANDING_AND_THEMING.TITLE',
		description: 'DOCS.LOADING.FEATURE.BRANDING_AND_THEMING.DESCRIPTION',
		exampleIds: ['loading-branded-image', 'loading-css-variables']
	},
	{
		title: 'DOCS.LOADING.FEATURE.PAGE_PROGRESS_BAR.TITLE',
		description: 'DOCS.LOADING.FEATURE.PAGE_PROGRESS_BAR.DESCRIPTION',
		exampleIds: ['loading-page-progress', 'loading-determinate-bar', 'loading-router-http-bar', 'loading-rtl-sweep']
	}
];
