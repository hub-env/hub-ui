import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { FeatureExample, Library } from '../../../models/interfaces';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicSignatureExampleComponent } from '../examples/signature/basic-signature-example.component';
import { DrawEventsSignatureExampleComponent } from '../examples/signature/draw-events-signature-example.component';
import { FormSignatureExampleComponent } from '../examples/signature/form-signature-example.component';
import { InheritedThemeSignatureExampleComponent } from '../examples/signature/inherited-theme-signature-example.component';
import { I18nSignatureExampleComponent } from '../examples/signature/i18n-signature-example.component';
import { KeyboardSignatureExampleComponent } from '../examples/signature/keyboard-signature-example.component';
import { MixinSignatureExampleComponent } from '../examples/signature/mixin-signature-example.component';
import { SurfaceSignatureExampleComponent } from '../examples/signature/surface-signature-example.component';
import { LabelTypeSignatureExampleComponent } from '../examples/signature/label-type-signature-example.component';
import { NamingSignatureExampleComponent } from '../examples/signature/naming-signature-example.component';
import { ProjectedTemplatesSignatureExampleComponent } from '../examples/signature/projected-templates-signature-example.component';

/** Documentation landing page for ng-hub-ui-signature. */
@Component({
	selector: 'app-signature',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `<app-library-page [library]="library" [package]="'signature'" />`
})
export class SignatureComponent implements OnInit {
	private readonly exampleRegistry = inject(ExampleRegistry);

