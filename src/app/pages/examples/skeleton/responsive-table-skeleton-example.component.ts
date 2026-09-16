import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Responsive table-oriented skeleton example.
 */
@Component({
	selector: 'app-responsive-table-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `
		<div class="skeleton-stack">
			<hub-skeleton preset="table-toolbar"></hub-skeleton>
			<hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
			<hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
			<hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
		</div>
	`,
	styles: `
		:host {
			display: block;
		}

		.skeleton-stack {
			display: grid;
			gap: 0.875rem;
		}
	`
})
export class ResponsiveTableSkeletonExampleComponent {
	static readonly templateCode = `<div class="skeleton-stack">
  <hub-skeleton preset="table-toolbar"></hub-skeleton>
  <hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
  <hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
  <hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton preset="table-toolbar"></hub-skeleton>
    <hub-skeleton preset="table-row" [params]="{ columns: 2 }"></hub-skeleton>
  \`
})
export class ResponsiveTableSkeletonExampleComponent {}`;
}
