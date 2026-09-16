import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubFabComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the Floating Action Button (FAB) component.
 * The FAB is wrapped in a relative container so it stays within the docs page bounds.
 */
@Component({
	selector: 'app-fab-buttons-example',
	standalone: true,
	imports: [HubFabComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<!-- transform: translateZ(0) creates a new containing block for position:fixed descendants -->
		<div
			style="position:relative;height:200px;overflow:hidden;border:1px dashed var(--hub-sys-border-color-default, #dee2e6);border-radius:8px;background:var(--hub-sys-surface-elevated, #f8f9fa);transform:translateZ(0)"
		>
			<p class="p-3 text-muted small mb-0">FAB preview area — fixed within this container via CSS containment</p>
			<hub-fab position="bottom-end" [collapseOnScroll]="false">
				<i class="fa-solid fa-plus"></i>
			</hub-fab>
		</div>
	`
})
export class FabButtonsExampleComponent {
	static readonly templateCode = `<hub-fab position="bottom-end" [collapseOnScroll]="false">
  <i class="fa-solid fa-plus"></i>
</hub-fab>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubFabComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-fab-buttons-example',
  standalone: true,
  imports: [HubFabComponent],
  templateUrl: './fab-buttons-example.component.html'
})
export class FabButtonsExampleComponent {}`;
}
