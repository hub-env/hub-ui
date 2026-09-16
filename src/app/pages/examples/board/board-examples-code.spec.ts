import { BasicBoardExampleComponent } from './basic-board-example.component';
import { CardClickExampleComponent } from './card-click-example.component';
import { CardDragDropExampleComponent } from './card-drag-drop-example.component';
import { CardPlaceholderExampleComponent } from './card-placeholder-example.component';
import { ColumnPlaceholderExampleComponent } from './column-placeholder-example.component';
import { ColumnReorderingExampleComponent } from './column-reordering-example.component';
import { CustomCardTemplateExampleComponent } from './custom-card-template-example.component';
import { CustomFooterTemplateExampleComponent } from './custom-footer-template-example.component';
import { CustomHeaderTemplateExampleComponent } from './custom-header-template-example.component';
import { DisableSortingExampleComponent } from './disable-sorting-example.component';
import { DragBehaviorExampleComponent } from './drag-behavior-example.component';
import { DragPreviewExampleComponent } from './drag-preview-example.component';
import { EventsBoardExampleComponent } from './events-board-example.component';
import { InfiniteScrollExampleComponent } from './infinite-scroll-example.component';
import { StylingBoardExampleComponent } from './styling-board-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['BasicBoardExampleComponent', BasicBoardExampleComponent, ['templateCode', 'componentCode']],
	['CardClickExampleComponent', CardClickExampleComponent, ['templateCode', 'componentCode']],
	['CardDragDropExampleComponent', CardDragDropExampleComponent, ['templateCode', 'componentCode']],
	['CardPlaceholderExampleComponent', CardPlaceholderExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['ColumnPlaceholderExampleComponent', ColumnPlaceholderExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['ColumnReorderingExampleComponent', ColumnReorderingExampleComponent, ['templateCode', 'componentCode']],
	['CustomCardTemplateExampleComponent', CustomCardTemplateExampleComponent, ['templateCode', 'componentCode']],
	['CustomFooterTemplateExampleComponent', CustomFooterTemplateExampleComponent, ['templateCode', 'componentCode']],
	['CustomHeaderTemplateExampleComponent', CustomHeaderTemplateExampleComponent, ['templateCode', 'componentCode']],
	['DisableSortingExampleComponent', DisableSortingExampleComponent, ['templateCode', 'componentCode']],
	['DragBehaviorExampleComponent', DragBehaviorExampleComponent, ['templateCode', 'componentCode', 'dataCode']],
	['DragPreviewExampleComponent', DragPreviewExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['EventsBoardExampleComponent', EventsBoardExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['InfiniteScrollExampleComponent', InfiniteScrollExampleComponent, ['templateCode', 'componentCode', 'cssCode']],
	['StylingBoardExampleComponent', StylingBoardExampleComponent, ['templateCode', 'componentCode', 'cssCode']]
];

describe('board examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
