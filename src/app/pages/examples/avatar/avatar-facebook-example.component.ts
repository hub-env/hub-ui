import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-facebook-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar facebookId="nasa" size="60"></hub-avatar> `
})
export class AvatarFacebookExampleComponent {
	static readonly templateCode = `<hub-avatar facebookId="nasa" size="60"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-facebook-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar facebookId="nasa" size="60"></hub-avatar>
  \`
})
export class AvatarFacebookExampleComponent {}`;
}
