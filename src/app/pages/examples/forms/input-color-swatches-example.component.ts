import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HUB_COLOR_PALETTES, HubColorSwatchInput, HubInputComponent } from 'ng-hub-ui-forms';

/**
 * The `color` format with and without a palette.
 *
 * Without `swatches` it is a text field for the hex code, with the colour in a square at its start
 * that opens the browser's picker. Given a list, it becomes a
 * grid of swatches: a library palette or a few colours stretch into one row of wide cells, the height
 * of the text field beside them; many colours in a narrow column grow downwards and drop the box.
 */
@Component({
	selector: 'app-forms-input-color-swatches-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubInputComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 2rem;">
			<hub-input formControlName="favorite" type="color" label="Favourite colour (hex field)" />

			<div
				style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); align-items: start;"
			>
				<hub-input formControlName="project" label="Project" placeholder="Website redesign" />
				<hub-input
					formControlName="status"
					type="color"
					label="Status colour (library palette)"
					[swatches]="palettes.status"
				/>
			</div>

			<hub-input
				formControlName="tag"
				type="color"
				label="Tag colour (a closed list)"
				[swatches]="tagColors"
				[allowCustomColor]="false"
			/>

			<div style="max-width: 16rem;">
				<hub-input formControlName="accent" type="color" label="Accent (many)" [swatches]="accentColors" />
			</div>
		</form>

		<p class="mt-3 mb-0 small text-muted">
			<code>favorite</code>: {{ form.controls.favorite.value }} · <code>status</code>: {{ form.controls.status.value }} ·
			<code>tag</code>: {{ form.controls.tag.value }} · <code>accent</code>: {{ form.controls.accent.value }}
		</p>
	`
})
export class FormsInputColorSwatchesExampleComponent {
	readonly form = new FormGroup({
		favorite: new FormControl('#3b82f6'),
		project: new FormControl('Website redesign'),
		status: new FormControl('#16a34a'),
		tag: new FormControl('#7c3aed'),
		accent: new FormControl('rgb(37 99 235)')
	});

	/** The palettes the library ships: `tailwind`, `material`, `pastel`, `neutral` and `status`. */
	readonly palettes = HUB_COLOR_PALETTES;

	/** A few named colours and nothing else: without the custom cell, only these are valid. */
	readonly tagColors: HubColorSwatchInput[] = [
		{ value: '#7c3aed', label: 'Feature' },
		{ value: '#dc2626', label: 'Bug' },
		{ value: '#0d9488', label: 'Docs' }
	];

	/** Many colours, in any CSS notation: the grid opens as many rows as it needs. */
	readonly accentColors: HubColorSwatchInput[] = [
		'#ef4444',
		'#f97316',
		'#f59e0b',
		'#eab308',
		'#84cc16',
		'#22c55e',
		'#10b981',
		'#14b8a6',
		'#06b6d4',
		'#0ea5e9',
		'#3b82f6',
		'rgb(37 99 235)',
		'#6366f1',
		'#8b5cf6',
		'#a855f7',
		'#d946ef',
		'#ec4899',
		'#f43f5e',
		'hsl(215 16% 47%)',
		'oklch(0.3 0.03 260)'
	];

	static readonly templateCode = `<!-- No swatches: type the hex, or click the square for the browser's picker -->
<hub-input formControlName="favorite" type="color" label="Favourite colour" />

<!-- A palette the library ships: one row of wide cells, the height of any input -->
<hub-input formControlName="status" type="color" label="Status colour" [swatches]="palettes.status" />

<!-- A closed list: no custom cell, so only these colours are valid -->
<hub-input
  formControlName="tag"
  type="color"
  label="Tag colour"
  [swatches]="tagColors"
  [allowCustomColor]="false"
/>

<!-- Many colours in a narrow column: more rows, and the field box goes -->
<div style="max-width: 16rem;">
  <hub-input formControlName="accent" type="color" label="Accent" [swatches]="accentColors" />
</div>`;

	static readonly componentCode = `import { HUB_COLOR_PALETTES, HubColorSwatchInput } from 'ng-hub-ui-forms';

readonly form = new FormGroup({
  favorite: new FormControl('#3b82f6'),
  status: new FormControl('#16a34a'),
  tag: new FormControl('#7c3aed'),
  accent: new FormControl('rgb(37 99 235)')
});

// tailwind, material, pastel, neutral and status, frozen and named for screen readers.
readonly palettes = HUB_COLOR_PALETTES;

// { value, label } gives a colour a name a screen reader can say.
readonly tagColors: HubColorSwatchInput[] = [
  { value: '#7c3aed', label: 'Feature' },
  { value: '#dc2626', label: 'Bug' },
  { value: '#0d9488', label: 'Docs' }
];

// Any CSS colour: the control receives the string exactly as written here.
readonly accentColors: HubColorSwatchInput[] = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', 'rgb(37 99 235)', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e', 'hsl(215 16% 47%)', 'oklch(0.3 0.03 260)'
];

// A palette for every colour field without swatches of its own, in app.config.ts.
// A field with [swatches]="[]" keeps the hex field even then.
// pickerLabel names the square for screen readers: translate it here.
// provideHubForms({ color: { swatches: HUB_COLOR_PALETTES.tailwind, pickerLabel: 'Choose color' } })`;

	static readonly cssCode = `/* The hex field: the square is as wide as the field is tall, unless told otherwise */
hub-input {
  --hub-input-color-size: 4rem;                                  /* a wider colour strip */
}

/* Every piece of the swatch grid is a token */
hub-input {
  --hub-input-swatch-min-width: 2.5rem;                         /* wider cells, fewer per row */
  --hub-input-swatch-radius: 50rem;                             /* pill-shaped cells */
  --hub-input-swatch-wrapped-border-color: var(--hub-input-border-color); /* keep the box when it wraps */
  --hub-input-swatch-mark-color: #fff;                          /* one mark colour instead of the automatic ink */
}`;
}
