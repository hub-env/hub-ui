import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-fallback-example',
	standalone: true,
	imports: [HubAvatarComponent],
	template: `
		<!-- Tries Facebook (Invalid) -> GitHub (Valid) -> Initials -->
		<hub-avatar facebookId="invalid_id" githubId="angular" name="Fallback Initials" size="60"> </hub-avatar>
		<p>Showing GitHub source (Facebook ID invalid)</p>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		p {
			font-size: 0.875rem;
			color: #666;
			margin-top: 0.5rem;
		}
	`
})
export class AvatarFallbackExampleComponent {
	static readonly templateCode = `<hub-avatar 
  facebookId="invalid_id" 
  githubId="angular" 
  name="Fallback Initials"
  size="60">
</hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-fallback-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`...\`
})
export class AvatarFallbackExampleComponent {}`;
}
