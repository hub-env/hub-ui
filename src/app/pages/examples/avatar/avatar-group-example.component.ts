import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

/**
 * The overlap is styled here rather than through the library's `.hub-avatar-group` helper:
 * that helper lives in the component's emulated-encapsulation stylesheet, so its rules are
 * scoped to the avatar's own template and never match a wrapper written by a consumer.
 */
@Component({
	selector: 'app-avatar-group-example',
	standalone: true,
	imports: [HubAvatarComponent],
	template: `
		<div class="avatar-group">
			<hub-avatar name="Alice" size="40" bgColor="#f44336"></hub-avatar>
			<hub-avatar name="Bob" size="40" bgColor="#2196f3"></hub-avatar>
			<hub-avatar name="Charlie" size="40" bgColor="#4caf50"></hub-avatar>
			<div class="more">+3</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.avatar-group {
			display: flex;
			align-items: center;
		}
		.avatar-group hub-avatar {
			margin-left: -10px;
			border: 2px solid #fff;
			border-radius: 50%;
		}
		.avatar-group hub-avatar:first-child {
			margin-left: 0;
		}
		.more {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background: #eee;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.8rem;
			font-weight: bold;
			color: #666;
			margin-left: -10px;
			border: 2px solid #fff;
			z-index: 0;
		}
	`
})
export class AvatarGroupExampleComponent {
	static readonly templateCode = `<div class="avatar-group">
  <hub-avatar name="Alice" size="40" bgColor="#f44336"></hub-avatar>
  <hub-avatar name="Bob" size="40" bgColor="#2196f3"></hub-avatar>
  <hub-avatar name="Charlie" size="40" bgColor="#4caf50"></hub-avatar>
  <div class="more">+3</div>
</div>`;

	static readonly cssCode = `.avatar-group {
  display: flex;
  align-items: center;
}
.avatar-group hub-avatar {
  margin-left: -10px;
  border: 2px solid #fff;
  border-radius: 50%;
}
.avatar-group hub-avatar:first-child {
  margin-left: 0;
}`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-group-example',
  standalone: true,
  imports: [HubAvatarComponent],
  template: \`…\`,
  styles: \`…\`
})
export class AvatarGroupExampleComponent {}`;
}
