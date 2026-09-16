import { ChangeDetectionStrategy, Component, inject, OnInit, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { MD_MIXINS } from '../../generated/md-mixins';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { FORMS_FUNCTIONALITIES } from './forms-functionalities';
import { FORMS_PLAYGROUND } from './forms-playground';
import { FormsInputBasicExampleComponent } from '../examples/forms/input-basic-example.component';
import { FormsInputPasswordExampleComponent } from '../examples/forms/input-password-example.component';
import { FormsInputFormatsExampleComponent } from '../examples/forms/input-formats-example.component';
import { FormsInputColorSwatchesExampleComponent } from '../examples/forms/input-color-swatches-example.component';
import { FormsInputGroupsExampleComponent } from '../examples/forms/input-groups-example.component';
import { FormsInputMaskExampleComponent } from '../examples/forms/input-mask-example.component';
import { FormsInputOtpExampleComponent } from '../examples/forms/input-otp-example.component';
import { FormsInputSearchTypeaheadExampleComponent } from '../examples/forms/input-search-typeahead-example.component';
import { FormsTextareaExampleComponent } from '../examples/forms/textarea-example.component';
import { FormsPlaintextExampleComponent } from '../examples/forms/plaintext-example.component';
import { FormsFormTextTooltipExampleComponent } from '../examples/forms/form-text-tooltip-example.component';
import { FormsLabelVisuallyHiddenExampleComponent } from '../examples/forms/label-visually-hidden-example.component';
import { FormsSliderExampleComponent } from '../examples/forms/slider-example.component';
import { FormsSegmentedExampleComponent } from '../examples/forms/segmented-example.component';
import { FormsSelectExampleComponent } from '../examples/forms/select-example.component';
import { FormsSelectGroupedExampleComponent } from '../examples/forms/select-grouped-example.component';
import { FormsSelectSearchExampleComponent } from '../examples/forms/select-search-example.component';
import { FormsSelectTemplatesExampleComponent } from '../examples/forms/select-templates-example.component';
import { SelectTypeaheadFormsExampleComponent } from '../examples/forms/select-typeahead-forms-example.component';
import { SegmentedTemplateFormsExampleComponent } from '../examples/forms/segmented-template-forms-example.component';
import { FormsSelectFormatsExampleComponent } from '../examples/forms/select-formats-example.component';
import { FormsSliderStylingExampleComponent } from '../examples/forms/slider-styling-example.component';
import { FormsSelectInModalExampleComponent } from '../examples/forms/select-in-modal-example.component';
import { FormsSelectAddonsExampleComponent } from '../examples/forms/select-addons-example.component';
import { FormsFieldAttachedExampleComponent } from '../examples/forms/field-attached-example.component';
import { FormsDatepickerExampleComponent } from '../examples/forms/datepicker-example.component';
import { FormsDatepickerInModalExampleComponent } from '../examples/forms/datepicker-in-modal-example.component';
import { FormsTimepickerExampleComponent } from '../examples/forms/timepicker-example.component';
import { FormsDatepickerTimeExampleComponent } from '../examples/forms/datepicker-time-example.component';
import { FormsDatepickerGranularityExampleComponent } from '../examples/forms/datepicker-granularity-example.component';
import { FormsDatepickerFormatsExampleComponent } from '../examples/forms/datepicker-formats-example.component';
import { FormsDatepickerDayTimeRangeExampleComponent } from '../examples/forms/datepicker-day-time-range-example.component';
import { FormsFileInputBasicExampleComponent } from '../examples/forms/file-input-basic-example.component';
import { FormsFileInputDropzoneExampleComponent } from '../examples/forms/file-input-dropzone-example.component';
import { FormsFileInputUploadExampleComponent } from '../examples/forms/file-input-upload-example.component';
import { FormsFileInputInlineExampleComponent } from '../examples/forms/file-input-inline-example.component';
import { FormsContainersExampleComponent } from '../examples/forms/containers-example.component';
import { FormsRtlExampleComponent } from '../examples/forms/rtl-forms-example.component';
import { MixinFormsExampleComponent } from '../examples/forms/mixin-forms-example.component';

/**
 * Maps each registered example id to its standalone component, so the Overview
 * "Feature guides" section can render a live preview via `previewComponent`.
 */
const FORMS_PREVIEW_COMPONENTS: Record<string, Type<unknown>> = {
	'forms-rtl': FormsRtlExampleComponent,
	'forms-input-basic': FormsInputBasicExampleComponent,
	'forms-input-password': FormsInputPasswordExampleComponent,
	'forms-input-formats': FormsInputFormatsExampleComponent,
	'forms-input-color-swatches': FormsInputColorSwatchesExampleComponent,
	'forms-input-groups': FormsInputGroupsExampleComponent,
	'forms-input-mask': FormsInputMaskExampleComponent,
	'forms-input-otp': FormsInputOtpExampleComponent,
	'forms-input-search': FormsInputSearchTypeaheadExampleComponent,
	'forms-textarea': FormsTextareaExampleComponent,
	'forms-plaintext': FormsPlaintextExampleComponent,
	'forms-form-text-tooltip': FormsFormTextTooltipExampleComponent,
	'forms-label-visually-hidden': FormsLabelVisuallyHiddenExampleComponent,
	'forms-slider': FormsSliderExampleComponent,
	'forms-slider-styling': FormsSliderStylingExampleComponent,
	'forms-segmented': FormsSegmentedExampleComponent,
	'forms-segmented-template': SegmentedTemplateFormsExampleComponent,
	'forms-select': FormsSelectExampleComponent,
	'forms-select-grouped': FormsSelectGroupedExampleComponent,
	'forms-select-search': FormsSelectSearchExampleComponent,
	'forms-select-typeahead': SelectTypeaheadFormsExampleComponent,
	'forms-select-templates': FormsSelectTemplatesExampleComponent,
	'forms-select-formats': FormsSelectFormatsExampleComponent,
	'forms-select-in-modal': FormsSelectInModalExampleComponent,
	'forms-select-addons': FormsSelectAddonsExampleComponent,
	'forms-field-attached': FormsFieldAttachedExampleComponent,
	'forms-datepicker': FormsDatepickerExampleComponent,
	'forms-timepicker': FormsTimepickerExampleComponent,
	'forms-datepicker-in-modal': FormsDatepickerInModalExampleComponent,
	'forms-datepicker-time': FormsDatepickerTimeExampleComponent,
	'forms-datepicker-granularity': FormsDatepickerGranularityExampleComponent,
	'forms-datepicker-formats': FormsDatepickerFormatsExampleComponent,
	'forms-datepicker-day-time-range': FormsDatepickerDayTimeRangeExampleComponent,
	'forms-file-input-basic': FormsFileInputBasicExampleComponent,
	'forms-file-input-dropzone': FormsFileInputDropzoneExampleComponent,
	'forms-file-input-upload': FormsFileInputUploadExampleComponent,
	'forms-file-input-inline': FormsFileInputInlineExampleComponent,
	'forms-containers': FormsContainersExampleComponent
};

/**
 * Documentation page for the ng-hub-ui-forms library.
 */
@Component({
	selector: 'app-forms',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `<app-library-page
		[library]="formsLibrary"
		[package]="'forms'"
		[playground]="playgroundConfigs"
		[exampleGroups]="exampleGroups"
	></app-library-page>`
})
export class FormsComponent implements OnInit {
	protected readonly exampleGroups = FORMS_FUNCTIONALITIES;

	private readonly _exampleRegistry = inject(ExampleRegistry);

	/** Interactive playground configurations exposed under the Playground tab. */
	protected readonly playgroundConfigs = FORMS_PLAYGROUND;

	formsLibrary: Library = {
		title: 'ng-hub-ui-forms',
		description:
			'A standalone, signal-based suite of accessible Angular form fields — input, textarea, slider, select, datepicker and file input — with automatic validation-error display for controls, FormGroups and FormArrays, full CSS-variable theming, and no Bootstrap dependency.',
		overview: {
			text: 'ng-hub-ui-forms unifies every form field behind one contract: bind it with reactive forms and the matching errors appear automatically — at the control, group and form level — with zero wiring. Fields are standalone, OnPush and signal-native; the select is a maintained fork of ng-select themed in place with hub tokens; the datepicker is built from scratch on native Date and the ng-hub-ui-utils overlay. Every colour, spacing and radius is a canonical `--hub-*` CSS variable, so theming (including dark mode) is runtime and instant.',
			highlights: [
				{
					icon: 'fa-solid fa-wand-magic-sparkles',
					title: 'Automatic error display',
					description:
						'Control, group and form-level (cross-field) errors render automatically — no manual *ngIf chains.'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'Signal-native & standalone',
					description: 'Every field is standalone, OnPush and built on Angular Signals. Import only what you use.'
				},
				{
					icon: 'fa-solid fa-keyboard',
					title: 'Accessible by default',
					description: 'ARIA roles, labels and full keyboard navigation (especially the datepicker) out of the box.'
				},
				{
					icon: 'fa-solid fa-palette',
					title: 'Canonical CSS variables',
					description:
						'Themed entirely through `--hub-*` tokens chained to the design system — runtime dark mode included.'
				},
				{
					icon: 'fa-solid fa-list-check',
					title: 'Rich selection',
					description:
						'Forked ng-select (dropdown, search, tags) plus button, radio and checkbox formats for the same value.'
				},
				{
					icon: 'fa-solid fa-calendar-days',
					title: 'Date, time & range picker',
					description:
						'From-scratch datepicker: single / range at any granularity from a year to a second, min/max down to the minute, keyboard nav and full i18n — no date dependency.'
				},
				{
					icon: 'fa-solid fa-right-left',
					title: 'Right-to-left throughout',
					description:
						'Every field mirrors: logical CSS properties across the primitives, and the three whose geometry is half JavaScript — slider, switch and segmented — measured in a browser in both directions.'
				},
				{
					icon: 'fa-solid fa-plug',
					title: 'Cross-library adapter',
					description:
						'hubFormControlAdapter lets other ng-hub-ui libraries render hub-input / hub-select on demand, without hard-depending on this package.'
				},
				{
					icon: 'fa-solid fa-cloud-arrow-up',
					title: 'File input with uploads',
					description:
						'Drag & drop, paste, size/type limits, previews — and optional per-file upload progress, cancel and retry.'
				}
			],
			changelog: [
				{
					version: '22.35.0',
					date: '2026-09-11',
					changes: [
						{
							type: 'added',
							description:
								'preview="inline" puts the file inside the field: one tile that fills it, showing the image or the icon of the file family with its name, a Replace pill on hover, focus and drag-over, and a remove button. With multiple the tiles form a grid ending in an add tile, with a "3 of 5 files" counter under maxFiles. A tile opens its file: a picked image in a native <dialog>, anything else in a new tab. currentFile shows what the record already has (a URL, a HubCurrentFile or a list); it never enters the form value, and currentFileRemoved emits it when it is removed or replaced, the cue to delete it on the server. Also new: imagePreview, readonly and clearable, seven labels, ten file-family icons as mask tokens (Bootstrap Icons 1.13.1, MIT) and 57 --hub-file-input-* tokens.'
						},
						{
							type: 'added',
							description:
								'A grid of swatches for <hub-input type="color">: swatches draws a radio group the size of a field, one row as tall as a text input, wrapping onto more rows; the last cell opens the native picker unless allowCustomColor is off, and customColorLabel names it. Entries are CSS colours checked with parseColor, emitted as written. An application palette goes in provideHubForms({ color: { swatches } }), none by default; [swatches]="[]" keeps the classic field. HUB_COLOR_PALETTES ships tailwind, material, pastel, neutral and status. 14 --hub-input-swatch-* tokens.'
						},
						{
							type: 'changed',
							description:
								'The classic colour field is a full-width hex text field with the colour in a square at its start, which opens the native picker; every existing type="color" field changes look. Valid text reaches the form as it is typed, stored as lowercase #rrggbb. --hub-input-color-size is now the width of that square, and its default is the field inner height instead of 2.5rem. A colour field with labelType="floating" now shows its label, and every hub-input label carries an id, <id>-label.'
						},
						{
							type: 'changed',
							description:
								'preview="grid" draws the same tiles as inline, without the file size and themed by --hub-file-input-tile-*; --hub-file-input-grid-thumb-height is now the height of the whole tile. A projected hubFileIcon template now applies to preview="list" only, since tiles draw the family icon; a projected hubFilePreview template keeps the previous grid. The dropzone is wrapped in a .hub-file-input__frame in every mode, so a selector expecting it as a direct child of .hub-field__body no longer matches.'
						},
						{
							type: 'fixed',
							description:
								'HubFileItem.previewUrl is null for images the browser cannot paint (HEIC, TIFF, PSD…), which used to show a broken thumbnail, and for every file when imagePreview is off. A hub-select dropdown appended to body that opened upwards no longer lands off-screen on a page taller than the viewport. A button in a hubPrepend / hubAppend slot takes the field border colour whatever order the stylesheets load in.'
						}
					]
				},
				{
					version: '22.34.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'added',
							description:
								"Twelve hubSelect* slots, so customising a <hub-select> no longer means writing the name of a vendored dependency: hubSelectOption, hubSelectOptgroup, hubSelectLabel, hubSelectMultiLabel, hubSelectHeader, hubSelectFooter, hubSelectNotFound, hubSelectTypeToSearch, hubSelectLoadingText, hubSelectLoadingSpinner, hubSelectTag and hubSelectClearButton. They replace the ng-*-tmp attributes one for one, with the same template contexts. Those attributes belong to the copy of ng-select under select/vendor/, which is re-synced from upstream, so nothing here promises they keep their names; nothing under vendor/ was touched, and the sync stays as low-conflict as it was. Five of the slots — type-to-search, loading text, loading spinner, tag and clear button — did nothing at all before: written inside a <hub-select> they belonged to the wrapper's content, and the engine's own contentChild cannot see through an <ng-content>."
						},
						{
							type: 'added',
							description:
								'A <hub-legend> written as a direct child of a fieldset is lifted into the native <legend>, which is where the required marker and the invalid state live. It is the same element legend="…" now builds, so a text legend and a rich one produce the same DOM and the same classes.'
						},
						{
							type: 'changed',
							description:
								'<hub-fieldset legend="…"> renders its text inside a <hub-legend>. The legend had two shapes that coexisted — the legend input drew bare text into .hub-fieldset__legend, and the hubLegend template slot drew whatever it was given, usually a <hub-legend> re-declaring the same colour, size and weight from the same tokens one level down. Two DOM contracts for one element, with a silent precedence rule between them. Nothing changes visually; see BREAKING_CHANGES.md if you style .hub-fieldset__legend with a child combinator.'
						},
						{
							type: 'deprecated',
							description:
								'The hubLegend template slot, and the vendored ng-*-tmp attributes and NgOptionComponent. All keep working and are removed in 23.0.0. Each template attribute has a one-for-one hubSelect* replacement; <ng-option> has [items], and never reached the engine through <hub-select> in the first place, so a select declared that way was always empty.'
						},
						{
							type: 'fixed',
							description:
								"getActiveElement() no longer defaults its root to a document that may not exist, which crashed a server render. Three doc comments also claimed the select's catch-all <ng-content> carries <ng-option> through to the engine; it does not, and the true half of that sentence — the catch-all is declared first and opens straight into the dropdown — is why the addon slots are templates."
						}
					]
				},
				{
					version: '22.33.2',
					date: '2026-09-08',
					changes: [
						{
							type: 'fixed',
							description:
								"The select's two write-value diagnostics no longer reach a production console. The vendored engine refuses a model it cannot map — an object bound with bindValue and no [compareWith], or a scalar handed to a [multiple] select — and drops it. Both refusals were announced with an unguarded console.warn, so the message landed in the browser of whoever was using the application rather than of whoever wrote the form, with no way to switch it off. They are worth keeping, because a value discarded in silence is the harder bug, so they were not deleted like the two warnings 22.33.0 removed: those had somewhere better to be said, while these describe a value the library is dropping right now. The message is now emitted only under isDevMode() and prefixed with [ng-hub-ui-forms]. The same values are refused, in the same way."
						}
					]
				},
				{
					version: '22.33.1',
					date: '2026-09-07',
					changes: [
						{
							type: 'fixed',
							description:
								'The READMEs document labelType="visually-hidden". The value shipped in 22.33.0 and was written down in FUNCTIONALITIES.md and here, but not in either README, so the one file a reader opens from the package itself still described three label types — all of which draw the label — and said nothing about the option that exists for the case where drawing it is not possible.'
						}
					]
				},
				{
					version: '22.33.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'added',
							description:
								'labelType="visually-hidden", a fourth HubLabelType value, so a control with no room for a visible label still has an accessible name. The old choice was to draw the label anyway or ship an input with no name, which is what a toolbar search box or a compact grid cell got: the label input defaults to an empty string, no field exposed aria-label or aria-labelledby, and an aria-label written on hub-input stays on the host and never reaches the control. The new value renders the label, keeps it bound to the control and then clips it out of the page, rather than display: none, which would take the name away with the pixels. Honoured by hub-input (checkboxes and switches included), hub-textarea, hub-select, hub-datepicker, hub-timepicker, hub-otp-input, hub-slider, hub-segmented and hub-file-input, which gains the labelType input it never had; on the dropzone, floating and horizontal keep rendering the stacked label they always did, because it has neither arrangement to offer. hub-otp-input and hub-segmented render a group of controls rather than one control, so a label whose for points at a div names nothing: both put the label text on the group through aria-label, which is what leaves them named once the visible label is clipped away.'
						},
						{
							type: 'added',
							description:
								'fieldset[hubFieldset], so grouping a few fields costs one element instead of two. The container was an element-only selector whose template emitted a fieldset of its own, so every group a consumer wrote came out as a hub-fieldset wrapping a fieldset — a box with no meaning of its own, sitting between a form grid or flex container and the children it lays out. The component now also matches fieldset[hubFieldset], the two-selector shape ng-hub-ui-buttons already uses, and in that form it dresses the host instead of emitting a second fieldset. Both forms take the same inputs and produce the same legend, the same group-level errors and the same classes, so moving from one to the other changes nothing but the tag. It is restricted to fieldset on purpose: on a div it would draw a legend over a group with none of the semantics assistive technology reads from a real fieldset.'
						},
						{
							type: 'removed',
							description:
								'The two console.warn calls the library made into its consumer\'s console. One announced that an inline required loses to the validators of the reactive control it is bound to; the other that hub-input type="file" is deprecated. Both were addressed to whoever wrote the application, and both are already said where that person reads them — the @deprecated tags an editor surfaces on hover, the READMEs, BREAKING_CHANGES.md and the changelog — while the console copy could not be turned off by the only party it reached, who did not write it. Neither behaviour changes: the reactive validators still decide required, and the file format still works until the next major removes it.'
						},
						{
							type: 'fixed',
							description:
								"The stylesheets the README tells you to import are now declared in exports. 22.5.0 moved the SCSS to ng-hub-ui-forms/styles and announced that the documented @use resolved, but the manifest carried no exports field, so ng-packagr generated one from the entry points alone and the copied sheets were named nowhere. Angular's own CLI never noticed, because it resolves SCSS through node_modules load paths and ignores exports, while any resolver that honours the manifest (require.resolve, a webpack pkg: or sass-loader setup, tooling that reads the map) got ERR_PACKAGE_PATH_NOT_EXPORTED for a path the docs teach everywhere. ./styles, ./styles/index.scss and the three theming mixins (forms-theme, segmented-theme, file-input-theme) are now declared explicitly, matching the shape ng-hub-ui-ds and ng-hub-ui-avatar already use."
						},
						{
							type: 'fixed',
							description:
								"The inline-required warning no longer reaches production consoles. The notice that a reactive control's validators override the inline required input is advice for whoever is writing the form, so it belongs in development, where it can still be acted on; unguarded, it became noise a consumer could not switch off in their own users' browsers. It is now behind isDevMode() and carries the [ng-hub-ui-forms] prefix, like the deprecated-file-format warning it sat inconsistently beside."
						}
					]
				},
				{
					version: '22.32.0',
					date: '2026-09-03',
					changes: [
						{
							type: 'changed',
							description:
								"HubInvertColorPipe accepts any CSS colour and no longer throws. It parsed hex only and raised Error('Invalid HEX color.') on anything else — an exception thrown from a template, where nothing can catch it. It now resolves rgb(), hsl(), oklch(), oklab(), named colours and 4/8-digit hex through parseColor() from ng-hub-ui-utils, preserves alpha, and returns #000000 for input it cannot resolve."
						},
						{
							type: 'changed',
							description:
								'bw: true decides by OKLCh perceptual lightness rather than the YIQ > 186 threshold, matching what the --hub-sys-color-*-on token paints. A third `metric` argument selects lightness (default), apca or wcag. See BREAKING_CHANGES.md: 41.6% of the sRGB cube changes result.'
						}
					]
				},
				{
					version: '22.31.0',
					date: '2026-09-02',
					changes: [
						{
							type: 'added',
							description:
								'formTextType="tooltip": helper text behind a question mark at the end of the label row. The input has been public since the beginning and had only ever accepted bottom, so helper text was always a line under the control. That works for a sentence and stops working the moment the text explains something: a paragraph under every field turns a form into a document and pushes the next field off the screen. The mark is pushed to the end of the row, so a column of fields lines its marks up instead of scattering them. Available on all nine fields that carry helper text, and on hub-signature from its 22.6.0.'
						},
						{
							type: 'changed',
							description:
								'formText and formTextType now live on HubFieldControl, so every field inherits one declaration. Breaking for a subclass of your own that declares either itself: TypeScript refuses the redeclaration without an override modifier. Delete yours and inherit the base one. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.30.0',
					date: '2026-09-02',
					changes: [
						{
							type: 'added',
							description:
								"plaintext on hub-input and hub-textarea: the value with no field around it. The other half of readonly, and the difference is who the field is for. readonly still belongs to somebody filling a form in, so it keeps the box; plaintext is for a value that is merely being shown, where the box is noise and a screen full of them reads as a form that refuses to work. Modelled on Bootstrap's form-control-plaintext, so the control stays a real input and the label still labels it. The padding goes and the border turns transparent without losing its width, so values stay on the same baseline as editable neighbours. Every affordance goes with the box, the textarea's character counter included."
						}
					]
				},
				{
					version: '22.29.0',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								'The datepicker panel is as wide as the day grid and stays that width all year. It used width: max-content, so it sized itself to whichever child was widest, and with the month spelled out that child was the header rather than the calendar.'
						},
						{
							type: 'changed',
							description:
								"The header writes the month abbreviated by default. monthFormat accepts 'long' where the panel has been widened; widening is a :root declaration because the calendar renders in an overlay attached to document.body."
						}
					]
				},
				{
					version: '22.28.0',
					date: '2026-08-31',
					changes: [
						{
							type: 'fixed',
							description:
								'hub-datepicker no longer opens its calendar behind a modal. The overlay the calendar lives in takes a stacking layer above HubModal, and its backdrop one below the calendar, so the panel is both visible and dismissable.'
						},
						{
							type: 'added',
							description: "--hub-datepicker-overlay-zindex, the calendar's stacking hook."
						}
					]
				},
				{
					version: '22.27.0',
					date: '2026-08-30',
					changes: [
						{
							type: 'added',
							description:
								'hub-input can hold the mixed state. A checkbox accepts indeterminate, which reflects the native DOM property rather than an attribute, so it survives a value change.'
						}
					]
				},
				{
					version: '22.26.0',
					date: '2026-08-27',
					changes: [
						{
							type: 'added',
							description:
								'hub-timepicker carries an input group, like every other field that renders as a box with a value.'
						},
						{
							type: 'fixed',
							description:
								"The append half of 22.25.1's corner fix had no test: its spec projected a select into the append slot, which the flattening rule cannot reach, so it passed with and without the fix."
						}
					]
				},
				{
					version: '22.25.1',
					date: '2026-08-26',
					changes: [
						{
							type: 'fixed',
							description:
								"A field projected into a hubPrepend / hubAppend slot kept its outer corners. Attaching a number to the front of a select drew the projected input with all four corners square (0 0 0 0 measured in a browser) behind the group's own rounded edge, because the sheet's corner-flattening descendant rule reads .hub-field__control inside a group as \"the control this group is built around\" — an assumption that held until a slot could hold a whole field. The outer corner is handed back where the seam is squared, scoped to the element actually on the outside, since a slot may hold two fields and the second one's leading edge is a seam like any other."
						}
					]
				},
				{
					version: '22.25.0',
					date: '2026-08-26',
					changes: [
						{
							type: 'changed',
							description:
								'@angular/cdk is no longer a peer dependency. One component used it, the datepicker, for the overlay it opens; consumers of the other twenty were carrying a dependency they never asked for.'
						}
					]
				},
				{
					version: '22.24.0',
					date: '2026-08-25',
					changes: [
						{
							type: 'added',
							description:
								'hub-select and hub-datepicker honour labelType="floating", and every field that floats a label now looks identical doing it. The select had accepted the input for as long as floating labels existed and quietly ignored it, so a form that floated its text fields and put a select among them came out with one label inside the box and the next one above it. The geometry is now three shared tokens all of them read, rather than a copy each — which is precisely how the select had drifted from the input. At rest the label IS the placeholder: the field\'s own font size, the placeholder colour, centred in the box; measured against a plain field\'s placeholder it is 16px against 16px, the same muted colour, and zero deviation from the centre.'
						},
						{
							type: 'added',
							description:
								'The library is right-to-left throughout. Thirty declarations across select, datepicker, input and textarea moved to logical properties, and the three components whose geometry is only half CSS were handled individually and measured in a browser in both directions: the slider (a native range genuinely mirrors, but its fill is a background image and background positions answer to nothing), the switch (its knob and the transition naming it had to move together — naming the physical property while the inset is logical animates nothing) and the segmented control, whose CSS was already correct but which never re-measured on a direction change, leaving the indicator up to 145px from the option it marked.'
						},
						{
							type: 'changed',
							description:
								'A hub-select is 2px shorter and every floating field is 10px taller. --hub-select-min-height was a hard-coded 2.5rem that had drifted from the arithmetic every other field arrives at, so a select stood 2px taller than an input or a datepicker and an input attached to one was stretched to match; it is derived now, and the three land on the same pixel. See BREAKING_CHANGES.md — the compiler cannot warn about a change of height.'
						}
					]
				},
				{
					version: '22.23.2',
					date: '2026-08-24',
					changes: [
						{
							type: 'fixed',
							description:
								"A form that sets --hub-field-stack-gap is obeyed again. 22.23.1 declared the token's default in :root, and two :root declarations tie on specificity, so the winner was whichever stylesheet the application imported last — an application whose own token file came first had its 1rem silently overruled and every stacked field touched. The default now lives where it is read, as the fallback of var(--hub-field-stack-gap, 0), which competes with nobody."
						}
					]
				},
				{
					version: '22.23.1',
					date: '2026-08-24',
					changes: [
						{
							type: 'added',
							description:
								"--hub-field-stack-gap, the space a field leaves under itself when fields are stacked. Zero by default — the gap between fields has always been the container's to give — so no existing form moves. What it buys is that a form can hand that job to the fields, and that a control built into somebody else's chrome can be excluded from it."
						},
						{
							type: 'fixed',
							description:
								"A control hubFormControlAdapter creates is no longer part of a stack. Field hosts carry a stacking margin so fields written one under another in a form breathe; a control created into another component's chrome — a table's search group, a paginator's row — is in no such list, and the gap it kept made the group taller than the field, so a table's search button overshot its own field by exactly that margin, 54px against 38px. The adapter is the only place that knows a control is being embedded, so it zeroes the token on the host as the component is created."
						}
					]
				},
				{
					version: '22.23.0',
					date: '2026-08-23',
					changes: [
						{
							type: 'added',
							description:
								'hub-timepicker, a time of day as HH:MM. The family had a date and no hour, so a product needing one reached for a text field with an HH:MM pattern — which gives no numeric keyboard on a phone, offers nothing when the field is focused, and lets "8:00" through until submit rather than while it is typed. Built on the platform\'s input type="time", so the keyboard, the stepper and the reader\'s own 12- or 24-hour presentation come from the browser, while what the form holds is always HH:MM regardless of locale. An empty field publishes null rather than an empty string, because "no time" is an absence and a zero-length string sails past a required written as a null check; and a value carrying more than the hour — 09:30:00, a whole instant — is trimmed to what it can show instead of rendering nothing, which is what the native control does with anything it cannot parse.'
						}
					]
				},
				{
					version: '22.22.0',
					date: '2026-08-21',
					changes: [
						{
							type: 'added',
							description:
								'searchFn reaches the engine. The underlying select has always taken one; this wrapper never passed it on, so a consumer who wanted typing to match on something the option shows and the label does not — the building a room is in, the code beside a name — had to smuggle it into bindLabel and hide it again behind a label template.'
						},
						{
							type: 'fixed',
							description:
								'An addTag that resolves with nothing no longer adds anything. The synchronous branch has always guarded that; the promise branch did not, so a creation dialog the user dismissed, or a request the server refused, became an option built out of null, pushed into the list and written into the form.'
						}
					]
				},
				{
					version: '22.21.0',
					date: '2026-08-18',
					changes: [
						{
							type: 'added',
							description:
								"The seam of a group can be undone. Attached content is welded to the control and to its neighbours — shared corners flat, no space between, one border shared — which is right while the strip has to read as a single line and wrong the moment the field is not drawn as a box, as inside a table cell. Four tokens govern it (--hub-input-group-attached-radius, -gap, -border-width, -border-color) and their defaults are exactly today's behaviour. The last two exist because sharing one variable held only while both were drawn: zeroing the field's border erased the border of every button beside it, and an outline button collapsed into a bare glyph. They are declared at :root and never redeclared on a component host, so a cell, a toolbar or a panel sets them and every field inside obeys."
						}
					]
				},
				{
					version: '22.20.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'changed',
							description:
								'The two attach slots document that they take a field, not only an action. hubPrepend and hubAppend gained the capability in 22.20.0 and said nothing about it, which is the same as not having it. The JSDoc now states the shape and its two limits — only hub-input, hub-select, hub-textarea and hub-datepicker, and only as a direct child of the template, since wrapping one in a div silently falls back to the treatment an action gets. Both READMEs carry the same.'
						}
					]
				},
				{
					version: '22.20.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'added',
							description:
								'hubPrepend / hubAppend can now attach a FIELD, not only a button. A hub-select projected into a slot kept its own rounded leading corners and sat a padding-width away from the control, so the two read as a field and a loose control parked beside it — the opposite of attaching them. The slot\'s rules assumed they could reach the box they were squaring, which holds for a button, an anchor or a bare span, whose border and radius sit on the very element the slot selects; a field primitive holds neither on its host, because the box lives on the control inside it. The treatment is forwarded one level down now: the host gives up the border and padding it should never have taken, and the inner control takes the squaring — the leading radius of a projected select goes from 6px to 0, the host border from 1px to 0, and the overlap with the field is one border width, so the pair draws as a single line. hub-input, hub-select, hub-textarea and hub-datepicker are covered, as direct children of the template, on both slots. The case is ordinary rather than a curiosity: a price and the period it is a price of are one statement, and splitting "180 € a month" across two fields makes the reader reassemble it on every row.'
						}
					]
				},
				{
					version: '22.19.1',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'The package shipped without its licence notice. package.json declared MIT, but no LICENSE file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions.'
						}
					]
				},
				{
					version: '22.19.0',
					date: '2026-08-17',
					changes: [
						{
							type: 'fixed',
							description:
								'A range picker committed a range that had only one end. The first click was published straight away as { start, end: null }, so opening a picker that already held a complete span and clicking a new start destroyed the old value before the user had chosen anything — and dismissing the panel there left the control holding a half-open shape every consumer then has to defend against. The first pick is a question now: it is drawn and previewed, but nothing reaches the control until the second end lands, and dismissing half-way rolls the panel back to the last committed value so the field and the model never disagree. An explicit clear still publishes null, and day-time-range was never affected because picking the day settles both ends at once.'
						}
					]
				},
				{
					version: '22.18.1',
					date: '2026-08-16',
					changes: [
						{
							type: 'fixed',
							description:
								'A number field with no bounds wrote min="null" and max="null". [min] is a property binding and the IDL property stringifies whatever it is handed, so an unset input reached the DOM as the literal string. Browsers ignore it and typing was never affected, which is why it survived — but assistive technology reads the attributes as present and announces valuemin=0 valuemax=0, telling a screen-reader user that a price field accepting any amount had to be zero. Bound through [attr.min] / [attr.max] now, which removes the attribute instead.'
						},
						{
							type: 'fixed',
							description:
								'A button projected into hubAppend or hubPrepend ignored its own variant and color. The slot doubles its class to beat chrome arriving from another package, and that weight also swallowed what the consumer asked for, so hubButton accepted two inputs and discarded them without a word. The fill is wrapped in :where() now — a default rather than a verdict: a bare span still gets a surface, anything that styles itself outranks it.'
						},
						{
							type: 'fixed',
							description:
								'The border of an attached action vanished under the pointer. Attached actions overlap by a border width so a run reads as one line, which leaves the shared pixel to whichever paints last — the one further right, always. The action under the pointer or the focus ring is now raised above its neighbour, and only then: raising it permanently would stop DOM order drawing the run as one line at rest.'
						}
					]
				},
				{
					version: '22.18.0',
					date: '2026-08-16',
					changes: [
						{
							type: 'added',
							description:
								'hub-datepicker gains mode="day-time-range" — one day and two times within it. Booking a room, a slot or a shift is not two free instants; it is the day, from 09:00 to 11:00, and range mode could not say that because its two ends are free to land on different days. The value is still a HubDateRange, so serialization, min/max and valueFormat are untouched and back ends taking a span need no change; what the mode adds is the guarantee that both ends share a calendar day, enforced by a control that cannot express anything else rather than by a validator running afterwards. One click on the day settles the whole span, the two time strips carry the rest, and the input names the day once. The mode implies a time, so a granularity coarser than hour is raised to it.'
						},
						{
							type: 'added',
							description:
								'hub-datepicker in range mode now previews the half it is still waiting for. Between the two picks the grid said nothing: the anchor was lit and every other cell was inert, so the days the range was about to swallow gave no sign as the pointer swept over them. The band the range would take is now drawn against the cell under the cursor — or the one keyboard navigation last moved to — painted with a new --hub-daterangepicker-preview-bg, half the tint of the committed band and derived from it so retinting the range moves the preview with it. Works in both directions, and a disabled day under the cursor is skipped rather than dropping the band.'
						},
						{
							type: 'fixed',
							description:
								'The control repainted the edge it shares with attached content. Whatever a slot projects is pulled onto the field border by a negative inline margin, so the two borders land in the same pixel column and paint order decides which one you see. The select container is position: relative — the engine own rule — and the slot was static, so the control painted last and swallowed the attached border. It stayed hidden because both borders share a colour by default; it only surfaced once a consumer themed a projected button differently from the field. The slot is now positioned, with no z-index.'
						},
						{
							type: 'fixed',
							description:
								'A hubAppend or hubPrepend slot that projects two elements drew a rounded corner in the middle of the strip. The rule that flattens a run of string addons tests position among the group children, and everything a slot projects lands inside a single __attached wrapper, so it never saw them — the strip only squared the edge it shares with the control. Each side now hands its inner corners over too, leaving the radius to whichever element is outermost. Fixed for input, select, datepicker and textarea alike.'
						},
						{
							type: 'fixed',
							description:
								'The datepicker panel header capitalized wrong outside English. Intl renders the month and year as "agosto de 2026" and text-transform: capitalize raised every word — "Agosto De 2026" — which no consumer could undo, because component styles are injected after the global sheet. The header now raises only its initial. The weekday and period labels keep word casing on purpose: both render a single Intl token, and both are inline-flex boxes, which ::first-letter does not apply to.'
						}
					]
				},
				{
					version: '22.17.1',
					date: '2026-08-13',
					changes: [
						{
							type: 'fixed',
							description:
								'Every hub-select with an addon shipped 22.17.0 with both corners still round, drawing as separate boxes parked together. Widening the flattening selector to reach the datepicker nested input trimmed the select branch from .hub-select__control.ng-select .ng-select-container to a bare .ng-select-container — four classes down to two, under the three the select theme spends on that same corner from a stylesheet that loads later. The branch is spelled out to the engine class again, keeping the descendant combinator the datepicker needs. Reaching an element and winning it are different things, and only the second one paints.'
						}
					]
				},
				{
					version: '22.17.0',
					date: '2026-08-13',
					changes: [
						{
							type: 'fixed',
							description:
								"hub-datepicker kept its input fully rounded between an addon and an attached action, drawing three separate boxes where the other fields draw one. The flattening rule used a child combinator, and this field's input is a grandchild of the group — it sits inside the __trigger that serves as the overlay origin — so the rule read as though it covered every field while matching nothing on the nested ones. It is now descendant-scoped and reaches the control wherever a field nests it."
						},
						{
							type: 'fixed',
							description:
								'Content attached with [hubPrepend] / [hubAppend] collapsed to the width of its glyph unless it arrived pre-styled. A .btn brings its own inline padding and centres what it holds; a bare span around an icon brings neither, and rendered as an 18px sliver with the icon pinned to the top edge. Attached content now takes the field inline padding and centres its content, the same as the string addons — and nothing that already looked right moves, since that is the value .btn was already using.'
						},
						{
							type: 'changed',
							description:
								"The fill moved from the labels to the actions, so every field with an addon changes appearance. A static prepend / append now shares the field's own surface and the group reads as one box with a unit written inside it; what can be operated carries the fill instead. The fill is the affordance and it was on the wrong thing — a grey box holding a glyph reads as a button whatever the glyph means. Two tokens carry it, wired to the design system's semantic palette so it follows a themed build: --hub-<field>-group-action-bg and --hub-<field>-group-action-color. Setting --hub-input-group-addon-bg back to --hub-sys-surface-elevated restores the previous look. A projected control that brings its own background still wins."
						}
					]
				},
				{
					version: '22.16.1',
					date: '2026-08-13',
					changes: [
						{
							type: 'fixed',
							description:
								"hub-select ignored a placeholder set globally in NgSelectConfig — the last of the three inputs that overwrote the app's configuration with a value of its own, here an empty string, which is every bit as present as a sentence and just as effective at winning a ??. Nothing changes for an app that does not configure one: NgSelectConfig carries no placeholder default. The fallback now lives in this component rather than in the engine's template, which is re-synced from upstream. fixedPlaceholder and appendTo also differ from the engine's configured defaults and are left alone: both are deliberate and both say so in their JSDoc."
						}
					]
				},
				{
					version: '22.16.0',
					date: '2026-08-13',
					changes: [
						{
							type: 'added',
							description:
								"[hubPrepend] and [hubAppend] attach an icon or a button to a field's edge — anything richer than the text a prepend / append string can carry. Available on every field that renders as a box with a value: hub-input, hub-select, hub-textarea, hub-datepicker and hub-timepicker. They compose with the string addons rather than replacing them: the strings render first, so projected content is always outermost on its side — a unit labels the field, the action sits beyond it. Whatever is projected wears the field's border, radius and height rather than its own."
						},
						{
							type: 'added',
							description:
								"hub-textarea and hub-datepicker gain prepend / append group addons, the contract hub-input and hub-select already had. No new tokens: the shared structure falls back to the input's --hub-input-* tokens, so a field only declares its own when it wants to differ."
						},
						{
							type: 'changed',
							description:
								'The group and addon structure of all four fields now comes from one shared SCSS mixin instead of a copy each. The input and the select had already drifted — the input on physical properties and adjacent-sibling selectors, the select on logical ones — and both of the bugs this cost (22.13.1 and 22.15.1) are now written into the single place that can prevent them. The input gains correct RTL behaviour as a side effect. Attached content is marked hub-<field>__attached; the input keeps __affix for the glyphs it positions inside the box, which is a different thing.'
						},
						{
							type: 'deprecated',
							description:
								'[hubSelectSuffix] — use [hubAppend], which does the same on every field rather than only on the select. Shipped in 22.15.0 and superseded one release later: generalising the slot left the select with two names for one concept, and retiring the narrower one now costs less than documenting the difference forever. It keeps working and renders through the same slot; [hubAppend] wins if both are present.'
						},
						{
							type: 'fixed',
							description:
								'hub-select rendered "No items found" and "Add item" in English whatever the app configured. NgSelectConfig is the one place an app translates the dropdown\'s own strings, and the engine reads it as a fallback — but a fallback only fires on a missing value, and this component handed the engine its own English default, so the config was unreachable from every select in the app. Both inputs now default to undefined. An explicit notFoundText / addTagText still wins, so call sites passing the text by hand to work around this keep working and can drop it.'
						},
						{
							type: 'fixed',
							description:
								'A hub-select carrying only an attached action kept its trailing corner rounded under it. The select marked that case with --has-suffix while the shared flattening rule keys off --has-append, which it set from the string addons alone. The other three fields already read both sources; the select now does too, and --has-suffix is gone rather than left as a second name for the same state.'
						}
					]
				},
				{
					version: '22.15.1',
					date: '2026-08-12',
					changes: [
						{
							type: 'fixed',
							description:
								"An action attached with [hubSelectSuffix] did not wear the field's chrome: the seam was the action's own 1.5px dark border against the field's 1px light one, and the action stood about seven pixels taller than the control beside it. What gets projected brings chrome from its own package — hubButton sets a border width, a radius and vertical padding — through a single-class rule in a stylesheet that loads after this one, so a single class here tied on specificity and lost on order. The rule now doubles its own class to outrank that, and the action takes the field's border, radii and height, stretching into the row instead of setting its own. The existing specs stayed green through it because they assert that the action renders, stays out of the dropdown engine and follows the control in the DOM — all true the whole time, and none of them about how it looked."
						}
					]
				},
				{
					version: '22.15.0',
					date: '2026-08-12',
					changes: [
						{
							type: 'added',
							description:
								"hub-select gains prepend and append group addons, the same contract hub-input already had: a string is one addon, an array is a run of them, and empties are dropped rather than drawn as an empty box. A currency, a unit or a protocol now reads identically whichever field carries it. Three new tokens chained to the input's: --hub-select-group-addon-bg, --hub-select-group-addon-color and --hub-select-group-addon-border-color."
						},
						{
							type: 'added',
							description:
								"[hubSelectSuffix] attaches an interactive control to the select's inline-end edge — a button that acts on whatever is selected. Deliberately not the same slot as an addon: an addon is a static label sharing the field's border, while this is focusable and sits outside the box, so it never competes for the corner the dropdown arrow and the clear cross already share. It is a template rather than projected content because the select's catch-all ng-content carries ng-option through to the engine and would otherwise swallow it; rendering from a template also keeps the action after the control in the DOM, so tabbing reaches the field before the button acting on it. Both mechanisms compose, and the action is always the outermost element."
						}
					]
				},
				{
					version: '22.14.0',
					date: '2026-08-12',
					changes: [
						{
							type: 'added',
							description:
								'hub-datepicker gains a granularity axis: year, month, day, hour, minute and second. It also selects the panel — year and month render a 12-cell period grid, day the calendar, and anything finer adds a time strip of ARIA spinbuttons to it. From hour onwards the value is a full ISO 8601 timestamp carrying the reader\'s local wall clock and the offset of that very date (2026-09-01T09:00:00+02:00 in September, +01:00 for the same clock in January), so a validity window like "today from 9 to 21" no longer has to be rounded up to a whole day. The default is day, which emits the same bare YYYY-MM-DD string it always has.'
						},
						{
							type: 'added',
							description:
								'Three independent format axes, where before only display was configurable: parse says how a value coming in is read (ISO of any width, Date and epoch millis are detected automatically; the input is the escape hatch for anything else, and it applies to min and max too), valueFormat says what the bound control holds (iso, date, timestamp, or a function), and displayFormat says what the user reads — now accepting an Angular pattern like dd/MM/yyyy HH:mm or a function, on top of the Intl options it already took.'
						},
						{
							type: 'added',
							description:
								'minuteStep, secondStep, hourFormat and timeDisplayFormat, each with a global default in provideHubForms. hourFormat is derived from the locale unless forced, and it governs the input display as well as the panel. New translatable labels: done, hour, minute, second, meridiem, time, startTime and endTime — AM/PM comes from Intl, like month and weekday names.'
						},
						{
							type: 'changed',
							description:
								'min and max now honour the time, not just the day. A day is only disabled when no instant of it is allowed, so min = 2026-09-01T14:00 leaves 1 September clickable and lets the time controls do the finer refusing. Range endpoints are ordered by instant rather than by day, which is what makes a same-day 21:00 → 09:00 pair reorder itself instead of being left in click order with an end before its start.'
						},
						{
							type: 'changed',
							description:
								'HubDateRange and HubDateValue take an optional type parameter that defaults to string, so every existing annotation keeps compiling and keeps meaning what it meant. Consumers using valueFormat="date" write HubDateValue<Date>.'
						},
						{
							type: 'fixed',
							description:
								'An input with prepend or append drew two boxes instead of one field. The control kept its four rounded corners and the addon drew its own rounded box right against it, so <hub-input append="€"> read as a field with a separate pill parked behind it rather than as an amount with its unit. The rules meant to flatten the joining corners hung off the adjacent-sibling combinator and had never once matched, because the prefix and suffix affix spans are rendered unconditionally — an addon is never the control\'s adjacent sibling. The flattening is now driven by hub-input__group--has-prepend / --has-append on the group, so it no longer depends on what sits between the addon and the control, and in a run of several addons only the outermost one rounds its outer corners.'
						}
					]
				},
				{
					version: '22.13.0',
					date: '2026-08-07',
					changes: [
						{
							type: 'added',
							description:
								"A read-only theme, applied from the field's own state: readonly reached the native attributes and stopped there, so a read-only field went on drawing the border, background and focus ring of something you can type in — and next to an editable neighbour there was nothing to tell the two apart. hub-input, hub-textarea, hub-select and hub-datepicker now reflect it as hub-field--readonly, with no class to remember at the call site. Deliberately not the disabled treatment: the text keeps full contrast and stays selectable, only the chrome that offers input goes (background, border, focus ring, the select caret and clear cross, the datepicker icon). The padding stays, so the box and baseline still line up with the editable fields beside it, and the error border survives — an invalid value is a different message, and one the user still has to see."
						},
						{
							type: 'added',
							description:
								'New CSS tokens: --hub-input-readonly-bg, --hub-input-readonly-border-color, --hub-input-readonly-color and --hub-input-readonly-cursor.'
						}
					]
				},
				{
					version: '22.12.2',
					date: '2026-08-07',
					changes: [
						{
							type: 'fixed',
							description:
								"A disabled select stayed fully usable: setDisabledState set the component's own disabled signal and the template spent it on a hub-field--disabled class, but the inner select was never told. The field greyed out while its panel still opened and a choice still wrote through to a control the form had explicitly disabled. The disabled state now reaches the inner select, so it refuses interaction like every other field."
						}
					]
				},
				{
					version: '22.12.1',
					date: '2026-08-07',
					changes: [
						{
							type: 'fixed',
							description:
								"The slider's value bubble no longer gets cut in half at the ends of the rail: it was centred on the thumb with a flat translateX(-50%), which leaves half of it outside the component at 0 and at 100 — an ordinary scrollable form clips it. It now translates by the same percentage it is positioned at, pinning its left edge to the start of the rail and its right edge to the end. Both bubbles of a range slider follow the same rule."
						}
					]
				},
				{
					version: '22.12.0',
					date: '2026-08-04',
					changes: [
						{
							type: 'fixed',
							description:
								'The password reveal toggle never worked: resolvedType is a computed() but the reveal flag was a plain class field, so toggling never re-evaluated the native type. The state is now the passwordRevealed two-way model and the toggle flips password/text as expected.'
						},
						{
							type: 'fixed',
							description:
								'Readonly password fields no longer expose the secret: readonly used to force type="text", printing the password in clear. Password fields now stay masked when readonly (an explicit toggle click may still reveal); other formats keep the readonly → text behaviour.'
						},
						{
							type: 'added',
							description:
								'The reveal toggle renders inside the input group as an integrated trailing addon (visually attached to the field), instead of a detached button.'
						},
						{
							type: 'added',
							description:
								'passwordRevealed two-way model, passwordToggle (default true, hides the toggle when false), hideOnBlur (default true, re-masks a revealed password on blur), capsLockWarning (default true, hint under the field while Caps Lock is active), passwordStrength (default false, opt-in 4-segment strength meter with the exported scorePasswordStrength heuristic and a global strengthFn override clamped 0–4), and autocomplete for text-like formats.'
						},
						{
							type: 'added',
							description:
								'password section in HubFormsConfig (HubPasswordLabels): toggle accessible names, Caps Lock hint, strength level labels and the optional strengthFn — all localizable via provideHubForms.'
						},
						{
							type: 'added',
							description:
								'New CSS tokens: --hub-input-password-toggle-width, --hub-input-capslock-color, --hub-input-strength-{height,gap,track,1,2,3,4}.'
						},
						{
							type: 'removed',
							description:
								'The broken public showPassword field. Migrate to the passwordRevealed model ([(passwordRevealed)]).'
						}
					]
				},
				{
					version: '22.11.1',
					date: '2026-07-30',
					changes: [
						{
							type: 'fixed',
							description:
								"ng-select-opened never reached the host in apps without a global tick (zoneless / OnPush islands), so the 22.11.0 caret flip did not engage: open() refreshes only its own template via a local detectChanges(), and host bindings apply during the parent view's refresh. The class is now reflected imperatively (synchronously from open()/close() plus an effect for [isOpen]-driven writes), the same renderer mechanism as ng-select-bottom. Regression spec toggles the select under zone-based AND zoneless CD with no manual tick."
						}
					]
				},
				{
					version: '22.11.0',
					date: '2026-07-29',
					changes: [
						{
							type: 'fixed',
							description:
								'The select caret never rendered: the vendored engine ships .ng-arrow as a 0×0 span (CSS border-triangle) and the theme only published border-color — a colour on a borderless box. The full declaration (border-style + token-driven border-width) now ships, the wrapper gains inline clearance so the triangle does not touch the value, and the caret flips upwards while the panel is open. Regression spec asserts the complete closed AND open declarations.'
						},
						{
							type: 'added',
							description:
								"--hub-select-arrow-size (5px — the border of the caret triangle) and --hub-select-arrow-gap (var(--hub-ref-space-2, 0.5rem) — the wrapper's inline clearance), so dense layouts that already tune --hub-select-font-size / -padding-x / -min-height can scale the caret on the same axis."
						}
					]
				},
				{
					version: '22.10.0',
					date: '2026-07-28',
					changes: [
						{
							type: 'changed',
							description:
								'Accent resolution dedup: the private copy of resolveHubAccent was dropped for the canonical helper from ng-hub-ui-utils (new peer >=22.7.0, co-installed by ng add). No behaviour change.'
						}
					]
				},
				{
					version: '22.9.0',
					date: '2026-07-27',
					changes: [
						{
							type: 'added',
							description:
								'hub-select async/tagging passthrough (dropdown format): addTag (true or a term-mapping function, sync or Promise), addTagText, minTermLength, typeahead (a Subject<string> receiving term changes for server-side loading) and compareWith (custom item/value equality, applied only when provided).'
						},
						{
							type: 'added',
							description:
								'hubSegmentedOption template — <hub-segmented> accepts a projected <ng-template hubSegmentedOption let-option let-selected="selected" let-index="index"> replacing each segment\'s content (icons, badges, rich markup) while the component keeps owning selection, keyboard navigation and ARIA. Exported as HubSegmentedOptionDirective + HubSegmentedOptionContext.'
						},
						{
							type: 'fixed',
							description:
								"required is reflected to assistive technology on every field: hub-select forwards aria-required to the vendor's combobox search input (via inputAttrs), hub-segmented sets it on the radiogroup surface and hub-otp on each cell."
						},
						{
							type: 'fixed',
							description:
								'required derivation now also works with direct [formControl] binding — the Validators.required introspection previously only ran with a formControlName string.'
						}
					]
				},
				{
					version: '22.8.0',
					date: '2026-07-09',
					changes: [
						{
							type: 'added',
							description:
								'--hub-select-dropdown-zindex — canonical spelling of the select dropdown stacking hook (zindex without a hyphen, matching --hub-sys-zindex-*), read first at the consumption point so setting it anywhere in the cascade wins.'
						},
						{
							type: 'deprecated',
							description:
								'--hub-select-dropdown-z-index (hyphenated spelling) keeps working but is scheduled for removal after one release cycle; migrate overrides to --hub-select-dropdown-zindex.'
						}
					]
				},
				{
					version: '22.7.0',
					date: '2026-07-09',
					changes: [
						{
							type: 'added',
							description:
								'<hub-file-input> dropzone chrome is themeable end to end. An icon medallion (--hub-file-input-icon-bg / -icon-chip-size / -icon-chip-radius), a browse action that can render as a button (--hub-file-input-browse-bg / -padding-* / -radius / -text-decoration, plus an optional leading glyph), a second invitation line (dropSubtext label + [dropSubtext] input, and [dropText] to override the first one per instance), and the hubFileDropzoneNotice slot for arbitrary markup above the glyph. Every default is unchanged, so no existing consumer moves a pixel.'
						}
					]
				},
				{
					version: '22.6.1',
					date: '2026-07-09',
					changes: [
						{
							type: 'fixed',
							description:
								"<hub-file-input> dropped the uploader's response body. HubFileUploadEvent carries a response on done — typically the record the server created — but the component discarded it, leaving the application unable to reference the file it had just uploaded. HubFileItem now exposes a response field, populated on done and reset to null when the upload is retried or cancelled."
						}
					]
				},
				{
					version: '22.6.0',
					date: '2026-07-09',
					changes: [
						{
							type: 'added',
							description:
								'New <hub-file-input> control — a full field (extends HubFieldControl) for picking files: single or multiple, drag & drop, clipboard paste, accept / maxSize / minSize / maxTotalSize / maxFiles constraints enforced on drops and pastes (the native accept attribute only filters the OS dialog), duplicate detection, and list / grid previews with image thumbnails. The form value stays native (File | File[] | null), so it goes straight into a FormData; the rich per-file state lives in the files() signal.'
						},
						{
							type: 'added',
							description:
								'Optional upload support: register a HubFileUploader with provideHubFileUploader() and the field drives per-file progress, cancel and retry. The event carries raw loaded/total bytes so an unknown total renders an indeterminate bar instead of a stalled 0%; cancel() unsubscribes, which aborts the underlying HttpClient request. The library ships the contract, never the transport.'
						},
						{
							type: 'added',
							description:
								'Six exportable validators — hubAcceptedFiles, hubMaxFileSize, hubMinFileSize, hubMaxTotalSize, hubMaxFiles, hubMinFiles — with default messages wired into invalidFeedbackTemplateFn. The component inputs filter; the validators invalidate, which also catches a value patched in programmatically.'
						},
						{
							type: 'added',
							description:
								'Customization: 66 --hub-file-input-* tokens (every icon is a swappable CSS mask), the hub-file-input-theme(...) one-call mixin, projected <ng-template hubFileIcon> / <ng-template hubFilePreview> templates, and localizable labels via provideHubForms({ fileInput: … }).'
						},
						{
							type: 'deprecated',
							description:
								'hub-input: type="file" (with its accept, multiple and buttonLabel inputs) is deprecated in favour of <hub-file-input> and will be removed in the next major. It is a bare picker: no drag & drop, no size limits, no preview, no per-file removal, and its accept is not enforced on a drop.'
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
								'<hub-segmented> [color] now accepts ANY colour — a semantic accent name, a registered custom accent, or a literal #hex / rgb() / oklch(). It feeds a single --hub-segmented-accent slot and the selected pill derives a legible contrast text automatically.'
						},
						{
							type: 'added',
							description:
								"hub-forms-theme(...) mixin — one-call theming for the shared field chrome (--hub-form-* focus ring, invalid/valid colours, disabled opacity, transition). @use 'ng-hub-ui-forms/styles' as *;"
						},
						{
							type: 'changed',
							description:
								"BREAKING: SCSS now ships at ng-hub-ui-forms/styles (was src/lib/styles), so @use 'ng-hub-ui-forms/styles' resolves; the segmented per-variant @each is replaced by a --hub-segmented-accent-derived rule."
						}
					]
				},
				{
					version: '22.4.0',
					date: '2026-07-05',
					changes: [
						{
							type: 'added',
							description:
								'New <hub-segmented> control — a segmented control field (extends HubFieldControl, so it carries label/labelType/formText + validation). Single-select (radiogroup) or multiple (role=group with aria-pressed, array value) via [multiple], horizontal or vertical via [vertical], keyboard navigation, themed through --hub-segmented-* tokens.'
						},
						{
							type: 'added',
							description:
								'hub-slider: gradient-capable fill via the new --hub-slider-track-fill token (layers a full background image over the track, single + dual thumb), plus a flush labelless mode that collapses the value-bubble headroom (--hub-slider-value-space) when showValue is off.'
						},
						{
							type: 'fixed',
							description:
								'hub-select: a dropdown opened inside a modal no longer hides behind it — the panel stacks above HubModal via the new --hub-select-dropdown-z-index token.'
						},
						{
							type: 'deprecated',
							description:
								'hub-select: the non-dropdown formats (format="buttons"/"checkbox"/"radio") are deprecated in favour of <hub-segmented> and will be removed in the next major. Migrate: buttons → hub-segmented; checkbox → hub-segmented [multiple]; radio → hub-segmented [vertical].'
						}
					]
				},
				{
					version: '22.3.1',
					date: '2026-07-02',
					changes: [
						{
							type: 'fixed',
							description:
								'CSS variable fallbacks realigned to the ds light defaults (--hub-ref-font-family-base and --hub-sys-shadow). The fallbacks only apply when ng-hub-ui-ds is not loaded.'
						}
					]
				},
				{
					version: '22.3.0',
					date: '2026-07-01',
					changes: [
						{
							type: 'added',
							description:
								'hub-input: in-field affixes via the hubInputPrefix / hubInputSuffix projection slots — project a <hub-icon> (any pack, pack:variant:name shorthand), RTL-aware via logical CSS properties. It themes the icon with its --hub-input-icon-* tokens.'
						},
						{
							type: 'added',
							description:
								'hub-input: built-in clearable input — renders an internal ✕ button (swappable --hub-input-clear-icon glyph) that resets the control and emits an empty search term.'
						},
						{
							type: 'added',
							description:
								'hub-input: debounced typeahead — new search output and debounceTime input for live filtering / autocomplete.'
						}
					]
				},
				{
					version: '22.2.0',
					date: '2026-06-29',
					changes: [
						{
							type: 'added',
							description:
								'hubFormControlAdapter — a ready-made adapter that renders primitive controls (hub-input / hub-select) on demand through dynamic component creation, bridging value-in / change-out. It lets other ng-hub-ui libraries host forms controls without a hard dependency: wire it into their optional token, e.g. provideHubPaginableFormControls(hubFormControlAdapter) for the ng-hub-ui-paginable table. Exposed alongside the structural HubFormControlAdapter / HubFormControlConfig / HubFormControlHandle / HubFormControlOption types, and it needs provideHubForms() or the default config in the environment.'
						}
					]
				},
				{
					version: '22.1.2',
					date: '2026-06-26',
					changes: [
						{
							type: 'changed',
							description:
								'Text sitting on the primary accent adopted the derived -on contrast token: --hub-select-option-selected-color, --hub-select-button-selected-color and --hub-daterangepicker-active-color resolve to var(--hub-sys-color-primary-on, #fff) instead of a hard-coded white, so a light or custom primary keeps the selected label or day legible. --hub-daterangepicker-in-range-bg moved from color-mix(in srgb) to color-mix(in oklch) for perceptually even mixing.'
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
								'Design-token consistency pass: inline fallback defaults aligned with the canonical ng-hub-ui-ds values, and hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) routed through their --hub-sys-* / --hub-ref-* tokens so they follow the active theme. No visual change when the ds tokens are loaded.'
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
								'An opt-in valid/success state, mirroring the invalid contract. A field that opts in through showValid — or globally through provideHubForms({ showValid: true }) — renders a success border and focus ring once it is touched and valid, with an optional validFeedback message below the control. The success state is never automatic: only invalid is. It comes with four tokens chained to the --hub-sys-color-success family and the .hub-field__control--valid / .hub-field__feedback--valid hooks.'
						},
						{
							type: 'changed',
							description:
								'The --hub-daterangepicker-padding shorthand was replaced with the canonical directional --hub-daterangepicker-padding-x / -y pair. No visual change, but set the -x / -y tokens instead of the removed shorthand.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{
							type: 'changed',
							description: 'Aligned with Angular 22, and the README documentation standardised.'
						}
					]
				},
				{
					version: '21.0.0',
					date: '2026-06-15',
					changes: [
						{
							type: 'added',
							description:
								'Initial release: hub-input (10 formats), hub-textarea, hub-slider (single + range), hub-select (dropdown + buttons/radio/checkbox), hub-datepicker (single + range), hub-form/hub-fieldset/hub-legend containers.'
						},
						{
							type: 'added',
							description:
								'Automatic validation-error display at control, group and form level, with provideHubForms() configuration.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'formControlName / [formControl]',
					type: 'string | FormControl',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.FORM_CONTROL_NAME.DESCRIPTION'
				},
				{
					name: 'label',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.LABEL.DESCRIPTION'
				},
				{
					name: 'labelType (hub-input, hub-select, hub-datepicker)',
					type: "'stacked' | 'floating' | 'horizontal' | 'visually-hidden'",
					required: false,
					defaultValue: "'stacked'",
					description: 'DOCS.FORMS.API.INPUT.LABEL_TYPE.DESCRIPTION'
				},
				{
					name: 'labelType (hub-textarea, hub-otp-input, hub-slider, hub-segmented, hub-timepicker)',
					type: "'stacked' | 'horizontal' | 'visually-hidden'",
					required: false,
					defaultValue: "'stacked'",
					description: 'DOCS.FORMS.API.INPUT.LABEL_TYPE_STACKED_ONLY.DESCRIPTION'
				},
				{
					name: 'labelType (hub-file-input)',
					type: "'stacked' | 'visually-hidden'",
					required: false,
					defaultValue: "'stacked'",
					description: 'DOCS.FORMS.API.INPUT.LABEL_TYPE_STACKED_ONLY.DESCRIPTION'
				},
				{
					name: 'placeholder (hub-input, hub-select, hub-textarea, hub-datepicker)',
					type: 'string',
					required: false,
					defaultValue: "'' / NgSelectConfig.placeholder (hub-select)",
					description: 'DOCS.FORMS.API.INPUT.PLACEHOLDER.DESCRIPTION'
				},
				{
					name: 'formText',
					type: 'string',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.FORM_TEXT.DESCRIPTION'
				},
				{
					name: 'type (hub-input) — file is deprecated',
					type: "'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'color' | 'checkbox' | 'switch' | 'counter' | 'file'",
					required: false,
					defaultValue: "'text'",
					description: 'DOCS.FORMS.API.INPUT.TYPE.DESCRIPTION'
				},
				{
					name: 'passwordRevealed (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.PASSWORD_REVEALED.DESCRIPTION'
				},
				{
					name: 'passwordToggle (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.PASSWORD_TOGGLE.DESCRIPTION'
				},
				{
					name: 'hideOnBlur (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.HIDE_ON_BLUR.DESCRIPTION'
				},
				{
					name: 'capsLockWarning (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.CAPS_LOCK_WARNING.DESCRIPTION'
				},
				{
					name: 'passwordStrength (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.PASSWORD_STRENGTH.DESCRIPTION'
				},
				{
					name: 'autocomplete (hub-input)',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.AUTOCOMPLETE.DESCRIPTION'
				},
				{
					name: 'clearable (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.CLEARABLE.DESCRIPTION'
				},
				{
					name: 'indeterminate (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.INDETERMINATE.DESCRIPTION'
				},
				{
					name: 'debounceTime (hub-input)',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.FORMS.API.INPUT.DEBOUNCE_TIME.DESCRIPTION'
				},
				{
					name: 'mask (hub-input)',
					type: 'string',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.MASK.DESCRIPTION'
				},
				{
					name: 'unmaskValue (hub-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.UNMASK_VALUE.DESCRIPTION'
				},
				{
					name: 'swatches (hub-input type="color")',
					type: 'ReadonlyArray<string | HubColorSwatch> | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.COLOR_SWATCHES.DESCRIPTION'
				},
				{
					name: 'allowCustomColor (hub-input type="color")',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.COLOR_ALLOW_CUSTOM.DESCRIPTION'
				},
				{
					name: 'customColorLabel (hub-input type="color")',
					type: 'string',
					required: false,
					defaultValue: "'' / HubFormsConfig.color.customColorLabel",
					description: 'DOCS.FORMS.API.INPUT.COLOR_CUSTOM_LABEL.DESCRIPTION'
				},
				{
					name: 'range (hub-slider)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.RANGE.DESCRIPTION'
				},
				{
					name: 'options (hub-segmented)',
					type: 'HubSegmentedOption[]',
					required: false,
					defaultValue: '[]',
					description: 'DOCS.FORMS.API.INPUT.OPTIONS.DESCRIPTION'
				},
				{
					name: 'size (hub-segmented)',
					type: "'sm' | 'md' | 'lg'",
					required: false,
					defaultValue: "'md'",
					description: 'DOCS.FORMS.API.INPUT.SIZE.DESCRIPTION'
				},
				{
					name: 'disabled (all fields)',
					type: 'boolean (two-way, model)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.DISABLED.DESCRIPTION'
				},
				{
					name: 'multiple (hub-segmented)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.SEGMENTED_MULTIPLE.DESCRIPTION'
				},
				{
					name: 'vertical (hub-segmented)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.SEGMENTED_VERTICAL.DESCRIPTION'
				},
				{
					name: 'vertical (hub-select) — deprecated',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.SELECT_VERTICAL.DESCRIPTION'
				},
				{
					name: 'color (hub-segmented)',
					type: "'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral' | string",
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.SEGMENTED_COLOR.DESCRIPTION'
				},
				{
					name: 'value (hub-segmented)',
					type: 'unknown | unknown[]',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.SEGMENTED_VALUE.DESCRIPTION'
				},
				{
					name: 'format (hub-select) — deprecated for buttons/checkbox/radio',
					type: "'dropdown' | 'buttons' | 'checkbox' | 'radio'",
					required: false,
					defaultValue: "'dropdown'",
					description: 'DOCS.FORMS.API.INPUT.FORMAT.DESCRIPTION'
				},
				{
					name: 'prepend / append (hub-input, hub-select, hub-textarea, hub-datepicker, hub-timepicker)',
					type: 'string | string[]',
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.PREPEND_APPEND.DESCRIPTION'
				},
				{
					name: 'items / bindLabel / bindValue / multiple (hub-select)',
					type: 'any[] / string / string / boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.ITEMS.DESCRIPTION'
				},
				{
					name: 'groupBy (hub-select)',
					type: 'string | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.GROUP_BY.DESCRIPTION'
				},
				{
					name: 'searchable / clearable (hub-select)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.SEARCHABLE_CLEARABLE.DESCRIPTION'
				},
				{
					name: 'closeOnSelect (hub-select)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.CLOSE_ON_SELECT.DESCRIPTION'
				},
				{
					name: 'fixedPlaceholder (hub-select)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.FIXED_PLACEHOLDER.DESCRIPTION'
				},
				{
					name: 'loading / notFoundText (hub-select)',
					type: 'boolean / string',
					required: false,
					defaultValue: 'false / NgSelectConfig.notFoundText',
					description: 'DOCS.FORMS.API.INPUT.LOADING_NOT_FOUND.DESCRIPTION'
				},
				{
					name: 'readonly (hub-input, hub-select, hub-textarea, hub-datepicker, hub-otp-input, hub-timepicker)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.SELECT_READONLY.DESCRIPTION'
				},
				{
					name: 'plaintext (hub-input, hub-textarea)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.PLAINTEXT.DESCRIPTION'
				},
				{
					name: 'appendTo (hub-select)',
					type: 'string | undefined',
					required: false,
					defaultValue: "'body'",
					description: 'DOCS.FORMS.API.INPUT.APPEND_TO.DESCRIPTION'
				},
				{
					name: 'addTag (hub-select)',
					type: 'boolean | ((term: string) => any | Promise<any>)',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.ADD_TAG.DESCRIPTION'
				},
				{
					name: 'addTagText (hub-select)',
					type: 'string',
					required: false,
					defaultValue: 'NgSelectConfig.addTagText',
					description: 'DOCS.FORMS.API.INPUT.ADD_TAG_TEXT.DESCRIPTION'
				},
				{
					name: 'minTermLength (hub-select)',
					type: 'number',
					required: false,
					defaultValue: '0',
					description: 'DOCS.FORMS.API.INPUT.MIN_TERM_LENGTH.DESCRIPTION'
				},
				{
					name: 'typeahead (hub-select)',
					type: 'Subject<string> | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.TYPEAHEAD.DESCRIPTION'
				},
				{
					name: 'compareWith (hub-select)',
					type: '((a: any, b: any) => boolean) | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.COMPARE_WITH.DESCRIPTION'
				},
				{
					name: 'searchFn (hub-select)',
					type: '((term: string, item: any) => boolean) | undefined',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.SEARCH_FN.DESCRIPTION'
				},
				{
					name: 'mode (hub-datepicker)',
					type: "'single' | 'range' | 'day-time-range'",
					required: false,
					defaultValue: "'single'",
					description: 'DOCS.FORMS.API.INPUT.MODE.DESCRIPTION'
				},
				{
					name: 'granularity (hub-datepicker)',
					type: "'year' | 'month' | 'day' | 'hour' | 'minute' | 'second'",
					required: false,
					defaultValue: "'day'",
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_GRANULARITY.DESCRIPTION'
				},
				{
					name: 'valueFormat / parse (hub-datepicker)',
					type: "'iso' | 'date' | 'timestamp' | ((date) => unknown) / ((raw) => Date | null) | null",
					required: false,
					defaultValue: "'iso' / null",
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_VALUE_FORMAT.DESCRIPTION'
				},
				{
					name: 'minuteStep / secondStep / hourFormat (hub-datepicker)',
					type: "number / number / '12' | '24' | undefined",
					required: false,
					defaultValue: '5 / 1 / undefined',
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_TIME.DESCRIPTION'
				},
				{
					name: 'min / max / disabledDates (hub-datepicker)',
					type: 'string | Date | number | null / ((date: Date) => boolean) | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.MIN_MAX.DESCRIPTION'
				},
				{
					name: 'locale / firstDayOfWeek / weekdayFormat (hub-datepicker)',
					type: "string / number / 'short' | 'narrow' | 'long'",
					required: false,
					defaultValue: 'LOCALE_ID / undefined / undefined',
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_LOCALE.DESCRIPTION'
				},
				{
					name: 'monthFormat (hub-datepicker)',
					type: "'short' | 'long'",
					required: false,
					defaultValue: "'short'",
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_MONTH_FORMAT.DESCRIPTION'
				},
				{
					name: 'displayFormat / timeDisplayFormat / rangeSeparator / labels (hub-datepicker)',
					type: 'Intl.DateTimeFormatOptions | string | ((date) => string) / Intl.DateTimeFormatOptions / string / Partial<HubDatepickerLabels>',
					required: false,
					defaultValue: 'undefined / undefined / undefined / {}',
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_FORMAT.DESCRIPTION'
				},
				{
					name: 'clearable / showToday / closeOnSelect (hub-datepicker)',
					type: 'boolean',
					required: false,
					defaultValue: 'true / true / true',
					description: 'DOCS.FORMS.API.INPUT.DATEPICKER_BEHAVIOR.DESCRIPTION'
				},
				{
					name: 'multiple (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.FILE_MULTIPLE.DESCRIPTION'
				},
				{
					name: 'accept (hub-file-input)',
					type: 'string',
					required: false,
					defaultValue: "'*'",
					description: 'DOCS.FORMS.API.INPUT.FILE_ACCEPT.DESCRIPTION'
				},
				{
					name: 'maxSize / minSize / maxTotalSize (hub-file-input)',
					type: 'number | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_SIZES.DESCRIPTION'
				},
				{
					name: 'maxFiles (hub-file-input)',
					type: 'number | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_MAX_FILES.DESCRIPTION'
				},
				{
					name: 'dragDrop / paste (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.FILE_DRAG_DROP.DESCRIPTION'
				},
				{
					name: 'preview (hub-file-input)',
					type: "'none' | 'list' | 'grid' | 'inline'",
					required: false,
					defaultValue: "'list'",
					description: 'DOCS.FORMS.API.INPUT.FILE_PREVIEW.DESCRIPTION'
				},
				{
					name: 'currentFile (hub-file-input)',
					type: 'string | HubCurrentFile | readonly (string | HubCurrentFile)[] | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_CURRENT_FILE.DESCRIPTION'
				},
				{
					name: 'imagePreview (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.FILE_IMAGE_PREVIEW.DESCRIPTION'
				},
				{
					name: 'readonly (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.FILE_READONLY.DESCRIPTION'
				},
				{
					name: 'clearable (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.FILE_CLEARABLE.DESCRIPTION'
				},
				{
					name: 'allowDuplicates (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'false',
					description: 'DOCS.FORMS.API.INPUT.FILE_ALLOW_DUPLICATES.DESCRIPTION'
				},
				{
					name: 'capture (hub-file-input)',
					type: "'user' | 'environment' | null",
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_CAPTURE.DESCRIPTION'
				},
				{
					name: 'autoUpload (hub-file-input)',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.FILE_AUTO_UPLOAD.DESCRIPTION'
				},
				{
					name: 'buttonLabel / hint (hub-file-input)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_BUTTON_LABEL.DESCRIPTION'
				},
				{
					name: 'dropText / dropSubtext (hub-file-input)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.FILE_DROP_TEXT.DESCRIPTION'
				},
				{
					name: 'classlist (every field except hub-segmented and hub-legend)',
					type: 'string',
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.CLASSLIST.DESCRIPTION'
				},
				{
					name: 'showValid (all fields)',
					type: 'boolean',
					required: false,
					defaultValue: 'HubFormsConfig.showValid',
					description: 'DOCS.FORMS.API.INPUT.SHOW_VALID.DESCRIPTION'
				},
				{
					name: 'validFeedback (all fields)',
					type: 'string | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.VALID_FEEDBACK.DESCRIPTION'
				},
				{
					name: 'invalidFeedbackTemplateFn (all fields)',
					type: '((key: string, value: any) => string) | null',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.INVALID_FEEDBACK_TEMPLATE_FN.DESCRIPTION'
				},
				{
					name: 'min / max (hub-input)',
					type: 'number | undefined (two-way, model)',
					required: false,
					defaultValue: 'undefined',
					description: 'DOCS.FORMS.API.INPUT.INPUT_MIN_MAX.DESCRIPTION'
				},
				{
					name: 'accept / multiple / buttonLabel (hub-input) — deprecated',
					type: 'string / boolean / string',
					required: false,
					defaultValue: "'*' / false / 'Choose file'",
					description: 'DOCS.FORMS.API.INPUT.INPUT_FILE_DEPRECATED.DESCRIPTION'
				},
				{
					name: 'hubAutoresize (textarea[hubAutoresize])',
					type: 'boolean',
					required: false,
					defaultValue: 'true',
					description: 'DOCS.FORMS.API.INPUT.HUB_AUTORESIZE.DESCRIPTION'
				},
				{
					name: 'mode (hub-otp-input)',
					type: "'numeric' | 'alphanumeric' | 'alpha'",
					required: false,
					defaultValue: "'numeric'",
					description: 'DOCS.FORMS.API.INPUT.OTP_MODE.DESCRIPTION'
				},
				{
					name: 'min / max (hub-timepicker)',
					type: 'string (HH:MM)',
					required: false,
					defaultValue: "''",
					description: 'DOCS.FORMS.API.INPUT.TIMEPICKER_MIN_MAX.DESCRIPTION'
				},
				{
					name: 'step (hub-timepicker)',
					type: 'number (seconds)',
					required: false,
					defaultValue: '0',
					description: 'DOCS.FORMS.API.INPUT.TIMEPICKER_STEP.DESCRIPTION'
				},
				{
					name: 'group / groupName (form[hubForm], hub-fieldset, fieldset[hubFieldset])',
					type: 'AbstractControl | null / string | undefined',
					required: false,
					defaultValue: 'null / undefined',
					description: 'DOCS.FORMS.API.INPUT.GROUP.DESCRIPTION'
				},
				{
					name: 'errorTrigger (form[hubForm], hub-fieldset, fieldset[hubFieldset])',
					type: "'touched' | 'submit' | 'always'",
					required: false,
					defaultValue: "'touched'",
					description: 'DOCS.FORMS.API.INPUT.ERROR_TRIGGER.DESCRIPTION'
				},
				{
					name: 'formTextType (all fields)',
					type: "'bottom' | 'tooltip'",
					defaultValue: "'bottom'",
					required: false,
					description: 'DOCS.FORMS.API.INPUT.FORM_TEXT_TYPE.DESCRIPTION'
				},
				{
					name: 'rows (hub-textarea)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.ROWS.DESCRIPTION'
				},
				{
					name: 'cols (hub-textarea)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.COLS.DESCRIPTION'
				},
				{
					name: 'maxlength (hub-textarea)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.MAXLENGTH.DESCRIPTION'
				},
				{
					name: 'counter (hub-textarea)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.COUNTER.DESCRIPTION'
				},
				{
					name: 'autoresize (hub-textarea)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.AUTORESIZE.DESCRIPTION'
				},
				{
					name: 'length (hub-otp-input)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.LENGTH.DESCRIPTION'
				},
				{
					name: 'secret (hub-otp-input)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.SECRET.DESCRIPTION'
				},
				{
					name: 'separator (hub-otp-input)',
					type: 'string',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.SEPARATOR.DESCRIPTION'
				},
				{
					name: 'separatorEvery (hub-otp-input)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.SEPARATOR_EVERY.DESCRIPTION'
				},
				{
					name: 'showValue (hub-slider)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.SHOW_VALUE.DESCRIPTION'
				},
				{
					name: 'step (hub-input, hub-slider)',
					type: 'number',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.STEP.DESCRIPTION'
				},
				{
					name: 'min / max (hub-slider)',
					type: 'number',
					required: false,
					defaultValue: '0 / 100',
					description: 'DOCS.FORMS.API.INPUT.SLIDER_MIN_MAX.DESCRIPTION'
				},
				{
					name: 'legend (hub-fieldset, fieldset[hubFieldset])',
					type: 'string',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.LEGEND.DESCRIPTION'
				},
				{
					name: 'required (all fields)',
					type: 'boolean | null (two-way, model)',
					required: false,
					defaultValue: 'null',
					description: 'DOCS.FORMS.API.INPUT.REQUIRED_ALL.DESCRIPTION'
				},
				{
					name: 'required (hub-legend)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.REQUIRED_LEGEND.DESCRIPTION'
				},
				{
					name: 'invalid (hub-legend)',
					type: 'boolean',
					required: false,
					description: 'DOCS.FORMS.API.INPUT.INVALID_LEGEND.DESCRIPTION'
				}
			],
			outputs: [
				{
					name: 'valueChange (every field except hub-timepicker)',
					type: 'EventEmitter<value>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.VALUE_CHANGE.DESCRIPTION'
				},
				{
					name: 'search (hub-input)',
					type: 'EventEmitter<string>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.SEARCH.DESCRIPTION'
				},
				{
					name: 'rejected (hub-file-input)',
					type: 'EventEmitter<HubFileRejection[]>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.REJECTED.DESCRIPTION'
				},
				{
					name: 'fileRemoved (hub-file-input)',
					type: 'EventEmitter<File>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.FILE_REMOVED.DESCRIPTION'
				},
				{
					name: 'currentFileRemoved (hub-file-input)',
					type: 'EventEmitter<HubCurrentFile>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.CURRENT_FILE_REMOVED.DESCRIPTION'
				},
				{
					name: 'uploadStateChange (hub-file-input)',
					type: 'EventEmitter<readonly HubFileItem[]>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.UPLOAD_STATE_CHANGE.DESCRIPTION'
				},
				{
					name: 'submit (form[hubForm]) — the native event',
					type: 'SubmitEvent (native, not a custom output)',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.SUBMIT.DESCRIPTION'
				},
				{
					name: 'disabledChange / requiredChange (all fields) · labelTypeChange / placeholderChange / minChange / maxChange / passwordRevealedChange / indeterminateChange (hub-input) · valueChange (hub-segmented)',
					type: 'EventEmitter<T> (the paired half of each two-way model)',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.MODEL_CHANGE.DESCRIPTION'
				},
				{
					name: 'opened / closed / cleared / viewChange (hub-datepicker)',
					type: 'EventEmitter',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.OPENED.DESCRIPTION'
				},
				{
					name: 'onOpen / onClose / onClear / onSearch / onAdd / onRemove (hub-select)',
					type: 'EventEmitter',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.ON_OPEN.DESCRIPTION'
				},
				{
					name: 'onFocus / onBlur (hub-select)',
					type: 'EventEmitter<any>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.ON_FOCUS_BLUR.DESCRIPTION'
				},
				{
					name: 'scroll / scrollToEnd (hub-select)',
					type: 'EventEmitter<{ start: number; end: number }> / EventEmitter<any>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.SCROLL.DESCRIPTION'
				},
				{
					name: 'enter (hub-input)',
					type: 'EventEmitter<number | string | boolean | File | FileList | null>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.ENTER.DESCRIPTION'
				},
				{
					name: 'completed (hub-otp-input)',
					type: 'EventEmitter<string>',
					required: false,
					description: 'DOCS.FORMS.API.OUTPUT.COMPLETED.DESCRIPTION'
				}
			],
			templates: [
				{
					name: 'DOCS.FORMS.API.TEMPLATE.0.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.0.DESCRIPTION',
					example: '<ng-template hubFormText>…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.1.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.1.DESCRIPTION',
					example: '<ng-template hubValidationError key="min">…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.2.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.2.DESCRIPTION',
					example: '<hub-legend [required]="true">Shipping address</hub-legend>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.3.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.3.DESCRIPTION',
					example: '<ng-template hubSelectOption let-item="item">…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.4.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.4.DESCRIPTION',
					example: '<ng-template hubFileIcon let-item>…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.5.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.5.DESCRIPTION',
					example: '<ng-template hubFilePreview let-item let-remove="remove">…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.6.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.6.DESCRIPTION',
					example: '<p hubFileDropzoneNotice>2 documents still missing</p>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.7.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.7.DESCRIPTION',
					example:
						'<ng-template hubSegmentedOption let-option let-selected="selected" let-index="index">…</ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.8.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.8.DESCRIPTION',
					example: '<ng-template hubSelectSuffix><button …>…</button></ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.9.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.9.DESCRIPTION',
					example: '<ng-template hubAppend><button …><hub-icon … /></button></ng-template>'
				},
				{
					name: 'DOCS.FORMS.API.TEMPLATE.10.NAME',
					description: 'DOCS.FORMS.API.TEMPLATE.10.DESCRIPTION',
					example: '<hub-icon hubInputPrefix name="fa:solid:magnifying-glass" />'
				}
			],
			cssVariables: MD_CSS_VARIABLES['forms'] ?? []
		},
		styling: [],
		mixins: {
			...MD_MIXINS['forms'],
			demos: [
				{
					title: 'Theming with hub-segmented-theme',
					previewComponent: MixinFormsExampleComponent,
					code: `@use 'ng-hub-ui-forms/styles' as forms;

.forms-mixin-scope {
	@include forms.hub-forms-theme(
		$focus-ring-color: rgba(124, 58, 237, 0.35)
	);

	@include forms.hub-segmented-theme(
		$selected-bg: #7c3aed,
		$selected-color: #ffffff,
		$radius: 0.75rem,
		$padding-y: 0.375rem
	);
}`
				},
				{
					title: 'Theming with hub-file-input-theme',
					previewComponent: FormsFileInputDropzoneExampleComponent,
					code: `@use 'ng-hub-ui-forms/styles' as forms;

.attachments {
	@include forms.hub-file-input-theme(
		$border-style: solid,
		$border-radius: 0.75rem,
		$dragover-border-color: #7c3aed,
		$browse-color: #7c3aed,
		$progress-bar-bg: #7c3aed,
		// Every glyph is a swappable CSS mask, tinted by its colour token.
		$icon: url('/assets/upload.svg'),
		$icon-color: #7c3aed
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
	 * Registers every forms example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			{
				id: 'forms-input-basic',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_BASIC.TITLE',
				componentName: 'FormsInputBasicExampleComponent',
				files: ['input-basic-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-basic-example.component').then((m) => m.FormsInputBasicExampleComponent)
			},
			{
				id: 'forms-input-password',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_PASSWORD.TITLE',
				componentName: 'FormsInputPasswordExampleComponent',
				files: ['input-password-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-password-example.component').then(
						(m) => m.FormsInputPasswordExampleComponent
					)
			},
			{
				id: 'forms-input-formats',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_FORMATS.TITLE',
				componentName: 'FormsInputFormatsExampleComponent',
				files: ['input-formats-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-formats-example.component').then((m) => m.FormsInputFormatsExampleComponent)
			},
			{
				id: 'forms-input-color-swatches',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_COLOR_SWATCHES.TITLE',
				componentName: 'FormsInputColorSwatchesExampleComponent',
				files: ['input-color-swatches-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-color-swatches-example.component').then(
						(m) => m.FormsInputColorSwatchesExampleComponent
					)
			},
			{
				id: 'forms-input-groups',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_GROUPS.TITLE',
				componentName: 'FormsInputGroupsExampleComponent',
				files: ['input-groups-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-groups-example.component').then((m) => m.FormsInputGroupsExampleComponent)
			},
			{
				id: 'forms-input-mask',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_MASK.TITLE',
				componentName: 'FormsInputMaskExampleComponent',
				files: ['input-mask-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-mask-example.component').then((m) => m.FormsInputMaskExampleComponent)
			},
			{
				id: 'forms-input-otp',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_OTP.TITLE',
				componentName: 'FormsInputOtpExampleComponent',
				files: ['input-otp-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-otp-example.component').then((m) => m.FormsInputOtpExampleComponent)
			},
			{
				id: 'forms-input-search',
				title: 'DOCS.FORMS.EXAMPLE.INPUT_SEARCH.TITLE',
				componentName: 'FormsInputSearchTypeaheadExampleComponent',
				files: ['input-search-typeahead-example.component.ts'],
				loader: () =>
					import('../examples/forms/input-search-typeahead-example.component').then(
						(m) => m.FormsInputSearchTypeaheadExampleComponent
					)
			},
			{
				id: 'forms-textarea',
				title: 'DOCS.FORMS.EXAMPLE.TEXTAREA.TITLE',
				componentName: 'FormsTextareaExampleComponent',
				files: ['textarea-example.component.ts'],
				loader: () =>
					import('../examples/forms/textarea-example.component').then((m) => m.FormsTextareaExampleComponent)
			},
			{
				id: 'forms-form-text-tooltip',
				title: 'DOCS.FORMS.EXAMPLE.FORM_TEXT_TOOLTIP.TITLE',
				componentName: 'FormsFormTextTooltipExampleComponent',
				files: ['form-text-tooltip-example.component.ts'],
				loader: () =>
					import('../examples/forms/form-text-tooltip-example.component').then(
						(m) => m.FormsFormTextTooltipExampleComponent
					)
			},
			{
				id: 'forms-label-visually-hidden',
				title: 'DOCS.FORMS.EXAMPLE.LABEL_VISUALLY_HIDDEN.TITLE',
				componentName: 'FormsLabelVisuallyHiddenExampleComponent',
				files: ['label-visually-hidden-example.component.ts'],
				loader: () =>
					import('../examples/forms/label-visually-hidden-example.component').then(
						(m) => m.FormsLabelVisuallyHiddenExampleComponent
					)
			},
			{
				id: 'forms-plaintext',
				title: 'DOCS.FORMS.EXAMPLE.PLAINTEXT.TITLE',
				componentName: 'FormsPlaintextExampleComponent',
				files: ['plaintext-example.component.ts'],
				loader: () =>
					import('../examples/forms/plaintext-example.component').then((m) => m.FormsPlaintextExampleComponent)
			},
			{
				id: 'forms-slider',
				title: 'DOCS.FORMS.EXAMPLE.SLIDER.TITLE',
				componentName: 'FormsSliderExampleComponent',
				files: ['slider-example.component.ts'],
				loader: () => import('../examples/forms/slider-example.component').then((m) => m.FormsSliderExampleComponent)
			},
			{
				id: 'forms-slider-styling',
				title: 'DOCS.FORMS.EXAMPLE.SLIDER_STYLING.TITLE',
				componentName: 'FormsSliderStylingExampleComponent',
				files: ['slider-styling-example.component.ts'],
				loader: () =>
					import('../examples/forms/slider-styling-example.component').then(
						(m) => m.FormsSliderStylingExampleComponent
					)
			},
			{
				id: 'forms-segmented',
				title: 'DOCS.FORMS.EXAMPLE.SEGMENTED.TITLE',
				componentName: 'FormsSegmentedExampleComponent',
				files: ['segmented-example.component.ts'],
				loader: () =>
					import('../examples/forms/segmented-example.component').then((m) => m.FormsSegmentedExampleComponent)
			},
			{
				id: 'forms-segmented-template',
				title: 'DOCS.FORMS.EXAMPLE.SEGMENTED_TEMPLATE.TITLE',
				componentName: 'SegmentedTemplateFormsExampleComponent',
				files: ['segmented-template-forms-example.component.ts'],
				loader: () =>
					import('../examples/forms/segmented-template-forms-example.component').then(
						(m) => m.SegmentedTemplateFormsExampleComponent
					)
			},
			{
				id: 'forms-select',
				title: 'DOCS.FORMS.EXAMPLE.SELECT.TITLE',
				componentName: 'FormsSelectExampleComponent',
				files: ['select-example.component.ts'],
				loader: () => import('../examples/forms/select-example.component').then((m) => m.FormsSelectExampleComponent)
			},
			{
				id: 'forms-select-grouped',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_GROUPED.TITLE',
				componentName: 'FormsSelectGroupedExampleComponent',
				files: ['select-grouped-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-grouped-example.component').then(
						(m) => m.FormsSelectGroupedExampleComponent
					)
			},
			{
				id: 'forms-select-search',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_SEARCH.TITLE',
				componentName: 'FormsSelectSearchExampleComponent',
				files: ['select-search-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-search-example.component').then((m) => m.FormsSelectSearchExampleComponent)
			},
			{
				id: 'forms-select-typeahead',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_TYPEAHEAD.TITLE',
				componentName: 'SelectTypeaheadFormsExampleComponent',
				files: ['select-typeahead-forms-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-typeahead-forms-example.component').then(
						(m) => m.SelectTypeaheadFormsExampleComponent
					)
			},
			{
				id: 'forms-select-templates',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_TEMPLATES.TITLE',
				componentName: 'FormsSelectTemplatesExampleComponent',
				files: ['select-templates-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-templates-example.component').then(
						(m) => m.FormsSelectTemplatesExampleComponent
					)
			},
			{
				id: 'forms-select-formats',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_FORMATS.TITLE',
				componentName: 'FormsSelectFormatsExampleComponent',
				files: ['select-formats-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-formats-example.component').then(
						(m) => m.FormsSelectFormatsExampleComponent
					)
			},
			{
				id: 'forms-field-attached',
				title: 'DOCS.FORMS.EXAMPLE.FIELD_ATTACHED.TITLE',
				componentName: 'FormsFieldAttachedExampleComponent',
				files: ['field-attached-example.component.ts'],
				loader: () =>
					import('../examples/forms/field-attached-example.component').then(
						(m) => m.FormsFieldAttachedExampleComponent
					)
			},
			{
				id: 'forms-select-addons',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_ADDONS.TITLE',
				componentName: 'FormsSelectAddonsExampleComponent',
				files: ['select-addons-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-addons-example.component').then((m) => m.FormsSelectAddonsExampleComponent)
			},
			{
				id: 'forms-select-in-modal',
				title: 'DOCS.FORMS.EXAMPLE.SELECT_IN_MODAL.TITLE',
				componentName: 'FormsSelectInModalExampleComponent',
				files: ['select-in-modal-example.component.ts'],
				loader: () =>
					import('../examples/forms/select-in-modal-example.component').then(
						(m) => m.FormsSelectInModalExampleComponent
					)
			},
			{
				id: 'forms-rtl',
				title: 'DOCS.FORMS.EXAMPLE.RTL.TITLE',
				componentName: 'FormsRtlExampleComponent',
				files: ['rtl-forms-example.component.ts'],
				loader: () => import('../examples/forms/rtl-forms-example.component').then((m) => m.FormsRtlExampleComponent)
			},
			{
				id: 'forms-timepicker',
				title: 'DOCS.FORMS.EXAMPLE.TIMEPICKER.TITLE',
				componentName: 'FormsTimepickerExampleComponent',
				files: ['timepicker-example.component.ts'],
				loader: () =>
					import('../examples/forms/timepicker-example.component').then((m) => m.FormsTimepickerExampleComponent)
			},
			{
				id: 'forms-datepicker',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER.TITLE',
				componentName: 'FormsDatepickerExampleComponent',
				files: ['datepicker-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-example.component').then((m) => m.FormsDatepickerExampleComponent)
			},
			{
				id: 'forms-datepicker-time',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER_TIME.TITLE',
				componentName: 'FormsDatepickerTimeExampleComponent',
				files: ['datepicker-time-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-time-example.component').then(
						(m) => m.FormsDatepickerTimeExampleComponent
					)
			},
			{
				id: 'forms-datepicker-granularity',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER_GRANULARITY.TITLE',
				componentName: 'FormsDatepickerGranularityExampleComponent',
				files: ['datepicker-granularity-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-granularity-example.component').then(
						(m) => m.FormsDatepickerGranularityExampleComponent
					)
			},
			{
				id: 'forms-datepicker-formats',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER_FORMATS.TITLE',
				componentName: 'FormsDatepickerFormatsExampleComponent',
				files: ['datepicker-formats-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-formats-example.component').then(
						(m) => m.FormsDatepickerFormatsExampleComponent
					)
			},
			{
				id: 'forms-datepicker-in-modal',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER_IN_MODAL.TITLE',
				componentName: 'FormsDatepickerInModalExampleComponent',
				files: ['datepicker-in-modal-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-in-modal-example.component').then(
						(m) => m.FormsDatepickerInModalExampleComponent
					)
			},
			{
				id: 'forms-datepicker-day-time-range',
				title: 'DOCS.FORMS.EXAMPLE.DATEPICKER_DAY_TIME_RANGE.TITLE',
				componentName: 'FormsDatepickerDayTimeRangeExampleComponent',
				files: ['datepicker-day-time-range-example.component.ts'],
				loader: () =>
					import('../examples/forms/datepicker-day-time-range-example.component').then(
						(m) => m.FormsDatepickerDayTimeRangeExampleComponent
					)
			},
			{
				id: 'forms-file-input-basic',
				title: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_BASIC.TITLE',
				componentName: 'FormsFileInputBasicExampleComponent',
				files: ['file-input-basic-example.component.ts'],
				loader: () =>
					import('../examples/forms/file-input-basic-example.component').then(
						(m) => m.FormsFileInputBasicExampleComponent
					)
			},
			{
				id: 'forms-file-input-dropzone',
				title: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_DROPZONE.TITLE',
				componentName: 'FormsFileInputDropzoneExampleComponent',
				files: ['file-input-dropzone-example.component.ts'],
				loader: () =>
					import('../examples/forms/file-input-dropzone-example.component').then(
						(m) => m.FormsFileInputDropzoneExampleComponent
					)
			},
			{
				id: 'forms-file-input-upload',
				title: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_UPLOAD.TITLE',
				componentName: 'FormsFileInputUploadExampleComponent',
				files: ['file-input-upload-example.component.ts'],
				loader: () =>
					import('../examples/forms/file-input-upload-example.component').then(
						(m) => m.FormsFileInputUploadExampleComponent
					)
			},
			{
				id: 'forms-file-input-inline',
				title: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_INLINE.TITLE',
				componentName: 'FormsFileInputInlineExampleComponent',
				files: ['file-input-inline-example.component.ts'],
				loader: () =>
					import('../examples/forms/file-input-inline-example.component').then(
						(m) => m.FormsFileInputInlineExampleComponent
					)
			},
			{
				id: 'forms-containers',
				title: 'DOCS.FORMS.EXAMPLE.CONTAINERS.TITLE',
				componentName: 'FormsContainersExampleComponent',
				files: ['containers-example.component.ts'],
				loader: () =>
					import('../examples/forms/containers-example.component').then((m) => m.FormsContainersExampleComponent)
			}
		];

		examples.forEach((ex) => this._exampleRegistry.register({ ...ex, packagePath: 'forms' }));
	}

	/**
	 * Builds the grouped feature list from the static functionalities config,
	 * resolving each example through the registry and attaching its live preview
	 * component so the Overview "Feature guides" section renders interactively.
	 */
	private populateFunctionalitiesFromRegistry(): void {
		this.formsLibrary.functionalities = FORMS_FUNCTIONALITIES.map((group) => ({
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
						previewComponent: FORMS_PREVIEW_COMPONENTS[id]
					} as unknown as FeatureExample;
				})
				.filter((ex): ex is FeatureExample => ex !== null)
		}));
	}
}
