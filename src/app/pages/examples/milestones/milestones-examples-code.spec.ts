import { MilestonesCssVariablesExampleComponent } from './css-variables-milestones-example.component';
import { MilestonesCustomNodesExampleComponent } from './custom-nodes-milestones-example.component';
import { MilestonesHorizontalExampleComponent } from './horizontal-milestones-example.component';
import { MilestonesHorizontalPulseExampleComponent } from './horizontal-pulse-milestones-example.component';
import { MilestonesStatesExampleComponent } from './states-milestones-example.component';
import { MilestonesVerticalExampleComponent } from './vertical-milestones-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['MilestonesCssVariablesExampleComponent', MilestonesCssVariablesExampleComponent, ['templateCode', 'componentCode']],
	['MilestonesCustomNodesExampleComponent', MilestonesCustomNodesExampleComponent, ['templateCode', 'componentCode']],
	['MilestonesHorizontalExampleComponent', MilestonesHorizontalExampleComponent, ['templateCode', 'componentCode']],
	['MilestonesHorizontalPulseExampleComponent', MilestonesHorizontalPulseExampleComponent, ['templateCode', 'componentCode']],
	['MilestonesStatesExampleComponent', MilestonesStatesExampleComponent, ['templateCode', 'componentCode']],
	['MilestonesVerticalExampleComponent', MilestonesVerticalExampleComponent, ['templateCode', 'componentCode']]
];

describe('milestones examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
