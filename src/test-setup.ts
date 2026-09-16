/**
 * Global test setup for the documentation app (Vitest + jsdom).
 *
 * jsdom does not implement `window.matchMedia`, which several components rely on
 * for responsive behaviour (e.g. the nav breakpoint listener). Provide a minimal
 * no-op stub so components can be rendered under test.
 */
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
	window.matchMedia = (query: string): MediaQueryList =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false
		}) as MediaQueryList;
}
