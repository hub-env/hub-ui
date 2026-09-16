import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates all button variant × color combinations available in ng-hub-ui-buttons.
 * Shows solid, outline, soft, ghost, and link variants for primary, success, and danger colors.
 */
@Component({
	selector: 'app-btn-variants-buttons-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-wrap gap-2 mb-2">
			<button hubButton variant="solid" color="primary">Solid Primary</button>
			<button hubButton variant="solid" color="success">Solid Success</button>
			<button hubButton variant="solid" color="danger">Solid Danger</button>
		</div>
		<div class="d-flex flex-wrap gap-2 mb-2">
			<button hubButton variant="outline" color="primary">Outline Primary</button>
			<button hubButton variant="outline" color="success">Outline Success</button>
			<button hubButton variant="outline" color="danger">Outline Danger</button>
		</div>
		<div class="d-flex flex-wrap gap-2 mb-2">
			<button hubButton variant="soft" color="primary">Soft Primary</button>
			<button hubButton variant="soft" color="success">Soft Success</button>
			<button hubButton variant="soft" color="danger">Soft Danger</button>
		</div>
		<div class="d-flex flex-wrap gap-2 mb-2">
			<button hubButton variant="ghost" color="primary">Ghost Primary</button>
			<button hubButton variant="ghost" color="success">Ghost Success</button>
			<button hubButton variant="ghost" color="danger">Ghost Danger</button>
		</div>
		<div class="d-flex flex-wrap gap-2 mb-2">
			<button hubButton variant="link" color="primary">Link Primary</button>
			<button hubButton variant="link" color="success">Link Success</button>
			<button hubButton variant="link" color="danger">Link Danger</button>
		</div>
		<div class="d-flex flex-wrap align-items-center gap-2">
			<hub-button variant="solid" color="primary">Element form</hub-button>
			<small class="text-muted"
				>The same component as a custom element (<code>&lt;hub-button&gt;</code>) instead of the
				<code>[hubButton]</code> attribute.</small
			>
		</div>
	`
})
export class BtnVariantsButtonsExampleComponent {
	static readonly templateCode = `<div class="d-flex flex-wrap gap-2 mb-2">
  <button hubButton variant="solid"   color="primary">Solid Primary</button>
  <button hubButton variant="solid"   color="success">Solid Success</button>
  <button hubButton variant="solid"   color="danger">Solid Danger</button>
</div>
<div class="d-flex flex-wrap gap-2 mb-2">
  <button hubButton variant="outline" color="primary">Outline Primary</button>
  <button hubButton variant="outline" color="success">Outline Success</button>
  <button hubButton variant="outline" color="danger">Outline Danger</button>
</div>
<div class="d-flex flex-wrap gap-2 mb-2">
  <button hubButton variant="soft"    color="primary">Soft Primary</button>
  <button hubButton variant="soft"    color="success">Soft Success</button>
  <button hubButton variant="soft"    color="danger">Soft Danger</button>
</div>
<div class="d-flex flex-wrap gap-2 mb-2">
  <button hubButton variant="ghost"   color="primary">Ghost Primary</button>
  <button hubButton variant="ghost"   color="success">Ghost Success</button>
  <button hubButton variant="ghost"   color="danger">Ghost Danger</button>
</div>
<div class="d-flex flex-wrap gap-2 mb-2">
  <button hubButton variant="link"    color="primary">Link Primary</button>
  <button hubButton variant="link"    color="success">Link Success</button>
  <button hubButton variant="link"    color="danger">Link Danger</button>
</div>

<!-- The same component as a custom element instead of the [hubButton] attribute -->
<hub-button variant="solid" color="primary">Element form</hub-button>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-btn-variants-buttons-example',
  standalone: true,
  imports: [HubButtonComponent],
  templateUrl: './btn-variants-buttons-example.component.html'
})
export class BtnVariantsButtonsExampleComponent {}`;
}
