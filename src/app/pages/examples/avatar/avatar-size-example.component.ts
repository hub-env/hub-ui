import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-size-example',
	standalone: true,
	imports: [HubAvatarComponent, FormsModule],
	template: `
		<div class="demo">
			<label>
				Size: <input type="range" [ngModel]="size()" (ngModelChange)="size.set($event)" min="20" max="150" />
				{{ size() }}px
			</label>
			<hub-avatar name="Size Demo" [size]="size()" bgColor="#9c27b0"></hub-avatar>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.demo {
			display: flex;
			align-items: center;
			gap: 2rem;
		}
	`
})
export class AvatarSizeExampleComponent {
	size = signal<number>(60);

	static readonly templateCode = `<hub-avatar name="Size Demo" [size]="size" bgColor="#9c27b0"></hub-avatar>`;
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-size-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-size-example.component.html'
})
export class AvatarSizeExampleComponent {
    size = signal<number>(60);
}`;
}
