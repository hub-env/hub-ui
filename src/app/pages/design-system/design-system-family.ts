/**
 * One row of the family gallery: a library of the ecosystem and whether it already
 * reads `--hub-sys-*` (so it re-themes with the design-system) or is still pending.
 */
export interface DsFamilyLibrary {
	/** Folder under `projects/`, which is also its docs route segment. */
	name: string;
	/** True once the library consumes the semantic tokens. */
	wired: boolean;
}

/**
 * The gallery's data, kept next to the component so a spec can hold it against
 * `projects/`: the page claims a token-integration status for the whole family, and
 * a row that goes stale — a library missing, or marked pending after it was wired —
 * tells the reader the opposite of what the code does.
 */
export const DS_FAMILY_LIBRARIES: DsFamilyLibrary[] = [
	{ name: 'action-sheet', wired: true },
	{ name: 'avatar', wired: true },
	{ name: 'badges', wired: true },
	{ name: 'board', wired: true },
	{ name: 'breadcrumbs', wired: true },
	{ name: 'buttons', wired: true },
	{ name: 'calendar', wired: true },
	{ name: 'forms', wired: true },
	{ name: 'history', wired: false },
	{ name: 'icons', wired: true },
	{ name: 'loading', wired: true },
	{ name: 'metrics', wired: true },
	{ name: 'milestones', wired: true },
	{ name: 'modal', wired: true },
	{ name: 'nav', wired: true },
	{ name: 'paginable', wired: true },
	{ name: 'panels', wired: true },
	{ name: 'portal', wired: false },
	{ name: 'signature', wired: true },
	{ name: 'skeleton', wired: false },
	{ name: 'sortable', wired: false },
	{ name: 'stepper', wired: true },
	{ name: 'toast', wired: true },
	{ name: 'utils', wired: true }
];
