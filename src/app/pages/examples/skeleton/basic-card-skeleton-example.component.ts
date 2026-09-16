import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Basic preset example using the bundled card skeleton.
 */
@Component({
	selector: 'app-basic-card-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `<hub-skeleton preset="card"></hub-skeleton>`,
	styles: `
		:host {
			display: block;
			max-width: 22rem;
		}
	`
})
export class BasicCardSkeletonExampleComponent {
	static readonly templateCode = `<hub-skeleton preset="card"></hub-skeleton>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`<hub-skeleton preset="card"></hub-skeleton>\`
})
export class BasicCardSkeletonExampleComponent {}`;
}
