import { isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	NgZone,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	afterNextRender,
	computed,
	inject,
	signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HighlightModule } from 'ngx-highlightjs';
import { BackgroundFxComponent } from '../../components/background-fx/background-fx.component';
import { REPOSITORY_URL } from '../../seo/seo.config';
import { AppI18nService } from '../../services/app-i18n.service';
import { ThemeService } from '../../services/theme.service';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { LenisInstance } from './home.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

export type { LenisInstance } from './home.model';

/** Total documented `--hub-*` CSS variables, derived from the generated docs tables. */
const CSS_VAR_COUNT = Object.values(MD_CSS_VARIABLES).reduce(
	(total, groups) => total + groups.reduce((count, group) => count + group.variables.length, 0),
	0
);

/** npm packages that rotate in the hero install snippet. */
const INSTALL_PACKAGES = [
	'ng-hub-ui-modal',
	'ng-hub-ui-stepper',
	'ng-hub-ui-calendar',
	'ng-hub-ui-breadcrumbs',
	'ng-hub-ui-nav',
	'ng-hub-ui-avatar',
	'ng-hub-ui-sortable',
	'ng-hub-ui-paginable',
	'ng-hub-ui-portal',
	'ng-hub-ui-board',
	'ng-hub-ui-history',
	'ng-hub-ui-skeleton',
	'ng-hub-ui-utils'
] as const;

/** Interval in milliseconds between package rotations. */
const ROTATION_INTERVAL_MS = 2500;

/**
 * Hub UI documentation landing page.
 * Displays the hero with live components, stats, the live theme demo,
 * feature highlights, a code-to-result demo, the component catalogue,
 * the install guide and the final call to action.
 *
 * Motion design (GSAP + ScrollTrigger + Lenis) is lazy-loaded in the
 * browser only and fully disabled under `prefers-reduced-motion`.
 */
@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		RouterLink,
		TranslatePipe,
		HubAvatarComponent,
		HubPanelsComponent,
		HubPanelComponent,
		HubSkeletonComponent,
		HighlightModule,
		BackgroundFxComponent,
		HubButtonComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
	animations: [
		trigger('pkgSlide', [
			transition('* => *', [
				style({ opacity: 0, transform: 'translateY(-8px)' }),
				animate('280ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
			])
		])
	]
})
export class HomeComponent implements OnInit, OnDestroy {
	protected readonly i18n = inject(AppI18nService);
	protected readonly themeService = inject(ThemeService);
	protected readonly repositoryUrl = REPOSITORY_URL;
	private readonly platformId = inject(PLATFORM_ID);
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly zone = inject(NgZone);

	/** Index of the currently displayed install package. */
	private readonly packageIndex = signal(0);

	/** Currently displayed npm package name. */
	protected readonly currentPackage = computed(() => INSTALL_PACKAGES[this.packageIndex() % INSTALL_PACKAGES.length]);

	/** Animation binding value — changes each time the package rotates. */
	protected readonly pkgAnimKey = computed(() => this.packageIndex());

	private rotationTimer: ReturnType<typeof setInterval> | null = null;

	/** Lazily created Lenis smooth-scroll instance (home route only). */
	private lenis: LenisInstance | null = null;

	/** GSAP context holding every tween/ScrollTrigger for one-call cleanup. */
	private gsapContext: { revert(): void } | null = null;

	/** GSAP module reference kept for ticker cleanup. */
	private gsap: (typeof import('gsap'))['gsap'] | null = null;

	/** Ticker callback driving Lenis from the GSAP ticker. */
	private tickerCallback: ((time: number) => void) | null = null;

	/** Guards async motion setup against late resolution after destroy. */
	private destroyed = false;

	/** Avatars rendered live inside the hero collage. */
	protected readonly heroAvatars = [
		{ name: 'Ada Lovelace', color: 'var(--hub-sys-gradient-1)' },
		{ name: 'Grace Hopper', color: 'var(--hub-sys-gradient-2)' },
		{ name: 'Alan Turing', color: 'var(--hub-sys-gradient-3)' }
	] as const;

	/** All library entries displayed in the component catalogue grid. */
	protected readonly components = [
		{ id: 'modal', icon: 'fa-solid fa-window-restore' },
		{ id: 'paginable', icon: 'fa-solid fa-table' },
		{ id: 'sortable', icon: 'fa-solid fa-sort' },
		{ id: 'calendar', icon: 'fa-solid fa-calendar-days' },
		{ id: 'avatar', icon: 'fa-solid fa-circle-user' },
		{ id: 'board', icon: 'fa-solid fa-table-columns' },
		{ id: 'breadcrumbs', icon: 'fa-solid fa-route' },
		{ id: 'history', icon: 'fa-solid fa-clock-rotate-left' },
		{ id: 'nav', icon: 'fa-solid fa-compass' },
		{ id: 'portal', icon: 'fa-solid fa-up-right-from-square' },
		{ id: 'skeleton', icon: 'fa-regular fa-rectangle-list' },
		{ id: 'stepper', icon: 'fa-solid fa-stairs' },
		{ id: 'toast', icon: 'fa-solid fa-bell' },
		{ id: 'buttons', icon: 'fa-solid fa-hand-pointer' },
		{ id: 'badges', icon: 'fa-solid fa-certificate' },
		{ id: 'panels', icon: 'fa-solid fa-layer-group' },
		{ id: 'forms', icon: 'fa-solid fa-pen-to-square' },
		{ id: 'milestones', icon: 'fa-solid fa-timeline' },
		{ id: 'icons', icon: 'fa-solid fa-icons' },
		{ id: 'metrics', icon: 'fa-solid fa-gauge-high' },
		{ id: 'utils', icon: 'fa-solid fa-screwdriver-wrench' }
	] as const;

