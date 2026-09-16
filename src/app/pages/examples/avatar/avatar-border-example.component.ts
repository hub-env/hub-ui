import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-border-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar name="Border" size="60" borderColor="red" bgColor="#fff" fgColor="#333"></hub-avatar> `
})
export class AvatarBorderExampleComponent {
	static readonly templateCode = `<hub-avatar name="Border" size="60" borderColor="red" bgColor="#fff" fgColor="#333"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-border-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-border-example.component.html'
})
export class AvatarBorderExampleComponent {}`;
}
