import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Options, SortableDirective } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';

/**
 * Demonstrates passing SortableJS `Options` through the directive: filtered (non-draggable)
 * items, event callbacks and autoscroll configuration.
 */
@Component({
	selector: 'app-sortable-with-options',
	standalone: true,
	imports: [ExampleContainerComponent, SortableDirective, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			title="Sortable - Options"
			description="Pass any SortableJS options through the directive: filter non-draggable items, hook into events and tune autoscroll."
		>
			<div slot="demo">
				<h5 class="mb-3">Filtered (disabled) items</h5>
				<ul class="list-group" [hubSortable]="draggableItems" [options]="draggableOptions">
					@for (item of draggableItems; track item) {
						<li class="list-group-item" [class.disabled]="!item.draggable">Element {{ item.text }}</li>
					}
				</ul>
				<div class="alert alert-dark mt-3">
					<code>{{ getDraggableValues() | json }}</code>
				</div>

				<h5 class="mt-4 mb-3">Events</h5>
				<div class="alert alert-info">Updated {{ eventUpdateCounter }} times</div>
				<ul class="list-group" [hubSortable]="eventItems" [options]="eventOptions">
					@for (item of eventItems; track item) {
						<li class="list-group-item">Element {{ item }}</li>
					}
				</ul>

				<h5 class="mt-4 mb-3">Autoscroll</h5>
				<p class="text-muted small">Drag near the edges of the list to trigger autoscroll.</p>
				<ul class="list-group sortable-scroll" [hubSortable]="scrollableItems" [options]="scrollableOptions">
					@for (item of scrollableItems; track item) {
						<li class="list-group-item">Element {{ item }}</li>
					}
				</ul>
			</div>
		</app-example-container>
	`,
	styles: [
		`
			.sortable-scroll {
				max-height: 220px;
				overflow-y: auto;
			}
		`
	]
})
export class SortableWithOptionsComponent implements FeatureExample {
	title = 'Options';
	description = 'Configure filters, event callbacks and autoscroll through the SortableJS options object.';
	import = `import { Options, SortableDirective } from 'ng-hub-ui-sortable';`;

	draggableItems = [
		{ draggable: true, text: '1' },
		{ draggable: true, text: '2' },
		{ draggable: false, text: '3' },
		{ draggable: true, text: '4' },
		{ draggable: true, text: '5' }
	];

	eventItems = ['1', '2', '3', '4', '5'];

	eventUpdateCounter = 0;

	scrollableItems = Array.from({ length: 30 }).map((_, i) => i + 1);

	draggableOptions: Options = {
		filter: '.disabled',
		preventOnFilter: true
	};

	eventOptions: Options = {
		onUpdate: () => this.eventUpdateCounter++
	};

	scrollableOptions: Options = {
		scroll: true,
		scrollSensitivity: 100
	};

	/**
	 * Returns the text values of the draggable items.
	 *
	 * @returns An array with the text of each draggable item.
	 */
	getDraggableValues(): string[] {
		return this.draggableItems.map((item) => item.text);
	}

	static readonly templateCode = `<ul class="list-group" [hubSortable]="items" [options]="options">
	@for (item of items; track item) {
		<li class="list-group-item" [class.disabled]="!item.draggable">
			Element {{ item.text }}
		</li>
	}
</ul>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { Options, SortableDirective } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective],
	templateUrl: './example.component.html'
})
export class ExampleComponent {
	items = [
		{ draggable: true, text: '1' },
		{ draggable: false, text: '2' }
	];

	options: Options = { filter: '.disabled', preventOnFilter: true };
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = SortableWithOptionsComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = SortableWithOptionsComponent.componentCode;
}
