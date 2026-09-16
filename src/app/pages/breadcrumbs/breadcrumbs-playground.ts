import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	BreadcrumbItem,
	HubBreadcrumbComponent,
	HubBreadcrumbItemDirective,
	HubBreadcrumbsService
} from 'ng-hub-ui-breadcrumbs';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Reactive drop-in for HubBreadcrumbsService driven by a signal.
 * Provided at component level so it is scoped to the playground preview only.
 */
class PlaygroundBreadcrumbsService {
	private readonly items = signal<BreadcrumbItem[]>([]);
	readonly breadcrumbs = this.items.asReadonly();

	/** Publish a new item list to whoever is reading the trail. */
	update(items: BreadcrumbItem[]): void {
		this.items.set(items);
	}
}

/**
 * Playground preview for the breadcrumbs library.
 *
 * Uses the real HubBreadcrumbComponent so its native styles and tokens are applied
 * without duplication. A component-scoped PlaygroundBreadcrumbsService is provided
 * in place of HubBreadcrumbsService; an effect keeps it in sync with the input signals
 * exposed to the playground controls panel.
 */
@Component({
	selector: 'app-breadcrumbs-playground-preview',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HubBreadcrumbComponent, HubBreadcrumbItemDirective, RouterLink],
	providers: [PlaygroundBreadcrumbsService, { provide: HubBreadcrumbsService, useExisting: PlaygroundBreadcrumbsService }],
	host: {
		'[attr.dir]': 'rtl() ? "rtl" : "ltr"'
	},
	template: `
		<hub-breadcrumb [style.--hub-breadcrumb-divider]="dividerToken()">
			<ng-template hubBreadcrumbItem let-item let-isLast="isLast">
				@if (!isLast && showLinks()) {
					<!--
						Inline styles read the CSS variables explicitly because projected
						content has no _ngcontent attribute and therefore is not matched by
						hub-breadcrumb's scoped CSS rules. The variables ARE inherited through
						the DOM from hub-breadcrumb's inline style overrides.
					-->
					<a
						[routerLink]="item.url"
						class="hub-breadcrumb__link"
						style="color: var(--hub-breadcrumb-link-color); text-decoration: var(--hub-breadcrumb-link-decoration, none)"
					>
						{{ item.label }}
					</a>
				} @else {
					<span class="hub-breadcrumb__text" style="color: var(--hub-breadcrumb-item-active-color)">
						{{ item.label }}
					</span>
				}
			</ng-template>
		</hub-breadcrumb>
	`
})
export class BreadcrumbsPlaygroundPreviewComponent {
	/** Label for the first (root) breadcrumb segment. */
	readonly homeLabel = input<string>('Home');
	/** Label for the intermediate breadcrumb segment. */
	readonly libraryLabel = input<string>('Library');
	/** Label for the active (current) breadcrumb segment. */
	readonly currentLabel = input<string>('Breadcrumbs');
	/** Raw separator character rendered between items, e.g. `>` or `/`. */
	readonly separator = input<string>('>');
	/** Whether non-active segments render as links (vs plain text). */
	readonly showLinks = input<boolean>(true);
	/** Whether the trail is laid out right-to-left. */
	readonly rtl = input<boolean>(false);

	/**
	 * The separator wrapped as a CSS string literal for --hub-breadcrumb-divider.
	 */
	readonly dividerToken = computed<string>(() => `'${this.separator().replace(/'/g, "\\'")}'`);

	private readonly svc = inject(PlaygroundBreadcrumbsService);

	constructor() {
		effect(() => {
			this.svc.update([
				{ label: this.homeLabel(), url: '/home', data: {} },
				{ label: this.libraryLabel(), url: '/library', data: {} },
				{ label: this.currentLabel(), url: '/breadcrumbs', data: {} }
			]);
		});
	}
}

/**
 * Interactive playground definition for the ng-hub-ui-breadcrumbs documentation page.
 *
 * Drives {@link BreadcrumbsPlaygroundPreviewComponent} — a faithful preview of the
 * breadcrumb trail — and exposes the real `--hub-breadcrumb-*` theming tokens consumed
 * by the library SCSS.
 */
export const BREADCRUMBS_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'breadcrumb',
		title: 'Breadcrumb',
		tag: 'hub-breadcrumb',
		cssVarTargetSelector: 'hub-breadcrumb',
		description:
			'A navigation trail built from the Angular Router state. Tweak the separator, direction and labels, then theme every segment live with the hub tokens.',
		component: BreadcrumbsPlaygroundPreviewComponent,
		controls: [
			{ name: 'homeLabel', label: 'Home label', type: 'text', default: 'Home' },
			{ name: 'libraryLabel', label: 'Intermediate label', type: 'text', default: 'Library' },
			{ name: 'currentLabel', label: 'Active label', type: 'text', default: 'Breadcrumbs' },
			{
				name: 'separator',
				label: 'Separator',
				type: 'select',
				default: '>',
				options: [
					{ label: '> (chevron)', value: '>' },
					{ label: '/ (slash)', value: '/' },
					{ label: '→ (arrow)', value: '→' },
					{ label: '• (bullet)', value: '•' },
					{ label: '| (pipe)', value: '|' }
				],
				description: 'Maps to the --hub-breadcrumb-divider token (applied as a CSS content string).'
			},
			{ name: 'showLinks', label: 'Render links', type: 'boolean', default: true },
			{ name: 'rtl', label: 'RTL direction', type: 'boolean', default: false }
		],
		cssVariables: [
			{ name: '--hub-breadcrumb-bg', label: 'Background', type: 'color', default: 'transparent' },
			{ name: '--hub-breadcrumb-color', label: 'Base text color', type: 'color', default: '#212529' },
			{ name: '--hub-breadcrumb-link-color', label: 'Link color', type: 'color', default: '#0d6efd' },
			{ name: '--hub-breadcrumb-link-hover-color', label: 'Link hover color', type: 'color', default: '#0a58ca' },
			{ name: '--hub-breadcrumb-item-active-color', label: 'Active item color', type: 'color', default: '#6c757d' },
			{ name: '--hub-breadcrumb-divider-color', label: 'Separator color', type: 'color', default: '#6c757d' },
			{
				name: '--hub-breadcrumb-focus-ring-color',
				label: 'Focus ring color',
				type: 'color',
				default: 'rgba(13, 110, 253, 0.25)'
			},
			{ name: '--hub-breadcrumb-border-radius', label: 'Border radius', type: 'text', default: '0.375rem' },
			{ name: '--hub-breadcrumb-padding-x', label: 'Padding X', type: 'text', default: '1rem' },
			{ name: '--hub-breadcrumb-padding-y', label: 'Padding Y', type: 'text', default: '0.25rem' },
			{ name: '--hub-breadcrumb-item-padding-x', label: 'Item spacing', type: 'text', default: '0.5rem' },
			{ name: '--hub-breadcrumb-margin-bottom', label: 'Bottom margin', type: 'text', default: '0' },
			{ name: '--hub-breadcrumb-font-size', label: 'Font size', type: 'text', default: 'inherit' }
		]
	}
];
