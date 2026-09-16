import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbItem, HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

/**
 * Crumbs whose destination is not an Angular route.
 *
 * A trail often starts outside the application it ends in — a corporate site, a
 * section still served by the legacy app, a PDF the reader is meant to keep. Those
 * ancestors have no route to derive them from, so they arrive either through the
 * `[items]` input shown here or through the object form of `data.breadcrumb`
 * (in the component snippet), and render as plain anchors instead of `routerLink`.
 *
 * A crumb opening in a new tab gets `rel="noopener noreferrer"` unless it states
 * its own `rel`: the destination should not inherit a handle on the opener.
 */
@Component({
	selector: 'app-breadcrumbs-external-links-example',
	standalone: true,
	imports: [HubBreadcrumbComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-breadcrumb [items]="trail" />

		<p class="small mb-0 mt-3" style="color: var(--hub-sys-text-muted)">
			<strong>Example.com</strong> leaves the app in a new tab, <strong>Handbook</strong> downloads a file, and
			<strong>Docs</strong> is an ordinary in-app crumb routed through <code>routerLink</code>. The last crumb is never a
			link, whatever it declares.
		</p>
	`,
	styles: []
})
export class ExternalLinksBreadcrumbsExampleComponent {
	/** Mixed trail: two destinations outside the router, one inside, and the current page. */
	protected readonly trail: BreadcrumbItem[] = [
		{ label: 'Example.com', url: '/', href: 'https://example.com', target: '_blank' },
		{ label: 'Handbook', url: '/handbook', href: '/assets/handbook.pdf', download: 'handbook.pdf' },
		{ label: 'Docs', url: '/docs' },
		{ label: 'Breadcrumbs', url: '/docs/breadcrumbs' }
	];

	static readonly title = 'DOCS.BREADCRUMBS.EXAMPLE.EXTERNAL_LINKS.TITLE';
	static readonly description = 'DOCS.BREADCRUMBS.EXAMPLE.EXTERNAL_LINKS.DESCRIPTION';

	static readonly importCode = `import { BreadcrumbItem, HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb [items]="trail" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { BreadcrumbItem, HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  template: \`<hub-breadcrumb [items]="trail" />\`
})
export class ExampleComponent {
  // [items] takes over the whole trail. Leave it unset and the component keeps
  // reading the router, as it does by default.
  readonly trail: BreadcrumbItem[] = [
    // rel defaults to "noopener noreferrer" for _blank targets
    { label: 'Example.com', url: '/', href: 'https://example.com', target: '_blank' },
    { label: 'Handbook', url: '/handbook', href: '/assets/handbook.pdf', download: 'handbook.pdf' },
    { label: 'Docs', url: '/docs' },
    { label: 'Breadcrumbs', url: '/docs/breadcrumbs' }
  ];
}

// The same metadata can travel on the route itself, keeping the trail automatic:
export const routes: Routes = [
  {
    path: 'invoices',
    component: InvoicesComponent,
    data: {
      breadcrumb: {
        label: 'Invoices',
        href: 'https://legacy.example.com/invoices',
        target: '_blank'
      }
    }
  }
];`;
}
