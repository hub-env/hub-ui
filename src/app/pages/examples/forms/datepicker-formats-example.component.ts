import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubDatepickerComponent } from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * The three format axes, which are independent of each other and of `granularity`:
 *
 * - **`parse`** — how a value coming *in* is read. ISO of any width, `Date` and epoch millis are
 *   detected automatically; this input is the escape hatch for anything else.
 * - **`valueFormat`** — what the bound control ends up holding.
 * - **`displayFormat`** — what the user reads in the field.
 *
 * Picking the same day in each of these produces a different value and a different display.
 */
@Component({
	selector: 'app-forms-datepicker-formats-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubDatepickerComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 34rem;">
			<div style="display: grid; gap: 0.4rem;">
				<hub-datepicker
					[locale]="locale()"
					formControlName="asDate"
					valueFormat="date"
					label='valueFormat="date"'
					placeholder="Pick a day"
				/>
				<code style="font-size: 0.75rem;">{{ describe(form.value.asDate) }}</code>
			</div>

			<div style="display: grid; gap: 0.4rem;">
				<hub-datepicker
					[locale]="locale()"
					formControlName="asTimestamp"
					valueFormat="timestamp"
					label='valueFormat="timestamp"'
					placeholder="Pick a day"
				/>
				<code style="font-size: 0.75rem;">{{ describe(form.value.asTimestamp) }}</code>
			</div>

			<div style="display: grid; gap: 0.4rem;">
				<hub-datepicker
					[locale]="locale()"
					formControlName="unixSeconds"
					[valueFormat]="toUnixSeconds"
					label="valueFormat as a function"
					placeholder="Pick a day"
					formText="Anything the enum does not cover — here, Unix seconds."
				/>
				<code style="font-size: 0.75rem;">{{ describe(form.value.unixSeconds) }}</code>
			</div>

			<div style="display: grid; gap: 0.4rem;">
				<hub-datepicker
					[locale]="locale()"
					formControlName="patterned"
					granularity="minute"
					displayFormat="dd/MM/yyyy HH:mm"
					label="displayFormat as a pattern"
					placeholder="Pick a moment"
					formText="An Angular date pattern. The stored value is unaffected."
				/>
				<code style="font-size: 0.75rem;">{{ describe(form.value.patterned) }}</code>
			</div>

			<div style="display: grid; gap: 0.4rem;">
				<hub-datepicker
					[locale]="locale()"
					formControlName="legacy"
					[parse]="parseSpanishDate"
					label="parse for a legacy dialect"
					placeholder="Pick a day"
					formText="Seeded with '15/06/2026', which no built-in rule would read."
				/>
				<code style="font-size: 0.75rem;">{{ describe(form.value.legacy) }}</code>
			</div>
		</form>
	`
})
export class FormsDatepickerFormatsExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	readonly form = new FormGroup({
		asDate: new FormControl<Date | null>(null),
		asTimestamp: new FormControl<number | null>(null),
		unixSeconds: new FormControl<number | null>(null),
		patterned: new FormControl<string | null>(null),
		// Seeded in a dialect only `parse` can read: dd/MM/yyyy.
		legacy: new FormControl<string | null>('15/06/2026')
	});

	/** Emits Unix seconds instead of milliseconds. */
	readonly toUnixSeconds = (date: Date): number => Math.floor(date.getTime() / 1000);

	/**
	 * Reads `dd/MM/yyyy`, building the date from its parts.
	 *
	 * Handing the string to `new Date(...)` would be the classic bug: an American engine reads
	 * `15/06/2026` as an invalid month, and `2026-06-15` as UTC midnight — the previous evening in
	 * Spain.
	 */
	readonly parseSpanishDate = (raw: unknown): Date | null => {
		if (raw instanceof Date) {
			return raw;
		}

		const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(`${raw ?? ''}`);

		return match ? new Date(+match[3], +match[2] - 1, +match[1]) : null;
	};

	/** Renders a value with its runtime type, so the difference between the axes is visible. */
	describe(value: unknown): string {
		if (value == null) {
			return '—';
		}

		if (value instanceof Date) {
			return `Date — ${value.toISOString()}`;
		}

		return `${typeof value} — ${value}`;
	}

	static readonly templateCode = `<!-- what the control holds -->
<hub-datepicker formControlName="asDate"      valueFormat="date" />
<hub-datepicker formControlName="asTimestamp" valueFormat="timestamp" />
<hub-datepicker formControlName="unixSeconds" [valueFormat]="toUnixSeconds" />

<!-- what the user reads (the stored value is unaffected) -->
<hub-datepicker formControlName="patterned" granularity="minute"
  displayFormat="dd/MM/yyyy HH:mm" />

<!-- how a value coming in is read -->
<hub-datepicker formControlName="legacy" [parse]="parseSpanishDate" />`;

	static readonly componentCode = `// Three independent axes, and none of them touches the others:
//
//   parse         how a value comes IN   (auto-detects ISO / Date / epoch)
//   valueFormat   what the control HOLDS ('iso' | 'date' | 'timestamp' | fn)
//   displayFormat what the user READS    (Intl options | pattern | fn)

readonly toUnixSeconds = (date: Date): number => Math.floor(date.getTime() / 1000);

/**
 * Reads dd/MM/yyyy from its parts. Handing the string to new Date(...) is the
 * classic bug: '2026-06-15' is read as UTC midnight — the previous evening
 * in Spain — and '15/06/2026' as an invalid month.
 */
readonly parseSpanishDate = (raw: unknown): Date | null => {
  if (raw instanceof Date) return raw;
  const match = /^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/.exec(\`\${raw ?? ''}\`);
  return match ? new Date(+match[3], +match[2] - 1, +match[1]) : null;
};

readonly form = new FormGroup({
  asDate: new FormControl<Date | null>(null),
  asTimestamp: new FormControl<number | null>(null),
  unixSeconds: new FormControl<number | null>(null),
  patterned: new FormControl<string | null>(null),
  legacy: new FormControl<string | null>('15/06/2026')
});`;
}
