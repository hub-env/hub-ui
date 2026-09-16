import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
	HubNavComponent,
	HubNavCollapseMode,
	HubNavConfig,
	HubNavDropdownRenderMode,
	HubNavDropdownTrigger,
	HubNavItem,
	HubNavOrientation,
	HubNavPosition,
	HubNavSidebarSide,
	HubNavVerticalExpandMode
} from 'ng-hub-ui-nav';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Canonical sample item tree rendered by the playground preview. Mirrors a typical
 * application sidebar: a flat link, a section with children, and a settings dropdown.
 */
const SAMPLE_ITEMS: HubNavItem[] = [
	{ id: 'dashboard', label: 'Dashboard', type: 'link', icon: 'fa-solid fa-gauge', route: '/nav' },
	{
		id: 'projects',
		label: 'Projects',
		type: 'dropdown',
		icon: 'fa-solid fa-folder',
		children: [
			{ id: 'projects-active', label: 'Active', type: 'link', route: '/nav', badge: '4' },
			{ id: 'projects-archived', label: 'Archived', type: 'link', route: '/nav' },
			{ id: 'projects-shared', label: 'Shared with me', type: 'link', route: '/nav' }
		]
	},
	{
		id: 'settings',
		label: 'Settings',
		type: 'dropdown',
		icon: 'fa-solid fa-gear',
		children: [
			{ id: 'settings-profile', label: 'Profile', type: 'link', route: '/nav' },
			{ id: 'settings-team', label: 'Team', type: 'link', route: '/nav' },
			{ id: 'settings-billing', label: 'Billing', type: 'link', route: '/nav', disabled: true }
		]
	}
];

/**
 * SSR-safe thin wrapper around {@link HubNavComponent} for the live playground.
 *
 * Each configurable {@link HubNavConfig} option is exposed as a standalone `input()`
 * (mapped 1:1 to a playground control) and assembled into the `config` object handed
 * to the real `hub-nav`. The wrapper performs no `document`/`window` access at
 * initialization, so it renders safely under server-side rendering.
 */
