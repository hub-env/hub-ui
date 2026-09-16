import { TestBed } from '@angular/core/testing';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { StepperComponent } from './stepper.component';

/**
 * Everything the stepper documentation says is hand-written prose: the page's API rows and
 * "Recent changes" block, both READMEs, `BREAKING_CHANGES.md` and `FUNCTIONALITIES.md`. Nothing
 * ever failed when an input was added or a release was cut, so the prose drifted until it
 * described a component that does not exist — per-step `FormGroup` validation, a completed-steps
 * signal, an orientation input, `'Back'`/`'Continue'`/`'Submit'` as the defaults of three inputs
 * that default to `null`, and `stepperNavTpt` (an internal `contentChild` query) offered as the
 * consumer API — while `variant` and `truncateTitles` went unmentioned in every table. This suite
 * is the missing compiler: it reads the manifest, the component sources, the template, the shell
 * navigation and the changelog, and makes the documentation answer to them.
 */

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

const LIB = `${REPO_ROOT}/projects/stepper`;

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

const MANIFEST = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')) as { version: string };

const STEPPER_SOURCE = readFileSync(`${LIB}/src/lib/stepper/stepper.component.ts`, 'utf8');
const STEP_SOURCE = readFileSync(`${LIB}/src/lib/step/step.component.ts`, 'utf8');
const PAGE_SOURCE = readFileSync(`${REPO_ROOT}/src/app/pages/stepper/stepper.component.ts`, 'utf8');

/** Builds the page outside a template, which is the only way to read `stepperLibrary`. */
function buildPage(): StepperComponent {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new StepperComponent());
	page.ngOnInit();
	return page;
}

/**
 * The signal inputs a component source declares, in declaration order. Both spellings count:
 * `input<T>(…)` and the inferred `input(default)`, which the stepper uses for two of its seven.
 */
function declaredInputs(source: string): string[] {
	return [...source.matchAll(/readonly (\w+) = (?:input|model)(?:\.required)?[<(]/g)].map(([, name]) => name);
}

/** The outputs a component source declares, paired with the type they carry. */
function declaredOutputs(source: string): Map<string, string> {
	return new Map([...source.matchAll(/readonly (\w+) = output<([^>]*)>\(/g)].map(([, name, type]) => [name, type]));
}

/** Files the public API re-exports whose name ends in the given suffix. */
function exportedFiles(suffix: 'component' | 'directive'): string[] {
	const publicApi = readFileSync(`${LIB}/src/public-api.ts`, 'utf8');
	return [...publicApi.matchAll(new RegExp(`^export \\* from '\\./(lib/[\\w/.-]+\\.${suffix})';$`, 'gm'))].map(
		([, path]) => `${LIB}/src/${path}.ts`
	);
}

/** First attribute selector of each exported directive — the name a consumer actually types. */
function exportedDirectiveSelectors(): string[] {
	return exportedFiles('directive').map((file) => {
		const source = readFileSync(file, 'utf8');
		const selector = /selector: '([^']+)'/.exec(source)![1];
		return /\[(\w+)\]/.exec(selector)![1];
	});
}

/**
 * The identifier an API row's `name` starts with. Rows qualify themselves with the owning
 * selector in parentheses — "options (hub-stepper)" — and only the leading identifier is a
 * claim that some input exists.
 */
function claimedName(name: string): string {
	return /^\s*([A-Za-z_]\w*)/.exec(name.replace(/\([^)]*\)/g, ''))![1];
}

/** Released versions, newest first, as the CHANGELOG records them. */
function releasedVersions(): { version: string; date: string }[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/gm)].map(([, version, date]) => ({
		version,
		date
	}));
}

/**
 * Versions whose CHANGELOG entry calls itself BREAKING, and therefore owe a migration note.
 * The major tracks the supported Angular major, so a breaking change can only ship as a minor
 * and `BREAKING_CHANGES.md` is the only warning a consumer ever gets. Mentions of the file
 * name itself are not the word.
 */
