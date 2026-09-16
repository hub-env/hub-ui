import { ChangeDetectionStrategy, Component, OnInit, Type, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BADGES_FUNCTIONALITIES } from './badges-functionalities';
import { BADGES_PLAYGROUND } from './badges-playground';
import { MatrixBadgesExampleComponent } from '../examples/badges/matrix-badges-example.component';
import { ScaleShapeBadgesExampleComponent } from '../examples/badges/scale-shape-badges-example.component';
import { StatusCountersBadgesExampleComponent } from '../examples/badges/status-counters-badges-example.component';
import { MixinBadgesExampleComponent } from '../examples/badges/mixin-badges-example.component';
import { RemovableBadgesExampleComponent } from '../examples/badges/removable-badges-example.component';
import { ThemingBadgesExampleComponent } from '../examples/badges/theming-badges-example.component';
import { TruncationTooltipBadgesExampleComponent } from '../examples/badges/truncation-tooltip-badges-example.component';
import { ChipBadgesExampleComponent } from '../examples/badges/chip-badges-example.component';
import { ChipColorsBadgesExampleComponent } from '../examples/badges/chip-colors-badges-example.component';

/**
 * Maps each registered example id to its standalone component so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const BADGES_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'badges-matrix': MatrixBadgesExampleComponent,
	'badges-scale-shape': ScaleShapeBadgesExampleComponent,
	'badges-status-counters': StatusCountersBadgesExampleComponent,
	'badges-removable': RemovableBadgesExampleComponent,
	'badges-theming': ThemingBadgesExampleComponent,
	'badges-truncation': TruncationTooltipBadgesExampleComponent,
	'badges-chip': ChipBadgesExampleComponent,
	'badges-chip-colors': ChipColorsBadgesExampleComponent
};

/**
 * Main ng-hub-ui-badges library documentation page.
 */
