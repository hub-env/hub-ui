import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
	HubAppendDirective,
	HubDatepickerComponent,
	HubInputComponent,
	HubPrependDirective,
	HubSelectComponent,
	HubTextareaComponent
} from 'ng-hub-ui-forms';
import { exampleLocale } from '../../../shared/example-locale';
import { HubIconComponent } from 'ng-hub-ui-icons';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * `[hubPrepend]` / `[hubAppend]` — icons, buttons and whole fields attached to a field's edge, on
 * every field that renders as a box with a value.
 *
 * Two mechanisms that compose rather than compete:
 *
 * - **`prepend` / `append`** (strings) label the field: a currency, a unit, a protocol. Not
 *   focusable, sharing the field's border.
 * - **`[hubPrepend]` / `[hubAppend]`** (templates) carry anything richer — an icon, a button that
 *   acts on the value, or **another field**. Always rendered outermost on their side, so a unit
 *   stays next to the field and what acts on it sits beyond.
 *
 * Whatever is projected wears the field's border, radius and height rather than its own, which is
 * what keeps a button from drawing a second, thicker seam beside the control. A projected **field**
 * is the one case where that happens a level deeper: the host gives up the border it should never
 * have taken and the control inside it takes the squaring, because a field primitive keeps its box
 * on the control rather than on its host.
 */
