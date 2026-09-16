import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';
import { parseColor, toHex } from 'ng-hub-ui-utils';
import { PlaygroundConfig, PlaygroundControl, PlaygroundCssVariable } from './playground.interface';

/** Shallow value-equality used to decide whether an input still equals its default. */
function valuesEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length && a.every((item, i) => item === b[i]);
	}
	return false;
}

/**
 * Generic, config-driven component playground.
 *
 * Renders a live preview of any standalone component alongside a panel of editors
 * (one per configured `@Input`) and a code snippet that updates as inputs change.
 * Drive it with one {@link PlaygroundConfig} per component; pass several to get a
 * component switcher. Designed to be reused across every ng-hub-ui library.
 */
@Component({
	selector: 'hub-playground',
	standalone: true,
	imports: [NgComponentOutlet, HighlightModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		@let cfg = activeConfig();
		@if (cfg) {
			<div class="hub-playground">
				@if (configs().length > 1) {
					<div class="hub-playground__switcher" role="tablist">
						@for (item of configs(); track item.id) {
							<button
								type="button"
								role="tab"
								class="hub-playground__tab"
								[class.hub-playground__tab--active]="item.id === cfg.id"
								[attr.aria-selected]="item.id === cfg.id"
								(click)="selectConfig(item.id)"
							>
								{{ item.title }}
							</button>
						}
					</div>
				}

				<div class="hub-playground__body">
					<!-- Live preview -->
					<section class="hub-playground__preview" aria-label="Live preview">
						@if (cfg.description) {
							<p class="hub-playground__preview-desc">{{ cfg.description }}</p>
						}
						<div class="hub-playground__stage" #stage>
							<ng-container *ngComponentOutlet="cfg.component; inputs: previewInputs()" />
						</div>
					</section>

					<!-- Controls -->
					<aside class="hub-playground__controls" aria-label="Configuration">
						<div class="hub-playground__controls-head">
							@if (hasCssVariables()) {
								<div class="hub-playground__segmented" role="tablist">
									<button
										type="button"
										role="tab"
										class="hub-playground__segment"
										[class.hub-playground__segment--active]="panelMode() === 'props'"
										[attr.aria-selected]="panelMode() === 'props'"
										(click)="panelMode.set('props')"
									>
										Properties
									</button>
									<button
										type="button"
										role="tab"
										class="hub-playground__segment"
										[class.hub-playground__segment--active]="panelMode() === 'styles'"
										[attr.aria-selected]="panelMode() === 'styles'"
										(click)="panelMode.set('styles')"
									>
										CSS Variables
									</button>
								</div>
							} @else {
								<span class="hub-playground__controls-title">Properties</span>
							}
							<button type="button" class="hub-playground__reset" (click)="reset()">Reset</button>
						</div>

						@if (panelMode() === 'props' || !hasCssVariables()) {
							@for (control of cfg.controls; track control.name) {
								<div class="hub-playground__field">
									<label class="hub-playground__label" [attr.for]="cfg.id + '-' + control.name">
										<code>{{ control.name }}</code>
										<span class="hub-playground__label-text">{{ control.label }}</span>
									</label>

									@switch (control.type) {
										@case ('boolean') {
											<label class="hub-playground__switch">
												<input
													type="checkbox"
													[id]="cfg.id + '-' + control.name"
													[checked]="$any(value(control))"
													(change)="set(control, $any($event.target).checked)"
												/>
												<span>{{ value(control) ? 'true' : 'false' }}</span>
											</label>
										}
										@case ('select') {
											<select
												class="hub-playground__select"
												[id]="cfg.id + '-' + control.name"
												(change)="onSelect(control, $any($event.target).selectedIndex)"
											>
												@for (opt of control.options; track $index) {
													<option [selected]="opt.value === value(control)">{{ opt.label }}</option>
												}
											</select>
										}
										@case ('number') {
											<input
												type="number"
												class="hub-playground__input"
												[id]="cfg.id + '-' + control.name"
												[min]="$any(control.min)"
												[max]="$any(control.max)"
												[step]="$any(control.step ?? 1)"
												[value]="$any(value(control))"
												(input)="set(control, toNumber($any($event.target).value))"
											/>
										}
										@case ('range') {
											<div class="hub-playground__range">
												<input
													type="range"
													[id]="cfg.id + '-' + control.name"
													[min]="$any(control.min ?? 0)"
													[max]="$any(control.max ?? 100)"
													[step]="$any(control.step ?? 1)"
													[value]="$any(value(control))"
													(input)="set(control, toNumber($any($event.target).value))"
												/>
												<span class="hub-playground__range-value">{{ value(control) }}</span>
											</div>
										}
										@case ('color') {
											<input
												type="color"
												class="hub-playground__color"
												[id]="cfg.id + '-' + control.name"
												[value]="$any(value(control))"
												(input)="set(control, $any($event.target).value)"
											/>
										}
										@default {
											<input
												type="text"
												class="hub-playground__input"
												[id]="cfg.id + '-' + control.name"
												[value]="$any(value(control))"
												(input)="set(control, $any($event.target).value)"
											/>
										}
									}

									@if (control.description) {
										<small class="hub-playground__hint">{{ control.description }}</small>
									}
								</div>
							}
						}

						@if (panelMode() === 'styles' && hasCssVariables()) {
							@for (variable of activeCssVariables(); track variable.name) {
								<div class="hub-playground__field">
									<label class="hub-playground__label" [attr.for]="cfg.id + '-var-' + variable.name">
										<code>{{ variable.name }}</code>
										<span class="hub-playground__label-text">{{ variable.label }}</span>
									</label>

									@if (variable.type === 'color') {
										<div class="hub-playground__var-row">
											<input
												type="color"
												class="hub-playground__color"
												[id]="cfg.id + '-var-' + variable.name"
												[value]="colorSwatchHex(varValue(variable))"
												(input)="setVar(variable, $any($event.target).value)"
											/>
											<input
												type="text"
												class="hub-playground__input"
												[class.hub-playground__input--invalid]="!isValidColor(varValue(variable))"
												[value]="varValue(variable)"
												(input)="setVar(variable, $any($event.target).value)"
											/>
										</div>
										@if (!isValidColor(varValue(variable))) {
											<small class="hub-playground__hint hub-playground__hint--error"
												>Not a valid CSS color — try a name (gold), hex (#ffd700) or rgb().</small
											>
										}
									} @else {
										<input
											type="text"
											class="hub-playground__input"
											[id]="cfg.id + '-var-' + variable.name"
											[value]="varValue(variable)"
											(input)="setVar(variable, $any($event.target).value)"
										/>
									}

									@if (variable.description) {
										<small class="hub-playground__hint">{{ variable.description }}</small>
									}
								</div>
							}
						}
					</aside>
				</div>

				<!-- Generated code -->
				<div class="hub-playground__code">
					<span class="hub-playground__code-label">Generated template</span>
					<pre><code [highlight]="code()" language="xml"></code></pre>
					@if (styleCode()) {
						<span class="hub-playground__code-label">Styling</span>
						<pre><code [highlight]="styleCode()" language="css"></code></pre>
					}
				</div>
			</div>
		}
	`,
	styles: [
		`
			.hub-playground {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--hub-ref-radius-lg, 0.75rem);
				background: var(--hub-sys-surface-elevated, #fff);
				padding: 1rem;
			}
			.hub-playground__switcher {
				display: flex;
				flex-wrap: wrap;
				gap: 0.25rem;
				border-bottom: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				padding-bottom: 0.75rem;
			}
			.hub-playground__tab {
				border: 0;
				background: transparent;
				padding: 0.375rem 0.75rem;
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				font-weight: 500;
				color: var(--hub-sys-text-muted, #6c757d);
				cursor: pointer;
			}
			.hub-playground__tab:hover {
				background: color-mix(in srgb, var(--hub-sys-color-primary, #0d6efd) 8%, transparent);
			}
			.hub-playground__tab--active {
				background: var(--hub-sys-color-primary, #0d6efd);
				color: #fff;
			}
			.hub-playground__body {
				display: grid;
				grid-template-columns: minmax(0, 1fr) minmax(0, 22rem);
				gap: 1.25rem;
				align-items: start;
			}
			.hub-playground__preview {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				min-width: 0;
			}
			.hub-playground__preview-desc {
				margin: 0;
				color: var(--hub-sys-text-muted, #6c757d);
				font-size: 0.9rem;
			}
			.hub-playground__stage {
				display: flex;
				flex-direction: column;
				justify-content: center;
				gap: 1rem;
				min-height: 8rem;
				padding: 1.5rem;
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				background: var(--hub-sys-surface-page, #f8f9fa);
				border: 1px dashed var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
			}
			.hub-playground__controls {
				display: flex;
				flex-direction: column;
				gap: 0.875rem;
			}
			.hub-playground__controls-head {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				justify-content: space-between;
			}
			.hub-playground__controls-title {
				font-weight: 600;
				font-size: 0.95rem;
			}
			.hub-playground__reset {
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				background: transparent;
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				padding: 0.2rem 0.6rem;
				font-size: 0.8rem;
				cursor: pointer;
				color: var(--hub-sys-text-muted, #6c757d);
			}
			.hub-playground__reset:hover {
				color: var(--hub-sys-color-primary, #0d6efd);
				border-color: var(--hub-sys-color-primary, #0d6efd);
			}
			.hub-playground__segmented {
				display: flex;
				flex: 1;
				gap: 0.15rem;
				padding: 0.2rem;
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				background: var(--hub-sys-surface-page, #f1f3f5);
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
			}
			.hub-playground__segment {
				flex: 1;
				border: 0;
				background: transparent;
				padding: 0.4rem 0.7rem;
				border-radius: calc(var(--hub-ref-radius-md, 0.5rem) - 0.15rem);
				font-size: 0.85rem;
				font-weight: 600;
				color: var(--hub-sys-text-muted, #6c757d);
				cursor: pointer;
			}
			.hub-playground__segment--active {
				background: var(--hub-sys-surface-elevated, #fff);
				color: var(--hub-sys-color-primary, #0d6efd);
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
			}
			.hub-playground__input--invalid {
				border-color: var(--hub-sys-color-danger, #dc3545);
			}
			.hub-playground__hint--error {
				color: var(--hub-sys-color-danger, #dc3545);
			}
			.hub-playground__var-row {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}
			.hub-playground__var-row .hub-playground__input {
				flex: 1;
				font-family: var(--hub-ref-font-family-mono, monospace);
				font-size: 0.8rem;
			}
			.hub-playground__field {
				display: flex;
				flex-direction: column;
				gap: 0.3rem;
			}
			.hub-playground__label {
				display: flex;
				align-items: baseline;
				gap: 0.5rem;
				font-size: 0.85rem;
			}
			.hub-playground__label code {
				font-size: 0.78rem;
				color: var(--hub-sys-color-primary, #0d6efd);
				background: color-mix(in srgb, var(--hub-sys-color-primary, #0d6efd) 10%, transparent);
				padding: 0.05rem 0.35rem;
				border-radius: 0.3rem;
			}
			.hub-playground__label-text {
				color: var(--hub-sys-text-muted, #6c757d);
			}
			.hub-playground__input,
			.hub-playground__select {
				width: 100%;
				padding: 0.35rem 0.55rem;
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				background: var(--hub-sys-surface-page, #fff);
				color: inherit;
				font: inherit;
				font-size: 0.85rem;
			}
			.hub-playground__input:focus,
			.hub-playground__select:focus {
				outline: none;
				border-color: var(--hub-sys-color-primary, #0d6efd);
			}
			.hub-playground__switch {
				display: inline-flex;
				align-items: center;
				gap: 0.5rem;
				font-size: 0.85rem;
				cursor: pointer;
			}
			.hub-playground__range {
				display: flex;
				align-items: center;
				gap: 0.75rem;
			}
			.hub-playground__range input {
				flex: 1;
			}
			.hub-playground__range-value {
				min-width: 2.5rem;
				text-align: right;
				font-variant-numeric: tabular-nums;
				font-size: 0.85rem;
			}
			.hub-playground__color {
				width: 3rem;
				height: 2rem;
				padding: 0;
				border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				background: transparent;
				cursor: pointer;
			}
			.hub-playground__hint {
				color: var(--hub-sys-text-muted, #6c757d);
				font-size: 0.75rem;
			}
			.hub-playground__code {
				display: flex;
				flex-direction: column;
				gap: 0.35rem;
			}
			.hub-playground__code-label {
				font-size: 0.8rem;
				font-weight: 600;
				color: var(--hub-sys-text-muted, #6c757d);
			}
			.hub-playground__code pre {
				margin: 0;
				border-radius: var(--hub-ref-radius-md, 0.5rem);
				overflow: auto;
			}
			@media (max-width: 768px) {
				.hub-playground__body {
					grid-template-columns: minmax(0, 1fr);
				}
			}
		`
	]
})
export class PlaygroundComponent {
	/** One config per configurable component. The first is selected by default. */
	readonly configs = input.required<PlaygroundConfig[]>();

	/** Reference to the preview stage, where CSS variable overrides are applied inline. */
	private readonly _stage = viewChild<ElementRef<HTMLElement>>('stage');

	/** Currently selected config id (null → first config). */
	private readonly _activeId = signal<string | null>(null);

	/** Which controls panel is visible: component inputs or CSS-variable theming. */
	readonly panelMode = signal<'props' | 'styles'>('props');

	/** Per-config map of live input values, lazily seeded from control defaults. */
	private readonly _values = signal<Record<string, Record<string, unknown>>>({});

	/** Per-config map of user-overridden CSS variables (name → value). Overrides only. */
	private readonly _styleVars = signal<Record<string, Record<string, string>>>({});

	/** CSS-variable custom-property names currently applied to the stage element. */
	private readonly _appliedVarNames = new Set<string>();

	constructor() {
		// Apply the active config's CSS-variable overrides to the correct target element.
		// By default the stage div is used (values cascade to the component). When the
		// config provides `cssVarTargetSelector`, the first matching descendant of the
		// stage is used instead — necessary for library components that re-declare the
		// same custom properties in their `:host {}` rule, which would otherwise override
		// any inherited value from the stage.
		effect(() => {
			const stage = this._stage()?.nativeElement;
			if (!stage) return;
			const cfg = this.activeConfig();
			const overrides = this._activeStyleVars();
			const types = new Map((cfg?.cssVariables ?? []).map((v) => [v.name, v.type]));

			const targetEl: HTMLElement =
				(cfg?.cssVarTargetSelector ? stage.querySelector<HTMLElement>(cfg.cssVarTargetSelector) : null) ?? stage;

			this._appliedVarNames.forEach((name) => targetEl.style.removeProperty(name));
			this._appliedVarNames.clear();

			for (const [name, value] of Object.entries(overrides)) {
				if (value == null || value === '') continue;
				if (types.get(name) === 'color' && !this.isValidColor(value)) continue;
				targetEl.style.setProperty(name, value);
				this._appliedVarNames.add(name);
			}
		});
	}

	/** The config currently being previewed. */
	readonly activeConfig = computed<PlaygroundConfig | undefined>(() => {
		const list = this.configs();
		const id = this._activeId();
		return list.find((c) => c.id === id) ?? list[0];
	});

	/** Live values for the active config (stored overrides or seeded defaults). */
	private readonly _activeValues = computed<Record<string, unknown>>(() => {
		const cfg = this.activeConfig();
		if (!cfg) return {};
		const stored = this._values()[cfg.id];
		if (stored) return stored;
		return Object.fromEntries(cfg.controls.map((c) => [c.name, c.default]));
	});

	/**
	 * Inputs handed to the previewed component: static inputs plus the active config's
	 * declared editable values. Only names declared in `controls`/`staticInputs` are
	 * ever passed, so a value can never leak onto a component that lacks that input.
	 */
	readonly previewInputs = computed<Record<string, unknown>>(() => {
		const cfg = this.activeConfig();
		if (!cfg) return {};
		const values = this._activeValues();
		const editable = Object.fromEntries(cfg.controls.map((c) => [c.name, c.name in values ? values[c.name] : c.default]));
		return { ...(cfg.staticInputs ?? {}), ...editable };
	});

	/** CSS variables exposed for theming by the active config. */
	readonly activeCssVariables = computed<ReadonlyArray<PlaygroundCssVariable>>(() => this.activeConfig()?.cssVariables ?? []);

	/** Whether the active config exposes any themable CSS variables. */
	readonly hasCssVariables = computed<boolean>(() => this.activeCssVariables().length > 0);

	/** User-overridden CSS variables for the active config (name → value). */
	private readonly _activeStyleVars = computed<Record<string, string>>(() => {
		const cfg = this.activeConfig();
		if (!cfg) return {};
		return this._styleVars()[cfg.id] ?? {};
	});

	/** Generated CSS snippet reflecting the overridden variables (empty when none). */
	readonly styleCode = computed<string>(() => {
		const cfg = this.activeConfig();
		if (!cfg) return '';
		const overrides = this._activeStyleVars();
		const lines = (cfg.cssVariables ?? [])
			.filter((v) => v.name in overrides && overrides[v.name] !== v.default)
			.map((v) => `\t${v.name}: ${overrides[v.name]};`);
		return lines.length ? `${cfg.tag} {\n${lines.join('\n')}\n}` : '';
	});

	/** Generated template snippet reflecting the current configuration. */
	readonly code = computed<string>(() => {
		const cfg = this.activeConfig();
		if (!cfg) return '';
		const values = this._activeValues();
		if (cfg.codeTemplate) return cfg.codeTemplate(values);
		return this._generateCode(cfg, values);
	});

	/** Switches the active config in the component switcher. */
	selectConfig(id: string): void {
		this._activeId.set(id);
	}

	/** Reads the live value of a control for the active config. */
	value(control: PlaygroundControl): unknown {
		return this._activeValues()[control.name];
	}

	/** Updates a single input value for the active config (immutable). */
	set(control: PlaygroundControl, value: unknown): void {
		const cfg = this.activeConfig();
		if (!cfg) return;
		const next = { ...this._activeValues(), [control.name]: value };
		this._values.update((state) => ({ ...state, [cfg.id]: next }));
	}

	/** Resolves a `select` change by index back to the option value (preserves type). */
	onSelect(control: PlaygroundControl, index: number): void {
		const option = control.options?.[index];
		if (option) this.set(control, option.value);
	}

	/** Reads the live value of a CSS variable (override or its declared default). */
	varValue(variable: PlaygroundCssVariable): string {
		const cfg = this.activeConfig();
		const stored = cfg ? this._styleVars()[cfg.id]?.[variable.name] : undefined;
		return stored ?? variable.default;
	}

	/** Overrides a single CSS variable for the active config (immutable, live). */
	setVar(variable: PlaygroundCssVariable, value: string): void {
		const cfg = this.activeConfig();
		if (!cfg) return;
		const next = { ...(this._styleVars()[cfg.id] ?? {}), [variable.name]: value };
		this._styleVars.update((state) => ({ ...state, [cfg.id]: next }));
	}

	/**
	 * Whether a string is a colour that can be applied to the preview.
	 *
	 * Parsed rather than probed through a detached DOM element, so the check also runs on the
	 * server. A `var()` reference passes: it is a legitimate value for a CSS variable even
	 * though it has no colour of its own until the cascade resolves it.
	 */
	isValidColor(value: string): boolean {
		const raw = value?.trim();
		if (!raw) return false;
		return raw.startsWith('var(') || parseColor(raw) !== null;
	}

	/**
	 * Resolves any parseable CSS colour to a `#rrggbb` hex for the native colour picker, so
	 * the swatch mirrors named, `rgb()` and `oklch()` values. Anything unresolvable — a
	 * `var()` reference included — falls back to black.
	 */
	colorSwatchHex(value: string): string {
		// The native picker accepts six digits only, so any alpha pair is dropped.
		return toHex(value?.trim() ?? '')?.slice(0, 7) ?? '#000000';
	}

	/** Restores every input and CSS variable of the active config to its default. */
	reset(): void {
		const cfg = this.activeConfig();
		if (!cfg) return;
		this._values.update((state) => {
			const next = { ...state };
			delete next[cfg.id];
			return next;
		});
		this._styleVars.update((state) => {
			const next = { ...state };
			delete next[cfg.id];
			return next;
		});
	}

	/** Parses an editor string into a number, falling back to 0 on NaN. */
	toNumber(raw: string): number {
		const n = Number(raw);
		return Number.isNaN(n) ? 0 : n;
	}

	/** Builds a readable template snippet from non-default input values. */
	private _generateCode(cfg: PlaygroundConfig, values: Record<string, unknown>): string {
		const attrs = cfg.controls
			.filter((c) => !valuesEqual(values[c.name], c.default))
			.map((c) => this._formatAttr(c, values[c.name]));

		if (attrs.length === 0) {
			return `<${cfg.tag}></${cfg.tag}>`;
		}
		return `<${cfg.tag}\n\t${attrs.join('\n\t')}\n></${cfg.tag}>`;
	}

	/** Formats a single attribute, choosing attribute vs property binding syntax. */
	private _formatAttr(control: PlaygroundControl, value: unknown): string {
		const useProperty =
			control.propertyBinding ??
			(control.type === 'boolean' || control.type === 'number' || control.type === 'range' || typeof value !== 'string');

		if (useProperty) {
			const literal = typeof value === 'string' ? `'${value}'` : value;
			return `[${control.name}]="${literal}"`;
		}
		return `${control.name}="${value}"`;
	}
}
