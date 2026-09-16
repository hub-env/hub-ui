import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Composite dashboard example.
 */
@Component({
	selector: 'app-dashboard-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `
		<div class="dashboard-layout">
			<hub-skeleton preset="stat-card"></hub-skeleton>
			<hub-skeleton preset="stat-card"></hub-skeleton>
			<hub-skeleton preset="chart-panel"></hub-skeleton>
			<hub-skeleton preset="dashboard-widget"></hub-skeleton>
		</div>
	`,
	styles: `
		:host {
			display: block;
		}

		.dashboard-layout {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
			gap: 1rem;
		}

		.dashboard-layout hub-skeleton:nth-child(3),
		.dashboard-layout hub-skeleton:nth-child(4) {
			grid-column: span 2;
		}
	`
})
export class DashboardSkeletonExampleComponent {
	static readonly templateCode = `<div class="dashboard-layout">
  <hub-skeleton preset="stat-card"></hub-skeleton>
  <hub-skeleton preset="stat-card"></hub-skeleton>
  <hub-skeleton preset="chart-panel"></hub-skeleton>
  <hub-skeleton preset="dashboard-widget"></hub-skeleton>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton preset="stat-card"></hub-skeleton>
    <hub-skeleton preset="chart-panel"></hub-skeleton>
  \`
})
export class DashboardSkeletonExampleComponent {}`;
}
