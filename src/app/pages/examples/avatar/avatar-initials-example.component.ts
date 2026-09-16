import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-initials-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar name="John Doe" size="60" bgColor="#3f51b5" fgColor="#fff"></hub-avatar> `
})
export class AvatarInitialsExampleComponent {
	static readonly templateCode = `<hub-avatar name="John Doe" size="60" bgColor="#3f51b5" fgColor="#fff"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-initials-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar name="John Doe" size="60" bgColor="#3f51b5" fgColor="#fff"></hub-avatar>
  \`
})
export class AvatarInitialsExampleComponent {}`;
}
