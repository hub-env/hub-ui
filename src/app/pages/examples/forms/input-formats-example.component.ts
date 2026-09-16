import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubInputComponent } from 'ng-hub-ui-forms';

/**
 * The non-text `hub-input` formats: number, counter, color, switch and checkbox.
 *
 * The last block is the mixed checkbox: `indeterminate` is two-way because the reader
 * resolves it — clicking a mixed box picks a side, so the component clears the state and
 * says so, which is exactly what a "select all" needs to stay honest.
 */
@Component({
	selector: 'app-forms-input-formats-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-input formControlName="age" type="number" label="Age" [min]="0" [max]="120" />
			<hub-input formControlName="qty" type="counter" label="Quantity" [min]="1" [max]="9" />
			<hub-input formControlName="color" type="color" label="Favorite color" />
			<hub-input formControlName="accept" type="switch" label="Accept terms" />
			<hub-input formControlName="news" type="checkbox" label="Subscribe to the newsletter" />
		</form>

		<form [formGroup]="permissions" style="display: grid; gap: 0.5rem; max-width: 28rem; margin-top: 1.5rem;">
			<hub-input
				[formControl]="allPermissions"
				type="checkbox"
				label="All permissions"
				[(indeterminate)]="somePermissions"
				(valueChange)="toggleAll($any($event))"
			/>
			<div style="display: grid; gap: 0.5rem; padding-inline-start: 1.5rem;">
				<hub-input formControlName="read" type="checkbox" label="Read" (valueChange)="syncParent()" />
				<hub-input formControlName="write" type="checkbox" label="Write" (valueChange)="syncParent()" />
				<hub-input formControlName="admin" type="checkbox" label="Administer" (valueChange)="syncParent()" />
			</div>
		</form>
	`
})
export class FormsInputFormatsExampleComponent {
	readonly form = new FormGroup({
		age: new FormControl<number | null>(null),
		qty: new FormControl(1),
		color: new FormControl('#7c3aed'),
		accept: new FormControl(false),
		news: new FormControl(true)
	});

	readonly permissions = new FormGroup({
		read: new FormControl(true),
		write: new FormControl(false),
		admin: new FormControl(false)
	});

	/** Parent of the group: checked when all are, mixed when only some are. */
	readonly allPermissions = new FormControl(false);

	/** Two-way: the component clears it as soon as the reader picks a side. */
	somePermissions = true;

	/** A click on the parent commits every child to the same answer. */
	toggleAll(checked: boolean): void {
		this.permissions.setValue({ read: checked, write: checked, admin: checked });
		this.somePermissions = false;
	}

	/** A click on a child re-derives the parent: all, none, or mixed. */
	syncParent(): void {
		const values = Object.values(this.permissions.getRawValue());
		const checked = values.filter(Boolean).length;

		this.allPermissions.setValue(checked === values.length, { emitEvent: false });
		this.somePermissions = checked > 0 && checked < values.length;
	}

	static readonly templateCode = `<!-- number with auto min/max validators -->
<hub-input formControlName="age" type="number" label="Age" [min]="0" [max]="120" />

<!-- counter with -/+ steppers -->
<hub-input formControlName="qty" type="counter" label="Quantity" [min]="1" [max]="9" />

<!-- color: a hex field, the square opens the native picker (pass [swatches] for a palette grid) -->
<hub-input formControlName="color" type="color" label="Favorite color" />

<!-- switch (boolean) -->
<hub-input formControlName="accept" type="switch" label="Accept terms" />

<!-- checkbox (boolean) -->
<hub-input formControlName="news" type="checkbox" label="Subscribe to the newsletter" />

<!-- mixed checkbox: the "select all" of a group -->
<hub-input
  [formControl]="allPermissions"
  type="checkbox"
  label="All permissions"
  [(indeterminate)]="somePermissions"
  (valueChange)="toggleAll($any($event))"
/>`;

	static readonly componentCode = `readonly form = new FormGroup({
  age: new FormControl<number | null>(null),
  qty: new FormControl(1),
  color: new FormControl('#7c3aed'),
  accept: new FormControl(false),
  news: new FormControl(true)
});

// The mixed state is two-way: clicking a mixed checkbox picks a side, so the
// component clears it and tells the caller — no need to reset it by hand.
readonly permissions = new FormGroup({
  read: new FormControl(true),
  write: new FormControl(false),
  admin: new FormControl(false)
});
readonly allPermissions = new FormControl(false);
somePermissions = true;

toggleAll(checked: boolean): void {
  this.permissions.setValue({ read: checked, write: checked, admin: checked });
  this.somePermissions = false;
}

syncParent(): void {
  const values = Object.values(this.permissions.getRawValue());
  const checked = values.filter(Boolean).length;

  this.allPermissions.setValue(checked === values.length, { emitEvent: false });
  this.somePermissions = checked > 0 && checked < values.length;
}`;
}
