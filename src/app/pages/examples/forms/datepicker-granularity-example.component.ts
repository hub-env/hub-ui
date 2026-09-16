import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * The whole `granularity` axis, side by side, each picker printing what it emits.
 *
 * `granularity` also selects the panel: `year` and `month` render a 12-cell period grid, `day` the
 * familiar calendar, and anything finer adds a time strip to it.
 */
@Component({
	selector: 'app-forms-datepicker-granularity-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form
			[formGroup]="form"
			style="display: grid; gap: 1.25rem; grid-template-columns: repeat(auto-fit, minmax(21rem, 1fr));"
		>
			@for (unit of units; track unit.key) {
				<div style="display: grid; gap: 0.4rem;">
					<hub-datepicker
						[locale]="locale()"
						[formControlName]="unit.key"
						[granularity]="unit.key"
						[label]="unit.label"
						placeholder="Pick one"
					/>
					<code
						style="font-size: 0.75rem; overflow-wrap: anywhere; color: var(--hub-ref-color-gray-600, #6c757d); line-height: 1.5;"
					>
						{{ form.get(unit.key)?.value ?? unit.shape }}
					</code>
				</div>
			}
		</form>
	`
})
export class FormsDatepickerGranularityExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	/**
	 * One entry per granularity, coarsest first — the order the axis is documented in.
	 *
	 * `shape` is a complete sample of what that granularity emits, shown until something is picked.
	 * Written out in full on purpose: an elided `…T09:00:00` reads as a value that got cut off.
	 */
	readonly units = [
		{ key: 'year' as const, label: 'year', shape: '2026' },
		{ key: 'month' as const, label: 'month', shape: '2026-09' },
		{ key: 'day' as const, label: 'day (default)', shape: '2026-09-01' },
		{ key: 'hour' as const, label: 'hour', shape: '2026-09-01T09:00:00+02:00' },
		{ key: 'minute' as const, label: 'minute', shape: '2026-09-01T09:30:00+02:00' },
		{ key: 'second' as const, label: 'second', shape: '2026-09-01T09:30:45+02:00' }
	];

	readonly form = new FormGroup({
		year: new FormControl<string | null>(null),
		month: new FormControl<string | null>(null),
		day: new FormControl<string | null>(null),
		hour: new FormControl<string | null>(null),
		minute: new FormControl<string | null>(null),
		second: new FormControl<string | null>(null)
	});

	static readonly templateCode = `<!-- the panel follows the granularity -->
<hub-datepicker formControlName="year"   granularity="year" />   <!-- decade grid -->
<hub-datepicker formControlName="month"  granularity="month" />  <!-- 12-month grid -->
<hub-datepicker formControlName="day" />                          <!-- calendar (default) -->
<hub-datepicker formControlName="hour"   granularity="hour" />   <!-- calendar + hour -->
<hub-datepicker formControlName="minute" granularity="minute" /> <!-- calendar + hh:mm -->
<hub-datepicker formControlName="second" granularity="second" /> <!-- calendar + hh:mm:ss -->`;

	static readonly componentCode = `// granularity is orthogonal to mode: mode says how many points are
// picked, granularity says how precise each one is. Both work together,
// so mode="range" granularity="month" yields { start: "2026-01", end: "2026-06" }.
//
// What each one emits with the default valueFormat of 'iso':
//
//   year    "2026"
//   month   "2026-09"
//   day     "2026-09-01"                    <- the default, unchanged
//   hour    "2026-09-01T09:00:00+02:00"
//   minute  "2026-09-01T09:30:00+02:00"
//   second  "2026-09-01T09:30:45+02:00"

readonly form = new FormGroup({
  year: new FormControl<string | null>(null),
  month: new FormControl<string | null>(null),
  day: new FormControl<string | null>(null),
  hour: new FormControl<string | null>(null),
  minute: new FormControl<string | null>(null),
  second: new FormControl<string | null>(null)
});`;
}
