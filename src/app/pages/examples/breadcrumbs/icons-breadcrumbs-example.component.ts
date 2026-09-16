import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { ExampleContainerComponent } from '../../../components/shared/example-container/example-container.component';
import { HubBreadcrumbComponent, HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';
import { FeatureExample } from '../../../../models/interfaces';
import { provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Icons example demonstrating how to pass custom data in route config
 * and render it inside a custom breadcrumb item template.
 */
@Component({
	selector: 'app-icons-breadcrumbs-example',
	standalone: true,
	imports: [TranslatePipe, ExampleContainerComponent, HubBreadcrumbComponent, HubBreadcrumbItemDirective, RouterLink],
	providers: [
		provideExampleBreadcrumbs([
			{ label: 'Inicio', url: '/home', data: { icon: '🏠' } },
			{ label: 'Componentes', url: '/components', data: { icon: '🧱' } },
			{ label: 'Breadcrumbs', url: '/components/breadcrumbs', data: { icon: '🧭' } },
			{ label: 'Iconos', url: '/components/breadcrumbs/icons', data: { icon: '⭐️' } }
		])
	],
	template: `
		<app-example-container
			[title]="'DOCS.BREADCRUMBS.EXAMPLE.ICONS.TITLE' | translate"
			[description]="'DOCS.BREADCRUMBS.EXAMPLE.ICONS.DESCRIPTION' | translate"
		>
			<div slot="demo">
				<hub-breadcrumb>
					<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
						@if (!isLast) {
							<a [routerLink]="item.url" class="custom-link">
								<span class="icon">{{ item.data?.icon }}</span>
								{{ item.label }}
							</a>
						} @else {
							<span class="custom-last">
								<span class="icon">{{ item.data?.icon }}</span>
								{{ item.label }}
							</span>
						}
					</ng-template>
				</hub-breadcrumb>
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
			.icon {
				margin-right: 0.25rem;
			}
		`
	]
})
export class IconsBreadcrumbsExampleComponent implements FeatureExample {
	title = 'DOCS.BREADCRUMBS.EXAMPLE.ICONS.TITLE';
	description = 'DOCS.BREADCRUMBS.EXAMPLE.ICONS.DESCRIPTION';
	import = `import { HubBreadcrumbComponent, HubBreadcrumbItemDirective } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb>
  <ng-template hubBreadcrumbItem let-item let-isLast="isLast">
    @if (!isLast) {
      <a [routerLink]="item.url" class="custom-link">
        <span class="icon">{{ item.data?.icon }}</span>
        {{ item.label }}
      </a>
    } @else {
      <span class="custom-last">
        <span class="icon">{{ item.data?.icon }}</span>
        {{ item.label }}
      </span>
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
          <a [routerLink]="item.url" class="custom-link">
            <span class="icon">{{ item.data?.icon }}</span>
            {{ item.label }}
          </a>
        } @else {
          <span class="custom-last">
            <span class="icon">{{ item.data?.icon }}</span>
            {{ item.label }}
          </span>
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
    .icon { margin-right: 0.25rem; }
  \`]
})
export class ExampleComponent {}`;

	/** FeatureExample mirror of the static template snippet. */
	template = IconsBreadcrumbsExampleComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = IconsBreadcrumbsExampleComponent.componentCode;
}
