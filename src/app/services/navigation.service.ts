import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AsideData, MenuItem, NavigationState } from '../models/navigation.model';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	private readonly platformId = inject(PLATFORM_ID);

	// Signals para estado reactivo
	private _openAsides = signal<AsideData[]>([]);
	private _currentPath = signal<string[]>([]);
	private _activeRoute = signal<string>('');

	private router = inject(Router);

	constructor() {
		// Restore navigation state on service initialization
		this.restoreNavigationState();
	}

	// Signals públicos (read-only)
	public readonly openAsides = this._openAsides.asReadonly();
	public readonly currentPath = this._currentPath.asReadonly();
	public readonly activeRoute = this._activeRoute.asReadonly();

	// Computed signals
	public readonly navigationState = computed<NavigationState>(() => ({
		primaryMenu: this.menuData,
		openAsides: this._openAsides(),
		currentPath: this._currentPath(),
		activeRoute: this._activeRoute()
	}));

	// Datos del menú principal
	private menuData: MenuItem[] = [
		{ id: 'home', label: 'UI.NAV.HOME', route: '/' },
		{ id: 'about', label: 'UI.NAV.ABOUT', route: '/about' },
		{ id: 'design-system', label: 'DOCS.COMMON.NAV.DESIGN_SYSTEM', route: '/design-system' },
		{ id: 'i18n', label: 'DOCS.CALENDAR.NAV.I18N', route: '/i18n' },
		{ id: 'action-sheet', label: 'DOCS.COMMON.LIBRARY.ACTION_SHEET', route: '/action-sheet' },
		{ id: 'avatar', label: 'DOCS.COMMON.LIBRARY.AVATAR', route: '/avatar' },
		{ id: 'badges', label: 'DOCS.COMMON.LIBRARY.BADGES', route: '/badges' },
		{ id: 'board', label: 'DOCS.COMMON.LIBRARY.BOARD', route: '/board' },
		{ id: 'breadcrumbs', label: 'DOCS.COMMON.LIBRARY.BREADCRUMBS', route: '/breadcrumbs' },
		{ id: 'buttons', label: 'DOCS.COMMON.LIBRARY.BUTTONS', route: '/buttons' },
		{ id: 'calendar', label: 'DOCS.COMMON.LIBRARY.CALENDAR', route: '/calendar' },
		{ id: 'forms', label: 'DOCS.COMMON.LIBRARY.FORMS', route: '/forms' },
		{ id: 'history', label: 'DOCS.COMMON.LIBRARY.HISTORY', route: '/history' },
		{ id: 'icons', label: 'DOCS.COMMON.LIBRARY.ICONS', route: '/icons' },
		{ id: 'installer', label: 'DOCS.COMMON.LIBRARY.INSTALLER', route: '/installer' },
		{ id: 'loading', label: 'DOCS.COMMON.LIBRARY.LOADING', route: '/loading' },
		{ id: 'metrics', label: 'DOCS.COMMON.LIBRARY.METRICS', route: '/metrics' },
		{ id: 'milestones', label: 'DOCS.COMMON.LIBRARY.MILESTONES', route: '/milestones' },
		{ id: 'modal', label: 'DOCS.COMMON.LIBRARY.MODAL', route: '/modal' },
		{ id: 'nav', label: 'DOCS.COMMON.LIBRARY.NAV', route: '/nav' },
		{ id: 'paginable', label: 'DOCS.COMMON.LIBRARY.PAGINABLE', route: '/paginable' },
		{ id: 'panels', label: 'DOCS.COMMON.LIBRARY.PANELS', route: '/panels' },
		{ id: 'portal', label: 'DOCS.COMMON.LIBRARY.PORTAL', route: '/portal' },
		{ id: 'signature', label: 'DOCS.COMMON.LIBRARY.SIGNATURE', route: '/signature' },
		{ id: 'skeleton', label: 'DOCS.COMMON.LIBRARY.SKELETON', route: '/skeleton' },
		{ id: 'sortable', label: 'DOCS.COMMON.LIBRARY.SORTABLE', route: '/sortable' },
		{ id: 'stepper', label: 'DOCS.COMMON.LIBRARY.STEPPER', route: '/stepper' },
		{ id: 'toast', label: 'DOCS.COMMON.LIBRARY.TOAST', route: '/toast' },
		{ id: 'utils', label: 'DOCS.COMMON.LIBRARY.UTILS', route: '/utils' }
	];

	/**
	 * Obtiene el menú principal
	 */
	getMainMenu(): MenuItem[] {
		return this.menuData;
	}

	/**
	 * Maneja el clic en un elemento del menú
	 */
	handleMenuItemClick(item: MenuItem, level: number = 0, asideId?: string): void {
		if (item.route) {
			this.navigateToRoute(item.route);
			this.updateActivePath(item, level);

			if (item.children && item.children.length > 0) {
				if (item.action === 'stack') {
					this.openStackedAside(item.children, item.id, level + 1);
				} else if (item.action === 'drill-down' && asideId) {
					this.drillDownInAside(item.children, asideId, item.label);
				}
			}
		} else if (item.children && item.children.length > 0) {
			// Find the first child with a route (navigate to it automatically)
			const firstRouteChild = this.findFirstRouteChild(item.children);
			if (firstRouteChild) {
				this.navigateToRoute(firstRouteChild.route!);
				this.updateActivePath(firstRouteChild, level + 1);
			}

			// Open the aside/drill-down as before for menu interaction
			if (item.action === 'stack') {
				this.openStackedAside(item.children, item.id, level + 1);
			} else if (item.action === 'drill-down' && asideId) {
				this.drillDownInAside(item.children, asideId, item.label);
			}

			// Update path to show the parent item in breadcrumb
			if (!firstRouteChild) {
				this.updateActivePath(item, level);
			}
		}
	}

	/**
	 * Encuentra el primer hijo con ruta de forma recursiva
	 */
	private findFirstRouteChild(items: MenuItem[]): MenuItem | null {
		for (const item of items) {
			if (item.route) {
				return item;
			}
			if (item.children && item.children.length > 0) {
				const found = this.findFirstRouteChild(item.children);
				if (found) {
					return found;
				}
			}
		}
		return null;
	}

	/**
	 * Abre un nuevo aside apilado
	 */
	private openStackedAside(items: MenuItem[], parentId: string, level: number): void {
		const currentAsides = this._openAsides();

		// Cerrar asides de niveles superiores o iguales
		const asidesToKeep = currentAsides.filter((a) => a.level < level);

		// Find parent item to get its label
		const parentItem = this.findItemById(parentId);

		// Crear nuevo aside
		const newAside: AsideData = {
			id: `aside-${level}-${Date.now()}`,
			level: level,
			items: items,
			parentItemId: parentId,
			parentItemLabel: parentItem?.label,
			history: [],
			historyLabels: [],
			animationState: 'active',
			isDrillDown: false
		};

		// Actualizar estado
		this._openAsides.set([...asidesToKeep, newAside]);
		this.saveNavigationState();
	}

	/**
	 * Realiza navegación drill-down dentro de un aside
	 */
	private drillDownInAside(items: MenuItem[], asideId: string, parentLabel?: string): void {
		const currentAsides = [...this._openAsides()];
		const asideIndex = currentAsides.findIndex((a) => a.id === asideId);

		if (asideIndex === -1) return;

		const aside = currentAsides[asideIndex];

		// Guardar estado actual en el historial
		aside.history.push([...aside.items]);

		// Guardar el label actual como contexto para el drill-down
		const currentLabel = aside.parentItemLabel || '';
		aside.historyLabels.push(currentLabel);

		// Cambiar contenido
		aside.items = items;
		aside.isDrillDown = true;

		// Update parent label to show the drill-down context
		if (parentLabel) {
			aside.parentItemLabel = parentLabel;
		}

		this._openAsides.set(currentAsides);
		this.saveNavigationState();
	}

	/**
	 * Navega hacia atrás en drill-down
	 */
	navigateBackInDrillDown(asideId: string): void {
		const currentAsides = [...this._openAsides()];
		const asideIndex = currentAsides.findIndex((a) => a.id === asideId);

		if (asideIndex === -1) return;

		const aside = currentAsides[asideIndex];

		if (aside.history.length === 0) return;

		// Restaurar contenido anterior
		const previousItems = aside.history.pop();
		if (previousItems) {
			aside.items = previousItems;
		}

		// Restaurar el label anterior
		const previousLabel = aside.historyLabels.pop();
		if (previousLabel !== undefined) {
			aside.parentItemLabel = previousLabel;
		}

		aside.isDrillDown = aside.history.length > 0;

		this._openAsides.set(currentAsides);
		this.saveNavigationState();
	}

	/**
	 * Cierra un aside específico
	 */
	closeAside(asideId: string): void {
		const currentAsides = this._openAsides();
		const updatedAsides = currentAsides.filter((a) => a.id !== asideId);
		this._openAsides.set(updatedAsides);
	}

	/**
	 * Cierra todos los asides
	 */
	closeAllAsides(): void {
		this._openAsides.set([]);
		this._currentPath.set([]);
	}

	/**
	 * Navega a una ruta específica
	 */
	private navigateToRoute(route: string): void {
		this._activeRoute.set(route);
		this.router.navigate([route]);
		this.saveNavigationState();
	}

	/**
	 * Actualiza el path activo de navegación
	 */
	private updateActivePath(item: MenuItem, level: number): void {
		const currentPath = this._currentPath();
		const newPath = [...currentPath.slice(0, level), item.label];
		this._currentPath.set(newPath);
	}

	/**
	 * Busca items en el menú y devuelve los resultados con su path completo
	 */
	searchMenuItems(query: string): { item: MenuItem; path: string[] }[] {
		if (!query.trim()) return [];

		const results: { item: MenuItem; path: string[] }[] = [];
		const searchTerm = query.toLowerCase();

		const searchRecursive = (items: MenuItem[], currentPath: string[]): void => {
			items.forEach((item) => {
				const newPath = [...currentPath, item.label];
				if (item.label.toLowerCase().includes(searchTerm)) {
					results.push({ item, path: newPath });
				}

				if (item.children) {
					searchRecursive(item.children, newPath);
				}
			});
		};

		searchRecursive(this.menuData, []);
		return results;
	}

	/**
	 * Encuentra un item por ID
	 */
	findItemById(id: string): MenuItem | null {
		const findRecursive = (items: MenuItem[]): MenuItem | null => {
			for (const item of items) {
				if (item.id === id) return item;
				if (item.children) {
					const found = findRecursive(item.children);
					if (found) return found;
				}
			}
			return null;
		};

		return findRecursive(this.menuData);
	}

	/**
	 * Obtiene el path completo de un item
	 */
	getItemPath(itemId: string): string[] {
		const path: string[] = [];

		const findPath = (items: MenuItem[], currentPath: string[]): boolean => {
			for (const item of items) {
				const newPath = [...currentPath, item.label];

				if (item.id === itemId) {
					path.push(...newPath);
					return true;
				}

				if (item.children && findPath(item.children, newPath)) {
					return true;
				}
			}
			return false;
		};

		findPath(this.menuData, []);
		return path;
	}

	/**
	 * Verifica si un item está activo
	 */
	isItemActive(item: MenuItem): boolean {
		const currentRoute = this._activeRoute();
		return item.route === currentRoute;
	}

	/**
	 * Checks if an item or any of its children is currently active
	 * Used for primary menu active state marking
	 */
	isItemOrChildActive(item: MenuItem): boolean {
		const currentRoute = this._activeRoute();

		// Check if this item is active
		if (item.route === currentRoute) {
			return true;
		}

		// Check if any child is active recursively
		if (item.children) {
			return this.hasActiveChild(item.children, currentRoute);
		}

		return false;
	}

	/**
	 * Recursively checks if any child item has the active route
	 */
	private hasActiveChild(items: MenuItem[], activeRoute: string): boolean {
		for (const child of items) {
			if (child.route === activeRoute) {
				return true;
			}
			if (child.children && this.hasActiveChild(child.children, activeRoute)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Limpia todo el estado de navegación
	 */
	resetNavigationState(): void {
		this.closeAllAsides();
		this._activeRoute.set('');
		this._currentPath.set([]);
		this.clearNavigationState();
	}

	/**
	 * Guarda el estado de navegación en localStorage
	 */
	private saveNavigationState(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			const state = {
				openAsides: this._openAsides(),
				currentPath: this._currentPath(),
				activeRoute: this._activeRoute()
			};
			localStorage.setItem('ng-hub-navigation-state', JSON.stringify(state));
		} catch (error) {
			console.warn('Could not save navigation state to localStorage:', error);
		}
	}

	/**
	 * Restaura el estado de navegación desde localStorage
	 */
	private restoreNavigationState(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			const savedState = localStorage.getItem('ng-hub-navigation-state');
			if (savedState) {
				const state = JSON.parse(savedState);

				// Only restore if the current route matches the saved active route
				if (state.activeRoute && this.router.url === state.activeRoute) {
					this._openAsides.set(state.openAsides || []);
					this._currentPath.set(state.currentPath || []);
					this._activeRoute.set(state.activeRoute || '');
				}
			}
		} catch (error) {
			console.warn('Could not restore navigation state from localStorage:', error);
		}
	}

	/**
	 * Limpia el estado guardado de navegación
	 */
	private clearNavigationState(): void {
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}

		try {
			localStorage.removeItem('ng-hub-navigation-state');
		} catch (error) {
			console.warn('Could not clear navigation state from localStorage:', error);
		}
	}

	/**
	 * Inicializa la navegación basada en la ruta actual
	 */
	initializeFromCurrentRoute(): void {
		const currentUrl = this.router.url;
		if (currentUrl && currentUrl !== '/') {
			this._activeRoute.set(currentUrl);

			// Find the item corresponding to the current route and build the navigation state
			const item = this.findItemByRoute(currentUrl);
			if (item) {
				this.openParentAsides(item);
				this.saveNavigationState();
			}
		}
	}

	/**
	 * Encuentra un item por su ruta
	 */
	private findItemByRoute(route: string): MenuItem | null {
		const findRecursive = (items: MenuItem[]): MenuItem | null => {
			for (const item of items) {
				if (item.route === route) {
					return item;
				}
				if (item.children) {
					const found = findRecursive(item.children);
					if (found) return found;
				}
			}
			return null;
		};

		return findRecursive(this.menuData);
	}

	/**
	 * Abre los asides padre necesarios para mostrar un item
	 */
	private openParentAsides(targetItem: MenuItem): void {
		const pathToItem = this.findPathToItem(targetItem.id);
		if (pathToItem.length > 1) {
			let currentLevel = 0;

			for (let i = 0; i < pathToItem.length - 1; i++) {
				const item = pathToItem[i];
				if (item.children && item.action === 'stack') {
					this.openStackedAside(item.children, item.id, currentLevel + 1);
					currentLevel++;
				}
			}

			// Update the current path
			const pathLabels = pathToItem.map((item) => item.label);
			this._currentPath.set(pathLabels);
		}
	}

	/**
	 * Encuentra el path completo de items hasta un item específico
	 */
	private findPathToItem(targetId: string): MenuItem[] {
		const findPath = (items: MenuItem[], currentPath: MenuItem[]): MenuItem[] | null => {
			for (const item of items) {
				const newPath = [...currentPath, item];

				if (item.id === targetId) {
					return newPath;
				}

				if (item.children) {
					const result = findPath(item.children, newPath);
					if (result) return result;
				}
			}
			return null;
		};

		return findPath(this.menuData, []) || [];
	}
}
