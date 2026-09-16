import { TestBed } from '@angular/core/testing';
import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { AVATAR_PLAYGROUND } from './avatar-playground';
import { AvatarComponent as AvatarDocsPage } from './avatar.component';

/**
 * Every claim the avatar documentation makes is hand-written prose — the page's API rows and
 * highlights, the playground controls, both READMEs, `FUNCTIONALITIES.md` and the token reference.
 * Nothing failed when the component grew an input, renamed a token or widened an output, so the
 * documentation promised features the library never had (size presets, a shadow token, a "+N more"
 * counter) and hid two inputs it did have. This suite makes the documentation answer to the source:
 * the component, its stylesheet, the manifest and the changelog.
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

const LIB = `${REPO_ROOT}/projects/avatar`;
const COMPONENT = readFileSync(`${LIB}/src/lib/avatar.component.ts`, 'utf8');
const STYLESHEET = readFileSync(`${LIB}/src/lib/avatar.component.scss`, 'utf8');
const CHANGELOG = readFileSync(`${LIB}/CHANGELOG.md`, 'utf8');
const FUNCTIONALITIES = readFileSync(`${LIB}/FUNCTIONALITIES.md`, 'utf8');
const TOKEN_REFERENCE = readFileSync(`${LIB}/docs/css-variables-reference.md`, 'utf8');
const MANIFEST = JSON.parse(readFileSync(`${LIB}/package.json`, 'utf8')) as { version: string };
const PAGE_SOURCE = readFileSync(`${REPO_ROOT}/src/app/pages/avatar/avatar.component.ts`, 'utf8');
const EXAMPLES_DIR = `${REPO_ROOT}/src/app/pages/examples/avatar`;
const I18N_DIR = `${REPO_ROOT}/src/app/i18n/docs`;
const LANGUAGES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ru', 'zh'] as const;

/** Both language editions of the README, keyed by the name a failure message should show. */
const READMES: ReadonlyArray<[string, string]> = [
	['README.md', readFileSync(`${LIB}/README.md`, 'utf8')],
	['README.es.md', readFileSync(`${LIB}/README.es.md`, 'utf8')]
];

/**
 * Inputs the component declares, mapped from the name a consumer writes in a template (the alias
 * when there is one) to the property behind it.
 */
function declaredInputs(): Map<string, string> {
	const inputs = new Map<string, string>();
	for (const [declaration, property] of COMPONENT.matchAll(/^\treadonly (\w+) = input[^\n]*$/gm)) {
		const alias = /alias: '(\w+)'/.exec(declaration)?.[1];
		inputs.set(alias ?? property, property);
	}
	return inputs;
}

/** The type of the `style` input, composed from the two aliases the component declares. */
function styleInputType(): string {
	const object = /^type StyleObject = (.+);$/m.exec(COMPONENT)![1];
	const style = /^type Style = (.+);$/m.exec(COMPONENT)![1];
	return style.replace('StyleObject', object);
}

/** The `--hub-avatar-*` defaults, read from the one block that declares the token contract. */
function tokenDefaults(): Map<string, string> {
	const start = STYLESHEET.indexOf(':root,');
	const block = STYLESHEET.slice(start, STYLESHEET.indexOf('\n}', start));

	const defaults = new Map<string, string>();
	for (const [, name, value] of block.matchAll(/^\t(--hub-avatar-[\w-]+):\s*([^;]+);$/gm)) {
		defaults.set(name, value.trim());
	}
	return defaults;
}

/** Tokens the component writes inline on the host, which a stylesheet override can never beat. */
function tokensWrittenInline(): string[] {
	const host = /host: \{[\s\S]*?\n\t\}/.exec(COMPONENT)![0];
	return [...host.matchAll(/\[style\.(--hub-avatar-[\w-]+)\]/g)].map(([, token]) => token);
}

