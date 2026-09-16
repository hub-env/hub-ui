import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbItem, HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';

/**
 * Keyboard focus on the trail.
 *
 * Press Tab: every link, and the collapsed indicator, take a focus ring built from
 * the design-system tokens, so a breadcrumb focus looks like focus everywhere else
 * in the application. The ring is exposed as its own variables, which is what makes
 * it themeable without touching the outline — the second trail below re-tints it
 * with three declarations and nothing else changes.
 */
@Component({
	selector: 'app-breadcrumbs-focus-ring-example',
	standalone: true,
	imports: [HubBreadcrumbComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-4">
			<div>
				<p class="small mb-1" style="color: var(--hub-sys-text-muted)">
					Default ring — press <kbd>Tab</kbd> to walk the trail
				</p>
				<hub-breadcrumb [items]="trail" [maxItems]="4" />
			</div>

			<div>
				<p class="small mb-1" style="color: var(--hub-sys-text-muted)">Re-tinted ring on the same markup</p>
				<hub-breadcrumb
					[items]="trail"
					[maxItems]="4"
					style="--hub-breadcrumb-focus-ring-color: rgba(25, 135, 84, 0.35); --hub-breadcrumb-link-focus-color: #146c43; --hub-breadcrumb-focus-bg: rgba(25, 135, 84, 0.08);"
				/>
			</div>
		</div>

		<p class="small mb-0 mt-3" style="color: var(--hub-sys-text-muted)">
			The ring reaches the collapsed indicator too, which is a button and therefore part of the tab order. Note where the
			overrides live: the focus tokens are declared on <code>:host</code>, so a value set on an ancestor never reaches
			them — put it on the <code>&lt;hub-breadcrumb&gt;</code> element or inside it. (The accent slot is the one
			exception, left undeclared on purpose so it does inherit.)
		</p>
	`,
	styles: []
})
export class FocusRingBreadcrumbsExampleComponent {
	/** Long enough to collapse, so the indicator also takes part in the tab order. */
	protected readonly trail: BreadcrumbItem[] = [
		{ label: 'Home', url: '/home' },
		{ label: 'Workspaces', url: '/workspaces' },
		{ label: 'Northwind', url: '/workspaces/northwind' },
		{ label: 'Invoices', url: '/workspaces/northwind/invoices' },
		{ label: 'INV-2026-0184', url: '/workspaces/northwind/invoices/inv-2026-0184' }
	];

	static readonly title = 'DOCS.BREADCRUMBS.EXAMPLE.FOCUS_RING.TITLE';
	static readonly description = 'DOCS.BREADCRUMBS.EXAMPLE.FOCUS_RING.DESCRIPTION';

	static readonly importCode = `import { HubBreadcrumbComponent } from 'ng-hub-ui-breadcrumbs';`;

	static readonly templateCode = `<hub-breadcrumb [maxItems]="4" />`;

	static readonly componentCode = `// Nothing to wire: links and the collapsed indicator take the design-system
// focus ring out of the box. Re-tint it wherever the breadcrumb lives.`;

	static readonly cssCode = `/* The focus tokens are declared on :host, so an override has to land on the crumb
   element itself or inside it — a value set on an ancestor never reaches them.
   Targeting the inner list is the reliable form from an ordinary stylesheet. */
.branded-breadcrumbs .hub-breadcrumb__list {
  /* Ring geometry and colour — the outline itself is never removed, only traded */
  --hub-breadcrumb-focus-ring-color: rgba(25, 135, 84, 0.35);
  --hub-breadcrumb-focus-ring-width: 0.25rem;
  --hub-breadcrumb-focus-ring-radius: 0.25rem;

  /* Text and background while focused */
  --hub-breadcrumb-link-focus-color: #146c43;
  --hub-breadcrumb-focus-bg: rgba(25, 135, 84, 0.08);
}`;
}