@Component({
	selector: 'app-forms-field-attached-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubInputComponent,
		HubTextareaComponent,
		HubSelectComponent,
		HubDatepickerComponent,
		HubPrependDirective,
		HubAppendDirective,
		HubIconComponent,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 32rem;">
			<hub-input formControlName="query" label="Search" placeholder="Type a term">
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Run the search"
						(click)="run('search')"
					>
						<hub-icon name="fa:solid:magnifying-glass" />
					</button>
				</ng-template>
			</hub-input>

			<hub-input formControlName="amount" label="Amount" prepend="€" placeholder="0.00">
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Recalculate"
						(click)="run('calc')"
					>
						<hub-icon name="fa:solid:calculator" />
					</button>
				</ng-template>
			</hub-input>

			<hub-select
				formControlName="product"
				label="Product"
				[items]="products"
				bindLabel="name"
				bindValue="id"
				placeholder="Pick one"
			>
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Configure"
						(click)="run('configure')"
					>
						<hub-icon name="fa:solid:gear" />
					</button>
				</ng-template>
			</hub-select>

			<hub-datepicker [locale]="locale()" formControlName="due" label="Due date" prepend="From" placeholder="Pick a date">
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Set to today"
						(click)="run('today')"
					>
						<hub-icon name="fa:solid:rotate-left" />
					</button>
				</ng-template>
			</hub-datepicker>

			<!-- A slot can hand over a FIELD, not only a button. A price and the period it is a
			     price of are one statement — "180 € a month" — and splitting them into two
			     separate fields makes the reader put it back together on every row. The
			     appended select loses its own leading corners and shares the input's edge, so
			     the pair reads as the single answer it is. -->
			<hub-input formControlName="rate" label="Rate" prepend="€" placeholder="0.00">
				<ng-template hubAppend>
					<hub-select
						formControlName="period"
						[items]="periods"
						bindLabel="name"
						bindValue="id"
						[clearable]="false"
						placeholder="per"
					/>
				</ng-template>
			</hub-input>

			<!-- The mirror of the pair above, and the shape the corner fix was written for: a field on
			     the LEADING edge. "Every 2 weeks" is one statement, and reading it takes both boxes,
			     so they have to close as one. The count keeps the group's rounded outer edge while
			     the seam it shares with the period is square — which is exactly what a rule meant
			     for the group's own control had been taking away from it. -->
			<hub-select
				formControlName="cadence"
				label="Repeat"
				[items]="periods"
				bindLabel="name"
				bindValue="id"
				[clearable]="false"
			>
				<ng-template hubPrepend>
					<hub-input formControlName="every" type="number" [min]="1" />
				</ng-template>
			</hub-select>

			<hub-input formControlName="quantity" label="Quantity" placeholder="1">
				<ng-template hubPrepend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Decrease"
						(click)="step(-1)"
					>
						<hub-icon name="fa:solid:minus" />
					</button>
				</ng-template>
				<ng-template hubAppend>
					<button type="button" hubButton variant="outline" color="secondary" aria-label="Increase" (click)="step(1)">
						<hub-icon name="fa:solid:plus" />
					</button>
				</ng-template>
			</hub-input>

			<!-- A slot takes a TEMPLATE, so it can hand over more than one element — and the
			     strip then closes as one piece, only its outermost button keeping a rounded
			     outer edge. Two actions on one side is the ordinary case for a field that can
			     be both resolved and cleared. -->
			<hub-select
				formControlName="assignee"
				label="Assignee"
				[items]="assignees"
				bindLabel="name"
				bindValue="id"
				placeholder="Unassigned"
			>
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Assign to me"
						(click)="run('assign')"
					>
						<hub-icon name="fa:solid:user-check" />
					</button>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Clear the assignee"
						(click)="run('unassign')"
					>
						<hub-icon name="fa:solid:xmark" />
					</button>
				</ng-template>
			</hub-select>

			<!-- Decoration, not a control: a plain element takes the addon's fill so it
			     reads as a label rather than inviting a click that does nothing. -->
			<hub-textarea formControlName="notes" label="Notes" append="Markdown" [rows]="3">
				<ng-template hubPrepend>
					<span aria-hidden="true"><hub-icon name="fa:solid:pen" /></span>
				</ng-template>
			</hub-textarea>

			@if (last()) {
				<p role="status" style="margin: 0; font-size: 0.85rem;">Last action: {{ last() }}</p>
			}
		</form>
	`
})
export class FormsFieldAttachedExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	readonly periods = [
		{ id: 'month', name: 'a month' },
		{ id: 'week', name: 'a week' },
		{ id: 'day', name: 'a day' }
	];

	readonly products = [
		{ id: 1, name: 'Building access code' },
		{ id: 2, name: 'Visitor badge' }
	];

	readonly assignees = [
		{ id: 1, name: 'Front desk' },
		{ id: 2, name: 'Facilities' }
	];

	readonly last = signal('');

	readonly form = new FormGroup({
		query: new FormControl<string | null>(null),
		amount: new FormControl<string | null>(null),
		product: new FormControl<number | null>(null),
		due: new FormControl<string | null>(null),
		rate: new FormControl<string | null>(null),
		period: new FormControl<string | null>('month'),
		cadence: new FormControl<string | null>('week'),
		every: new FormControl<number>(2),
		quantity: new FormControl<number>(1),
		assignee: new FormControl<number | null>(null),
		notes: new FormControl<string | null>(null)
	});

	/** Stands in for whatever each attached action would really do. */
	run(what: string): void {
		this.last.set(what);
	}

	/** The stepper both buttons drive — the point being that either edge can hold a control. */
	step(by: number): void {
		const next = Math.max(0, (this.form.value.quantity ?? 0) + by);
		this.form.patchValue({ quantity: next });
		this.last.set(`quantity → ${next}`);
	}

	static readonly templateCode = `<!-- a button that acts on the value -->
<hub-input formControlName="query" label="Search">
  <ng-template hubAppend>
    <button type="button" aria-label="Run the search" (click)="run()">
      <hub-icon name="fa:solid:magnifying-glass" />
    </button>
  </ng-template>
</hub-input>

<!-- a string addon and an action compose: the action stays outermost -->
<hub-input formControlName="amount" label="Amount" prepend="€">
  <ng-template hubAppend>
    <button type="button" aria-label="Recalculate"><hub-icon name="fa:solid:calculator" /></button>
  </ng-template>
</hub-input>

<!-- the same slot on every box-shaped field -->
<hub-select formControlName="product" [items]="products" bindLabel="name">
  <ng-template hubAppend>…</ng-template>
</hub-select>

<hub-datepicker formControlName="due" prepend="From">
  <ng-template hubAppend>…</ng-template>
</hub-datepicker>

<!-- a slot can hand over a FIELD, not only a button. A price and the period it is
     a price of are one statement — "180 € a month" — and splitting them into two
     separate fields makes the reader put it back together on every row. The
     appended select gives up its own leading corners and shares the input's edge -->
<hub-input formControlName="rate" label="Rate" prepend="€" placeholder="0.00">
  <ng-template hubAppend>
    <hub-select
      formControlName="period"
      [items]="periods"
      bindLabel="name"
      bindValue="id"
      [clearable]="false"
      placeholder="per"
    />
  </ng-template>
</hub-input>

<!-- and on the leading edge, which is the same idea read the other way round:
     "every 2 weeks". The count keeps the group's rounded outer edge, and only the
     seam it shares with the period is square -->
<hub-select formControlName="cadence" label="Repeat" [items]="periods" bindLabel="name" bindValue="id">
  <ng-template hubPrepend>
    <hub-input formControlName="every" type="number" [min]="1" />
  </ng-template>
</hub-select>

<!-- either edge can hold a control: a stepper is a button on each side -->
<hub-input formControlName="quantity" label="Quantity">
  <ng-template hubPrepend>
    <button type="button" aria-label="Decrease" (click)="step(-1)">
      <hub-icon name="fa:solid:minus" />
    </button>
  </ng-template>
  <ng-template hubAppend>
    <button type="button" aria-label="Increase" (click)="step(1)">
      <hub-icon name="fa:solid:plus" />
    </button>
  </ng-template>
</hub-input>

<!-- a slot takes a TEMPLATE, so it can hold more than one element; the strip
     closes as one piece and only its outermost button keeps a rounded edge -->
<hub-select formControlName="assignee" [items]="assignees" bindLabel="name">
  <ng-template hubAppend>
    <button type="button" aria-label="Assign to me"><hub-icon name="fa:solid:user-check" /></button>
    <button type="button" aria-label="Clear the assignee"><hub-icon name="fa:solid:xmark" /></button>
  </ng-template>
</hub-select>

<hub-textarea formControlName="notes" append="Markdown">
  <ng-template hubPrepend><hub-icon name="fa:solid:pen" /></ng-template>
</hub-textarea>`;

	static readonly componentCode = `// Two mechanisms that compose rather than compete:
//
//   prepend / append      strings that LABEL the field — a currency, a unit.
//                         Not focusable, sharing the field's border.
//   [hubPrepend]/[hubAppend]  templates that carry anything richer — an icon,
//                         a button that ACTS on the value, or another FIELD.
//
// Projected content is always outermost on its side, so a unit stays next to
// the field and the action sits beyond it. It also wears the field's border,
// radius and height rather than its own, which is what stops a button from
// drawing a second, thicker seam beside the control. A projected FIELD is the
// one case handled a level deeper — its host gives up the border, and the
// control inside it takes the squaring — because a field keeps its box on the
// control rather than on its host.
//
// A slot projects a template, not a single element, so it may hold several —
// the strip is then flattened between them and only the outermost element on
// each side keeps its outer radius.
//
// Import HubPrependDirective / HubAppendDirective from 'ng-hub-ui-forms'.

readonly form = new FormGroup({
  query: new FormControl<string | null>(null),
  amount: new FormControl<string | null>(null),
  product: new FormControl<number | null>(null),
  due: new FormControl<string | null>(null),
  rate: new FormControl<string | null>(null),
  period: new FormControl<string | null>('month'),
  quantity: new FormControl<number>(1),
  assignee: new FormControl<number | null>(null),
  notes: new FormControl<string | null>(null)
});

/** The stepper both buttons drive. */
step(by: number): void {
  this.form.patchValue({ quantity: Math.max(0, (this.form.value.quantity ?? 0) + by) });
}`;
}
