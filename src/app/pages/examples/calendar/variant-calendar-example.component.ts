import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CalendarEvent, HubCalendarComponent } from 'ng-hub-ui-calendar';
import { exampleLocale } from '../../../shared/example-locale';

/**
 * The `variant` accent is an open set, and that is the part a static list cannot show.
 * The nine canonical accents are resolved by the library stylesheet, while any other
 * string is read as `--hub-sys-color-<variant>` — so `brand` works here only because the
 * wrapper below declares that token, which is exactly what a host application does.
 */
@Component({
	selector: 'app-variant-calendar-example',
	standalone: true,
	imports: [HubCalendarComponent],
	template: `
		<div class="variant-demo">
			<div class="variant-controls">
				@for (v of variants; track v) {
					<button
						type="button"
						class="variant-chip"
						[class.variant-chip--active]="variant() === v"
						[attr.aria-pressed]="variant() === v"
						(click)="variant.set(v)"
					>
						{{ v }}
					</button>
				}
			</div>

			<hub-calendar [locale]="locale()" [events]="events()" [variant]="variant()" />

			<p class="variant-note">
				<code>brand</code> is not one of the nine built-ins: it renders because this example declares
				<code>--hub-sys-color-brand</code> on the wrapper. Any accent your design system defines works the same way,
				with no recompilation of the library.
			</p>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.variant-demo {
			--hub-sys-color-brand: #7c3aed;
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}
		.variant-controls {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}
		.variant-chip {
			padding: 0.25rem 0.75rem;
			border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			border-radius: 999px;
			background: transparent;
			color: inherit;
			cursor: pointer;
			font-size: 0.875rem;
		}
		.variant-chip--active {
			border-color: transparent;
			background: var(--hub-sys-color-primary, #0d6efd);
			color: #fff;
		}
		.variant-note {
			margin: 0;
			font-size: 0.875rem;
		}
		.variant-note code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.125rem 0.25rem;
			border-radius: 0.25rem;
		}
	`
})
export class VariantCalendarExampleComponent {
	/** The shell's active language, so the demo follows the documentation site's own. */
	protected readonly locale = exampleLocale();

	title = 'Semantic Accent (variant)';
	description = 'Re-base the calendar accent with a semantic variant, including a custom one.';

	/** The nine canonical accents plus a custom one backed by a token declared here. */
	readonly variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral', 'light', 'dark', 'brand'];

	readonly variant = signal<string>('success');

	readonly events = signal<CalendarEvent[]>([
		{ id: '1', title: 'Design Review', start: new Date() },
		{ id: '2', title: 'Release Window', start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
	]);

	static readonly templateCode = `<hub-calendar [events]="events()" variant="success" />

<!-- A custom accent: the library reads --hub-sys-color-brand -->
<hub-calendar [events]="events()" variant="brand" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubCalendarComponent, CalendarEvent } from 'ng-hub-ui-calendar';

@Component({
  selector: 'app-variant-calendar-example',
  standalone: true,
  imports: [HubCalendarComponent],
  template: \`<hub-calendar [events]="events()" [variant]="variant()" />\`,
  styles: \`
    :host { --hub-sys-color-brand: #7c3aed; }
  \`
})
export class VariantCalendarExampleComponent {
  // primary | secondary | success | danger | warning | info | neutral | light | dark
  // …or any other string, read as --hub-sys-color-<variant>.
  variant = signal('success');
  events = signal<CalendarEvent[]>([]);
}`;
}
