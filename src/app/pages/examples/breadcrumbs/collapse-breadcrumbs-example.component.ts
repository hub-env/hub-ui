import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';
import { provideExampleBreadcrumbs } from './breadcrumbs-demo.providers';

/**
 * Folding a deep trail behind an indicator.
 *
 * `maxItems` is the only input a trail needs to stop wrapping onto a second line:
 * above that length the middle collapses into a `…` button and the reader still
 * sees where they started and where they are. `itemsBeforeCollapse` and
 * `itemsAfterCollapse` move the cut when the useful context is not the very first
 * crumb — a deep tree usually reads better keeping two ancestors than one.
 *
 * The indicator is a real button: it takes keyboard focus, announces itself, and
 * opens the trail in place. `collapsedClick` fires alongside, for consumers that
 * want to react to the gesture as well.
 */
@Component({
	selector: 'app-breadcrumbs-collapse-example',
	standalone: true,
	imports: [HubBreadcrumbComponent],
	providers: [
		provideExampleBreadcrumbs([
			{ label: 'Home', url: '/home' },
			{ label: 'Workspaces', url: '/workspaces' },
			{ label: 'Northwind', url: '/workspaces/northwind' },
			{ label: 'Invoices', url: '/workspaces/northwind/invoices' },
			{ label: '2026', url: '/workspaces/northwind/invoices/2026' },
			{ label: 'INV-2026-0184', url: '/workspaces/northwind/invoices/2026/inv-2026-0184' }
		])
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<div>
				<p class="small mb-1" style="color: var(--hub-sys-text-muted)">Six crumbs, no collapsing — the default</p>
				<hub-breadcrumb />
			</div>

			<div>
				<p class="small mb-1" style="color: var(--hub-sys-text-muted)">
					<code>maxItems = 4</code> — one crumb each side of the indicator
				</p>
				<hub-breadcrumb [maxItems]="4" (collapsedClick)="expansions.set(expansions() + 1)" />
			</div>

			<div>
				<p class="small mb-1" style="color: var(--hub-sys-text-muted)">
					<code>maxItems = 4</code> with two crumbs kept on each side
				</p>
				<hub-breadcrumb
					[maxItems]="4"
					[itemsBeforeCollapse]="2"
					[itemsAfterCollapse]="2"
					(collapsedClick)="expansions.set(expansions() + 1)"
				/>
			</div>

			<p class="small mb-0" style="color: var(--hub-sys-text-muted)">
				Indicator opened <strong>{{ expansions() }}</strong> time(s) — that is the <code>collapsedClick</code> output.
				The trail expands on its own and collapses again on the next navigation.
			</p>
		</div>
	`,
	styles: []
})
export class CollapseBreadcrumbsExampleComponent {
	/** Counts the openings so the output is visible in the demo. */
	protected readonly expansions = signal(0);

	static readonly title = 'DOCS.BREADCRUMBS.EXAMPLE.COLLAPSE.TITLE';
	static readonly description = 'DOCS.BREADCRUMBS.EXAMPLE.COLLAPSE.DESCRIPTION';

	static readonly importCode = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<!-- One crumb each side of the indicator (the default) -->
<hub-breadcrumb [maxItems]="4" />

<!-- Keep two ancestors and the last two crumbs -->
<hub-breadcrumb
  [maxItems]="4"
  [itemsBeforeCollapse]="2"
  [itemsAfterCollapse]="2"
  (collapsedClick)="onExpanded()"
/>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [HubBreadcrumbComponent],
  template: \`
    <hub-breadcrumb
      [maxItems]="4"
      [itemsBeforeCollapse]="2"
      [itemsAfterCollapse]="2"
      collapsedAriaLabel="Show the hidden breadcrumb items"
      (collapsedClick)="onExpanded()"
    />
  \`
})
export class ExampleComponent {
  // The trail expands by itself; this is only for consumers that want to react
  // to the gesture too (open a menu of the hidden crumbs, log the interaction).
  onExpanded(): void {
    console.log('reader opened the collapsed trail');
  }
}`;
}
