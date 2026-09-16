import { Component, signal, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from 'ng-hub-ui-utils';

@Component({
	selector: 'app-example-container',
	standalone: true,
	imports: [TranslatePipe],
	template: `
		<div class="example-container">
			<div class="example-container__header">
				<h1 class="example-container__title">{{ title() }}</h1>
				@if (description()) {
					<p class="example-container__description">{{ description() }}</p>
				}
			</div>

			<div class="example-container__tabs">
				<button
					class="example-container__tab"
					[class.example-container__tab--active]="activeTab() === 'demo'"
					(click)="setActiveTab('demo')"
				>
					{{ 'UI.LIBRARY.EXAMPLE_VIEWER.DEMO' | translate }}
				</button>
				<button
					class="example-container__tab"
					[class.example-container__tab--active]="activeTab() === 'code'"
					(click)="setActiveTab('code')"
				>
					{{ 'UI.LIBRARY.EXAMPLE_VIEWER.CODE' | translate }}
				</button>
			</div>

			<div class="example-container__content">
				@if (activeTab() === 'demo') {
					<div class="example-container__demo">
						<ng-content select="[slot='demo']"></ng-content>
					</div>
				}

				@if (activeTab() === 'code') {
					<div class="example-container__code">
						<ng-content select="[slot='code']"></ng-content>
					</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.example-container {
				margin-bottom: 2rem;
				border: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
				border-radius: 0.375rem;
				overflow: hidden;

				&__header {
					padding: 1.5rem;
					background-color: var(--bs-light, #f8f9fa);
					border-bottom: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
				}

				&__title {
					margin-bottom: 0.5rem;
					color: var(--bs-dark, #212529);
					font-size: 1.5rem;
				}

				&__description {
					color: var(--bs-secondary, #6c757d);
					margin-bottom: 0;
					font-size: 1rem;
				}

				&__tabs {
					display: flex;
					background-color: var(--bs-light, #f8f9fa);
					border-bottom: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
				}

				&__tab {
					background: none;
					border: none;
					padding: 0.75rem 1.5rem;
					color: var(--bs-secondary, #6c757d);
					cursor: pointer;
					border-bottom: 2px solid transparent;
					transition: all 0.15s ease-in-out;

					&:hover {
						color: var(--bs-primary, #0d6efd);
						background-color: rgba(var(--bs-primary-rgb, 13, 110, 253), 0.1);
					}

					&--active {
						color: var(--bs-primary, #0d6efd);
						border-bottom-color: var(--bs-primary, #0d6efd);
						background-color: white;
					}
				}

				&__content {
					min-height: 200px;
				}

				&__demo {
					padding: 2rem;
					background-color: white;
				}

				&__code {
					background-color: var(--bs-light, #f8f9fa);

					h4 {
						margin: 0;
						padding: 1rem 1.5rem 0.5rem;
						color: var(--bs-dark, #212529);
						font-size: 1rem;
						font-weight: 600;

						&.mt-4 {
							margin-top: 0;
							padding-top: 1rem;
							border-top: 1px solid var(--bs-border-color, var(--hub-sys-border-color-default, #dee2e6));
						}
					}

					pre {
						margin: 0;
						padding: 1rem 1.5rem;
						background: none;
						border-radius: 0;

						code {
							background: none;
							padding: 0;
							border-radius: 0;
						}
					}
				}
			}
		`
	]
})
export class ExampleContainerComponent {
	readonly title = input.required<string>();
	readonly description = input<string>();

	activeTab = signal<'demo' | 'code'>('demo');

	setActiveTab(tab: 'demo' | 'code'): void {
		this.activeTab.set(tab);
	}
}
