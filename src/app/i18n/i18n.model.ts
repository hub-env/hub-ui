/**
 * Shared i18n type definitions.
 *
 * Describes the dictionary shapes used by the central i18n assembly in
 * `index.ts` and consumed by the application i18n service.
 */

/** Loose dictionary shape: nested objects of strings resolved by dotted key. */
export type AppTranslations = Record<string, unknown>;

/** Internal mutable dictionary used while merging language domains. */
export type Dict = Record<string, unknown>;
