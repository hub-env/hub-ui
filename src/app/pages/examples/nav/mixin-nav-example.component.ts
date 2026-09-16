import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubNavComponent, HubNavItem } from 'ng-hub-ui-nav';

/**
 * Live demo for the `hub-nav-theme` SCSS mixin. The `.nav-mixin-scope` block sets the
 * same `--hub-nav-*` custom properties the mixin emits, so the rendered result matches
 * the SCSS shown alongside it in the docs. The `$accent` slot re-tones the active item
 * and hover accents, while `$item-border-radius` rounds the item surfaces.
 */
@Component({
	selector: 'app-mixin-nav-example',
	standalone: true,
	imports: [HubNavComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.nav-mixin-scope {
				--hub-nav-accent: #7c3aed;
				--hub-nav-item-border-radius: 0.5rem;
			}
		</style>
		<div class="nav-mixin-scope">
			<hub-nav [items]="items" [config]="{ orientation: 'horizontal', dropdownTrigger: 'click' }"></hub-nav>
		</div>
	`,
	styles: []
})
export class MixinNavExampleComponent {
	/**
	 * Minimal horizontal navigation tree. The item routing to `/nav` renders active on the
	 * nav documentation page, so the accent-derived active tokens are visible in the demo.
	 */
	readonly items: HubNavItem[] = [
		{ id: 'overview', label: 'Overview', type: 'link', route: '/nav', routerLinkActiveOptions: { exact: true } },
		{ id: 'api', label: 'API', type: 'link', route: '/nav/api' },
		{ id: 'examples', label: 'Examples', type: 'link', route: '/nav/examples' }
	];
}
