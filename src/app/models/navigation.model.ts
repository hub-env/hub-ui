export interface MenuItem {
	id: string;
	label: string;
	icon?: string;
	children?: MenuItem[];
	route?: string;
	action?: 'stack' | 'drill-down' | 'navigate';
	/** Optional short badge shown next to the label (e.g. "deprecated", "new"). */
	badge?: string;
}

export interface AsideData {
	id: string;
	level: number;
	items: MenuItem[];
	parentItemId?: string;
	parentItemLabel?: string;
	history: MenuItem[][];
	historyLabels: string[];
	animationState: 'entering' | 'active' | 'leaving';
	isDrillDown: boolean;
}

export interface NavigationState {
	primaryMenu: MenuItem[];
	openAsides: AsideData[];
	currentPath: string[];
	activeRoute: string;
}

export interface NavigationEvent {
	type: 'item-click' | 'aside-open' | 'aside-close' | 'drill-down' | 'drill-back';
	data: any;
	timestamp: number;
}

export interface SearchResult {
	label: string;
	path: string;
	icon?: string;
	route: string;
	item: MenuItem;
}
