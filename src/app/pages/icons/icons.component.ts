import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { ICONS_FUNCTIONALITIES } from './icons-functionalities';
import { IconsSetupExampleComponent } from '../examples/icons/icons-setup-example.component';
import { IconsFontAwesomeExampleComponent } from '../examples/icons/icons-font-awesome-example.component';
import { IconsBootstrapExampleComponent } from '../examples/icons/icons-bootstrap-example.component';
import { IconsMaterialExampleComponent } from '../examples/icons/icons-material-example.component';
import { IconsSolarExampleComponent } from '../examples/icons/icons-solar-example.component';
import { IconsSvgExampleComponent } from '../examples/icons/icons-svg-example.component';
import { IconsSpriteExampleComponent } from '../examples/icons/icons-sprite-example.component';
import { IconsImgExampleComponent } from '../examples/icons/icons-img-example.component';
import { IconsVariantsExampleComponent } from '../examples/icons/icons-variants-example.component';
import { IconsDirectiveExampleComponent } from '../examples/icons/icons-directive-example.component';
import { IconsThemingExampleComponent } from '../examples/icons/icons-theming-example.component';
import { IconsButtonsExampleComponent } from '../examples/icons/icons-buttons-example.component';
import { MixinIconsExampleComponent } from '../examples/icons/mixin-icons-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const ICONS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'icons-setup': IconsSetupExampleComponent,
	'icons-font-awesome': IconsFontAwesomeExampleComponent,
	'icons-bootstrap': IconsBootstrapExampleComponent,
	'icons-material': IconsMaterialExampleComponent,
	'icons-solar': IconsSolarExampleComponent,
	'icons-svg': IconsSvgExampleComponent,
	'icons-sprite': IconsSpriteExampleComponent,
	'icons-img': IconsImgExampleComponent,
	'icons-variants': IconsVariantsExampleComponent,
	'icons-directive': IconsDirectiveExampleComponent,
	'icons-theming': IconsThemingExampleComponent,
	'icons-buttons': IconsButtonsExampleComponent
};

/**
 * Documentation page for the ng-hub-ui-icons library.
 */
