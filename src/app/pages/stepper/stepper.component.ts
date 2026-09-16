import { Component, OnInit, inject, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicStepperExampleComponent } from '../examples/stepper/basic-stepper-example.component';
import { ModalStepperExampleComponent } from '../examples/stepper/modal-stepper-example.component';
import { ValidationStepperExampleComponent } from '../examples/stepper/validation-stepper-example.component';
import { ProgrammaticStepperExampleComponent } from '../examples/stepper/programmatic-stepper-example.component';
import { OrientationStepperExampleComponent } from '../examples/stepper/orientation-stepper-example.component';
import { ThemingStepperExampleComponent } from '../examples/stepper/theming-stepper-example.component';
import { CustomNavStepperExampleComponent } from '../examples/stepper/custom-nav-stepper-example.component';
import { CustomControlsStepperExampleComponent } from '../examples/stepper/custom-controls-stepper-example.component';
import { AnimatedStepperExampleComponent } from '../examples/stepper/animated-stepper-example.component';
import { I18nStepperExampleComponent } from '../examples/stepper/i18n-stepper-example.component';
import { RtlStepperExampleComponent } from '../examples/stepper/rtl-stepper-example.component';
import { TruncatedTitlesStepperExampleComponent } from '../examples/stepper/truncated-titles-stepper-example.component';
import { MixinStepperExampleComponent } from '../examples/stepper/mixin-stepper-example.component';
import { STEPPER_PLAYGROUND } from './stepper-playground';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const STEPPER_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'stepper-basic': BasicStepperExampleComponent,
	'stepper-modal': ModalStepperExampleComponent,
	'stepper-validation': ValidationStepperExampleComponent,
	'stepper-programmatic': ProgrammaticStepperExampleComponent,
	'stepper-orientation': OrientationStepperExampleComponent,
	'stepper-theming': ThemingStepperExampleComponent,
	'stepper-custom-nav': CustomNavStepperExampleComponent,
	'stepper-custom-controls': CustomControlsStepperExampleComponent,
	'stepper-animations': AnimatedStepperExampleComponent,
	'stepper-i18n': I18nStepperExampleComponent,
	'stepper-rtl': RtlStepperExampleComponent,
	'stepper-truncated-titles': TruncatedTitlesStepperExampleComponent
};

/**
 * Main stepper library page component.
 * Follows the same documentation architecture used by the paginable page.
 */
