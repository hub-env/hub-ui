import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { BASE_BREADCRUMBS, provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Placeholder replacement from resolved route data: a route declares
 * `breadcrumb: 'Dynamic: {name}'` and a resolver supplies the `name`.
 *
 * The docs page has no router tree of its own, so the demo is fed the trail that
 * configuration produces — label included. The configuration itself is the point, and it
 * is what the TS tab shows.
 */
@Component({
	selector: 'app-dynamic-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([
			...BASE_BREADCRUMBS,
			{
				label: 'Dynamic: Project Demo',
				url: '/components/breadcrumbs/dynamic',
				data: { resolvedData: { name: 'Project Demo' } }
			}
		])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.DESCRIPTION' | translate"
		>
			<div slot="demo">
				<hub-breadcrumb></hub-breadcrumb>
				<p class="hint">
					The last crumb comes from a route declaring
					<code>breadcrumb: "Dynamic: {{ '{' }}name{{ '}' }}"</code>, resolved with that route's data. This page has
					no router tree, so the demo is handed the resulting trail — the route configuration is in the TS tab.
				</p>
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
export class DynamicBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.DYNAMIC.DESCRIPTION';
	import = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb></hub-breadcrumb>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { of } from 'rxjs';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  // Nothing to wire here: the label travels on the route.
  template: \`<hub-breadcrumb></hub-breadcrumb>\`
})
export class ExampleComponent {}

// {name} is replaced with the resolved data of the route that declares it.
export const routes: Routes = [
  {
    path: 'projects',
    data: { breadcrumb: 'Projects' },
    children: [
      {
        path: ':id',
        component: ExampleComponent,
        data: { breadcrumb: 'Dynamic: {name}' },
        resolve: { resolvedData: () => of({ name: 'Project Demo' }) }
      }
    ]
  }
];`;

	/** FeatureExample mirror of the static template snippet. */
	template = DynamicBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = DynamicBreadcrumbsExampleComponent.componentCode;
}
