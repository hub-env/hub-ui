import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-board-api',
	standalone: true,
	imports: [],
	template: `
		<div class="api-container">
			<div class="api-header">
				<h1>📋 Board API Reference</h1>
				<p class="lead">Referencia completa de la API del componente Board y sus interfaces relacionadas.</p>
			</div>

			<div class="api-content">
				<!-- Navigation -->
				<div class="api-nav">
					<h3>Navegación API</h3>
					<ul class="nav-list">
						<li><a href="#components">Componentes</a></li>
						<li><a href="#interfaces">Interfaces</a></li>
						<li><a href="#services">Servicios</a></li>
						<li><a href="#directives">Directivas</a></li>
						<li><a href="#pipes">Pipes</a></li>
					</ul>
				</div>

				<!-- Components -->
				<section id="components" class="api-section">
					<h2>Componentes</h2>

					<!-- HubBoardComponent -->
					<div class="api-item">
						<h3>HubBoardComponent</h3>
						<div class="api-signature">
							<code>&lt;hub-board [board]="boardData"&gt;&lt;/hub-board&gt;</code>
						</div>
						<p>Componente principal para mostrar tableros Kanban con funcionalidad completa.</p>

						<h4>Propiedades de Entrada</h4>
						<div class="api-table-container">
							<table class="api-table">
								<thead>
									<tr>
										<th>Propiedad</th>
										<th>Tipo</th>
										<th>Default</th>
										<th>Descripción</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>board</code></td>
										<td><code>Board</code></td>
										<td>-</td>
										<td>Datos del tablero con columnas y tarjetas</td>
									</tr>
									<tr>
										<td><code>dragDropEnabled</code></td>
										<td><code>boolean</code></td>
										<td><code>true</code></td>
										<td>Habilita o deshabilita drag & drop</td>
									</tr>
									<tr>
										<td><code>infiniteScroll</code></td>
										<td><code>boolean</code></td>
										<td><code>false</code></td>
										<td>Activa el scroll infinito en columnas</td>
									</tr>
									<tr>
										<td><code>scrollThreshold</code></td>
										<td><code>number</code></td>
										<td><code>100</code></td>
										<td>Píxeles desde el final para activar carga</td>
									</tr>
									<tr>
										<td><code>customCardTemplate</code></td>
										<td><code>TemplateRef</code></td>
										<td>-</td>
										<td>Template personalizado para tarjetas</td>
									</tr>
									<tr>
										<td><code>customHeaderTemplate</code></td>
										<td><code>TemplateRef</code></td>
										<td>-</td>
										<td>Template personalizado para headers</td>
									</tr>
								</tbody>
							</table>
						</div>

						<h4>Eventos de Salida</h4>
						<div class="api-table-container">
							<table class="api-table">
								<thead>
									<tr>
										<th>Evento</th>
										<th>Tipo</th>
										<th>Descripción</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>cardMoved</code></td>
										<td><code>CardMovedEvent</code></td>
										<td>Se emite cuando una tarjeta es movida</td>
									</tr>
									<tr>
										<td><code>cardClicked</code></td>
										<td><code>BoardCard</code></td>
										<td>Se emite cuando se hace clic en una tarjeta</td>
									</tr>
									<tr>
										<td><code>columnReachedEnd</code></td>
										<td><code>ReachedEndEvent</code></td>
										<td>Se emite cuando se alcanza el final de una columna</td>
									</tr>
									<tr>
										<td><code>boardChanged</code></td>
										<td><code>Board</code></td>
										<td>Se emite cuando cambia el estado del tablero</td>
									</tr>
								</tbody>
							</table>
						</div>

						<h4>Métodos Públicos</h4>
						<div class="api-table-container">
							<table class="api-table">
								<thead>
									<tr>
										<th>Método</th>
										<th>Tipo</th>
										<th>Descripción</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>addCard(columnId, card)</code></td>
										<td><code>void</code></td>
										<td>Añade una tarjeta a una columna específica</td>
									</tr>
									<tr>
										<td><code>removeCard(cardId)</code></td>
										<td><code>void</code></td>
										<td>Elimina una tarjeta del tablero</td>
									</tr>
									<tr>
										<td><code>updateCard(cardId, data)</code></td>
										<td><code>void</code></td>
										<td>Actualiza los datos de una tarjeta</td>
									</tr>
									<tr>
										<td><code>resetBoard()</code></td>
										<td><code>void</code></td>
										<td>Reinicia el tablero a su estado inicial</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<!-- Interfaces -->
				<section id="interfaces" class="api-section">
					<h2>Interfaces</h2>

					<!-- Board Interface -->
					<div class="api-item">
						<h3>Board&lt;T = any&gt;</h3>
						<p>Interface principal que define la estructura de un tablero.</p>

						<div class="code-block">
							<pre><code>interface Board&lt;T = any&gt; {{ '{' }}
  id?: number;
  title: string;
  description?: string;
  columns?: BoardColumn&lt;T&gt;[];
  classlist?: string[];
  style?: {{ '{' }} [key: string]: any {{ '}' }};
{{ '}' }}</code></pre>
						</div>

						<div class="api-table-container">
							<table class="api-table">
								<thead>
									<tr>
										<th>Propiedad</th>
										<th>Tipo</th>
										<th>Requerido</th>
										<th>Descripción</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>id</code></td>
										<td><code>number</code></td>
										<td>No</td>
										<td>Identificador único del tablero</td>
									</tr>
									<tr>
										<td><code>title</code></td>
										<td><code>string</code></td>
										<td>Sí</td>
										<td>Título del tablero</td>
									</tr>
									<tr>
										<td><code>description</code></td>
										<td><code>string</code></td>
										<td>No</td>
										<td>Descripción opcional del tablero</td>
									</tr>
									<tr>
										<td><code>columns</code></td>
										<td><code>BoardColumn&lt;T&gt;[]</code></td>
										<td>No</td>
										<td>Array de columnas del tablero</td>
									</tr>
									<tr>
										<td><code>classlist</code></td>
										<td><code>string[]</code></td>
										<td>No</td>
										<td>Clases CSS adicionales</td>
									</tr>
									<tr>
										<td><code>style</code></td>
										<td><code>object</code></td>
										<td>No</td>
										<td>Estilos inline personalizados</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<!-- BoardColumn Interface -->
					<div class="api-item">
						<h3>BoardColumn&lt;T = any&gt;</h3>
						<p>Interface que define una columna del tablero.</p>

						<div class="code-block">
							<pre><code>interface BoardColumn&lt;T = any&gt; {{ '{' }}
  id?: number;
  boardId?: number;
  title: string;
  description?: string;
  cards: BoardCard&lt;T&gt;[];
  style?: {{ '{' }} [key: string]: any {{ '}' }};
  classlist?: string[] | string;
  disabled?: boolean;
  data?: any;
  cardSortingDisabled?: boolean;
  predicate?: (item?: CdkDrag&lt;T&gt;) =&gt; boolean;
{{ '}' }}</code></pre>
						</div>
					</div>

					<!-- BoardCard Interface -->
					<div class="api-item">
						<h3>BoardCard&lt;T = any&gt;</h3>
						<p>Interface que define una tarjeta del tablero.</p>

						<div class="code-block">
							<pre><code>interface BoardCard&lt;T = any&gt; {{ '{' }}
  id?: number;
  columnId?: number;
  title: string;
  description?: string;
  data?: T;
  classlist?: string[];
  style?: {{ '{' }} [key: string]: any {{ '}' }};
  disabled?: boolean;
{{ '}' }}</code></pre>
						</div>
					</div>

					<!-- ReachedEndEvent Interface -->
					<div class="api-item">
						<h3>ReachedEndEvent</h3>
						<p>Evento emitido cuando se alcanza el final de una columna en scroll infinito.</p>

						<div class="code-block">
							<pre><code>interface ReachedEndEvent {{ '{' }}
  columnId: number;
  column: BoardColumn;
  currentItemCount: number;
{{ '}' }}</code></pre>
						</div>
					</div>
				</section>

				<!-- Directives -->
				<section id="directives" class="api-section">
					<h2>Directivas</h2>

					<div class="api-item">
						<h3>BoardCardTemplateDirective</h3>
						<p>Directiva para definir templates personalizados de tarjetas.</p>

						<div class="code-block">
							<pre><code>&lt;hub-board [board]="boardData"&gt;
  &lt;ng-template boardCardTemplate let-card="card"&gt;
    &lt;div class="custom-card"&gt;
      &lt;h4&gt;{{ '{{' }} card.title {{ '}}' }}&lt;/h4&gt;
      &lt;p&gt;{{ '{{' }} card.description {{ '}}' }}&lt;/p&gt;
    &lt;/div&gt;
  &lt;/ng-template&gt;
&lt;/hub-board&gt;</code></pre>
						</div>
					</div>

					<div class="api-item">
						<h3>BoardColumnHeaderDirective</h3>
						<p>Directiva para personalizar headers de columna.</p>

						<div class="code-block">
							<pre><code>&lt;ng-template boardColumnHeader let-column="column"&gt;
  &lt;div class="custom-header"&gt;
    &lt;h3&gt;{{ '{{' }} column.title {{ '}}' }}&lt;/h3&gt;
    &lt;span class="card-count"&gt;{{ '{{' }} column.cards.length {{ '}}' }}&lt;/span&gt;
  &lt;/div&gt;
&lt;/ng-template&gt;</code></pre>
						</div>
					</div>

					<div class="api-item">
						<h3>BoardColumnFooterDirective</h3>
						<p>Directiva para personalizar footers de columna.</p>

						<div class="code-block">
							<pre><code>&lt;ng-template boardColumnFooter let-column="column"&gt;
  &lt;div class="custom-footer"&gt;
    &lt;button (click)="addCard(column.id)"&gt;+ Agregar Tarjeta&lt;/button&gt;
  &lt;/div&gt;
&lt;/ng-template&gt;</code></pre>
						</div>
					</div>
				</section>

				<!-- Pipes -->
				<section id="pipes" class="api-section">
					<h2>Pipes</h2>

					<div class="api-item">
						<h3>InvertColorPipe</h3>
						<p>Pipe para invertir colores y obtener contraste adecuado.</p>

						<div class="code-block">
							<pre><code>{{ '{{' }} '#ffffff' | invertColor {{ '}' }} &lt;!-- Resultado: #000000 --&gt;
{{ '{{' }} '#000000' | invertColor {{ '}' }} &lt;!-- Resultado: #ffffff --&gt;</code></pre>
						</div>

						<div class="api-table-container">
							<table class="api-table">
								<thead>
									<tr>
										<th>Parámetro</th>
										<th>Tipo</th>
										<th>Descripción</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>value</code></td>
										<td><code>string</code></td>
										<td>Color en formato hexadecimal</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<!-- Usage Examples -->
				<section id="usage-examples" class="api-section">
					<h2>Ejemplos de Uso</h2>

					<div class="example-block">
						<h3>Tablero Básico</h3>
						<div class="code-block">
							<pre><code>import {{ '{' }} Component {{ '}' }} from '@angular/core';
import {{ '{' }} Board, BoardColumn, BoardCard {{ '}' }} from '@ng-hub-ui/board';

@Component({{ '{' }}
  template: \`&lt;hub-board [board]="boardData"&gt;&lt;/hub-board&gt;\`
{{ '}' }})
export class MyComponent {{ '{' }}
  boardData: Board = {{ '{' }}
    id: 1,
    title: 'Proyecto Alpha',
    columns: [
      {{ '{' }}
        id: 1,
        title: 'To Do',
        cards: [
          {{ '{' }} id: 1, title: 'Tarea 1', description: 'Descripción de la tarea' {{ '}' }}
        ]
      {{ '}' }}
    ]
  {{ '}' }};
{{ '}' }}</code></pre>
						</div>
					</div>

					<div class="example-block">
						<h3>Con Templates Personalizados</h3>
						<div class="code-block">
							<pre><code>&lt;hub-board [board]="boardData"&gt;
  &lt;ng-template boardCardTemplate let-card="card"&gt;
    &lt;div class="priority-card" [attr.data-priority]="card.data?.priority"&gt;
      &lt;h4&gt;{{ '{{' }} card.title {{ '}' }}&lt;/h4&gt;
      &lt;div class="card-meta"&gt;
        &lt;span class="assignee"&gt;{{ '{{' }} card.data?.assignee {{ '}' }}&lt;/span&gt;
        &lt;span class="due-date"&gt;{{ '{{' }} card.data?.dueDate | date {{ '}' }}&lt;/span&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/ng-template&gt;
&lt;/hub-board&gt;</code></pre>
						</div>
					</div>
				</section>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.api-container {
				max-width: 1200px;
				margin: 0 auto;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			}

			.api-header {
				padding: 2rem 0;
				border-bottom: 1px solid #e0e0e0;
				margin-bottom: 2rem;
			}

			.api-header h1 {
				color: var(--hub-sys-text-primary, #212529);
				margin-bottom: 1rem;
			}

			.api-content {
				display: grid;
				grid-template-columns: 200px 1fr;
				gap: 3rem;
			}

			@media (max-width: 768px) {
				.api-content {
					grid-template-columns: 1fr;
					gap: 2rem;
				}
			}

			.api-nav {
				position: sticky;
				top: 2rem;
				height: fit-content;
			}

			.api-nav h3 {
				margin: 0 0 1rem 0;
				font-size: 1.1rem;
				color: var(--hub-sys-text-secondary, #495057);
			}

			.nav-list {
				list-style: none;
				margin: 0;
				padding: 0;
			}

			.nav-list li {
				margin-bottom: 0.5rem;
			}

			.nav-list a {
				color: var(--hub-sys-text-muted, #6c757d);
				text-decoration: none;
				font-size: 0.9rem;
				transition: color 0.3s ease;
			}

			.nav-list a:hover {
				color: #0d6efd;
			}

			.api-section {
				margin-bottom: 4rem;
				scroll-margin-top: 2rem;
			}

			.api-section h2 {
				color: var(--hub-sys-text-primary, #212529);
				border-bottom: 3px solid #0d6efd;
				padding-bottom: 0.5rem;
				margin-bottom: 2rem;
			}

			.api-item {
				background: white;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 8px;
				padding: 2rem;
				margin-bottom: 2rem;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
			}

			.api-item h3 {
				color: #0d6efd;
				margin-top: 0;
				margin-bottom: 1rem;
				font-size: 1.5rem;
			}

			.api-item h4 {
				color: var(--hub-sys-text-secondary, #495057);
				margin: 2rem 0 1rem 0;
				font-size: 1.2rem;
				border-bottom: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				padding-bottom: 0.5rem;
			}

			.api-signature {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				padding: 1rem;
				border-radius: 6px;
				border-left: 4px solid #0d6efd;
				margin: 1rem 0;
			}

			.api-signature code {
				color: #e83e8c;
				font-size: 1.1rem;
			}

			.code-block {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 6px;
				margin: 1rem 0;
				overflow-x: auto;
			}

			.code-block pre {
				margin: 0;
				padding: 1rem;
				background: transparent;
				border: none;
				font-size: 0.9rem;
				line-height: 1.4;
			}

			.code-block code {
				color: #e83e8c;
				background: transparent;
			}

			.api-table-container {
				overflow-x: auto;
				margin: 1rem 0;
			}

			.api-table {
				width: 100%;
				border-collapse: collapse;
				background: white;
			}

			.api-table th,
			.api-table td {
				padding: 0.75rem;
				text-align: left;
				border-bottom: 1px solid var(--hub-sys-border-color-default, #dee2e6);
			}

			.api-table th {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				font-weight: 600;
				color: var(--hub-sys-text-secondary, #495057);
			}

			.api-table td code {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				padding: 0.25rem 0.5rem;
				border-radius: 4px;
				font-size: 0.85rem;
				color: #e83e8c;
			}

			.api-table tr:hover {
				background: var(--hub-sys-surface-elevated, #f8f9fa);
			}

			.example-block {
				margin: 2rem 0;
				padding: 1.5rem;
				background: #fdfdfe;
				border: 1px solid var(--hub-sys-border-color-default, #dee2e6);
				border-radius: 8px;
				border-left: 4px solid #28a745;
			}

			.example-block h3 {
				margin-top: 0;
				color: #28a745;
			}
		`
	]
})
export class BoardApiComponent {}
