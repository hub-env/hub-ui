import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import {
	HubDatepickerComponent,
	HubInputComponent,
	HubSegmentedComponent,
	HubSegmentedOption,
	HubSelectComponent,
	HubSliderComponent
} from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * Every field mirrored, under a direction you can flip.
 *
 * Most of this costs nothing to support: the primitives are written in logical CSS
 * properties, so paddings, borders, radii and the datepicker's icon gutter change sides on
 * their own. The three gathered at the bottom are the ones that could not, because their
 * geometry is only half CSS, and they are the reason this example exists rather than a
 * screenshot:
 *
 * - the **slider** fills its track with a background image, and background positions ignore
 *   `direction` entirely — while the native range underneath genuinely does mirror, so the
 *   fill and the thumb ran from opposite ends;
 * - the **switch** moved its knob on `left`, named by a `transition`, and a logical inset
 *   with a physical transition animates nothing at all;
 * - the **segmented control** places its pill from a measured offset, and a direction flip
 *   re-lays the options out without resizing anything — so nothing told it to measure again.
 *
 * That last one is what the toggle is for. Flip the direction and the pill follows within a
 * frame; before this release it stayed where it was, up to a bar's width from the option it
 * was supposed to be marking.
 */
@Component({
	selector: 'app-forms-rtl-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubInputComponent,
		HubSelectComponent,
		HubDatepickerComponent,
		HubSliderComponent,
		HubSegmentedComponent,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div style="display: grid; gap: 1rem;">
			<button
				type="button"
				hubButton
				variant="outline"
				color="secondary"
				size="sm"
				style="justify-self: start;"
				(click)="direction.set(direction() === 'rtl' ? 'ltr' : 'rtl')"
			>
				Reading {{ direction() === 'rtl' ? 'right to left' : 'left to right' }} — flip it
			</button>

			<div
				[dir]="direction()"
				[formGroup]="form"
				style="display: grid; gap: 1.25rem; padding: 1.25rem; border: 1px solid var(--hub-ref-color-gray-300, var(--hub-sys-border-color-default, #dee2e6)); border-radius: 0.5rem;"
			>
				<div style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));">
					<hub-input formControlName="street" label="Street" labelType="floating" />
					<hub-select formControlName="city" label="City" labelType="floating" [items]="cities" />
					<hub-datepicker
						[locale]="locale()"
						formControlName="arrival"
						label="Arrival"
						formText="The calendar button changes side."
					/>
				</div>

				<hub-slider formControlName="volume" label="Volume" [showValue]="true" />

				<hub-slider formControlName="price" label="Price range" [range]="true" [max]="1000" [showValue]="true" />

				<hub-segmented formControlName="view" label="View" [options]="views" />

				<hub-input formControlName="terms" type="switch" label="Accept terms" />
			</div>
		</div>
	`
})
export class FormsRtlExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	/** The direction applied to the demo container — flipped by the button, not by the page. */
	readonly direction = signal<'ltr' | 'rtl'>('rtl');

	readonly cities = ['Barcelona', 'Valencia', 'Sevilla'];

	readonly views: HubSegmentedOption[] = [
		{ value: 'list', label: 'List' },
		{ value: 'grid', label: 'Grid' },
		{ value: 'board', label: 'Board' }
	];

	readonly form = new FormGroup({
		street: new FormControl('Gran Via 2'),
		city: new FormControl('Barcelona'),
		arrival: new FormControl<Date | null>(null),
		volume: new FormControl(30),
		price: new FormControl([200, 800]),
		view: new FormControl('list'),
		terms: new FormControl(true)
	});

	static readonly templateCode = `<div [dir]="direction()" [formGroup]="form">
  <hub-input formControlName="street" label="Street" labelType="floating" />
  <hub-select formControlName="city" label="City" labelType="floating" [items]="cities" />
  <hub-datepicker formControlName="arrival" label="Arrival" />

  <hub-slider formControlName="volume" label="Volume" [showValue]="true" />
  <hub-slider formControlName="price" label="Price range" [range]="true" [max]="1000" [showValue]="true" />

  <hub-segmented formControlName="view" label="View" [options]="views" />
  <hub-input formControlName="terms" type="switch" label="Accept terms" />
</div>`;

	static readonly componentCode = `readonly direction = signal<'ltr' | 'rtl'>('rtl');

readonly views: HubSegmentedOption[] = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'board', label: 'Board' }
];

readonly form = new FormGroup({
  street: new FormControl('Gran Via 2'),
  city: new FormControl('Barcelona'),
  arrival: new FormControl<Date | null>(null),
  volume: new FormControl(30),
  price: new FormControl([200, 800]),
  view: new FormControl('list'),
  terms: new FormControl(true)
});`;
}
