import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelComponent, HubPanelsComponent } from 'ng-hub-ui-panels';

/**
 * Reactive forms example — the active panel is bound to a FormControl through
 * the container's ControlValueAccessor. Each panel contributes its `value`.
 */
@Component({
	selector: 'app-reactive-forms-panels-example',
	standalone: true,
	imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<hub-panels [formControl]="selected">
			<hub-panel heading="Light" value="light">Light theme preview.</hub-panel>
			<hub-panel heading="Dark" value="dark">Dark theme preview.</hub-panel>
			<hub-panel heading="System" value="system">Follows the OS setting.</hub-panel>
		</hub-panels>
		<div class="mt-3"><strong>Selected value:</strong> {{ selected.value | json }}</div>
	`
})
export class ReactiveFormsPanelsExampleComponent {
	readonly selected = new FormControl<string>('dark');

	static readonly templateCode = `<hub-panels [formControl]="selected">
  <hub-panel heading="Light" value="light">Light theme preview.</hub-panel>
  <hub-panel heading="Dark" value="dark">Dark theme preview.</hub-panel>
  <hub-panel heading="System" value="system">Follows the OS setting.</hub-panel>
</hub-panels>
<div class="mt-3">
  <strong>Selected value:</strong> {{ selected.value | json }}
</div>`;

	static readonly componentCode = `import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HubPanelsComponent, HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
  selector: 'app-reactive-forms-panels-example',
  standalone: true,
  imports: [HubPanelsComponent, HubPanelComponent, ReactiveFormsModule, JsonPipe],
  templateUrl: './reactive-forms-panels-example.component.html'
})
export class ReactiveFormsPanelsExampleComponent {
  readonly selected = new FormControl<string>('dark');
}`;
}
