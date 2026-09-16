import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-value-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar value="75%" size="60" bgColor="#e91e63"></hub-avatar> `
})
export class AvatarValueExampleComponent {
	static readonly templateCode = `<hub-avatar value="75%" size="60" bgColor="#e91e63"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-value-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`
    <hub-avatar value="75%" size="60" bgColor="#e91e63"></hub-avatar>
  \`
})
export class AvatarValueExampleComponent {}`;
}
