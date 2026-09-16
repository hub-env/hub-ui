import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The smallest useful form of `hub-loading`: an inline block that takes part in normal
 * document flow.
 *
 * Inline is the default `mode` on purpose. A loading block that reserves its own space
 * is the honest answer for a region that is still empty — nothing jumps when the real
 * content arrives, because the block was already occupying the room the content will take.
 * The overlay and fullscreen modes exist for the opposite case: content that already
 * exists and must be held back while it is refreshed.
 *
 * The third card shows the projected content slot. Whatever is written between the tags
 * renders under the message, which is where a cancel action or a "this is taking longer
 * than usual" note belongs.
 */
@Component({
	selector: 'app-loading-basic-usage-example',
	standalone: true,
	imports: [HubLoadingComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap gap-3 align-items-stretch">
			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-center gap-3 flex-grow-1"
				style="min-width: 14rem;"
			>
				<hub-loading />
				<span class="text-muted small text-center">Indicator only</span>
			</div>

			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-center gap-3 flex-grow-1"
				style="min-width: 14rem;"
			>
				<hub-loading message="Loading your workspace" />
				<span class="text-muted small text-center">With a message</span>
			</div>

			<div
				class="border rounded-3 p-4 d-flex flex-column align-items-center justify-content-center gap-3 flex-grow-1"
				style="min-width: 14rem;"
			>
				<hub-loading message="Importing 1,248 rows">
					<button type="button" hubButton variant="outline" color="secondary" size="sm">Cancel</button>
				</hub-loading>
				<span class="text-muted small text-center">With projected content</span>
			</div>
		</div>

		<p class="text-muted small mb-0 mt-3">
			The block is announced as <code>role="status"</code> with <code>aria-live="polite"</code>, so a screen reader reads
			the message when it appears without interrupting whatever is being read.
		</p>
	`,
	styles: []
})
export class BasicUsageLoadingExampleComponent {
	static readonly templateCode = `<!-- Indicator only -->
<hub-loading />

<!-- With a message underneath the indicator -->
<hub-loading message="Loading your workspace" />

<!-- Anything projected renders below the message -->
<hub-loading message="Importing 1,248 rows">
  <button type="button" hubButton variant="outline" color="secondary" size="sm">Cancel</button>
</hub-loading>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubLoadingComponent } from 'ng-hub-ui-loading';

@Component({
  standalone: true,
  imports: [HubLoadingComponent],
  templateUrl: './basic-usage-loading-example.component.html'
})
export class BasicUsageLoadingExampleComponent {}`;
}
