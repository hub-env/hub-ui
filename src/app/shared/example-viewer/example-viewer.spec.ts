import { provideZoneChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ExampleRegistry } from './example-registry';
import { ExampleViewer } from './example-viewer';

/** Example shaped the way the docs expect: its snippets live on the class. */
class StaticSnippetsExample {
	static readonly templateCode = '<hub-thing />';
	static readonly componentCode = 'export class ThingExample {}';
}

/**
 * Legacy shape, kept here only as a probe: the snippets are instance fields and the class
 * counts how many times it is constructed, so the spec can tell whether the viewer reached
 * for `new`.
 */
class InstanceSnippetsExample {
	static constructions = 0;

	templateCode = '<hub-legacy />';
	componentCode = 'export class LegacyExample {}';

	constructor() {
		InstanceSnippetsExample.constructions++;
	}
}

/** Registers a throwaway example whose loader resolves to the given class. */
function registerExample(id: string, componentType: Type<unknown>): void {
	TestBed.inject(ExampleRegistry).register({
		id,
		title: id,
		componentName: componentType.name,
		packagePath: 'spec',
		files: [],
		loader: async () => componentType
	});
}

/** Mounts the viewer on the given example and waits for its async load to settle. */
async function showExample(id: string): Promise<ExampleViewer> {
	const fixture = TestBed.createComponent(ExampleViewer);
	fixture.componentInstance.example = id;
	await fixture.whenStable();

	return fixture.componentInstance;
}

describe('ExampleViewer code extraction', () => {
	beforeEach(() => {
		InstanceSnippetsExample.constructions = 0;
		TestBed.configureTestingModule({
			providers: [provideRouter([]), provideZoneChangeDetection()]
		});
	});

	it('fills the code tabs from the snippets published on the class', async () => {
		registerExample('spec-static', StaticSnippetsExample);

		const viewer = await showExample('spec-static');

		expect(viewer.exampleTabs()).toEqual({
			HTML: StaticSnippetsExample.templateCode,
			TS: StaticSnippetsExample.componentCode
		});
	});

	it('never constructs the example to reach snippets left on an instance', async () => {
		registerExample('spec-instance', InstanceSnippetsExample);

		const viewer = await showExample('spec-instance');

		expect(InstanceSnippetsExample.constructions).toBe(0);
		expect(viewer.exampleTabs()).toEqual({});
	});
});
