import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HubIconDirective } from 'ng-hub-ui-icons';

/**
 * The `[hubIcon]` directive renders an icon on an element you own, keeping your
 * own classes — handy inside links, list items or custom markup.
 *
 * The last row is the accessibility half: the icons paired with a text label are
 * decorative and hidden from screen readers, while the icon standing on its own
 * gets its name from `label`.
 */
@Component({
	selector: 'app-icons-directive-example',
	standalone: true,
	imports: [HubIconDirective],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-column gap-2" style="max-width: 22rem;">
			<a href="#" class="d-inline-flex align-items-center gap-2 text-decoration-none">
				<i hubIcon name="house"></i>
				<span>Home</span>
			</a>
			<a href="#" class="d-inline-flex align-items-center gap-2 text-decoration-none">
				<span [hubIcon]="'settings'" pack="ms" variant="rounded"></span>
				<span>Settings</span>
			</a>
			<a href="#" class="d-inline-flex align-items-center gap-2 text-decoration-none text-danger">
				<i hubIcon name="trash" pack="bi"></i>
				<span>Delete</span>
			</a>
			<a href="#" class="text-decoration-none text-danger">
				<i hubIcon name="trash" pack="bi" label="Delete this item"></i>
			</a>
		</div>
	`
})
export class IconsDirectiveExampleComponent {
	static readonly templateCode = `<a href="#">
  <i hubIcon name="house"></i>
  <span>Home</span>
</a>

<span [hubIcon]="'settings'" pack="ms" variant="rounded"></span>
<i hubIcon name="trash" pack="bi"></i>

<!-- No text beside it? Name it, or a screen reader announces nothing. -->
<i hubIcon name="trash" pack="bi" label="Delete this item"></i>`;

	static readonly componentCode = `import { HubIconDirective } from 'ng-hub-ui-icons';

@Component({ imports: [HubIconDirective], /* … */ })
export class MyComponent {}
// For directive-only apps, include the base styles once:
//   @use 'ng-hub-ui-icons/styles' as *;`;
}
