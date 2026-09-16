import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

/**
 * The mark rendered by this example, kept as readable SVG source rather than a pre-encoded
 * blob so a reader can see what is actually being drawn.
 *
 * It is deliberately self-contained: no network request, no file under `public/`, nothing that
 * can 404 in a docs build. That also makes the snippet copy-pasteable into any app.
 */
const BRAND_MARK_SVG = [
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">',
	'<circle cx="32" cy="32" r="27" fill="none" stroke="#0d6efd" stroke-width="5"',
	' stroke-linecap="round" stroke-dasharray="34 18"/>',
	'<path d="M22 20h7v9h6v-9h7v24h-7v-9h-6v9h-7z" fill="#0d6efd"/>',
	'</svg>'
].join('');

/**
 * The same mark as a data URI. `encodeURIComponent` is what makes the `#` in each colour and
 * the angle brackets legal inside a URL — an un-encoded `#` truncates the URI at the fragment
 * and the image silently renders as nothing.
 */
const BRAND_MARK = `data:image/svg+xml,${encodeURIComponent(BRAND_MARK_SVG)}`;

/**
 * `image` replaces the built-in indicator with a mark of your own.
 *
 * Worth being deliberate about which animation goes with which mark. `spin` reads as a
 * mechanical indicator and only works on something radially symmetric — a wordmark rotating
 * end over end looks broken, not busy. `pulse` keeps the mark upright and legible, which is
 * why it is the safe choice for a real logo. `none` is not a missing animation: a still logo
 * with a moving message underneath is a legitimate, quieter loading state.
 *
 * The image replaces the indicator, so `variant` no longer applies. What does still apply is
 * `--hub-loading-image-size`, which is the token to reach for when a wide wordmark needs more
 * room than the default square.
 */
@Component({
	selector: 'app-loading-branded-image-example',
	standalone: true,
	imports: [HubLoadingComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-3 align-items-stretch">
			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-between gap-3 flex-grow-1"
				style="min-width: 13rem;"
			>
				<hub-loading [image]="brandMark" imageAnimation="none" message="Preparing your report" />
				<code class="small">imageAnimation="none"</code>
			</div>

			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-between gap-3 flex-grow-1"
				style="min-width: 13rem;"
			>
				<hub-loading [image]="brandMark" imageAnimation="spin" message="Preparing your report" />
				<code class="small">imageAnimation="spin"</code>
			</div>

			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-between gap-3 flex-grow-1"
				style="min-width: 13rem;"
			>
				<hub-loading [image]="brandMark" imageAnimation="pulse" message="Preparing your report" />
				<code class="small">imageAnimation="pulse"</code>
			</div>
		</div>

		<p class="text-muted small mb-0 mt-3">
			Any URL works — an asset path, an imported file or, as here, an inline data URI. Size the mark with
			<code>--hub-loading-image-size</code> rather than <code>size</code>, which drives the built-in indicators.
		</p>
	`,
	styles: []
})
export class BrandedImageLoadingExampleComponent {
	/** Exposed to the template; see {@link BRAND_MARK}. */
	protected readonly brandMark = BRAND_MARK;

	static readonly templateCode = `<!-- A still mark, with the message carrying the motion -->
<hub-loading [image]="brandMark" imageAnimation="none" message="Preparing your report" />

<!-- Rotates: only for radially symmetric marks -->
<hub-loading [image]="brandMark" imageAnimation="spin" message="Preparing your report" />

<!-- Breathes in place: keeps a wordmark upright and readable -->
<hub-loading [image]="brandMark" imageAnimation="pulse" message="Preparing your report" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

// Readable source, encoded on the way into the data URI. An un-encoded '#'
// would truncate the URI at the fragment and the image would render as nothing.
const BRAND_MARK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<circle cx="32" cy="32" r="27" fill="none" stroke="#0d6efd" stroke-width="5"' +
  ' stroke-linecap="round" stroke-dasharray="34 18"/>' +
  '<path d="M22 20h7v9h6v-9h7v24h-7v-9h-6v9h-7z" fill="#0d6efd"/>' +
  '</svg>';

const BRAND_MARK = 'data:image/svg+xml,' + encodeURIComponent(BRAND_MARK_SVG);

@Component({
  standalone: true,
  imports: [HubLoadingComponent],
  templateUrl: './branded-image-loading-example.component.html'
})
export class BrandedImageLoadingExampleComponent {
  protected readonly brandMark = BRAND_MARK;
}`;
}
