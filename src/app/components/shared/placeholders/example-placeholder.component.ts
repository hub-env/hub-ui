import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExampleContainerComponent } from '../../../components/layouts/example-container.component';

@Component({
	selector: 'app-example-placeholder',
	standalone: true,
	imports: [ExampleContainerComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container [title]="title()" description="Ejemplo en construcción.">
			<div slot="demo">
				<p>
					El ejemplo <strong>{{ exampleRaw() }}</strong> para <strong>{{ categoryRaw() }}</strong> aún no está
					disponible.
				</p>
				<p>Este es un placeholder temporal para evitar enlaces rotos.</p>
			</div>
			<div slot="code">
				<h4>Información</h4>
				<pre><code>Ruta: /examples/{{ categoryRaw() }}/{{ exampleRaw() }}</code></pre>
			</div>
		</app-example-container>
	`
})
export class ExamplePlaceholderComponent {
	private route = inject(ActivatedRoute);
	private readonly params = toSignal(this.route.paramMap);
	readonly categoryRaw = computed(() => this.params()?.get('category') ?? 'componente');
	readonly exampleRaw = computed(() => this.params()?.get('example') ?? 'ejemplo');

	readonly title = computed(() => `${this.capitalize(this.categoryRaw())} - ${this.capitalize(this.exampleRaw())}`);

	private capitalize(value: string): string {
		if (!value) return value;
		return value
			.split('-')
			.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
			.join(' ');
	}
}
