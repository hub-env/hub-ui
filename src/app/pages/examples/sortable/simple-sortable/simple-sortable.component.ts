import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SortableDirective } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';

/** The snippets the code tabs publish. Module-level because `FeatureExample` asks for them
 * on the instance while the code extractor reads them off the class, and a static cannot
 * reach `this` — instantiating the component to bridge the two throws NG0203. */
const TEMPLATE_CODE = `<div class="d-flex flex-column gap-1" [hubSortable]="cities">
	@for (city of cities; track city) {
		<button type="button" hubButton color="secondary">{{ city }}</button>
	}
</div>`;

const COMPONENT_CODE = `import { Component } from '@angular/core';
import { SortableDirective } from 'ng-hub-ui-sortable';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubPanelComponent } from 'ng-hub-ui-panels';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective, HubButtonComponent, HubPanelComponent],
	template: \`
		<div [hubSortable]="cities">
			@for (city of cities; track city) {
				<button hubButton color="secondary">{{ city }}</button>
			}
		</div>
	\`
})
export class ExampleComponent {
	cities = ['Ankara', 'Moscow', 'Munich', 'Paris', 'Washington'];
}`;

/**
 * Demonstrates the most basic usage of the `hubSortable` directive: making a plain
 * array sortable across several Bootstrap layouts that all share the same model.
 */
@Component({
	selector: 'app-simple-sortable',
	standalone: true,
	imports: [ExampleContainerComponent, SortableDirective, JsonPipe, HubPanelComponent, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			title="Sortable - Simple Arrays"
			description="Make any array sortable with a single directive. Every layout below shares the same model, so each drag updates them all."
		>
			<div slot="demo">
				<h5 class="mb-3">Button groups</h5>
				<div class="clearfix">
					<div class="d-flex flex-column gap-1 float-start me-3" [hubSortable]="cities">
						@for (city of cities; track city) {
							<button type="button" hubButton color="secondary">{{ city }}</button>
						}
					</div>

					<div class="d-flex gap-1" [hubSortable]="cities">
						@for (city of cities; track city) {
							<button type="button" hubButton color="secondary">{{ city }}</button>
						}
					</div>
				</div>

				<h5 class="mt-4 mb-3">Cards</h5>
				<div class="row" [hubSortable]="cities">
					@for (city of cities; track city) {
						<div class="col-sm-4 my-2">
							<hub-panel>
								<div class="card-header">{{ city }}</div>
								<div>{{ city }} description</div>
							</hub-panel>
						</div>
					}
				</div>

				<h5 class="mt-4 mb-3">Navigation</h5>
				<ul class="nav nav-pills mb-3" [hubSortable]="cities">
					@for (city of cities; track city) {
						<li class="nav-item">
							<a class="nav-link active me-1">{{ city }}</a>
						</li>
					}
				</ul>

				<h5 class="mt-4 mb-3">Current model</h5>
				<div class="alert alert-dark mb-0">
					<code>{{ cities | json }}</code>
				</div>
			</div>
		</app-example-container>
	`,
	styles: []
})
export class SimpleSortableComponent implements FeatureExample {
	title = 'Simple Arrays';
	description = 'Drag-and-drop reordering on a plain array shared across several layouts.';
	import = `import { SortableDirective } from 'ng-hub-ui-sortable';`;

	cities = ['Ankara', 'Moscow', 'Munich', 'Paris', 'Washington'];

	template = TEMPLATE_CODE;

	component = COMPONENT_CODE;

	/** Template snippet shown in the code tab. */
	static readonly templateCode = TEMPLATE_CODE;

	/** Component snippet shown in the code tab. */
	static readonly componentCode = COMPONENT_CODE;
}
