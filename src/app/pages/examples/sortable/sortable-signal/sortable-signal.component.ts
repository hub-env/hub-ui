import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SortableDirective } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * Demonstrates binding the `hubSortable` directive to an Angular writable signal so the
 * signal-backed array stays in sync after every drag.
 */
@Component({
	selector: 'app-sortable-signal',
	standalone: true,
	imports: [ExampleContainerComponent, SortableDirective, JsonPipe, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			title="Sortable - Signals"
			description="Bind a writable signal as the sortable model. Reordering updates the signal value instantly, keeping reactive state in sync."
		>
			<div slot="demo">
				<ul class="list-group" [hubSortable]="frameworks">
					@for (fw of frameworks(); track fw.id) {
						<li class="list-group-item d-flex justify-content-between align-items-center sortable-handle">
							<span>{{ fw.name }}</span>
							<hub-badge color="primary" shape="rounded">v{{ fw.version }}</hub-badge>
						</li>
					}
				</ul>

				<p class="mt-3 mb-1">Current signal value:</p>
				<div class="alert alert-dark mb-0">
					<code>{{ frameworkNames | json }}</code>
				</div>
			</div>
		</app-example-container>
	`,
	styles: [
		`
			.sortable-handle {
				cursor: grab;
			}
		`
	]
})
export class SortableSignalComponent implements FeatureExample {
	title = 'Signals';
	description = 'Bind a writable signal and let the directive keep it in sync after every drag.';
	import = `import { SortableDirective } from 'ng-hub-ui-sortable';`;

	frameworks = signal([
		{ name: 'Angular', version: '18', id: 'ng' },
		{ name: 'React', version: '19', id: 'react' },
		{ name: 'Vue', version: '3', id: 'vue' },
		{ name: 'Svelte', version: '5', id: 'svelte' }
	]);

	/**
	 * Returns the list of framework names derived from the current signal value.
	 *
	 * @returns An array with the name of each framework.
	 */
	get frameworkNames(): string[] {
		return this.frameworks().map((fw) => fw.name);
	}

	static readonly templateCode = `<ul class="list-group" [hubSortable]="frameworks">
	@for (fw of frameworks(); track fw.id) {
		<li class="list-group-item">{{ fw.name }}</li>
	}
</ul>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { SortableDirective } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective],
	template: \`
		<ul [hubSortable]="frameworks">
			@for (fw of frameworks(); track fw.id) {
				<li>{{ fw.name }}</li>
			}
		</ul>
	\`
})
export class ExampleComponent {
	frameworks = signal([
		{ name: 'Angular', version: '18', id: 'ng' },
		{ name: 'React', version: '19', id: 'react' }
	]);
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = SortableSignalComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = SortableSignalComponent.componentCode;
}
