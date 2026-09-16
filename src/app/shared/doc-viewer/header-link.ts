/**
 * Header link es un componente que maneja la normalización
 * de las etiquetas de anclaje con la URL de la ruta actual.
 */

import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'header-link',
	standalone: true,
	template: `
		<a
			aria-label="Enlace a este encabezado"
			class="docs-markdown-a"
			[attr.aria-describedby]="example()"
			[href]="_fragmentUrl()"
		>
			<i class="fa-solid fa-link"></i>
		</a>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			:host {
				display: inline-block;
			}

			.docs-markdown-a {
				color: var(--bs-secondary);
				text-decoration: none;
				opacity: 0.6;
				transition: opacity 0.2s ease;
			}

			.docs-markdown-a:hover {
				opacity: 1;
			}
		`
	]
})
export class HeaderLink {
	/**
	 * Id del elemento ancla. Nota: usa "example" porque instanciamos
	 * los componentes header link a través de ComponentPortal.
	 */
	readonly example = signal('');

	/** URL base que se usa para construir la URL de fragmento absoluta. */
	private _baseUrl = inject(Router).url.split('#')[0];

	protected readonly _fragmentUrl = computed(() => {
		return `${this._baseUrl}#${this.example()}`;
	});
}
