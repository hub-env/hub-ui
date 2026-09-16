import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates Angular Router integration and active state matching.
 */
@Component({
	selector: 'app-nav-router-active-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="router-demo">
			<p class="router-demo__hint">
				This example uses real router links. Items pointing to <code>/nav</code> and <code>/nav/api</code> can show
				active state while browsing nav documentation tabs.
			</p>
			<label class="router-demo__toggle">
				<input type="checkbox" [checked]="travelling()" (change)="travelling.set($any($event.target).checked)" />
				<span><code>activeIndicator</code> — the mark travels between items instead of appearing in place</span>
			</label>

			<hub-nav [items]="items" [config]="config()"></hub-nav>

			<p class="router-demo__hint">
				Travel needs a real navigation to travel between, so the live instance is the sidebar of this very page: click
				two library entries and watch the mark move. It is deliberately reserved for a choice — a scroll spy reports
				position by <em>replacing</em> the URL rather than pushing one, and following that stepped this documentation's
				own menu through twenty highlight changes in six seconds of ordinary reading. That is what
				<code>followReplacedUrls</code> governs: <code>true</code> follows every report, a number of milliseconds
				follows only once they go quiet (this site uses <code>400</code>), and <code>false</code> never follows.
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.router-demo {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
		}

		.router-demo__hint {
			margin: 0;
			color: var(--hub-sys-text-muted, #6c757d);
			font-size: 0.9rem;
		}

		.router-demo__toggle {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			font-size: 0.9rem;
		}
	`
})
export class RouterActiveNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Router Integration & Active States';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description =
		'Uses routerLink, queryParams, fragment and routerLinkActiveOptions to control active matching behavior.';

	/** Whether the demo nav paints its active mark as a single travelling element. */
	readonly travelling = signal(false);

	/** Config for the demo nav, so the toggle above is live rather than illustrative. */
	readonly config = computed(() => ({
		orientation: 'horizontal' as const,
		dropdownTrigger: 'click' as const,
		activeIndicator: this.travelling()
	}));

	/**
	 * Navigation tree with router-specific options.
	 */
	readonly items: HubNavItem[] = [
		{
			id: 'nav-root',
			label: 'Nav docs',
			type: 'link',
			route: '/nav',
			routerLinkActiveOptions: { exact: false }
		},
		{
			id: 'nav-api',
			label: 'Nav API',
			type: 'link',
			route: '/nav/api',
			routerLinkActiveOptions: { exact: true }
		},
		{
			id: 'filtered',
			label: 'Filtered view',
			type: 'link',
			route: '/table/examples',
			queryParams: { source: 'nav-demo', mode: 'compact' },
			fragment: 'results'
		}
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<hub-nav [items]="items" [config]="config" />`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `// The active mark travels between items, and follows a scroll spy only once
// its stream of position reports goes quiet — 400ms here.
readonly config = {
  orientation: 'horizontal',
  dropdownTrigger: 'click',
  activeIndicator: true,
  followReplacedUrls: 400
};

import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-router-active-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class RouterActiveNavExampleComponent {
  readonly items: HubNavItem[] = [
    { id: 'nav-root', label: 'Nav docs', type: 'link', route: '/nav', routerLinkActiveOptions: { exact: false } }
  ];
}`;
}
