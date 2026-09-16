import { OutputEmitterRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
	HubBoardColumnFooterDirective,
	HubBoardColumnHeaderDirective,
	HubCardDragPreviewDirective,
	HubCardPlaceholderDirective,
	HubCardTemplateDirective,
	HubColumnDragPreviewDirective,
	HubColumnPlaceholderDirective,
	HubBoardComponent
} from 'ng-hub-ui-board';
import ar from '../../i18n/docs/ar.json';
import de from '../../i18n/docs/de.json';
import en from '../../i18n/docs/en.json';
import es from '../../i18n/docs/es.json';
import fr from '../../i18n/docs/fr.json';
import ja from '../../i18n/docs/ja.json';
import ru from '../../i18n/docs/ru.json';
import zh from '../../i18n/docs/zh.json';
import { LIBRARY_VERSIONS } from '../../seo/library-versions.generated';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { KeyboardAccessibilityBoardExampleComponent } from '../examples/board/keyboard-accessibility-example.component';
import { BOARD_EXAMPLE_GROUPS } from './board-example-groups';
import { BoardComponent } from './board.component';

/**
 * The board page is hand-written data about code that moves underneath it, and every drift
 * it accumulated was invisible until a reader copied it. These assertions read the library
 * itself — its directives, its output refs, its released version — so the page cannot claim
 * an API the component does not have without the suite going red.
 */

/** Every projection directive the library exports, with the selector a consumer types. */
const PROJECTION_DIRECTIVES = [
	HubCardTemplateDirective,
	HubBoardColumnHeaderDirective,
	HubBoardColumnFooterDirective,
	HubCardPlaceholderDirective,
	HubColumnPlaceholderDirective,
	HubCardDragPreviewDirective,
	HubColumnDragPreviewDirective
];

/** Reads the attribute selector off the compiled directive definition. */
function selectorOf(directive: unknown): string {
	const def = (directive as { ɵdir: { selectors: string[][] } }).ɵdir;
	return def.selectors[0][1];
}

const TRANSLATIONS: Array<[string, Record<string, any>]> = [
	['en', en],
	['es', es],
	['de', de],
	['fr', fr],
	['ja', ja],
	['ru', ru],
	['zh', zh],
	['ar', ar]
];

/**
 * Names the CDK as the engine behind the board. Saying the library does *not* depend on it
 * is the opposite claim and stays allowed, so the pattern asks for the attribution verb.
 */
const CDK_CREDIT = /(using|built on|based on|powered by)[^.]*CDK/i;

function resolve(bundle: Record<string, any>, key: string): unknown {
	return key.split('.').reduce<any>((node, segment) => (node == null ? undefined : node[segment]), bundle);
}

describe('board documentation page', () => {
	let page: BoardComponent;
	let registry: ExampleRegistry;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		registry = TestBed.inject(ExampleRegistry);
		page = TestBed.runInInjectionContext(() => new BoardComponent());
		page.ngOnInit();
	});

	it('does not credit the Angular CDK the library dropped in 22.1.0', () => {
		const highlights = page.boardLibrary.overview.highlights ?? [];
		const claims = [page.boardLibrary.overview.text, ...highlights.map((highlight) => highlight.description)];

		for (const claim of claims) {
			expect(claim).not.toMatch(CDK_CREDIT);
		}
	});

	it('types the outputs as the OutputEmitterRef the component actually exposes', () => {
		const board = TestBed.createComponent(HubBoardComponent).componentInstance;

		for (const output of page.boardLibrary.api.outputs) {
			expect(board[output.name as 'onCardClick']).toBeInstanceOf(OutputEmitterRef);
			expect(output.type).toMatch(/^OutputEmitterRef</);
		}
	});

	it('documents every projection directive the library exports', () => {
		const documented = page.boardLibrary.api.templates.map((template) => resolve(en, template.name));

		for (const directive of PROJECTION_DIRECTIVES) {
			expect(documented).toContain(selectorOf(directive));
		}
	});

	it('keeps the changelog abreast of the released version', () => {
		expect(page.boardLibrary.overview.changelog[0].version).toBe(LIBRARY_VERSIONS['board']);
	});

	it('registers a keyboard and screen-reader example, grouped and navigable', () => {
		const example = registry.get('board-keyboard-accessibility');

		expect(example).toBeDefined();
		expect(BOARD_EXAMPLE_GROUPS.some((group) => group.exampleIds.includes('board-keyboard-accessibility'))).toBe(true);
		expect(typeof KeyboardAccessibilityBoardExampleComponent.templateCode).toBe('string');
		expect(KeyboardAccessibilityBoardExampleComponent.templateCode).not.toBe('');
		expect(typeof KeyboardAccessibilityBoardExampleComponent.componentCode).toBe('string');
		expect(KeyboardAccessibilityBoardExampleComponent.componentCode).not.toBe('');
	});

	it('no longer advertises a scroll-detection padding the board never exposed', () => {
		const inputs = (HubBoardComponent as unknown as { ɵcmp: { inputs: Record<string, unknown> } }).ɵcmp.inputs;

		expect(Object.keys(inputs)).not.toContain('scrollDetectionPadding');
		expect(registry.get('board-custom-scroll-padding')).toBeUndefined();

		const groupedIds = BOARD_EXAMPLE_GROUPS.flatMap((group) => group.exampleIds);

		expect(groupedIds).not.toContain('board-custom-scroll-padding');
		for (const id of groupedIds) {
			expect(`${id}:${registry.has(id)}`).toBe(`${id}:true`);
		}

		for (const [language, bundle] of TRANSLATIONS) {
			for (const key of ['DOCS.BOARD.EXAMPLE.CUSTOM_SCROLL_PADDING.TITLE', 'DOCS.BOARD.NAV.CUSTOM_SCROLL_PADDING']) {
				expect(`${language}:${key}:${resolve(bundle, key)}`).toBe(`${language}:${key}:undefined`);
			}
		}
	});

	it('labels every registered example through i18n, never with a raw string', () => {
		const examples = registry.getAll().filter((example) => example.packagePath === 'board');

		for (const example of examples) {
			expect(example.title).toMatch(/^DOCS\./);
			expect((example as unknown as { description?: string }).description).toBeUndefined();
		}
	});

	it('resolves every board documentation key in all eight languages', () => {
		const keys = [
			...page.boardLibrary.api.templates.flatMap((template) => [template.name, template.description]),
			'DOCS.BOARD.EXAMPLE.KEYBOARD_ACCESSIBILITY.TITLE',
			'DOCS.BOARD.NAV.KEYBOARD_ACCESSIBILITY'
		];

		for (const [language, bundle] of TRANSLATIONS) {
			for (const key of keys) {
				expect(`${language}:${key}:${typeof resolve(bundle, key)}`).toBe(`${language}:${key}:string`);
			}
		}
	});
});
