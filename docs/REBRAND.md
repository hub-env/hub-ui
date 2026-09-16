# Rebranding — changing accent colours

How to change the semantic accent colours (`primary` / `success` / `danger` /
`warning` / `info`) across the design system and the Figma file.

## Read first — how the colour system works

- **The `ds` is the generative source of truth.** Each variant exposes **one
  accent** (`--hub-sys-color-<variant>`); its roles (`-subtle`,
  `-border-subtle`, `-emphasis`, `-dark`) are **live `color-mix()`** off that
  accent. Change the accent → the whole family recomputes automatically.
- **Figma is a flattened mirror.** Figma variables can't hold a formula, so the
  derived roles are **static hex per mode**. Changing an accent in Figma does
  **not** update the derived roles — they must be regenerated (see §2).

So a rebrand is: change the accent in the `ds` (the truth), then mirror it in
Figma. Either side can be done **without AI**.

---

## 1. Design system (`ds`) — the source of truth

### a) Permanent change (the default palette)

1. Edit the accent maps in
   [`projects/ds/styles/tokens/hub-tokens.scss`](../projects/ds/styles/tokens/hub-tokens.scss)
   — `$hub-accents-light` and `$hub-accents-dark`:

   ```scss
   $hub-accents-light: (
   	primary: #7c3aed, // was: var(--hub-ref-color-blue-500, #0d6efd)
   	success: ...,
   	...
   );
   ```

2. Rebuild the compiled tokens:

   ```bash
   cd projects/ds && npm run build:tokens
   ```

3. The derived roles recompute via `color-mix()` — nothing else to touch.
4. (Optional) `npm run tokens:parity` to confirm no drift, and update the
   `ds` CHANGELOG if you are releasing.

### b) Per-app, at runtime (no build)

Override the accent in any consuming app — the derived roles follow live:

```css
:root {
	--hub-sys-color-primary: #7c3aed;
}
```

---

## 2. Figma (Firefly DS file) — the mirror

Figma is **not** generative, so it takes two steps.

### Step 1 — change the accent variable

Variables panel → collection **`ff · sys`** → `ff/sys/color/<variant>` → edit the
hex for each mode (**Light** / **Dark**). This recolours everything that aliases
the base accent (active tab/pill, alert accent stripe).

### Step 2 — re-flatten the derived roles

Run [`scripts/figma/reflatten-derived-colors.js`](../scripts/figma/reflatten-derived-colors.js)
inside Figma. **No Enterprise plan needed** via the free community plugin
**Scripter**:

1. Install **Scripter** (Figma → Plugins) and open it.
2. Paste the full contents of `reflatten-derived-colors.js` → **Run**.
3. It regenerates `subtle` / `border-subtle` / `emphasis` for all five variants
   from their accents (and aliases `dark` → `emphasis`), per mode.

> ⚠️ Skip step 2 and you get **drift**: the new base accent with the old derived
> tints (e.g. a green active tab but pink alert backgrounds).

> The Figma **REST Variables API** could automate this headless
> (`npm run …`), but that API is **Enterprise-only** — not available on this
> account, so use Scripter (or ask Claude, who runs it via the Figma MCP).

---

## Derivation reference

Keep both sides in sync — the single source of truth for these ratios is
`hub-color-derive()` in
[`hub-tokens.scss`](../projects/ds/styles/tokens/hub-tokens.scss):

| Role            | Formula                                  |
| --------------- | ---------------------------------------- |
| `subtle`        | `mix(accent 12%, surface/page)`          |
| `border-subtle` | `mix(accent 35%, surface/page)`          |
| `emphasis`      | `mix(accent 80%, ink)`                   |
| `dark`          | `= emphasis`                             |

`surface/page` and `ink` are read per mode (Light/Dark), so the tints adapt to
the theme automatically.

---

## Or just ask Claude

Tell it the variant + hex (and mode if relevant):

> "primary = #7c3aed" · "primary #7c3aed and success #16a34a, light and dark"

and it updates the `ds`, mirrors it in Figma (accent + re-flatten), and keeps the
token reference / parity in sync.
