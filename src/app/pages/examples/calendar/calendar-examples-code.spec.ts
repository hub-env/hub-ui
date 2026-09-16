import { BasicCalendarExampleComponent } from './basic-calendar-example.component';
import { ConfigurationCalendarExampleComponent } from './configuration-calendar-example.component';
import { DragDropCalendarExampleComponent } from './drag-drop-calendar-example.component';
import { EventOverflowCalendarExampleComponent } from './event-overflow-calendar-example.component';
import { EventsCalendarExampleComponent } from './events-calendar-example.component';
import { NavigationCalendarExampleComponent } from './navigation-calendar-example.component';
import { StylingCalendarExampleComponent } from './styling-calendar-example.component';
import { TemplatesCalendarExampleComponent } from './templates-calendar-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['BasicCalendarExampleComponent', BasicCalendarExampleComponent, ['templateCode', 'componentCode']],
	['ConfigurationCalendarExampleComponent', ConfigurationCalendarExampleComponent, ['templateCode', 'componentCode']],
	['DragDropCalendarExampleComponent', DragDropCalendarExampleComponent, ['templateCode', 'componentCode']],
	['EventOverflowCalendarExampleComponent', EventOverflowCalendarExampleComponent, ['templateCode', 'componentCode']],
	['EventsCalendarExampleComponent', EventsCalendarExampleComponent, ['templateCode', 'componentCode']],
	['NavigationCalendarExampleComponent', NavigationCalendarExampleComponent, ['templateCode', 'componentCode']],
	['StylingCalendarExampleComponent', StylingCalendarExampleComponent, ['templateCode', 'componentCode']],
	['TemplatesCalendarExampleComponent', TemplatesCalendarExampleComponent, ['templateCode', 'componentCode']]
];

describe('calendar examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
