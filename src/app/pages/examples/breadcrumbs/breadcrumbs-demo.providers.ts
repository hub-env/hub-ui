import { Provider, Signal, signal, WritableSignal } from '@angular/core';
import { BreadcrumbItem, HubBreadcrumbsService } from 'ng-hub-ui-breadcrumbs';

/**
 * Simple facade that feeds static breadcrumb data to the hub breadcrumbs component
 * within the documentation examples. This avoids depending on the real router tree
 * which is not active when examples are rendered inside the docs page.
 */
class StaticBreadcrumbsService implements Pick<HubBreadcrumbsService, 'breadcrumbs'> {
	readonly breadcrumbs: Signal<BreadcrumbItem[]>;

	constructor(items: BreadcrumbItem[]) {
		const normalized = items.map((item) => ({ ...item, data: item.data ?? {} }));
		this.breadcrumbs = signal(normalized).asReadonly();
	}
}

/**
 * Provides a component-scoped HubBreadcrumbsService that publishes the supplied items.
 */
export function provideExampleBreadcrumbs(items: BreadcrumbItem[]): Provider {
	return {
		provide: HubBreadcrumbsService,
		useFactory: () => new StaticBreadcrumbsService(items)
	};
}

/** Default breadcrumb path reused across the documentation examples. */
export const BASE_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: 'Inicio', url: '/home', data: {} },
	{ label: 'Componentes', url: '/components', data: {} },
	{ label: 'Breadcrumbs', url: '/components/breadcrumbs', data: {} }
];

/**
 * Stand-in for the router in the demos that need the trail to change.
 *
 * `HubBreadcrumbsService` derives its trail from navigation, and the docs page has no
 * route tree to navigate, so an example that wants to show the trail moving needs
 * something it can push a new one into. The published surface is the same one the real
 * service exposes — a signal — which is what lets the example read it exactly as an
 * application would.
 */
export class NavigableBreadcrumbsService implements Pick<HubBreadcrumbsService, 'breadcrumbs'> {
	readonly #trail: WritableSignal<BreadcrumbItem[]>;

	readonly breadcrumbs: Signal<BreadcrumbItem[]>;

	constructor(initial: BreadcrumbItem[]) {
		this.#trail = signal(initial);
		this.breadcrumbs = this.#trail.asReadonly();
	}

	/** Replaces the trail, standing in for the navigation that would produce it. */
	navigateTo(items: BreadcrumbItem[]): void {
		this.#trail.set(items);
	}
}

/**
 * Provides a component-scoped breadcrumbs service the example can drive, reachable both
 * as `HubBreadcrumbsService` (what the component and the demo read) and as
 * {@link NavigableBreadcrumbsService} (what the demo's buttons push into).
 */
export function provideNavigableExampleBreadcrumbs(initial: BreadcrumbItem[]): Provider[] {
	return [
		{ provide: NavigableBreadcrumbsService, useFactory: () => new NavigableBreadcrumbsService(initial) },
		{ provide: HubBreadcrumbsService, useExisting: NavigableBreadcrumbsService }
	];
}
