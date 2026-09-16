import { CardsListExampleComponent } from './cards-list-example.component';
import { ConnectedListExampleComponent } from './connected-list-example.component';
import { CssVariablesListExampleComponent } from './css-variables-list-example.component';
import { DragDropListExampleComponent } from './drag-drop-list-example.component';
import { GroupSelectionListExampleComponent } from './group-selection-list-example.component';
import { ListExampleComponent } from './list-example.component';
import { NestedDragListExampleComponent } from './nested-drag-list-example.component';
import { NestedListExampleComponent } from './nested-list-example.component';
import { ResourceListExampleComponent } from './resource-list-example.component';
import { SelectionListExampleComponent } from './selection-list-example.component';
import { StatesListExampleComponent } from './states-list-example.component';
import { WholeItemDragListExampleComponent } from './whole-item-drag-list-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['CardsListExampleComponent', CardsListExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['ConnectedListExampleComponent', ConnectedListExampleComponent, ['templateCode', 'componentCode']],
	['CssVariablesListExampleComponent', CssVariablesListExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['DragDropListExampleComponent', DragDropListExampleComponent, ['templateCode', 'componentCode']],
	['GroupSelectionListExampleComponent', GroupSelectionListExampleComponent, ['templateCode', 'componentCode']],
	['ListExampleComponent', ListExampleComponent, ['templateCode', 'componentCode']],
	['NestedDragListExampleComponent', NestedDragListExampleComponent, ['templateCode', 'componentCode']],
	['NestedListExampleComponent', NestedListExampleComponent, ['templateCode', 'componentCode']],
	['ResourceListExampleComponent', ResourceListExampleComponent, ['templateCode', 'componentCode']],
	['SelectionListExampleComponent', SelectionListExampleComponent, ['templateCode', 'componentCode']],
	['StatesListExampleComponent', StatesListExampleComponent, ['templateCode', 'componentCode']],
	['WholeItemDragListExampleComponent', WholeItemDragListExampleComponent, ['templateCode', 'componentCode']]
];

describe('list examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
