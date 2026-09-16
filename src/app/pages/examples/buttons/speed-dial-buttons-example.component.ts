import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubSpeedDialComponent, HubSpeedDialItemComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the Speed Dial component in all four corner positions.
 * Each preview box uses transform:translateZ(0) to create a containing block
 * for the position:fixed speed dial, keeping it inside the preview area.
 */
@Component({
	selector: 'app-speed-dial-buttons-example',
	standalone: true,
	imports: [HubSpeedDialComponent, HubSpeedDialItemComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
			@for (pos of positions; track pos.key) {
				<div
					style="position:relative;height:180px;overflow:hidden;border:1px dashed var(--hub-sys-border-color-default, #dee2e6);border-radius:8px;background:var(--hub-sys-surface-elevated, #f8f9fa);transform:translateZ(0)"
				>
					<p class="p-2 text-muted small mb-0">{{ pos.label }}</p>
					<hub-speed-dial [position]="pos.key" [color]="pos.color">
						<i hubTrigger class="fa-solid fa-plus" aria-hidden="true"></i>
						<hub-speed-dial-item icon="fa-solid fa-pen" label="Edit"></hub-speed-dial-item>
						<hub-speed-dial-item icon="fa-solid fa-share-nodes" label="Share"></hub-speed-dial-item>
						<hub-speed-dial-item icon="fa-solid fa-trash" label="Delete"></hub-speed-dial-item>
					</hub-speed-dial>
				</div>
			}
		</div>
	`
})
export class SpeedDialButtonsExampleComponent {
	readonly positions = [
		{ key: 'bottom-end' as const, label: 'Bottom right', color: 'primary' as const },
		{ key: 'bottom-start' as const, label: 'Bottom left', color: 'success' as const },
		{ key: 'top-end' as const, label: 'Top right', color: 'warning' as const },
		{ key: 'top-start' as const, label: 'Top left', color: 'secondary' as const }
	];

	static readonly templateCode = `<hub-speed-dial position="bottom-end">
  <i hubTrigger class="fa-solid fa-plus" aria-hidden="true"></i>
  <hub-speed-dial-item icon="fa-solid fa-pen"         label="Edit"></hub-speed-dial-item>
  <hub-speed-dial-item icon="fa-solid fa-share-nodes" label="Share"></hub-speed-dial-item>
  <hub-speed-dial-item icon="fa-solid fa-trash"       label="Delete"></hub-speed-dial-item>
</hub-speed-dial>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSpeedDialComponent, HubSpeedDialItemComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-speed-dial-buttons-example',
  standalone: true,
  imports: [HubSpeedDialComponent, HubSpeedDialItemComponent],
  templateUrl: './speed-dial-buttons-example.component.html'
})
export class SpeedDialButtonsExampleComponent {}`;
}
