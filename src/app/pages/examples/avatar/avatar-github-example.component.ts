import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-github-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar githubId="angular" size="60"></hub-avatar> `
})
export class AvatarGithubExampleComponent {
	static readonly templateCode = `<hub-avatar githubId="angular" size="60"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-github-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar githubId="angular" size="60"></hub-avatar>
  \`
})
export class AvatarGithubExampleComponent {}`;
}
