import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-api-layout',
	standalone: true,
	imports: [],
	template: `
		<div class="api-layout">
			<div class="api-layout__header">
				<h1 class="api-layout__title">{{ title() }} API</h1>
				@if (description()) {
					<p class="api-layout__description">{{ description() }}</p>
				}
			</div>

			<div class="api-layout__content">
				<ng-content></ng-content>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.api-layout {
				max-width: 1000px;
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

					h2 {
						margin-top: 2rem;
						margin-bottom: 1rem;
						color: var(--bs-dark, #212529);
						border-bottom: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
						padding-bottom: 0.5rem;
					}

					h3,
					h4,
					h5,
					h6 {
						margin-top: 1.5rem;
						margin-bottom: 1rem;
						color: var(--bs-dark, #212529);
					}

					.api-section {
						margin-bottom: 2rem;

						&__method {
							background-color: var(--bs-light, #f8f9fa);
							padding: 1rem;
							border-radius: 0.375rem;
							margin-bottom: 1rem;
							border-left: 4px solid var(--bs-primary, #0d6efd);
						}

						&__signature {
							font-family: monospace;
							font-size: 0.95em;
							background-color: var(--bs-dark, #212529);
							color: white;
							padding: 0.75rem;
							border-radius: 0.25rem;
							margin-bottom: 0.5rem;
						}

						&__params {
							margin-top: 1rem;
						}
					}

					table {
						width: 100%;
						border-collapse: collapse;
						margin-bottom: 1rem;

						th,
						td {
							border: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
							padding: 0.75rem;
							text-align: left;
						}

						th {
							background-color: var(--bs-light, #f8f9fa);
							font-weight: 600;
						}

						code {
							background-color: var(--bs-light, #f8f9fa);
							padding: 0.2rem 0.4rem;
							border-radius: 0.25rem;
							font-size: 0.9em;
						}
					}
				}
			}
		`
	]
})
export class ApiLayoutComponent {
	readonly title = input.required<string>();
	readonly description = input<string>();
}
