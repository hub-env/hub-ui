import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { BASE_BREADCRUMBS, provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * RTL example demonstrating automatic divider flipping when rendering in RTL.
 */
@Component({
	selector: 'app-rtl-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([...BASE_BREADCRUMBS, { label: 'RTL', url: '/components/breadcrumbs/rtl', data: {} }])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.RTL.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.RTL.DESCRIPTION' | translate"
		>
			<div slot="demo" dir="rtl" class="rtl-box">
				<hub-breadcrumb></hub-breadcrumb>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.rtl-box {
				border: 1px dashed var(--hub-sys-border-color-default, #ced4da);
				padding: 0.5rem;
			}
		`
	]
})
export class RtlBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.RTL.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.RTL.DESCRIPTION';
	import = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<div dir="rtl">
  <hub-breadcrumb></hub-breadcrumb>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  template: \`
    <div dir="rtl">
      <hub-breadcrumb></hub-breadcrumb>
    </div>
  \`,
  styles: [\`
    .rtl-container { border: 1px dashed var(--hub-sys-border-color-default, #ced4da); padding: 0.5rem; }
  \`]
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = RtlBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = RtlBreadcrumbsExampleComponent.componentCode;
}
