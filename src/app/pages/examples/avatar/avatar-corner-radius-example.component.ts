import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-corner-radius-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar name="Radius" size="60" [round]="false" [cornerRadius]="10" bgColor="#009688"></hub-avatar> `
})
export class AvatarCornerRadiusExampleComponent {
	static readonly templateCode = `<hub-avatar name="Radius" size="60" [round]="false" [cornerRadius]="10" bgColor="#009688"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-corner-radius-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-corner-radius-example.component.html'
})
export class AvatarCornerRadiusExampleComponent {}`;
}
