import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { MODAL_PLAYGROUND } from './modal-playground';
import { MixinModalExampleComponent } from '../examples/modal/mixin-modal-example.component';

/**
 * Main modal library page component
 */
@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-library-page [library]="modalLibrary" [package]="'modal'" [hideTabs]="true" [playground]="playgroundConfigs">
		</app-library-page>
	`
})
export class ModalComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = MODAL_PLAYGROUND;

	/**
	 * Complete modal library data
	 */
	modalLibrary: Library = {
		title: 'ng-hub-ui-modal',
		description:
			'A decoupled and independent modal component, originally based on the modals from ng-bootstrap but with additional features and flexibility. It aims to offer a more versatile and customizable modal solution for Angular applications.',
		overview: {
			text: 'This modal component provides a complete and flexible solution for creating modal dialogs in Angular applications. Built as a standalone component with full TypeScript support and Bootstrap compatibility, it offers advanced features like content projection, custom dismiss triggers, and typed data payloads.',
			highlights: [
				{
					icon: 'fa-solid fa-layer-group',
					title: 'Stacked Modal Support',
					description:
						'Open multiple modals on top of each other with automatic z-index management and individual backdrop layers.'
				},
				{
					icon: 'fa-solid fa-up-right-and-down-left-from-center',
					title: 'Dynamic Component Loading',
					description:
						'Inject any Angular component into the modal body at runtime using the HubModal service — no template changes needed.'
				},
				{
					icon: 'fa-solid fa-keyboard',
					title: 'Escape Key & Backdrop Dismiss',
					description:
						'Pressing Escape or clicking the backdrop closes the topmost modal — both behaviours are individually configurable.'
				},
				{
					icon: 'fa-solid fa-lock',
					title: 'Scroll Lock & Focus Trap',
					description:
						'Body scroll is locked and keyboard focus is trapped within the modal to prevent accidental interaction with background content.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'ARIA dialog Role',
					description:
						'Correct role="dialog", aria-modal, aria-labelledby, and aria-describedby attributes ensure screen readers announce modals correctly.'
				},
				{
					icon: 'fa-solid fa-droplet',
					title: 'Semantic Accent',
					description:
						'A variant re-bases one token and the dialog follows it: tinted surface, accent borders and accent title. The nine design-system colours ship compiled, and any other name works from a single rule of your own.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'CSS Variable Theming',
					description:
						'Backdrop opacity, border radius, shadow, header background, and all spacing values are driven by CSS custom properties.'
				},
				{
					icon: 'fa-solid fa-reply-all',
					title: 'Return Value Promise',
					description:
						'HubModalRef exposes a result Promise that resolves with whatever value the inner component passes on close — perfect for confirmations.'
				}
			],
			changelog: [
				{
					version: '22.12.0',
					date: '2026-09-13',
					changes: [
						{
							type: 'added',
							description:
								'What headerSelector projects now lands in .hub-modal__heading, a box beside the close button laid out by four new variables: --hub-modal-heading-direction, --hub-modal-heading-align-items, --hub-modal-heading-gap and --hub-modal-header-align-items. A subtitle can stack under its title with column, and the close button can stay at the top of a two-line heading with flex-start.'
						},
						{
							type: 'changed',
							description:
								"Projected header nodes sit one level deeper: they are children of .hub-modal__heading, not of .hub-modal__header. With the defaults nothing moves. Selectors on the header's direct children stop matching, and auto margins on a projected node now resolve inside the heading. BREAKING_CHANGES.md lists what moves and how to migrate."
						},
						{
							type: 'fixed',
							description:
								'In a right-to-left document the close button sat next to the title instead of at the end of the header. It now sits at the far end in either direction, and a title that cannot wrap, such as a URL, no longer pushes it past the edge of the dialog.'
						}
					]
				},
				{
					version: '22.11.1',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency. The stylesheet reads twenty-one distinct --hub-sys-* and --hub-ref-* tokens across eighty-six references, and until now the manifest said nothing about where they come from: a consumer installing the modal on its own got the fallback values and no hint that a shared palette exists. peerDependenciesMeta marks it optional, exactly as ng-hub-ui-panels already does, so nothing warns a project that themes on its own. Install metadata only; no code changes.'
						},
						{
							type: 'added',
							description:
								'Both READMEs state where this library stands on server-side rendering. The honest answer is not verified: a dialog only exists after a gesture, so the site prerender, which is the running proof for the libraries that render markup on the page, never draws one.'
						},
						{
							type: 'changed',
							description:
								'HubModalBackdrop no longer declares ViewEncapsulation.None. It has an empty template and no stylesheet of its own, so the setting had nothing to leak and nothing to protect; the rules that dress .hub-modal__backdrop are emitted from HubModalWindow, which does declare it. Removing a style-encapsulation override from a component with no styles changes nothing at runtime.'
						},
						{
							type: 'changed',
							description:
								'HubModalWindow says why it leaves style encapsulation, as CODING_RULES.md requires of every exception. Most of that stylesheet dresses elements outside the window own view: body.hub-modal-open, the :root block the backdrop reads, and .hub-modal__backdrop itself, a sibling component rather than a descendant, none of which can ever carry the window marker attribute.'
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'closeAriaLabel names the dismiss button the library draws, so an application can finally translate it. That button carries no text, because its glyph is painted by CSS, which makes its aria-label the entire name a screen reader reads out, and it was the literal Close written into the template: a localized application shipped one control it had no way to translate, and not a rare one, since that header is what the library builds whenever headerSelector or footerSelector is set. The option follows the shape every other option here already has, sitting on HubModalOptions with its default on HubModalConfig, so it can be set once for the whole application or per call. It still defaults to Close, so nothing changes for an application that says nothing.'
						},
						{
							type: 'changed',
							description:
								'modal-stack.ts no longer dresses the component host with component-host-scrollable. That element is only a query root: splitIntoSlots takes its children into the window and the host itself never enters the document, and this library ships no rule for the class either, so the line could not affect anything a consumer can see. scrollable still reaches the dialog through hub-modal__dialog--scrollable, set in HubModalWindow, and keeps working exactly as before. The old FIXME that asked for this is replaced by a note saying why the host cannot be styled, so the class does not come back.'
						},
						{
							type: 'changed',
							description:
								'Internal hygiene in the same file, with no change in behaviour: the JSDoc of extractAndRemoveNodesBySelector moved from above splitIntoSlots, where it described a function it did not belong to, down onto its own; a const bound to the void return of addEventListener was dropped; a selector that was queried twice in a row to remove what had just been read now reuses the single result; and the two remaining Spanish comments, which only restated the line under them, are gone.'
						},
						{
							type: 'fixed',
							description:
								'The documentation described an API this library does not have. Both READMEs opened with zero external dependencies while four files import from ng-hub-ui-utils and the manifest declares it as a peer, so the install instructions left a reader one unresolved import short of a build. offcanvas was missing from the English options table and from both HubModalUpdatableOptions lists, which reads as if a drawer could not be toggled on an open dialog; the Spanish table was missing ariaLabelledBy, ariaDescribedBy and bodySelector on top of that, and the Spanish API reference had no HubActiveModal, ModalDismissReasons, HubModalConfig or BEM class sections at all. All of it now matches modal-config.ts.'
						},
						{
							type: 'fixed',
							description:
								'The zindex rename shipped in 22.2.0 had no migration entry. --hub-modal-z-index became --hub-modal-zindex and --hub-modal-backdrop-z-index became --hub-modal-backdrop-zindex, and a custom property nobody reads raises no error, so a host that had set the old names lost them in silence, with a dialog sliding behind its own chrome as the only symptom. BREAKING_CHANGES.md now carries that section, where it belonged since June.'
						},
						{
							type: 'deprecated',
							description:
								'HubModalModule is deprecated and will be removed in 23.0.0. Its whole body is providers: [HubModal], and HubModal is providedIn: root, so importing the module never enabled the service; it only added a redundant second instance in whichever injector declared the import, delegating to the same root HubModalStack and HubModalConfig. Inject HubModal and drop the import. The class carried no @deprecated tag until now, so neither an editor nor the build could warn anyone it was on its way out. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-09-05',
					changes: [
						{
							type: 'fixed',
							description:
								"A custom property is substituted where it is DECLARED, and the library declared its whole default block on :root. Every token derived from another --hub-modal-* token therefore resolved against the root's values and reached the dialog already cooked, which is why assigning a shorthand did so little: --hub-modal-padding-x: 3rem left the header at 16px, --hub-modal-margin-y: 5rem left the dialog at 28px, a dark --hub-modal-bg kept a white footer, --hub-modal-color left the title at #212529, --hub-modal-border-radius never reached the placement corners, and a variant re-basing --hub-modal-accent recoloured the top bar and the title over a tint still mixed from the host's own brand colour — which is the symptom that started this: a warning dialog on an olive-green product painted its bar yellow and kept a green background and green header and footer rules. The defaults now sit under :where(.hub-modal). It matches the same element and contributes zero specificity, so a consumer's own .hub-modal rule still wins — which is what 22.8.0 moved to :root to achieve — and every link of every chain now resolves against the value that won ON THAT ELEMENT, whether it came from a variant class, a windowClass or the consumer's own rule. A custom variant is finally what the stylesheet always claimed: one rule re-bases the accent and the tint, the borders and the title re-derive from it."
						},
						{
							type: 'fixed',
							description:
								'HubModal.open() with a plain string opened an empty dialog the keyboard could not close. Every other kind of content passes through splitIntoSlots, which returns the three slots attachContent destructures — header, body, footer. The string path returned one, so the text was appended to the HEADER and the body arrived undefined; appending it threw a TypeError part-way through the open sequence, before the window armed its Escape listener. The dialog rendered blank, with no content and no close button, and Escape did nothing because no listener existed — the backdrop click was the only way out. The string now goes into the body slot like everything else, pinned by three specs. This is the second time Escape has stopped working for a reason unrelated to the keyboard; 22.4.1 was the first, when NgZone.onStable never emitted in a zoneless app and the listener was likewise never attached.'
						},
						{
							type: 'fixed',
							description:
								'--hub-modal-title-color reached a title classed hub-modal__title. The rule that reads it matched .modal-title alone, the name from when this library sat on top of Bootstrap and the name every example here still writes. A consumer who never used Bootstrap wrote the house name, read the token in the README and got nothing. Both class names are matched now, and neither is going away: the heading is authored by the caller, not by the library, so it cannot simply be renamed.'
						},
						{
							type: 'changed',
							description:
								"The accent bar above a variant dialog is off by default: --hub-modal-accent-bar-width ships at 0 instead of 0.25rem. The bar was the loudest half of a variant and the half nobody asked for — the dialog already reads as danger through its tint, its two borders and its title, and the stripe mostly competed with whatever the host had put at the top of its own chrome. The bar is now a layer on the content rather than its top border: as a border it replaced the dialog's own top edge, so switching it off left a tinted box with three sides and an open top. A variant dialog is 3px shorter as a result, and turning the bar back on no longer costs the frame. It is one assignment away, and it goes on the dialog: .hub-modal reaches every dialog in the application, a windowClass only some. Not :root, because the token is declared on the element and an inherited value loses to it, which is the same rule the rest of this release is about."
						},
						{
							type: 'changed',
							description:
								'On a warning or danger dialog the footer background now follows the accent-tinted surface instead of staying white. --hub-modal-footer-bg derives from --hub-modal-bg, a variant sets --hub-modal-bg to the accent tint, and on :root that derivation never saw the variant. It is the same defect being corrected, and the only rendering this release changes that nobody chose. Measured rather than inspected: 19,470 computed properties across 81 dialog configurations plus the backdrop, old stylesheet against new, and exactly 64 differed — 18 this footer, and 46 the accent bar standing down (16 top-border widths, 16 top-border colours and 14 heights). The default dialog, every size, centered, scrollable, fullscreen, every placement, offcanvas and the backdrop are byte-identical.'
						},
						{
							type: 'changed',
							description:
								"Breaking: the defaults are no longer declared on :root. 22.8.0 put them there three days ago so that the runtime-injected stylesheet would stop beating a consumer's own .hub-modal rule on source order alone; :where() buys the same thing without costing the derivations. Anyone who took that opportunity to set a --hub-modal-* token on :root, html or body now loses to the library's element-level default and has to move the declaration onto the dialog. The documented routes are unaffected and work better than before: a .hub-modal rule, a windowClass, the hub-modal-theme() mixin. What a SIBLING reads stays on :root — --hub-modal-zindex, --hub-modal-backdrop-zindex and the four backdrop tokens — because .hub-modal__backdrop is not a descendant of .hub-modal and cannot inherit from it. That leaves one pair that still will not follow the dialog, and it is better said than discovered: raising --hub-modal-zindex on .hub-modal moves the window and leaves the backdrop behind, measured at 3000 against 1054. No declaration site fixes it, because two siblings cannot share a value through inheritance. Theme the stacking order on :root, or give the backdrop its own token through backdropClass. See BREAKING_CHANGES.md."
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-09-03',
					changes: [
						{
							type: 'fixed',
							description:
								'The dialog no longer opens with focus on its own close button. Being first in the DOM, it took focus on every open: a destructive confirm opened with the caret on «cancel this dialog» rather than on what the dialog asks. It is skipped when choosing where focus lands; hubAutofocus still names it explicitly for anyone who wants it there.'
						},
						{
							type: 'fixed',
							description:
								"The close button's focus ring follows the dialog accent instead of the browser default, and is :focus-visible so a mouse click leaves no ring. Four new slots: --hub-modal-close-focus-ring-width, -color, -offset and -radius."
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-09-02',
					changes: [
						{
							type: 'added',
							description:
								'offcanvas: a dialog that touches the edge it slid out of. placement always slid a dialog in from an edge, but never assumed one anchored to an edge wants to touch it: it kept the margins of a floating dialog, which left a strip of page showing along the bottom, kept the rounding on the side it was attached to, was sized by its content rather than reaching the floor, and took its width from the size scale, where lg is 800px and covers the document the drawer is meant to be read against. offcanvas: true settles all four, with its own width through --hub-modal-offcanvas-width. Separate from placement rather than implied by it, so an existing consumer of placement sees exactly what it saw.'
						},
						{
							type: 'changed',
							description:
								"The library's default custom properties are declared on :root rather than on .hub-modal. This stylesheet is injected at runtime, so on .hub-modal every default beat a consumer's own .hub-modal rule at equal specificity by source order alone, and assigning a token did nothing unless you out-specified the primitive. On :root the values arrive by inheritance and any declaration closer to the element wins. Breaking: a .hub-modal rule of yours now applies where it was silently ignored. See BREAKING_CHANGES.md."
						}
					]
				},
				{
					version: '22.7.1',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. It is the link a registry shows beside the package, and landing on a front page you then have to search is a worse answer than landing on the reference for the package you were already looking at. Metadata only — no code, no types and no styles change."
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-08-21',
					changes: [
						{
							type: 'added',
							description:
								'bodySelector: the body becomes a slot with a name. It was the one part of a modal with no way to point at it — the body was whatever survived the header and the footer being taken out, which holds only while the three parts are written in order and the content contains nothing else. A comment, a stray text node or an ng-container holding state joined the body, and moving a block in the template changed the result. Adding the option to content that already works cannot lose anything: whatever the selector matches goes into the body first, and everything unclaimed by any of the three slots follows it. Fixed alongside it, because naming the body is what exposed it: the body used to be read BETWEEN the header and footer extractions, so the footer marker was still a child when the body was captured and an emptied div rode along into it.'
						},
						{
							type: 'fixed',
							description:
								'Every dialog is bounded by the viewport, and its body is what scrolls. This was scrollable\'s job alone, which put the decision in the wrong hands: whether a dialog outgrows the screen depends on its content, on the length of the translation and on the height of the window, and the caller knows none of the three when it opens the thing. A dialog that outgrew the screen simply extended past it, and what falls off the bottom is the footer — in a wizard, the "Next" button, unreachable. The cap is stated against the viewport (100dvh minus --hub-modal-dialog-inset), because the dialog\'s own height is auto and a percentage against it is not a definite reference. This changes the default: a consumer that deliberately let a dialog run past the viewport now gets a capped dialog with a scrolling body. scrollable keeps its own meaning — it is what pins the dialog itself.'
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'The dialog now travels between heights instead of jumping. A modal is sized by whatever it holds, so a wizard step or an async panel changing would snap the box to its new height in a single frame. The obvious repair does not work and was measured rather than assumed: the specified height is auto before the change and auto after it, and a CSS transition only fires when the specified value changes — the content moved, the property did not. interpolate-size does not help either; it interpolates to a keyword, it does not notice a box growing underneath one. So both heights are measured and animated explicitly, which also behaves identically in every browser. Tuned with --hub-modal-resize-duration and --hub-modal-resize-easing, disabled by [animation]="false" and by prefers-reduced-motion. Width already animated and is untouched.'
						}
					]
				},
				{
					version: '22.5.1',
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
					version: '22.5.0',
					date: '2026-07-27',
					changes: [
						{
							type: 'changed',
							description:
								'Typed modal flows: open<C, R, D>(content, options) infers the content component type, so HubModalRef.componentInstance is the component instance (no more as unknown as casts); R types the result end to end (close(result?), result: Promise<R>, closed: Observable<R>, HubActiveModal<D, R>) and HubModalOptions<D> types the data payload. All generics default to the previous loose types, so existing call sites compile unchanged.'
						}
					]
				},
				{
					version: '22.4.2',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Declared the real ng-hub-ui-utils peer range (>=22.0.0); the previous >=1.0.0 floor allowed resolving an incompatible utils major.'
						}
					]
				},
				{
					version: '22.4.1',
					date: '2026-07-10',
					changes: [
						{
							type: 'fixed',
							description:
								'Escape and backdrop click did nothing in a zoneless application. The window and the backdrop deferred their entry work to NgZone.onStable, and under provideZonelessChangeDetection() the injected zone is a NoopNgZone whose onStable never emits, so that work never ran: _show() — and with it _enableEventHandling() — never executed, leaving every modal unclosable by Escape or by clicking the backdrop, because no listener had ever been attached. Both defer with afterNextRender now, which fires in zoneful and zoneless apps alike. No API change.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-07',
					changes: [
						{
							type: 'changed',
							description:
								"BREAKING (packaging): the SCSS ships at ng-hub-ui-modal/styles. The theme mixin now builds to dist/modal/styles/… (was dist/modal/src/lib/styles/…), so @use 'ng-hub-ui-modal/styles' resolves. Update any @use that reached into src/lib/styles. See BREAKING_CHANGES.md."
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'Typed modal payload: inject the new HUB_MODAL_DATA token or use inject(HubActiveModal).data (HubActiveModal is now generic, HubActiveModal<D>) instead of the old untyped data field (now deprecated).'
						}
					]
				},
				{
					version: '22.2.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'Docs: the default values in docs/css-variables-reference.md were resynchronized with the actual code declarations, now guarded by the repo-level tokens-parity check.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'BREAKING: canonical zindex token names — --hub-modal-z-index becomes --hub-modal-zindex and --hub-modal-backdrop-z-index becomes --hub-modal-backdrop-zindex, with no hyphen, matching the --hub-sys-zindex-* convention. A host that set the old names lost them silently, since a custom property nobody reads raises no error. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'The accent system moved to the open-set local accent slot: a variant re-bases a single --hub-modal-accent, and the role family (--hub-modal-accent-emphasis, -subtle, -border and the new -on) derives locally from it with color-mix(in oklch, …), mirroring the ng-hub-ui-ds engine. The built-in list grew from five to the nine canonical accents (primary, secondary, success, danger, warning, info, neutral, light, dark), and any custom accent recolours the whole dialog with one rule that re-bases the slot.'
						},
						{
							type: 'added',
							description:
								"New tokens --hub-modal-accent-on (a grayscale contrast flip driven by the accent's own lightness, for accent-filled surfaces) and --hub-modal-accent-emphasis."
						},
						{
							type: 'fixed',
							description:
								'The accent color-mix() derivations (--hub-modal-accent-subtle / -border) moved from srgb to oklch for perceptually uniform tints, matching ng-hub-ui-ds. The subtle tint derives at 12% (was 8%).'
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-06-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Corrected both peer dependency ranges. Angular moved to >=18.0.0: the library uses signal input()/output(), the @if control flow and signal queries, so the previous >=16.0.0 let it install on versions it cannot run on. ng-hub-ui-utils moved to >=1.0.0: the previous caret range resolved to >=1 <2, which excluded the current utils (22.x) and made the peer impossible to satisfy.'
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
								'Design-token consistency pass: the inline fallback defaults were aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) were routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
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
								"The variant option: a semantic accent for meaningful dialogs. The built-in values (primary, success, danger, warning, info) map to the design-system colours, but any string is accepted — the modal reads --hub-sys-color-<variant> from the host application. It is updatable through HubModalRef.update() / HubActiveModal.update(), and can be applied directly with windowClass: 'hub-modal--<variant>'."
						},
						{
							type: 'added',
							description:
								'The hub-modal-theme() Sass mixin: accent, surfaces, colour, title, borders, radius, shadow, header/body/footer padding and gaps, and the backdrop, in one call. Every parameter is optional and defaults to null, so only what you pass is emitted as a --hub-modal-* override. New tokens alongside it: --hub-modal-accent, --hub-modal-accent-subtle, --hub-modal-accent-border, --hub-modal-accent-bar-width and --hub-modal-title-color. No visual change for a neutral modal.'
						},
						{
							type: 'changed',
							description:
								'BREAKING: the uniform --hub-modal-close-padding and --hub-modal-title-margin shorthands were replaced by the canonical directional -x / -y tokens. Set those instead. No visual change; the dialog per-side margin system is unchanged. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{ type: 'changed', description: 'Aligned with Angular 22, and the README documentation standardized.' }
					]
				},
				{
					version: '21.0.3',
					date: '2026-06-14',
					changes: [
						{
							type: 'fixed',
							description:
								"parentNode is guarded when the window and backdrop elements are removed during teardown, so an element already detached no longer raises Cannot read properties of null (reading 'removeChild')."
						}
					]
				},
				{
					version: '21.0.2',
					date: '2026-03-31',
					changes: [
						{
							type: 'changed',
							description: 'Standardized padding variables and improved fullscreen layout responsiveness.'
						}
					]
				},
				{
					version: '21.0.1',
					date: '2026-03-19',
					changes: [
						{
							type: 'changed',
							description:
								'Removed hardcoded design system token defaults from stylesheet; all --hub-modal-* variables retain literal fallback values.'
						},
						{ type: 'fixed', description: 'Fixed modal-backdrop and modal unit test reliability.' }
					]
				},
				{
					version: '21.0.0',
					date: '2026-03-10',
					changes: [
						{ type: 'added', description: 'HubModalPlacement configuration for anchored modal positioning.' },
						{ type: 'changed', description: 'BREAKING: Standardized CSS class names to hub-modal BEM convention.' }
					]
				}
			]
		},
		functionalities: [
			{
				title: 'DOCS.MODAL.FEATURE.OPENING_MODALS_CONTENT_TYPES.TITLE',
				description: 'DOCS.MODAL.FEATURE.OPENING_MODALS_CONTENT_TYPES.DESCRIPTION',
				examples: []
			},
			{
				title: 'DOCS.MODAL.FEATURE.CONFIGURATION_OPTIONS.TITLE',
				description: 'DOCS.MODAL.FEATURE.CONFIGURATION_OPTIONS.DESCRIPTION',
				examples: []
			},
			{
				title: 'DOCS.MODAL.FEATURE.MODAL_REFERENCE_HUBMODALREF.TITLE',
				description: 'DOCS.MODAL.FEATURE.MODAL_REFERENCE_HUBMODALREF.DESCRIPTION',
				examples: []
			},
			{
				title: 'DOCS.MODAL.FEATURE.ACTIVE_MODAL_HUBACTIVEMODAL.TITLE',
				description: 'DOCS.MODAL.FEATURE.ACTIVE_MODAL_HUBACTIVEMODAL.DESCRIPTION',
				examples: []
			},
			{
				title: 'DOCS.MODAL.FEATURE.STACK_MANAGEMENT.TITLE',
				description: 'DOCS.MODAL.FEATURE.STACK_MANAGEMENT.DESCRIPTION',
				examples: []
			}
		],
		api: {
			inputs: [
				{
					name: 'animation',
					type: 'boolean',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.ANIMATION.DESCRIPTION'
				},
				{
					name: 'ariaLabelledBy',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.ARIALABELLEDBY.DESCRIPTION'
				},
				{
					name: 'ariaDescribedBy',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.ARIADESCRIBEDBY.DESCRIPTION'
				},
				{
					name: 'closeAriaLabel',
					type: 'string',
					required: false,
					defaultValue: "'Close'",
					description: 'DOCS.MODAL.API.INPUT.CLOSEARIALABEL.DESCRIPTION'
				},
				{
					name: 'backdrop',
					type: 'boolean | "static"',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.BACKDROP.DESCRIPTION'
				},
				{
					name: 'beforeDismiss',
					type: '() => boolean | Promise<boolean>',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.BEFOREDISMISS.DESCRIPTION'
				},
				{
					name: 'centered',
					type: 'boolean',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.CENTERED.DESCRIPTION'
				},
				{
					name: 'placement',
					type: 'HubModalPlacement',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.PLACEMENT.DESCRIPTION'
				},
				{
					name: 'offcanvas',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.MODAL.API.INPUT.OFFCANVAS.DESCRIPTION'
				},
				{
					name: 'container',
					type: 'string | HTMLElement',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.CONTAINER.DESCRIPTION'
				},
				{
					name: 'fullscreen',
					type: 'boolean | "sm" | "md" | "lg" | "xl" | "xxl" | string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.FULLSCREEN.DESCRIPTION'
				},
				{
					name: 'injector',
					type: 'Injector',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.INJECTOR.DESCRIPTION'
				},
				{
					name: 'keyboard',
					type: 'boolean',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.KEYBOARD.DESCRIPTION'
				},
				{
					name: 'scrollable',
					type: 'boolean',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.SCROLLABLE.DESCRIPTION'
				},
				{
					name: 'size',
					type: '"sm" | "lg" | "xl" | string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'variant',
					type: '"primary" | "success" | "danger" | "warning" | "info" | string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.VARIANT.DESCRIPTION'
				},
				{
					name: 'windowClass',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.WINDOWCLASS.DESCRIPTION'
				},
				{
					name: 'modalDialogClass',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.MODALDIALOGCLASS.DESCRIPTION'
				},
				{
					name: 'backdropClass',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.BACKDROPCLASS.DESCRIPTION'
				},
				{
					name: 'dismissSelector',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.DISMISSSELECTOR.DESCRIPTION'
				},
				{
					name: 'closeSelector',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.CLOSESELECTOR.DESCRIPTION'
				},
				{
					name: 'headerSelector',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.HEADERSELECTOR.DESCRIPTION'
				},
				{
					name: 'footerSelector',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.FOOTERSELECTOR.DESCRIPTION'
				},
				{
					name: 'bodySelector',
					type: 'string',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.BODYSELECTOR.DESCRIPTION'
				},
				{
					name: 'data',
					type: 'D',
					required: false,
					description: 'DOCS.MODAL.API.INPUT.DATA.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'dismiss',
					type: 'any',
					required: false,
					description: 'DOCS.MODAL.API.OUTPUT.DISMISS.DESCRIPTION'
				}
			],
			methods: [
				{
					name: 'HubModal.open',
					signature:
						'open<C, R, D>(content: Type<C> | TemplateRef<any> | string, options?: HubModalOptions<D>): HubModalRef<C, R>',
					description: 'DOCS.MODAL.API.METHOD.OPEN.DESCRIPTION',
					returns: 'HubModalRef<C, R>'
				},
				{
					name: 'HubModal.dismissAll',
					signature: 'dismissAll(reason?: any): void',
					description: 'DOCS.MODAL.API.METHOD.DISMISS_ALL.DESCRIPTION'
				},
				{
					name: 'HubModal.hasOpenModals',
					signature: 'hasOpenModals(): boolean',
					description: 'DOCS.MODAL.API.METHOD.HAS_OPEN_MODALS.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HubModal.activeInstances',
					signature: 'activeInstances: EventEmitter<HubModalRef[]>',
					description: 'DOCS.MODAL.API.METHOD.ACTIVE_INSTANCES.DESCRIPTION',
					returns: 'EventEmitter<HubModalRef[]>'
				},
				{
					name: 'HubModalRef.close',
					signature: 'close(result?: R): void',
					description: 'DOCS.MODAL.API.METHOD.REF_CLOSE.DESCRIPTION'
				},
				{
					name: 'HubModalRef.dismiss',
					signature: 'dismiss(reason?: any): void',
					description: 'DOCS.MODAL.API.METHOD.REF_DISMISS.DESCRIPTION'
				},
				{
					name: 'HubModalRef.update',
					signature: 'update(options: HubModalUpdatableOptions): void',
					description: 'DOCS.MODAL.API.METHOD.REF_UPDATE.DESCRIPTION'
				},
				{
					name: 'HubModalRef.componentInstance',
					signature: 'componentInstance: C | void',
					description: 'DOCS.MODAL.API.METHOD.REF_COMPONENT_INSTANCE.DESCRIPTION',
					returns: 'C | void'
				},
				{
					name: 'HubModalRef.result',
					signature: 'result: Promise<R>',
					description: 'DOCS.MODAL.API.METHOD.REF_RESULT.DESCRIPTION',
					returns: 'Promise<R>'
				},
				{
					name: 'HubModalRef.closed',
					signature: 'closed: Observable<R>',
					description: 'DOCS.MODAL.API.METHOD.REF_CLOSED.DESCRIPTION',
					returns: 'Observable<R>'
				},
				{
					name: 'HubModalRef.dismissed',
					signature: 'dismissed: Observable<any>',
					description: 'DOCS.MODAL.API.METHOD.REF_DISMISSED.DESCRIPTION',
					returns: 'Observable<any>'
				},
				{
					name: 'HubModalRef.shown',
					signature: 'shown: Observable<void>',
					description: 'DOCS.MODAL.API.METHOD.REF_SHOWN.DESCRIPTION',
					returns: 'Observable<void>'
				},
				{
					name: 'HubModalRef.hidden',
					signature: 'hidden: Observable<void>',
					description: 'DOCS.MODAL.API.METHOD.REF_HIDDEN.DESCRIPTION',
					returns: 'Observable<void>'
				},
				{
					name: 'HubActiveModal.close',
					signature: 'close(result?: R): void',
					description: 'DOCS.MODAL.API.METHOD.ACTIVE_CLOSE.DESCRIPTION'
				},
				{
					name: 'HubActiveModal.dismiss',
					signature: 'dismiss(reason?: any): void',
					description: 'DOCS.MODAL.API.METHOD.ACTIVE_DISMISS.DESCRIPTION'
				},
				{
					name: 'HubActiveModal.update',
					signature: 'update(options: HubModalUpdatableOptions): void',
					description: 'DOCS.MODAL.API.METHOD.ACTIVE_UPDATE.DESCRIPTION'
				},
				{
					name: 'HubActiveModal.data',
					signature: 'data: D',
					description: 'DOCS.MODAL.API.METHOD.ACTIVE_DATA.DESCRIPTION',
					returns: 'D'
				}
			],
			templates: [
				{
					name: 'DOCS.MODAL.API.TEMPLATE.0.NAME',
					description: 'DOCS.MODAL.API.TEMPLATE.0.DESCRIPTION',
					example: `<ng-template #modalTemplate let-close="close" let-dismiss="dismiss">
  <div hubModalHeader>
    <h4 class="hub-modal__title">Modal Title</h4>
  </div>
  <div hubModalBody>
    Modal content goes here
  </div>
  <div hubModalFooter>
    <button hubButton color="secondary" (click)="dismiss()">Cancel</button>
    <button hubButton color="primary" (click)="close('result')">OK</button>
  </div>
