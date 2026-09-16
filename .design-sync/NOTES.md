# Claude Design sync — notes

## Scope

- **Tokens-only sync, by decision (2026-09-10).** Claude Design renders React components, and
  every ng-hub-ui library is Angular: no React peer, no web-component build. Shipping the
  converter's React bundle over Angular components would produce empty cards. So the project
  carries only `ng-hub-ui-ds` — tokens, the seven themes, the reset, the utility classes and the
  brand fonts — and the design agent builds its own components on top of them.
- If the components are ever wanted in Claude Design, the route is packaging them as web
  components (Angular Elements) first. That is a project of its own, not a sync setting.

## How the bundle is built (off-script)

The converter is not used: it needs a React entry. `ds-bundle/` is assembled by hand:

- `tokens/` — copies of `projects/ds/styles/tokens/hub-tokens.css`, `base/reset.css` and
  `utilities/{layout,surfaces,text}.css`. These are the compiled CSS twins; CI checks they match
  their SCSS source, so rebuild them before a sync if the SCSS changed.
- `fonts/` — the woff2 files `src/styles/fonts.scss` references (from `public/fonts/google/`),
  plus `fonts.css`, which is `fonts.scss` with `url(/fonts/google/…)` rewritten to `url(./…)`.
- `styles.css` — `@import`s of fonts, tokens, reset and utilities, in that order.
- `_ds_bundle.js` — an empty `window.HubUI` IIFE with the `@ds-bundle` header (`components: []`).
- `guidelines/` — four hand-authored reference cards (Colors, Typography, Spacing, Themes), each
  with the `@dsCard` first-line marker. They live here, not under `components/`, because the
  validator counts anything under `components/` as a component preview.
- `components/` — must exist and stay empty: the validator scans it unconditionally.
- `.ds-build-meta.json` — `{"componentCount": 0}`; the validator accepts an empty
  `renderHashes` only when this says zero.
- `_ds_sync.json` — written by `.ds-sync/write-sidecar.mjs` from `lib/sync-hashes.mjs`
  (`styleShaFor`, `auxShaFor`, `bundleSha12`). Regenerate it last, after every other file.

Playwright is installed inside `.ds-sync/` (gitignored), not in the repo's dependencies.

## Re-sync risks

- **The CSS twins drift from the SCSS.** `hub-tokens.css` is regenerated at publish time and has
  already been committed stale once; copy it only after confirming it matches a fresh compile.
- **The font list is copied, not linked.** A family or weight added to `scripts/generate-fonts.mjs`
  reaches the site but not this bundle until the fonts are recopied.
- **Inter ships but no token uses it.** The base font token is `system-ui`; Inter comes from the
  docs site's own override. Harmless, but do not document Inter as the body font.
- **The conventions header names tokens and classes by hand.** Re-validate every name against the
  fresh build on each sync; a renamed token would leave the design agent writing dead variables.
- **The guideline cards are authored HTML.** They render tokens by name, so a removed role or
  radius step shows as an empty swatch rather than failing a check.
