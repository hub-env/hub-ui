import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { HubModal } from '../../../../../projects/modal/src/public-api';
import { StepComponent, StepperComponent } from '../../../../../projects/stepper/src/public-api';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

/**
 * The wizard itself, opened as the modal's content.
 *
 * Nothing here knows it is inside a modal — which is the point. The stepper draws its controls
 * where it always does, and the modal lifts them out on the way in.
 */
@Component({
	selector: 'app-modal-stepper-wizard',
	standalone: true,
	imports: [StepperComponent, StepComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<hub-stepper>
			<hub-step title="Account">
				<p>Two short lines, so the dialog starts small.</p>
			</hub-step>

			<hub-step title="Details">
				<p>This step is deliberately taller than the first.</p>
				<p>Watch the dialog travel to its new height instead of snapping to it.</p>
				<p>The movement is the modal's, not the stepper's.</p>
				<p>Step back and it travels the other way.</p>
			</hub-step>

			<hub-step title="Done">
				<p>And short again.</p>
			</hub-step>
		</hub-stepper>
	`
})
export class ModalStepperWizardComponent {}

/**
 * Stepper inside a modal, with the navigation living in the modal's own footer.
 *
 * The interesting part is that this needs no glue. The stepper's Back / Continue / Submit
 * buttons resolve their stepper through the element injector, which is fixed where a node was
 * created rather than where it ends up — so `footerSelector` can relocate them into the footer
 * and they keep working, keep obeying `canNavigateTo`, and keep appearing and disappearing as
 * the step changes.
 *
 * One behaviour worth knowing before copying this: the selector's match is not itself moved,
 * its children are. `.hub-stepper__controls` stays behind and the buttons arrive bare, so the
 * footer's own layout is what arranges them — which is usually what you want in a dialog.
 */
@Component({
	selector: 'app-modal-stepper-example',
	standalone: true,
	imports: [HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <button type="button" hubButton color="primary" (click)="openWizard()">Open the wizard</button> `
})
export class ModalStepperExampleComponent {
	private readonly modal = inject(HubModal);

	/** Opens the wizard and hands its control bar to the modal footer. */
	openWizard(): void {
		this.modal.open(ModalStepperWizardComponent, {
			size: 'lg',
			footerSelector: '.hub-stepper__controls'
		});
	}

	static readonly templateCode = `<button type="button" (click)="openWizard()">Open the wizard</button>`;

	static readonly componentCode = `import { StepComponent, StepperComponent } from 'ng-hub-ui-stepper';

// The wizard knows nothing about the modal.
@Component({
  selector: 'app-wizard',
  imports: [StepperComponent, StepComponent],
  template: \`
    <hub-stepper>
      <hub-step title="Account">…</hub-step>
      <hub-step title="Details">…</hub-step>
      <hub-step title="Done">…</hub-step>
    </hub-stepper>
  \`
})
export class WizardComponent {}

// Opening it: footerSelector lifts the stepper's control bar into the modal footer.
// The buttons keep working because Angular resolves their stepper from where they were
// CREATED, not from where they end up in the DOM.
this.modal.open(WizardComponent, {
  size: 'lg',
  footerSelector: '.hub-stepper__controls'
});`;
}
