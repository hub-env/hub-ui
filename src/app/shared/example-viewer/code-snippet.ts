/**
 * CodeSnippet - Componente para mostrar código resaltado
 * Usando ngx-highlightjs
 */

import { ChangeDetectionStrategy, Component, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
	selector: 'code-snippet',
	standalone: true,
	template: `
		<div class="code-snippet-wrapper">
			<pre #viewer><code [highlight]="displayCode()" [language]="displayLanguage()"></code></pre>
		</div>
	`,
	styles: [
		`
			.code-snippet-wrapper {
				position: relative;
			}

			pre {
				margin: 0;
				background-color: var(--hub-sys-surface-elevated);
				border-radius: 10px;
				overflow-x: auto;
				padding: 1rem;

				code {
					font-family: var(--hub-ref-font-family-mono);
					font-size: 0.875rem;
					line-height: 1.5;
				}
			}
		`
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [HighlightModule]
})
export class CodeSnippet {
	/** Código fuente directamente como string */
	readonly code = input<string>('');

	/** Lenguaje para resaltado de sintaxis */
	readonly language = input<string>('typescript');

	readonly viewer = viewChild<ElementRef<HTMLElement>>('viewer');

	/** Signal interno para el código a mostrar */
	readonly displayCode = signal<string>('');
	readonly displayLanguage = signal<string>('typescript');

	constructor() {
		effect(() => {
			this.displayCode.set(this.code() || '');
			this.displayLanguage.set(this.language() || 'typescript');
		});
	}

	/**
	 * Obtiene el contenido de texto del código para copiar
	 */
	get textContent(): string {
		return this.viewer()?.nativeElement?.textContent || this.displayCode();
	}
}
