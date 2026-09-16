import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

/**
 * List CSS variables example component.
 * Demonstrates how to customize the list and paginator using the public CSS tokens.
 */
@Component({
	selector: 'app-css-variables-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, FormsModule],
	template: `
		<div class="list-theme-samples">
			<div class="theme-sample theme-sample--forest">
				<h6>Forest Theme</h6>
				<hub-list
					class="theme-list"
					[items]="people"
					[bindLabel]="'name'"
					[paginate]="true"
					[selectable]="selectionTypes.Single"
					[perPage]="3"
					[totalItems]="people.length"
				>
					<ng-template listItemTpt let-item="data">
						<div class="d-flex flex-column">
							<strong>{{ item.name }}</strong>
							<small>{{ item.role }}</small>
						</div>
					</ng-template>
				</hub-list>
			</div>

			<div class="theme-sample theme-sample--dusk">
				<h6>Dusk Theme</h6>
				<hub-list
					class="theme-list"
					[items]="people"
					[bindLabel]="'name'"
					[paginate]="true"
					[selectable]="selectionTypes.Multiple"
					[perPage]="3"
					[totalItems]="people.length"
					[(ngModel)]="selectedPeople"
				>
					<ng-template listItemTpt let-item="data">
						<div class="d-flex flex-column">
							<strong>{{ item.name }}</strong>
							<small>{{ item.role }}</small>
						</div>
					</ng-template>
				</hub-list>
			</div>

			<div class="theme-sample theme-sample--ocean">
				<h6>Ocean Theme — one-call <code>hub-list-theme()</code> mixin</h6>
				<hub-list
					class="theme-list"
					[items]="people"
					[bindLabel]="'name'"
					[paginate]="true"
					[selectable]="selectionTypes.Single"
					[perPage]="3"
					[totalItems]="people.length"
				>
					<ng-template listItemTpt let-item="data">
						<div class="d-flex flex-column">
							<strong>{{ item.name }}</strong>
							<small>{{ item.role }}</small>
						</div>
					</ng-template>
				</hub-list>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './css-variables-list-example.component.scss',
	styles: [
		`
			.list-theme-samples {
				display: grid;
				gap: 1.75rem;
			}

			.theme-sample {
				display: grid;
				gap: 0.85rem;
				padding: 1rem;
				border-radius: 1rem;
				background: var(--hub-sys-surface-page, #ffffff);
				box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
			}

			.theme-sample h6 {
				margin: 0;
				font-weight: 700;
			}

			.theme-list {
				width: 100%;
			}

			.theme-sample--forest .hub-list {
				--hub-list-bg: #f0fdf4;
				--hub-list-border-radius: 1rem;
				--hub-list-items-gap: 0.75rem;
				--hub-list-padding-x: 1rem;
				--hub-list-padding-y: 1rem;
				--hub-list-item-border-color: #86efac;
				--hub-list-item-border-radius: 0.75rem;
				--hub-list-item-gap: 0.75rem;
				--hub-list-item-padding-x: 1rem;
				--hub-list-item-padding-y: 0.875rem;
				--hub-list-item-hover-bg: #dcfce7;
				--hub-list-item-selected-bg: #16a34a;
				--hub-list-item-selected-color: #ffffff;
				--hub-list-item-color: #14532d;
				--hub-list-empty-bg: #ecfdf5;
				--hub-list-empty-color: #166534;
				--hub-list-empty-border-color: #86efac;
			}

			.theme-sample--forest .hub-paginator {
				--hub-paginator-font-size: 0.95rem;
				--hub-paginator-gap: 0.4rem;
				--hub-paginator-info-color: #166534;
				--hub-paginator-label-color: #166534;
				--hub-paginator-icon-color: #15803d;
				--hub-paginator-icon-size: 1.05em;
				--hub-paginator-link-active-bg: #16a34a;
				--hub-paginator-link-active-border-color: #16a34a;
				--hub-paginator-link-active-color: #ffffff;
				--hub-paginator-link-bg: #fafffb;
				--hub-paginator-link-border-color: #86efac;
				--hub-paginator-link-border-radius: 0.65rem;
				--hub-paginator-link-color: #15803d;
				--hub-paginator-link-hover-bg: #dcfce7;
				--hub-paginator-link-hover-border-color: #4ade80;
				--hub-paginator-link-hover-color: #166534;
				--hub-paginator-link-disabled-bg: #f0fdf4;
				--hub-paginator-link-disabled-border-color: #bbf7d0;
				--hub-paginator-link-disabled-color: #86efac;
				--hub-paginator-select-bg: #fafffb;
				--hub-paginator-select-border-color: #86efac;
				--hub-paginator-select-border-radius: 0.65rem;
				--hub-paginator-select-color: #166534;
				--hub-paginator-select-padding-x: 0.75rem;
				--hub-paginator-select-padding-y: 0.35rem;
				--hub-paginator-settings-gap: 0.6rem;
			}

			.theme-sample--dusk .hub-list {
				--hub-list-bg: #1e1b4b;
				--hub-list-border-radius: 1rem;
				--hub-list-item-border-color: #4338ca;
				--hub-list-item-border-radius: 0.75rem;
				--hub-list-item-gap: 0.75rem;
				--hub-list-item-padding-x: 1rem;
				--hub-list-item-padding-y: 0.875rem;
				--hub-list-item-hover-bg: rgba(129, 140, 248, 0.12);
				--hub-list-item-selected-bg: #6366f1;
				--hub-list-item-selected-color: #ffffff;
				--hub-list-item-color: #e0e7ff;
				--hub-list-empty-bg: #312e81;
				--hub-list-empty-color: #c7d2fe;
				--hub-list-empty-border-color: #4338ca;
			}

			.theme-sample--dusk .hub-paginator {
				--hub-paginator-font-size: 0.95rem;
				--hub-paginator-gap: 0.4rem;
				--hub-paginator-info-color: #c7d2fe;
				--hub-paginator-label-color: #c7d2fe;
				--hub-paginator-icon-color: #c7d2fe;
				--hub-paginator-icon-size: 1.05em;
				--hub-paginator-link-active-bg: #6366f1;
				--hub-paginator-link-active-border-color: #6366f1;
				--hub-paginator-link-active-color: #ffffff;
				--hub-paginator-link-bg: #1e1b4b;
				--hub-paginator-link-border-color: #4338ca;
				--hub-paginator-link-border-radius: 0.65rem;
				--hub-paginator-link-color: #c7d2fe;
				--hub-paginator-link-hover-bg: #312e81;
				--hub-paginator-link-hover-border-color: #6366f1;
				--hub-paginator-link-hover-color: #eef2ff;
				--hub-paginator-link-disabled-bg: #1e1b4b;
				--hub-paginator-link-disabled-border-color: #4338ca;
				--hub-paginator-link-disabled-color: #818cf8;
				--hub-paginator-select-bg: #312e81;
				--hub-paginator-select-border-color: #4338ca;
				--hub-paginator-select-border-radius: 0.65rem;
				--hub-paginator-select-color: #e0e7ff;
				--hub-paginator-select-padding-x: 0.75rem;
				--hub-paginator-select-padding-y: 0.35rem;
				--hub-paginator-settings-gap: 0.6rem;
			}
		`
	]
})
export class CssVariablesListExampleComponent {
	/**
	 * Selection mode helper exposed to the template.
	 */
	readonly selectionTypes = SelectionTypes;

	/**
	 * Demo list items displayed in both themes.
	 */
	people = [
		{ id: 1, name: 'John Doe', role: 'Product Manager' },
		{ id: 2, name: 'Jane Smith', role: 'Engineer' },
		{ id: 3, name: 'Bob Johnson', role: 'Designer' },
		{ id: 4, name: 'Alice Brown', role: 'QA' },
		{ id: 5, name: 'Charlie Wilson', role: 'Support' }
	];

	/**
	 * Selected people for the multi-select demo.
	 */
	selectedPeople: Array<{ id: number; name: string; role: string }> = [];

	static readonly templateCode = `<div class="theme-sample theme-sample--forest">
  <hub-list
    class="theme-list"
    [items]="people"
    [bindLabel]="'name'"
    [paginate]="true"
    [selectable]="selectionTypes.Single">
    <ng-template listItemTpt let-item="data">
      <strong>{{ item.name }}</strong>
    </ng-template>
  </hub-list>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-css-variables-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective, FormsModule],
  template: \`...\`
})
export class CssVariablesListExampleComponent {
  readonly selectionTypes = SelectionTypes;
  people = [...];
  selectedPeople = [];
}`;

	static readonly cssCode = `// Ocean theme — the whole look in one include via the hub-list-theme() mixin:
@use 'ng-hub-ui-paginable/styles/mixins/list-theme' as *;

.theme-sample--ocean .hub-list {
  @include hub-list-theme(
    $accent: var(--hub-sys-color-info),
    $bg: #f0fbff,
    $item-border-color: #a5e8f7,
    $item-border-radius: 0.85rem,
    $gap: 0.6rem
  );
}

// …or override the individual CSS variables by hand:
.theme-sample--forest .hub-list {
  --hub-list-bg: #f0fdf4;
  --hub-list-border-radius: 1rem;
  --hub-list-item-border-color: #86efac;
  --hub-list-item-hover-bg: #dcfce7;
  --hub-list-item-selected-bg: #16a34a;
  --hub-list-item-selected-color: #ffffff;
  --hub-list-empty-bg: #ecfdf5;
  --hub-list-empty-color: #166534;
}

.theme-sample--dusk .hub-list {
  --hub-list-bg: #1e1b4b;
  --hub-list-item-border-color: #4338ca;
  --hub-list-item-hover-bg: rgba(129, 140, 248, 0.12);
  --hub-list-item-selected-bg: #6366f1;
  --hub-list-item-selected-color: #ffffff;
  --hub-list-empty-bg: #312e81;
  --hub-list-empty-color: #c7d2fe;
}`;
}
