import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Shows the `preventDuplicates` option: when enabled, only one toast with the
 * same message and type can be visible at a time.
 */
@Component({
	selector: 'app-prevent-duplicates-toast-example',
	standalone: true,
	imports: [FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="form-check form-switch mb-3">
			<input class="form-check-input" type="checkbox" id="preventDup" [(ngModel)]="preventDuplicates" />
			<label class="form-check-label" for="preventDup">
				preventDuplicates: <strong>{{ preventDuplicates }}</strong>
			</label>
		</div>
		<p class="text-body-secondary small mb-3">
			Click the button multiple times. With <code>preventDuplicates</code> enabled, only one toast with the same message
			will appear.
		</p>
		<button hubButton color="primary" (click)="show()">Show "File saved" (click repeatedly)</button>
	`
})
export class PreventDuplicatesToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	preventDuplicates = true;

	show(): void {
		this._toast.success('File saved successfully.', 'Saved', {
			preventDuplicates: this.preventDuplicates
		});
	}

	static readonly templateCode = `<div class="form-check form-switch mb-3">
  <input class="form-check-input" type="checkbox" [(ngModel)]="preventDuplicates" />
  <label class="form-check-label">preventDuplicates: {{ preventDuplicates }}</label>
</div>
<button hubButton color="primary" (click)="show()">Show "File saved" (click repeatedly)</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastService } from 'ng-hub-ui-toast';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prevent-duplicates-toast-example.component.html'
})
export class PreventDuplicatesToastExampleComponent {
  private readonly toast = inject(HubToastService);

  preventDuplicates = true;

  show() {
    this.toast.success('File saved successfully.', 'Saved', {
      preventDuplicates: this.preventDuplicates
    });
  }
}`;
}