@Component({
	selector: 'app-icons',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<app-library-page
		[library]="iconsLibrary"
		[package]="'icons'"
		[exampleGroups]="exampleGroups"
	></app-library-page>`
})
export class IconsComponent implements OnInit {
	protected readonly exampleGroups = ICONS_FUNCTIONALITIES;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	iconsLibrary: Library = {
		title: 'ng-hub-ui-icons',
		description:
			'Icon-set-agnostic icon rendering for Angular. Render Font Awesome, Bootstrap Icons, Material Symbols, Solar or your own SVGs through one API — with no hard dependency on any icon pack — and theme them all uniformly through `--hub-icon-*` CSS variables.',
		overview: {
			text: "ng-hub-ui-icons decouples how you reference an icon from which icon set draws it. A pack is a pure resolver (name, variant?) → render spec; the library ships factories and presets for the popular sets but bundles none of them, so your bundle stays lean and you can mix sets freely. The app loads each set's CSS/font/SVG; the library only knows the naming conventions and themes every pack the same way through one `--hub-icon-*` token set.",
			highlights: [
				{
					icon: 'fa-solid fa-shapes',
					title: 'Set-agnostic',
					description:
						'Font Awesome, Bootstrap Icons, Material Symbols, Solar, sprites, inline SVG and <img> — all behind one API.'
				},
				{
					icon: 'fa-solid fa-feather',
					title: 'Zero icon dependencies',
					description: 'No fonts or SVGs bundled. You load the set; the library formats its names and themes it.'
				},
				{
					icon: 'fa-solid fa-plug',
					title: 'Component & directive',
					description: '<hub-icon> for standalone icons and [hubIcon] to decorate your own element.'
				},
				{
					icon: 'fa-solid fa-sliders',
					title: 'Central registry',
					description:
						'provideHubIcons({ defaultPack, packs }) with per-call pack / variant overrides and a pack:variant:name shorthand.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Uniform theming',
					description:
						'One --hub-icon-* token set (size, color and variable-font axes) themes every pack identically.'
				},
				{
					icon: 'fa-solid fa-puzzle-piece',
					title: 'Just project it',
					description:
						'No adapters or wiring — drop <hub-icon> into any component (buttons, menus, links) and it renders. Position follows the markup.'
				}
			],
			changelog: [
				{
					version: '22.3.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). The whole --hub-icon-* block resolves through the family --hub-sys-* / --hub-ref-* ladder, which is how an icon follows the theme ink and its dark mode without being told to, and the manifest said nothing about it, so a consumer reading the package on npm had no way to learn which package supplies those values. It is genuinely optional: every token ends in a literal fallback and the renderer works without it.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'A colour utility on an icon does something again. <hub-icon class="text-danger"> came out in the default ink, and so did text-warning, text-success and every other utility: the library declared its own color in a rule named .hub-icon — one class, exactly what a utility is — and this stylesheet is injected at runtime, so it always lands after the sheet the application shipped. Tied on specificity, decided by source order, the primitive won. Every rule the library lands on the icon element is now written through :where(), which matches the same element and contributes zero specificity, so any declaration a consumer writes wins whatever the order — including classes this library will never hear of. Two consequences worth reading before upgrading, in BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'The color input is now also written as an inline color, beside the --hub-icon-color it has always set: with the token read from a zero-specificity rule it would otherwise lose to a utility class on the same element, and an input written on one icon and no other is the more deliberate of the two.'
						},
						{
							type: 'changed',
							description:
								"An SVG icon now takes its fill from currentColor instead of var(--hub-icon-color). The element's own color is where the token, a utility and the color input have already been resolved against each other, so reading it back keeps a drawn glyph and a filled path the same colour."
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'added',
							description:
								'label on the [hubIcon] directive, the same accessible-name input hub-icon already had: it exposes the host as role="img" with that aria-label, and without it the icon is decorative.'
						},
						{
							type: 'fixed',
							description:
								'A screen reader no longer reads the icon\'s name out loud. The directive declared nothing but class="hub-icon" on its host, so every icon drawn with [hubIcon] was an unlabelled element in the accessibility tree; and with a ligature font such as Material Symbols the mechanism that draws the glyph is the icon\'s name written as text inside the element, so what got announced was the word "home" beside the link that already said Home. The text has to stay for the glyph to be drawn, so it is hidden rather than removed: a label-less icon is now aria-hidden="true" and a labelled one is role="img" with its aria-label. This is what hub-icon has always done; the directive had been left behind. Breaking for a host carrying its own role, aria-label or aria-hidden — see BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.1.3',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'FUNCTIONALITIES.md, the per-feature coverage table the rest of the ecosystem ships, so a reader can see what the library does and which parts a live example actually demonstrates instead of inferring both from the list of examples.'
						},
						{
							type: 'fixed',
							description:
								"The cssVars bridge now follows the pack that actually draws the icon. resolve() expands the pack:variant:name shorthand but the bridge lookup read the pack input alone, so an icon written with the shorthand was dressed with the default pack's custom properties, or with none, while binding the pack explicitly got the right ones. HubIconRegistry.cssVars() takes the icon name as an optional second argument so both entry points expand the same reference the same way and existing calls keep working. Latent for consumers of the shipped presets, none of which declares a bridge, and breaking for anyone who wrote a pack with one and used the documented shorthand."
						},
						{
							type: 'fixed',
							description:
								'The input table now describes the directive as well as the component. name was listed as required for both forms, but on [hubIcon] it is optional and falls back to the value bound to the directive, and hubIcon itself appeared in no table at all, so the only way to learn it existed was to read the source. The documentation links pointed at the site root too, leaving the reader to hunt for the icons page, and now open it directly.'
						},
						{
							type: 'fixed',
							description:
								"The stylesheets are reachable by the subpath the README documents. The manifest declared no exports, so ng-packagr generated the minimal map and every sheet shipped in styles/ stayed outside the package's public surface. Resolvers that fall back to the filesystem found them anyway, which is why nobody noticed, while anything resolving strictly through exports answered ERR_PACKAGE_PATH_NOT_EXPORTED on the very line the docs tell you to write. The styles subpath now resolves, along with the icon, icon-base and icon-theme sheets."
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The package manifest's homepage now points at this library's own documentation page instead of the site root, so the link a registry shows beside the package lands on the reference the reader was already after."
						}
					]
				},
				{
					version: '22.1.1',
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
					version: '22.1.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								"hub-icon-theme(...) mixin — one-call token theming for <hub-icon> / [hubIcon]: color, size, and the variable-font axes weight / fill / grade / optical-size. Null-defaulted and additive; @use 'ng-hub-ui-icons/styles' as *;."
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-07-01',
					changes: [
						{
							type: 'added',
							description:
								'Initial release: <hub-icon> component and [hubIcon] directive, agnostic to the icon set.'
						},
						{
							type: 'added',
							description:
								'provideHubIcons pack registry; classPack / ligaturePack / svgPack factories and faPack / bootstrapPack / materialSymbolsPack / solarPack presets.'
						},
						{
							type: 'added',
							description:
								'Uniform --hub-icon-* theming (size, color and variable-font axes), so one token set themes every pack identically.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'name (hub-icon)',
					type: 'string',
					required: true,
					description: 'DOCS.ICONS.API.INPUT.NAME.DESCRIPTION'
				},
				{
					name: 'name ([hubIcon])',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.ICONS.API.INPUT.NAME_DIRECTIVE.DESCRIPTION'
				},
				{
					name: 'hubIcon ([hubIcon])',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.ICONS.API.INPUT.HUB_ICON.DESCRIPTION'
				},
				{
					name: 'pack',
					type: 'string',
					required: false,
					defaultValue: 'defaultPack',
					description: 'DOCS.ICONS.API.INPUT.PACK.DESCRIPTION'
				},
				{ name: 'variant', type: 'string', required: false, description: 'DOCS.ICONS.API.INPUT.VARIANT.DESCRIPTION' },
				{
					name: 'size (hub-icon)',
					type: 'string',
					required: false,
					defaultValue: '1em',
					description: 'DOCS.ICONS.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'color (hub-icon)',
					type: 'string',
					required: false,
					defaultValue: 'currentColor',
					description: 'DOCS.ICONS.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'label',
					type: 'string',
					required: false,
					description: 'DOCS.ICONS.API.INPUT.LABEL.DESCRIPTION'
				},
				{
					name: 'spin (hub-icon)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.ICONS.API.INPUT.SPIN.DESCRIPTION'
				}
			],
			outputs: [],
			templates: [],
			cssVariables: MD_CSS_VARIABLES['icons'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['icons'],
			demos: [
				{
					title: 'Theming with hub-icon-theme',
					previewComponent: MixinIconsExampleComponent,
					code: `@use 'ng-hub-ui-icons/styles' as icons;

.icon-mixin-scope {
	@include icons.hub-icon-theme($color: #7c3aed, $size: 2rem);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and populates the grouped
	 * functionalities shown on the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every icons example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'icons-setup',
				title: 'DOCS.ICONS.EXAMPLE.SETUP.TITLE',
				componentName: 'IconsSetupExampleComponent',
				files: ['icons-setup-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-setup-example.component').then((m) => m.IconsSetupExampleComponent)
			},
			{
				id: 'icons-font-awesome',
				title: 'DOCS.ICONS.EXAMPLE.FONT_AWESOME.TITLE',
				componentName: 'IconsFontAwesomeExampleComponent',
				files: ['icons-font-awesome-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-font-awesome-example.component').then(
						(m) => m.IconsFontAwesomeExampleComponent
					)
			},
			{
				id: 'icons-bootstrap',
				title: 'DOCS.ICONS.EXAMPLE.BOOTSTRAP.TITLE',
				componentName: 'IconsBootstrapExampleComponent',
				files: ['icons-bootstrap-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-bootstrap-example.component').then((m) => m.IconsBootstrapExampleComponent)
			},
			{
				id: 'icons-material',
				title: 'DOCS.ICONS.EXAMPLE.MATERIAL.TITLE',
				componentName: 'IconsMaterialExampleComponent',
				files: ['icons-material-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-material-example.component').then((m) => m.IconsMaterialExampleComponent)
			},
			{
				id: 'icons-solar',
				title: 'DOCS.ICONS.EXAMPLE.SOLAR.TITLE',
				componentName: 'IconsSolarExampleComponent',
				files: ['icons-solar-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-solar-example.component').then((m) => m.IconsSolarExampleComponent)
			},
			{
				id: 'icons-svg',
				title: 'DOCS.ICONS.EXAMPLE.SVG.TITLE',
				componentName: 'IconsSvgExampleComponent',
				files: ['icons-svg-example.component.ts'],
				loader: () => import('../examples/icons/icons-svg-example.component').then((m) => m.IconsSvgExampleComponent)
			},
			{
				id: 'icons-sprite',
				title: 'DOCS.ICONS.EXAMPLE.SPRITE.TITLE',
				componentName: 'IconsSpriteExampleComponent',
				files: ['icons-sprite-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-sprite-example.component').then((m) => m.IconsSpriteExampleComponent)
			},
			{
				id: 'icons-img',
				title: 'DOCS.ICONS.EXAMPLE.IMG.TITLE',
				componentName: 'IconsImgExampleComponent',
				files: ['icons-img-example.component.ts'],
				loader: () => import('../examples/icons/icons-img-example.component').then((m) => m.IconsImgExampleComponent)
			},
			{
				id: 'icons-variants',
				title: 'DOCS.ICONS.EXAMPLE.VARIANTS.TITLE',
				componentName: 'IconsVariantsExampleComponent',
				files: ['icons-variants-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-variants-example.component').then((m) => m.IconsVariantsExampleComponent)
			},
			{
				id: 'icons-directive',
				title: 'DOCS.ICONS.EXAMPLE.DIRECTIVE.TITLE',
				componentName: 'IconsDirectiveExampleComponent',
				files: ['icons-directive-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-directive-example.component').then((m) => m.IconsDirectiveExampleComponent)
			},
			{
				id: 'icons-theming',
				title: 'DOCS.ICONS.EXAMPLE.THEMING.TITLE',
				componentName: 'IconsThemingExampleComponent',
				files: ['icons-theming-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-theming-example.component').then((m) => m.IconsThemingExampleComponent)
			},
			{
				id: 'icons-buttons',
				title: 'DOCS.ICONS.EXAMPLE.BUTTONS.TITLE',
				componentName: 'IconsButtonsExampleComponent',
				files: ['icons-buttons-example.component.ts'],
				loader: () =>
					import('../examples/icons/icons-buttons-example.component').then((m) => m.IconsButtonsExampleComponent)
			}
		];

		examples.forEach((ex) => this._exampleRegistry.register({ ...ex, packagePath: 'icons' }));
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview
	 * component so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		this.iconsLibrary.functionalities = ICONS_FUNCTIONALITIES.map((group) => ({
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
						previewComponent: ICONS_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