@Component({
	selector: 'app-badges-docs',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page
			[library]="badgesLibrary"
			[package]="'badges'"
			[playground]="playgroundConfigs"
			[exampleGroups]="exampleGroups"
		></app-library-page>
	`
})
export class BadgesDocsComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = BADGES_PLAYGROUND;

	/** Section headings for the examples panel, shared with the Overview feature guides. */
	protected readonly exampleGroups = BADGES_FUNCTIONALITIES;

	/** Complete ng-hub-ui-badges library data. */
	badgesLibrary: Library = {
		title: 'ng-hub-ui-badges',
		description:
			'Semantic Angular badges for statuses, counters and removable filter tags, with CSS-variable theming and public SCSS mixins for custom colour families.',
		overview: {
			text: 'ng-hub-ui-badges provides a compact display primitive for labels, counters, workflow states and active filters. The main `hub-badge` component supports semantic colours, multiple surface treatments, size and shape scales, status dots and optional dismiss actions for tag-like flows. Icons are projected as content, and the internal layout (gap, direction, alignment) is themed through CSS variables. The public SCSS API lets host applications register additional semantic colours without forking the library.',
			highlights: [
				{
					icon: 'fa-solid fa-tags',
					title: 'Semantic badge family',
					description:
						'Render statuses, counters and labels from a single Angular primitive instead of mixing ad-hoc spans and Bootstrap classes.'
				},
				{
					icon: 'fa-solid fa-circle-dot',
					title: 'Status dots & removable tags',
					description:
						'Use the same component for lightweight status pills and for dismissible filters or token-like tags.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Open semantic theming',
					description:
						'Built-in colours read the shared `--hub-sys-color-*` tokens and custom colours plug in through the public SCSS mixins.'
				}
			],
			changelog: [
				{
					version: '22.7.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								'<hub-chip-set> keeps its stylesheet to itself. It carried ViewEncapsulation.None for no reason of its own: it draws a flex row on its host and declares one token, --hub-chip-set-gap, and neither needs to leave the component. <hub-badge> and <hub-chip> keep the exception, because theirs is the second reason CODING_RULES.md allows: hub-badge-color-rules() is a public mixin a consumer includes from their own sheet and it emits the same plain .hub-badge* selectors the built-in colours do, so scoping one side would stop the two being interchangeable. Nothing about the set changes in specificity either, and the chips are projected content the sheet never reached; the only thing that stops working is markup of your own carrying the hub-chip-set class.'
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). Every colour and spacing default in this library resolves through the --hub-sys-* / --hub-ref-* ladder and the manifest said nothing about it, so a consumer reading the package on npm could not tell that installing the token package is what hands badges and chips the family palette and its dark mode. It stays optional: each token carries a literal fallback.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'The dismiss button is no longer a control inside another control. <hub-chip> always carried role="button" on its host, and <hub-badge> took it whenever interactive was set, so the remove button rendered inside them sat within a subtree ARIA declares presentational: a screen reader announced one button, and the dismiss action inside it was neither described nor reliably reached by navigation between interactive elements. The toggle now lives in its own element, sibling to the dismiss button, and the host is a plain shell.'
						},
						{
							type: 'changed',
							description:
								'<hub-chip> renders its toggle as a real <button class="hub-chip__action">, so Enter, Space, the disabled state and the accessible name come from the platform instead of hand-rolled keydown handling and aria-* attributes. The host keeps every class it had and the whole chip stays clickable: the action\'s stretched pseudo-element reclaims the shell padding as hit area and carries the focus ring.'
						},
						{
							type: 'changed',
							description:
								'<hub-badge> puts role="button", tabindex and aria-pressed on its content element (.hub-badge__content) instead of on the host, and only while interactive. A non-interactive badge is unchanged: no role, no tab stop, nothing new in the markup. Both markup changes are breaking for anyone styling or querying the internals — BREAKING_CHANGES.md carries the migration.'
						},
						{
							type: 'changed',
							description:
								"A click on the chip's remove button now reaches the host element. The dismiss handler used to call stopPropagation() to keep the host's own toggle from firing; that toggle is gone, and swallowing the event only hid the click from the consumer's own listeners."
						}
					]
				},
				{
					version: '22.6.3',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'A disabled interactive <hub-badge> now exposes aria-disabled="true". With interactive the host takes role="button", and disabled pulled it out of the tab order while silently swallowing every activation, so a screen-reader user landing on it by any other route (a virtual cursor, the rotor, a scripted focus) met a button that announced no state and did nothing when pressed. The host now reflects that state the way <hub-chip> already did. A non-interactive badge carries nothing new: it has no role to be disabled, and its dismiss button keeps announcing itself through the native disabled attribute.'
						},
						{
							type: 'fixed',
							description:
								"The SCSS entry point the README teaches is now declared in the manifest. styles/ shipped in the published package, but the exports map ng-packagr writes listed only . and ./package.json, so @use 'ng-hub-ui-badges/styles' rested on a resolver willing to ignore the map and walk into node_modules by hand. The manifest now declares the ./styles entry, making the documented import part of the package contract instead of an accident of the consumer's tooling."
						},
						{
							type: 'fixed',
							description:
								'The documentation now describes the library that shipped. Both READMEs still promised six built-in colours where the type and the stylesheet register nine, named only HubBadgeComponent in the feature list although hub-chip and hub-chip-set have been public since 22.5.0, and said nothing about hub-badge-theme or about [color] taking a literal colour. The Spanish README was additionally missing the tooltip-synergy section and the chip snippets its English twin carries. A reader had no way to tell the gap from a deliberate omission.'
						},
						{
							type: 'fixed',
							description:
								'BREAKING_CHANGES.md records the two breaking releases it had skipped. The file claimed the only entry worth making was the 22.0.0 initial release, while 22.5.0 removed HubBadgeGroupComponent and 22.3.0 changed the hub-badge-variant-rules signature and dropped the --hub-badge-accent-contrast token. Since the major of this package tracks the Angular major, the version number can never warn about a breaking change, so that file is the only notice a consumer gets.'
						},
						{
							type: 'added',
							description:
								'FUNCTIONALITIES.md, the feature-versus-example coverage table the other libraries publish. It is the honest answer to whether a feature can be seen running anywhere, and it marks what has no example (the interactive badge, the overlay dot, disabled) rather than implying even coverage.'
						}
					]
				},
				{
					version: '22.6.2',
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
					date: '2026-07-07',
					changes: [
						{
							type: 'added',
							description:
								"hub-badge-theme(...) mixin — one-call token theming for <hub-badge> / <hub-chip>: accent (drives the shared role family) plus the shell tokens (bg, color, border-color, border-radius, border-width, padding-x/-y, gap, font-size, font-weight). Null-defaulted and additive; the existing variant-registration API (hub-badge-variant-rules / hub-badge-color-rules) stays for registering new named accents. @use 'ng-hub-ui-badges/styles' as *;."
						},
						{
							type: 'changed',
							description:
								'<hub-badge> / <hub-chip> [color] accepts ANY colour. On top of the built-in semantic accents, the input now also accepts a registered custom accent and a literal colour (#ff0000, rgb(...), oklch(...), a CSS named colour), resolved through the shared resolveHubAccent helper (imported from ng-hub-ui-utils): a bareword becomes var(--hub-sys-color-<name>, <name>); a literal is used as-is. The single --hub-<comp>-accent slot derives the rest of the family, so built-in colours are unchanged.'
						},
						{
							type: 'changed',
							description:
								'Internal — host bindings moved to the host metadata object. @HostBinding / @HostListener decorators were replaced by the host object in the component/directive metadata (Angular style guide). No public API or behaviour change.'
						},
						{
							type: 'changed',
							description:
								'Added ng-hub-ui-utils (>=22.7.0) as a peer dependency (already used at runtime; now declared).'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-06',
					changes: [
						{
							type: 'removed',
							description:
								'BREAKING — HubBadgeGroupComponent (<hub-badge-group>) removed. It was a purely presentational flex wrapper whose four inputs (direction / align / gap / wrap) mapped 1:1 to CSS, redundant with the standard flex utilities the library already ships. Arrange badges with <div class="d-flex flex-wrap gap-2"> (add flex-column / align-items-* as needed). The HubBadgeGroupDirection / HubBadgeGroupAlign types and the internal --hub-badge-group-gap / --hub-badge-group-align tokens are gone too.'
						},
						{
							type: 'added',
							description:
								"hub-chip + hub-chip-set — interactive filter-chip primitives. hub-chip is a togglable, optionally removable tag that reuses the badge accent contract for its colours (it points the shared --hub-badge-accent slot from its color input and derives every surface from that family via the new hub-badge-accent-family mixin). It exposes selected (two-way model), value, color, disabled, removable, removeLabel inputs and selectedChange / removed / chipClick outputs, projects a leading icon/avatar through [hubChipLeading], and behaves as a role=\"button\" toggle with aria-pressed and Space/Enter support. hub-chip-set groups chips with selectionMode ('single' | 'multiple') and a two-way value model, deselecting siblings in single mode. New tokens: --hub-chip-bg, --hub-chip-color, --hub-chip-border-color, --hub-chip-selected-bg, --hub-chip-selected-color, --hub-chip-hover-bg, --hub-chip-gap, --hub-chip-focus-ring (plus the shell tokens --hub-chip-font-family/-size/-weight, --hub-chip-padding-x/-y, --hub-chip-border-width/-radius, --hub-chip-focus-ring-width, --hub-chip-transition and --hub-chip-set-gap)."
						},
						{
							type: 'added',
							description:
								'Interactive badges. New interactive input turns a badge into a role="button" toggle with a keyboard tab stop that emits the new selected output on click / Enter / Space, and an active input toggles the pressed state (.hub-badge--active, aria-pressed) reading the new --hub-badge-active-bg slot. All default-off and additive.'
						},
						{
							type: 'added',
							description:
								"Overlay status dot. New dotOverlay input renders the status dot absolutely positioned at a badge corner (distinct from the existing inline leading dot), with a dotPlacement input ('top-end' | 'top-start' | 'bottom-end' | 'bottom-start') and the new --hub-badge-overlay-offset token controlling the corner inset."
						},
						{
							type: 'added',
							description:
								'neutral, light and dark documented as built-in colours. HubBadgeBuiltinColor now lists all nine canonical accents the stylesheet already registers, so the type matches the runtime.'
						},
						{
							type: 'added',
							description:
								"Designed bg/fg pair registration. hub-badge-variant-rules($type, $accent, $bg, $fg, $border, $subtle) gained optional $bg / $fg / $border / $subtle overrides: pass any of them to pin the corresponding final slot for a variant; omit them to keep today's runtime derivation. Fully backward compatible."
						},
						{
							type: 'added',
							description:
								'hub-badge-accent-family mixin. Exposes the runtime-derived accent role family (-emphasis / -subtle / -border / -on) as a single shared mixin, now included by both hub-badge and hub-chip so the colour derivation lives in one place.'
						}
					]
				},
				{
					version: '22.4.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								"CSS variable fallbacks realigned to the ds light defaults (--hub-ref-font-family-base: inherit → system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif); fallbacks only apply when ng-hub-ui-ds is not loaded."
						},
						{
							type: 'fixed',
							description:
								'Docs: docs/css-variables-reference.md default values resynchronized with the actual code declarations (now guarded by the repo-level tokens-parity check F).'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								'Text truncation with ellipsis, bounded by the new `--hub-badge-max-width` CSS variable.'
						},
						{
							type: 'added',
							description: '`tooltip` input plus auto tooltip on truncated content (native `title` by default).'
						},
						{
							type: 'added',
							description:
								'Optional hub-ui tooltip integration via `provideHubBadgeTooltip(hubTooltipAdapter)` (from ng-hub-ui-utils).'
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
								"New on-accent contrast pair --hub-badge-accent-on: a grayscale contrast flip of the accent that picks white or near-black text automatically from the accent's own lightness. Replaces the hard-coded per-colour --hub-badge-accent-contrast (and the $hub-badge-light-accents / hub-badge-on-accent() helper that listed warning/info by hand)."
						},
						{
							type: 'added',
							description:
								"Open-set theming at runtime: any new accent (e.g. brand) works with a single CSS rule that points the slot at a colour — .hub-badge[data-variant='brand'] { --hub-badge-accent: var(--hub-sys-color-brand); } — and emphasis / subtle / border / on derive themselves. The open path no longer depends on the @each or on recompiling the library."
						},
						{
							type: 'changed',
							description:
								'The local accent slot --hub-badge-accent now derives its whole role family at runtime from the slot itself (recomputed live whenever the accent changes), instead of reading per-type --hub-sys-color-{type}-* tokens.'
						},
						{
							type: 'changed',
							description:
								'Known-variant loop expanded from 6 to the 9 canonical accents — primary, secondary, success, danger, warning, info, neutral, light, dark — where each [data-variant] only points --hub-badge-accent at its --hub-sys-color-{variant}.'
						},
						{
							type: 'changed',
							description:
								'hub-badge-variant-rules($type, $accent) simplified: it now only sets the local accent slot for a variant (no role/contrast parameters); the role family is derived in the component.'
						},
						{
							type: 'changed',
							description:
								'Migrated every color-mix(in srgb, …) to in oklch (soft/subtle borders and the remove-button hover overlay).'
						},
						{
							type: 'removed',
							description:
								'Hard-coded --hub-badge-accent-contrast token and the $hub-badge-light-accents list / hub-badge-on-accent() helper; on-accent text is now derived from the accent via --hub-badge-accent-on.'
						},
						{
							type: 'removed',
							description:
								'Duplicated per-[data-variant] role derivations (previously re-declared in srgb); the single slot-derived family now covers every variant.'
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
								'Design-token consistency pass: aligned inline fallback defaults with the canonical ng-hub-ui-ds values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their --hub-sys-* / --hub-ref-* tokens, so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-25',
					changes: [
						{
							type: 'changed',
							description:
								'Consolidated every badge dimension token onto the shared --hub-ref-* reference scale (a compact mapping that keeps the badge chip-sized), so sizing resolves through the design-system tokens instead of hand-tuned rem literals — matching the Figma ff/badge variable layer. Base: --hub-badge-padding-x 0.625rem → var(--hub-ref-space-2), --hub-badge-padding-y 0.375rem → var(--hub-ref-space-1), --hub-badge-gap 0.375rem → var(--hub-ref-space-1), --hub-badge-dot-size 0.5rem → var(--hub-ref-space-2). The size ramp xs / sm / md / lg now references --hub-ref-space-* and --hub-ref-font-size-*.'
						},
						{
							type: 'changed',
							description:
								'Visual note: md padding tightens (10→8px / 6→4px) so the chip stays compact; the other steps land on the nearest reference token. Behaviour is unchanged.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'changed',
							description:
								'Lower peerDependencies for @angular/core and @angular/common to >=21.0.0. The library now supports Angular 21 and later.'
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-06-24',
					changes: [
						{
							type: 'changed',
							description:
								'Generate the built-in semantic colour rules (primary, secondary, success, danger, warning, info) with a single @each loop over the public hub-badge-variant-rules mixin, instead of hand-written per-colour blocks. A hub-badge-on-accent() helper standardises the on-accent text to black or white per colour (light accents like warning/info get black). Built-ins now share the exact selector shape and token contract used by consumer-registered colours.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description: '`HubBadgeComponent` with semantic variants, status dots and dismissible mode.'
						},
						{ type: 'added', description: '`HubBadgeGroupComponent` for wrapped and stacked badge layouts.' },
						{
							type: 'added',
							description:
								'Public SCSS mixins at `ng-hub-ui-badges/styles` for registering custom semantic colour families.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'variant',
					type: 'HubBadgeVariant',
					required: false,
					defaultValue: "'solid'",
					description: 'DOCS.BADGES.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'color',
					type: 'HubBadgeColor',
					required: false,
					defaultValue: "'primary'",
					description: 'DOCS.BADGES.API.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'size',
					type: 'HubBadgeSize',
					required: false,
					defaultValue: "'md'",
					description: 'DOCS.BADGES.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'shape',
					type: 'HubBadgeShape',
					required: false,
					defaultValue: "'pill'",
					description: 'DOCS.BADGES.API.INPUT.SHAPE.DESCRIPTION'
				},
				{
					name: 'dot',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.DOT.DESCRIPTION'
				},
				{
					name: 'removable',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.REMOVABLE.DESCRIPTION'
				},
				{
					name: 'removeLabel',
					type: 'string',
					required: false,
					defaultValue: "'Remove badge'",
					description: 'DOCS.BADGES.API.INPUT.REMOVE_LABEL.DESCRIPTION'
				},
				{
					name: 'disabled',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.DISABLED.DESCRIPTION'
				},
				{
					name: 'tooltip',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.BADGES.API.INPUT.TOOLTIP.DESCRIPTION'
				},
				{
					name: 'interactive',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.INTERACTIVE.DESCRIPTION'
				},
				{
					name: 'active',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.ACTIVE.DESCRIPTION'
				},
				{
					name: 'dotOverlay',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.INPUT.DOT_OVERLAY.DESCRIPTION'
				},
				{
					name: 'dotPlacement',
					type: 'HubBadgeOverlayPlacement',
					required: false,
					defaultValue: "'top-end'",
					description: 'DOCS.BADGES.API.INPUT.DOT_PLACEMENT.DESCRIPTION'
				},
				{
					name: 'hub-chip · selected',
					type: 'model<boolean>',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.CHIP.INPUT.SELECTED.DESCRIPTION'
				},
				{
					name: 'hub-chip · value',
					type: 'unknown',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BADGES.API.CHIP.INPUT.VALUE.DESCRIPTION'
				},
				{
					name: 'hub-chip · color',
					type: 'HubBadgeColor',
					required: false,
					defaultValue: "'primary'",
					description: 'DOCS.BADGES.API.CHIP.INPUT.COLOR.DESCRIPTION'
				},
				{
					name: 'hub-chip · disabled',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.CHIP.INPUT.DISABLED.DESCRIPTION'
				},
				{
					name: 'hub-chip · removable',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.BADGES.API.CHIP.INPUT.REMOVABLE.DESCRIPTION'
				},
				{
					name: 'hub-chip · removeLabel',
					type: 'string',
					required: false,
					defaultValue: "'Remove chip'",
					description: 'DOCS.BADGES.API.CHIP.INPUT.REMOVE_LABEL.DESCRIPTION'
				},
				{
					name: 'hub-chip-set · selectionMode',
					type: "'single' | 'multiple'",
					required: false,
					defaultValue: "'single'",
					description: 'DOCS.BADGES.API.CHIPSET.INPUT.SELECTION_MODE.DESCRIPTION'
				},
				{
					name: 'hub-chip-set · value',
					type: 'model<unknown>',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.BADGES.API.CHIPSET.INPUT.VALUE.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'removed',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BADGES.API.OUTPUT.REMOVED.DESCRIPTION'
				},
				{
					name: 'selected',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BADGES.API.OUTPUT.SELECTED.DESCRIPTION'
				},
				{
					name: 'hub-chip · selectedChange',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					description: 'DOCS.BADGES.API.CHIP.OUTPUT.SELECTED_CHANGE.DESCRIPTION'
				},
				{
					name: 'hub-chip · removed',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BADGES.API.CHIP.OUTPUT.REMOVED.DESCRIPTION'
				},
				{
					name: 'hub-chip · chipClick',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.BADGES.API.CHIP.OUTPUT.CHIP_CLICK.DESCRIPTION'
				},
				{
					name: 'hub-chip-set · valueChange',
					type: 'OutputEmitterRef<unknown>',
					required: false,
					description: 'DOCS.BADGES.API.CHIPSET.OUTPUT.VALUE_CHANGE.DESCRIPTION'
				}
			],
			templates: [
				{
					name: '[hubChipLeading]',
					description: 'DOCS.BADGES.API.CHIP.TEMPLATE.LEADING.DESCRIPTION',
					example: `<hub-chip [value]="'open'" color="success">
  <i hubChipLeading class="fa-solid fa-circle" aria-hidden="true"></i>
  Open
</hub-chip>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['badges'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['badges'],
			demos: [
				{
					title: 'Theming with hub-badge-theme',
					previewComponent: MixinBadgesExampleComponent,
					code: `@use 'ng-hub-ui-badges/styles' as badges;

.badge-mixin-scope {
	@include badges.hub-badge-theme(
		$accent: #7c3aed,
		$border-radius: 0.5rem,
		$font-weight: 600
	);
}`
				}
			]
		}
	};

	/**
	 * Registers examples and populates the grouped functionalities section
	 * shown by the shared docs page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalitiesFromRegistry();
	}

	/**
	 * Registers every badges example with the shared ExampleRegistry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'badges-matrix',
				title: 'DOCS.BADGES.EXAMPLE.MATRIX.TITLE',
				componentName: 'MatrixBadgesExampleComponent',
				files: ['matrix-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/matrix-badges-example.component').then((m) => m.MatrixBadgesExampleComponent)
			},
			{
				id: 'badges-scale-shape',
				title: 'DOCS.BADGES.EXAMPLE.SCALE_SHAPE.TITLE',
				componentName: 'ScaleShapeBadgesExampleComponent',
				files: ['scale-shape-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/scale-shape-badges-example.component').then(
						(m) => m.ScaleShapeBadgesExampleComponent
					)
			},
			{
				id: 'badges-status-counters',
				title: 'DOCS.BADGES.EXAMPLE.STATUS_COUNTERS.TITLE',
				componentName: 'StatusCountersBadgesExampleComponent',
				files: ['status-counters-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/status-counters-badges-example.component').then(
						(m) => m.StatusCountersBadgesExampleComponent
					)
			},
			{
				id: 'badges-removable',
				title: 'DOCS.BADGES.EXAMPLE.REMOVABLE.TITLE',
				componentName: 'RemovableBadgesExampleComponent',
				files: ['removable-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/removable-badges-example.component').then(
						(m) => m.RemovableBadgesExampleComponent
					)
			},
			{
				id: 'badges-theming',
				title: 'DOCS.BADGES.EXAMPLE.THEMING.TITLE',
				componentName: 'ThemingBadgesExampleComponent',
				files: ['theming-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/theming-badges-example.component').then((m) => m.ThemingBadgesExampleComponent)
			},
			{
				id: 'badges-truncation',
				title: 'DOCS.BADGES.EXAMPLE.TRUNCATION.TITLE',
				componentName: 'TruncationTooltipBadgesExampleComponent',
				files: ['truncation-tooltip-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/truncation-tooltip-badges-example.component').then(
						(m) => m.TruncationTooltipBadgesExampleComponent
					)
			},
			{
				id: 'badges-chip',
				title: 'DOCS.BADGES.EXAMPLE.CHIP.TITLE',
				componentName: 'ChipBadgesExampleComponent',
				files: ['chip-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/chip-badges-example.component').then((m) => m.ChipBadgesExampleComponent)
			},
			{
				id: 'badges-chip-colors',
				title: 'DOCS.BADGES.EXAMPLE.CHIP_COLORS.TITLE',
				componentName: 'ChipColorsBadgesExampleComponent',
				files: ['chip-colors-badges-example.component.ts'],
				loader: () =>
					import('../examples/badges/chip-colors-badges-example.component').then(
						(m) => m.ChipColorsBadgesExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this.exampleRegistry.register({
				...example,
				packagePath: 'badges'
			});
		});
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview component.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		this.badgesLibrary.functionalities = BADGES_FUNCTIONALITIES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => {
					const registryItem = this.exampleRegistry.get(id);
					if (!registryItem) {
						return null;
					}

					return {
						title: registryItem.title,
						description: registryItem.title,
						import: '',
						template: '',
						component: '',
						previewComponent: BADGES_PREVIEW_COMPONENTS[id]
					} as FeatureExample;
				})
				.filter((example): example is FeatureExample => example !== null)
		}));
	}
}