	readonly library: Library = {
		title: 'ng-hub-ui-signature',
		description: 'SVG-backed signature field for Angular forms.',
		overview: {
			text: 'Capture mouse, touch, pen and keyboard signatures as scalable SVG form values, with undo, redo, clearing and PNG export.',
			highlights: [
				{
					icon: 'fa-solid fa-signature',
					title: 'SVG form value',
					description: 'Stores a scalable signature in Angular forms.'
				},
				{ icon: 'fa-solid fa-pen', title: 'Pointer input', description: 'Supports mouse, touch and pen.' },
				{
					icon: 'fa-solid fa-keyboard',
					title: 'Keyboard signing',
					description: 'Arrows carry the pen, Space commits, Escape discards.'
				}
			],
			changelog: [
				{
					version: '22.8.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'changed',
							description:
								"The field keeps its stylesheet to itself. <hub-signature> shipped with ViewEncapsulation.None, which publishes every rule it emits into the application's global cascade, where it competes with rules the library never sees and cannot be removed by anyone who did not know it was there. None of the four reasons CODING_RULES.md allows for it applied: every selector in the sheet names .hub-signature, and that is the component's own root element, drawn by its own template, so emulated encapsulation reaches all of it. Not one selector had to move, and neither does what you write to theme the field: .hub-signature is still on an element your global stylesheet matches, so a hand-written rule and hub-signature-theme() land exactly where they did. See BREAKING_CHANGES.md."
						},
						{
							type: 'added',
							description:
								'ng-hub-ui-ds is declared as an optional peer dependency (>=22.0.0). The token defaults climb --hub-input-* and --hub-label-* first and the --hub-sys-* / --hub-ref-* ladder after that, and nothing in the manifest said so, so a consumer reading the package on npm could not tell that installing the token package is what gives the field the family palette and its dark mode. It stays optional: every token ends in a literal fallback.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'fixed',
							description:
								'The declared peer ranges now name versions the component actually builds against. They read ng-hub-ui-forms >=22.0.0 and ng-hub-ui-utils >=22.8.0, and neither floor was ever true: showsFormTextTooltip(), formText() and the .hub-field__label-row styling all arrived with forms 22.31.0, while HubTooltipDirective arrived with utils 22.9.0, so against 22.8.x the import resolves to nothing and the directive sits undefined in the imports array. Ranges that wide were not permissive, they were silent: npm saw them satisfied, upgraded nothing, and the application failed to compile on a base class member that was simply not there. The floors are now >=22.31.0 and >=22.9.0, which is what the rest of the family already does.'
						},
						{
							type: 'fixed',
							description:
								'The helper-text mark survives a field with no visible label. formTextType="tooltip" hangs the helper text behind a question mark at the end of the label row, and the whole row was nested inside the @if (label() || required()) guard, so a bare surface named only by [ariaLabel] drew no mark while the block below had already stood down because tooltip mode was on. The helper text was accepted, resolved and rendered nowhere at all, and the only way out was to give the field a visible label it was deliberately built without. The row is now rendered because the hint is due rather than because the label is, and the label moves into it only when there is one, which is the rule hub-input and hub-segmented already state.'
						},
						{
							type: 'fixed',
							description:
								'[height] resizes the surface it already reported. canvas.height, canvas.style.height and the repaint were written in resizeCanvas() alone, called once from afterNextRender(), while toSvg() read height() live, so changing the input moved the viewBox of every value saved from that moment on and moved nothing on screen: ink drawn on a 160-tall surface was filed as a 240-tall document and no longer filled the frame it declared. An effect now watches height() and re-runs resizeCanvas(). Strokes are still never rescaled, since they keep the coordinates they were captured with, so change the height while the field is empty whenever the ink has to keep its place inside the box.'
						},
						{
							type: 'fixed',
							description:
								'The README states the stylesheet setup step. Install said npm install ng-hub-ui-signature ng-hub-ui-forms and stopped there, while the label row, the helper text, the validation feedback and the question mark that opens it are all drawn by ng-hub-ui-forms, whose sheet nothing told you to load: a reader following the README alone got a correct canvas surrounded by unstyled body text and an empty button where the mark should be, with no error anywhere to explain it. The warning existed only in MIGRATION.md, which a new consumer has no reason to open. Both READMEs now carry the @use lines, including the utils tooltip sheet that formTextType="tooltip" needs because its bubble is appended to body, and ng-hub-ui-utils joins the install line it was already a peer of.'
						},
						{
							type: 'fixed',
							description:
								'BREAKING_CHANGES.md covers 22.5.0 and 22.6.0. The newest section was 22.4.0 while the library was on 22.6.1, and both releases in between asked the consumer to do something: 22.5.0 to delete the invalid-state override the migration guide used to recommend, which now collides with the component rule at equal specificity and can stop applying in a production build while still working in the dev server, and 22.6.0 to raise the ng-hub-ui-forms floor to 22.31.0, without which the application no longer compiles. In a family whose major tracks Angular, that file is the only warning a breaking change can give, and it said nothing.'
						},
						{
							type: 'added',
							description:
								'Projected hubFormText and hubValidationError templates are rendered. Both queries live on HubFieldControl, so a template placed inside hub-signature compiled, was matched and was collected, and was then read by nothing: the field printed the plain formText() string and the default message for every error key. The helper block now renders the projected template and falls back to the string otherwise, and each validation error resolves its own template before reaching the default message, through the same two ngTemplateOutlet pairs the rest of the family uses, so a consumer who wrote the markup for hub-input can move it across unchanged.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-09-03',
					changes: [
						{
							type: 'fixed',
							description:
								"Server-side rendering no longer throws. writeValue() repaints the canvas and runs whenever a reactive form binds a value — including during prerendering, where the server DOM shim throws NotYetImplemented from canvas.getContext('2d') instead of returning null, so the existing null check never ran. redraw() now returns early outside the browser; the afterNextRender hook already repaints once there are pixels."
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-09-02',
					changes: [
						{
							type: 'added',
							description:
								'formTextType="tooltip" works here too. ng-hub-ui-forms 22.31.0 moved formText and formTextType onto HubFieldControl, the base class this component extends, so the input arrived for free — and did nothing, because the template rendered the helper block unconditionally and drew no question mark. The mark now sits in a .hub-field__label-row beside the label rather than inside it, which is not decoration: clicking this label focuses the drawing surface, so a button nested in it would open the tooltip and put the pen in the reader\'s hand at once.'
						},
						{
							type: 'fixed',
							description:
								'The component compiles against ng-hub-ui-forms 22.31.0. It declared its own formText, which the base class now declares too, and TypeScript refuses the redeclaration without an override modifier (TS4114). The local declaration is deleted rather than annotated — the base one is identical, and two declarations of one input is how they drift.'
						}
					]
				},
				{
					version: '22.5.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'fixed',
							description:
								"[labelType] is read. It was declared, compiled, type-checked and never looked at, so a team migrating a horizontal form bound the input, saw a stacked label, and went hunting through ng-hub-ui-forms for a bug that was not there. 'horizontal' now places the label beside the drawing surface, with the action row, helper text and feedback stacked in the second column. 'floating' still falls back to stacked, deliberately: it reuses the space an empty text control's value would occupy and is driven by :placeholder-shown, and a label parked inside the box would sit on top of the ink the moment anyone signed."
						},
						{
							type: 'fixed',
							description:
								'The validation state shows on the drawing surface. The --invalid and --valid classes were bound on the root and styled by nothing, so a required-but-empty signature printed an error message under a canvas that looked exactly like a valid one. The canvas now takes the danger border and ring when touched and invalid, and the success pair when [showValid] is on and the field is valid, from the shared --hub-form-* contract the rest of the family uses. If you wrote the workaround the migration guide recommended, delete it: it now collides with the component rule at equal specificity.'
						},
						{
							type: 'added',
							description:
								'A live theming demo exercising all eleven --hub-signature-* slots through hub-signature-theme(). Building it surfaced a trap now documented: setting the tokens on a wrapper element does nothing, because the component declares every slot on the field element itself and a property declared on an element always beats one inherited from an ancestor. That is why the mixin emits "<your scope> :where(.hub-signature)" rather than relying on inheritance.'
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'fixed',
							description:
								'The visible label now names the drawing surface. The template rendered <label for> pointing at the canvas, and for associates only with labelable elements — a <canvas> is none of them, so the attribute was inert: no association, clicking did nothing, and the name came entirely from [ariaLabel]. The surface is named with aria-labelledby, the only mechanism that works on a non-labelable element and the only one unaffected by role="application". aria-labelledby and aria-label are now mutually exclusive, because the first outranks the second outright and emitting both would leave one permanently unreachable. Clicking the label focuses the surface.'
						},
						{
							type: 'fixed',
							description:
								'[ariaLabel] goes through the translation dictionary. It was a hardcoded English literal with no HUBUI.SIGNATURE.* key behind it, so an application that localized every button still had its drawing surface announce itself in English. It now resolves through the explicit input, then [labels] / provideHubSignature(), then HUBUI.SIGNATURE.ARIA_LABEL, then the English fallback; its default changed from Signature to the empty string so that unset is distinguishable.'
						},
						{
							type: 'changed',
							description:
								'The accessible name comes from [label] when there is one, and [ariaLabel] is the fallback for a bare surface. This is what closes WCAG 2.5.3: translating [ariaLabel] alone would only have made agreement possible, still asking every consumer to pass the same string twice. Binding [ariaLabel] beside a [label] no longer does anything — remove it. HubSignatureLabels also gained a required ariaLabel member; breaking, see BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'added',
							description:
								'A keyboard path to sign. The canvas had carried tabindex="0" since 22.0.0 over pointer-only handlers, so the field was focusable and unusable — a required control no keyboard-only user could satisfy. Arrow keys now carry a visible pen, Space or Enter lower and lift it, Escape abandons the stroke. It goes through the same internal begin/commit pair the pointer does, so it yields the same stroke, the same toSvg() output and the same reported value. The surface carries role="application" because a canvas with tabindex is not a form control, and screen readers would otherwise consume the arrows for document navigation; the instructions are announced through aria-describedby under HUBUI.SIGNATURE.KEYBOARD_HINT.'
						},
						{
							type: 'added',
							description:
								'[validFeedback] is rendered. It existed on HubFieldControl all along, so it compiled and type-checked on <hub-signature> and then did nothing. It now renders the same .hub-field__feedback--valid block as every other field of the family.'
						},
						{
							type: 'added',
							description:
								'hub-signature-theme() reaches all eleven --hub-signature-* tokens instead of five. The six new parameters are appended after the original five so existing positional includes keep resolving to the same tokens, and an argument-less include now raises a Sass @warn rather than compiling silently to nothing.'
						},
						{
							type: 'fixed',
							description:
								'pointercancel no longer commits the partial stroke. It was wired to the pen-up handler, so an OS gesture, a scroll takeover or palm rejection pushed a half-drawn stroke onto the history, reported it to the form and emitted (drawEnd). A cancelled interaction is now discarded, and losing focus mid-stroke takes the same path.'
						},
						{
							type: 'fixed',
							description:
								'The default currentColor ink is resolved before capture. The canvas 2D context cannot parse CSS-context keywords, so the ink fell back to black whatever the surrounding colour, and the literal was written into the persisted SVG — leaving archived signatures with no fixed colour at all. It is now resolved with getComputedStyle() when the stroke opens, which is also what makes hub-signature-theme($color) reach the ink as documented.'
						},
						{
							type: 'changed',
							description:
								'(drawStart) and (drawEnd) emit HubSignatureDrawEvent — PointerEvent | KeyboardEvent — because drawing is no longer pointer-exclusive, and HubSignatureLabels gained a required keyboardHint member. Both are breaking; see BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'added',
							description:
								'isEmpty(), so a form can validate the field without parsing the serialized SVG — previously the only way to ask whether anything had been drawn.'
						},
						{
							type: 'added',
							description:
								'toStrokes() / fromStrokes(), exposing the committed strokes as structured HubSignatureStroke[]. Deliberately not named toData / fromData: angular2-signaturepad uses those names for an incompatible payload, and the same name with a different shape would let a migration compile and then fail silently.'
						},
						{
							type: 'added',
							description:
								'(drawStart) and (drawEnd) outputs, emitted around a user stroke, so a host can react to drawing activity without polling the value.'
						},
						{
							type: 'changed',
							description:
								'The hub-signature-theme() mixin documents itself where the tooling can read it. Its header used a block comment, which the generator skips, so the library page showed no theming section at all despite the mixin having shipped since 22.0.0. Comment-only — the emitted declarations are byte-identical.'
						}
					]
				},
				{
					version: '22.1.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The published package declared no licence. A registry reports an absent `license` field as unlicensed, which legally reads as all rights reserved. The intent was always MIT; it is now stated in `package.json` and carried in a `LICENSE` file that ships with the package.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-08-14',
					changes: [
						{
							type: 'fixed',
							description:
								'The field now really inherits the ng-hub-ui-forms contract. The --hub-signature-* slots defaulted to a --hub-field-* family that no library declares, so they always fell through to their sys/ref fallbacks and a form themed with --hub-input-bg left its signature field untouched. They now read the canonical tokens of the .hub-field__* shell: --hub-input-* for the drawing surface, --hub-label-* for the label and --hub-form-disabled-opacity for the disabled state.'
						},
						{
							type: 'added',
							description:
								'The eleven --hub-signature-* tokens are documented in the design-system token spec, so they now appear in the library reference table.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-08-14',
					changes: [{ type: 'added', description: 'Initial signature field release.' }]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'label',
					type: 'string',
					required: false,
					defaultValue: "''",
					description:
						'Visible field label, and the accessible name of the drawing surface: the canvas is wired to it with aria-labelledby, so the announced name cannot drift from the visible text. Clicking it focuses the surface.'
				},
				{
					name: 'formText',
					type: 'string',
					required: false,
					defaultValue: "''",
					description:
						"Helper text for the field. Where it is shown is [formTextType]'s business: below the drawing surface by default, or behind a question mark at the end of the label row. A projected <ng-template hubFormText> replaces the string in the block below, and keeps its place there even in tooltip mode, because a tooltip takes a string and would drop the markup."
				},
				{
					name: 'formTextType',
					type: "'bottom' | 'tooltip'",
					required: false,
					defaultValue: "'bottom'",
					description:
						'Where [formText] is shown. bottom puts it under the drawing surface, where it is read without being asked for; tooltip hangs it behind a question mark at the end of the label row, for anything longer than a sentence. The mark is rendered whenever there is helper text, including on a bare surface named only by [ariaLabel]. Its bubble is appended to <body>, so tooltip mode also needs the ng-hub-ui-utils tooltip stylesheet.'
				},
				{
					name: 'height',
					type: 'number',
					required: false,
					defaultValue: '160',
					description: 'Logical canvas height in CSS pixels.'
				},
				{
					name: 'strokeColor',
					type: 'string',
					required: false,
					defaultValue: "'currentColor'",
					description:
						'Colour recorded in new SVG strokes. The currentColor default is resolved against the drawing surface before the stroke is captured, so the archive stores a concrete colour rather than a keyword the canvas cannot parse.'
				},
				{
					name: 'strokeWidth',
					type: 'number',
					required: false,
					defaultValue: '2',
					description: 'Base width recorded in new SVG strokes.'
				},
				{
					name: 'readonly',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'Prevents drawing while preserving the signature.'
				},
				{
					name: 'controls',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'Shows clear, undo and redo actions.'
				},
				{
					name: 'labels',
					type: 'Partial<HubSignatureLabels>',
					required: false,
					defaultValue: '{}',
					description: 'Overrides the application-wide translated action labels for this field only.'
				},
				{
					name: 'ariaLabel',
					type: 'string',
					required: false,
					defaultValue: "''",
					description:
						'Accessible name for a surface with no visible [label]. A field that has a label takes its name from that label through aria-labelledby, so the two cannot disagree, and this input is not consulted there. Left empty it resolves through [labels], then HUBUI.SIGNATURE.ARIA_LABEL, then the English fallback Signature.'
				},
				{
					name: 'labelType',
					type: 'HubLabelType',
					required: false,
					defaultValue: "'stacked'",
					description:
						"How the label sits against the field: 'stacked' or 'horizontal'. 'floating' falls back to stacked, as it does on the family's other non-text fields — a floating label reuses the space an empty text control's value would occupy and is driven by :placeholder-shown, which a canvas has neither of."
				},
				{
					name: 'classlist',
					type: 'string',
					required: false,
					defaultValue: "''",
					description:
						'Extra classes applied to the host element, <hub-signature> itself — not to the drawing surface, which keeps its own .hub-signature__canvas. Style the canvas from a descendant selector, or theme it through the --hub-signature-* slots.'
				},
				{
					name: 'formControlName',
					type: 'string',
					required: false,
					defaultValue: '—',
					description:
						'Name of the control inside the surrounding form group. Inherited from HubFormControl, which declares it as an input of its own, so ReactiveFormsModule must still be imported where the field is used: without the directive nothing raises an error and the field simply never syncs with the form.'
				},
				{
					name: 'required',
					type: 'boolean | null',
					required: false,
					defaultValue: 'null',
					description:
						"Renders the required asterisk and sets aria-required on the surface. Two-way. On a reactive binding it is derived from the control's validators and kept in step with them, so binding it by hand there is overwritten and warns in dev mode; set it explicitly only on a template-driven or unbound field."
				},
				{
					name: 'disabled',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description:
						"Refuses drawing, disables the action row and sets aria-disabled. Two-way, and also written by setDisabledState(). On a formControlName field prefer control.disable() / control.enable(): Angular's own directive declares a disabled input too, so a binding reaches both and leaves two sources of truth for one state."
				},
				{
					name: 'showValid',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description:
						'Opt-in success state. A touched and valid field takes the success border and ring on the drawing surface, and renders [validFeedback] if one is given. Defaults to the global provideHubForms({ showValid }); the success state is never automatic. Has no effect while the field is invalid.'
				},
				{
					name: 'validFeedback',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description:
						'Success message shown under the field. Needs both halves of the opt-in: [showValid] on, and a control that is touched and valid.'
				},
				{
					name: 'invalidFeedbackTemplateFn',
					type: '((key: string, value: any) => string) | null',
					required: false,
					defaultValue: 'null',
					description:
						'Per-field override for the invalid-feedback message builder, ahead of the global provideHubForms() one. For markup rather than a string, project an <ng-template hubValidationError key="required"> instead — the template wins over both.'
				}
			],
			outputs: [
				{
					name: 'valueChange',
					type: 'OutputEmitterRef<string>',
					required: false,
					defaultValue: '—',
					description:
						'Emits the SVG value after a user-originated change — a committed stroke, clear(), undo() or redo() — and the empty string once nothing is left. A programmatic write through writeValue() or fromStrokes() emits nothing, so this never echoes the form back at itself.'
				},
				{
					name: 'drawStart',
					type: 'OutputEmitterRef<HubSignatureDrawEvent>',
					required: false,
					defaultValue: '—',
					description:
						'Emitted when a user begins a stroke, with the pointer or the keyboard. Lets a host react to drawing activity — pausing an autosave, arming a submit button — without polling the value. HubSignatureDrawEvent is PointerEvent | KeyboardEvent; narrow with instanceof when the input device matters.'
				},
				{
					name: 'drawEnd',
					type: 'OutputEmitterRef<HubSignatureDrawEvent>',
					required: false,
					defaultValue: '—',
					description:
						'Emitted when a user finishes a stroke, after it is committed. Fires only for user drawing, so a programmatic write never looks like one, and a stroke that was cancelled rather than finished — pointercancel, Escape, focus leaving the surface — emits nothing.'
				},
				{
					name: 'disabledChange',
					type: 'OutputEmitterRef<boolean>',
					required: false,
					defaultValue: '—',
					description:
						'The write half of the two-way [(disabled)]. It also fires when Angular calls setDisabledState() — that is, when the bound control is disabled or enabled — so a host binding [(disabled)] on a reactive field sees the control drive it.'
				},
				{
					name: 'requiredChange',
					type: 'OutputEmitterRef<boolean | null>',
					required: false,
					defaultValue: '—',
					description:
						"The write half of the two-way [(required)]. On a reactive binding it fires whenever the control's status changes and its required validator has been added or removed, which is where the value comes from there."
				}
			],
			templates: [
				{
					name: 'hubFormText',
					description:
						'Helper text as markup, replacing the [formText] string in the block under the drawing surface. Both are exports of ng-hub-ui-forms, so the markup written for a hub-input moves here unchanged. It keeps its place in the block even under formTextType="tooltip", because the tooltip takes a string and would drop the markup — the mark still opens with the [formText] string.',
					example:
						'<ng-template hubFormText>Sign with a pointer, or carry the pen with <kbd>Space</kbd>.</ng-template>'
				},
				{
					name: 'hubValidationError',
					description:
						'The message for one validation error key, ahead of both [invalidFeedbackTemplateFn] and the global provideHubForms() builder. Only the key it names is overridden; every other error still falls back to the builder. The error payload arrives as the implicit context value.',
					example: '<ng-template hubValidationError key="required">Sign before filing the contract.</ng-template>'
				}
			],
			methods: [
				{ name: 'clear', signature: 'clear(): void', description: 'Removes every stroke and emits the empty value.' },
				{ name: 'undo', signature: 'undo(): void', description: 'Removes the most recently committed stroke.' },
				{ name: 'redo', signature: 'redo(): void', description: 'Restores the most recently undone stroke.' },
				{
					name: 'cancelStroke',
					signature: 'cancelStroke(event?: PointerEvent): void',
					description:
						'Throws away the stroke in progress without reporting it. Bound to pointercancel, and the path taken by Escape and by focus leaving the surface: a cancelled interaction must not reach the form value.'
				},
				{ name: 'toSvg', signature: 'toSvg(): string', description: 'Returns the scalable SVG form value.' },
				{
					name: 'toDataUrl',
					signature: 'toDataUrl(type?: string): string',
					description: 'Exports the rendered signature, PNG by default.'
				},
				{
					name: 'resizeCanvas',
					signature: 'resizeCanvas(): void',
					description:
						'Re-measures the element, rebuilds the device-pixel bitmap and repaints. [height] runs it for you; call it by hand when the field becomes visible after being laid out at zero width — inside a closed modal, an inactive tab, a collapsed accordion — since the one automatic measurement happens at first render and there is no ResizeObserver. Call it while the field is empty: strokes keep the coordinates they were captured in, so re-measuring a signed field to a new width reframes the signature and leaves toSvg() emitting a viewBox that no longer matches the geometry inside it.'
				},
				{
					name: 'isEmpty',
					signature: 'isEmpty(): boolean',
					returns: 'boolean',
					description:
						'Whether anything has been drawn. Lets a form validate the field without parsing the serialized SVG, which was previously the only way to ask.'
				},
				{
					name: 'toStrokes',
					signature: 'toStrokes(): HubSignatureStroke[]',
					returns: 'HubSignatureStroke[]',
					description:
						'The committed strokes as structured geometry. toSvg() remains the canonical form value — this is for callers that need the points themselves, such as replaying a signature or migrating from a library that stored point groups.'
				},
				{
					name: 'fromStrokes',
					signature: 'fromStrokes(strokes: readonly HubSignatureStroke[]): void',
					description:
						'Repaints the field from structured geometry. A programmatic write, like writeValue(): it does not report a user change to Angular forms.'
				}
			],
			cssVariables: MD_CSS_VARIABLES['signature'] ?? []
		},
		mixins: {
			...MD_MIXINS['signature'],
			demos: [
				{
					title: 'Theming with hub-signature-theme',
					previewComponent: MixinSignatureExampleComponent,
					code: `@use 'ng-hub-ui-signature/styles' as signature;

// All eleven --hub-signature-* slots are reachable through the mixin. The six after
// $focus-border-color are appended rather than grouped by meaning, so that positional
// includes written against the original five keep resolving to the same tokens.
.contract-panel--dark {
	@include signature.hub-signature-theme(
		$background: #0f172a,
		$color: rgba(255, 255, 255, 0.92),
		$border-color: rgba(255, 255, 255, 0.24),
		$border-radius: 0.75rem,
		$focus-border-color: #7dd3fc,
		$border-width: 2px,
		$focus-shadow: 0 0 0 0.25rem rgb(125 211 252 / 35%),
		$font-size: 0.9375rem,
		$label-color: rgba(255, 255, 255, 0.72),
		$label-font-size: 0.8125rem,
		$actions-gap: 0.75rem
	);
}`
				}
			]
		},
		styling: [
			{
				title: 'Load the forms stylesheet',
				description:
					"The chrome around the canvas is not the signature's. Its root element is class=\"hub-field hub-signature\" and the label row, the helper text, the validation feedback and the ? mark that opens it are all defined in ng-hub-ui-forms, so @use 'ng-hub-ui-forms/styles'; belongs in the application's global stylesheet, once. Skip it and the canvas still looks right while the text under it falls back to unstyled body copy and the ? mark, glyph and circle included, is left as an empty button. Add @use 'ng-hub-ui-utils/styles/tooltip'; too when the field uses formTextType=\"tooltip\": the bubble is appended to <body>, out of reach of the sheet above. Neither is replaced by ng-hub-ui-signature/styles, which forwards the theming mixin and emits no chrome.",
				examples: []
			},
			{
				title: 'Match the form theme',
				description:
					'The field inherits the forms token family and accepts a local signature token override. Validation is part of that inheritance: the invalid and valid states colour the drawing surface from the shared --hub-form-* contract, so a signature turns red alongside the inputs around it rather than printing a message under a canvas that still looks fine.',
				examples: [this.createInheritedThemeExample()]
			}
		]
	};

	ngOnInit(): void {
		this.exampleRegistry.register({
			id: 'signature-basic',
			title: 'DOCS.COMMON.LIBRARY.SIGNATURE',
			componentName: 'BasicSignatureExampleComponent',
			files: ['basic-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/basic-signature-example.component').then((m) => m.BasicSignatureExampleComponent),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-i18n',
			title: 'DOCS.SIGNATURE.EXAMPLE.I18N.TITLE',
			componentName: 'I18nSignatureExampleComponent',
			files: [
				'app.config.ts',
				'transloco-loader.ts',
				'en.json',
				'contract-signature.component.ts',
				'contract-signature.component.html'
			],
			sourceCode: I18nSignatureExampleComponent.sourceCode,
			loader: () =>
				import('../examples/signature/i18n-signature-example.component').then((m) => m.I18nSignatureExampleComponent),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-keyboard',
			title: 'DOCS.SIGNATURE.EXAMPLE.KEYBOARD.TITLE',
			componentName: 'KeyboardSignatureExampleComponent',
			files: ['keyboard-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/keyboard-signature-example.component').then(
					(m) => m.KeyboardSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-form',
			title: 'DOCS.SIGNATURE.EXAMPLE.FORM.TITLE',
			componentName: 'FormSignatureExampleComponent',
			files: ['form-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/form-signature-example.component').then((m) => m.FormSignatureExampleComponent),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-draw-events',
			title: 'DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.TITLE',
			componentName: 'DrawEventsSignatureExampleComponent',
			files: ['draw-events-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/draw-events-signature-example.component').then(
					(m) => m.DrawEventsSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-surface',
			title: 'DOCS.SIGNATURE.EXAMPLE.SURFACE.TITLE',
			componentName: 'SurfaceSignatureExampleComponent',
			files: ['surface-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/surface-signature-example.component').then(
					(m) => m.SurfaceSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-label-type',
			title: 'DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.TITLE',
			componentName: 'LabelTypeSignatureExampleComponent',
			files: ['label-type-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/label-type-signature-example.component').then(
					(m) => m.LabelTypeSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-naming',
			title: 'DOCS.SIGNATURE.EXAMPLE.NAMING.TITLE',
			componentName: 'NamingSignatureExampleComponent',
			files: ['naming-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/naming-signature-example.component').then(
					(m) => m.NamingSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.exampleRegistry.register({
			id: 'signature-projected-templates',
			title: 'DOCS.SIGNATURE.EXAMPLE.PROJECTED.TITLE',
			componentName: 'ProjectedTemplatesSignatureExampleComponent',
			files: ['projected-templates-signature-example.component.ts'],
			loader: () =>
				import('../examples/signature/projected-templates-signature-example.component').then(
					(m) => m.ProjectedTemplatesSignatureExampleComponent
				),
			packagePath: 'signature'
		});
		this.library.functionalities = [
			{
				title: 'Capture and edit signatures',
				description:
					'Pointer input works with a mouse, touch screen or pen, and arrow keys with Space carry the same stroke for anyone signing without a pointer. Either way the field keeps a scalable SVG history for undo, redo and form persistence.',
				examples: [this.createExample()]
			},
			{
				title: 'Signing with the keyboard',
				description:
					'Arrow keys carry the pen, Space or Enter lower and lift it, Escape discards the stroke in progress — and what comes out is an ordinary stroke, which is why the draw outputs carry PointerEvent | KeyboardEvent.',
				examples: [this.createKeyboardExample()]
			},
			{
				title: 'Signature as a form control',
				description:
					"The field is a ControlValueAccessor whose value is the SVG it serializes itself into: the required marker and the error message come from the control's validators, and the success message needs both [showValid] and [validFeedback].",
				examples: [this.createFormExample()]
			},
			{
				title: 'Draw events and stroke data',
				description:
					'The drawing lifecycle is observable through (drawStart) and (drawEnd), the field answers isEmpty() without parsing its SVG, and toStrokes() / fromStrokes() move the geometry itself — which the SVG form value cannot carry.',
				examples: [this.createDrawEventsExample()]
			},
			{
				title: 'Sizing the surface and the pen',
				description:
					'[height] re-measures and repaints, so the viewBox toSvg() emits keeps describing the box on screen; [strokeWidth] and [strokeColor] are read when a stroke opens and stored on it, so strokes already drawn keep the pen they were drawn with.',
				examples: [this.createSurfaceExample()]
			},
			{
				title: 'Placing the label',
				description:
					"[labelType] takes the shared vocabulary of ng-hub-ui-forms so a signature lines up with the fields around it. 'horizontal' puts the label in a first column and stacks the actions, helper text and feedback in the second; 'floating' is accepted and falls back to stacked, because a label parked inside the box would sit on top of the ink.",
				examples: [this.createLabelTypeExample()]
			},
			{
				title: 'Naming one field on its own',
				description:
					'[ariaLabel] names a surface with no visible label — on a field that has one it is not consulted at all — and [labels] overrides the built-in action wording for a single field without touching the application dictionary.',
				examples: [this.createNamingExample()]
			},
			{
				title: 'Helper text and error messages as markup',
				description:
					'hubFormText and hubValidationError are exports of ng-hub-ui-forms, and the field renders both: a keyboard hint with real key caps, and the required message written in the product\u2019s own words. Each error key resolves its own template before the message builder is consulted, so overriding one leaves the rest alone.',
				examples: [this.createProjectedTemplatesExample()]
			},
			{
				title: 'Reactive external translations',
				description:
					'The action-label contract accepts strings or reactive sources, so Transloco and ngx-translate language changes update the field without a direct package dependency.',
				examples: [this.createI18nExample()]
			}
		];
	}

	/** Links the registered live demo to the overview feature guide. */
	private createExample(): FeatureExample {
		return {
			title: 'DOCS.COMMON.LIBRARY.SIGNATURE',
			description: 'Draw a signature and use the built-in history actions.',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: BasicSignatureExampleComponent.templateCode,
			component: BasicSignatureExampleComponent.componentCode,
			previewComponent: BasicSignatureExampleComponent
		};
	}

	/** Links the lifecycle-and-geometry demo to the overview feature guide. */
	private createDrawEventsExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: DrawEventsSignatureExampleComponent.templateCode,
			component: DrawEventsSignatureExampleComponent.componentCode,
			previewComponent: DrawEventsSignatureExampleComponent
		};
	}

	/**
	 * The theming path most consumers take: skin the form once, and the signature follows because
	 * its slots default through `--hub-input-*` and `--hub-label-*`.
	 */
	private createInheritedThemeExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.INHERITED.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.INHERITED.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: InheritedThemeSignatureExampleComponent.templateCode,
			component: InheritedThemeSignatureExampleComponent.componentCode,
			styles: InheritedThemeSignatureExampleComponent.cssCode,
			previewComponent: InheritedThemeSignatureExampleComponent
		};
	}

	/** Links the keyboard signing demo to the overview feature guide. */
	private createKeyboardExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.KEYBOARD.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.KEYBOARD.DESCRIPTION',
			import: "import { HubSignatureComponent, type HubSignatureDrawEvent } from 'ng-hub-ui-signature';",
			template: KeyboardSignatureExampleComponent.templateCode,
			component: KeyboardSignatureExampleComponent.componentCode,
			previewComponent: KeyboardSignatureExampleComponent
		};
	}

	/** Links the reactive-form demo to the overview feature guide. */
	private createFormExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.FORM.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.FORM.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: FormSignatureExampleComponent.templateCode,
			component: FormSignatureExampleComponent.componentCode,
			previewComponent: FormSignatureExampleComponent
		};
	}

	/** Links the surface-and-pen demo to the overview feature guide. */
	private createSurfaceExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.SURFACE.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.SURFACE.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: SurfaceSignatureExampleComponent.templateCode,
			component: SurfaceSignatureExampleComponent.componentCode,
			previewComponent: SurfaceSignatureExampleComponent
		};
	}

	/** Links the label-placement demo to the overview feature guide. */
	private createLabelTypeExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: LabelTypeSignatureExampleComponent.templateCode,
			component: LabelTypeSignatureExampleComponent.componentCode,
			previewComponent: LabelTypeSignatureExampleComponent
		};
	}

	/** Links the per-field naming demo to the overview feature guide. */
	private createNamingExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.NAMING.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.NAMING.DESCRIPTION',
			import: "import { HubSignatureComponent, type HubSignatureLabels } from 'ng-hub-ui-signature';",
			template: NamingSignatureExampleComponent.templateCode,
			component: NamingSignatureExampleComponent.componentCode,
			previewComponent: NamingSignatureExampleComponent
		};
	}

	/** Links the projected-template demo to the overview feature guide. */
	private createProjectedTemplatesExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.PROJECTED.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.PROJECTED.DESCRIPTION',
			import: "import { HubFormTextDirective, HubValidationErrorDirective } from 'ng-hub-ui-forms';",
			template: ProjectedTemplatesSignatureExampleComponent.templateCode,
			component: ProjectedTemplatesSignatureExampleComponent.componentCode,
			previewComponent: ProjectedTemplatesSignatureExampleComponent
		};
	}

	/** Documents the two supported external translation-stream integrations. */
	private createI18nExample(): FeatureExample {
		return {
			title: 'DOCS.SIGNATURE.EXAMPLE.I18N.TITLE',
			description: 'DOCS.SIGNATURE.EXAMPLE.I18N.DESCRIPTION',
			import: "import { HubSignatureComponent } from 'ng-hub-ui-signature';",
			template: I18nSignatureExampleComponent.templateCode,
			component: I18nSignatureExampleComponent.componentCode,
			previewComponent: I18nSignatureExampleComponent
		};
	}
}
