import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-custom-image-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar src="https://i.pravatar.cc/150?u=custom" size="60"></hub-avatar> `
})
export class AvatarCustomImageExampleComponent {
	static readonly templateCode = `<hub-avatar src="https://i.pravatar.cc/150?u=custom" size="60"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-custom-image-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar src="https://i.pravatar.cc/150?u=custom" size="60"></hub-avatar>
  \`
})
export class AvatarCustomImageExampleComponent {}`;
}
