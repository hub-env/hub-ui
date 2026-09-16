import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { AVATAR_PLAYGROUND } from './avatar-playground';
import { AVATAR_FUNCTIONALITIES } from './avatar-functionalities';
import { AvatarFacebookExampleComponent } from '../examples/avatar/avatar-facebook-example.component';
import { AvatarGravatarExampleComponent } from '../examples/avatar/avatar-gravatar-example.component';
import { AvatarGithubExampleComponent } from '../examples/avatar/avatar-github-example.component';
import { AvatarCustomImageExampleComponent } from '../examples/avatar/avatar-custom-image-example.component';
import { AvatarInitialsExampleComponent } from '../examples/avatar/avatar-initials-example.component';
import { AvatarValueExampleComponent } from '../examples/avatar/avatar-value-example.component';
import { AvatarFallbackExampleComponent } from '../examples/avatar/avatar-fallback-example.component';
import { AvatarSizeExampleComponent } from '../examples/avatar/avatar-size-example.component';
import { AvatarTextRatioExampleComponent } from '../examples/avatar/avatar-text-ratio-example.component';
import { AvatarInitialsSizeExampleComponent } from '../examples/avatar/avatar-initials-size-example.component';
import { AvatarRoundExampleComponent } from '../examples/avatar/avatar-round-example.component';
import { AvatarCornerRadiusExampleComponent } from '../examples/avatar/avatar-corner-radius-example.component';
import { AvatarColorsExampleComponent } from '../examples/avatar/avatar-colors-example.component';
import { AvatarBorderExampleComponent } from '../examples/avatar/avatar-border-example.component';
import { AvatarCustomStyleExampleComponent } from '../examples/avatar/avatar-custom-style-example.component';
import { AvatarClickExampleComponent } from '../examples/avatar/avatar-click-example.component';
import { AvatarGroupExampleComponent } from '../examples/avatar/avatar-group-example.component';
import { AvatarStatusExampleComponent } from '../examples/avatar/avatar-status-example.component';
import { AvatarCustomContentExampleComponent } from '../examples/avatar/avatar-custom-content-example.component';
import { MixinAvatarExampleComponent } from '../examples/avatar/mixin-avatar-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const AVATAR_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'avatar-facebook': AvatarFacebookExampleComponent,
	'avatar-gravatar': AvatarGravatarExampleComponent,
	'avatar-github': AvatarGithubExampleComponent,
	'avatar-custom-image': AvatarCustomImageExampleComponent,
	'avatar-initials': AvatarInitialsExampleComponent,
	'avatar-value': AvatarValueExampleComponent,
	'avatar-fallback': AvatarFallbackExampleComponent,
	'avatar-size': AvatarSizeExampleComponent,
	'avatar-text-ratio': AvatarTextRatioExampleComponent,
	'avatar-initials-size': AvatarInitialsSizeExampleComponent,
	'avatar-round': AvatarRoundExampleComponent,
	'avatar-corner-radius': AvatarCornerRadiusExampleComponent,
	'avatar-colors': AvatarColorsExampleComponent,
	'avatar-border': AvatarBorderExampleComponent,
	'avatar-custom-style': AvatarCustomStyleExampleComponent,
	'avatar-click': AvatarClickExampleComponent,
	'avatar-group': AvatarGroupExampleComponent,
	'avatar-status': AvatarStatusExampleComponent,
	'avatar-custom-content': AvatarCustomContentExampleComponent
};

/**
 * Main avatar library page component that displays comprehensive documentation
 * using the shared LibraryPageComponent with overview, API, and examples routes.
 */
