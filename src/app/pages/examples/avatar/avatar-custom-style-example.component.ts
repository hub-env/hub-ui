import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-custom-style-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-avatar
			name="Style"
			size="60"
			[style]="{ boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '2px dashed blue' }"
		></hub-avatar>
	`
})
export class AvatarCustomStyleExampleComponent {
	static readonly templateCode = `<hub-avatar name="Style" [style]="{ 'box-shadow': '...', 'border': '...' }"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-custom-style-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-custom-style-example.component.html'
})
export class AvatarCustomStyleExampleComponent {}`;
}
