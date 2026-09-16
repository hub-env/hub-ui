import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { TOAST_FUNCTIONALITIES } from './toast-functionalities';
import { TOAST_PLAYGROUND } from './toast-playground';
import { BasicToastExampleComponent } from '../examples/toast/basic-toast-example.component';
import { ConfigToastExampleComponent } from '../examples/toast/config-toast-example.component';
import { PositionToastExampleComponent } from '../examples/toast/position-toast-example.component';
import { PreventDuplicatesToastExampleComponent } from '../examples/toast/prevent-duplicates-toast-example.component';
import { MaxOpenedToastExampleComponent } from '../examples/toast/max-opened-toast-example.component';
import { LifecycleToastExampleComponent } from '../examples/toast/lifecycle-toast-example.component';
import { CssVariablesToastExampleComponent } from '../examples/toast/css-variables-toast-example.component';
import { MixinToastExampleComponent } from '../examples/toast/mixin-toast-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const TOAST_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'toast-basic': BasicToastExampleComponent,
	'toast-config': ConfigToastExampleComponent,
	'toast-position': PositionToastExampleComponent,
	'toast-prevent-duplicates': PreventDuplicatesToastExampleComponent,
	'toast-max-opened': MaxOpenedToastExampleComponent,
	'toast-lifecycle': LifecycleToastExampleComponent,
	'toast-css-variables': CssVariablesToastExampleComponent
};

/**
 * Main ng-hub-ui-toast library documentation page.
 */
