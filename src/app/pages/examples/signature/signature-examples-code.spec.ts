import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ExampleRegistry } from '../../../shared/example-viewer/example-registry';
import { SignatureComponent } from '../../signature/signature.component';
import { ProjectedTemplatesSignatureExampleComponent } from './projected-templates-signature-example.component';

/**
 * `hubFormText` and `hubValidationError` compiled inside `<hub-signature>` for four releases and
 * drew nothing, which is the worst shape a gap can take: the markup is there, matched and
 * collected, and the field prints the plain string instead. 22.7.0 renders both, so the
 * documentation owes the reader a demo — and a demo that is registered, reachable and actually
 * projects the two slots rather than describing them in a snippet.
 *
 * The DOM-level proof that the templates win over the string lives in the library's own suite
 * (`projects/signature/src/lib/components/signature/signature.component.spec.ts`), which renders
 * both. It cannot be repeated here: creating any `<hub-signature>` fixture inside this app's spec
 * bundle throws `Cannot read properties of undefined (reading 'Stacked')` as soon as more than a
 * couple of spec files run together, because the `HubLabelTypes` binding the component reads is
 * uninitialised in the chunk it lands in. That predates this example — the same failure reproduces
 * on `FormSignatureExampleComponent`, which has been there since 22.0.0.
 */
describe('signature projected-template example', () => {
	/** Walks up from the runner's working directory until the workspace file appears. */
	const REPO_ROOT = (() => {
		let directory = process.cwd();
		while (!existsSync(`${directory}/angular.json`)) {
			const parent = dirname(directory);
			if (parent === directory) {
				throw new Error('repository root not found from ' + process.cwd());
			}
			directory = parent;
		}
		return directory;
	})();

	const SOURCE = readFileSync(
		`${REPO_ROOT}/src/app/pages/examples/signature/projected-templates-signature-example.component.ts`,
		'utf8'
	);

	/** The example's own template, without the snippet strings that merely quote it. */
	const TEMPLATE = /\n\ttemplate: `([\s\S]*?)`,\n/.exec(SOURCE)?.[1] ?? '';

	it('projects both slots into the field, rather than describing them in a snippet', () => {
		const field = /<hub-signature[\s\S]*?<\/hub-signature>/.exec(TEMPLATE)?.[0];

		expect(field, 'a <hub-signature> in the demo').toBeDefined();
		expect(field, 'the helper template').toContain('<ng-template hubFormText>');
		expect(field, 'the error template').toContain('<ng-template hubValidationError key="required">');
		// Markup neither [formText] nor the message builder can carry, which is the whole reason
		// to project rather than pass a string.
		expect(field, 'markup only a template can carry').toMatch(/<kbd>|<hub-icon\b/);
	});

	it('imports the two directives from ng-hub-ui-forms, where they are exported', () => {
		expect(SOURCE).toContain("import { HubFormTextDirective, HubValidationErrorDirective } from 'ng-hub-ui-forms';");
	});

	it('is registered by the signature page and loads', async () => {
		TestBed.configureTestingModule({});
		const registry = TestBed.inject(ExampleRegistry);
		TestBed.runInInjectionContext(() => new SignatureComponent()).ngOnInit();

		const example = registry.get('signature-projected-templates');
		expect(example, 'the registered example').toBeDefined();
		await expect(registry.loadComponent('signature-projected-templates')).resolves.toBeTruthy();
	});

	it('publishes its snippets on the class, which is where ExampleViewer reads them', () => {
		const snippets = ProjectedTemplatesSignatureExampleComponent as unknown as Record<string, unknown>;

		for (const key of ['templateCode', 'componentCode']) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
