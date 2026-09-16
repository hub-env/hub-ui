import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ApiLayoutComponent } from '../../../components/layouts/api-layout.component';

@Component({
	selector: 'app-api-placeholder',
	standalone: true,
	imports: [ApiLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-api-layout [title]="title()" [description]="'Referencia de API en construcción.'">
			<p>
				La referencia de API para <strong>{{ raw() }}</strong> aún no está disponible.
			</p>
			<p>Este es un placeholder temporal para evitar enlaces rotos.</p>
		</app-api-layout>
	`
})
export class ApiPlaceholderComponent {
	private route = inject(ActivatedRoute);
	private readonly params = toSignal(this.route.paramMap);
	readonly raw = computed(() => this.params()?.get('page') ?? 'componente');
	readonly title = computed(() => this.capitalize(this.raw()));

	private capitalize(value: string): string {
		if (!value) return value;
		return value
			.split('-')
			.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
			.join(' ');
	}
}