function versionsMarkedBreaking(): string[] {
	const changelog = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
	return changelog
		.split(/^## /m)
		.filter(
			(section) =>
				/^\[\d+\.\d+\.\d+\]/.test(section) &&
				// The verdict has to be this release's own. An entry that recounts which OLDER
				// versions were flagged breaking says the word without being one, and matching it
				// there demanded a migration note for a release that migrates nothing.
				/(\*\*BREAKING(?!_CHANGES)|BREAKING CHANGE)/.test(section)
		)
		.map((section) => /^\[(\d+\.\d+\.\d+)\]/.exec(section)![1]);
}

/** Orders two `major.minor.patch` strings. */
function compare(a: string, b: string): number {
	const left = a.split('.').map(Number);
	const right = b.split('.').map(Number);
	for (let index = 0; index < 3; index++) {
		if (left[index] !== right[index]) {
			return left[index] - right[index];
		}
	}
	return 0;
}

/**
 * First cell of every row of one README table — what a reader copies. `heading` locates the
 * section and `header` the table inside it, so the same call works on either language edition.
 */
function readmeTableRows(readme: string, heading: string, header: RegExp): string[] {
	const section = readme.slice(readme.indexOf(heading));
	const lines = section.slice(section.search(header)).split('\n').slice(2);
	const names: string[] = [];
	for (const line of lines) {
		if (!line.startsWith('|')) {
			break;
		}
		const match = /^\| `(\w+)`/.exec(line);
		if (match) {
			names.push(match[1]);
		}
	}
	return names;
}

const STEPPER_HEADING = '### StepperComponent (`hub-stepper`)';
const STEP_HEADING = '### StepComponent (`hub-step`)';
const INPUT_HEADER = /^\| (Input|Entrada) \|/m;
const OUTPUT_HEADER = /^\| (Output|Salida) \|/m;

describe('stepper documentation page', () => {
	it('lists every released version of the library, with its release date', () => {
		const documented = new Map(buildPage().stepperLibrary.overview.changelog.map((entry) => [entry.version, entry.date]));

		for (const { version, date } of releasedVersions()) {
			expect(documented.get(version), `changelog entry for ${version}`).toBe(date);
		}
	});

	it('names every input of every component the package exports', () => {
		const claimed = new Set(buildPage().stepperLibrary.api.inputs.map((input) => claimedName(input.name)));
		const components = exportedFiles('component');
		expect(components.length, 'components exported from public-api').toBe(2);

		for (const file of components) {
			for (const input of declaredInputs(readFileSync(file, 'utf8'))) {
				expect(claimed, `${input} declared in ${file}`).toContain(input);
			}
		}
	});

	it('names no input the library does not declare', () => {
		const declared = new Set([...declaredInputs(STEPPER_SOURCE), ...declaredInputs(STEP_SOURCE)]);

		for (const row of buildPage().stepperLibrary.api.inputs) {
			expect(declared, `"${claimedName(row.name)}" in row "${row.name}"`).toContain(claimedName(row.name));
		}
	});

	it('types its outputs as the OutputEmitterRef that output() returns', () => {
		const declared = declaredOutputs(STEPPER_SOURCE);
		expect(declared.size, 'outputs declared by StepperComponent').toBe(3);

		const documented = new Map(buildPage().stepperLibrary.api.outputs.map((row) => [claimedName(row.name), row.type]));
		for (const [name, carried] of declared) {
			expect(documented.get(name), `documented type of ${name}`).toBe(`OutputEmitterRef<${carried}>`);
		}
	});

	it('documents the rail template the component actually renders', () => {
		const templates = buildPage().stepperLibrary.api.templates;
		expect(templates.length, 'documented template slots').toBeGreaterThan(0);

		const html = readFileSync(`${LIB}/src/lib/stepper/stepper.component.html`, 'utf8');
		expect(html, 'the template outlet the rail slot fills').toContain('stepperNavTpt()');
		expect(templates.map((slot) => slot.example).join('\n'), 'the consumer-facing directive').toContain('hubStepperNav');
	});

	it('documents the step trigger only for as long as the rail actually renders it', () => {
		// `hubStepTrigger` spent several releases exported, documented and never queried: the
		// template it marked was captured and dropped. The page may only offer it while the
		// component reads it, which is the outlet below and nothing else.
		const html = readFileSync(`${LIB}/src/lib/stepper/stepper.component.html`, 'utf8');
		expect(html, 'the outlet that draws a custom rail trigger').toContain('stepTriggerTpt() || defaultNavTriggerTpt');
		expect(STEPPER_SOURCE, 'the query behind that outlet').toContain('stepTriggerTpt = contentChild(StepTriggerDirective');

		const examples = buildPage()
			.stepperLibrary.api.templates.map((slot) => slot.example)
			.join('\n');
		expect(examples, 'a worked hubStepTrigger snippet on the page').toContain('hubStepTrigger');
	});

	it('keeps the three control queries as shallow as content projection is', () => {
		// `<ng-content select="button[nextButton]">` only ever matches a direct child, so a query
		// that reaches deeper finds controls the controls row can never render — and the stepper
		// then draws none of its own.
		for (const control of ['PreviousButtonDirective', 'NextButtonDirective', 'SubmitButtonDirective']) {
			expect(STEPPER_SOURCE, `${control} queried shallowly`).toContain(
				`contentChild(${control}, { descendants: false })`
			);
		}
	});

	it('names the provisioning surface the public API exports', () => {
		// `provideHubStepper()` and `STEPPER_DICTIONARIES` are the only way a standalone
		// application reaches the ten bundled languages once the module goes in 23.0.0. A page
		// that does not name them sends the reader back to rewriting thirty strings by hand.
		const providers = readFileSync(`${LIB}/src/lib/stepper.providers.ts`, 'utf8');
		const exported = [...providers.matchAll(/^export (?:function|const) (\w+)/gm)].map(([, name]) => name);
		expect(exported, 'symbols exported by stepper.providers.ts').toContain('provideHubStepper');

		const documented = new Set(buildPage().stepperLibrary.api.templates.map((slot) => slot.name));
		for (const symbol of exported) {
			expect(documented, `API row for ${symbol}`).toContain(symbol);
		}
	});

	it('claims no reactive-forms integration, which the library has never had', () => {
		expect(STEPPER_SOURCE + STEP_SOURCE, 'FormGroup in the library sources').not.toContain('FormGroup');
		expect(PAGE_SOURCE, 'FormGroup claimed by the page').not.toContain('FormGroup');
	});

	it('reaches every registered example from the shell navigation and a feature group', () => {
		const page = buildPage();
		const registered = page.stepperLibrary.functionalities.flatMap((group) => group.examples);

		const shell = readFileSync(`${REPO_ROOT}/src/app/components/app-shell/app-shell.component.ts`, 'utf8');
		const block = shell.slice(shell.indexOf('\tstepper: ['));
		const navigable = new Set([...block.slice(0, block.indexOf('\t],')).matchAll(/id: '([\w-]+)'/g)].map(([, id]) => id));

		expect(registered.length, 'examples reachable from a feature group').toBe(12);
		for (const example of registered) {
			expect(example.previewComponent, `preview component for "${example.title}"`).toBeDefined();
		}
		expect(navigable, 'the modal example in the shell navigation').toContain('stepper-modal');
		expect(navigable.size, 'entries in the stepper shell navigation').toBe(12);
	});
});

describe('stepper README', () => {
	it('announces the version the manifest publishes', () => {
		for (const [name, source] of READMES) {
			expect(source, `version banner in ${name}`).toContain(`\`${MANIFEST.version}\``);
		}
	});

	it('tabulates exactly the inputs each component declares', () => {
		for (const [heading, declared] of [
			[STEPPER_HEADING, declaredInputs(STEPPER_SOURCE)],
			[STEP_HEADING, declaredInputs(STEP_SOURCE)]
		] as const) {
			for (const [name, source] of READMES) {
				const rows = readmeTableRows(source, heading, INPUT_HEADER);
				expect([...rows].sort(), `${heading} inputs table in ${name}`).toEqual([...declared].sort());
			}
		}
	});

	it('tabulates the outputs under their real emitter type', () => {
		for (const [name, source] of READMES) {
			const rows = readmeTableRows(source, STEPPER_HEADING, OUTPUT_HEADER);
			expect([...rows].sort(), `outputs table in ${name}`).toEqual([...declaredOutputs(STEPPER_SOURCE).keys()].sort());
			expect(source, `EventEmitter still claimed in ${name}`).not.toContain('EventEmitter');
		}
	});

	it('gives the three label inputs the null default the code gives them', () => {
		for (const label of ['backLabel', 'continueLabel', 'submitLabel']) {
			expect(STEPPER_SOURCE, `${label} defaults to null`).toContain(`${label} = input<string | null>(null)`);
		}
		for (const [name, source] of READMES) {
			const table = source.slice(source.indexOf(STEPPER_HEADING), source.indexOf(STEP_HEADING));
			expect(table, `stale 'Back' default in ${name}`).not.toMatch(/\| `'Back'` \|/);
		}
	});

	it('points at the rail directive, not at the internal stepperNavTpt query', () => {
		expect(STEPPER_SOURCE, 'stepperNavTpt is a contentChild query').toContain(
			'stepperNavTpt = contentChild(StepperNavDirective'
		);
		for (const [name, source] of READMES) {
			expect(source, `stepperNavTpt offered as API in ${name}`).not.toContain('stepperNavTpt');
			expect(source, `the rail directive in ${name}`).toContain('hubStepperNav');
		}
	});

	it('names every directive, service and host class the package ships', () => {
		const selectors = exportedDirectiveSelectors();
		expect(selectors.length, 'directives exported from public-api').toBe(5);

		for (const [name, source] of READMES) {
			for (const selector of selectors) {
				expect(source, `${selector} in ${name}`).toContain(selector);
			}
			expect(source, `StepperThemeService in ${name}`).toContain('StepperThemeService');
			expect(source, `forRoot in ${name}`).toContain('StepperModule.forRoot');
			// Both spellings have to be there: the prefixed one because it is what 22.10.0 asks a
			// reader to write, the bare one because it still works and its removal date is the
			// only thing standing between a silent restyle and a stylesheet that stops matching.
			for (const hostClass of ['hub-stepper--animated', 'hub-stepper--anim-slide', 'hub-stepper--anim-fade']) {
				expect(source, `${hostClass} in ${name}`).toContain(hostClass);
			}
			for (const retired of ['stepper--animated', 'stepper--anim-slide', 'stepper--anim-fade']) {
				expect(source, `${retired}, and the release that removes it, in ${name}`).toContain(retired);
			}
			expect(source, `the removal version of the bare block in ${name}`).toMatch(/23\.0\.0/);
		}
	});

	it('documents the namespaced translation keys the component resolves first', () => {
		expect(STEPPER_SOURCE, 'the prefix the component provides').toContain("useValue: 'HUBUI.STEPPER'");
		for (const [name, source] of READMES) {
			expect(source, `namespaced keys in ${name}`).toContain('HUBUI.STEPPER.BACK');
		}
	});
});

describe('stepper reference documents', () => {
	it('gives every version the CHANGELOG marks BREAKING a section in BREAKING_CHANGES.md', () => {
		const breaking = versionsMarkedBreaking();
		expect(breaking, 'the 22.4.0 selector removal is flagged BREAKING').toContain('22.4.0');

		const notes = readFileSync(`${LIB}/BREAKING_CHANGES.md`, 'utf8');
		for (const version of breaking) {
			const heading = new RegExp(`^## (Version |\\[)${version.replaceAll('.', '\\.')}`, 'm');
			expect(notes, `migration note for ${version}`).toMatch(heading);
		}
	});

	it('orders the CHANGELOG newest first', () => {
		const versions = releasedVersions().map((release) => release.version);
		expect(versions.length, 'released versions').toBeGreaterThan(10);
		expect(versions).toEqual([...versions].sort(compare).reverse());
	});

	it('ships a FUNCTIONALITIES.md naming every input and every directive', () => {
		expect(existsSync(`${LIB}/FUNCTIONALITIES.md`), 'projects/stepper/FUNCTIONALITIES.md').toBe(true);
		const functionalities = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');

		for (const name of [...declaredInputs(STEPPER_SOURCE), ...declaredInputs(STEP_SOURCE)]) {
			expect(functionalities, `row for ${name}`).toContain(name);
		}
		for (const selector of exportedDirectiveSelectors()) {
			expect(functionalities, `row for ${selector}`).toContain(selector);
		}
	});
});

/**
 * Every stepper demo the site ships, read as text: the thirteen example components and the
 * playground preview. Reading the whole file rather than the class covers both halves of what
 * a demo teaches — the `imports` the component really compiles with, and the `componentCode`
 * string the reader copies out of the code tab.
 */
const EXAMPLE_SOURCES: ReadonlyArray<[string, string]> = [
	...readdirSync(`${REPO_ROOT}/src/app/pages/examples/stepper`)
		.filter((file) => file.endsWith('.component.ts'))
		.map((file) => [file, readFileSync(`${REPO_ROOT}/src/app/pages/examples/stepper/${file}`, 'utf8')] as [string, string]),
	['stepper-playground.ts', readFileSync(`${REPO_ROOT}/src/app/pages/stepper/stepper-playground.ts`, 'utf8')]
];

describe('stepper documentation examples', () => {
	it('teaches the standalone building blocks, not the module 23.0.0 takes away', () => {
		expect(EXAMPLE_SOURCES.length, 'stepper demos on the site').toBeGreaterThan(10);

		for (const [name, source] of EXAMPLE_SOURCES) {
			expect(source, `StepperModule in ${name}`).not.toContain('StepperModule');
		}
	});

	it('names the two components every demo renders, so the snippet compiles as written', () => {
		const rendering = EXAMPLE_SOURCES.filter(([, source]) => source.includes('<hub-stepper'));
		expect(rendering.length, 'demos rendering a stepper').toBeGreaterThan(10);

		for (const [name, source] of rendering) {
			expect(source, `StepperComponent in ${name}`).toContain('StepperComponent');
			expect(source, `StepComponent in ${name}`).toContain('StepComponent');
		}
	});

	it('hands the reader what forRoot() used to register, starting with the provider function', () => {
		// The module was the site's whole answer to "where do the labels come from". Dropping it
		// from the imports leaves the reader with none, and the shortfall is not cosmetic:
		// `HubTranslationService` is not `providedIn: 'root'` and the built-in controls resolve
		// their text through the `translate` pipe, which injects it. So the demos have to name
		// the paths BREAKING_CHANGES.md prescribes — `provideHubStepper()` first, since it is the
		// one that keeps the ten languages — or a copied snippet dies at first render with
		// NullInjectorError and nothing on the page says why.
		const demos = EXAMPLE_SOURCES.map(([, source]) => source).join('\n');

		expect(demos, 'provideHubStepper(), the replacement for forRoot()').toContain('provideHubStepper(');
		expect(demos, 'STEPPER_DICTIONARIES, for an app that merges them into its own').toContain('STEPPER_DICTIONARIES');
		expect(demos, 'the per-instance label inputs').toContain('backLabel');
		expect(demos, 'provideHubTranslation(), which also supplies HubTranslationService').toContain('provideHubTranslation(');
		expect(demos, 'provideHubTranslationAdapter(), for an app that already has i18n').toContain(
			'provideHubTranslationAdapter('
		);
		expect(demos, 'the namespace the component reads first').toContain('HUBUI.STEPPER');
	});
});
