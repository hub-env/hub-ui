import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
	selector: 'app-avatar-initials-size-example',
	standalone: true,
	imports: [HubAvatarComponent, FormsModule],
	template: `
		<div class="demo">
			<label>
				Max Initials: <input type="number" [ngModel]="limit()" (ngModelChange)="limit.set($event)" min="0" max="5" />
			</label>
			<hub-avatar name="John Doe The Third" size="80" [initialsSize]="limit()" bgColor="#9c27b0"></hub-avatar>
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
export class AvatarInitialsSizeExampleComponent {
	limit = signal<number>(2);
	static readonly templateCode = `<hub-avatar name="John Doe The Third" size="80" [initialsSize]="limit"></hub-avatar>`;
	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-initials-size-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-initials-size-example.component.html'
})
export class AvatarInitialsSizeExampleComponent {
    limit = signal<number>(2);
}`;
}
