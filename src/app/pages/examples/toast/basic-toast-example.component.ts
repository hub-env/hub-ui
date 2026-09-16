import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates the four built-in semantic toast types:
 * success, error, warning and info.
 */
@Component({
	selector: 'app-basic-toast-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="d-flex flex-wrap gap-2">
			<button hubButton color="success" (click)="showSuccess()">
				<i class="fa-solid fa-circle-check me-1"></i> Success
			</button>
			<button hubButton color="danger" (click)="showError()"><i class="fa-solid fa-circle-xmark me-1"></i> Error</button>
			<button hubButton color="warning" (click)="showWarning()">
				<i class="fa-solid fa-triangle-exclamation me-1"></i> Warning
			</button>
			<button hubButton color="info" (click)="showInfo()"><i class="fa-solid fa-circle-info me-1"></i> Info</button>
		</div>
	`
})
export class BasicToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	showSuccess(): void {
		this._toast.success('Your changes have been saved successfully.', 'Saved');
	}

	showError(): void {
		this._toast.error('Something went wrong. Please try again.', 'Error');
	}

	showWarning(): void {
		this._toast.warning('Your session is about to expire.', 'Warning');
	}

	showInfo(): void {
		this._toast.info('A new version is available.', 'Update');
	}

	static readonly templateCode = `<div class="d-flex flex-wrap gap-2">
  <button hubButton color="success" (click)="showSuccess()">Success</button>
  <button hubButton color="danger"  (click)="showError()">Error</button>
  <button hubButton color="warning" (click)="showWarning()">Warning</button>
  <button hubButton color="info"    (click)="showInfo()">Info</button>
</div>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { HubToastService } from 'ng-hub-ui-toast';

@Component({
  selector: 'app-basic-toast-example',
  standalone: true,
  templateUrl: './basic-toast-example.component.html'
})
export class BasicToastExampleComponent {
  private readonly toast = inject(HubToastService);

  showSuccess() { this.toast.success('Your changes have been saved.', 'Saved'); }
  showError()   { this.toast.error('Something went wrong.', 'Error'); }
  showWarning() { this.toast.warning('Session about to expire.', 'Warning'); }
  showInfo()    { this.toast.info('A new version is available.', 'Update'); }
}`;
}
