import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Demonstrates opt-in per-item truncation with the overflow tooltip fallback.
 *
 * With `truncateItems` enabled, long labels are clipped to
 * `--hub-breadcrumb-max-item-width` and hovering a clipped label reveals its full
 * text — the native `title` by default, or the hub-ui tooltip once
 * `provideHubBreadcrumbTooltip(hubTooltipAdapter)` is wired (as this docs app is).
 */
@Component({
	selector: 'app-truncation-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([
			{ label: 'Home', url: '/home', data: {} },
			{ label: 'Administration & Organization Settings', url: '/admin', data: {} },
			{ label: 'Identity and Access Management', url: '/admin/iam', data: {} },
			{ label: 'Service Accounts — Billing Exports Pipeline', url: '/admin/iam/service-accounts', data: {} }
		])
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.DESCRIPTION' | translate"
		>
			<div slot="demo">
				<div
					style="max-width: 420px; border: 1px dashed var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6)); border-radius: 0.375rem;"
				>
					<hub-breadcrumb [truncateItems]="true"></hub-breadcrumb>
				</div>
				<p class="hint">
					Each label is capped at <code>--hub-breadcrumb-max-item-width</code> (12rem). Only the items that overflow
					get a tooltip.
				</p>
			</div>
		</app-example-container>
	`,
	styles: [
		`
			.hint {
				color: var(--hub-sys-text-muted, #6c757d);
				margin-top: 1rem;
			}
		`
	]
})
export class TruncationBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.TRUNCATION.DESCRIPTION';
	import = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb [truncateItems]="true"></hub-breadcrumb>`;

	static readonly componentCode = `// 1) Truncated labels expose their full text via the NATIVE title attribute
//    out of the box — zero dependencies.
//
// 2) To upgrade to the themeable hub-ui tooltip, wire the adapter ONCE.
//
// app.config.ts
import { provideHubBreadcrumbTooltip } from 'ng-hub-ui-breadcrumbs';
import { hubTooltipAdapter } from 'ng-hub-ui-utils';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHubBreadcrumbTooltip(hubTooltipAdapter) // remove → native title
  ]
};
// Also import the tooltip styles once: @use 'ng-hub-ui-utils/styles/tooltip';

// example.component.ts
import { Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  // labels come from the router's breadcrumb data
  template: \`<hub-breadcrumb [truncateItems]="true"></hub-breadcrumb>\`
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = TruncationBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = TruncationBreadcrumbsExampleComponent.componentCode;
}
