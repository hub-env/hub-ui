import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubChipComponent, HubChipSetComponent } from 'ng-hub-ui-badges';

/**
 * Demonstrates interactive filter chips: a single-select status bar and a
 * multi-select tag bar, both coordinated by `hub-chip-set`.
 */
@Component({
	selector: 'app-chip-badges-example',
	standalone: true,
	imports: [HubChipComponent, HubChipSetComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-column gap-4">
			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Status (single select)</span>
				<hub-chip-set selectionMode="single" [(value)]="status">
					@for (option of statuses; track option.value) {
						<hub-chip [value]="option.value" [color]="option.color">
							<i hubChipLeading class="fa-solid fa-circle" aria-hidden="true"></i>
							{{ option.label }}
						</hub-chip>
					}
				</hub-chip-set>
				<span class="text-muted small">Selected: {{ status() ?? 'none' }}</span>
			</div>

			<div class="d-flex flex-column gap-2">
				<span class="text-muted small">Labels (multiple select)</span>
				<hub-chip-set selectionMode="multiple" [(value)]="labels">
					@for (tag of tags; track tag) {
						<hub-chip [value]="tag" color="info" [removable]="true" (removed)="dropTag(tag)">
							{{ tag }}
						</hub-chip>
					}
				</hub-chip-set>
				<span class="text-muted small">Selected: {{ labels().length ? labels().join(', ') : 'none' }}</span>
			</div>
		</div>
	`,
	styles: []
})
export class ChipBadgesExampleComponent {
	/** Available single-select status options. */
	protected readonly statuses = [
		{ value: 'open', label: 'Open', color: 'success' },
		{ value: 'pending', label: 'Pending', color: 'warning' },
		{ value: 'closed', label: 'Closed', color: 'secondary' }
	];

	/** Available multi-select label tags. */
	protected readonly tags = ['bug', 'feature', 'docs', 'urgent'];

	/** Two-way value bound to the single-select status chip-set. */
	protected readonly status = signal<string | undefined>('open');

	/** Two-way value bound to the multi-select labels chip-set. */
	protected readonly labels = signal<string[]>(['feature']);

	/**
	 * Removes a tag from the demo selection when its chip is dismissed.
	 *
	 * @param tag Label whose chip was dismissed.
	 */
	protected dropTag(tag: string): void {
		this.labels.update((current) => current.filter((label) => label !== tag));
	}

	static readonly templateCode = `<div class="d-flex flex-column gap-4">
  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Status (single select)</span>
    <hub-chip-set selectionMode="single" [(value)]="status">
      @for (option of statuses; track option.value) {
        <hub-chip [value]="option.value" [color]="option.color">
          <i hubChipLeading class="fa-solid fa-circle" aria-hidden="true"></i>
          {{ option.label }}
        </hub-chip>
      }
    </hub-chip-set>
    <span class="text-muted small">Selected: {{ status() ?? 'none' }}</span>
  </div>

  <div class="d-flex flex-column gap-2">
    <span class="text-muted small">Labels (multiple select)</span>
    <hub-chip-set selectionMode="multiple" [(value)]="labels">
      @for (tag of tags; track tag) {
        <hub-chip [value]="tag" color="info" [removable]="true" (removed)="dropTag(tag)">
          {{ tag }}
        </hub-chip>
      }
    </hub-chip-set>
    <span class="text-muted small">Selected: {{ labels().length ? labels().join(', ') : 'none' }}</span>
  </div>
</div>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubChipComponent, HubChipSetComponent } from 'ng-hub-ui-badges';

@Component({
  selector: 'app-chip-badges-example',
  standalone: true,
  imports: [HubChipComponent, HubChipSetComponent],
  templateUrl: './chip-badges-example.component.html'
})
export class ChipBadgesExampleComponent {
  protected readonly statuses = [
    { value: 'open', label: 'Open', color: 'success' },
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'closed', label: 'Closed', color: 'secondary' }
  ];

  protected readonly tags = ['bug', 'feature', 'docs', 'urgent'];

  protected readonly status = signal<string | undefined>('open');
  protected readonly labels = signal<string[]>(['feature']);

  protected dropTag(tag: string): void {
    this.labels.update((current) => current.filter((label) => label !== tag));
  }
}`;
}
