import { Component, signal, input, ChangeDetectionStrategy } from '@angular/core';
import { CodeFile } from './code-tabs.model';

export type { CodeFile } from './code-tabs.model';

@Component({
	selector: 'app-code-tabs',
	standalone: true,
	imports: [],
	template: `
		<div class="mt-4">
			<ul class="nav nav-tabs" role="tablist">
				@for (file of files(); track file.name; let i = $index) {
					<li class="nav-item" role="presentation">
						<button
							class="nav-link"
							[class.active]="activeIndex() === i"
							type="button"
							role="tab"
							(click)="activeIndex.set(i)"
						>
							{{ file.name }}
						</button>
					</li>
				}
			</ul>
			<div class="tab-content border-start border-end border-bottom p-3">
				@if (files().length > 0) {
					<pre class="mb-0"><code>{{ files()[activeIndex()].code }}</code></pre>
				} @else {
					<div class="text-muted small">No hay código para mostrar</div>
				}
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			pre {
				overflow: auto;
				background: #0f172a;
				color: #e2e8f0;
				border-radius: 0.25rem;
				padding: 1rem;
			}
			.nav-tabs .nav-link {
				cursor: pointer;
			}
		`
	]
})
export class CodeTabsComponent {
	/** Source files rendered as selectable tabs. */
	readonly files = input<CodeFile[]>([]);
	/** Index of the currently active tab. */
	activeIndex = signal(0);
}
