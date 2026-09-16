import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubIconComponent } from 'ng-hub-ui-icons';
import { HubInputComponent, HubInputPrefixDirective, HubLabelType, HubSelectComponent } from 'ng-hub-ui-forms';

/**
 * `labelType="visually-hidden"` — the fourth placement, and the one that is not a placement.
 *
 * Two layouts have no room for a label and no need for one: a toolbar, where the magnifier and
 * the placeholder already say "search", and a grid of editable cells, where the column header
 * says what every cell in it holds. Sighted readers lose nothing. A screen reader lands on an
 * `<input>` announced as "edit, blank", and in the grid it hears the same three words on every
 * row, because a column header is not the accessible name of the controls under it.
 *
 * The value renders the label and keeps it bound to the control, then clips it out of the page.
 * Not `display: none`, which would take the name away with the pixels. Flip the switch to reveal
 * the same labels: nothing else in the markup changes, and neither does what the reader hears.
 */
@Component({
	selector: 'app-forms-label-visually-hidden-example',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		HubInputComponent,
		HubSelectComponent,
		HubInputPrefixDirective,
		HubIconComponent,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-4">
			<hub-input
				[formControl]="reveal"
				type="switch"
				label="Reveal the clipped labels"
				formText="Only the CSS changes. Every label is in the page either way, and so is its for/id pair."
				(valueChange)="revealed.set($any($event))"
			/>

			<form [formGroup]="filters" class="d-flex flex-wrap align-items-end gap-2">
				<hub-input
					formControlName="term"
					label="Search invoices"
					placeholder="Search invoices…"
					[labelType]="labelType()"
					[clearable]="true"
					style="flex: 1 1 16rem;"
				>
					<hub-icon hubInputPrefix name="fa:solid:magnifying-glass" />
				</hub-input>

				<hub-select
					formControlName="status"
					label="Filter by status"
					placeholder="Any status"
					[labelType]="labelType()"
					[items]="statuses"
					bindLabel="name"
					bindValue="id"
					style="flex: 0 1 12rem;"
				/>

				<button type="button" hubButton color="primary">Export</button>
			</form>

			<div class="table-responsive">
				<table class="table align-middle mb-0">
					<caption class="visually-hidden">
						Invoice lines, one editable quantity and unit price per line
					</caption>
					<thead>
						<tr>
							<th scope="col">Line</th>
							<th scope="col" style="width: 9rem;">Quantity</th>
							<th scope="col" style="width: 11rem;">Unit price</th>
						</tr>
					</thead>
					<tbody [formGroup]="lines">
						@for (line of lineControls; track line.name) {
							<tr [formGroupName]="line.name">
								<th scope="row" class="fw-normal">{{ line.description }}</th>
								<td>
									<!-- The column header names the column, never the control: without a label of
									     its own every cell in this table is announced "edit, blank". -->
									<hub-input
										formControlName="quantity"
										type="number"
										[label]="'Quantity for ' + line.description"
										[labelType]="labelType()"
										[min]="0"
									/>
								</td>
								<td>
									<hub-input
										formControlName="price"
										type="number"
										[label]="'Unit price for ' + line.description"
										[labelType]="labelType()"
										append="€"
										[min]="0"
									/>
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</div>
	`
})
export class FormsLabelVisuallyHiddenExampleComponent {
	/** Drives the placement of every label below, so the two states differ by nothing else. */
	protected readonly reveal = new FormControl(false, { nonNullable: true });

	/** Mirrors the switch, so the placement below is a `computed` rather than a subscription. */
	protected readonly revealed = signal(false);

	/** `'stacked'` while the switch is on, which is the placement the fields would have had. */
	protected readonly labelType = computed<HubLabelType>(() => (this.revealed() ? 'stacked' : 'visually-hidden'));

	protected readonly statuses = [
		{ id: 'draft', name: 'Draft' },
		{ id: 'sent', name: 'Sent' },
		{ id: 'paid', name: 'Paid' },
		{ id: 'overdue', name: 'Overdue' }
	];

	protected readonly filters = new FormGroup({
		term: new FormControl(''),
		status: new FormControl<string | null>(null)
	});

	/** One row per invoice line; the description is what makes each cell's label unique. */
	protected readonly lineControls = [
		{ name: 'design', description: 'Interface design' },
		{ name: 'build', description: 'Front-end implementation' }
	];

	protected readonly lines = new FormGroup({
		design: new FormGroup({ quantity: new FormControl(12), price: new FormControl(65) }),
		build: new FormGroup({ quantity: new FormControl(40), price: new FormControl(58) })
	});

	static readonly templateCode = `<!-- A toolbar: the magnifier and the placeholder already say "search",
     so the label is clipped rather than dropped. -->
<hub-input
  formControlName="term"
  label="Search invoices"
  placeholder="Search invoices…"
  labelType="visually-hidden"
  [clearable]="true"
>
  <hub-icon hubInputPrefix name="fa:solid:magnifying-glass" />
</hub-input>

<hub-select
  formControlName="status"
  label="Filter by status"
  placeholder="Any status"
  labelType="visually-hidden"
  [items]="statuses"
  bindLabel="name"
  bindValue="id"
/>

<!-- An editable grid: the column header names the column, not the control, so
     each cell still needs a name of its own — and a different one per row. -->
<td>
  <hub-input
    formControlName="quantity"
    type="number"
    [label]="'Quantity for ' + line.description"
    labelType="visually-hidden"
  />
</td>`;

	static readonly componentCode = `// 'visually-hidden' is the fourth HubLabelType. The label is rendered and stays
// bound to the control through for/id — it is clipped, not removed, because
// display: none would take the accessible name away with the pixels.
//
// Honoured by hub-input (checkboxes and switches included), hub-textarea,
// hub-select, hub-datepicker, hub-timepicker, hub-otp-input, hub-slider,
// hub-segmented and hub-file-input.
//
// hub-otp-input and hub-segmented render a group of controls rather than one
// control, so <label for> would point at a <div> and name nothing: both move the
// label text onto the group with aria-label instead.
readonly labelType = computed<HubLabelType>(() =>
  this.revealed() ? 'stacked' : 'visually-hidden'
);`;
}
