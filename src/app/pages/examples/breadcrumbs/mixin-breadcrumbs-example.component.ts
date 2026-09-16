import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Live demo for the `hub-breadcrumb-theme` SCSS mixin. The rule sets the same
 * `--hub-breadcrumb-*` custom properties the mixin emits, on the same selector the snippet
 * beside it uses, so the preview shows what that code claims: the include has to land on
 * the `<hub-breadcrumb>` element with a selector that outranks the component's `:host`
 * defaults. `--hub-breadcrumb-accent` recolours the links and their hover (the current
 * crumb stays muted, as it always does), `--hub-breadcrumb-bg` +
 * `--hub-breadcrumb-border-radius` shape the pill surface, and
 * `--hub-breadcrumb-item-padding-x` widens the gap between segments.
 */
@Component({
	selector: 'app-mixin-breadcrumbs-example',
	standalone: true,
	imports: [HubBreadcrumbComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		provideExampleBreadcrumbs([
			{ label: 'Home', url: '/home', data: {} },
			{ label: 'Library', url: '/library', data: {} },
			{ label: 'Breadcrumbs', url: '/library/breadcrumbs', data: {} }
		])
	],
	template: `
		<style>
			hub-breadcrumb.breadcrumbs-mixin-scope {
				--hub-breadcrumb-accent: #0ea5e9;
				--hub-breadcrumb-bg: #f0f9ff;
				--hub-breadcrumb-border-radius: 0.75rem;
				--hub-breadcrumb-item-padding-x: 0.75rem;
			}
		</style>
		<hub-breadcrumb class="breadcrumbs-mixin-scope"></hub-breadcrumb>
	`,
	styles: []
})
export class MixinBreadcrumbsExampleComponent {}
