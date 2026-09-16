import { BasicPaginatorExampleComponent } from './basic-paginator-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a snippet
 * parked on an instance field simply does not reach the code tab. This folder starts with one
 * example; pinning the static shape now keeps the next one from silently shipping empty tabs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['BasicPaginatorExampleComponent', BasicPaginatorExampleComponent, ['templateCode', 'componentCode']]
];

describe('paginator examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
