import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubIconComponent } from 'ng-hub-ui-icons';

/**
 * Icons inside buttons — by projection, not configuration. `ng-hub-ui-buttons`
 * is icon-library agnostic: just drop a `<hub-icon>` into the button's content.
 * The icon's side follows the markup order (before the label = leading, after =
 * trailing), you pick the pack per icon, and an icon with no label needs an
 * `aria-label`. No providers, no renderer wiring.
 */
@Component({
	selector: 'app-icons-buttons-example',
	standalone: true,
	imports: [HubButtonComponent, HubIconComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-wrap gap-3 align-items-center">
			<button hubButton color="primary"><hub-icon name="floppy-disk" /> Save</button>
			<button hubButton variant="outline" color="secondary"><hub-icon name="arrow-rotate-left" /> Undo</button>
			<button hubButton variant="soft" color="danger">Delete <hub-icon name="trash" /></button>
			<button hubButton variant="outline" color="secondary"><hub-icon name="house" pack="bi" /> Bootstrap</button>
			<button hubButton color="primary" aria-label="Settings"><hub-icon name="gear" /></button>
		</div>
	`
})
export class IconsButtonsExampleComponent {
	static readonly templateCode = `<!-- leading icon: icon before the label -->
<button hubButton color="primary"><hub-icon name="floppy-disk" /> Save</button>

<!-- trailing icon: icon after the label -->
<button hubButton variant="soft" color="danger">Delete <hub-icon name="trash" /></button>

<!-- any pack, per icon -->
<button hubButton variant="outline"><hub-icon name="house" pack="bi" /> Bootstrap</button>

<!-- icon-only: give it an aria-label -->
<button hubButton aria-label="Settings"><hub-icon name="gear" /></button>`;

	static readonly componentCode = `import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubIconComponent } from 'ng-hub-ui-icons';

@Component({
  imports: [HubButtonComponent, HubIconComponent],
  /* … */
})
export class MyComponent {}
// No provider wiring: buttons stay agnostic, you just project the icon.`;
}
