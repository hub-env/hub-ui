import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Demonstrates a vertical sticky navigation sidebar inside a scrollable layout.
 */
@Component({
	selector: 'app-nav-vertical-sticky-example',
	standalone: true,
	imports: [HubNavComponent],
	template: `
		<div class="sticky-nav-demo">
			<div class="sticky-nav-demo__sidebar">
				<hub-nav
					[items]="items"
					[config]="{
						orientation: 'vertical',
						position: 'sticky',
						stickyTop: '1rem',
						verticalExpandMode: 'panel',
						panelMaxVisible: 2,
						panelWidth: '14rem',
						collapseBreakpoint: 0
					}"
				></hub-nav>
			</div>

			<div class="sticky-nav-demo__content">
				<section class="sticky-nav-demo__hero">
					<h3>Sticky Sidebar</h3>
					<p>
						The navigation stays pinned while the content scrolls, which makes it useful for documentation pages and
						long settings views.
					</p>
				</section>

				@for (block of contentBlocks; track block.title) {
					<section class="sticky-nav-demo__block">
						<h4>{{ block.title }}</h4>
						<p>{{ block.body }}</p>
						<p>
							Nam tincidunt, eros non posuere ultricies, ex risus porttitor mi, at vehicula nibh arcu nec risus.
							Sed eget sem id justo feugiat egestas nec vel sem.
						</p>
					</section>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.sticky-nav-demo {
			display: grid;
			grid-template-columns: 16rem minmax(0, 1fr);
			gap: 1.5rem;
			min-height: 160vh;
			padding: 1rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 0.75rem;
			background: var(--hub-sys-surface-page, #fff);
		}

		.sticky-nav-demo__sidebar {
			min-width: 0;
		}

		.sticky-nav-demo__content {
			min-width: 0;
			padding-right: 0.5rem;
		}

		.sticky-nav-demo__hero,
		.sticky-nav-demo__block {
			padding: 1rem 0;
			border-bottom: 1px solid var(--hub-sys-border-color-default, #e9ecef);
		}

		.sticky-nav-demo__hero {
			padding-top: 0;
		}

		.sticky-nav-demo__block h4 {
			margin: 0 0 0.5rem;
		}

		.sticky-nav-demo__block p {
			margin: 0 0 0.75rem;
			line-height: 1.6;
			color: var(--hub-sys-text-secondary, #495057);
		}
	`
})
export class VerticalStickyNavExampleComponent {
	/**
	 * Example title rendered by the example viewer.
	 */
	readonly title = 'Vertical Sticky Sidebar';

	/**
	 * Example description rendered by the example viewer.
	 */
	readonly description = 'A vertical sticky sidebar that remains in view while long content scrolls.';

	/**
	 * Navigation tree used for the sticky sidebar demo.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'overview', label: 'Overview', type: 'link', route: '/docs/overview' },
		{
			id: 'guides',
			label: 'Guides',
			type: 'dropdown',
			children: [
				{ id: 'getting-started', label: 'Getting Started', type: 'link', route: '/docs/guides/getting-started' },
				{ id: 'installation', label: 'Installation', type: 'link', route: '/docs/guides/installation' },
				{
					id: 'advanced',
					label: 'Advanced',
					type: 'dropdown',
					children: [
						{ id: 'theming', label: 'Theming', type: 'link', route: '/docs/guides/advanced/theming' },
						{
							id: 'accessibility',
							label: 'Accessibility',
							type: 'link',
							route: '/docs/guides/advanced/accessibility'
						}
					]
				}
			]
		},
		{ id: 'api', label: 'API', type: 'link', route: '/docs/api' },
		{ id: 'styles', label: 'Styles', type: 'link', route: '/docs/styles' }
	];

	/**
	 * Long content blocks shown alongside the sticky sidebar.
	 */
	readonly contentBlocks = [
		{
			title: 'Section One',
			body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod nunc sed velit tincidunt, in dictum sem gravida.'
		},
		{
			title: 'Section Two',
			body: 'Curabitur ultrices dui sit amet sem iaculis, a faucibus ligula tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.'
		},
		{
			title: 'Section Three',
			body: 'Suspendisse potenti. Mauris id dolor consequat, pharetra arcu non, rhoncus ligula. Donec at ligula a ipsum suscipit sollicitudin.'
		},
		{
			title: 'Section Four',
			body: 'Aliquam erat volutpat. Duis vel mi sit amet lorem feugiat aliquet. Donec mattis, massa et commodo suscipit, mauris arcu cursus dolor.'
		}
	];

	/**
	 * Template snippet rendered in the code tabs.
	 */
	static readonly templateCode = `<div class="sticky-nav-demo">
  <div class="sticky-nav-demo__sidebar">
    <hub-nav
      [items]="items"
      [config]="{
        orientation: 'vertical',
        position: 'sticky',
        stickyTop: '1rem',
        verticalExpandMode: 'panel',
        panelMaxVisible: 2,
        panelWidth: '14rem',
        collapseBreakpoint: 0
      }"
    ></hub-nav>
  </div>

  <div class="sticky-nav-demo__content">
    <!-- Long content blocks -->
  </div>
</div>`;

	/**
	 * Component snippet rendered in the code tabs.
	 */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

@Component({
  selector: 'app-nav-vertical-sticky-example',
  standalone: true,
  imports: [HubNavComponent],
  template: \`...\`
})
export class VerticalStickyNavExampleComponent {
  readonly items: HubNavItem[] = [];
}`;
}
