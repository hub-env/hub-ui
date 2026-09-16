import { BrandSlotNavExampleComponent } from './brand-slot-nav-example.component';
import { CustomItemTemplateNavExampleComponent } from './custom-item-template-nav-example.component';
import { DisabledStatesNavExampleComponent } from './disabled-states-nav-example.component';
import { DropdownTriggersNavExampleComponent } from './dropdown-triggers-nav-example.component';
import { EventsApiNavExampleComponent } from './events-api-nav-example.component';
import { HeadersSeparatorsNavExampleComponent } from './headers-separators-nav-example.component';
import { MixedExpandModesNavExampleComponent } from './mixed-expand-modes-nav-example.component';
import { ResponsiveCollapseNavExampleComponent } from './responsive-collapse-nav-example.component';
import { RouterActiveNavExampleComponent } from './router-active-nav-example.component';
import { RtlNavExampleComponent } from './rtl-nav-example.component';
import { SidebarRightPanelNavExampleComponent } from './sidebar-right-panel-nav-example.component';
import { VerticalFlyoutNavExampleComponent } from './vertical-flyout-nav-example.component';
import { VerticalStickyNavExampleComponent } from './vertical-sticky-nav-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['BrandSlotNavExampleComponent', BrandSlotNavExampleComponent, ['templateCode', 'componentCode']],
	['CustomItemTemplateNavExampleComponent', CustomItemTemplateNavExampleComponent, ['templateCode', 'componentCode']],
	['DisabledStatesNavExampleComponent', DisabledStatesNavExampleComponent, ['templateCode', 'componentCode']],
	['DropdownTriggersNavExampleComponent', DropdownTriggersNavExampleComponent, ['templateCode', 'componentCode']],
	['EventsApiNavExampleComponent', EventsApiNavExampleComponent, ['templateCode', 'componentCode']],
	['HeadersSeparatorsNavExampleComponent', HeadersSeparatorsNavExampleComponent, ['templateCode', 'componentCode']],
	['MixedExpandModesNavExampleComponent', MixedExpandModesNavExampleComponent, ['templateCode', 'componentCode']],
	['ResponsiveCollapseNavExampleComponent', ResponsiveCollapseNavExampleComponent, ['templateCode', 'componentCode']],
	['RouterActiveNavExampleComponent', RouterActiveNavExampleComponent, ['templateCode', 'componentCode']],
	['RtlNavExampleComponent', RtlNavExampleComponent, ['templateCode', 'componentCode']],
	['SidebarRightPanelNavExampleComponent', SidebarRightPanelNavExampleComponent, ['templateCode', 'componentCode']],
	['VerticalFlyoutNavExampleComponent', VerticalFlyoutNavExampleComponent, ['templateCode', 'componentCode']],
	['VerticalStickyNavExampleComponent', VerticalStickyNavExampleComponent, ['templateCode', 'componentCode']]
];

describe('nav examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
