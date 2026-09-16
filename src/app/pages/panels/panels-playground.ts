import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HubPanelComponent, HubPanelsComponent, PanelsType } from 'ng-hub-ui-panels';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Thin, SSR-safe preview wrapper for the panels playground.
 *
 * Panels require content projection (`<hub-panel>` panes inside `<hub-panels>`),
 * which the generic playground host cannot synthesise. This wrapper renders a
 * canonical tabset with three panels and re-exposes the container's configurable
 * options as its own `input()`s, mapped 1:1 to the real {@link HubPanelsComponent}
 * inputs. The playground binds the controls to these inputs.
 *
 * No global `document` / `window` access happens at construction, so the wrapper
 * is safe to instantiate during server-side rendering.
 */
@Component({
	selector: 'app-panels-playground-preview',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels
			[type]="type()"
			[vertical]="vertical()"
			[justified]="justified()"
			[scrollable]="scrollable()"
			[multiple]="multiple()"
			[flush]="flush()"
			[isKeysAllowed]="isKeysAllowed()"
		>
			<hub-panel heading="Overview">The first enabled panel is activated automatically.</hub-panel>
			<hub-panel heading="Details">Switch panels with a click or the arrow keys.</hub-panel>
			<hub-panel heading="Settings">Each panel projects its own content.</hub-panel>
		</hub-panels>
	`
})
export class PanelsPlaygroundPreviewComponent {
	/** Visualization — `'tabs'`, `'pills'` or `'accordion'`. */
	readonly type = input<PanelsType>('tabs');

	/** Whether the panel list is stacked beside the content (`tabs` / `pills`). */
	readonly vertical = input(false, { transform: booleanAttribute });

	/** Whether panel headers stretch to share the available width equally. */
	readonly justified = input(false, { transform: booleanAttribute });

	/** Whether overflowing headers get backward/forward scroll buttons. */
	readonly scrollable = input(false, { transform: booleanAttribute });

	/** Whether several panels may be active (expanded) at once. */
	readonly multiple = input(false, { transform: booleanAttribute });

	/** Accordion view: edge-to-edge panels without outer borders or radius. */
	readonly flush = input(false, { transform: booleanAttribute });

	/** Whether keyboard navigation (arrows / Home / End) is enabled. */
	readonly isKeysAllowed = input(true, { transform: booleanAttribute });
}

/**
 * Interactive playground definitions for the ng-hub-ui-panels documentation page.
 * The single config drives the container's real inputs through the SSR-safe
 * preview wrapper and themes the live `--hub-panels-*` token contract.
 */
export const PANELS_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'panels',
		title: 'Panels',
		tag: 'hub-panels',
		description:
			'A content-panels container. Switch the type between tabs, pills and accordion, then stack them vertically, justify the headers or allow multiple panels open at once.',
		component: PanelsPlaygroundPreviewComponent,
		controls: [
			{
				name: 'type',
				label: 'Type',
				type: 'select',
				default: 'tabs',
				options: [
					{ label: 'tabs', value: 'tabs' },
					{ label: 'pills', value: 'pills' },
					{ label: 'accordion', value: 'accordion' }
				]
			},
			{
				name: 'vertical',
				label: 'Vertical',
				type: 'boolean',
				default: false,
				description: 'Stacks the header strip beside the content. Ignored in the accordion view.'
			},
			{
				name: 'justified',
				label: 'Justified',
				type: 'boolean',
				default: false,
				description: 'Headers stretch to share the available width equally (tabs / pills).'
			},
			{
				name: 'scrollable',
				label: 'Scrollable',
				type: 'boolean',
				default: false,
				description: 'Overflowing headers get backward / forward scroll buttons (tabs / pills).'
			},
			{
				name: 'multiple',
				label: 'Multiple',
				type: 'boolean',
				default: false,
				description: 'Allows several panels to be active at once (side-by-side panes, or expanded in accordion view).'
			},
			{
				name: 'flush',
				label: 'Flush',
				type: 'boolean',
				default: false,
				description: 'Accordion view only: edge-to-edge panels without outer borders or radius.'
			},
			{ name: 'isKeysAllowed', label: 'Keyboard navigation', type: 'boolean', default: true }
		],
		cssVariables: [
			{ name: '--hub-panels-content-bg', label: 'Content background', type: 'color', default: '#ffffff' },
			{ name: '--hub-panels-border-color', label: 'Border color', type: 'color', default: '#dee2e6' },
			{ name: '--hub-panels-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-panels-content-padding-x', label: 'Content padding X', type: 'text', default: '1rem' },
			{ name: '--hub-panels-content-padding-y', label: 'Content padding Y', type: 'text', default: '1rem' },
			{ name: '--hub-panels-nav-link-color', label: 'Header color', type: 'color', default: '#212529' },
			{ name: '--hub-panels-nav-link-hover-color', label: 'Header hover color', type: 'color', default: '#0a58ca' },
			{ name: '--hub-panels-nav-link-active-color', label: 'Active header color', type: 'color', default: '#0d6efd' },
			{
				name: '--hub-panels-tab-border-color-active',
				label: 'Active tab border (tabs)',
				type: 'color',
				default: '#0d6efd'
			},
			{ name: '--hub-panels-tab-bg-hover', label: 'Header hover background', type: 'color', default: '#f8f9fa' },
			{ name: '--hub-panels-pill-bg-active', label: 'Active pill background (pills)', type: 'color', default: '#0d6efd' },
			{ name: '--hub-panels-pill-color-active', label: 'Active pill text (pills)', type: 'color', default: '#ffffff' },
			{
				name: '--hub-panels-accordion-active-color',
				label: 'Accordion active header color',
				type: 'color',
				default: '#0c63e4'
			},
			{
				name: '--hub-panels-accordion-active-bg',
				label: 'Accordion active header background',
				type: 'color',
				default: '#e7f1ff'
			}
		]
	}
];
