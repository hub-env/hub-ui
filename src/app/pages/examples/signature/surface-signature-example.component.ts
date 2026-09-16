import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { HubBadgeComponent } from 'ng-hub-ui-badges';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * The three inputs that describe the surface and the pen, bound live, with `(valueChange)`
 * reporting what the form would receive.
 *
 * `[height]` is the one worth watching: it re-measures and repaints, and `toSvg()` emits a
 * `viewBox` describing the new box — but strokes keep the coordinates they were captured with,
 * so ink drawn on a short surface stays where it was and the extra room appears beneath it.
 * `[strokeColor]` and `[strokeWidth]` are read when a stroke opens, so a stroke already on the
 * canvas keeps the pen it was drawn with.
 */
@Component({
	selector: 'app-signature-surface-example',
	standalone: true,
	imports: [HubSignatureComponent, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="row g-3">
				<div class="col-12 col-sm-4">
					<label class="form-label" for="signature-surface-height">
						{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.HEIGHT') }} · {{ height() }}px
					</label>
					<input
						id="signature-surface-height"
						class="form-range"
						type="range"
						min="120"
						max="280"
						step="20"
						[value]="height()"
						(input)="height.set($any($event.target).valueAsNumber)"
					/>
				</div>

				<div class="col-12 col-sm-4">
					<label class="form-label" for="signature-surface-width">
						{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.STROKE_WIDTH') }} · {{ strokeWidth() }}px
					</label>
					<input
						id="signature-surface-width"
						class="form-range"
						type="range"
						min="1"
						max="8"
						step="1"
						[value]="strokeWidth()"
						(input)="strokeWidth.set($any($event.target).valueAsNumber)"
					/>
				</div>

				<div class="col-12 col-sm-4">
					<label class="form-label" for="signature-surface-ink">
						{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.INK') }}
					</label>
					<input
						id="signature-surface-ink"
						class="form-control form-control-color"
						type="color"
						[value]="ink()"
						(input)="ink.set($any($event.target).value)"
					/>
				</div>
			</div>

			<hub-signature
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.LABEL')"
				[height]="height()"
				[strokeWidth]="strokeWidth()"
				[strokeColor]="ink()"
				(valueChange)="characters.set($event.length)"
			/>

			<div>
				<hub-badge shape="rounded" [color]="characters() ? 'success' : 'secondary'">
					{{ valueText() }}
				</hub-badge>
			</div>
		</div>
	`,
	styles: []
})
export class SurfaceSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	protected readonly height = signal(160);
	protected readonly strokeWidth = signal(2);
	protected readonly ink = signal('#212529');

	/** Length of the last emitted SVG, which is what a backend would store. */
	protected readonly characters = signal(0);

	protected valueText(): string {
		return this.characters()
			? this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.VALUE', { chars: this.characters() })
			: this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.SURFACE.EMPTY');
	}

	static readonly templateCode = `<input type="range" min="120" max="280" step="20" [value]="height()"
  (input)="height.set($any($event.target).valueAsNumber)" />
<input type="range" min="1" max="8" [value]="strokeWidth()"
  (input)="strokeWidth.set($any($event.target).valueAsNumber)" />
<input type="color" [value]="ink()" (input)="ink.set($any($event.target).value)" />

<hub-signature
  label="Signature"
  [height]="height()"
  [strokeWidth]="strokeWidth()"
  [strokeColor]="ink()"
  (valueChange)="characters.set($event.length)"
/>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';

export class SurfaceComponent {
  // [height] is live: an effect re-runs resizeCanvas(), so the bitmap and the
  // viewBox toSvg() emits describe the same box. Strokes are never rescaled —
  // they keep the coordinates they were captured with — so change it while the
  // field is empty whenever the ink has to keep its place inside the frame.
  readonly height = signal(160);

  // Read when a stroke opens and stored on it, so strokes already drawn keep
  // the pen they were drawn with.
  readonly strokeWidth = signal(2);
  readonly ink = signal('#212529');

  // (valueChange) carries the SVG after a user-originated change only: a
  // programmatic writeValue() or fromStrokes() never emits.
  readonly characters = signal(0);
}`;
}
