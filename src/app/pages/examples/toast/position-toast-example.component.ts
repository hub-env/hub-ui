import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastPosition, HubToastService } from 'ng-hub-ui-toast';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/** Available container positions, used in the position selector. */
const POSITIONS: Array<{ label: string; value: HubToastPosition }> = [
	{ label: 'Top right', value: 'toast-top-right' },
	{ label: 'Top left', value: 'toast-top-left' },
	{ label: 'Top center', value: 'toast-top-center' },
	{ label: 'Bottom right', value: 'toast-bottom-right' },
	{ label: 'Bottom left', value: 'toast-bottom-left' },
	{ label: 'Bottom center', value: 'toast-bottom-center' }
];

/**
 * Demonstrates all six position classes supported by the toast container.
 * The position is passed as a per-call config override.
 */
@Component({
	selector: 'app-position-toast-example',
	standalone: true,
	imports: [FormsModule, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<div class="row g-2 align-items-end mb-3">
			<div class="col-auto">
				<label class="form-label fw-medium" for="positionSelect">Position</label>
				<select class="form-select" id="positionSelect" [(ngModel)]="selectedPosition">
					@for (p of positions; track p.value) {
						<option [value]="p.value">{{ p.label }}</option>
					}
				</select>
			</div>
			<div class="col-auto">
				<button hubButton color="primary" (click)="show()">
					Show at <em>{{ selectedPosition }}</em>
				</button>
			</div>
		</div>
		<div class="d-flex flex-wrap gap-2">
			@for (p of positions; track p.value) {
				<button hubButton variant="outline" color="secondary" size="sm" (click)="showAt(p.value)">
					{{ p.label }}
				</button>
			}
		</div>
	`
})
export class PositionToastExampleComponent {
	private readonly _toast = inject(HubToastService);

	readonly positions = POSITIONS;
	selectedPosition: HubToastPosition = 'toast-top-right';

	show(): void {
		this._toast.success(`Shown at ${this.selectedPosition}`, 'Position', {
			positionClass: this.selectedPosition
		});
	}

	showAt(pos: HubToastPosition): void {
		this._toast.info(pos, 'Position demo', { positionClass: pos });
	}

	static readonly templateCode = `<select class="form-select" [(ngModel)]="selectedPosition">
  @for (p of positions; track p.value) {
    <option [value]="p.value">{{ p.label }}</option>
  }
</select>
<button hubButton color="primary" (click)="show()">Show</button>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HubToastPosition, HubToastService } from 'ng-hub-ui-toast';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './position-toast-example.component.html'
})
export class PositionToastExampleComponent {
  private readonly toast = inject(HubToastService);

  readonly positions = [
    { label: 'Top right',     value: 'toast-top-right'    },
    { label: 'Top left',      value: 'toast-top-left'     },
    { label: 'Top center',    value: 'toast-top-center'   },
    { label: 'Bottom right',  value: 'toast-bottom-right' },
    { label: 'Bottom left',   value: 'toast-bottom-left'  },
    { label: 'Bottom center', value: 'toast-bottom-center'}
  ];

  selectedPosition: HubToastPosition = 'toast-top-right';

  show() {
    this.toast.success(
      'Shown at ' + this.selectedPosition,
      'Position',
      { positionClass: this.selectedPosition }
    );
  }
}`;
}
