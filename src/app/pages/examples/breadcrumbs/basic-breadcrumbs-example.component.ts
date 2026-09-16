import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { BASE_BREADCRUMBS, provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Basic example page demonstrating the Hub Breadcrumbs component.
 * Shows how breadcrumbs are rendered from route data metadata.
 */
@Component({
	selector: 'app-basic-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([...BASE_BREADCRUMBS, { label: 'Básico', url: '/components/breadcrumbs/basic', data: {} }])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.BASIC.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.BASIC.DESCRIPTION' | translate"
		>
			<div slot="demo">
				<hub-breadcrumb></hub-breadcrumb>

				<p class="hint">Items are generated from the <code>data.breadcrumb</code> configuration of active routes.</p>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.hint {
				color: var(--hub-sys-text-muted, #6c757d);
				margin-top: 1rem;
			}
		`
	]
})
export class BasicBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.BASIC.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.BASIC.DESCRIPTION';
	import = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb></hub-breadcrumb>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  template: \`<hub-breadcrumb></hub-breadcrumb>\`
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = BasicBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = BasicBreadcrumbsExampleComponent.componentCode;
}
