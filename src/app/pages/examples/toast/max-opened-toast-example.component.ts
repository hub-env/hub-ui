import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Demonstrates `maxOpened` and `autoDismiss`: cap the number of visible toasts
 * and optionally auto-remove the oldest when the cap is hit.
 */
@Component({
	selector: 'app-max-opened-toast-example',
	standalone: true,
	imports: [FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="row g-3 mb-3">
			<div class="col-auto">
				<label class="form-label fw-medium" for="maxOpened">maxOpened</label>
				<input
					class="form-control"
					type="number"
					id="maxOpened"
					[(ngModel)]="maxOpened"
					min="1"
					max="10"
					style="width: 80px"
				/>
			</div>
			<div class="col-auto d-flex align-items-end">
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" id="autoDismiss" [(ngModel)]="autoDismiss" />
					<label class="form-check-label" for="autoDismiss">autoDismiss (remove oldest)</label>
				</div>
			</div>
		</div>
		<p class="text-body-secondary small mb-3">
			When <code>autoDismiss</code> is <code>false</code>, new toasts are silently dropped once the cap is reached. When
			<code>true</code>, the oldest toast is removed to make room.
		</p>
		<button hubButton color="primary" (click)="addToast()">Add toast</button>
		<button hubButton variant="outline" color="secondary" class="ms-2" (click)="clearAll()">Clear all</button>
	`
})
export class MaxOpenedToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	maxOpened = 3;
	autoDismiss = true;
	private _count = 0;

	addToast(): void {
		this._count++;
		this._toast.info(`Notification #${this._count}`, 'Max opened demo', {
			maxOpened: this.maxOpened,
			autoDismiss: this.autoDismiss
		});
	}

	clearAll(): void {
		this._toast.clear();
		this._count = 0;
	}

	static readonly templateCode = `<input type="number" [(ngModel)]="maxOpened" />
<div class="form-check form-switch">
  <input type="checkbox" [(ngModel)]="autoDismiss" />
  <label>autoDismiss</label>
</div>
<button (click)="addToast()">Add toast</button>
<button (click)="clearAll()">Clear all</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastService } from 'ng-hub-ui-toast';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './max-opened-toast-example.component.html'
})
export class MaxOpenedToastExampleComponent {
  private readonly toast = inject(HubToastService);
  private count = 0;

  maxOpened = 3;
  autoDismiss = true;

  addToast() {
    this.toast.info('Notification #' + ++this.count, 'Max opened', {
      maxOpened: this.maxOpened,
      autoDismiss: this.autoDismiss
    });
  }

  clearAll() { this.toast.clear(); this.count = 0; }
}`;
}
