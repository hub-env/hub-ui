import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	HubButtonComponent,
	HubDropdownDirective,
	HubDropdownPanelComponent,
	HubDropdownItemComponent,
	HubDropdownDividerComponent,
	HubDropdownHeaderComponent
} from 'ng-hub-ui-buttons';

/**
 * Demonstrates the dropdown button pattern: a HubButtonComponent paired with
 * the HubDropdownDirective and a panel template containing header, items, and divider.
 */
@Component({
	selector: 'app-dropdown-buttons-example',
	standalone: true,
	imports: [
		HubButtonComponent,
		HubDropdownDirective,
		HubDropdownPanelComponent,
		HubDropdownItemComponent,
		HubDropdownDividerComponent,
		HubDropdownHeaderComponent
	],
	changeDetection: ChangeDetectionStrategy.Default,
	template: `
		<button hubButton variant="solid" color="primary" [hubDropdown]="menu">
			Actions <i class="fa-solid fa-chevron-down ms-1"></i>
		</button>

		<ng-template #menu>
			<hub-dropdown-panel>
				<hub-dropdown-header>Actions</hub-dropdown-header>
				<hub-dropdown-item> <i class="fa-solid fa-pen me-2"></i> Edit </hub-dropdown-item>
				<hub-dropdown-item> <i class="fa-solid fa-copy me-2"></i> Duplicate </hub-dropdown-item>
				<hub-dropdown-divider></hub-dropdown-divider>
				<hub-dropdown-item color="danger"> <i class="fa-solid fa-trash me-2"></i> Delete </hub-dropdown-item>
			</hub-dropdown-panel>
		</ng-template>
	`
})
export class DropdownButtonsExampleComponent {
	static readonly templateCode = `<button hubButton variant="solid" color="primary" [hubDropdown]="menu">
  Actions <i class="fa-solid fa-chevron-down ms-1"></i>
</button>

<ng-template #menu>
  <hub-dropdown-panel>
    <hub-dropdown-header>Actions</hub-dropdown-header>
    <hub-dropdown-item>Edit</hub-dropdown-item>
    <hub-dropdown-item>Duplicate</hub-dropdown-item>
    <hub-dropdown-divider></hub-dropdown-divider>
    <hub-dropdown-item color="danger">Delete</hub-dropdown-item>
  </hub-dropdown-panel>
</ng-template>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubButtonComponent, HubDropdownDirective, HubDropdownPanelComponent, HubDropdownItemComponent, HubDropdownDividerComponent, HubDropdownHeaderComponent } from 'ng-hub-ui-buttons';

@Component({
  selector: 'app-dropdown-buttons-example',
  standalone: true,
  imports: [HubButtonComponent, HubDropdownDirective, HubDropdownPanelComponent, HubDropdownItemComponent, HubDropdownDividerComponent, HubDropdownHeaderComponent],
  templateUrl: './dropdown-buttons-example.component.html'
})
export class DropdownButtonsExampleComponent {}`;
}
