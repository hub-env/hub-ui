import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocumentationLayoutComponent } from '../../../components/layouts/documentation-layout.component';

@Component({
	selector: 'app-portal-docs',
	standalone: true,
	imports: [DocumentationLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-documentation-layout
			title="Portal"
			description="Renderiza contenido en cualquier ubicación del DOM, fuera del árbol normal de componentes."
		>
			<div class="docs-section">
				<h2>¿Qué es un Portal?</h2>
				<p>
					Un Portal es un componente que permite renderizar contenido de un componente hijo en un lugar diferente del
					DOM, fuera del árbol normal del componente padre. Esto es especialmente útil para elementos que necesitan
					"escapar" de contenedores con overflow oculto, z-index limitado, o posicionamiento relativo.
				</p>

				<div class="docs-callout docs-callout--info">
					<strong>💡 Casos de uso comunes:</strong>
					<ul>
						<li>Modales y diálogos</li>
						<li>Tooltips y popovers</li>
						<li>Dropdowns y menús contextuales</li>
						<li>Notificaciones toast</li>
						<li>Overlays y backdrops</li>
					</ul>
				</div>
			</div>

			<div class="docs-section">
				<h2>Instalación</h2>
				<div class="docs-code">
					<pre><code>npm install ng-hub-ui-portal</code></pre>
				</div>
			</div>

			<div class="docs-section">
				<h2>Uso Básico</h2>
				<div class="docs-code">
					<pre><code>{{ basicUsage }}</code></pre>
				</div>
			</div>

			<div class="docs-section">
				<h2>Características Principales</h2>

				<div class="docs-feature">
					<h3>🎯 Renderizado Dinámico</h3>
					<p>
						Renderiza contenido en cualquier ubicación del DOM especificada por un selector CSS, elemento del DOM, o
						usando ubicaciones predefinidas.
					</p>
				</div>

				<div class="docs-feature">
					<h3>🎨 Preservación de Contexto</h3>
					<p>
						Mantiene el contexto de Angular (inyección de dependencias, detección de cambios) aunque el contenido se
						renderice en otra parte del DOM.
					</p>
				</div>

				<div class="docs-feature">
					<h3>⚡ Gestión Automática</h3>
					<p>
						Se encarga automáticamente de crear, actualizar y limpiar el contenido portal cuando el componente se
						monta/desmonta.
					</p>
				</div>

				<div class="docs-feature">
					<h3>🔧 Múltiples Targets</h3>
					<p>
						Soporte para renderizar en el body, elementos específicos, o crear contenedores dinámicamente según las
						necesidades.
					</p>
				</div>
			</div>

			<div class="docs-section">
				<h2>Tipos de Portal</h2>

				<h3>Portal a Body</h3>
				<p>Renderiza el contenido directamente en el elemento body del documento.</p>
				<div class="docs-code">
					<pre><code>{{ portalToBody }}</code></pre>
				</div>

				<h3>Portal a Elemento Específico</h3>
				<p>Renderiza el contenido en un elemento específico identificado por selector CSS.</p>
				<div class="docs-code">
					<pre><code>{{ portalToElement }}</code></pre>
				</div>

				<h3>Portal Condicional</h3>
				<p>Renderiza el contenido solo cuando se cumple una condición específica.</p>
				<div class="docs-code">
					<pre><code>{{ conditionalPortal }}</code></pre>
				</div>
			</div>

			<div class="docs-section">
				<h2>Gestión de Estados</h2>
				<p>
					El portal puede gestionar diferentes estados como mostrar/ocultar, animaciones de entrada/salida, y cleanup
					automático.
				</p>
				<div class="docs-code">
					<pre><code>{{ stateManagement }}</code></pre>
				</div>
			</div>

			<div class="docs-section">
				<h2>Integración con Overlays</h2>
				<p>
					Los portales funcionan especialmente bien con overlays, backdrops y sistemas de z-index para crear
					interfaces modernas.
				</p>
				<div class="docs-code">
					<pre><code>{{ overlayIntegration }}</code></pre>
				</div>
			</div>

			<div class="docs-section">
				<h2>Consideraciones de Rendimiento</h2>
				<ul>
					<li>
						<strong>Change Detection:</strong> El contenido del portal sigue siendo parte del árbol de componentes
						de Angular
					</li>
					<li><strong>Memory Leaks:</strong> Se limpia automáticamente cuando el componente se destruye</li>
					<li><strong>Event Handling:</strong> Los eventos funcionan normalmente dentro del portal</li>
					<li><strong>Styling:</strong> Los estilos pueden requerir selectores globales o estrategias específicas</li>
				</ul>
			</div>

			<div class="docs-section">
				<h2>Buenas Prácticas</h2>
				<div class="docs-callout docs-callout--success">
					<ul>
						<li>Usa portales para elementos que necesitan escapar de contenedores restrictivos</li>
						<li>Combina portales con servicios para gestión centralizada de overlays</li>
						<li>Implementa cleanup apropiado para evitar memory leaks</li>
						<li>Considera la accesibilidad al renderizar contenido fuera del flujo normal</li>
						<li>Usa z-index y stacking contexts apropiados para la superposición</li>
					</ul>
				</div>
			</div>

			<div class="docs-section">
				<h2>Accesibilidad</h2>
				<p>
					Los portales requieren consideraciones especiales de accesibilidad ya que el contenido se renderiza fuera
					del flujo normal del DOM.
				</p>
				<ul>
					<li><strong>ARIA Labels:</strong> Usa aria-describedby y aria-labelledby para conectar contenido</li>
					<li><strong>Focus Management:</strong> Gestiona el foco apropiadamente al mostrar/ocultar portales</li>
					<li>
						<strong>Keyboard Navigation:</strong> Asegúrate de que la navegación por teclado funcione correctamente
					</li>
					<li><strong>Screen Readers:</strong> Considera cómo los lectores de pantalla navegarán el contenido</li>
				</ul>
			</div>
		</app-documentation-layout>
	`
})
export class PortalDocsComponent {
	basicUsage = `import { Component } from '@angular/core';
import { PortalComponent } from 'ng-hub-ui-portal';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [PortalComponent],
  template: \`
    <div class="container">
      <button (click)="showModal = !showModal">
        Toggle Modal
      </button>
      
      <hub-portal [isOpen]="showModal" target="body">
        <div class="modal-content">
          <h2>Modal Title</h2>
          <p>This content is rendered in the body!</p>
          <button (click)="showModal = false">Close</button>
        </div>
      </hub-portal>
    </div>
  \`
})
export class ExampleComponent {
  showModal = false;
}`;

	portalToBody = `<!-- Renderiza en el body del documento -->
<hub-portal [isOpen]="showTooltip" target="body">
  <div class="tooltip">
    Tooltip content rendered in body
  </div>
</hub-portal>`;

	portalToElement = `<!-- Renderiza en un elemento específico -->
<hub-portal 
  [isOpen]="showDropdown" 
  target="#dropdown-container"
  [offset]="{ x: 10, y: 5 }">
  <div class="dropdown-menu">
    <div class="dropdown-item">Option 1</div>
    <div class="dropdown-item">Option 2</div>
    <div class="dropdown-item">Option 3</div>
  </div>
</hub-portal>

<!-- Elemento target en algún lugar del DOM -->
<div id="dropdown-container"></div>`;

	conditionalPortal = `<!-- Portal condicional con animaciones -->
<hub-portal 
  [isOpen]="isModalOpen" 
  target="body"
  [hasBackdrop]="true"
  [closeOnBackdropClick]="true"
  (backdropClick)="closeModal()"
  (opened)="onModalOpened()"
  (closed)="onModalClosed()">
  
  <div class="modal" [@slideIn]>
    <div class="modal-header">
      <h2>{{ modalTitle }}</h2>
      <button (click)="closeModal()" aria-label="Close">×</button>
    </div>
    <div class="modal-body">
      <ng-content></ng-content>
    </div>
  </div>
</hub-portal>`;

	stateManagement = `export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private modalState = signal<'closed' | 'opening' | 'open' | 'closing'>('closed');

  openModal() {
    this.modalState.set('opening');
    this.isOpen = true;
  }

  closeModal() {
    this.modalState.set('closing');
    // Esperar animación antes de cerrar completamente
    setTimeout(() => {
      this.isOpen = false;
      this.modalState.set('closed');
    }, 300);
  }

  onPortalOpened() {
    this.modalState.set('open');
    this.opened.emit();
  }

  onPortalClosed() {
    this.modalState.set('closed');
    this.closed.emit();
  }
}`;

	overlayIntegration = `<!-- Portal con backdrop y z-index gestionado -->
<hub-portal 
  [isOpen]="showOverlay" 
  target="body"
  [hasBackdrop]="true"
  [backdropClass]="'custom-backdrop'"
  [zIndex]="1050"
  [disableScroll]="true">
  
  <div class="overlay-content" [style.z-index]="1051">
    <!-- Contenido del overlay -->
    <hub-panel>
      <h3>Overlay Content</h3>
      <p>This content appears above everything else</p>
    </hub-panel>
  </div>
</hub-portal>`;
}