	/** Priority use-case cards highlighted for SEO-focused landing content. */
	protected readonly useCases = [
		{ key: 'modal' as const, route: '/modal/overview', icon: 'fa-solid fa-window-restore' },
		{ key: 'paginable' as const, route: '/paginable/overview', icon: 'fa-solid fa-table-list' },
		{ key: 'sortable' as const, route: '/sortable/overview', icon: 'fa-solid fa-arrow-down-wide-short' },
		{ key: 'calendar' as const, route: '/calendar/overview', icon: 'fa-solid fa-calendar-check' }
	] as const;

	/**
	 * Key stats shown below the hero.
	 * `numeric` feeds the scroll-triggered counter; prefix/suffix are kept
	 * static so server-rendered markup always shows the final value.
	 */
	protected readonly stats = [
		{
			value: `${this.components.length}`,
			numeric: this.components.length,
			prefix: '',
			suffix: '',
			key: 'components' as const
		},
		{ value: `${CSS_VAR_COUNT}`, numeric: CSS_VAR_COUNT, prefix: '', suffix: '', key: 'cssVars' as const },
		{ value: '7', numeric: 7, prefix: '', suffix: '', key: 'themes' as const },
		{ value: 'v22', numeric: 22, prefix: 'v', suffix: '', key: 'angularVersion' as const }
	] as const;

	/** Feature cards displayed in the Why Hub UI section. */
	protected readonly features = [
		{ key: 'accessible' as const, icon: 'fa-solid fa-universal-access' },
		{ key: 'customizable' as const, icon: 'fa-solid fa-sliders' },
		{ key: 'typescript' as const, icon: 'fa-solid fa-code' },
		{ key: 'standalone' as const, icon: 'fa-solid fa-puzzle-piece' }
	] as const;

	/** Real template snippet rendered live in the code-to-result section. */
	protected readonly codeSnippet = `<hub-panels>
  <hub-panel heading="Overview">
    The first enabled panel is activated automatically.
  </hub-panel>
  <hub-panel heading="Details">
    Switch panels with a click or the arrow keys.
  </hub-panel>
  <hub-panel heading="Settings">
    Each panel projects its own content.
  </hub-panel>
</hub-panels>`;

	constructor() {
		afterNextRender(() => {
			void this.initMotion();
		});
	}

	/**
	 * Builds a `UI.HOME.*` translation key, upper-snake-casing the dynamic segment
	 * so data-driven ids (e.g. `cssVars`, `angularVersion`) match the JSON keys.
	 *
	 * @param section Static section path under `UI.HOME` (e.g. `STATS`, `FEATURES`).
	 * @param key Data-driven id used as the dynamic segment.
	 * @param suffix Optional trailing segment (e.g. `TITLE`, `DESCRIPTION`).
	 * @returns Full UPPER_SNAKE translation key.
	 */
	protected homeKey(section: string, key: string, suffix?: string): string {
		const segment = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
		return `UI.HOME.${section}.${segment}` + (suffix ? `.${suffix}` : '');
	}

	/**
	 * Starts the hero install-package rotation timer in the browser only
	 * (skipped during SSR so prerendered markup stays static).
	 */
	ngOnInit(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		this.rotationTimer = setInterval(() => {
			this.packageIndex.update((i) => i + 1);
		}, ROTATION_INTERVAL_MS);
	}

	/**
	 * Tears down the rotation timer and the lazily-created motion stack
	 * (GSAP context, Lenis instance and ticker) to avoid leaks on navigation.
	 */
	ngOnDestroy(): void {
		this.destroyed = true;

		if (this.rotationTimer !== null) {
			clearInterval(this.rotationTimer);
		}

		this.gsapContext?.revert();
		this.lenis?.destroy();

		if (this.gsap && this.tickerCallback) {
			this.gsap.ticker.remove(this.tickerCallback);
		}
	}

	/**
	 * Returns the display name for a given component id.
	 *
	 * @param id Component route id.
	 * @returns Capitalized display name.
	 */
	protected getName(id: string): string {
		return id.charAt(0).toUpperCase() + id.slice(1);
	}

	/**
	 * Copies the current install command to the clipboard.
	 */
	protected copyInstall(): void {
		navigator.clipboard?.writeText(`npm install ${this.currentPackage()}`).catch(() => undefined);
	}

