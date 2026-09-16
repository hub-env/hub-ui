import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, provideZoneChangeDetection, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { DocViewer } from './doc-viewer';

describe('DocViewer', () => {
	let http: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [DocViewerTestComponent],
			providers: [provideRouter([]), provideHttpClientTesting(), provideZoneChangeDetection()]
		});

		http = TestBed.inject(HttpTestingController);
	});

	it('should load doc into innerHTML', () => {
		const fixture = TestBed.createComponent(DocViewerTestComponent);
		fixture.detectChanges();

		const url = fixture.componentInstance.documentUrl;
		http.expectOne(url).flush(FAKE_DOCS[url]);

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		expect(docViewer).not.toBeNull();
		expect(docViewer.nativeElement.innerHTML).toBe('<div>my docs page</div>');
	});

	it('should load component', () => {
		const fixture = TestBed.createComponent(DocViewerWithCompTestComponent);
		fixture.detectChanges();

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		expect(docViewer).not.toBeNull();
		expect(docViewer.nativeElement.textContent).toContain(`TEST_COMPONENT_GUIDE`);
	});

	it('should save textContent of the doc', () => {
		const fixture = TestBed.createComponent(DocViewerTestComponent);
		fixture.detectChanges();

		const url = fixture.componentInstance.documentUrl;
		http.expectOne(url).flush(FAKE_DOCS[url]);

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		expect(docViewer.componentInstance.textContent).toBe('my docs page');
	});

	it('should correct hash based links', () => {
		const fixture = TestBed.createComponent(DocViewerTestComponent);
		fixture.componentInstance.documentUrl = `http://material.angular.dev/doc-with-links.html`;
		fixture.detectChanges();

		const url = fixture.componentInstance.documentUrl;
		http.expectOne(url).flush(FAKE_DOCS[url]);

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		// The component prepends the current location.pathname to relative fragment links.
		expect(docViewer.nativeElement.innerHTML).toContain(`${location.pathname}#test"`);
	});

	it('should preserve document element ids', () => {
		const fixture = TestBed.createComponent(DocViewerTestComponent);
		const testUrl = 'http://material.angular.dev/doc-with-element-ids.html';

		fixture.componentInstance.documentUrl = testUrl;
		fixture.detectChanges();

		http.expectOne(testUrl).flush(FAKE_DOCS[testUrl]);

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		expect(docViewer.nativeElement.innerHTML).toContain('id="my-header"');
	});

	it('should show error message when doc not found', () => {
		vi.spyOn(console, 'error').mockReturnValue(undefined);

		const fixture = TestBed.createComponent(DocViewerTestComponent);
		const docViewer = fixture.debugElement.query(By.directive(DocViewer));
		fixture.detectChanges();

		const url = fixture.componentInstance.documentUrl;
		http.expectOne(url).flush(FAKE_DOCS[url]);

		const errorUrl = 'http://material.angular.dev/error-doc.html';

		fixture.componentInstance.documentUrl = errorUrl;
		fixture.detectChanges();

		http.expectOne(errorUrl).flush('Not found', { status: 404, statusText: 'Not found' });

		expect(docViewer).not.toBeNull();
		expect(docViewer.nativeElement.textContent).toContain(
			'Error al cargar documento: http://material.angular.dev/error-doc.html'
		);
		expect(console.error).toHaveBeenCalledTimes(1);
	});

	it('should show tooltip for deprecated symbol', () => {
		const fixture = TestBed.createComponent(DocViewerTestComponent);
		fixture.componentInstance.documentUrl = `http://material.angular.dev/deprecated.html`;
		fixture.detectChanges();

		const url = fixture.componentInstance.documentUrl;
		http.expectOne(url).flush(FAKE_DOCS[url]);

		const docViewer = fixture.debugElement.query(By.directive(DocViewer));

		expect(docViewer).not.toBeNull();

		// we have five deprecated symbols: class, constant, type alias, interface
		// and properties.
		expect(docViewer.children.length).toBe(5);

		// it should have "Deprecated" as its text content
		const deprecatedSymbol = docViewer.children.shift()!;
		expect(deprecatedSymbol.nativeElement.textContent).toBe('Deprecated');

		// Deprecated markers should still be rendered and queryable.
		expect(deprecatedSymbol.nativeElement.getAttribute('deprecated-message')).toContain('deprecated');
	});

	// Copy button support is not implemented in the current Bootstrap port.
});

@Component({
	selector: 'doc-viewer-test-host',
	template: `<doc-viewer [document]="documentUrl" />`,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [DocViewer]
})
class DocViewerTestComponent {
	documentUrl = 'http://material.angular.dev/simple-doc.html';
}

const FAKE_DOCS: {
	[key: string]: string;
} = {
	'http://material.angular.dev/simple-doc.html': '<div>my docs page</div>',
	'http://material.angular.dev/doc-with-example.html': `
      <div>Check out this example:</div>
      <div docs-example="some-example"></div>`,
	'http://material.angular.dev/doc-with-links.html': `<a href="#test">Test link</a>`,
	'http://material.angular.dev/doc-with-element-ids.html': `<h4 id="my-header">Header</h4>`,
	'http://material.angular.dev/snippet-example.html':
		'<div docs-example="some-example" file="some-example.html"' + ' region="some-region"></div>',
	'http://material.angular.dev/demo-example.html': '<div docs-example="demo-example"></div>',
	'http://material.angular.dev/whole-snippet-example.html':
		'<div docs-example="whole-snippet-example" file="whole-snippet-example.ts"></div>',
	'http://material.angular.dev/deprecated.html': `<div class="docs-api-class-deprecated-marker"
        deprecated-message="deprecated class">Deprecated</div>

      <div class="docs-api-constant-deprecated-marker"
        deprecated-message="deprecated constant">Deprecated</div>

      <div class="docs-api-interface-deprecated-marker"
        deprecated-message="deprecated interface">Deprecated</div>

      <div class="docs-api-type-alias-deprecated-marker"
        deprecated-message="deprecated type alias">Deprecated</div>

      <div class="docs-api-deprecated-marker"
        deprecated-message="deprecated">Deprecated</div>`
};

@Component({
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `TEST_COMPONENT_GUIDE`
})
class TestComponent {}

@Component({
	selector: 'doc-viewer-component-host',
	template: `<doc-viewer [document]="component" />`,
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [DocViewer, TestComponent]
})
class DocViewerWithCompTestComponent {
	component = TestComponent;
}
