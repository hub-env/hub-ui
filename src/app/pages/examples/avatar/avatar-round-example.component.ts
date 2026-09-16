import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-round-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <hub-avatar name="Round" size="60" [round]="true" bgColor="#673ab7"></hub-avatar> `
})
export class AvatarRoundExampleComponent {
	static readonly templateCode = `<hub-avatar name="Round" size="60" [round]="true" bgColor="#673ab7"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-round-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-round-example.component.html'
})
export class AvatarRoundExampleComponent {}`;
}
