# Hub UI — how to build with it

This bundle is the visual layer of Hub UI (`ng-hub-ui-ds`): design tokens, themes, a reset and
Bootstrap-compatible utility classes. **It ships no components.** The Hub UI component libraries
are Angular and cannot render here, so build your own React components and dress them only with
the tokens and classes below. Never hard-code a colour, size, radius or shadow that a token covers.

## Setup

`styles.css` loads everything: brand fonts, tokens, reset, utilities. Nothing to wrap, no provider.
Themes switch with one attribute on the root element:

```html
<html data-theme="light">  <!-- light · dark · bootstrap · sunset · forest · mono · terminal -->
```

With no attribute the page renders the light theme. `terminal` swaps the fonts to JetBrains Mono
and VT323 as well as the colours.

## Tokens — style with `var(--hub-*)`

- **Colour roles**: `--hub-sys-color-{role}` for `primary`, `secondary`, `success`, `danger`,
  `warning`, `info`, `neutral`, `light`, `dark`. Each role has `-subtle` (tinted background),
  `-emphasis` (text on a light surface) and `-on` (text on the solid role colour).
- **Surfaces and text**: `--hub-sys-surface-page`, `--hub-sys-surface-elevated`,
  `--hub-sys-text-primary`, `--hub-sys-text-secondary`, `--hub-sys-text-muted`,
  `--hub-sys-border-color-default`.
- **Scale**: `--hub-ref-space-0`…`--hub-ref-space-7`; `--hub-ref-radius-{none,sm,md,lg,xl,xxl,pill}`;
  `--hub-ref-font-size-{xs,sm,base,lg}`; `--hub-ref-font-weight-{light,base,medium,semibold,bold}`;
  `--hub-sys-shadow-{none,sm,md,lg,inset}`.
- **Fonts**: `--hub-ref-font-family-base` (body), `--hub-ref-font-family-display` (Sora, headings),
  `--hub-ref-font-family-mono`.

Use `-emphasis`, never the base role colour, for coloured text: the base amber and cyan are too
light to read on white.

## Utility classes

| Family | Examples |
| --- | --- |
| Layout | `d-flex`, `d-grid`, `gap-3`, `row`, `col-6`, `justify-content-between` |
| Spacing | `p-3`, `px-4`, `mb-3`, `mt-2` (scale 0–5) |
| Surfaces | `bg-primary`, `bg-primary-subtle`, `text-bg-primary`, `bg-body-tertiary` |
| Borders | `border`, `border-primary-subtle`, `rounded-3`, `rounded-pill`, `shadow-sm` |
| Text | `text-primary-emphasis`, `text-body-secondary`, `fs-4`, `fw-semibold`, `lh-sm`, `link-primary` |

The class and token sources are `tokens/hub-tokens.css` and `tokens/utilities/*.css`; read them
before inventing anything.

## Example

```jsx
<div className="bg-body-tertiary border rounded-3 p-4 d-flex gap-3"
     style={{ boxShadow: 'var(--hub-sys-shadow-sm)' }}>
  <span className="text-bg-success rounded-pill px-3 py-1 fw-semibold">Paid</span>
  <p className="text-body-secondary mb-0"
     style={{ fontFamily: 'var(--hub-ref-font-family-base)' }}>Invoice sent on 3 Sep</p>
</div>
```
