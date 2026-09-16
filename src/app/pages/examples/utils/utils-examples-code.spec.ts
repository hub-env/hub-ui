import { DomUtilsExampleComponent } from './dom-utils-example.component';
import { FunctionsUtilsExampleComponent } from './functions-utils-example.component';
import { PipesUtilsExampleComponent } from './pipes-utils-example.component';
import { PopupUtilsExampleComponent } from './popup-utils-example.component';
import { TooltipUtilsExampleComponent } from './tooltip-utils-example.component';
import { TransitionsUtilsExampleComponent } from './transitions-utils-example.component';

/**
 * ExampleViewer reads the snippets off the class before it ever constructs one, so an
 * example that keeps them as instance fields only renders its code tabs while the
 * component happens to be constructible — the day it reaches for `inject()` the tabs
 * silently go empty. Guarding the static shape here keeps that failure out of the docs.
 */
const EXAMPLES = [
	['DomUtilsExampleComponent', DomUtilsExampleComponent],
	['FunctionsUtilsExampleComponent', FunctionsUtilsExampleComponent],
	['PipesUtilsExampleComponent', PipesUtilsExampleComponent],
	['PopupUtilsExampleComponent', PopupUtilsExampleComponent],
	['TooltipUtilsExampleComponent', TooltipUtilsExampleComponent],
	['TransitionsUtilsExampleComponent', TransitionsUtilsExampleComponent]
] as const;

describe('utils examples code snippets', () => {
	it.each(EXAMPLES)('%s exposes its snippets statically', (_name, ctor) => {
		const type = ctor as unknown as { templateCode?: string; componentCode?: string };

		expect(typeof type.templateCode).toBe('string');
		expect(type.templateCode).not.toBe('');
		expect(typeof type.componentCode).toBe('string');
		expect(type.componentCode).not.toBe('');
	});

	it('TooltipUtilsExampleComponent exposes its styling snippet statically', () => {
		const type = TooltipUtilsExampleComponent as unknown as { cssCode?: string };

		expect(typeof type.cssCode).toBe('string');
		expect(type.cssCode).not.toBe('');
	});
});
