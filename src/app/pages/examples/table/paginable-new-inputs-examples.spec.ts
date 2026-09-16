import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HubTranslationService } from 'ng-hub-ui-utils';

import { BasicPaginatorExampleComponent } from '../paginator/basic-paginator-example.component';
import { ResourceListExampleComponent } from '../list/resource-list-example.component';
import { CompareSearchFnTableExampleComponent } from './compare-search-fn-table-example.component';
import { ResourceTableExampleComponent } from './resource-table-example.component';
import { SelectWhileSelectingTableExampleComponent } from './select-while-selecting-table-example.component';

/**
 * The examples that demonstrate what 22.18.0 added, mounted rather than read.
 *
 * A demo for a new input is worth nothing if it silently shows the old behaviour, and that is not
 * a hypothetical here: the two `[resource]` demos are the first place in this repository where the
 * input meets Angular's own `resource()` rather than a stand-in, and a failed resource rethrows
 * from `value()` — which the table used to read first, so the error state never arrived.
 *
 * Each case asserts the one thing its prose promises, through the DOM.
 */

// The application wires the translation service through `provideHubTranslationAdapter()`, which
// also registers the dictionary. Here the bare service is enough: every label under test is
// written by the example itself, not translated.
beforeEach(() => {
	TestBed.configureTestingModule({ providers: [HubTranslationService] });
});

/**
 * Repaints, lets the fake endpoints inside the examples resolve, then repaints again.
 *
 * The leading pass matters: `TestBed` does not synchronize on its own, so a click that changed a
 * signal the resource reads has not started the request yet — waiting first would time the wait
 * against a loader that has not been called.
 */
async function settle(fixture: ComponentFixture<unknown>, ms = 900): Promise<void> {
	fixture.detectChanges();
	await new Promise((resolve) => setTimeout(resolve, ms));
	fixture.detectChanges();
}

describe('paginable resource examples', () => {
	it('the table example loads its page through a real resource()', async () => {
		const fixture = TestBed.createComponent(ResourceTableExampleComponent);
		fixture.detectChanges();

		await settle(fixture);

		const rows = fixture.nativeElement.querySelectorAll('tr.hub-table__body-row');
		expect(rows.length).toBe(5);
		expect(fixture.nativeElement.textContent).toContain('Cerámicas Talavera');
	});

	it('the table example draws the error state when the endpoint fails', async () => {
		const fixture = TestBed.createComponent(ResourceTableExampleComponent);
		fixture.detectChanges();
		await settle(fixture);

		const [, breakIt] = fixture.nativeElement.querySelectorAll('button');
		breakIt.click();
		await settle(fixture);

		expect(fixture.nativeElement.querySelector('.hub-table__error')).toBeTruthy();

		// And mending it brings the rows back, which is the half a thrown value swallowed.
		breakIt.click();
		await settle(fixture);

		expect(fixture.nativeElement.querySelector('.hub-table__error')).toBeNull();
		expect(fixture.nativeElement.querySelectorAll('tr.hub-table__body-row').length).toBe(5);
	});

	it('the table example refetches through the consumer signal when the page changes', async () => {
		const fixture = TestBed.createComponent(ResourceTableExampleComponent);
		fixture.detectChanges();
		await settle(fixture);

		expect(fixture.nativeElement.textContent).toContain('requests sent: 1');

		const second = [...fixture.nativeElement.querySelectorAll('.hub-paginator__link')].find(
			(link: any) => link.textContent.trim() === '2'
		) as HTMLElement;
		second.click();
		await settle(fixture);

		// The table never calls reload(): the request went out because paging wrote the signal
		// the loader reads.
		expect(fixture.nativeElement.textContent).toContain('requests sent: 2');
		expect(fixture.nativeElement.textContent).toContain('F-2026-0153');
	});

	it('the list example renders the array its resource resolves to', async () => {
		const fixture = TestBed.createComponent(ResourceListExampleComponent);
		fixture.detectChanges();

		await settle(fixture);

		expect(fixture.nativeElement.textContent).toContain('Sala Azafrán');
		expect(fixture.nativeElement.querySelector('.hub-list__error')).toBeNull();
	});
});

describe('paginable selectWhileSelecting example', () => {
	let fixture: ComponentFixture<SelectWhileSelectingTableExampleComponent>;

	const rows = () => [...fixture.nativeElement.querySelectorAll('tr.hub-table__body-row')] as HTMLElement[];
	// Scoped to the body: the demo's own `selectWhileSelecting` switch and the header's
	// "select all" are checkboxes too.
	const boxes = () => [...fixture.nativeElement.querySelectorAll('tbody input[type="checkbox"]')] as HTMLInputElement[];

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectWhileSelectingTableExampleComponent);
		fixture.detectChanges();
	});

	it('opens the record while nothing is picked', () => {
		rows()[0].click();
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('Opened');
	});

	it('marks the row instead, once something is picked', () => {
		boxes()[0].click();
		fixture.detectChanges();

		rows()[2].click();
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('2 picked');
		expect(fixture.nativeElement.textContent).not.toContain('Opened');
	});
});

describe('paginable searchFn and compareFn example', () => {
	let fixture: ComponentFixture<CompareSearchFnTableExampleComponent>;

	const search = (term: string) => {
		const field = fixture.nativeElement.querySelector('input[type="search"], .hub-table__search input') as HTMLInputElement;
		field.value = term;
		field.dispatchEvent(new Event('input'));
		fixture.detectChanges();
	};
	const subjects = () =>
		[...fixture.nativeElement.querySelectorAll('tr.hub-table__body-row')].map((row: any) => row.textContent as string);

	beforeEach(() => {
		fixture = TestBed.createComponent(CompareSearchFnTableExampleComponent);
		fixture.detectChanges();
	});

	it('finds rows by a field no column shows', async () => {
		search('ana');
		await settle(fixture, 50);

		// Two tickets were raised by Ana Ferreiro, and the requester has no column.
		expect(subjects().length).toBe(2);
		expect(subjects().join(' ')).toContain('Export ends in a 500');
	});

	it('marks the stored pick even though it lacks a field the row carries', async () => {
		const restore = [...fixture.nativeElement.querySelectorAll('button')].find((button: any) =>
			button.textContent.includes('Restore the saved pick')
		) as HTMLButtonElement;

		restore.click();
		// `ngModel` writes the selection back on a microtask, so the tick lands a pass later.
		await settle(fixture, 0);

		const marked = [...fixture.nativeElement.querySelectorAll('tr.hub-table__body-row')].filter((row: any) =>
			row.className.includes('hub-table__body-row--selected')
		);
		expect(marked.length).toBe(1);
	});
});

describe('paginable paginator example', () => {
	it('pages the collection and reports the range', () => {
		const fixture = TestBed.createComponent(BasicPaginatorExampleComponent);
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('Showing 1–10 of 43');
		expect(fixture.nativeElement.querySelectorAll('.list-group-item').length).toBe(10);

		const next = [...fixture.nativeElement.querySelectorAll('.hub-paginator__link')].find(
			(link: any) => link.textContent.trim() === '2'
		) as HTMLElement;
		next.click();
		fixture.detectChanges();

		expect(fixture.nativeElement.textContent).toContain('Showing 11–20 of 43');
	});
});
