import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubSelectComponent, HubSelectLabelDirective, HubSelectOptionDirective } from 'ng-hub-ui-forms';

interface Assignee {
	id: string;
	name: string;
	role: string;
	emoji: string;
}

/**
 * `hub-select` with custom option and label templates.
 *
 * The slots carry the library's own name — `hubSelectOption`, `hubSelectLabel` — rather than the
 * `ng-*-tmp` attributes of the vendored engine underneath, which are re-synced from upstream and
 * are nobody's to promise. Ten more cover the rest of the panel: the group header, the header and
 * footer, the empty result, the loading text and spinner, the add-tag row and the clear button.
 */
@Component({
	selector: 'app-forms-select-templates-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubSelectComponent, HubSelectOptionDirective, HubSelectLabelDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 28rem;">
			<hub-select
				formControlName="assignee"
				label="Assignee"
				[items]="people"
				bindLabel="name"
				placeholder="Pick a teammate"
			>
				<ng-template hubSelectLabel let-item="item">
					<span style="display: inline-flex; align-items: center; gap: 0.4rem;">
						<span style="font-size: 1.1rem;">{{ item.emoji }}</span>
						{{ item.name }}
					</span>
				</ng-template>

				<ng-template hubSelectOption let-item="item">
					<span style="display: flex; align-items: center; gap: 0.6rem;">
						<span style="font-size: 1.25rem;">{{ item.emoji }}</span>
						<span style="display: flex; flex-direction: column; line-height: 1.2;">
							<strong>{{ item.name }}</strong>
							<small style="opacity: 0.65;">{{ item.role }}</small>
						</span>
					</span>
				</ng-template>
			</hub-select>
		</form>
	`
})
export class FormsSelectTemplatesExampleComponent {
	readonly people: Assignee[] = [
		{ id: 'ana', name: 'Ana Ruiz', role: 'Frontend engineer', emoji: '👩‍💻' },
		{ id: 'leo', name: 'Leo Marchetti', role: 'Designer', emoji: '🎨' },
		{ id: 'sam', name: 'Sam Okafor', role: 'Product manager', emoji: '📋' },
		{ id: 'mei', name: 'Mei Tanaka', role: 'QA engineer', emoji: '🔍' }
	];

	readonly form = new FormGroup({
		assignee: new FormControl<Assignee | null>(null)
	});

	static readonly templateCode = `<hub-select formControlName="assignee" label="Assignee"
  [items]="people" bindLabel="name" placeholder="Pick a teammate">

  <!-- selected-value template -->
  <ng-template hubSelectLabel let-item="item">
    {{ item.emoji }} {{ item.name }}
  </ng-template>

  <!-- dropdown-option template -->
  <ng-template hubSelectOption let-item="item">
    <span class="row">
      <span class="avatar">{{ item.emoji }}</span>
      <span class="meta">
        <strong>{{ item.name }}</strong>
        <small>{{ item.role }}</small>
      </span>
    </span>
  </ng-template>
</hub-select>`;

	static readonly componentCode = `import { HubSelectOptionDirective, HubSelectLabelDirective } from 'ng-hub-ui-forms';

// add them to the component's imports:
// imports: [HubSelectComponent, HubSelectOptionDirective, HubSelectLabelDirective]

readonly people = [
  { id: 'ana', name: 'Ana Ruiz', role: 'Frontend engineer', emoji: '👩‍💻' },
  { id: 'leo', name: 'Leo Marchetti', role: 'Designer', emoji: '🎨' },
  // …
];

readonly form = new FormGroup({
  assignee: new FormControl(null)
});`;
}
