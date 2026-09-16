import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocumentationLayoutComponent } from '../../../components/layouts/documentation-layout.component';

@Component({
	selector: 'app-modal-docs',
	standalone: true,
	imports: [DocumentationLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-documentation-layout
			title="Modal"
			description="Componente de modal altamente configurable con soporte para stack, posiciones dinámicas y gestión de portales."
		>
			<h2>Instalación</h2>
			<pre><code>npm install @ng-hub-ui/modal</code></pre>

			<h2>Importación</h2>
			<pre><code>import &lbrace; ModalModule &rbrace; from '@ng-hub-ui/modal';</code></pre>

			<h2>Uso Básico</h2>
			<p>El Modal puede usarse tanto de forma declarativa como programática.</p>

			<h3>Uso Declarativo</h3>
			<pre><code>&lt;hub-modal 
  [(open)]="isModalOpen"
  title="Mi Modal"
  [dismissible]="true"&gt;
  
  &lt;p&gt;Contenido del modal&lt;/p&gt;
  
  &lt;div slot="footer"&gt;
    &lt;button (click)="isModalOpen = false"&gt;Cerrar&lt;/button&gt;
  &lt;/div&gt;
&lt;/hub-modal&gt;</code></pre>

			<h2>Características Principales</h2>
			<ul>
				<li><strong>Modal Stack</strong>: Soporte para múltiples modales apilados</li>
				<li><strong>Posicionamiento Dinámico</strong>: Posiciones automáticas basadas en el trigger</li>
				<li><strong>Portal System</strong>: Renderizado fuera del árbol DOM del componente</li>
				<li><strong>Gestión de Focus</strong>: Manejo automático del foco y tab trapping</li>
				<li><strong>Backdrop Inteligente</strong>: Diferentes comportamientos según configuración</li>
				<li><strong>Animaciones</strong>: Transiciones suaves de entrada y salida</li>
				<li><strong>Responsive</strong>: Adaptación automática a diferentes tamaños de pantalla</li>
			</ul>

			<h2>Posiciones Disponibles</h2>
			<ul>
				<li><code>center</code> - Centro de la pantalla (por defecto)</li>
				<li><code>top</code> - Parte superior</li>
				<li><code>bottom</code> - Parte inferior</li>
				<li><code>left</code> - Lado izquierdo</li>
				<li><code>right</code> - Lado derecho</li>
				<li><code>auto</code> - Posición automática basada en el trigger</li>
			</ul>

			<h2>Accesibilidad</h2>
			<ul>
				<li>Manejo automático del foco (focus trap)</li>
				<li>Soporte para ESC para cerrar</li>
				<li>Roles ARIA apropiados</li>
				<li>Anuncio de apertura a lectores de pantalla</li>
				<li>Navegación por teclado completa</li>
			</ul>
		</app-documentation-layout>
	`
})
export class ModalDocsComponent {}