</ng-template>

<!-- The three blocks become slots only when the selectors are given:
     this.modal.open(this.modalTemplate, {
       headerSelector: '[hubModalHeader]',
       bodySelector: '[hubModalBody]',
       footerSelector: '[hubModalFooter]'
     });
     Without them the whole template lands in hub-modal__body. -->`
				}
			],
			cssVariables: MD_CSS_VARIABLES['modal'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['modal'],
			demos: [
				{
					title: 'Theming with hub-modal-theme',
					previewComponent: MixinModalExampleComponent,
					code: `@use 'ng-hub-ui-modal/styles' as modal;

// A modal renders in an overlay outside the component tree, so the theme is
// applied through the window class you pass as \`windowClass\` when opening it.
.modal-mixin-demo {
	@include modal.hub-modal-theme($accent: #10b981, $bg: #f6fff9, $border-radius: 0.75rem);
}

// this.modal.open(tpl, { windowClass: 'modal-mixin-demo' });`
				}
			]
		}
	};

	/**
	 * Angular lifecycle hook. Registers the interactive examples for the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
	}

	/**
	 * Registers every modal example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'modal-content',
				title: 'DOCS.MODAL.EXAMPLE.CONTENT.TITLE',
				description: 'Demonstrates how to open modals using TemplateRef, Component Class, or simple strings.',
				componentName: 'ContentModalExampleComponent',
				files: ['content-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/content-modal-example.component').then((m) => m.ContentModalExampleComponent)
			},
			{
				id: 'modal-options',
				title: 'DOCS.MODAL.EXAMPLE.OPTIONS.TITLE',
				description: 'Explore various modal options like size, centering, backdrop behavior, and keyboard support.',
				componentName: 'OptionsModalExampleComponent',
				files: ['options-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/options-modal-example.component').then((m) => m.OptionsModalExampleComponent)
			},
			{
				id: 'modal-placement',
				title: 'DOCS.MODAL.EXAMPLE.PLACEMENT.TITLE',
				description: 'Open the same modal from the center, start, end, top, or bottom using the placement option.',
				componentName: 'PlacementModalExampleComponent',
				files: ['placement-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/placement-modal-example.component').then((m) => m.PlacementModalExampleComponent)
			},
			{
				id: 'modal-offcanvas',
				title: 'DOCS.MODAL.EXAMPLE.OFFCANVAS.TITLE',
				description:
					'The same panel with and without offcanvas, so the three costs of a floating dialog anchored to an edge are visible at once.',
				componentName: 'OffcanvasModalExampleComponent',
				files: ['offcanvas-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/offcanvas-modal-example.component').then((m) => m.OffcanvasModalExampleComponent)
			},
			{
				id: 'modal-ref',
				title: 'DOCS.MODAL.EXAMPLE.REF.TITLE',
				description:
					'Learn how to control the modal instance (close/dismiss) from the component that opened it using HubModalRef.',
				componentName: 'RefModalExampleComponent',
				files: ['ref-modal-example.component.ts'],
				loader: () => import('../examples/modal/ref-modal-example.component').then((m) => m.RefModalExampleComponent)
			},
			{
				id: 'modal-active',
				title: 'DOCS.MODAL.EXAMPLE.ACTIVE.TITLE',
				description: 'Shows how a modal component can control itself (close/dismiss) by injecting HubActiveModal.',
				componentName: 'ActiveModalExampleComponent',
				files: ['active-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/active-modal-example.component').then((m) => m.ActiveModalExampleComponent)
			},
			{
				id: 'modal-typed-data',
				title: 'DOCS.MODAL.EXAMPLE.TYPED_DATA.TITLE',
				description:
					'Pass a typed data payload when opening and read it back via HUB_MODAL_DATA (or HubActiveModal<D>.data) — no monkey-patched instance field.',
				componentName: 'TypedDataModalExampleComponent',
				files: ['typed-data-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/typed-data-modal-example.component').then((m) => m.TypedDataModalExampleComponent)
			},
			{
				id: 'modal-stack',
				title: 'DOCS.MODAL.EXAMPLE.STACK.TITLE',
				description: 'Demonstrates support for multiple stacked modals, where the last opened modal has focus.',
				componentName: 'StackModalExampleComponent',
				files: ['stack-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/stack-modal-example.component').then((m) => m.StackModalExampleComponent)
			},
			{
				id: 'modal-fullscreen',
				title: 'DOCS.MODAL.EXAMPLE.FULLSCREEN.TITLE',
				description: 'Example of a fullscreen modal covering the entire viewport.',
				componentName: 'FullscreenModalExampleComponent',
				files: ['fullscreen-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/fullscreen-modal-example.component').then(
						(m) => m.FullscreenModalExampleComponent
					)
			},
			{
				id: 'modal-projection',
				title: 'DOCS.MODAL.EXAMPLE.PROJECTION.TITLE',
				description:
					'Shows how to use content projection to create reusable modal wrapper components, and how closeAriaLabel names the dismiss button the library draws for them — that button ships as the English "Close" and the library translates nothing.',
				componentName: 'ProjectionModalExampleComponent',
				files: ['projection-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/projection-modal-example.component').then(
						(m) => m.ProjectionModalExampleComponent
					)
			},
			{
				id: 'modal-body-selector',
				title: 'DOCS.MODAL.EXAMPLE.BODY_SELECTOR.TITLE',
				description:
					'Names the body slot with bodySelector, so the order the content is written in stops deciding what the body is.',
				componentName: 'BodySelectorModalExampleComponent',
				files: ['body-selector-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/body-selector-modal-example.component').then(
						(m) => m.BodySelectorModalExampleComponent
					)
			},
			{
				id: 'modal-variants',
				title: 'DOCS.MODAL.EXAMPLE.VARIANTS.TITLE',
				description:
					'The nine built-in accents plus a custom one, to show that a variant re-bases a single slot and the tint, the borders, the top bar and the title all derive from it.',
				componentName: 'VariantsModalExampleComponent',
				files: ['variants-modal-example.component.ts'],
				loader: () =>
					import('../examples/modal/variants-modal-example.component').then((m) => m.VariantsModalExampleComponent)
			},
			{
				id: 'modal-styling',
				title: 'DOCS.MODAL.EXAMPLE.STYLING.TITLE',
				description: 'Custom theme example using --hub-modal-* variables with windowClass and backdropClass.',
				componentName: 'StylingModalExampleComponent',
				files: [
					'styling-modal-example.component.ts',
					'styling-modal-example.component.html',
					'styling-modal-example.component.scss'
				],
				loader: () =>
					import('../examples/modal/styling-modal-example.component').then((m) => m.StylingModalExampleComponent)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'modal'
			});
		});
	}
}
