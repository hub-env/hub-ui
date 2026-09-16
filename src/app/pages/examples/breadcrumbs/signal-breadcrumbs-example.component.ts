import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { BreadcrumbItem, HubBreadcrumbComponent, HubBreadcrumbsService } from 'ng-hub-ui-breadcrumbs';
import { NavigableBreadcrumbsService, provideNavigableExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/** The demo's route tree, as the trail each of its pages produces. */
const TRAILS: Record<string, BreadcrumbItem[]> = {
	workspaces: [
		{ label: 'Home', url: '/home' },
		{ label: 'Workspaces', url: '/workspaces' }
	],
	northwind: [
		{ label: 'Home', url: '/home' },
		{ label: 'Workspaces', url: '/workspaces' },
		{ label: 'Northwind', url: '/workspaces/northwind' }
	],
	invoices: [
		{ label: 'Home', url: '/home' },
		{ label: 'Workspaces', url: '/workspaces' },
		{ label: 'Northwind', url: '/workspaces/northwind' },
		{ label: 'Invoices', url: '/workspaces/northwind/invoices' }
	],
	invoice: [
		{ label: 'Home', url: '/home' },
		{ label: 'Workspaces', url: '/workspaces' },
		{ label: 'Northwind', url: '/workspaces/northwind' },
		{ label: 'Invoices', url: '/workspaces/northwind/invoices' },
		{ label: 'INV-2026-0184', url: '/workspaces/northwind/invoices/inv-2026-0184' }
	]
};

/**
 * The trail read from outside the breadcrumb component.
 *
 * `HubBreadcrumbsService.breadcrumbs` is a signal, so anything on the page can derive
 * from it in a `computed` and render it in a template — no subscription, no `async` pipe,
 * nothing to unsubscribe. Here the page heading and its subtitle are the last crumb and
 * its parent, which means the header re-titles itself on every navigation with no route
 * having to say the title twice.
 *
 * The demo drives the trail with buttons because the docs page has no route tree of its
 * own. In an application the router fills the same signal, and the reading code below is
 * unchanged.
 */
@Component({
	selector: 'app-breadcrumbs-signal-example',
	standalone: true,
	imports: [HubBreadcrumbComponent, HubButtonComponent],
	providers: [provideNavigableExampleBreadcrumbs(TRAILS['invoice'])],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<header class="border rounded-3 p-3 mb-3">
			<hub-breadcrumb [maxItems]="4" />

			<h3 class="mb-1 mt-2">{{ pageTitle() }}</h3>

			<p class="small mb-0" style="color: var(--hub-sys-text-muted)">
				@if (parentLabel(); as parent) {
					in {{ parent }} · {{ depth() }} levels deep
				} @else {
					Top of the trail
				}
			</p>
		</header>

		<div class="d-flex flex-wrap gap-2 mb-3">
			@for (entry of destinations; track entry.key) {
				<button type="button" hubButton variant="outline" color="primary" (click)="go(entry.key)">
					{{ entry.label }}
				</button>
			}
		</div>

		<p class="small mb-0" style="color: var(--hub-sys-text-muted)">
			The heading and the crumbs are two readings of the same signal. Only the trail changes when you move; neither the
			header nor the component is told anything.
		</p>
	`,
	styles: []
})
export class SignalBreadcrumbsExampleComponent {
	/** The trail, read exactly as an application reads it. */
	private readonly breadcrumbs = inject(HubBreadcrumbsService);

	/** Stands in for the router, which is what would move the trail in an application. */
	private readonly navigator = inject(NavigableBreadcrumbsService);

	/** Destinations offered by the demo, in the order the trail nests them. */
	protected readonly destinations = [
		{ key: 'workspaces', label: 'Workspaces' },
		{ key: 'northwind', label: 'Northwind' },
		{ key: 'invoices', label: 'Invoices' },
		{ key: 'invoice', label: 'INV-2026-0184' }
	];

	/** Heading of the page: the crumb the reader is standing on. */
	protected readonly pageTitle = computed(() => this.breadcrumbs.breadcrumbs().at(-1)?.label ?? 'Home');

	/** The crumb above the current one, for the "in …" subtitle. */
	protected readonly parentLabel = computed(() => this.breadcrumbs.breadcrumbs().at(-2)?.label ?? null);

	/** How deep the current page sits, which only the trail knows. */
	protected readonly depth = computed(() => this.breadcrumbs.breadcrumbs().length);

	/** Moves the demo to another page of its imaginary route tree. */
	protected go(key: string): void {
		this.navigator.navigateTo(TRAILS[key]);
	}

	static readonly title = 'DOCS.BREADCRUMBS.EXAMPLE.SIGNAL.TITLE';
	static readonly description = 'DOCS.BREADCRUMBS.EXAMPLE.SIGNAL.DESCRIPTION';

	static readonly importCode = `import { HubBreadcrumbsService } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<header>
  <hub-breadcrumb [maxItems]="4" />

  <h1>{{ pageTitle() }}</h1>
  @if (parentLabel(); as parent) {
    <p>in {{ parent }}</p>
  }
</header>`;

	static readonly componentCode = `import { Component, computed, inject } from '@angular/core';
import { HubBreadcrumbComponent, HubBreadcrumbsService } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
  private readonly breadcrumbs = inject(HubBreadcrumbsService);

  // \`breadcrumbs\` is a signal, so the header derives from it directly: no
  // subscription, no async pipe, nothing to tear down. The router fills it,
  // and the heading follows every navigation without a route naming the
  // title a second time.
  protected readonly pageTitle = computed(() => this.breadcrumbs.breadcrumbs().at(-1)?.label ?? 'Home');
  protected readonly parentLabel = computed(() => this.breadcrumbs.breadcrumbs().at(-2)?.label ?? null);
}`;
}