@Component({
	selector: 'app-stepper',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page [library]="stepperLibrary" [package]="'stepper'" [playground]="playgroundConfigs"></app-library-page>
	`
})
export class StepperComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = STEPPER_PLAYGROUND;

	/**
	 * Complete stepper library data used by the shared library page.
	 */
	stepperLibrary: Library = {
		title: 'ng-hub-ui-stepper',
		description:
			'Stepper component for multi-step workflows with validation, custom controls, custom navigation templates, runtime theming and programmatic control.',
		overview: {
			text: 'This library provides a step-by-step navigation component with declarative directives and outputs to build guided processes in Angular applications.',
			highlights: [
				{
					icon: 'fa-solid fa-stairs',
					title: 'Navigation You Gate Yourself',
					description:
						'Any enabled step is reachable from the rail; mark a step `disabled` to close it off. The stepper never inspects your form state, so the rule for advancing stays where the rule lives — in your component.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'WAI-ARIA Tablist Rail',
					description:
						'The rail is a `tablist` of `tab` triggers wired to a `tabpanel`, with a roving tabindex: one Tab stop, arrows to move, Home/End to jump, Enter/Space to activate.'
				},
				{
					icon: 'fa-solid fa-table-columns',
					title: 'Vertical & Sidebar Layouts',
					description:
						'`options.layout` switches between the stacked vertical layout and a side-mounted rail, and `options.rtl` mirrors the whole grid.'
				},
				{
					icon: 'fa-solid fa-wand-magic-sparkles',
					title: 'CSS Step Transitions',
					description:
						'Opt in with the `stepper--animated` host class and pick slide or fade with `stepper--anim-slide` / `stepper--anim-fade`. Pure CSS — no `@angular/animations` dependency.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Replaceable Rail & Controls',
					description:
						'The `stepperNav` template replaces the whole rail with `steps` and `currentIndex` in context, and the `previousButton` / `nextButton` / `submitButton` directives turn your own buttons into the footer.'
				},
				{
					icon: 'fa-solid fa-globe',
					title: 'Internationalisation Ready',
					description:
						'Back, Continue and Submit ship translated in ten languages — registered with `provideHubStepper()`, or picked from the exported `STEPPER_DICTIONARIES` — and resolve `HUBUI.STEPPER.*` from the application dictionary; `backLabel` / `continueLabel` / `submitLabel` override them per instance.'
				},
				{
					icon: 'fa-solid fa-scissors',
					title: 'Opt-in Title Truncation',
					description:
						'`truncateTitles` clips long rail titles to `--hub-stepper-nav-title-max-width` and hands the full text back as a tooltip when it overflows.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Single-Slot Accent Theming',
					description:
						'`variant` re-bases `--hub-stepper-accent`, and the emphasis / subtle / on-accent roles are mixed from it — plus a `hub-stepper-theme()` Sass mixin for the whole shell.'
				}
			],
			changelog: [
				{
					version: '22.10.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'hubStepTrigger finally draws something. The directive was exported, listed in the module and documented in both READMEs, and the stepper never queried it, so an ng-template marked with it was captured and then dropped on the floor. It now replaces the trigger the default rail draws, once per step, with the step itself as $implicit and title, index, isCurrent, isCompleted and disabled in the context. hubStepperNav still wins where both are present, because a custom rail draws its own triggers.'
						},
						{
							type: 'changed',
							description:
								'BREAKING. The CSS block is hub-stepper, and the bare stepper goes in 23.0.0. The host wore the class stepper and named every part under it, including three global keyframes called stepper-fade-in and friends, and emulated encapsulation does not scope keyframe names. stepper is a word in the application namespace, not the library one: a host with a .stepper rule of its own restyled the component from outside. No class is removed in this release, both spellings are written to the DOM and both are matched by the stylesheet, but the old ones are deprecated and go in 23.0.0. The three keyframe names are the exception and are renamed outright, with no alias, because they were never named in the README or the API tables. BREAKING_CHANGES.md has the full rename list.'
						},
						{
							type: 'fixed',
							description:
								'A control directive buried inside a step no longer makes the stepper render no control at all. previousButton, nextButton and submitButton are content queries and ran with the default descendants: true, while ng-content select="button[nextButton]" matches only a direct child. So a button nextButton inside a step form was found by the query and could not be projected: the component believed a custom control had been supplied and drew nothing, leaving a wizard with no way forward. The three queries are now shallow, which is exactly what projection can reach.'
						},
						{
							type: 'fixed',
							description:
								'The roving focus of the rail is scoped to the rail and finds a custom trigger. It queried .stepper__nav-trigger across the whole host, which would have picked up the tabs of a stepper nested inside a step panel, and which finds nothing once hubStepTrigger draws the trigger. It now searches inside the nav only, and accepts role="tab" as well as either spelling of the class.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-09-07',
					changes: [
						{
							type: 'added',
							description:
								'provideHubStepper(config?: StepperConfig), the standalone entry point the rest of the family already has. StepperModule.forRoot() was the only thing that registered the bundled en, es, ca, eu, gl, ast, an, de, zh and ar dictionaries and the HubTranslationService the built-in controls resolve their text through, and the module goes in 23.0.0 — so anyone who dropped it lost the ten languages and had to rewrite them, or got a NullInjectorError at first render. The new function registers exactly the same providers without a module; forRoot() now delegates to it, so the two cannot drift apart.'
						},
						{
							type: 'added',
							description:
								'STEPPER_DICTIONARIES, the ten bundled dictionaries exported as a plain record. An application that keeps a single translation configuration can now register only the languages it ships, or merge the stepper labels into a dictionary of its own, instead of retyping thirty strings. The keys stay flat — BACK, CONTINUE and SUBMIT — because that is what the component resolves once its HUBUI.STEPPER namespace misses.'
						},
						{
							type: 'changed',
							description:
								'The 23.0.0 migration note for StepperModule.forRoot() now points at provideHubStepper() instead of sending the reader off to rewrite ten dictionaries by hand. Nothing changes at runtime; what changes is that the removal announced in 22.8.2 finally has a replacement to name.'
						}
					]
				},
				{
					version: '22.8.2',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'Unit specs for the seven building blocks that had none: StepComponent, the nextButton, previousButton and submitButton directives, StepperNavDirective, StepTriggerDirective and StepperThemeService. Coverage stopped at StepperComponent, so every regression in the pieces around it reached a release: an input signal compared instead of read left the projected controls permanently disabled, and a selector written with a descendant combinator stopped matching altogether. The suite now catches both kinds of break on its own, instead of waiting for someone to click through the documentation page.'
						},
						{
							type: 'fixed',
							description:
								'Projected nextButton and previousButton controls no longer arrive permanently disabled. Both directives compared the adjacent step disabled input signal itself instead of reading its value, so the expression was a function and therefore always truthy whenever an adjacent step existed. Every custom navigation button a consumer projected was inert and only the built-in controls worked, which is the opposite of what the directives exist for.'
						},
						{
							type: 'fixed',
							description:
								'StepComponent.isAccessible() now answers for the step it is asked about. It negated the disabled input signal rather than its value, so it returned false for every step, enabled or not, contradicting the contract its own documentation states.'
						},
						{
							type: 'fixed',
							description:
								'The variants "secondary", "neutral", "light" and "dark" are resolved by the stylesheet like the other five built-ins. The component built-in list had stayed at the five variants that predate 22.2.0, so the four added then took the custom-accent branch and were written as an inline style, which outranks both a consumer rule and the hub-stepper-theme() mixin. The rendered colour was already correct; what changes is that overriding the accent now behaves identically for all nine documented variants.'
						},
						{
							type: 'removed',
							description:
								'The console.warn for a step declared without a title and the console.error for an out-of-range goTo() are gone. Neither was guarded, so both shipped inside the published bundle and wrote into the console of every consuming application, the first once per untitled step on every render pass that created one. A library has no business logging into the console of its host. Navigation is unchanged: goTo() still ignores an index outside the steps collection.'
						},
						{
							type: 'deprecated',
							description:
								'StepperModule and StepperModule.forRoot() are deprecated and will be removed in 23.0.0. The module only re-exports the seven standalone building blocks, so importing them directly is the whole migration. forRoot() needs a word more: it is the only thing that registers the bundled en, es, ca, eu, gl, ast, an, de, zh and ar dictionaries, and those dictionaries are not part of the public API. A standalone application names the three built-in controls through the backLabel, continueLabel and submitLabel inputs of hub-stepper, or registers its own dictionary under HUBUI.STEPPER with provideHubTranslation() from ng-hub-ui-utils, which is also what supplies the HubTranslationService the translate pipe injects. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.8.1',
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
					version: '22.8.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'changed',
							description:
								'Default action labels now resolve HUBUI.STEPPER.* before the legacy flat keys. The component provides the namespace through HUB_TRANSLATION_PREFIX, so an application dictionary can feed the built-in navigation labels via provideHubTranslationAdapter() without reserving generic top-level keys. Existing flat dictionaries keep working — the bare key is still the fallback.'
						},
						{
							type: 'added',
							description:
								'README documentation for the application-wide translation adapter (provideHubTranslationAdapter() from ng-hub-ui-utils).'
						},
						{
							type: 'removed',
							description:
								'Removed the @angular/animations peer dependency. The package is deprecated upstream and the library never used it. Applications that installed it only for ng-hub-ui-stepper can drop it.'
						}
					]
				},
				{
					version: '22.7.1',
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
					version: '22.7.0',
					date: '2026-07-29',
					changes: [
						{
							type: 'added',
							description:
								'--hub-stepper-indicator-size — the canonical step-indicator diameter (calc(var(--hub-ref-space-3, 1rem) * 2)). The built-in nav is text-only; this is the published metric custom trigger templates and companion step/lifecycle tracks read, space-derived so a density re-theme moves it with the paddings and font sizes that already scale.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'added',
							description:
								'WAI-ARIA tablist semantics on the step rail: the rail is role="tablist" with aria-orientation, each trigger is role="tab" with aria-selected / aria-current="step" / aria-disabled, and each step content is a role="tabpanel" wired to its tab through stable generated ids.'
						},
						{
							type: 'added',
							description:
								'Keyboard navigation on the rail with a roving tabindex (single Tab stop): Arrow keys move between enabled tabs (skipping disabled ones, wrapping), Home/End jump to the first/last enabled tab, and Enter/Space activates the focused step under the same permission model as clicking.'
						},
						{
							type: 'added',
							description: "New railLabel input: accessible name of the step rail tablist (default 'Steps')."
						},
						{
							type: 'fixed',
							description:
								'Default rail triggers now declare type="button", so a stepper rendered inside a <form> no longer submits it when a step trigger is clicked.'
						}
					]
				},
				{
					version: '22.5.1',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'StepTriggerDirective selector used a descendant combinator and never instantiated; it now matches either attribute and captures its TemplateRef (groundwork — the stepper does not render custom triggers yet).'
						},
						{
							type: 'changed',
							description:
								'Declared the real ng-hub-ui-utils peer range (>=22.7.0); the previous >=1.2.0 floor allowed installs that fail at runtime.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging) — the SCSS now builds to dist/stepper/styles/… instead of dist/stepper/src/lib/styles/…, so @use 'ng-hub-ui-stepper/styles' resolves. Update any @use that reached into src/lib/styles."
						},
						{
							type: 'changed',
							description:
								'The variant input accepts any colour. On top of the built-in semantic accents it now takes a registered custom accent or a literal colour (#ff0000, rgb(…), oklch(…), a CSS named colour), resolved through resolveHubAccent from ng-hub-ui-utils: a bareword becomes var(--hub-sys-color-<name>, <name>) and a literal is used as is.'
						},
						{
							type: 'changed',
							description:
								'Internal — host bindings moved from the @HostBinding / @HostListener decorators to the host metadata object, per the Angular style guide. No public API or behaviour change.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-06',
					changes: [
						{
							type: 'removed',
							description:
								'BREAKING — the legacy ng80-stepper / ng80-step element selectors are gone. The components match only hub-stepper / hub-ui-stepper and hub-step / hub-ui-step; replace any <ng80-stepper> / <ng80-step> markup. The major stays at 22 because it tracks the supported Angular major, so this breaking removal ships as a minor.'
						},
						{
							type: 'fixed',
							description:
								'CSS variable fallbacks realigned to the ds light defaults (--hub-sys-color-primary: #009ef7 → #0d6efd). Fallbacks only apply when ng-hub-ui-ds is not loaded.'
						},
						{
							type: 'fixed',
							description:
								'The default values in docs/css-variables-reference.md and the README theming example were resynchronized with the actual declarations.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-06-30',
					changes: [
						{
							type: 'added',
							description:
								"New truncateTitles input: each rail title is clipped to --hub-stepper-nav-title-max-width (default 12rem) and reveals its full text on hover when it overflows. The tooltip is agnostic — the hub-ui one by default, swappable with provideHubTooltip. Off by default. Requires ng-hub-ui-utils >= 22.6.0 and @use 'ng-hub-ui-utils/styles/tooltip'."
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'added',
							description:
								'Open-set accent variants. variant now covers primary, secondary, success, danger, warning, info, neutral, light and dark out of the box, and any other name works with no recompile — define a single --hub-sys-color-<name> and the stepper derives its treatment from it.'
						},
						{
							type: 'added',
							description:
								'Derived accent roles --hub-stepper-accent-emphasis, --hub-stepper-accent-subtle and --hub-stepper-accent-on, mixed locally from the single --hub-stepper-accent slot. The active pill and the next / submit controls take their text colour from the on-accent role instead of a hardcoded white, so a light custom accent stays legible.'
						},
						{
							type: 'changed',
							description:
								'The accent role family is mixed in the OKLCH colour space for perceptually even tints across every accent, and hub-stepper-theme() re-derives it whenever $accent is passed.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-06-25',
					changes: [
						{
							type: 'fixed',
							description:
								'Design-token consistency pass: inline fallbacks aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii, theme-aware colours) routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-06-24',
					changes: [
						{
							type: 'added',
							description:
								'New variant input on <hub-stepper> selecting a semantic accent, and the new --hub-stepper-accent token it re-bases. Defaults to primary, so nothing changes visually until you set it.'
						},
						{
							type: 'added',
							description:
								'New hub-stepper-theme() Sass mixin: accent, surfaces, nav pills, controls, spacing and the sidebar width in one call. Every parameter is optional, so only the ones you pass are emitted as --hub-stepper-* overrides. The styles/ folder now ships inside the package.'
						},
						{
							type: 'changed',
							description:
								'BREAKING — the --hub-stepper-content-padding and --hub-stepper-nav-padding shorthands were replaced by the canonical directional -padding-x / -padding-y tokens. No visual change; set the directional pair instead of the removed shorthand.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{ type: 'changed', description: 'Aligned with Angular 22 and standardized the README documentation.' }
					]
				},
				{
					version: '21.2.1',
					date: '2026-06-13',
					changes: [
						{
							type: 'fixed',
							description:
								'StepperThemeService.setTheme no longer reaches for the global document, which threw ReferenceError: document is not defined during server-side rendering. It injects the DOCUMENT token instead, making runtime theming SSR-safe.'
						}
					]
				},
				{
					version: '21.2.0',
					date: '2026-03-19',
					changes: [
						{
							type: 'added',
							description: 'StepperAnimationDirection enum exported for typed animation direction values.'
						},
						{
							type: 'added',
							description:
								'Step indexes are now automatically assigned by StepperComponent via a reactive effect — no manual [index] binding required.'
						},
						{
							type: 'changed',
							description:
								'StepComponent.index is now an internal writable signal. Remove all [index]="N" bindings from hub-step templates.'
						},
						{
							type: 'changed',
							description:
								'StepComponent.disabled simplified to a direct signal input (input(false)), removing the getter/setter and disabled$ backing signal.'
						},
						{
							type: 'changed',
							description:
								'StepperComponent.currentIndex is now a writable signal — call as currentIndex() instead of the previous getter.'
						},
						{
							type: 'changed',
							description:
								'Renamed internal signals: removed $ suffix from currentIndex, contentAnimating, animationDirection.'
						},
						{
							type: 'removed',
							description:
								'StepComponent.disabled$ backing signal removed. Use the disabled signal input directly.'
						},
						{
							type: 'removed',
							description: '[index] template binding removed from StepComponent — managed internally.'
						}
					]
				},
				{
					version: '21.1.0',
					date: '2026-03-18',
					changes: [
						{ type: 'added', description: 'Angular 21 support with Signals-based architecture.' },
						{ type: 'added', description: 'contentChild and contentChildren for step and directive discovery.' },
						{ type: 'changed', description: 'All components and directives converted to standalone.' },
						{ type: 'fixed', description: 'Fixed step indices and validation during dynamic step additions.' }
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'options (hub-stepper)',
					type: 'StepperOptions',
					required: false,
					defaultValue: '{}',
					description: 'DOCS.STEPPER.API.INPUT.OPTIONS.DESCRIPTION'
				},
				{
					name: 'variant (hub-stepper)',
					type: 'string',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.STEPPER.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'backLabel (hub-stepper)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.STEPPER.API.INPUT.BACK_LABEL.DESCRIPTION'
				},
				{
					name: 'continueLabel (hub-stepper)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.STEPPER.API.INPUT.CONTINUE_LABEL.DESCRIPTION'
				},
				{
					name: 'submitLabel (hub-stepper)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.STEPPER.API.INPUT.SUBMIT_LABEL.DESCRIPTION'
				},
				{
					name: 'truncateTitles (hub-stepper)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.STEPPER.API.INPUT.TRUNCATE_TITLES.DESCRIPTION'
				},
				{
					name: 'railLabel (hub-stepper)',
					type: 'string',
					required: false,
					defaultValue: "'Steps'",
					description: 'DOCS.STEPPER.API.INPUT.RAIL_LABEL.DESCRIPTION'
				},
				{
					name: 'title (hub-step)',
					type: 'string',
					required: false,
					description: 'DOCS.STEPPER.API.INPUT.TITLE.DESCRIPTION'
				},
				{
					name: 'disabled (hub-step)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.STEPPER.API.INPUT.DISABLED.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'completed (hub-stepper)',
					type: 'OutputEmitterRef<void>',
					required: false,
					description: 'DOCS.STEPPER.API.OUTPUT.COMPLETED.DESCRIPTION'
				},
				{
					name: 'nextStep (hub-stepper)',
					type: 'OutputEmitterRef<number>',
					required: false,
					description: 'DOCS.STEPPER.API.OUTPUT.NEXT_STEP.DESCRIPTION'
				},
				{
					name: 'previousStep (hub-stepper)',
					type: 'OutputEmitterRef<number>',
					required: false,
					description: 'DOCS.STEPPER.API.OUTPUT.PREVIOUS_STEP.DESCRIPTION'
				}
			],
			templates: [
				{
					name: 'DOCS.STEPPER.API.TEMPLATE.0.NAME',
					description: 'DOCS.STEPPER.API.TEMPLATE.0.DESCRIPTION',
					example: `<hub-stepper>
  <ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
    <ol class="my-rail">
      @for (step of steps; track step; let i = $index) {
        <li [class.current]="i === currentIndex">{{ step.title() || 'Step ' + (i + 1) }}</li>
      }
    </ol>
  </ng-template>

  <hub-step title="Account">…</hub-step>
  <hub-step title="Review">…</hub-step>
</hub-stepper>`
				},
				{
					name: 'DOCS.STEPPER.API.TEMPLATE.3.NAME',
					description: 'DOCS.STEPPER.API.TEMPLATE.3.DESCRIPTION',
					example: `<hub-stepper #wizard>
  <ng-template hubStepTrigger let-title="title" let-index="index" let-isCurrent="isCurrent" let-disabled="disabled">
    <button type="button" role="tab" [attr.aria-selected]="isCurrent" [disabled]="disabled" (click)="wizard.goTo(index)">
      <span class="badge">{{ index + 1 }}</span> {{ title }}
    </button>
  </ng-template>

  <hub-step title="Account">…</hub-step>
  <hub-step title="Review">…</hub-step>
</hub-stepper>`
				},
				{
					name: 'provideHubStepper',
					description: 'DOCS.STEPPER.API.TEMPLATE.1.DESCRIPTION',
					example: `providers: [provideHubStepper({ language: 'en', fallbackLanguage: 'en' })]`
				},
				{
					name: 'STEPPER_DICTIONARIES',
					description: 'DOCS.STEPPER.API.TEMPLATE.2.DESCRIPTION',
					example: `provideHubTranslation({ language: 'ca', dictionaries: { ca: { ...STEPPER_DICTIONARIES['ca'], ...myLabels } } })`
				}
			],
			cssVariables: MD_CSS_VARIABLES['stepper'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['stepper'],
			demos: [
				{
					title: 'Theming with hub-stepper-theme',
					previewComponent: MixinStepperExampleComponent,
					code: `@use 'ng-hub-ui-stepper/styles' as stepper;

.stepper-mixin-scope {
	@include stepper.hub-stepper-theme(
		$accent: #7c3aed,
		$nav-link-active-bg: #7c3aed,
		$nav-link-active-color: #ffffff,
		$gap: 1.5rem
	);
}`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the examples and builds the grouped
	 * functionalities shown on the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
	}

	/**
	 * Registers all interactive examples for the stepper package.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'stepper-basic',
				title: 'DOCS.STEPPER.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicStepperExampleComponent',
				files: ['basic-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/basic-stepper-example.component').then((m) => m.BasicStepperExampleComponent)
			},
			{
				id: 'stepper-modal',
				title: 'DOCS.STEPPER.EXAMPLE.MODAL.TITLE',
				componentName: 'ModalStepperExampleComponent',
				files: ['modal-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/modal-stepper-example.component').then((m) => m.ModalStepperExampleComponent)
			},
			{
				id: 'stepper-validation',
				title: 'DOCS.STEPPER.EXAMPLE.VALIDATION.TITLE',
				componentName: 'ValidationStepperExampleComponent',
				files: ['validation-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/validation-stepper-example.component').then(
						(m) => m.ValidationStepperExampleComponent
					)
			},
			{
				id: 'stepper-programmatic',
				title: 'DOCS.STEPPER.EXAMPLE.PROGRAMMATIC.TITLE',
				componentName: 'ProgrammaticStepperExampleComponent',
				files: ['programmatic-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/programmatic-stepper-example.component').then(
						(m) => m.ProgrammaticStepperExampleComponent
					)
			},
			{
				id: 'stepper-orientation',
				title: 'DOCS.STEPPER.EXAMPLE.ORIENTATION.TITLE',
				componentName: 'OrientationStepperExampleComponent',
				files: ['orientation-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/orientation-stepper-example.component').then(
						(m) => m.OrientationStepperExampleComponent
					)
			},
			{
				id: 'stepper-theming',
				title: 'DOCS.STEPPER.EXAMPLE.THEMING.TITLE',
				componentName: 'ThemingStepperExampleComponent',
				files: ['theming-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/theming-stepper-example.component').then(
						(m) => m.ThemingStepperExampleComponent
					)
			},
			{
				id: 'stepper-custom-nav',
				title: 'DOCS.STEPPER.EXAMPLE.CUSTOM_NAV.TITLE',
				componentName: 'CustomNavStepperExampleComponent',
				files: ['custom-nav-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/custom-nav-stepper-example.component').then(
						(m) => m.CustomNavStepperExampleComponent
					)
			},
			{
				id: 'stepper-custom-controls',
				title: 'DOCS.STEPPER.EXAMPLE.CUSTOM_CONTROLS.TITLE',
				componentName: 'CustomControlsStepperExampleComponent',
				files: ['custom-controls-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/custom-controls-stepper-example.component').then(
						(m) => m.CustomControlsStepperExampleComponent
					)
			},
			{
				id: 'stepper-animations',
				title: 'DOCS.STEPPER.EXAMPLE.ANIMATIONS.TITLE',
				componentName: 'AnimatedStepperExampleComponent',
				files: ['animated-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/animated-stepper-example.component').then(
						(m) => m.AnimatedStepperExampleComponent
					)
			},
			{
				id: 'stepper-i18n',
				title: 'DOCS.STEPPER.EXAMPLE.I18N.TITLE',
				componentName: 'I18nStepperExampleComponent',
				files: ['i18n-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/i18n-stepper-example.component').then((m) => m.I18nStepperExampleComponent)
			},
			{
				id: 'stepper-rtl',
				title: 'DOCS.STEPPER.EXAMPLE.RTL.TITLE',
				componentName: 'RtlStepperExampleComponent',
				files: ['rtl-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/rtl-stepper-example.component').then((m) => m.RtlStepperExampleComponent)
			},
			{
				id: 'stepper-truncated-titles',
				title: 'DOCS.STEPPER.EXAMPLE.TRUNCATED_TITLES.TITLE',
				componentName: 'TruncatedTitlesStepperExampleComponent',
				files: ['truncated-titles-stepper-example.component.ts'],
				loader: () =>
					import('../examples/stepper/truncated-titles-stepper-example.component').then(
						(m) => m.TruncatedTitlesStepperExampleComponent
					)
			}
		];

		examples.forEach((example) => {
			this._exampleRegistry.register({
				...example,
				packagePath: 'stepper'
			});
		});
	}

	/**
	 * Populates grouped feature data using registered example metadata.
	 */
	private populateFunctionalities(): void {
		const examples = this._exampleRegistry.getAll().filter((example) => example.packagePath === 'stepper');

		const mapToFeature = (example: any): FeatureExample => ({
			title: example.title,
			description: example.title,
			import: '',
			template: '',
			component: '',
			previewComponent: STEPPER_PREVIEW_COMPONENTS[example.id]
		});

		const core = examples
			.filter((example) => ['stepper-basic', 'stepper-orientation', 'stepper-truncated-titles'].includes(example.id))
			.map(mapToFeature);

		const advanced = examples
			.filter((example) =>
				[
					'stepper-validation',
					'stepper-programmatic',
					'stepper-custom-nav',
					'stepper-custom-controls',
					'stepper-animations',
					'stepper-i18n',
					'stepper-rtl',
					'stepper-modal'
				].includes(example.id)
			)
			.map(mapToFeature);

		const styling = examples.filter((example) => ['stepper-theming'].includes(example.id)).map(mapToFeature);

		this.stepperLibrary.functionalities = [
			{
				title: 'DOCS.STEPPER.FEATURE.CORE_USAGE.TITLE',
				description: 'DOCS.STEPPER.FEATURE.CORE_USAGE.DESCRIPTION',
				examples: core
			},
			{
				title: 'DOCS.STEPPER.FEATURE.ADVANCED_FLOWS.TITLE',
				description: 'DOCS.STEPPER.FEATURE.ADVANCED_FLOWS.DESCRIPTION',
				examples: advanced
			},
			{
				title: 'DOCS.STEPPER.FEATURE.STYLING.TITLE',
				description: 'DOCS.STEPPER.FEATURE.STYLING.DESCRIPTION',
				examples: styling
			}
		];
	}
}
