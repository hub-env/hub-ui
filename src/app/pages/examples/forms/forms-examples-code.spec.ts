import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { faPack, provideHubIcons } from 'ng-hub-ui-icons';
import { FormsContainersExampleComponent } from './containers-example.component';
import { FormsFileInputBasicExampleComponent } from './file-input-basic-example.component';
import { FormsFileInputDropzoneExampleComponent } from './file-input-dropzone-example.component';
import { FormsInputBasicExampleComponent } from './input-basic-example.component';
import { FormsInputFormatsExampleComponent } from './input-formats-example.component';
import { FormsInputGroupsExampleComponent } from './input-groups-example.component';
import { FormsInputMaskExampleComponent } from './input-mask-example.component';
import { FormsInputOtpExampleComponent } from './input-otp-example.component';
import { FormsInputPasswordExampleComponent } from './input-password-example.component';
import { FormsLabelVisuallyHiddenExampleComponent } from './label-visually-hidden-example.component';
import { FormsSegmentedExampleComponent } from './segmented-example.component';
import { FormsSelectFormatsExampleComponent } from './select-formats-example.component';
import { FormsSelectGroupedExampleComponent } from './select-grouped-example.component';
import { FormsSelectSearchExampleComponent } from './select-search-example.component';
import { FormsSelectTemplatesExampleComponent } from './select-templates-example.component';
import { FormsSliderExampleComponent } from './slider-example.component';
import { FormsSliderStylingExampleComponent } from './slider-styling-example.component';
import { FormsTextareaExampleComponent } from './textarea-example.component';
import { FormsTimepickerExampleComponent } from './timepicker-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['FormsContainersExampleComponent', FormsContainersExampleComponent, ['templateCode', 'componentCode']],
	['FormsFileInputBasicExampleComponent', FormsFileInputBasicExampleComponent, ['templateCode', 'componentCode']],
	['FormsFileInputDropzoneExampleComponent', FormsFileInputDropzoneExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputBasicExampleComponent', FormsInputBasicExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputFormatsExampleComponent', FormsInputFormatsExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputGroupsExampleComponent', FormsInputGroupsExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputMaskExampleComponent', FormsInputMaskExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputOtpExampleComponent', FormsInputOtpExampleComponent, ['templateCode', 'componentCode']],
	['FormsInputPasswordExampleComponent', FormsInputPasswordExampleComponent, ['templateCode', 'componentCode']],
	['FormsLabelVisuallyHiddenExampleComponent', FormsLabelVisuallyHiddenExampleComponent, ['templateCode', 'componentCode']],
	['FormsSegmentedExampleComponent', FormsSegmentedExampleComponent, ['templateCode', 'componentCode']],
	['FormsSelectFormatsExampleComponent', FormsSelectFormatsExampleComponent, ['templateCode', 'componentCode']],
	['FormsSelectGroupedExampleComponent', FormsSelectGroupedExampleComponent, ['templateCode', 'componentCode']],
	['FormsSelectSearchExampleComponent', FormsSelectSearchExampleComponent, ['templateCode', 'componentCode']],
	['FormsSelectTemplatesExampleComponent', FormsSelectTemplatesExampleComponent, ['templateCode', 'componentCode']],
	['FormsSliderExampleComponent', FormsSliderExampleComponent, ['templateCode', 'componentCode']],
	['FormsSliderStylingExampleComponent', FormsSliderStylingExampleComponent, ['templateCode', 'componentCode']],
	['FormsTextareaExampleComponent', FormsTextareaExampleComponent, ['templateCode', 'componentCode']]
];

