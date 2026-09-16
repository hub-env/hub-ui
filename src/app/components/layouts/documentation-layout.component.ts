import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-documentation-layout',
	standalone: true,
	imports: [],
	template: `
		<div class="documentation-layout">
			<div class="documentation-layout__header">
				<h1 class="documentation-layout__title">{{ title() }}</h1>
				@if (description()) {
					<p class="documentation-layout__description">{{ description() }}</p>
				}
			</div>

			<div class="documentation-layout__content">
				<ng-content></ng-content>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.documentation-layout {
				max-width: 800px;
				margin: 0 auto;
				padding: 2rem;

				&__header {
					margin-bottom: 2rem;
					border-bottom: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
					padding-bottom: 1rem;
				}

				&__title {
					color: var(--bs-primary, #0d6efd);
					margin-bottom: 0.5rem;
				}

				&__description {
					color: var(--bs-secondary, #6c757d);
					font-size: 1.1rem;
					margin-bottom: 0;
				}

				&__content {
					line-height: 1.6;

					h2,
					h3,
					h4,
					h5,
					h6 {
						margin-top: 2rem;
						margin-bottom: 1rem;
						color: var(--bs-dark, #212529);
					}

					p {
						margin-bottom: 1rem;
					}

					ul,
					ol {
						margin-bottom: 1rem;
						padding-left: 2rem;
					}

					code {
						background-color: var(--bs-light, #f8f9fa);
						padding: 0.2rem 0.4rem;
						border-radius: 0.25rem;
						font-size: 0.9em;
					}

					pre {
						background-color: var(--bs-light, #f8f9fa);
						padding: 1rem;
						border-radius: 0.375rem;
						overflow-x: auto;
						margin-bottom: 1rem;
					}
				}
			}
		`
	]
})
export class DocumentationLayoutComponent {
	readonly title = input.required<string>();
	readonly description = input<string>();
}
