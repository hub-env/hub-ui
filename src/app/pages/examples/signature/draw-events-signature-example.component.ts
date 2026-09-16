import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * The drawing lifecycle and the stroke geometry, shown together because they answer the same
 * need: knowing what the field holds without reading the serialized SVG.
 *
 * `(drawStart)` / `(drawEnd)` are what let the status line and the button react at all — the
 * alternative was polling the value on a timer. `isEmpty()` is asked once per stroke instead of
 * parsing the SVG for a `<path>`. And `toStrokes()` / `fromStrokes()` move the geometry itself
 * to the second field, which `toSvg()` cannot do: the SVG is the form value, not the points.
 */
@Component({
	selector: 'app-signature-draw-events-example',
	standalone: true,
	imports: [HubSignatureComponent, HubButtonComponent, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<div class="row g-3">
				<div class="col-12 col-md-6">
					<hub-signature
						#source
						[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.SOURCE_LABEL')"
						(drawStart)="drawing.set(true)"
						(drawEnd)="onDrawEnd()"
					/>
				</div>
				<div class="col-12 col-md-6">
					<hub-signature
						#replay
						[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.REPLAY_LABEL')"
						[readonly]="true"
						[controls]="false"
					/>
				</div>
			</div>

			<div class="d-flex align-items-center gap-3 flex-wrap">
				<hub-badge shape="rounded" [class.text-bg-primary]="drawing()" [class.text-bg-secondary]="!drawing()">
					{{ statusText() }}
				</hub-badge>

				<button
					type="button"
					hubButton
					variant="outline"
					color="primary"
					size="sm"
					[disabled]="empty()"
					(click)="copyStrokes()"
				>
					{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.COPY') }}
				</button>
			</div>
		</div>
	`,
	styles: []
})
export class DrawEventsSignatureExampleComponent {
	protected readonly i18n = inject(AppI18nService);

	private readonly source = viewChild.required<HubSignatureComponent>('source');
	private readonly replay = viewChild.required<HubSignatureComponent>('replay');

	protected readonly drawing = signal(false);
	protected readonly empty = signal(true);
	protected readonly strokeCount = signal(0);

	/**
	 * The end of a stroke is the only moment the answers can have changed, so both are asked
	 * here rather than on a timer or on every value emission.
	 */
	protected onDrawEnd(): void {
		this.drawing.set(false);
		this.empty.set(this.source().isEmpty());
		this.strokeCount.set(this.source().toStrokes().length);
	}

	protected statusText(): string {
		if (this.drawing()) {
			return this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.DRAWING');
		}

		return this.empty()
			? this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.EMPTY')
			: `${this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.SIGNED')} · ${this.strokeCount()}`;
	}

	/** A programmatic write: the second field repaints without reporting a user change. */
	protected copyStrokes(): void {
		this.replay().fromStrokes(this.source().toStrokes());
	}

	static readonly templateCode = `<hub-signature
  #source
  label="Sign here"
  (drawStart)="drawing.set(true)"
  (drawEnd)="onDrawEnd()"
/>

<hub-signature #replay label="Replayed from strokes" [readonly]="true" [controls]="false" />

<hub-badge shape="rounded">{{ statusText() }}</hub-badge>
<button [disabled]="empty()" (click)="copyStrokes()">Copy the strokes across</button>`;

	static readonly componentCode = `import { Component, signal, viewChild } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';

export class DrawEventsComponent {
  private readonly source = viewChild.required<HubSignatureComponent>('source');
  private readonly replay = viewChild.required<HubSignatureComponent>('replay');

  readonly drawing = signal(false);
  readonly empty = signal(true);
  readonly strokeCount = signal(0);

  // The end of a stroke is the only moment the answers can have changed.
  onDrawEnd() {
    this.drawing.set(false);
    this.empty.set(this.source().isEmpty());
    this.strokeCount.set(this.source().toStrokes().length);
  }

  // toSvg() cannot do this: the SVG is the form value, not the geometry.
  // fromStrokes() repaints without reporting a user change to Angular forms.
  copyStrokes() {
    this.replay().fromStrokes(this.source().toStrokes());
  }
}`;
}
