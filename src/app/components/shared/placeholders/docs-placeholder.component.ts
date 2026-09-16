import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DocumentationLayoutComponent } from '../../../components/layouts/documentation-layout.component';

@Component({
	selector: 'app-docs-placeholder',
	standalone: true,
	imports: [DocumentationLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-documentation-layout [title]="title()" [description]="'Página de documentación en construcción.'">
			<p>
				La documentación para <strong>{{ raw() }}</strong> aún no está disponible.
			</p>
			<p>Este es un placeholder temporal para evitar enlaces rotos.</p>
		</app-documentation-layout>
	`
})
export class DocsPlaceholderComponent {
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
