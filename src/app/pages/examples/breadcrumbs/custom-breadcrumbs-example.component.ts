import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { HubBreadcrumbComponent, HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { BASE_BREADCRUMBS, provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Custom template example for the Breadcrumbs component.
 * Uses the hubBreadcrumbItem directive to override item rendering.
 */
@Component({
	selector: 'app-custom-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent, HubBreadcrumbItemDirective, RouterLink],
	providers: [
		provideExampleBreadcrumbs([
			...BASE_BREADCRUMBS,
			{ label: 'Personalizado', url: '/components/breadcrumbs/custom', data: {} }
		])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.DESCRIPTION' | translate"
		>
			<div slot="demo">
				<hub-breadcrumb>
					<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
						@if (!isLast) {
							<a [routerLink]="item.url" class="custom-link">🔗 {{ item.label }}</a>
						} @else {
							<span class="custom-last">🏁 {{ item.label }}</span>
						}
					</ng-template>
				</hub-breadcrumb>

				<p class="hint">The <code>hubBreadcrumbItem</code> directive allows custom rendering of each element.</p>
			</div>
		</app-example-container>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			/* Projected content inherits the component's tokens through the DOM, so the
			   custom template follows the theme instead of pinning light-mode colours. */
			.custom-link {
				color: var(--hub-breadcrumb-link-color, var(--hub-sys-link-color, #0d6efd));
				text-decoration: none;
			}
			.custom-link:hover {
				text-decoration: underline;
			}
			.custom-last {
				font-weight: 600;
				color: var(--hub-sys-text-primary, #212529);
			}
			.hint {
				color: var(--hub-sys-text-muted, #6c757d);
				margin-top: 1rem;
			}
		`
	]
})
export class CustomBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.CUSTOM_TEMPLATES.DESCRIPTION';
	import = `import { HubBreadcrumbComponent, HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb>
  <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
    @if (!isLast) {
      <a [routerLink]="item.url" class="custom-link">🔗 {{ item.label }}</a>
    } @else {
      <span class="custom-last">🏁 {{ item.label }}</span>
    }
  </ng-template>
</hub-breadcrumb>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubBreadcrumbComponent, HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective, RouterLink],
  template: \`
    <hub-breadcrumb>
      <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
        @if (!isLast) {
          <a [routerLink]="item.url" class="custom-link">🔗 {{ item.label }}</a>
        } @else {
          <span class="custom-last">🏁 {{ item.label }}</span>
        }
      </ng-template>
    </hub-breadcrumb>
  \`,
  styles: [\`
    /* Projected content inherits the component's tokens, so the custom template
       follows the theme instead of pinning light-mode colours. */
    .custom-link { color: var(--hub-breadcrumb-link-color); text-decoration: none; }
    .custom-link:hover { text-decoration: underline; }
    .custom-last { font-weight: 600; color: var(--hub-sys-text-primary); }
  \`]
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = CustomBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = CustomBreadcrumbsExampleComponent.componentCode;
}
