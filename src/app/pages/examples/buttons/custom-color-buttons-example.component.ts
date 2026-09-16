import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the open-set colour API of ng-hub-ui-buttons.
 *
 * The `color` input accepts any string, not just the nine built-ins. Registering
 * a custom accent is a one-liner: point the local `--hub-btn-accent` slot at a
 * colour (in production via the `hub-btn-color-rules('brand')` SCSS mixin) and the
 * button derives the whole role family — emphasis / subtle / on — at runtime, so
 * every appearance (solid / outline / soft / ghost) works. The live preview inlines
 * the CSS the mixin would emit; the code panel shows the mixin form.
 */
@Component({
	selector: 'app-custom-color-buttons-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<style>
			.brand-scope .hub-btn-brand {
				--hub-btn-accent: #ff6b00;
			}
			.brand-scope .hub-btn-grape {
				--hub-btn-accent: #7c3aed;
			}
		</style>
		<div class="brand-scope d-flex flex-wrap gap-2">
			<button hubButton variant="solid" color="brand">Brand solid</button>
			<button hubButton variant="outline" color="brand">Brand outline</button>
			<button hubButton variant="soft" color="brand">Brand soft</button>
			<button hubButton variant="ghost" color="brand">Brand ghost</button>
			<button hubButton variant="solid" color="grape">Grape</button>
		</div>
	`
})
export class CustomColorButtonsExampleComponent {
	static readonly templateCode = `<div class="brand-scope d-flex flex-wrap gap-2">
  <button hubButton variant="solid"   color="brand">Brand solid</button>
  <button hubButton variant="outline" color="brand">Brand outline</button>
  <button hubButton variant="soft"    color="brand">Brand soft</button>
  <button hubButton variant="solid"   color="grape">Grape</button>
</div>`;

	static readonly componentCode = `// 1) Register a custom accent — one mixin call. You only define the single
//    --hub-sys-color-brand value; emphasis / subtle / on derive at runtime.
@use 'ng-hub-ui-buttons/styles' as hub;

:root { --hub-sys-color-brand: #ff6b00; }

hub-button, [hubButton] {
  @include hub.hub-btn-color-rules('brand');   // <hub-button color="brand"> now works
  @include hub.hub-btn-color-rules('grape');
}

// 2) Create a fully custom variant with the generic primitive (named params only,
//    reading the local --hub-btn-accent* slot family):
hub-button, [hubButton] {
  &.hub-btn-inverted.hub-btn-brand {
    @include hub.hub-btn-variant-rules(
      $bg:          var(--hub-btn-accent-on),
      $color:       var(--hub-btn-accent),
      $border:      var(--hub-btn-accent),
      $hover-bg:    var(--hub-btn-accent),
      $hover-color: var(--hub-btn-accent-on)
    );
  }
}`;
}
