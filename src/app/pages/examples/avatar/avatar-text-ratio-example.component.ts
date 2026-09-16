import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-text-ratio-example',
	standalone: true,
	imports: [HubAvatarComponent, FormsModule],
	template: `
		<div class="demo">
			<label>
				Text Ratio:
				<input type="number" [ngModel]="ratio()" (ngModelChange)="ratio.set($event)" min="1" max="10" step="0.5" />
			</label>
			<hub-avatar name="Ratio Demo" size="100" [textSizeRatio]="ratio()" bgColor="#9c27b0"></hub-avatar>
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
export class AvatarTextRatioExampleComponent {
	ratio = signal<number>(3);
	static readonly templateCode = `<hub-avatar name="Ratio Demo" size="100" [textSizeRatio]="ratio"></hub-avatar>`;
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-text-ratio-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-text-ratio-example.component.html'
})
export class AvatarTextRatioExampleComponent {
    ratio = signal<number>(3);
}`;
}
