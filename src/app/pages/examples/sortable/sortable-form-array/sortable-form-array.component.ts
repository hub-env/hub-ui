import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { SortableDirective } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';

/**
 * Demonstrates binding the `hubSortable` directive directly to a reactive `FormArray`,
 * keeping the form value in sync with the visual order after every drag.
 */
@Component({
	selector: 'app-sortable-form-array',
	standalone: true,
	imports: [ExampleContainerComponent, SortableDirective, ReactiveFormsModule, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			title="Sortable - Reactive FormArray"
			description="Bind directly to a reactive FormArray. Edit the inputs and drag to reorder — the form value always reflects the current order."
		>
			<div slot="demo">
				<ul class="list-group" [hubSortable]="citiesControls">
					@for (city of citiesControls.controls; track city) {
						<li class="list-group-item">
							<input class="form-control" [formControl]="$any(city)" />
						</li>
					}
				</ul>

				<p class="mt-3 mb-1">Current FormArray value:</p>
				<div class="alert alert-dark mb-0">
					<code>{{ citiesControls.value | json }}</code>
				</div>
			</div>
		</app-example-container>
	`,
	styles: []
})
export class SortableFormArrayComponent implements FeatureExample {
	title = 'Reactive FormArray';
	description = 'Bind the directive to a FormArray so the form value tracks the dragged order.';
	import = `import { SortableDirective } from 'ng-hub-ui-sortable';`;

	citiesControls = new UntypedFormArray(
		['Ankara', 'Moscow', 'Munich', 'Paris', 'Washington'].map((city) => new UntypedFormControl(city))
	);

	static readonly templateCode = `<ul class="list-group" [hubSortable]="citiesControls">
	@for (city of citiesControls.controls; track city) {
		<li class="list-group-item">
			<input class="form-control" [formControl]="$any(city)" />
		</li>
	}
</ul>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { SortableDirective } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective, ReactiveFormsModule],
	templateUrl: './example.component.html'
})
export class ExampleComponent {
	citiesControls = new UntypedFormArray(
		['Ankara', 'Moscow', 'Munich'].map((city) => new UntypedFormControl(city))
	);
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = SortableFormArrayComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = SortableFormArrayComponent.componentCode;
}