@Component({
	selector: 'app-nav-playground-preview',
	standalone: true,
	imports: [HubNavComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<hub-nav [items]="items" [config]="config()" />`,
	styles: [
		`
			:host {
				display: block;
				width: 100%;
			}
		`
	]
})
export class NavPlaygroundPreviewComponent {
	/** Fixed sample item tree used for every preview render. */
	protected readonly items = SAMPLE_ITEMS;

	/** Orientation of the navigation layout. */
	readonly orientation = input<HubNavOrientation>('horizontal');

	/** Expansion mode for child items in vertical orientation. */
	readonly verticalExpandMode = input<HubNavVerticalExpandMode>('accordion');

	/** Trigger mechanism for opening dropdowns. */
	readonly dropdownTrigger = input<HubNavDropdownTrigger>('click');

	/** Rendering strategy for dropdown and flyout menus. */
	readonly dropdownRenderMode = input<HubNavDropdownRenderMode>('inline');

	/** CSS positioning strategy for the nav container. */
	readonly position = input<HubNavPosition>('static');

	/** Display mode when the menu collapses on smaller viewports. */
	readonly collapseMode = input<HubNavCollapseMode>('offcanvas');

	/** Viewport width in pixels below which the menu collapses (`0` disables collapsing). */
	readonly collapseBreakpoint = input<number>(992);

	/** Physical side where the sidebar is placed in panel/vertical layouts. */
	readonly sidebarSide = input<HubNavSidebarSide>('left');

	/** Width of each panel in panel expand mode. */
	readonly panelWidth = input<string>('16rem');

	/** Maximum number of simultaneously visible panels in panel expand mode. */
	readonly panelMaxVisible = input<number>(3);

	/**
	 * Effective configuration object passed to the real `hub-nav`, recomputed from the
	 * individual playground-driven inputs.
	 */
	readonly config = computed<Partial<HubNavConfig>>(() => ({
		orientation: this.orientation(),
		verticalExpandMode: this.verticalExpandMode(),
		dropdownTrigger: this.dropdownTrigger(),
		dropdownRenderMode: this.dropdownRenderMode(),
		position: this.position(),
		collapseMode: this.collapseMode(),
		collapseBreakpoint: this.collapseBreakpoint(),
		sidebarSide: this.sidebarSide(),
		panelWidth: this.panelWidth(),
		panelMaxVisible: this.panelMaxVisible()
	}));
}

/** Orientation options. */
const ORIENTATION_OPTIONS = [
	{ label: 'horizontal', value: 'horizontal' },
	{ label: 'vertical', value: 'vertical' }
];

/** Vertical expand-mode options. */
const EXPAND_MODE_OPTIONS = [
	{ label: 'accordion', value: 'accordion' },
	{ label: 'flyout', value: 'flyout' },
	{ label: 'panel', value: 'panel' }
];

/** Dropdown-trigger options. */
const DROPDOWN_TRIGGER_OPTIONS = [
	{ label: 'click', value: 'click' },
	{ label: 'hover', value: 'hover' },
	{ label: 'both', value: 'both' }
];

/** Dropdown render-mode options. */
const DROPDOWN_RENDER_MODE_OPTIONS = [
	{ label: 'inline', value: 'inline' },
	{ label: 'overlay', value: 'overlay' }
];

/** Positioning-strategy options. */
const POSITION_OPTIONS = [
	{ label: 'static', value: 'static' },
	{ label: 'sticky', value: 'sticky' },
	{ label: 'fixed', value: 'fixed' }
];

/** Collapse-mode options. */
const COLLAPSE_MODE_OPTIONS = [
	{ label: 'offcanvas', value: 'offcanvas' },
	{ label: 'dropdown', value: 'dropdown' },
	{ label: 'fullscreen', value: 'fullscreen' }
];

/** Sidebar-side options. */
const SIDEBAR_SIDE_OPTIONS = [
	{ label: 'left', value: 'left' },
	{ label: 'right', value: 'right' }
];

/**
 * Builds the `<hub-nav>` snippet for the playground, emitting a single `[config]`
 * object literal containing only the options that differ from the nav defaults.
 *
 * @param inputs - Live playground input values keyed by control name.
 * @returns A copy-pasteable `hub-nav` template snippet.
 */
function buildNavSnippet(inputs: Record<string, unknown>): string {
	const defaults: Record<string, unknown> = {
		orientation: 'horizontal',
		verticalExpandMode: 'accordion',
		dropdownTrigger: 'click',
		dropdownRenderMode: 'inline',
		position: 'static',
		collapseMode: 'offcanvas',
		collapseBreakpoint: 992,
		sidebarSide: 'left',
		panelWidth: '16rem',
		panelMaxVisible: 3
	};

	const entries = Object.keys(defaults)
		.filter((key) => inputs[key] !== undefined && inputs[key] !== defaults[key])
		.map((key) => {
			const value = inputs[key];
			const literal = typeof value === 'string' ? `'${value}'` : value;
			return `\t\t${key}: ${literal}`;
		});

	if (entries.length === 0) {
		return `<hub-nav [items]="items" />`;
	}

	return `<hub-nav\n\t[items]="items"\n\t[config]="{\n${entries.join(',\n')}\n\t}"\n/>`;
}

/**
 * Interactive playground definition for the ng-hub-ui-nav documentation page.
 * Exposes the real {@link HubNavConfig} options as live controls and the nav's
 * canonical `--hub-nav-*` tokens for in-place theming.
 */
export const NAV_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'nav',
		title: 'Nav',
		tag: 'hub-nav',
		description:
			'A data-driven navigation built from a sample item tree (Dashboard, Projects, Settings). Switch orientation to vertical and try the accordion / flyout / panel expand modes.',
		component: NavPlaygroundPreviewComponent,
		codeTemplate: buildNavSnippet,
		controls: [
			{ name: 'orientation', label: 'Orientation', type: 'select', default: 'horizontal', options: ORIENTATION_OPTIONS },
			{
				name: 'verticalExpandMode',
				label: 'Vertical expand mode',
				type: 'select',
				default: 'accordion',
				options: EXPAND_MODE_OPTIONS,
				description: 'Only applies when orientation is "vertical".'
			},
			{
				name: 'dropdownTrigger',
				label: 'Dropdown trigger',
				type: 'select',
				default: 'click',
				options: DROPDOWN_TRIGGER_OPTIONS
			},
			{
				name: 'dropdownRenderMode',
				label: 'Dropdown render mode',
				type: 'select',
				default: 'inline',
				options: DROPDOWN_RENDER_MODE_OPTIONS,
				description: 'Use "overlay" to render submenus in a body-level overlay and avoid clipping.'
			},
			{ name: 'position', label: 'Position', type: 'select', default: 'static', options: POSITION_OPTIONS },
			{
				name: 'collapseMode',
				label: 'Collapse mode',
				type: 'select',
				default: 'offcanvas',
				options: COLLAPSE_MODE_OPTIONS
			},
			{
				name: 'collapseBreakpoint',
				label: 'Collapse breakpoint (px)',
				type: 'number',
				default: 992,
				min: 0,
				step: 1,
				description: 'Viewport width below which the nav collapses. Set 0 to disable responsive collapsing.'
			},
			{
				name: 'sidebarSide',
				label: 'Sidebar side',
				type: 'select',
				default: 'left',
				options: SIDEBAR_SIDE_OPTIONS,
				description: 'Side the sidebar sits on; panels extend toward the opposite edge.'
			},
			{
				name: 'panelWidth',
				label: 'Panel width',
				type: 'text',
				default: '16rem',
				description: 'Width of each panel in panel expand mode.'
			},
			{
				name: 'panelMaxVisible',
				label: 'Max visible panels',
				type: 'number',
				default: 3,
				min: 1,
				step: 1,
				description: 'Beyond this count the last panel drills down with back navigation.'
			}
		],
		cssVariables: [
			{ name: '--hub-nav-bg', label: 'Background', type: 'color', default: '#ffffff' },
			{ name: '--hub-nav-color', label: 'Text color', type: 'color', default: '#212529' },
			{ name: '--hub-nav-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-nav-gap', label: 'Item gap', type: 'text', default: '0.25rem' },
			{ name: '--hub-nav-item-color', label: 'Item text', type: 'color', default: '#212529' },
			{ name: '--hub-nav-item-padding-x', label: 'Item padding X', type: 'text', default: '1rem' },
			{ name: '--hub-nav-item-padding-y', label: 'Item padding Y', type: 'text', default: '0.5rem' },
			{ name: '--hub-nav-item-border-radius', label: 'Item radius', type: 'text', default: '0.25rem' },
			{ name: '--hub-nav-item-hover-bg', label: 'Item hover bg', type: 'color', default: '#f1f3f5' },
			{ name: '--hub-nav-item-hover-color', label: 'Item hover text', type: 'color', default: '#0d6efd' },
			{ name: '--hub-nav-item-active-bg', label: 'Active item bg', type: 'color', default: '#0d6efd' },
			{ name: '--hub-nav-item-active-color', label: 'Active item text', type: 'color', default: '#ffffff' },
			{ name: '--hub-nav-dropdown-bg', label: 'Dropdown bg', type: 'color', default: '#ffffff' },
			{ name: '--hub-nav-dropdown-border-color', label: 'Dropdown border', type: 'color', default: '#dee2e6' },
			{ name: '--hub-nav-dropdown-border-radius', label: 'Dropdown radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-nav-dropdown-min-width', label: 'Dropdown min width', type: 'text', default: '12rem' },
			{ name: '--hub-nav-icon-size', label: 'Icon size', type: 'text', default: '1.25rem' },
			{ name: '--hub-nav-icon-gap', label: 'Icon gap', type: 'text', default: '0.5rem' },
			{ name: '--hub-nav-panel-width', label: 'Panel width (panel mode)', type: 'text', default: '16rem' },
			{ name: '--hub-nav-panel-bg', label: 'Panel bg (panel mode)', type: 'color', default: '#ffffff' }
		]
	}
];
