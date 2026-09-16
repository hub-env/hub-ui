/**
 * Design token catalogue for the tokens reference page.
 *
 * The `ref` and `sys` datasets are NOT maintained by hand: they are GENERATED from
 * the ds source of truth (`projects/ds/styles/tokens/hub-tokens.css`) by
 * `scripts/generate-tokens-data.mjs` (`npm run generate:tokens-data`, also run on
 * `prebuild`). To change a token, change it in the ds and regenerate — the docs app
 * never duplicates the catalogue.
 *
 * Token layers:
 *   - ref  (`--hub-ref-*`)  : Primitive, context-free values (colors, spacing, …).
 *   - sys  (`--hub-sys-*`)  : Semantic assignments that reference the ref layer.
 *   - component            : Component/general scoped tokens (everything else).
 *
 * The default `:root` of the ds only declares `ref` and `sys` tokens, so
 * {@link COMPONENT_TOKEN_GROUPS} is currently empty; component groups are added by
 * hand here as scoped tokens (e.g. `--hub-input-*`) are documented.
 */

import { TokenEntry, TokenGroup, TokenLibrary } from './tokens.model';
import { GENERATED_REF_TOKENS, GENERATED_SYS_TOKENS, GENERATED_TOKEN_LIBRARIES } from './tokens.generated';

export type { TokenEntry, TokenGroup, TokenLibrary } from './tokens.model';

/** Reference layer tokens (`--hub-ref-*`) — generated from the ds. */
export const REF_TOKENS: TokenEntry[] = GENERATED_REF_TOKENS;

/** System layer tokens (`--hub-sys-*`) — generated from the ds. */
export const SYS_TOKENS: TokenEntry[] = GENERATED_SYS_TOKENS;

/** Component-scoped token groups (e.g. `--hub-input-*`), curated by hand. */
export const COMPONENT_TOKEN_GROUPS: TokenGroup[] = [];

/** Every library that declares component tokens, linked to its docs — generated. */
export const TOKEN_LIBRARIES: TokenLibrary[] = GENERATED_TOKEN_LIBRARIES;
