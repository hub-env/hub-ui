import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { BASE_BREADCRUMBS, provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Styling example demonstrating runtime customization via CSS custom properties
 * like divider, colors, spacing and border radius.
 */
@Component({
	selector: 'app-styling-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([...BASE_BREADCRUMBS, { label: 'Estilos', url: '/components/breadcrumbs/styling', data: {} }])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.STYLING.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.STYLING.DESCRIPTION' | translate"
		>
			<div slot="demo" class="styles-grid">
				<div>
					<h6>Custom Divider</h6>
					<hub-breadcrumb style="--hub-breadcrumb-divider: '→'"></hub-breadcrumb>
				</div>

				<div>
					<h6>Custom Colors (via CSS class)</h6>
					<hub-breadcrumb class="breadcrumb-theme-blue"></hub-breadcrumb>
				</div>

				<div>
					<h6>Spacing & Radius</h6>
					<hub-breadcrumb
						style="
            --hub-breadcrumb-padding-x: 0.25rem;
            --hub-breadcrumb-item-padding-x: 1rem;
            --hub-breadcrumb-border-radius: 0.375rem;
          "
					></hub-breadcrumb>
				</div>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.styles-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
				gap: 1rem;
			}
			h6 {
				margin: 0 0 0.5rem;
			}
			.hub-breadcrumb.breadcrumb-theme-blue {
				--hub-breadcrumb-bg: #f8f9fa;
				--hub-breadcrumb-divider-color: var(--hub-sys-text-muted, #6c757d);
				--hub-breadcrumb-item-active-color: #fabada;
			}
		`
	]
})
export class StylingBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.STYLING.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.STYLING.DESCRIPTION';
	import = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<!-- Custom Divider (inline) -->
<hub-breadcrumb style="--hub-breadcrumb-divider: '→'"></hub-breadcrumb>

<!-- Custom Colors (via CSS class) -->
<hub-breadcrumb class="breadcrumb-theme-blue"></hub-breadcrumb>

<!-- Custom Spacing (inline) -->
<hub-breadcrumb style="
  --hub-breadcrumb-padding-x: 0.25rem;
  --hub-breadcrumb-item-padding-x: 1rem;
  --hub-breadcrumb-border-radius: 0.375rem;
"></hub-breadcrumb>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  template: \`
    <!-- Inline CSS variable -->
    <hub-breadcrumb style="--hub-breadcrumb-divider: '→'"></hub-breadcrumb>

    <!-- Via CSS class -->
    <hub-breadcrumb class="breadcrumb-theme-blue"></hub-breadcrumb>
  \`,
  styles: [\`
    .hub-breadcrumb.breadcrumb-theme-blue  {
      --hub-breadcrumb-bg: #f8f9fa;
      --hub-breadcrumb-divider-color: var(--hub-sys-text-muted, #6c757d);
      --hub-breadcrumb-item-active-color: #fabada;
    }
  \`]
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = StylingBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = StylingBreadcrumbsExampleComponent.componentCode;
}