	/**
	 * Prefixes a route with the active language code.
	 *
	 * @param route Internal route path.
	 * @returns Language-aware route.
	 */
	protected localizeRoute(route: string): string {
		return this.i18n.localizePath(route);
	}

	/**
	 * Lazily wires Lenis smooth scrolling and the GSAP scroll choreography.
	 * Skipped entirely when the visitor prefers reduced motion, so the page
	 * stays fully usable with native scroll and no transforms.
	 */
	private async initMotion(): Promise<void> {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		// The app shell scrolls inside <main class="app-shell__main">, not on window.
		const scroller = document.querySelector<HTMLElement>('.app-shell__main');
		if (!scroller) {
			return;
		}

		const [gsapModule, scrollTriggerModule, lenisModule] = await Promise.all([
			import('gsap'),
			import('gsap/ScrollTrigger'),
			import('lenis')
		]);

		if (this.destroyed) {
			return;
		}

		// Animation frames must not trigger Angular change detection.
		this.zone.runOutsideAngular(() => {
			const gsap = gsapModule.gsap;
			const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
			gsap.registerPlugin(ScrollTrigger);
			this.gsap = gsap;

			const LenisCtor = lenisModule.default;
			this.lenis = new LenisCtor({
				wrapper: scroller,
				content: this.host.nativeElement,
				lerp: 0.09
			}) as unknown as LenisInstance;
			this.lenis.on('scroll', () => ScrollTrigger.update());
			this.tickerCallback = (time: number) => this.lenis?.raf(time * 1000);
			gsap.ticker.add(this.tickerCallback);
			gsap.ticker.lagSmoothing(0);

			ScrollTrigger.defaults({ scroller });

			const root = this.host.nativeElement;

			this.gsapContext = gsap.context(() => {
				// --- Hero entrance: copy column then collage cards ---
				gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } })
					.from('.hero__badge', { y: 24, opacity: 0 })
					.from('.hero__title', { y: 32, opacity: 0 }, '-=0.45')
					.from('.hero__subtitle', { y: 24, opacity: 0 }, '-=0.5')
					.from('.hero__actions', { y: 20, opacity: 0 }, '-=0.5')
					.from('.hero__install', { y: 16, opacity: 0 }, '-=0.5')
					.from('.collage-card', { y: 40, opacity: 0, stagger: 0.12, duration: 0.8 }, '-=0.4');

				// --- Hero collage: subtle parallax drift while scrolling away ---
				gsap.to('.hero__collage', {
					y: -36,
					ease: 'none',
					scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
				});

				// --- Section headers: soft reveal ---
				// `set` + `to` + `once` (instead of `from`) so a ScrollTrigger
				// refresh after a late layout shift can never re-apply the start
				// state and leave the element frozen mid-reveal.
				gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
					gsap.set(head, { y: 36, opacity: 0 });
					gsap.to(head, {
						y: 0,
						opacity: 1,
						duration: 0.7,
						ease: 'power3.out',
						scrollTrigger: { trigger: head, start: 'top 85%', once: true }
					});
				});

				// --- Card grids: staggered entrance ---
				gsap.utils.toArray<HTMLElement>('[data-stagger-grid]').forEach((grid) => {
					const items = Array.from(grid.children) as HTMLElement[];
					gsap.set(items, { y: 32, opacity: 0 });
					gsap.to(items, {
						y: 0,
						opacity: 1,
						duration: 0.6,
						ease: 'power3.out',
						stagger: 0.07,
						scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
					});
				});

				// --- Stats: counters that count up on entry ---
				gsap.utils.toArray<HTMLElement>('.stats__value').forEach((el) => {
					const target = Number(el.dataset['count'] ?? '0');
					const prefix = el.dataset['prefix'] ?? '';
					const suffix = el.dataset['suffix'] ?? '';
					const counter = { value: 0 };
					gsap.to(counter, {
						value: target,
						duration: 1.4,
						ease: 'power2.out',
						scrollTrigger: { trigger: el, start: 'top 88%', once: true },
						onUpdate: () => {
							el.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
						}
					});
				});

				// --- Install guide: progress line scrubbed by scroll ---
				const timelineBar = root.querySelector<HTMLElement>('.install-guide__line-fill');
				if (timelineBar) {
					gsap.fromTo(
						timelineBar,
						{ scaleY: 0 },
						{
							scaleY: 1,
							ease: 'none',
							scrollTrigger: {
								trigger: '.install-guide__steps',
								start: 'top 80%',
								end: 'bottom 55%',
								scrub: 0.5
							}
						}
					);
				}

				// --- Final CTA: reveal ---
				gsap.set('.final-cta__panel', { y: 48, opacity: 0 });
				gsap.to('.final-cta__panel', {
					y: 0,
					opacity: 1,
					duration: 0.8,
					ease: 'power3.out',
					scrollTrigger: { trigger: '.final-cta', start: 'top 82%', once: true }
				});

				// Recalculate trigger positions once async content (fonts, live
				// components, highlighted code) has settled the final layout.
				ScrollTrigger.refresh();
			}, root);
		});
	}
}
