import { IconsBootstrapExampleComponent } from './icons-bootstrap-example.component';
import { IconsButtonsExampleComponent } from './icons-buttons-example.component';
import { IconsDirectiveExampleComponent } from './icons-directive-example.component';
import { IconsFontAwesomeExampleComponent } from './icons-font-awesome-example.component';
import { IconsImgExampleComponent } from './icons-img-example.component';
import { IconsMaterialExampleComponent } from './icons-material-example.component';
import { IconsSetupExampleComponent } from './icons-setup-example.component';
import { IconsSolarExampleComponent } from './icons-solar-example.component';
import { IconsSpriteExampleComponent } from './icons-sprite-example.component';
import { IconsSvgExampleComponent } from './icons-svg-example.component';
import { IconsThemingExampleComponent } from './icons-theming-example.component';
import { IconsVariantsExampleComponent } from './icons-variants-example.component';

/**
 * ExampleViewer reads the snippets off the class before it ever constructs one, so an
 * example that keeps them as instance fields only renders its code tabs while the
 * component happens to be constructible — the day it reaches for `inject()` the tabs
 * silently go empty. Guarding the static shape here keeps that failure out of the docs.
 */
const EXAMPLES = [
	['IconsBootstrapExampleComponent', IconsBootstrapExampleComponent],
	['IconsButtonsExampleComponent', IconsButtonsExampleComponent],
	['IconsDirectiveExampleComponent', IconsDirectiveExampleComponent],
	['IconsFontAwesomeExampleComponent', IconsFontAwesomeExampleComponent],
	['IconsImgExampleComponent', IconsImgExampleComponent],
	['IconsMaterialExampleComponent', IconsMaterialExampleComponent],
	['IconsSetupExampleComponent', IconsSetupExampleComponent],
	['IconsSolarExampleComponent', IconsSolarExampleComponent],
	['IconsSpriteExampleComponent', IconsSpriteExampleComponent],
	['IconsSvgExampleComponent', IconsSvgExampleComponent],
	['IconsThemingExampleComponent', IconsThemingExampleComponent],
	['IconsVariantsExampleComponent', IconsVariantsExampleComponent]
] as const;

describe('icons examples code snippets', () => {
	it.each(EXAMPLES)('%s exposes its snippets statically', (_name, ctor) => {
		const type = ctor as unknown as { templateCode?: string; componentCode?: string };

		expect(typeof type.templateCode).toBe('string');
		expect(type.templateCode).not.toBe('');
		expect(typeof type.componentCode).toBe('string');
		expect(type.componentCode).not.toBe('');
	});
});
