import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from 'ng-hub-ui-utils';

@Component({
	selector: 'app-example-container',
	standalone: true,
	imports: [TranslatePipe],
	template: `
		<div class="example">
			<header class="example__header">
				<h2 class="example__title">{{ title() }}</h2>
				<p class="example__description">{{ description() }}</p>
			</header>

			<div class="example__demo">
				<ng-content select="[slot=demo]"></ng-content>
			</div>

			<div class="example__code">
				<h3 class="example__code-title">{{ 'UI.LIBRARY.EXAMPLE_VIEWER.CODE' | translate }}</h3>
				<div class="example__code-content">
					<ng-content select="[slot=code]"></ng-content>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './example-container.component.scss'
})
export class ExampleContainerComponent {
	readonly title = input.required<string>();
	readonly description = input.required<string>();
}
