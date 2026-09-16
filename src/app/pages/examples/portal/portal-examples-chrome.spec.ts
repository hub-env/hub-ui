import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PositioningPortalExampleComponent } from './positioning-portal-example.component';
import { ServicePortalExampleComponent } from './service-portal-example.component';

/**
 * An example renders the demo and nothing else: the title, the description and the demo/code
 * tabs belong to ExampleViewer, which reads the title from the registry and therefore through
 * i18n. An example that draws its own chrome hardcodes that copy in one language and shows the
 * reader two sets of tabs.
 */
const EXAMPLES = [
	['PositioningPortalExampleComponent', PositioningPortalExampleComponent],
	['ServicePortalExampleComponent', ServicePortalExampleComponent]
] as const;

describe('portal examples render only their demo', () => {
	it.each(EXAMPLES)('%s draws no chrome of its own', (_name, ctor) => {
		const fixture = TestBed.createComponent(ctor as unknown as Type<unknown>);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement;

		expect(host.querySelector('app-example-container')).toBeNull();
		expect(host.querySelector('.example-container__title')).toBeNull();
		expect(host.querySelector('[slot="code"]')).toBeNull();
	});

	it.each(EXAMPLES)('%s exposes its snippets as statics for the viewer to read', (_name, ctor) => {
		const code = ctor as unknown as { templateCode?: string; componentCode?: string };

		expect(typeof code.componentCode).toBe('string');
		expect(code.componentCode).not.toBe('');
	});
});
