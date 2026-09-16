import { inject, Signal } from '@angular/core';
import { AppI18nService } from '../services/app-i18n.service';

/**
 * The documentation shell's active language, for an example that mounts a component with a
 * `locale` input.
 *
 * ## Why this exists
 *
 * A library component that formats dates takes the language as an input — `<hub-calendar>` and
 * `<hub-datepicker>` both do — and every example left it at its default, so a reader on
 * `/es/calendar/examples` or `/ar/calendar/examples` got a page laid out in their language with an
 * English calendar sitting in the middle of it.
 *
 * The binding itself has to live in each example's template, because that is where the component
 * is. What must not be repeated is the **source**: fifteen examples reaching into the shell's
 * service on their own, each free to read it a different way, is fifteen places to keep in step.
 * This is that source, named once.
 *
 * It returns the service's own signal rather than a copy, so an example that binds it re-renders
 * with the language switcher like everything else on the page.
 *
 * ## What the reader is shown, and why it does not mention this
 *
 * **Settled decision: the code tab stays as it is, without `[locale]`.** The binding is applied to
 * the live template only, never to the `templateCode` / `componentCode` snippets beside it.
 *
 * A snippet has to be pastable into somebody else's application, and nobody outside this site has
 * the shell's service; a snippet that shows site plumbing teaches the wrong thing. `locale` already
 * has an example of its own — the i18n one — whose snippet does show it, which is where a reader
 * looking for that input will land. Putting it in front of a reader who came for drag-and-drop buys
 * nothing.
 *
 * The cost is known and accepted: on `/es/` the demo is Spanish while the snippet beside it names no
 * locale. That is the trade, taken deliberately rather than overlooked.
 *
 * ## What it deliberately does not fix
 *
 * The calendar bundles `en` and `es` and falls back to English for any other language, by design.
 * Feeding it `ar` therefore leaves it in English — consistently, which is the point of the
 * fallback. Reaching the other six languages means giving the libraries a `HUBUI.CALENDAR.*`
 * dictionary through the bridge in `app.config.ts`, which is a translation job and not this one.
 *
 * @returns The shell's active language as a signal, ready to bind to a `locale` input.
 *
 * @example
 * ```ts
 * export class BasicCalendarExampleComponent {
 *   protected readonly locale = exampleLocale();
 * }
 * ```
 * ```html
 * <hub-calendar [events]="events()" [locale]="locale()" />
 * ```
 */
export function exampleLocale(): Signal<string> {
	return inject(AppI18nService).lang;
}
