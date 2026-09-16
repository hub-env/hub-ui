import { LayoutBuilderComponent } from './layout-builder/layout-builder.component';
import { ManualSortableComponent } from './manual-sortable/manual-sortable.component';
import { MultipleListsComponent } from './multiple-lists/multiple-lists.component';
import { SortableFormArrayComponent } from './sortable-form-array/sortable-form-array.component';
import { SortableSignalComponent } from './sortable-signal/sortable-signal.component';
import { SortableWithOptionsComponent } from './sortable-with-options/sortable-with-options.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['LayoutBuilderComponent', LayoutBuilderComponent, ['templateCode', 'componentCode']],
	['ManualSortableComponent', ManualSortableComponent, ['templateCode', 'componentCode']],
	['MultipleListsComponent', MultipleListsComponent, ['templateCode', 'componentCode']],
	['SortableFormArrayComponent', SortableFormArrayComponent, ['templateCode', 'componentCode']],
	['SortableSignalComponent', SortableSignalComponent, ['templateCode', 'componentCode']],
	['SortableWithOptionsComponent', SortableWithOptionsComponent, ['templateCode', 'componentCode']]
];

describe('sortable examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
