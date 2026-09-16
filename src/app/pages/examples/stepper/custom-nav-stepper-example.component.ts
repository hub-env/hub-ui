import { Component, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent, StepperNavDirective } from '../../../../../projects/stepper/src/public-api';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Custom navigation example using the hubStepperNav template outlet.
 */
@Component({
	selector: 'app-custom-nav-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent, StepperNavDirective, HubBadgeComponent],
	template: `
		<hub-stepper>
			<ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
				<ol class="custom-nav">
					@for (step of steps; track step; let i = $index) {
						<li [class.current]="i === currentIndex" [class.completed]="i < currentIndex">
							<hub-badge shape="rounded">{{ i + 1 }}</hub-badge>
							<span class="title">{{ step.title() || 'Step ' + (i + 1) }}</span>
						</li>
					}
				</ol>
			</ng-template>

			<hub-step title="Start">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Details">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Confirm">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
		</hub-stepper>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.custom-nav {
				list-style: none;
				padding: 0;
				display: flex;
				gap: 0.5rem;
			}

			.custom-nav li {
				display: flex;
				gap: 0.25rem;
				align-items: center;
				color: var(--hub-sys-text-muted, #6c757d);
			}

			.custom-nav li.current {
				color: #0d6efd;
			}

			.custom-nav li.completed {
				color: #198754;
			}

			.badge {
				display: inline-flex;
				width: 1.25rem;
				height: 1.25rem;
				align-items: center;
				justify-content: center;
				background: var(--hub-sys-state-hover-bg, #e9ecef);
				border-radius: 50%;
				font-size: 0.8rem;
			}
		`
	]
})
export class CustomNavStepperExampleComponent {
	static readonly templateCode = `<hub-stepper>
  <ng-template hubStepperNav let-steps="steps" let-currentIndex="currentIndex">
    <ol>
      @for (step of steps; track step; let i = $index) {
      <li>{{ step.title() }}</li>
      }
    </ol>
  </ng-template>
</hub-stepper>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { StepComponent, StepperComponent, StepperNavDirective } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-custom-nav-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent, StepperNavDirective],
  template: \`...\`
})
export class CustomNavStepperExampleComponent {}`;

	static readonly cssCode = `.custom-nav {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.5rem;
}

.custom-nav li.current {
  color: #0d6efd;
}

.custom-nav li.completed {
  color: #198754;
}`;

	readonly templateCode = CustomNavStepperExampleComponent.templateCode;
	readonly componentCode = CustomNavStepperExampleComponent.componentCode;
	readonly cssCode = CustomNavStepperExampleComponent.cssCode;
}
