import type { Dict } from './i18n.model';

/**
 * Deep-merges plain objects, returning a new object (arrays/strings are overwritten).
 *
 * @param base Base dictionary whose values are used as defaults.
 * @param over Override dictionary layered on top of `base`.
 * @returns A new dictionary combining both inputs without mutating them.
 */
export function deepMerge(base: Dict, over: Dict): Dict {
	const out: Dict = { ...base };
	for (const [k, v] of Object.entries(over)) {
		const prev = out[k];
		if (v && typeof v === 'object' && !Array.isArray(v) && prev && typeof prev === 'object' && !Array.isArray(prev)) {
			out[k] = deepMerge(prev as Dict, v as Dict);
		} else {
			out[k] = v;
		}
	}
	return out;
}

/**
 * Merges the UI/SEO/DOCS domains for one language into a single dictionary.
 *
 * @param domains Per-domain dictionaries to combine, in precedence order.
 * @returns The merged dictionary for the language.
 */
export function assemble(...domains: Dict[]): Dict {
	return domains.reduce<Dict>((acc, d) => deepMerge(acc, d), {});
}
