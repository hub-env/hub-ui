import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { StepComponent, StepperComponent, StepperThemeService } from '../../../../../projects/stepper/src/public-api';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * Theming example using StepperThemeService to switch runtime themes.
 */
@Component({
	selector: 'app-theming-stepper-example',
	standalone: true,
	imports: [StepperComponent, StepComponent, HubButtonComponent],
	template: `
		<div class="controls">
			<button hubButton (click)="applyTheme('default')">Default</button>
			<button hubButton (click)="applyTheme('ocean')">Ocean</button>
			<button hubButton (click)="applyTheme('sunset')">Sunset</button>
		</div>

		<hub-stepper>
			<hub-step title="Step 1">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Step 2">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
			<hub-step title="Step 3">
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.</p>
				<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec ullamcorper nulla non metus.</p>
			</hub-step>
		</hub-stepper>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.controls {
				display: flex;
				gap: 0.5rem;
				margin-bottom: 0.5rem;
			}

			.btn {
				padding: 0.25rem 0.5rem;
				border: 1px solid var(--hub-sys-border-color-default, #ced4da);
				background: var(--hub-sys-surface-page, #fff);
				border-radius: 0.375rem;
			}
		`
	]
})
export class ThemingStepperExampleComponent implements OnInit {
	private readonly theme = inject(StepperThemeService);

	/**
	 * Initializes the component by applying the default stepper theme.
	 */
	ngOnInit(): void {
		this.applyTheme('default');
	}

	/**
	 * Applies the named theme to the stepper by setting its CSS custom
	 * properties through the theme service.
	 *
	 * @param name The identifier of the theme to apply.
	 */
	applyTheme(name: 'default' | 'ocean' | 'sunset') {
		const themes = {
			default: {
				'primary-color': '#009ef7',
				'secondary-color': '#b5b5c3',
				'background-color': '#f3f6f9',
				'text-color': '#181c32'
			},
			ocean: {
				'primary-color': '#0dcaf0',
				'secondary-color': '#6c757d',
				'background-color': '#e3f2fd',
				'text-color': '#0a4b68'
			},
			sunset: {
				'primary-color': '#ff6b6b',
				'secondary-color': '#ffa8a8',
				'background-color': '#fff3e0',
				'text-color': '#6c2c2c'
			}
		} as const;
		this.theme.setTheme(themes[name]);
	}

	static readonly templateCode = `<hub-stepper>
  <hub-step title="Step 1">
    <p>Choose a visual preset and continue.</p>
  </hub-step>
  <hub-step title="Step 2">
    <p>Check how colors and states adapt to the selected theme.</p>
  </hub-step>
  <hub-step title="Step 3">
    <p>Theme preview completed.</p>
  </hub-step>
</hub-stepper>`;

	static readonly componentCode = `import { Component, inject } from '@angular/core';
import { StepComponent, StepperComponent, StepperThemeService } from 'ng-hub-ui-stepper';

@Component({
  selector: 'app-theming-stepper-example',
  standalone: true,
  imports: [StepperComponent, StepComponent],
  template: \`...\`
})
export class ThemingStepperExampleComponent {
  private readonly theme = inject(StepperThemeService);

  applyTheme() {
    this.theme.setTheme({
      'primary-color': '#ff6b6b',
      'background-color': '#fff3e0'
    });
  }
}`;

	static readonly cssCode = `/* Runtime theme values managed by StepperThemeService.
No static CSS overrides are required for this example. */`;

	readonly templateCode = ThemingStepperExampleComponent.templateCode;
	readonly componentCode = ThemingStepperExampleComponent.componentCode;
	readonly cssCode = ThemingStepperExampleComponent.cssCode;
}