@Component({
	selector: 'app-toast-docs',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page [library]="toastLibrary" [package]="'toast'" [playground]="playgroundConfigs"> </app-library-page>
	`
})
export class ToastDocsComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = TOAST_PLAYGROUND;

	/** Complete ng-hub-ui-toast library data. */
	toastLibrary: Library = {
		title: 'ng-hub-ui-toast',
		description:
			'Standalone Angular toast notification service built on Signals. Fire success, error, warning or info alerts imperatively with lifecycle observables, progress bars and full CSS-variable theming.',
		overview: {
			text: 'ng-hub-ui-toast is a toast library for Angular 21+ standalone applications whose only non-Angular peer is `ng-hub-ui-utils`, where `resolveHubAccent` lives. Call `HubToastService.success()`, `.error()`, `.warning()` or `.info()` from any component or service; the overlay container for a corner is lazily mounted the first time a toast asks for it, so each position keeps its own stack. Each call returns a `HubToastRef` with `onShown`, `onHidden` and `onTap` observables and the imperative `manualClose()` / `resetTimeout()` methods. Register defaults globally with `provideToast()` and override any option per-call. Every visual detail is controlled by `--hub-toast-*` CSS custom properties that cascade from the page stylesheet.',
			highlights: [
				{
					icon: 'fa-solid fa-bolt',
					title: 'Signal-driven stack',
					description:
						'The active-toast list is a `signal<HubToastData[]>` read by an OnPush container. The container is mounted outside the view tree, where signal notifications cannot reach it, so `HubToastService` runs its change detection explicitly after every stack mutation.'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'One container per position',
					description:
						'A `HubToastContainerComponent` is created and attached to `document.body` the first time a toast asks for that corner — nothing runs at app startup, and a notification opened in one corner leaves the ones already showing in another exactly where they were.'
				},
				{
					icon: 'fa-solid fa-sliders',
					title: 'Per-call config overrides',
					description:
						'Every option (timeOut, progressBar, positionClass…) can be set globally via `provideToast()` and overridden on each individual call.'
				},
				{
					icon: 'fa-solid fa-wave-square',
					title: 'Lifecycle observables',
					description:
						'`HubToastRef` surfaces `onShown`, `onHidden` and `onTap` RxJS observables plus `manualClose()` and `resetTimeout()` for full imperative control, and a `dropped` flag for the call the stack was too full to accept.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS variable theming',
					description:
						'Every colour, radius, shadow and dimension is a `--hub-toast-*` token; built-in types inherit from the DS `--hub-sys-color-*` family.'
				},
				{
					icon: 'fa-solid fa-arrows-down-to-line',
					title: 'Capacity & deduplication',
					description:
						'`maxOpened` caps the visible stack across every position and `autoDismiss` auto-removes the oldest; without it the call is dropped and its handle says so through `dropped`. `preventDuplicates` silences repeat messages.'
				}
			],
			changelog: [
				{
					version: '22.11.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING \u2014 the four exported classes are renamed with the Hub prefix: ToastService is now HubToastService, ToastConfigService is HubToastConfigService, ToastComponent is HubToastComponent and ToastContainerComponent is HubToastContainerComponent. ToastService is the name an application is most likely to give its own notification wrapper, so a library holding it holds something that was never the library\u2019s to hold. The types of this same package \u2014 HubToastConfig, HubToastRef, HubToastPosition \u2014 already carried the prefix, so the surface was being spelled two ways in one import list. All four old names stay exported as deprecated aliases resolving to the same classes, so injection and providers keep working unchanged, and they are removed in 23.0.0. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency, >=22.0.0. The stylesheet themes against --hub-sys-*, and the manifest never said so: nothing warned that a ng-hub-ui-ds older than the --hub-ref-* / --hub-sys-* architecture would leave the toast on its fallbacks, and a reader of the manifest had no way to learn that the token package is what turns the theme on.'
						},
						{
							type: 'fixed',
							description:
								'A toast now keeps its colour when ng-hub-ui-ds is not installed. The nine accent declarations, one per built-in type plus the danger mapping that error uses, read --hub-sys-color-<type> with no fallback, and they were the only --hub-sys-* reads in the sheet without one. Without the token package the read has nothing to resolve to, which makes the whole --hub-toast-accent declaration invalid at computed-value time rather than falling back to the neutral accent declared above it; --hub-toast-bg, --hub-toast-color and --hub-toast-border are all mixed from that slot, so background, color and border-color went unset together and a success toast arrived transparent and unbordered. Each type now names the Bootstrap-equivalent colour the rest of this family already uses as its fallback.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'A notification dropped at maxOpened no longer hands back a handle that never says anything. With the stack full and autoDismiss off the call is refused, and the handle returned was built over an empty object: its three lifecycle observables were undefined and each fell back to a brand-new Subject that nothing would ever complete or emit. Awaiting the close of that notification waited for the rest of the session, and nothing on the handle said the notification had not even been shown. The handle now closes at once: onHidden emits and completes, onShown and onTap complete without emitting, and manualClose() and resetTimeout() are no-ops.'
						},
						{
							type: 'added',
							description:
								'HubToastRef.dropped says whether the call opened a notification at all: true when it was refused because the stack was full, false on every handle that stands for a real toast. toastId stays -1 on a dropped handle, but that was never documented and reads as an implementation detail.'
						},
						{
							type: 'changed',
							description:
								'BREAKING (types) — HubToastRef gained a required dropped boolean. Only code that builds a HubToastRef by hand is affected, a test double or a fake service; everything that takes the handle from ToastService keeps compiling. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'A new notification no longer relocates the ones already on screen. There was a single container, and it took its position class from whichever toast happened to be first in the list, so a call with a different positionClass dragged every visible toast to the new corner, including the ones the user was in the middle of reading. Each position now has its own container, mounted the first time a toast asks for it, and a toast is only ever rendered by the container of its own corner. It is the arrangement ngx-toastr and react-toastify have used for years: one overlay per position, created on demand.'
						},
						{
							type: 'fixed',
							description:
								'A toast that has just opened is painted above the ones already there. With newestOnTop the newest toast is rendered first in the DOM, and a first sibling paints underneath the ones that follow it, so an arriving toast slid in beneath the shadows of its neighbours. Stacking now follows recency rather than DOM order.'
						},
						{
							type: 'changed',
							description:
								'BREAKING (markup) — the overlay is one container per position, not one container. Where document.body used to hold a single hub-toast-container whose class changed as toasts came and went, it now holds one element per position class actually used, each keeping its own corner for good. CSS or tests written around there being exactly one container, or around its class changing, need updating. See BREAKING_CHANGES.md.'
						},
						{
							type: 'added',
							description:
								'ToastContainerComponent takes a position input, the position class it owns and the only one whose toasts it renders. ToastService sets it on mount; it defaults to toast-top-right.'
						},
						{
							type: 'added',
							description:
								'The documentation says what maxOpened counts. The cap is on the whole stack, not on one corner of it, and autoDismiss therefore drops the oldest toast on screen even when that toast is in a different position. Behaviour is unchanged: it was simply impossible for a consumer to know which of the two it was.'
						}
					]
				},

				{
					version: '22.8.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'The accessible name of the close button is now a configuration option, closeButtonAriaLabel. The close glyph is decorative, so that name was the only thing a screen reader had to announce the single control of a toast, and it was the English literal Close, frozen in the template and unreachable from provideToast() or a per-call config. A library shipped to applications that are not in English cannot hardcode a user-facing string.'
						},
						{
							type: 'added',
							description:
								'A FUNCTIONALITIES.md file. Nine sibling libraries carry one and the repository checklist asks for it on every change; toast had none, so nothing recorded which parts of the API a reader of the docs can actually operate and which are only prose.'
						},
						{
							type: 'changed',
							description:
								'HubToastConfig now carries a required closeButtonAriaLabel. Only code that builds a full HubToastConfig literal by hand is affected: everything that goes through provideToast() or a per-call override keeps compiling. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'HubToastData now carries a required restartToken signal. The data object keeps its identity for the whole life of a toast, so nothing in it could tell the rendered component to start its countdown over, and this signal is that channel. Only code that builds a HubToastData literal by hand is affected, as BREAKING_CHANGES.md explains.'
						},
						{
							type: 'fixed',
							description:
								'A closing toast now completes its three lifecycle observables, not just onHidden. onShown and onTap were left open on a toast that no longer existed, so a consumer who subscribed without a takeUntil kept the subscription, and the toast data behind it, alive for the rest of the session, with no completion to hang a teardown on. Both remove() and clear() now close the whole lifecycle.'
						},
						{
							type: 'fixed',
							description:
								'The documentation no longer describes a library that does not exist. README.md and README.es.md sold the package as having zero external dependencies and listed only the two Angular peers, so anyone installing by hand rather than through ng add ng-hub-ui got a module-not-found on resolveHubAccent the first time a toast fired. They also gave --hub-toast-title-font-weight as a bare 600 when the code routes it through --hub-ref-font-weight-semibold, typed positionClass as HubToastPosition when it accepts any string, named four semantic types where the stylesheet maps nine, omitted the three derived accent roles, and documented two of the eight public exports. BREAKING_CHANGES.md was also missing the 22.3.0 rename of --hub-toast-container-z-index to --hub-toast-container-zindex, the one kind of change that file exists to announce, because a renamed custom property fails silently.'
						},
						{
							type: 'fixed',
							description:
								'HubToastRef.resetTimeout() restarts the auto-dismiss countdown, as its documentation always promised. It used to re-emit onShown$ and touch no timer state at all, so a caller who wanted to keep a toast on screen a while longer had no way to do it: the toast still vanished on its original schedule, and the spurious emission also broke the fires-once contract of onShown. A toast configured with disableTimeOut stays persistent, as before.'
						}
					]
				},
				{
					version: '22.7.2',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. Metadata only — nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.7.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The published package declared no licence. An absent license field reads legally as all rights reserved; the intent was always MIT, now stated in package.json and shipped in a LICENSE file.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'changed',
							description:
								'Replaced the deprecated Angular animation trigger with a native CSS enter animation that respects reduced-motion preferences.'
						},
						{
							type: 'removed',
							description:
								'Removed the @angular/animations peer dependency. The package is deprecated upstream and the library no longer needs it. Applications that installed it only for ng-hub-ui-toast can drop it; those using it elsewhere are unaffected.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-08-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Documentation links now point at the canonical localized URLs. The README linked to https://hubui.dev/<path> with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution now imports the canonical resolveHubAccent from ng-hub-ui-utils. The private copy under src/lib/shared/resolve-hub-accent.ts (used to resolve custom toast type accents) has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to var(--hub-sys-color-<name>, <name>), a literal colour passes through unchanged, an empty value yields null.'
						},
						{
							type: 'added',
							description:
								'NEW peer dependency: ng-hub-ui-utils >=22.7.0. Consumers must have ng-hub-ui-utils installed alongside this library (it is where resolveHubAccent lives). Users installing via ng add ng-hub-ui get it automatically; manual installs need npm i ng-hub-ui-utils.'
						}
					]
				},
				{
					version: '22.5.2',
					date: '2026-07-28',
					changes: [
						{
							type: 'fixed',
							description:
								'Toasts are announced to screen readers: role=alert/aria-live=assertive for error and warning, role=status/polite for the rest, with aria-atomic.'
						}
					]
				},
				{
					version: '22.5.1',
					date: '2026-07-09',
					changes: [
						{
							type: 'fixed',
							description:
								'NG0205: Injector has already been destroyed when a toast was raised just before teardown. The container is mounted from the .then() of a dynamic import(), which resolves on a later microtask; the mount now bails out when ApplicationRef.destroyed is set.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'Toast type accepts ANY colour. A custom type takes a registered accent name or a literal colour (#ff0000, rgb(...), oklch(...), a CSS named colour); the accent role family re-derives from it via color-mix. Built-in types are unchanged.'
						},
						{
							type: 'added',
							description:
								"ng-hub-ui-toast/styles root entry. A styles/index.scss forwards hub-toast-theme, so @use 'ng-hub-ui-toast/styles' as *; exposes the mixin from the package root."
						},
						{
							type: 'changed',
							description:
								"BREAKING (packaging) — SCSS ships at ng-hub-ui-toast/styles. The theming mixin now builds to dist/toast/styles/... (was dist/toast/src/lib/styles/...), so @use 'ng-hub-ui-toast/styles' resolves. Update any @use that reached into src/lib/styles."
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-02',
					changes: [
						{
							type: 'changed',
							description:
								'One derivation strategy — canonical accent slot. Every built-in data-type now re-bases only --hub-toast-accent; the role family (-subtle / -emphasis / -on) always recomputes locally from it, so a custom accent re-derives the whole family at runtime.'
						},
						{
							type: 'changed',
							description:
								'The local derivations were unified to the canonical design-system formulas: -subtle mixes the accent at 12% over --hub-sys-surface-page (was 14%) and -emphasis at 80% over --hub-sys-color-ink (was 72% over --hub-sys-text-primary). Built-in types render as before; custom-type tints shift very slightly.'
						},
						{
							type: 'fixed',
							description:
								'--hub-toast-shadow inline fallback aligned with the actual ds value of --hub-sys-shadow-md: 0 0.5rem 1rem rgba(0, 0, 0, 0.15). No change when the ds tokens are loaded.'
						},
						{
							type: 'changed',
							description:
								'Added docs/css-variables-reference.md — the complete CSS custom-property reference — and realigned the README CSS-variable tables with the code.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'added',
							description:
								'Open-set accent types. The built-in data-type map now also covers primary, secondary, neutral, light and dark alongside success / warning / info (and error→danger). Any other data-type keeps working with no recompile: define a single --hub-sys-color-<name>.'
						},
						{
							type: 'added',
							description:
								'New derived accent roles --hub-toast-accent-subtle, --hub-toast-accent-emphasis and --hub-toast-accent-on, mixed locally from the single --hub-toast-accent slot.'
						},
						{
							type: 'added',
							description:
								'The hub-toast-theme() mixin re-derives the accent role family whenever its $accent parameter is passed, so a brand accent on a custom selector recomputes -subtle / -emphasis / -on.'
						},
						{
							type: 'changed',
							description:
								'BREAKING — canonical zindex token name: --hub-toast-container-z-index → --hub-toast-container-zindex (no hyphen, matching the --hub-sys-zindex-* convention).'
						},
						{
							type: 'changed',
							description:
								'The accent role family and the progress-bar tint are now mixed in OKLCH instead of sRGB, for perceptually even tints across every accent. No token API change; tints shift very slightly.'
						}
					]
				},
				{
					version: '22.2.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii, theme-aware colours) routed through their --hub-sys-* / --hub-ref-* tokens.'
						},
						{
							type: 'fixed',
							description:
								'Toasts stack at the correct elevation: the container z-index resolves through --hub-sys-zindex-toast (1090) instead of a hardcoded 1050 (the modal-backdrop layer), so a toast can no longer be occluded by a modal backdrop.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description:
								'New hub-toast-theme() Sass mixin (styles/mixins/toast-theme) — re-skin a toast in one call: accent, surfaces, border/radius/shadow, spacing, typography, progress bar, close button and container tokens. Every parameter is optional, so only the ones passed are emitted.'
						},
						{
							type: 'added',
							description:
								"ng-package.json ships the styles/ directory as a package asset, so the mixin is importable from consumers via @use 'ng-hub-ui-toast/styles/mixins/toast-theme'."
						},
						{
							type: 'changed',
							description:
								'Toast accent is now a full 1px border in the semantic colour instead of a thick left stripe. Built-in types take the full-strength --hub-sys-color-* accent rather than the muted border-subtle token, so their borders are noticeably more saturated. Purely visual.'
						},
						{
							type: 'removed',
							description:
								'Removed the --hub-toast-accent-width token; the left accent stripe it sized no longer exists. The accent colour now drives the border and the progress bar through --hub-toast-accent.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-19',
					changes: [
						{
							type: 'changed',
							description:
								'Lowered the Angular peer dependency floor to `>=21.0.0`; the library now installs and runs in Angular 21 applications. No source or API changes.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'added',
							description:
								'Initial release: `ToastService` with `success()`, `error()`, `warning()`, `info()`, `show()`, `remove()`, `clear()`.'
						},
						{
							type: 'added',
							description:
								'`HubToastRef` with `onShown`, `onHidden`, `onTap` observables and `manualClose()` / `resetTimeout()`.'
						},
						{
							type: 'added',
							description: '`ToastComponent` with signal-based auto-dismiss timer, progress bar and close button.'
						},
						{ type: 'added', description: '`ToastContainerComponent` with six position classes.' },
						{
							type: 'added',
							description:
								'Accent system: `@each` loop for built-in types; `color-mix` open default for custom types.'
						},
						{ type: 'added', description: '`provideToast()` standalone provider function.' },
						{ type: 'added', description: 'Angular animations: slide-in from edge on enter, fade-out on dismiss.' }
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'data (hub-toast)',
					type: 'HubToastData',
					required: true,
					description: 'DOCS.TOAST.API.INPUT.DATA.DESCRIPTION'
				},
				{
					name: 'position (hub-toast-container)',
					type: 'HubToastPosition | string',
					required: false,
					defaultValue: "'toast-top-right'",
					description: 'DOCS.TOAST.API.INPUT.POSITION.DESCRIPTION'
				},
				{
					name: 'timeOut / extendedTimeOut (config)',
					type: 'number',
					required: false,
					defaultValue: '5000 / 2500',
					description: 'DOCS.TOAST.API.INPUT.TIME_OUT.DESCRIPTION'
				},
				{
					name: 'closeButton / progressBar (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'true / false',
					description: 'DOCS.TOAST.API.INPUT.CLOSE_BUTTON.DESCRIPTION'
				},
				{
					name: 'closeButtonAriaLabel (config)',
					type: 'string',
					required: false,
					defaultValue: "'Close'",
					description: 'DOCS.TOAST.API.INPUT.CLOSE_BUTTON_ARIA_LABEL.DESCRIPTION'
				},
				{
					name: 'tapToDismiss (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.TOAST.API.INPUT.TAP_TO_DISMISS.DESCRIPTION'
				},
				{
					name: 'disableTimeOut (config)',
					type: "boolean | 'timeOut' | 'extendedTimeOut'",
					required: false,
					defaultValue: 'false',
					description: 'DOCS.TOAST.API.INPUT.DISABLE_TIME_OUT.DESCRIPTION'
				},
				{
					name: 'newestOnTop (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.TOAST.API.INPUT.NEWEST_ON_TOP.DESCRIPTION'
				},
				{
					name: 'positionClass (config)',
					type: 'HubToastPosition | string',
					required: false,
					defaultValue: "'toast-top-right'",
					description: 'DOCS.TOAST.API.INPUT.POSITION_CLASS.DESCRIPTION'
				},
				{
					name: 'maxOpened (config)',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.TOAST.API.INPUT.MAX_OPENED.DESCRIPTION'
				},
				{
					name: 'autoDismiss (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.TOAST.API.INPUT.AUTO_DISMISS.DESCRIPTION'
				},
				{
					name: 'preventDuplicates (config)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.TOAST.API.INPUT.PREVENT_DUPLICATES.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'closed (hub-toast)',
					type: 'OutputEmitterRef<number>',
					required: false,
					description: 'DOCS.TOAST.API.OUTPUT.CLOSED.DESCRIPTION'
				}
			],
			methods: [
				{
					name: 'HubToastService.success',
					signature: 'success(message: string, title?: string, config?: Partial<HubToastConfig>): HubToastRef',
					description: 'DOCS.TOAST.API.METHOD.SUCCESS.DESCRIPTION',
					returns: 'HubToastRef handle for the toast, or a handle with dropped: true when the stack was full'
				},
				{
					name: 'HubToastService.error',
					signature: 'error(message: string, title?: string, config?: Partial<HubToastConfig>): HubToastRef',
					description: 'DOCS.TOAST.API.METHOD.ERROR.DESCRIPTION',
					returns: 'HubToastRef handle for the toast, or a handle with dropped: true when the stack was full'
				},
				{
					name: 'HubToastService.warning',
					signature: 'warning(message: string, title?: string, config?: Partial<HubToastConfig>): HubToastRef',
					description: 'DOCS.TOAST.API.METHOD.WARNING.DESCRIPTION',
					returns: 'HubToastRef handle for the toast, or a handle with dropped: true when the stack was full'
				},
				{
					name: 'HubToastService.info',
					signature: 'info(message: string, title?: string, config?: Partial<HubToastConfig>): HubToastRef',
					description: 'DOCS.TOAST.API.METHOD.INFO.DESCRIPTION',
					returns: 'HubToastRef handle for the toast, or a handle with dropped: true when the stack was full'
				},
				{
					name: 'HubToastService.show',
					signature:
						'show(message: string, title?: string, config?: Partial<HubToastConfig>, type?: HubToastType | string): HubToastRef',
					description: 'DOCS.TOAST.API.METHOD.SHOW.DESCRIPTION',
					returns: 'HubToastRef handle for the toast, or a handle with dropped: true when the stack was full'
				},
				{
					name: 'HubToastService.remove',
					signature: 'remove(toastId: number): void',
					description: 'DOCS.TOAST.API.METHOD.REMOVE.DESCRIPTION',
					returns: 'void'
				},
				{
					name: 'HubToastService.clear',
					signature: 'clear(): void',
					description: 'DOCS.TOAST.API.METHOD.CLEAR.DESCRIPTION',
					returns: 'void'
				}
			],
			templates: [],
			cssVariables: MD_CSS_VARIABLES['toast'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['toast'],
			demos: [
				{
					title: 'Theming with hub-toast-theme',
					previewComponent: MixinToastExampleComponent,
					code: `@use 'ng-hub-ui-toast/styles' as *;

// Toasts render in a global overlay, so theme the shared shell (or a
// custom semantic type) globally. This types a "brand" toast fired via
// toast.show(msg, title, {}, 'brand'):
hub-toast[data-type='brand'] {
	@include hub-toast-theme(
		$accent: #6f42c1,
		$bg: #f5f0fb,
		$color: #4a2c82,
		$border-radius: 0.75rem,
		$shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18)
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities section of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every toast example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'toast-basic',
				title: 'DOCS.TOAST.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicToastExampleComponent',
				files: ['basic-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/basic-toast-example.component').then((m) => m.BasicToastExampleComponent)
			},
			{
				id: 'toast-config',
				title: 'DOCS.TOAST.EXAMPLE.CONFIG.TITLE',
				componentName: 'ConfigToastExampleComponent',
				files: ['config-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/config-toast-example.component').then((m) => m.ConfigToastExampleComponent)
			},
			{
				id: 'toast-position',
				title: 'DOCS.TOAST.EXAMPLE.POSITION.TITLE',
				componentName: 'PositionToastExampleComponent',
				files: ['position-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/position-toast-example.component').then((m) => m.PositionToastExampleComponent)
			},
			{
				id: 'toast-prevent-duplicates',
				title: 'DOCS.TOAST.EXAMPLE.PREVENT_DUPLICATES.TITLE',
				componentName: 'PreventDuplicatesToastExampleComponent',
				files: ['prevent-duplicates-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/prevent-duplicates-toast-example.component').then(
						(m) => m.PreventDuplicatesToastExampleComponent
					)
			},
			{
				id: 'toast-max-opened',
				title: 'DOCS.TOAST.EXAMPLE.MAX_OPENED.TITLE',
				componentName: 'MaxOpenedToastExampleComponent',
				files: ['max-opened-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/max-opened-toast-example.component').then((m) => m.MaxOpenedToastExampleComponent)
			},
			{
				id: 'toast-lifecycle',
				title: 'DOCS.TOAST.EXAMPLE.LIFECYCLE.TITLE',
				componentName: 'LifecycleToastExampleComponent',
				files: ['lifecycle-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/lifecycle-toast-example.component').then((m) => m.LifecycleToastExampleComponent)
			},
			{
				id: 'toast-css-variables',
				title: 'DOCS.TOAST.EXAMPLE.CSS_VARIABLES.TITLE',
				componentName: 'CssVariablesToastExampleComponent',
				files: ['css-variables-toast-example.component.ts'],
				loader: () =>
					import('../examples/toast/css-variables-toast-example.component').then(
						(m) => m.CssVariablesToastExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'toast'
			});
		});
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview
	 * component so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		const registry = this._exampleRegistry;

		this.toastLibrary.functionalities = TOAST_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const regItem = registry.get(id);
					if (!regItem) return null;
					return {
						title: regItem.title,
						description: regItem.title,
						import: '',
						template: '',
						component: '',
						id: regItem.id,
						previewComponent: TOAST_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
