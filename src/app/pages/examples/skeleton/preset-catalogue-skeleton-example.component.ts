import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Gallery example that showcases the bundled preset catalogue in a single screen.
 */
@Component({
	selector: 'app-preset-catalogue-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `
		<div class="catalogue-grid">
			@for (preset of presets; track preset.name) {
				<section class="catalogue-card">
					<header class="catalogue-card__header">
						<h4>{{ preset.name }}</h4>
						<p>{{ preset.description }}</p>
					</header>
					<hub-skeleton
						[preset]="preset.name"
						[variant]="preset.variant ?? null"
						[params]="preset.params ?? {}"
						appearance="subtle"
					></hub-skeleton>
				</section>
			}
		</div>
	`,
	styles: `
		:host {
			display: block;
		}

		.catalogue-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
			gap: 1rem;
		}

		.catalogue-card {
			display: grid;
			gap: 0.875rem;
			padding: 1rem;
			border: 1px solid rgba(148, 163, 184, 0.2);
			border-radius: 1rem;
			background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 252, 0.98));
		}

		.catalogue-card__header h4 {
			margin: 0 0 0.35rem;
			font-size: 0.95rem;
		}

		.catalogue-card__header p {
			margin: 0;
			font-size: 0.8rem;
			line-height: 1.5;
			color: #64748b;
		}
	`
})
export class PresetCatalogueSkeletonExampleComponent {
	readonly presets: ReadonlyArray<{
		readonly name: string;
		readonly description: string;
		readonly variant?: string;
		readonly params?: Record<string, string | number>;
	}> = [
		{ name: 'card', description: 'Content card with media, title and body lines.' },
		{ name: 'list-item', description: 'Compact row with avatar and text.' },
		{ name: 'table-row', description: 'Tabular data row placeholder.', params: { columns: 4 } },
		{ name: 'detail-view', description: 'Detail screen with media and metadata.' },
		{ name: 'form-section', description: 'Form group with responsive fields.' },
		{ name: 'dashboard-widget', description: 'Panel with chart or metric content.' },
		{ name: 'stat-card', description: 'Quick KPI summary card.' },
		{ name: 'chart-panel', description: 'Large chart region with legend rows.' },
		{ name: 'profile-summary', description: 'Profile hero with avatar and stats.' },
		{ name: 'master-detail', description: 'List and detail layout together.' },
		{ name: 'kanban-card', description: 'Small board card loading state.' },
		{ name: 'feed-item', description: 'Activity or timeline row.' },
		{ name: 'search-result', description: 'Search result with metadata lines.' },
		{ name: 'table-toolbar', description: 'Toolbar with title, filters and actions.' },
		{ name: 'filter-bar', description: 'Row of filter controls.', params: { filters: 4 } },
		{ name: 'empty-state-skeleton', description: 'Illustrative empty or onboarding state.' },
		{ name: 'card', description: 'Dense card variant for tighter layouts.', variant: 'compact' }
	] as const;

	static readonly templateCode = `<hub-skeleton preset="card"></hub-skeleton>
<hub-skeleton preset="table-row" [params]="{ columns: 4 }"></hub-skeleton>
<hub-skeleton preset="empty-state-skeleton"></hub-skeleton>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton preset="card"></hub-skeleton>
    <hub-skeleton preset="table-row" [params]="{ columns: 4 }"></hub-skeleton>
    <hub-skeleton preset="empty-state-skeleton"></hub-skeleton>
  \`
})
export class PresetCatalogueSkeletonExampleComponent {}`;
}
