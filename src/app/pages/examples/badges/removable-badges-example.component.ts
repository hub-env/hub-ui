import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Demonstrates dismissible badges for filter and tag UIs.
 */
@Component({
	selector: 'app-removable-badges-example',
	standalone: true,
	imports: [HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-2">
			<span class="text-muted small">{{ filters().length }} active filters</span>
			@if (filters().length) {
				<div class="d-flex flex-wrap gap-2">
					@for (filter of filters(); track filter.id) {
						<hub-badge
							variant="soft"
							[color]="filter.color"
							[removable]="true"
							removeLabel="Remove active filter"
							(removed)="removeFilter(filter.id)"
						>
							<i class="fa-solid fa-sliders" aria-hidden="true"></i>
							{{ filter.label }}
						</hub-badge>
					}
				</div>
			} @else {
				<hub-badge variant="surface" color="success">
					<i class="fa-solid fa-check" aria-hidden="true"></i>
					No active filters
				</hub-badge>
			}
		</div>
	`,
	styles: []
})
export class RemovableBadgesExampleComponent {
	/** Reactive list of demo filters so the example shows the dismiss interaction. */
	protected readonly filters = signal([
		{ id: 1, label: 'Priority: High', color: 'danger' },
		{ id: 2, label: 'Assigned: Me', color: 'primary' },
		{ id: 3, label: 'Status: Open', color: 'success' }
	]);

	/**
	 * Removes a filter badge from the local demo state.
	 *
	 * @param id Stable identifier of the filter to dismiss.
	 */
	protected removeFilter(id: number): void {
		this.filters.update((current) => current.filter((filter) => filter.id !== id));
	}

	static readonly templateCode = `<div class="d-flex flex-column gap-2">
  <span class="text-muted small">{{ filters().length }} active filters</span>
  @if (filters().length) {
    <div class="d-flex flex-wrap gap-2">
      @for (filter of filters(); track filter.id) {
        <hub-badge
          variant="soft"
          [color]="filter.color"
          [removable]="true"
          removeLabel="Remove active filter"
          (removed)="removeFilter(filter.id)">
          <i class="fa-solid fa-sliders" aria-hidden="true"></i>
          {{ filter.label }}
        </hub-badge>
      }
    </div>
  } @else {
    <hub-badge variant="surface" color="success">
      <i class="fa-solid fa-check" aria-hidden="true"></i>
      No active filters
    </hub-badge>
  }
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

@Component({
  selector: 'app-removable-badges-example',
  standalone: true,
  imports: [HubBadgeComponent],
  templateUrl: './removable-badges-example.component.html'
})
export class RemovableBadgesExampleComponent {
  protected readonly filters = signal([
    { id: 1, label: 'Priority: High', color: 'danger' },
    { id: 2, label: 'Assigned: Me', color: 'primary' },
    { id: 3, label: 'Status: Open', color: 'success' }
  ]);

  protected removeFilter(id: number): void {
    this.filters.update((current) => current.filter((filter) => filter.id !== id));
  }
}`;
}
