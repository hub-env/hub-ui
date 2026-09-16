import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Compact variant example for dense UI sections.
 */
@Component({
	selector: 'app-compact-variant-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `
		<div class="variant-grid">
			<hub-skeleton preset="card"></hub-skeleton>
			<hub-skeleton preset="card" variant="compact"></hub-skeleton>
		</div>
	`,
	styles: `
		:host {
			display: block;
		}

		.variant-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
			gap: 1rem;
		}
	`
})
export class CompactVariantSkeletonExampleComponent {
	static readonly templateCode = `<div class="variant-grid">
  <hub-skeleton preset="card"></hub-skeleton>
  <hub-skeleton preset="card" variant="compact"></hub-skeleton>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton preset="card"></hub-skeleton>
    <hub-skeleton preset="card" variant="compact"></hub-skeleton>
  \`
})
export class CompactVariantSkeletonExampleComponent {}`;
}
