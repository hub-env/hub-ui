import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ApiLayoutComponent } from '../../../components/layouts/api-layout.component';

@Component({
	selector: 'app-portal-api',
	standalone: true,
	imports: [ApiLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-api-layout title="Portal" description="Referencia completa de la API del componente Portal para ng-hub-ui-portal.">
			<div class="api-section">
				<h2>Componente Principal</h2>

				<div class="api-section__method">
					<h3>PortalComponent</h3>
					<div class="api-section__signature">
						&lt;hub-portal [isOpen]="boolean" [target]="string | Element"&gt; &lt;!-- Content --&gt;
						&lt;/hub-portal&gt;
					</div>
					<p>Componente principal que renderiza contenido en ubicaciones específicas del DOM.</p>

					<div class="api-section__params">
						<h4>Inputs</h4>
						<table>
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Tipo</th>
									<th>Defecto</th>
									<th>Descripción</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><code>isOpen</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Controla si el portal está abierto y el contenido visible</td>
								</tr>
								<tr>
									<td><code>target</code></td>
									<td>string | Element | PortalTarget</td>
									<td>'body'</td>
									<td>Destino donde renderizar el contenido</td>
								</tr>
								<tr>
									<td><code>hasBackdrop</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe mostrar un backdrop detrás del contenido</td>
								</tr>
								<tr>
									<td><code>backdropClass</code></td>
									<td>string</td>
									<td>''</td>
									<td>Clase CSS personalizada para el backdrop</td>
								</tr>
								<tr>
									<td><code>closeOnBackdropClick</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe cerrar al hacer click en el backdrop</td>
								</tr>
								<tr>
									<td><code>closeOnEscape</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe cerrar al presionar la tecla Escape</td>
								</tr>
								<tr>
									<td><code>disableScroll</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe deshabilitar el scroll del body cuando está abierto</td>
								</tr>
								<tr>
									<td><code>zIndex</code></td>
									<td>number</td>
									<td>1000</td>
									<td>Z-index para el contenido del portal</td>
								</tr>
								<tr>
									<td><code>offset</code></td>
									<td>PortalOffset</td>
									<td>{{ '{' }} x: 0, y: 0 {{ '}' }}</td>
									<td>Offset de posición relativo al target</td>
								</tr>
								<tr>
									<td><code>position</code></td>
									<td>PortalPosition</td>
									<td>'static'</td>
									<td>Estrategia de posicionamiento del contenido</td>
								</tr>
								<tr>
									<td><code>autoFocus</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe enfocar automáticamente el primer elemento focusable</td>
								</tr>
								<tr>
									<td><code>restoreFocus</code></td>
									<td>boolean</td>
									<td>true</td>
									<td>Si debe restaurar el foco al elemento anterior al cerrar</td>
								</tr>
								<tr>
									<td><code>trapFocus</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Si debe atrapar el foco dentro del portal</td>
								</tr>
								<tr>
									<td><code>ariaLabel</code></td>
									<td>string</td>
									<td>''</td>
									<td>Label ARIA para accesibilidad</td>
								</tr>
								<tr>
									<td><code>ariaDescribedBy</code></td>
									<td>string</td>
									<td>''</td>
									<td>ID del elemento que describe el portal</td>
								</tr>
								<tr>
									<td><code>role</code></td>
									<td>string</td>
									<td>'dialog'</td>
									<td>Rol ARIA del contenido del portal</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="api-section__params">
						<h4>Outputs (Eventos)</h4>
						<table>
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Tipo</th>
									<th>Descripción</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><code>opened</code></td>
									<td>void</td>
									<td>Se emite cuando el portal se abre completamente</td>
								</tr>
								<tr>
									<td><code>closed</code></td>
									<td>void</td>
									<td>Se emite cuando el portal se cierra completamente</td>
								</tr>
								<tr>
									<td><code>backdropClick</code></td>
									<td>MouseEvent</td>
									<td>Se emite cuando se hace click en el backdrop</td>
								</tr>
								<tr>
									<td><code>escapeKey</code></td>
									<td>KeyboardEvent</td>
									<td>Se emite cuando se presiona la tecla Escape</td>
								</tr>
								<tr>
									<td><code>positionChange</code></td>
									<td>PortalPositionInfo</td>
									<td>Se emite cuando cambia la posición del portal</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="api-section">
				<h2>Servicios</h2>

				<div class="api-section__method">
					<h3>PortalService</h3>
					<p>Servicio para gestión centralizada de portales y overlays.</p>

					<div class="api-section__params">
						<h4>Métodos</h4>
						<table>
							<thead>
								<tr>
									<th>Método</th>
									<th>Retorna</th>
									<th>Descripción</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><code>create(config: PortalConfig)</code></td>
									<td>PortalRef</td>
									<td>Crea un nuevo portal programáticamente</td>
								</tr>
								<tr>
									<td><code>open(portal: PortalRef)</code></td>
									<td>void</td>
									<td>Abre un portal existente</td>
								</tr>
								<tr>
									<td><code>close(portal: PortalRef)</code></td>
									<td>void</td>
									<td>Cierra un portal existente</td>
								</tr>
								<tr>
									<td><code>closeAll()</code></td>
									<td>void</td>
									<td>Cierra todos los portales abiertos</td>
								</tr>
								<tr>
									<td><code>getOpenPortals()</code></td>
									<td>PortalRef[]</td>
									<td>Obtiene la lista de portales actualmente abiertos</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="api-section">
				<h2>Interfaces y Tipos</h2>

				<div class="api-section__method">
					<h3>PortalTarget</h3>
					<div class="api-section__signature">type PortalTarget = 'body' | 'viewport' | string | Element;</div>
					<p>Tipos de destinos válidos para el portal.</p>
				</div>

				<div class="api-section__method">
					<h3>PortalPosition</h3>
					<div class="api-section__signature">
						type PortalPosition = 'static' | 'relative' | 'absolute' | 'fixed' | 'connected';
					</div>
					<p>Estrategias de posicionamiento disponibles.</p>
				</div>

				<div class="api-section__method">
					<h3>PortalOffset</h3>
					<div class="api-section__signature">
						interface PortalOffset {{ '{' }}
						x: number; y: number;
						{{ '}' }}
					</div>
					<p>Configuración de offset para posicionamiento.</p>
				</div>

				<div class="api-section__method">
					<h3>PortalConfig</h3>
					<div class="api-section__signature">
						interface PortalConfig {{ '{' }}
						target?: PortalTarget; hasBackdrop?: boolean; backdropClass?: string; closeOnBackdropClick?: boolean;
						closeOnEscape?: boolean; disableScroll?: boolean; zIndex?: number; offset?: PortalOffset; position?:
						PortalPosition; autoFocus?: boolean; restoreFocus?: boolean; trapFocus?: boolean; ariaLabel?: string;
						ariaDescribedBy?: string; role?: string; data?: any;
						{{ '}' }}
					</div>
					<p>Configuración completa para crear portales programáticamente.</p>
				</div>

				<div class="api-section__method">
					<h3>PortalRef</h3>
					<div class="api-section__signature">
						interface PortalRef {{ '{' }}
						id: string; isOpen: boolean; componentRef: ComponentRef&lt;any&gt;; open(): void; close(): void;
						updatePosition(): void; destroy(): void;
						{{ '}' }}
					</div>
					<p>Referencia a un portal creado programáticamente.</p>
				</div>

				<div class="api-section__method">
					<h3>PortalPositionInfo</h3>
					<div class="api-section__signature">
						interface PortalPositionInfo {{ '{' }}
						x: number; y: number; width: number; height: number; position: PortalPosition;
						{{ '}' }}
					</div>
					<p>Información de posición actual del portal.</p>
				</div>
			</div>

			<div class="api-section">
				<h2>Directivas</h2>

				<div class="api-section__method">
					<h3>PortalOutlet</h3>
					<div class="api-section__signature">&lt;div hubPortalOutlet [portalId]="string"&gt;&lt;/div&gt;</div>
					<p>Directiva que marca un elemento como outlet para portales.</p>

					<div class="api-section__params">
						<h4>Inputs</h4>
						<table>
							<thead>
								<tr>
									<th>Nombre</th>
									<th>Tipo</th>
									<th>Descripción</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><code>portalId</code></td>
									<td>string</td>
									<td>ID único del outlet para targeting específico</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</app-api-layout>
	`
})
export class PortalApiComponent {}
