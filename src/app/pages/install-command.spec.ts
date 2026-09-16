import { TestBed } from '@angular/core/testing';
import { Library } from '../../models/interfaces';
import { AvatarComponent } from './avatar/avatar.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MilestonesComponent } from './milestones/milestones.component';
import { ToastDocsComponent } from './toast/toast.component';

/**
 * The installer is published as `ng-hub-ui`; `ng-hub-ui-installer` has never existed on the
 * registry. A page that prints the second sends the reader to a 404 while they are being told
 * how to satisfy a peer dependency — the one moment the instruction has to work. Four pages
 * carried it, copied from one another, which is why this guard reads them together rather
 * than living in any one of their specs.
 */
describe('install command printed by the library pages', () => {
	const pages: ReadonlyArray<readonly [string, () => Library]> = [
		['avatar', () => TestBed.runInInjectionContext(() => new AvatarComponent()).avatarLibrary],
		['metrics', () => TestBed.runInInjectionContext(() => new MetricsComponent()).metricsLibrary],
		['milestones', () => TestBed.runInInjectionContext(() => new MilestonesComponent()).milestonesLibrary],
		['toast', () => TestBed.runInInjectionContext(() => new ToastDocsComponent()).toastLibrary]
	];

	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	/** Every piece of prose the page renders, flattened so a scan cannot miss a nested field. */
	function proseOf(library: Library): string[] {
		return library.overview.changelog.flatMap((entry) => entry.changes.map((change) => change.description));
	}

	for (const [name, read] of pages) {
		it(`names a package that exists on npm (${name})`, () => {
			const offending = proseOf(read()).filter((text) => text.includes('ng-hub-ui-installer'));

			expect(offending).toEqual([]);
		});

		it(`spells the installer command as "ng add ng-hub-ui" (${name})`, () => {
			const commands = proseOf(read()).filter((text) => text.includes('ng add '));

			expect(commands.length).toBeGreaterThan(0);
			for (const text of commands) {
				expect(text).toContain('ng add ng-hub-ui ');
			}
		});
	}
});