/** Versions whose CHANGELOG entry calls itself BREAKING, and therefore owe a migration note. */
function versionsMarkedBreaking(): string[] {
	const sections = CHANGELOG.split(/^## /m).filter((section) => /^\[\d+\.\d+\.\d+\]/.test(section));
	return sections
		.filter((section) => section.includes('BREAKING'))
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
 * Methods declared by the exported `Source` payload interface. Its data members are named in
 * the output's own description; a callable one earns a row of the page's methods table, and
 * this is what notices when the interface grows a second one.
 */
function sourceMethods(): string[] {
	const source = readFileSync(`${LIB}/src/lib/sources/source.ts`, 'utf8');
	const body = /export interface Source \{([\s\S]*?)\n\}/.exec(source)![1];
	return [...body.matchAll(/^\t(\w+)\(/gm)].map(([, name]) => name);
}

/** Builds the page outside a template, which is the only way to read `avatarLibrary`. */
function buildPage(): AvatarDocsPage {
	TestBed.configureTestingModule({});
	const page = TestBed.runInInjectionContext(() => new AvatarDocsPage());
	page.ngOnInit();
	return page;
}

/** Every sentence the page shows as prose, where a stale claim about the code would hide. */
function pageProse(): string[] {
	const { description, overview } = buildPage().avatarLibrary;
	return [
		description,
		overview.text ?? '',
		...(overview.highlights ?? []).flatMap((highlight) => [highlight.title, highlight.description])
	];
}

/** Every `DOCS.AVATAR.*` key of one language file, as dotted paths. */
function translationKeys(language: string): string[] {
	const bundle = JSON.parse(readFileSync(`${I18N_DIR}/${language}.json`, 'utf8')) as Record<string, unknown>;
	const walk = (node: unknown, path: string): string[] =>
		typeof node === 'object' && node !== null
			? Object.entries(node as Record<string, unknown>).flatMap(([key, value]) => walk(value, `${path}.${key}`))
			: [path];
	return walk((bundle['DOCS'] as Record<string, unknown>)['AVATAR'], 'DOCS.AVATAR').sort();
}

describe('avatar documentation page', () => {
	it('documents every input a consumer can write in a template', () => {
		const documented = new Set(buildPage().avatarLibrary.api.inputs.map((row) => row.name));

		for (const name of declaredInputs().keys()) {
			expect(documented.has(name), `page row for "${name}"`).toBe(true);
		}
	});

	it('documents no input the component does not declare', () => {
		const declared = declaredInputs();

		for (const row of buildPage().avatarLibrary.api.inputs) {
			expect(declared.has(row.name), `page row "${row.name}" exists in the component`).toBe(true);
		}
	});

	it('types the style input the way the component types it', () => {
		const row = buildPage().avatarLibrary.api.inputs.find((input) => input.name === 'style');

		expect(row, 'the style row').toBeDefined();
		expect(row!.type).toBe(styleInputType());
	});

	it('types outputs as OutputEmitterRef, which is what output() produces', () => {
		expect(COMPONENT, 'the component still builds its output with output()').toContain('= output<');

		for (const row of buildPage().avatarLibrary.api.outputs) {
			expect(row.type, `output "${row.name}"`).toMatch(/^OutputEmitterRef<.+>$/);
		}
	});

	it('documents the placeholder as the picture it now paints, not as a reserved input', () => {
		const template = /template: `([\s\S]*?)`,\n\thost:/.exec(COMPONENT)![1];
		expect(template, 'the template paints the placeholder').toContain('placeholderSrc()');

		const row = buildPage().avatarLibrary.api.inputs.find((input) => input.name === 'placeholder');
		expect(row, 'the placeholder row').toBeDefined();
		expect(row!.description, 'the placeholder description').not.toMatch(/reserved/i);
	});

	it('promises no size presets, because size is a raw pixel value', () => {
		expect(STYLESHEET, 'no size-preset class exists').not.toMatch(/\.hub-avatar--(xs|sm|md|lg|xl)\b/);

		for (const sentence of pageProse()) {
			expect(sentence, 'page prose').not.toMatch(/presets?\b|\bxs,|\bsm,/i);
		}
	});

	it('promises no overflow counter, because the group helper only overlaps and rings', () => {
		const group = STYLESHEET.slice(STYLESHEET.indexOf('.hub-avatar-group {'));
		expect(group, 'the group helper draws no generated content').not.toMatch(/content:/);

		for (const sentence of pageProse()) {
			expect(sentence, 'page prose').not.toMatch(/\+N|overflow counter/i);
		}
	});

	it('promises no shadow token, because the stylesheet declares none', () => {
		expect(
			[...tokenDefaults().keys()].filter((token) => token.includes('shadow')),
			'shadow tokens'
		).toEqual([]);

		for (const sentence of pageProse()) {
			expect(sentence, 'page prose').not.toMatch(/shadow/i);
		}
	});

	it('shows every breaking release of the major it documents', () => {
		const major = MANIFEST.version.split('.')[0];
		const breaking = versionsMarkedBreaking().filter((version) => version.startsWith(`${major}.`));
		expect(breaking.length, `breaking releases in the ${major}.x line`).toBeGreaterThan(0);

		const shown = new Set(buildPage().avatarLibrary.overview.changelog.map((entry) => entry.version));
		for (const version of breaking) {
			expect(shown.has(version), `page entry for the breaking ${version}`).toBe(true);
		}
	});

	it('documents the payload type the package exports, and every method it declares', () => {
		expect(readFileSync(`${LIB}/src/public_api.ts`, 'utf8'), '`Source` on the public surface').toContain(
			'./lib/sources/source'
		);

		const api = buildPage().avatarLibrary.api;
		const click = api.outputs.find((row) => row.name === 'clickOnAvatar');
		expect(click?.type, 'the payload type named by the output row').toContain('Source');

		const methods = sourceMethods();
		expect(methods, 'methods declared by `Source`').not.toEqual([]);

		const documented = (api.methods ?? []).map((row) => row.name);
		for (const method of methods) {
			expect(documented, `page row for Source.${method}`).toContain(`Source.${method}`);
		}
	});

	it('registers only example files that exist on disk', () => {
		const listed = [...PAGE_SOURCE.matchAll(/files: \[([^\]]*)\]/g)].flatMap(([, list]) =>
			[...list.matchAll(/'([^']+)'/g)].map(([, file]) => file)
		);
		expect(listed.length, 'files listed by the registry').toBeGreaterThan(10);

		for (const file of listed) {
			expect(existsSync(`${EXAMPLES_DIR}/${file}`), `${file} exists`).toBe(true);
		}
	});
});

describe('avatar playground', () => {
	it('offers no control over a token the host overwrites inline', () => {
		const inline = tokensWrittenInline();
		expect(inline, 'tokens the host writes inline').toContain('--hub-avatar-size');

		for (const config of AVATAR_PLAYGROUND) {
			for (const variable of config.cssVariables ?? []) {
				expect(inline, `${variable.name} is themable from outside`).not.toContain(variable.name);
			}
		}
	});

	it('starts every colour control at the colour the stylesheet falls back to', () => {
		const defaults = tokenDefaults();
		const expand = (hex: string) =>
			hex.length === 4 ? `#${[...hex.slice(1)].map((digit) => digit + digit).join('')}` : hex.toLowerCase();

		for (const config of AVATAR_PLAYGROUND) {
			for (const variable of config.cssVariables ?? []) {
				const declared = defaults.get(variable.name);
				expect(declared, `${variable.name} in the stylesheet`).toBeDefined();

				const literals = variable.type === 'color' ? declared!.match(/#[0-9a-fA-F]{3,6}\b/g) : null;
				if (literals) {
					expect(expand(variable.default), `${variable.name} default`).toBe(expand(literals.at(-1)!));
				}
			}
		}
	});
});

describe('avatar README', () => {
	it('documents every input a consumer can write in a template', () => {
		for (const [file, source] of READMES) {
			for (const name of declaredInputs().keys()) {
				expect(source, `row for \`${name}\` in ${file}`).toContain(`| \`${name}\``);
			}
		}
	});

	it('types the style input the way the component types it', () => {
		const cell = `\`${styleInputType().replaceAll('|', '\\|')}\``;

		for (const [file, source] of READMES) {
			expect(source, `style type in ${file}`).toContain(cell);
		}
	});

	it('types the output as the OutputEmitterRef output() produces', () => {
		expect(COMPONENT, 'the component imports no EventEmitter').not.toContain('EventEmitter');

		for (const [file, source] of READMES) {
			expect(source, `output type in ${file}`).toContain('OutputEmitterRef<Source \\| null>');
			expect(source, `EventEmitter in ${file}`).not.toContain('EventEmitter');
		}
	});

	it('points its breaking-changes banner at the newest migration note', () => {
		const notes = readFileSync(`${LIB}/BREAKING_CHANGES.md`, 'utf8');
		const newest = [...notes.matchAll(/^## (?:\[)?(?:Version )?(\d+\.\d+\.\d+)/gm)]
			.map(([, version]) => version)
			.sort(compare)
			.pop()!;

		for (const [file, source] of READMES) {
			const banner = /^> \*\*⚠️[\s\S]*?\n\n/m.exec(source);
			expect(banner, `breaking-changes banner in ${file}`).not.toBeNull();
			expect(banner![0], `banner in ${file} names ${newest}`).toContain(newest);
		}
	});
});

describe('avatar reference documents', () => {
	it('names every documented input in FUNCTIONALITIES.md', () => {
		for (const row of buildPage().avatarLibrary.api.inputs) {
			expect(FUNCTIONALITIES, `row naming \`${row.name}\``).toContain(`\`${row.name}\``);
		}
	});

	it('no longer reports the status input that the badge replaced', () => {
		expect(declaredInputs().has('status'), 'the component declares no status input').toBe(false);
		expect(FUNCTIONALITIES, 'FUNCTIONALITIES.md').not.toMatch(/\bstatus\b/i);
	});

	it('names only stylesheets that exist, in css-variables-reference.md', () => {
		const paths = [...TOKEN_REFERENCE.matchAll(/`(projects\/[\w./-]+\.scss)`/g)].map(([, path]) => path);
		expect(paths.length, 'stylesheet paths named by the reference').toBeGreaterThan(0);

		for (const path of paths) {
			expect(existsSync(`${REPO_ROOT}/${path}`), path).toBe(true);
		}
	});

	it('documents every --hub-avatar-* token the stylesheet declares', () => {
		const defaults = tokenDefaults();
		expect(defaults.size, 'tokens found in the stylesheet').toBeGreaterThan(30);

		for (const token of defaults.keys()) {
			expect(TOKEN_REFERENCE, `${token} in css-variables-reference.md`).toContain(`\`${token}\``);
		}
	});

	it('gives every version the CHANGELOG marks BREAKING a section in BREAKING_CHANGES.md', () => {
		const breaking = versionsMarkedBreaking();
		expect(breaking.length, 'versions marked BREAKING in the CHANGELOG').toBeGreaterThan(0);

		const notes = readFileSync(`${LIB}/BREAKING_CHANGES.md`, 'utf8');
		for (const version of breaking) {
			expect(notes, `migration note for ${version}`).toMatch(
				new RegExp(`^## (\\[${version}\\]|Version ${version})`, 'm')
			);
		}
	});
});

describe('avatar API translations', () => {
	it('keeps the same keys in every language', () => {
		const english = translationKeys('en');
		expect(english.length, 'DOCS.AVATAR keys in English').toBeGreaterThan(50);

		for (const language of LANGUAGES) {
			expect(translationKeys(language), `keys in ${language}.json`).toEqual(english);
		}
	});

	it('does not put the style object on the host element, which never receives it', () => {
		const hostStyle = /hostStyle = computed<StyleObject>\([\s\S]*?\}\)\);/.exec(COMPONENT)![0];
		expect(hostStyle, 'the host style is built without the custom style').not.toContain('getCustomStyleObject');

		const english = JSON.parse(readFileSync(`${I18N_DIR}/en.json`, 'utf8'));
		const description = english.DOCS.AVATAR.API.INPUT.STYLE.DESCRIPTION as string;
		expect(description, 'the style description names what it dresses').toMatch(/content/i);
		expect(description, 'the style description does not send it to the root').not.toMatch(/root element/i);
	});
});
