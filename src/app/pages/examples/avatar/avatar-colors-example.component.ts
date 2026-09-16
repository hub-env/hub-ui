import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-colors-example',
	standalone: true,
	imports: [HubAvatarComponent],
	template: `
		<div class="demo">
			<hub-avatar name="Colors" size="60" bgColor="#e91e63" fgColor="#ffeb3b"></hub-avatar>
			<span>Custom BG & FG (inputs)</span>
		</div>

		<div class="demo">
			<!-- [autoColor]="false" drops the inline hash colour so the avatar is themed
             purely through the --hub-avatar-bg-color CSS variable (no !important). -->
			<hub-avatar class="themed-avatar" name="Theme Demo" [autoColor]="false" size="60"></hub-avatar>
			<span>Themed via <code>--hub-avatar-bg-color</code> (<code>[autoColor]="false"</code>)</span>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.demo {
			display: flex;
			align-items: center;
			gap: 1rem;
			margin-bottom: 1rem;
		}
		.themed-avatar {
			--hub-avatar-bg-color: #0d3b66;
			--hub-avatar-fg-color: #ffffff;
		}
	`
})
export class AvatarColorsExampleComponent {
	static readonly templateCode = `<!-- Inline colours via inputs -->
<hub-avatar name="Colors" size="60" bgColor="#e91e63" fgColor="#ffeb3b"></hub-avatar>

<!-- Themed via CSS variables: [autoColor]="false" frees --hub-avatar-bg-color -->
<style>
  .themed-avatar { --hub-avatar-bg-color: #0d3b66; --hub-avatar-fg-color: #fff; }
</style>
<hub-avatar class="themed-avatar" name="Theme Demo" [autoColor]="false" size="60"></hub-avatar>`;
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-colors-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-colors-example.component.html'
})
export class AvatarColorsExampleComponent {}`;
}
