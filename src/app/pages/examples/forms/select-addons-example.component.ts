import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent, HubAppendDirective } from 'ng-hub-ui-forms';
import { HubIconComponent } from 'ng-hub-ui-icons';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The two ways to attach something to a `<hub-select>`, and why they are two:
 *
 * - **`prepend` / `append`** — static group addons, the same contract `hub-input` has. A
 *   currency, a unit, a protocol. They share the field's border and are not focusable.
 * - **`[hubAppend]`** — an interactive control attached to the inline-end edge. It is a
 *   template, not projected content, because the select's catch-all `<ng-content>` opens
 *   straight into the dropdown engine and would otherwise swallow it.
 *
 * Both can be present at once; the action always comes last, after any append addon.
 */
@Component({
	selector: 'app-forms-select-addons-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent, HubAppendDirective, HubIconComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 30rem;">
			<hub-select
				formControlName="currency"
				label="Budget"
				prepend="€"
				append="/ month"
				[items]="tiers"
				bindLabel="name"
				bindValue="id"
				placeholder="Pick a tier"
				formText="Static addons at both ends, like an input group."
			/>

			<hub-select
				formControlName="endpoint"
				label="Endpoint"
				[prepend]="['https://', 'api.']"
				[items]="regions"
				bindLabel="name"
				bindValue="id"
				placeholder="Pick a region"
				formText="A run of addons on one side reads as a single piece."
			/>

			<hub-select
				formControlName="product"
				label="Product"
				[items]="products"
				bindLabel="name"
				bindValue="id"
				placeholder="Pick a product"
				formText="An action attached to the edge — it acts on whatever is selected."
			>
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						[attr.aria-label]="'Configure the selected product'"
						[disabled]="!form.value.product"
						(click)="configure()"
					>
						<hub-icon name="fa:solid:gear" />
					</button>
				</ng-template>
			</hub-select>

			<hub-select
				formControlName="plan"
				label="Plan"
				append="EUR"
				[items]="tiers"
				bindLabel="name"
				bindValue="id"
				placeholder="Pick a plan"
				formText="Addon and action together — the action is always the outermost."
			>
				<ng-template hubAppend>
					<button
						type="button"
						hubButton
						variant="outline"
						color="secondary"
						aria-label="Compare plans"
						(click)="configure()"
					>
						<hub-icon name="fa:solid:scale-balanced" />
					</button>
				</ng-template>
			</hub-select>

			@if (lastAction()) {
				<p role="status" style="margin: 0; font-size: 0.85rem;">{{ lastAction() }}</p>
			}
		</form>
	`
})
export class FormsSelectAddonsExampleComponent {
	readonly tiers = [
		{ id: 'starter', name: 'Starter' },
		{ id: 'pro', name: 'Pro' },
		{ id: 'scale', name: 'Scale' }
	];

	readonly regions = [
		{ id: 'eu', name: 'eu-west-1' },
		{ id: 'us', name: 'us-east-1' }
	];

	readonly products = [
		{ id: 1, name: 'Building access code' },
		{ id: 2, name: 'Visitor badge' }
	];

	readonly lastAction = signal('');

	readonly form = new FormGroup({
		currency: new FormControl<string | null>(null),
		endpoint: new FormControl<string | null>(null),
		product: new FormControl<number | null>(null),
		plan: new FormControl<string | null>(null)
	});

	/** Stands in for whatever the attached action would really open. */
	configure(): void {
		this.lastAction.set(`Action fired for: ${this.form.value.product ?? this.form.value.plan ?? '—'}`);
	}

	static readonly templateCode = `<!-- static addons, same contract as hub-input -->
<hub-select formControlName="currency" label="Budget"
  prepend="€" append="/ month"
  [items]="tiers" bindLabel="name" bindValue="id" />

<!-- a run of addons on one side -->
<hub-select formControlName="endpoint" label="Endpoint"
  [prepend]="['https://', 'api.']"
  [items]="regions" bindLabel="name" bindValue="id" />

<!-- an interactive action attached to the edge -->
<hub-select formControlName="product" label="Product" [items]="products" bindLabel="name">
  <ng-template hubAppend>
    <button type="button" hubButton variant="outline" color="secondary"
            aria-label="Configure the selected product"
            [disabled]="!form.value.product" (click)="configure()">
      <hub-icon name="fa:solid:gear" />
    </button>
  </ng-template>
</hub-select>

<!-- both at once: the action is always outermost -->
<hub-select formControlName="plan" label="Plan" append="EUR" [items]="tiers" bindLabel="name">
  <ng-template hubAppend>
    <button type="button" hubButton variant="outline" color="secondary" aria-label="Compare plans">
      <hub-icon name="fa:solid:scale-balanced" />
    </button>
  </ng-template>
</hub-select>`;

	static readonly componentCode = `// Two mechanisms, on purpose:
//
//   prepend / append   static labels sharing the field's border, not focusable
//   [hubAppend]        an interactive control attached to the inline-end edge
//
// [hubAppend] replaces the deprecated select-only [hubSelectSuffix]: the same
// slot, available on every field that renders as a box with a value.
//
// The suffix is a <ng-template> rather than plain projected content because the
// select's catch-all <ng-content> opens straight into the dropdown engine and is
// declared first — anything projected plainly would land inside the dropdown.
// Rendering from a template also keeps the action after the control in the DOM,
// so tabbing reaches the field before the button that acts on it.

readonly tiers = [
  { id: 'starter', name: 'Starter' },
  { id: 'pro', name: 'Pro' },
  { id: 'scale', name: 'Scale' }
];

readonly form = new FormGroup({
  currency: new FormControl<string | null>(null),
  endpoint: new FormControl<string | null>(null),
  product: new FormControl<number | null>(null),
  plan: new FormControl<string | null>(null)
});`;
}
