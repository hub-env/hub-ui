import { provideZoneChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RtlSweepLoadingExampleComponent } from './rtl-sweep-loading-example.component';

/**
 * What the example teaches lives in the cascade — `[dir='rtl'] .hub-loading-bar` flips the sweep
 * token — and jsdom resolves no custom properties, so the animation itself cannot be asserted
 * here. What can be, and is what would silently break the lesson, is the arrangement: two
 * identical bars, one under each direction, both actually sweeping. A demo whose RTL card lost
 * its `dir`, or whose bars stopped being indeterminate, would still render and would still look
 * plausible.
 */
describe('RtlSweepLoadingExampleComponent', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RtlSweepLoadingExampleComponent],
			providers: [provideZoneChangeDetection()]
		});
	});

	it('puts one bar under each writing direction', () => {
		const fixture = TestBed.createComponent(RtlSweepLoadingExampleComponent);
		fixture.detectChanges();

		// `:scope` keeps the directional ancestor inside the fixture. Without it the selector is
		// matched against the whole document and only then filtered, so a `dir` left on <html> by
		// another spec would make every bar count as being under that direction.
		const root: HTMLElement = fixture.nativeElement;
		expect(root.querySelectorAll(':scope [dir="ltr"] hub-loading-bar').length, 'bars under dir="ltr"').toBe(1);
		expect(root.querySelectorAll(':scope [dir="rtl"] hub-loading-bar').length, 'bars under dir="rtl"').toBe(1);
	});

	it('sweeps both bars, which is the only mode the direction applies to', () => {
		const fixture = TestBed.createComponent(RtlSweepLoadingExampleComponent);
		fixture.detectChanges();

		const root: HTMLElement = fixture.nativeElement;
		const bars = Array.from(root.querySelectorAll<HTMLElement>('hub-loading-bar'));
		expect(bars.length).toBe(2);

		for (const bar of bars) {
			expect(bar.className, 'sweeping').toContain('hub-loading-bar--indeterminate');
			expect(bar.className, 'painted').toContain('hub-loading-bar--visible');
		}
	});

	it('takes both bars off screen together, so the sweep can be stopped while reading', () => {
		const fixture = TestBed.createComponent(RtlSweepLoadingExampleComponent);
		fixture.detectChanges();

		const root: HTMLElement = fixture.nativeElement;
		Array.from(root.querySelectorAll<HTMLButtonElement>('button'))
			.find((button) => button.textContent?.includes('sweeps'))!
			.click();
		fixture.detectChanges();

		for (const bar of Array.from(root.querySelectorAll<HTMLElement>('hub-loading-bar'))) {
			expect(bar.className, 'no longer painted').not.toContain('hub-loading-bar--visible');
		}
	});
});
