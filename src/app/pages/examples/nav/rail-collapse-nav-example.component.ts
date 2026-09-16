import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavStartDirective } from 'ng-hub-ui-nav';

/**
 * Desktop icon rail: the built-in edge toggle collapses the vertical nav to
 * `--hub-nav-rail-width`, labels surface as tooltips, and accordion groups
 * open as overlay flyouts. `[(rail)]` keeps the app-sized aside in sync; the
 * library persists nothing.
 */
@Component({
	selector: 'app-nav-rail-collapse-example',
	standalone: true,
	imports: [HubNavComponent, HubNavStartDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div
			style="display: flex; align-items: stretch; min-height: 320px; border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6)); border-radius: 0.5rem;"
		>
			<div
				style="display: flex; flex: 0 0 auto; transition: width 0.2s ease-in-out;"
				[style.width]="rail() ? 'var(--hub-nav-rail-width, 4rem)' : '16rem'"
			>
				<hub-nav
					[items]="items"
					[(rail)]="rail"
					[config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
				>
					<ng-template hubNavStart let-rail="rail">
						<span class="fw-semibold">{{ rail ? 'A' : 'Acme ERP' }}</span>
					</ng-template>
				</hub-nav>
			</div>
			<div style="flex: 1 1 auto; padding: 1rem 1rem 1rem 2rem;">
				<p class="mb-0 text-muted">
					Content area — the built-in toggle on the sidebar edge collapses the nav into an icon rail, returning
					horizontal space to data-dense screens. Hover a rail item to see its label; click a group to open its
					flyout.
				</p>
			</div>
		</div>
	`
})
export class RailCollapseNavExampleComponent {
	static readonly templateCode = `<!-- The app sizes (and animates) the aside container; [(rail)] keeps it in sync -->
<aside
  class="shell-aside"
  [style.width]="rail() ? 'var(--hub-nav-rail-width, 4rem)' : '16rem'"
>
  <hub-nav
    [items]="items"
    [(rail)]="rail"
    [config]="{ orientation: 'vertical', verticalExpandMode: 'accordion' }"
  >
    <!-- The slot context exposes the rail state, e.g. to swap the logo for a mark -->
    <ng-template hubNavStart let-rail="rail">
      <span class="brand">{{ rail ? 'A' : 'Acme ERP' }}</span>
    </ng-template>
  </hub-nav>
</aside>

<!-- The edge toggle ships with the nav (config.railToggle, default true).
     Theme it through the --hub-nav-rail-toggle-* tokens: -->
<style>
  .themed-nav {
    --hub-nav-rail-toggle-size: 2rem;
    --hub-nav-rail-toggle-border-radius: 0.375rem;
    --hub-nav-rail-toggle-icon: url('data:image/svg+xml,...'); /* any SVG mask */
  }
</style>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubNavComponent, HubNavItem, HubNavStartDirective } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-shell-nav',
  standalone: true,
  imports: [HubNavComponent, HubNavStartDirective],
  templateUrl: './shell-nav.component.html'
})
export class ShellNavComponent {
  /** Two-way bound to [(rail)]; persist it wherever your app stores preferences. */
  readonly rail = signal(false);

  items: HubNavItem[] = [
    { id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard', icon: 'fa-solid fa-gauge-high' },
    {
      id: 'products', label: 'Products', type: 'dropdown', icon: 'fa-solid fa-box',
      children: [
        { id: 'list', label: 'Product List', type: 'link', route: '/products/list' },
        { id: 'add', label: 'Add Product', type: 'link', route: '/products/add' }
      ]
    },
    { id: 'reports', label: 'Reports', type: 'link', route: '/reports', icon: 'fa-solid fa-chart-line', badge: '3' },
    { id: 'sep1', label: '', type: 'separator' },
    { id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
  ];
}`;

	/** Two-way bound rail state; a real app would persist it as a user preference. */
	readonly rail = signal(false);

	items: HubNavItem[] = [
		{ id: 'dashboard', label: 'Dashboard', type: 'link', route: '/dashboard', icon: 'fa-solid fa-gauge-high' },
		{
			id: 'products',
			label: 'Products',
			type: 'dropdown',
			icon: 'fa-solid fa-box',
			children: [
				{ id: 'list', label: 'Product List', type: 'link', route: '/products/list' },
				{ id: 'add', label: 'Add Product', type: 'link', route: '/products/add' }
			]
		},
		{ id: 'reports', label: 'Reports', type: 'link', route: '/reports', icon: 'fa-solid fa-chart-line', badge: '3' },
		{ id: 'sep1', label: '', type: 'separator' },
		{ id: 'settings', label: 'Settings', type: 'link', route: '/settings', icon: 'fa-solid fa-gear' }
	];
}
