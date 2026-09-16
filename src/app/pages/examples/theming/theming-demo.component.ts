import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/** The brand packs the live theming demo can switch between. */
type ThemePack = 'base' | 'teal' | 'sunset';

/**
 * Live demo for whole-ecosystem theming. Each "pack" scopes a handful of the
 * foundational `--hub-sys-color-*` and `--hub-ref-radius-*` design tokens on the
 * stage — exactly what `hub.theme($accents: …, $radius: …)` emits — and every
 * component underneath (buttons, badges, the surface card) re-tones at once,
 * because they all read from those same tokens. Switching packs mimics applying
 * a different map to the mixin, without touching any component individually.
 */
@Component({
	selector: 'app-theming-demo',
	standalone: true,
	imports: [HubButtonComponent, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<style>
			.theming-pack-teal {
				--hub-sys-color-primary: #0f766e;
				--hub-sys-color-success: #15803d;
				--hub-sys-color-danger: #b91c1c;
				--hub-sys-color-brand: #14b8a6;
				--hub-ref-radius-md: 0.75rem;
				--hub-ref-radius-lg: 1.25rem;
			}
			.theming-pack-sunset {
				--hub-sys-color-primary: #c2410c;
				--hub-sys-color-success: #b45309;
				--hub-sys-color-danger: #dc2626;
				--hub-sys-color-brand: #ff6b00;
				--hub-ref-radius-md: 0.25rem;
				--hub-ref-radius-lg: 0.5rem;
			}
			.theming-demo__stage {
				display: flex;
				flex-direction: column;
				gap: 0.75rem;
				padding: var(--hub-ref-space-4, 1rem);
				border: 1px solid var(--hub-sys-color-border, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--hub-ref-radius-lg, 0.5rem);
			}
			.theming-demo__card {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				border: 1px solid var(--hub-sys-color-border, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: var(--hub-ref-radius-md, 0.375rem);
				padding: var(--hub-ref-space-3, 0.75rem) var(--hub-ref-space-4, 1rem);
				color: var(--hub-sys-text-primary, inherit);
			}
		</style>

		<div class="d-flex flex-wrap gap-2 mb-3" role="group" aria-label="Theme pack">
			@for (p of packs; track p.id) {
				<button
					type="button"
					hubButton
					size="sm"
					[color]="pack() === p.id ? 'primary' : 'secondary'"
					[variant]="pack() === p.id ? 'solid' : 'outline'"
					(click)="pack.set(p.id)"
				>
					{{ p.label }}
				</button>
			}
		</div>

		<div [class]="'theming-demo__stage theming-pack-' + pack()">
			<div class="d-flex flex-wrap gap-2">
				<button hubButton color="primary">Primary</button>
				<button hubButton color="success">Success</button>
				<button hubButton color="danger">Danger</button>
				<button hubButton variant="soft" color="primary">Soft</button>
			</div>

			<div class="d-flex flex-wrap align-items-center gap-2">
				<hub-badge color="primary">Primary</hub-badge>
				<hub-badge color="success" variant="soft">Success</hub-badge>
				<hub-badge color="danger" variant="outline">Danger</hub-badge>
			</div>

			<div class="theming-demo__card">
				<strong>Surface card</strong>
				<div class="mb-0">
					Radius and spacing follow <code>--hub-ref-radius-*</code> / <code>--hub-ref-space-*</code>.
				</div>
			</div>
		</div>
	`,
	styles: []
})
export class ThemingDemoComponent {
	/** Currently applied brand pack. */
	readonly pack = signal<ThemePack>('base');

	/** Selectable packs shown in the switcher. */
	readonly packs: ReadonlyArray<{ id: ThemePack; label: string }> = [
		{ id: 'base', label: 'Base' },
		{ id: 'teal', label: 'Teal' },
		{ id: 'sunset', label: 'Sunset' }
	];
}
