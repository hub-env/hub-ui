import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-gravatar-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753" size="60"></hub-avatar> `
})
export class AvatarGravatarExampleComponent {
	static readonly templateCode = `<hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753" size="60"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-gravatar-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar gravatarId="adde9b2b981a8083cf084c63ad86f753" size="60"></hub-avatar>
  \`
})
export class AvatarGravatarExampleComponent {}`;
}