@Component({
	selector: 'app-avatar',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="avatarLibrary"
			[package]="'avatar'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		>
		</app-library-page>
	`
})
export class AvatarComponent implements OnInit {
	protected readonly exampleGroups = AVATAR_FUNCTIONALITIES;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = AVATAR_PLAYGROUND;

	/**
	 * Complete avatar library data.
	 */
	avatarLibrary: Library = {
		title: 'ng-hub-ui-avatar',
		description:
			'Universal avatar component that generates avatars from multiple sources with intelligent fallback system. Supports images, social media profiles, and initials with customizable styling.',
		overview: {
			text: 'The Avatar component provides a flexible and robust solution for displaying user profile images across Angular applications. Built with modern Angular Signals architecture, it implements an intelligent fallback system that gracefully handles failed image loads through multiple avatar sources. From social media profile pictures to automatically generated initials, the component ensures users always see a meaningful representation.',
			highlights: [
				{
					icon: 'fa-solid fa-image',
					title: 'Smart Image Fallback',
					description:
						'A picture that fails to load hands over to the next source in the configured chain, ending in the initials or the plain value, so a dead URL never leaves a broken image on screen.'
				},
				{
					icon: 'fa-solid fa-font',
					title: 'Initials Auto-Generation',
					description:
						'Derives initials from any name string so you always have a meaningful, human-readable fallback without extra code.'
				},
				{
					icon: 'fa-solid fa-circle-dot',
					title: 'Corner Badge (dot & count)',
					description:
						'A semantic-coloured corner badge — a presence dot or a labelled count — plus matching coloured-avatar variants, all driven by the design-system palette.'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'Avatar Group Stacking',
					description:
						'Overlap several avatars into a stacked group for team and user-list UIs, with the overlap and the ring around each avatar driven by the --hub-avatar-group-* tokens.'
				},
				{
					icon: 'fa-solid fa-ruler-combined',
					title: 'One Size Input Drives Everything',
					description:
						'Pass any pixel value to size and the picture, the initials font size, the badge and the group overlap all scale from it, with no layout left to patch by hand.'
				},
				{
					icon: 'fa-solid fa-shapes',
					title: 'Circle, Square & Rounded Shapes',
					description:
						'Switch between round, square and rounded-corner avatars with the round and cornerRadius inputs — no custom CSS required.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Background, border, radius, typography, badge and group ring are all driven by --hub-avatar-* custom properties, re-based from a single accent slot for instant brand alignment.'
				}
			],
			changelog: [
				{
					version: '22.12.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								"The two exported classes carry the Hub prefix: HubAvatarComponent and HubAvatarService. A bare AvatarComponent is a name in the consumer's own namespace, not in ours, and an application with users tends to grow an avatar component of its own; the day it does, the two collide in whichever file imports both, and the only way out is an import alias on our side of the line for a name we never had the right to take. Every other class in this family is already prefixed. Nothing about the components changed: same selector, same inputs, same behaviour, same injectable. AvatarModule keeps its name on purpose, because it is already announced for removal in 23.0.0."
						},
						{
							type: 'deprecated',
							description:
								'AvatarComponent and AvatarService are now deprecated aliases, kept so nothing breaks today and removed in 23.0.0. Each is a re-export of the prefixed class, so a codebase importing the old name keeps compiling and keeps getting the very same class, which is pinned by a test rather than promised in prose. See BREAKING_CHANGES.md.'
						},
						{
							type: 'added',
							description:
								"A test reads the exported surface back from the compiled module and fails on any class that ships without the Hub prefix, save the two aliases and AvatarModule. A naming rule nothing enforces is one class away from being false: the next export lands unprefixed and nobody notices until a consumer's own AvatarComponent collides with it."
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). The avatar colours and radii resolve through the family --hub-sys-* / --hub-ref-* ladder and the manifest said nothing about it, so a consumer reading the package on npm could not tell which package supplies them. It stays optional: every token ends in a literal fallback.'
						}
					]
				},
				{
					version: '22.11.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'deprecated',
							description:
								'The AvatarModule deprecation now names the release that removes it: 23.0.0. "A future major version" told a reader nothing they could plan against, because in this ecosystem the major tracks Angular\'s and is not an API decision anyone can anticipate. 23.0.0 is the release that moves this library to Angular 23, and it is the same release the modules of ng-hub-ui-modal, -portal, -calendar, -skeleton, -stepper and -breadcrumbs are removed in. AvatarModule.forRoot() goes with the module. Nothing changes at runtime and nothing is removed yet: both keep working exactly as before, and the migration — AvatarComponent plus provideAvatar() — is written out in BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'added',
							description:
								'placeholder finally paints something. The input had been declared since the component was written and nothing read it, so an avatar with no source and no initials rendered an empty circle while both READMEs listed the input as reserved. It now holds the picture of last resort: shown only while nothing else is — no source resolved, none declared, or one still loading — and never as part of the fallback chain, so it cannot outrank the initials the way handing the same URL to src would. A placeholder that itself fails to load is dropped rather than retried.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'Source is part of the public API. The interface that types the clickOnAvatar payload lived only inside the package, so nobody could name the type of their own handler: the choice was any or a hand-copied duplicate that drifts the moment the real one changes. It is a type, so re-exporting it from the entry point costs nothing at runtime.'
						},
						{
							type: 'changed',
							description:
								'clickOnAvatar emits Source | null, not Source. The payload was read from a cursor into the fallback list, and that cursor legitimately sits outside it: at -1 until something resolves (an avatar drawn from projected content alone never leaves it) and past the last entry once every source has failed. Clicking in either state handed the consumer undefined through an output that promised a Source, so a handler reading $event.sourceType threw. The absence is now declared instead of leaked and the click still fires; a handler typed (source: Source) has to widen. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'The hub-avatar component runs on OnPush. It was the last component in the family still checked on every tick of the application, so a consumer who put an avatar inside an OnPush tree paid for that check and got nothing from it. What the template reads is derived from the inputs, so it marks the view on its own, which is what made the strategy safe to switch.'
						},
						{
							type: 'changed',
							description:
								'The avatar is derived from its inputs instead of patched from SimpleChanges. The fallback chain was rebuilt by hand in ngOnChanges, one entry added or removed per changed property, and everything it produced (the resolved picture, the initials, their inline styles) was parked in mutable fields. The chain is a function of the source inputs, so it is computed from them now; the cursor that walks it is linked to it, and what gets painted derives from wherever that cursor sits. The ChangeDetectorRef went with it, because the template reads signals and those mark the view on their own, and dependencies now arrive through inject(). The render state the component used to expose as public fields is now internal. See BREAKING_CHANGES.md.'
						},
						{
							type: 'fixed',
							description:
								'Clearing the last source input now clears the avatar. Unsetting name (or src, or any other source) dropped the source from the fallback chain and stopped there: with nothing left to resolve, nothing repainted, and the initials or the picture of the value that had just been removed stayed on screen until some other source arrived. A list rendering avatars for a selection would keep showing the person who had just been deselected.'
						},
						{
							type: 'fixed',
							description:
								'The avatar image is named after the person, not after the URL it came from. The alt fell back to the resolved source, so a Gravatar, Facebook or custom picture without an explicit alt made a screen reader read the whole address aloud, and an image resolved asynchronously (GitHub) shipped with no alt at all or with the address a previous source had left behind. The accessible name now comes from alt when given, from name otherwise, and stays empty when there is neither, because an avatar nobody named is decorative and silence beats a URL.'
						},
						{
							type: 'fixed',
							description:
								"The manifest now exports the stylesheet paths the documentation teaches. The tarball has always carried styles/index.scss and styles/mixins/_avatar-theme.scss, but the generated exports map listed only the package entry point, so anything under styles/ was formally private. The Angular CLI happens not to notice, since its Sass integration falls back to resolving the package root and joins the rest of the path by hand, yet every resolver that honours the map (webpack's sass-loader, dart-sass's pkg: importer) refuses @use 'ng-hub-ui-avatar/styles' outright. Declaring ./styles and ./styles/mixins/avatar-theme makes the published surface match what the README, the docs page and BREAKING_CHANGES.md tell consumers to write, and aligns the package with ng-hub-ui-ds, which already lists its stylesheet subpaths. Packaging metadata only, with no code, no types and no styles change."
						}
					]
				},
				{
					version: '22.9.3',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. It is the link a registry shows beside the package and the one a reader clicks from it, and landing on a front page they then have to search is a worse answer than landing on the reference for the package they were already looking at. Metadata only — no code, no types, no styles change, and nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.9.2',
					date: '2026-08-18',
					changes: [
						{
							type: 'changed',
							description:
								"The README now says what the remote sources cost. Gravatar, GitHub and Facebook were documented as sources resolved over HTTP, which stops one sentence short of the part a consumer has to decide on: those requests leave the visitor's browser, so the third party sees their IP address, and Gravatar also receives a hash of the email address passed to it — enough to correlate a person across every site using it. Nothing changed in the code; the alternative — custom image, initials or text — never leaves your own origin."
						}
					]
				},
				{
					version: '22.9.1',
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
					version: '22.9.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution now imports the canonical resolveHubAccent from ng-hub-ui-utils. The private copy under src/lib/shared/resolve-hub-accent.ts has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to var(--hub-sys-color-<name>, <name>), a literal colour passes through unchanged, an empty value yields null.'
						},
						{
							type: 'added',
							description:
								'NEW peer dependency: ng-hub-ui-utils >=22.7.0. Consumers must have ng-hub-ui-utils installed alongside this library (it is where resolveHubAccent lives). Users installing via ng add ng-hub-ui get it automatically; manual installs need npm i ng-hub-ui-utils.'
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'interactive input: exposes role=button, focusability and Enter/Space activation for avatars that bind (clickOnAvatar) — the click target used to be mouse-only.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging): the SCSS ships at ng-hub-ui-avatar/styles. The theming mixin now builds to dist/avatar/styles/... instead of dist/avatar/src/lib/styles/..., so @use 'ng-hub-ui-avatar/styles' resolves; any @use that reached into src/lib/styles has to be updated."
						},
						{
							type: 'changed',
							description:
								'badgeColor accepts ANY colour. On top of the built-in semantic accents it now takes a registered custom accent and a literal colour (#ff0000, rgb(), oklch(), a CSS named colour): a bareword becomes var(--hub-sys-color-<name>, <name>), a literal is used as is. The single --hub-avatar-accent slot derives the rest of the family, so the built-in colours are unchanged.'
						},
						{
							type: 'changed',
							description:
								'Internal: host bindings moved from the @HostBinding / @HostListener decorators to the host metadata object, as the Angular style guide prescribes. No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								'autoColor input — set [autoColor]="false" on an initials avatar to suppress the inline hash background so it can be themed via the --hub-avatar-bg-color CSS variable (no !important). Defaults to true; an explicit bgColor still wins.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'added',
							description:
								'Standalone AvatarComponent — import it directly (no NgModule) and configure with the new provideAvatar() environment provider.'
						},
						{
							type: 'deprecated',
							description:
								'AvatarModule / AvatarModule.forRoot() — kept for backward compatibility (now re-exporting the standalone component); use AvatarComponent + provideAvatar() instead. Removed in 23.0.0.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING: the presence-only status input is replaced by a general badge overlay. badge (bare) or [badge]="true" renders a dot, badge="4k" a labelled pill, null or absent nothing; the colour comes from the semantic badgeColor input, so presence is expressed through it (online → success, away → warning, busy → danger, offline → secondary). HubAvatarStatus is renamed HubAvatarBadgeColor and the --hub-avatar-status-* tokens --hub-avatar-badge-*. See BREAKING_CHANGES.md.'
						},
						{
							type: 'added',
							description:
								'Semantic colour variants for the avatar and its badge, generated in one loop: a coloured-circle avatar per semantic colour (class="hub-avatar--success") and the matching badgeColor. The hub-avatar-color-variants($colors) mixin emits both in your own CSS, for the eight semantic colours or for your own map.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [],
			outputs: [],
			templates: [],
			cssVariables: MD_CSS_VARIABLES['avatar'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['avatar'],
			demos: [
				{
					title: 'Theming with hub-avatar-theme',
					previewComponent: MixinAvatarExampleComponent,
					code: `@use 'ng-hub-ui-avatar/styles' as avatar;

.avatar-mixin-scope {
	@include avatar.hub-avatar-theme(
		$bg: #ede9fe,
		$fg: #5b21b6,
		$border-radius: 0.75rem,
		$badge-color: #f43f5e
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the
	 * functionalities and API sections of the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
		this.populateApi();
	}

	/**
	 * Registers every avatar example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			// Sources
			{
				id: 'avatar-facebook',
				title: 'DOCS.AVATAR.EXAMPLE.FACEBOOK.TITLE',
				componentName: 'AvatarFacebookExampleComponent',
				files: ['avatar-facebook-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-facebook-example.component').then((m) => m.AvatarFacebookExampleComponent)
			},
			{
				id: 'avatar-gravatar',
				title: 'DOCS.AVATAR.EXAMPLE.GRAVATAR.TITLE',
				componentName: 'AvatarGravatarExampleComponent',
				files: ['avatar-gravatar-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-gravatar-example.component').then((m) => m.AvatarGravatarExampleComponent)
			},
			{
				id: 'avatar-github',
				title: 'DOCS.AVATAR.EXAMPLE.GITHUB.TITLE',
				componentName: 'AvatarGithubExampleComponent',
				files: ['avatar-github-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-github-example.component').then((m) => m.AvatarGithubExampleComponent)
			},
			{
				id: 'avatar-custom-image',
				title: 'DOCS.AVATAR.EXAMPLE.CUSTOM_IMAGE.TITLE',
				componentName: 'AvatarCustomImageExampleComponent',
				files: ['avatar-custom-image-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-custom-image-example.component').then(
						(m) => m.AvatarCustomImageExampleComponent
					)
			},
			{
				id: 'avatar-initials',
				title: 'DOCS.AVATAR.EXAMPLE.INITIALS.TITLE',
				componentName: 'AvatarInitialsExampleComponent',
				files: ['avatar-initials-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-initials-example.component').then((m) => m.AvatarInitialsExampleComponent)
			},
			{
				id: 'avatar-value',
				title: 'DOCS.AVATAR.EXAMPLE.VALUE.TITLE',
				componentName: 'AvatarValueExampleComponent',
				files: ['avatar-value-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-value-example.component').then((m) => m.AvatarValueExampleComponent)
			},
			// Fallback
			{
				id: 'avatar-fallback',
				title: 'DOCS.AVATAR.EXAMPLE.FALLBACK.TITLE',
				componentName: 'AvatarFallbackExampleComponent',
				files: ['avatar-fallback-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-fallback-example.component').then((m) => m.AvatarFallbackExampleComponent)
			},
			// Sizing
			{
				id: 'avatar-size',
				title: 'DOCS.AVATAR.EXAMPLE.SIZE.TITLE',
				componentName: 'AvatarSizeExampleComponent',
				files: ['avatar-size-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-size-example.component').then((m) => m.AvatarSizeExampleComponent)
			},
			{
				id: 'avatar-text-ratio',
				title: 'DOCS.AVATAR.EXAMPLE.TEXT_RATIO.TITLE',
				componentName: 'AvatarTextRatioExampleComponent',
				files: ['avatar-text-ratio-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-text-ratio-example.component').then(
						(m) => m.AvatarTextRatioExampleComponent
					)
			},
			{
				id: 'avatar-initials-size',
				title: 'DOCS.AVATAR.EXAMPLE.INITIALS_SIZE.TITLE',
				componentName: 'AvatarInitialsSizeExampleComponent',
				files: ['avatar-initials-size-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-initials-size-example.component').then(
						(m) => m.AvatarInitialsSizeExampleComponent
					)
			},
			// Styling
			{
				id: 'avatar-round',
				title: 'DOCS.AVATAR.EXAMPLE.ROUND.TITLE',
				componentName: 'AvatarRoundExampleComponent',
				files: ['avatar-round-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-round-example.component').then((m) => m.AvatarRoundExampleComponent)
			},
			{
				id: 'avatar-corner-radius',
				title: 'DOCS.AVATAR.EXAMPLE.CORNER_RADIUS.TITLE',
				componentName: 'AvatarCornerRadiusExampleComponent',
				files: ['avatar-corner-radius-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-corner-radius-example.component').then(
						(m) => m.AvatarCornerRadiusExampleComponent
					)
			},
			{
				id: 'avatar-colors',
				title: 'DOCS.AVATAR.EXAMPLE.COLORS.TITLE',
				componentName: 'AvatarColorsExampleComponent',
				files: ['avatar-colors-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-colors-example.component').then((m) => m.AvatarColorsExampleComponent)
			},
			{
				id: 'avatar-border',
				title: 'DOCS.AVATAR.EXAMPLE.BORDER.TITLE',
				componentName: 'AvatarBorderExampleComponent',
				files: ['avatar-border-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-border-example.component').then((m) => m.AvatarBorderExampleComponent)
			},
			{
				id: 'avatar-custom-style',
				title: 'DOCS.AVATAR.EXAMPLE.CUSTOM_STYLE.TITLE',
				componentName: 'AvatarCustomStyleExampleComponent',
				files: ['avatar-custom-style-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-custom-style-example.component').then(
						(m) => m.AvatarCustomStyleExampleComponent
					)
			},
			// Interactivity
			{
				id: 'avatar-click',
				title: 'DOCS.AVATAR.EXAMPLE.CLICK.TITLE',
				componentName: 'AvatarClickExampleComponent',
				files: ['avatar-click-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-click-example.component').then((m) => m.AvatarClickExampleComponent)
			},
			// Group & Status
			{
				id: 'avatar-group',
				title: 'DOCS.AVATAR.EXAMPLE.GROUP.TITLE',
				componentName: 'AvatarGroupExampleComponent',
				files: ['avatar-group-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-group-example.component').then((m) => m.AvatarGroupExampleComponent)
			},
			{
				id: 'avatar-status',
				title: 'DOCS.AVATAR.EXAMPLE.STATUS.TITLE',
				componentName: 'AvatarStatusExampleComponent',
				files: ['avatar-status-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-status-example.component').then((m) => m.AvatarStatusExampleComponent)
			},
			// Custom content
			{
				id: 'avatar-custom-content',
				title: 'DOCS.AVATAR.EXAMPLE.CUSTOM_CONTENT.TITLE',
				componentName: 'AvatarCustomContentExampleComponent',
				files: ['avatar-custom-content-example.component.ts'],
				loader: () =>
					import('../examples/avatar/avatar-custom-content-example.component').then(
						(m) => m.AvatarCustomContentExampleComponent
					)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'avatar'
			});
		});
	}

	/**
	 * Populates the grouped feature data used by the overview and examples views.
	 * Each example is wired with a `previewComponent` so the Overview "Feature guides"
	 * section can render a live preview instead of the unavailable-preview fallback.
	 */
	private populateFunctionalities(): void {
		this.avatarLibrary.functionalities = AVATAR_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const item = this._exampleRegistry.get(id);
					if (!item) return null;
					return {
						title: item.title,
						description: item.title,
						import: '',
						template: '',
						component: '',
						id: item.id,
						previewComponent: AVATAR_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}

	/**
	 * Populates the API section with inputs, outputs, and templates
	 */
	private populateApi(): void {
		this.avatarLibrary.api.inputs = [
			{
				name: 'size',
				type: 'string | number',
				required: false,
				defaultValue: '50',
				description: 'DOCS.AVATAR.API.INPUT.SIZE.DESCRIPTION'
			},
			{
				name: 'name',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.NAME.DESCRIPTION'
			},
			{
				name: 'src',
				type: 'string | SafeUrl',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.SRC.DESCRIPTION'
			},
			{
				name: 'alt',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.ALT.DESCRIPTION'
			},
			{
				name: 'round',
				type: 'boolean',
				required: false,
				defaultValue: 'true',
				description: 'DOCS.AVATAR.API.INPUT.ROUND.DESCRIPTION'
			},
			{
				name: 'interactive',
				type: 'boolean',
				required: false,
				defaultValue: 'false',
				description: 'DOCS.AVATAR.API.INPUT.INTERACTIVE.DESCRIPTION'
			},
			{
				name: 'bgColor',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.BG_COLOR.DESCRIPTION'
			},
			{
				name: 'autoColor',
				type: 'boolean',
				required: false,
				defaultValue: 'true',
				description: 'DOCS.AVATAR.API.INPUT.AUTO_COLOR.DESCRIPTION'
			},
			{
				name: 'fgColor',
				type: 'string',
				required: false,
				defaultValue: '#FFF',
				description: 'DOCS.AVATAR.API.INPUT.FG_COLOR.DESCRIPTION'
			},
			{
				name: 'borderColor',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.BORDER_COLOR.DESCRIPTION'
			},
			{
				name: 'cornerRadius',
				type: 'string | number',
				required: false,
				defaultValue: '0',
				description: 'DOCS.AVATAR.API.INPUT.CORNER_RADIUS.DESCRIPTION'
			},
			{
				name: 'textSizeRatio',
				type: 'number',
				required: false,
				defaultValue: '3',
				description: 'DOCS.AVATAR.API.INPUT.TEXT_SIZE_RATIO.DESCRIPTION'
			},
			{
				name: 'initialsSize',
				type: 'string | number',
				required: false,
				defaultValue: '0',
				description: 'DOCS.AVATAR.API.INPUT.INITIALS_SIZE.DESCRIPTION'
			},
			{
				name: 'facebookId',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.FACEBOOK_ID.DESCRIPTION'
			},
			{
				name: 'githubId',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.GITHUB_ID.DESCRIPTION'
			},
			{
				name: 'gravatarId',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.GRAVATAR_ID.DESCRIPTION'
			},
			{
				name: 'value',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.VALUE.DESCRIPTION'
			},
			{
				name: 'style',
				type: 'Record<string, string | number | null | undefined> | string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.STYLE.DESCRIPTION'
			},
			{
				name: 'referrerpolicy',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.REFERRERPOLICY.DESCRIPTION'
			},
			{
				name: 'placeholder',
				type: 'string',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.PLACEHOLDER.DESCRIPTION'
			},
			{
				name: 'badge',
				type: 'string | number | boolean | null',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.BADGE.DESCRIPTION'
			},
			{
				name: 'badgeColor',
				type: 'HubAvatarBadgeColor | string | null',
				required: false,
				description: 'DOCS.AVATAR.API.INPUT.BADGE_COLOR.DESCRIPTION'
			}
		];

		this.avatarLibrary.api.outputs = [
			{
				name: 'clickOnAvatar',
				type: 'OutputEmitterRef<Source | null>',
				required: false,
				description: 'DOCS.AVATAR.API.OUTPUT.CLICK_ON_AVATAR.DESCRIPTION'
			}
		];

		// `Source` is exported from the package, so a handler can name the payload type
		// instead of copying its shape. Its one callable member is documented here; the
		// two data members are named in the output's own description.
		this.avatarLibrary.api.methods = [
			{
				name: 'Source.getAvatar',
				signature: 'getAvatar(size: number): string',
				description: 'DOCS.AVATAR.API.METHOD.SOURCE_GET_AVATAR.DESCRIPTION',
				returns: 'string'
			}
		];

		this.avatarLibrary.api.templates = [];
	}
}
