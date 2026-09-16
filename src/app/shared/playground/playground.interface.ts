import { Type } from '@angular/core';

/**
 * Supported editor kinds for a single configurable input in the playground.
 *
 * - `text`    → free-text `<input type="text">`
 * - `number`  → numeric `<input type="number">`
 * - `boolean` → `<input type="checkbox">`
 * - `select`  → `<select>` constrained to {@link PlaygroundControl.options}
 * - `color`   → native colour picker
 * - `range`   → `<input type="range">` slider with a live value badge
 */
export type PlaygroundControlType = 'text' | 'number' | 'boolean' | 'select' | 'color' | 'range';

/**
 * Describes one editable input (`@Input`) of the previewed component, and how the
 * playground should render an editor for it.
 */
export interface PlaygroundControl {
	/** Name of the component `@Input` this control drives (used as the bound key). */
	readonly name: string;
	/** Human-readable label shown next to the editor. */
	readonly label: string;
	/** Which editor widget to render. */
	readonly type: PlaygroundControlType;
	/** Initial value. Also used to omit unchanged inputs from the generated code. */
	readonly default: unknown;
	/** Options for `select` controls. `value` is the value bound to the input. */
	readonly options?: ReadonlyArray<{ label: string; value: unknown }>;
	/** Lower bound for `number` / `range` editors. */
	readonly min?: number;
	/** Upper bound for `number` / `range` editors. */
	readonly max?: number;
	/** Step increment for `number` / `range` editors. */
	readonly step?: number;
	/** Optional helper text shown under the editor. */
	readonly description?: string;
	/**
	 * When `true`, the input is bound with property syntax (`[name]="value"`) in the
	 * generated code instead of attribute syntax (`name="value"`). Inferred from the
	 * value type when omitted (booleans/numbers/objects → property binding).
	 */
	readonly propertyBinding?: boolean;
}

/**
 * Describes one CSS custom property (`--hub-*` token) the playground lets users
 * theme live. The value is applied inline to the preview stage so it cascades to
 * the previewed component without touching global styles.
 */
export interface PlaygroundCssVariable {
	/** Canonical token name, e.g. `--hub-input-bg`. */
	readonly name: string;
	/** Human-readable label. */
	readonly label: string;
	/** `color` renders a colour picker; `text` accepts any CSS value (lengths, etc.). */
	readonly type: 'color' | 'text';
	/** Concrete starting value shown in the editor (e.g. `#ffffff`, `0.5rem`). */
	readonly default: string;
	/** Optional helper text shown under the editor. */
	readonly description?: string;
}

/**
 * A single previewable component plus the set of inputs the playground exposes.
 * Libraries provide one config per component they want users to configure live.
 */
export interface PlaygroundConfig {
	/** Stable identifier (used for routing fragments and internal state keys). */
	readonly id: string;
	/** Tab label shown in the component switcher. */
	readonly title: string;
	/** Optional short description shown above the preview. */
	readonly description?: string;
	/** Element selector emitted in the generated code, e.g. `hub-input`. */
	readonly tag: string;
	/** The standalone component rendered in the live preview. */
	readonly component: Type<unknown>;
	/** Editable inputs, rendered top-to-bottom in the controls panel. */
	readonly controls: ReadonlyArray<PlaygroundControl>;
	/**
	 * CSS custom properties (`--hub-*` tokens) the user can theme live. Rendered under
	 * a "Styling" tab in the controls panel and applied inline to the preview stage.
	 */
	readonly cssVariables?: ReadonlyArray<PlaygroundCssVariable>;
	/**
	 * Inputs always passed to the component but not editable (e.g. a fixed `items`
	 * array for a select). Merged under the editable values.
	 */
	readonly staticInputs?: Readonly<Record<string, unknown>>;
	/**
	 * Optional CSS selector used to find the real target element for CSS-variable
	 * injection inside the stage. Needed when the previewed component's library element
	 * re-declares the same CSS custom properties in its own `:host {}` rule, overriding
	 * inherited values from the stage. Queried relative to the stage div each time
	 * variables are applied.
	 */
	readonly cssVarTargetSelector?: string;
	/**
	 * Optional override that builds the generated code snippet from the current input
	 * values. When omitted, the playground generates a sensible default from `tag`,
	 * `controls` and the live values.
	 */
	readonly codeTemplate?: (inputs: Record<string, unknown>) => string;
}