describe('forms examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});

/**
 * A capability is only documented once a reader can see it work. All three of these had reached
 * the site as prose and nothing else: `visually-hidden` as three rows of the API table,
 * `hub-timepicker` as a passing mention in two lists of addon-capable fields, and the fieldset
 * container as one of its two interchangeable selector forms — while the point of that release is
 * being able to pick either. Every assertion below reads the rendered DOM, because a mention in a
 * snippet or a comment satisfies a string match without drawing anything.
 */
describe('forms examples demonstrate what the library shipped', () => {
	beforeEach(() => {
		// The toolbar demo projects a <hub-icon>, and the registry throws on an unknown pack rather
		// than drawing nothing, so the fixture needs the same pack the application registers.
		TestBed.configureTestingModule({
			providers: [provideHubIcons({ defaultPack: 'fa', packs: { fa: faPack({ defaultVariant: 'solid' }) } })]
		});
	});

	it('renders a label that is clipped out of the page and still bound to its control', () => {
		const fixture = TestBed.createComponent(FormsLabelVisuallyHiddenExampleComponent as Type<unknown>);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement;

		const clipped = [...host.querySelectorAll<HTMLLabelElement>('label.hub-field__label--visually-hidden')];
		expect(clipped.length, 'clipped labels rendered').toBeGreaterThan(0);

		for (const label of clipped) {
			// display: none would take the accessible name away with the pixels, so the text and the
			// for/id pair have to survive the clipping.
			expect(label.textContent?.trim(), 'the label still carries its text').not.toBe('');
			// Attribute selector, not #id: the generated ids are UUIDs, which begin with a digit and
			// are therefore not valid CSS identifiers.
			expect(host.querySelector(`[id="${label.htmlFor}"]`), `control named by label[for]`).not.toBeNull();
		}
	});

	it('renders hub-timepicker as a real time control, bounds included', () => {
		const fixture = TestBed.createComponent(FormsTimepickerExampleComponent as Type<unknown>);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement;

		const times = [...host.querySelectorAll<HTMLInputElement>('input[type="time"]')];
		expect(times.length, 'time controls rendered').toBeGreaterThan(1);

		// The field is built on the platform control, so min / max / step have to reach it — that
		// is what a text input with an HH:MM pattern could never offer.
		const bounded = times.find((input) => input.min === '08:00');
		expect(bounded?.max, 'the bounded field').toBe('22:00');
		expect(bounded?.step, 'quarter-hour steps').toBe('900');

		// A whole instant is trimmed to the hour the control can show, rather than rendering nothing.
		expect(
			times.some((input) => input.value === '09:30'),
			"'09:30:00' trimmed to 09:30"
		).toBe(true);
	});

	it('renders both selector forms of the fieldset container', () => {
		const fixture = TestBed.createComponent(FormsContainersExampleComponent as Type<unknown>);
		fixture.detectChanges();
		const host: HTMLElement = fixture.nativeElement;

		// The attribute form dresses the native element it is written on; the element form emits a
		// <fieldset> of its own inside the host, which is the extra element the choice is about.
		expect(host.querySelector('fieldset[hubFieldset]'), 'the attribute form').not.toBeNull();
		expect(host.querySelector('hub-fieldset > fieldset'), 'the element form').not.toBeNull();

		// Both legends render through a <hub-legend>, whether the example projects one (Password,
		// which also carries the required marker) or lets `legend="…"` build it (Contact).
		const legends = [...host.querySelectorAll('legend.hub-fieldset__legend')].map((legend) =>
			legend.querySelector('.hub-legend')?.textContent?.trim()
		);
		expect(legends, 'a legend from each form').toEqual(
			expect.arrayContaining([expect.stringContaining('Password'), 'Contact'])
		);

		// Submitting proves the element form resolved its group: `groupName` reads the parent
		// container, and a group it never found would render no error at all.
		host.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
		fixture.detectChanges();

		const groupErrors = [...host.querySelectorAll('hub-fieldset .hub-field__feedback')].map((block) =>
			block.textContent?.trim()
		);
		expect(groupErrors, 'the group-level message').toEqual(
			expect.arrayContaining(['Leave us an email address or a phone number.'])
		);
	});
});
