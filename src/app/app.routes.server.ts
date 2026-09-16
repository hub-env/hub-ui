import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server route configuration used by Angular prerender.
 *
 * Every discovered route is prerendered. The former client-only carve-outs are
 * gone: library `examples` tabs prerender fine (they lazy-load their demos in
 * the browser), and the parameterized standalone example routes were removed
 * with the orphaned `/examples/**` tree. Unknown URLs are handled by the
 * `NotFoundComponent` catch-all, which ships `noindex` metadata.
 */
export const serverRoutes: ServerRoute[] = [
	{
		path: '**',
		renderMode: RenderMode.Prerender
	}
];
