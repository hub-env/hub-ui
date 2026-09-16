import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ApiLayoutComponent } from '../../../components/layouts/api-layout.component';

@Component({
	selector: 'app-modal-api',
	standalone: true,
	imports: [ApiLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-api-layout title="Modal" description="Referencia completa de la API del componente Modal y ModalService.">
			<div class="api-section">
				<h2>Componentes</h2>

				<div class="api-section__method">
					<h3>ModalComponent</h3>
					<div class="api-section__signature">
						&lt;hub-modal [(open)]="boolean" [config]="ModalConfig"&gt;...&lt;/hub-modal&gt;
					</div>
					<p>Componente modal declarativo con configuración flexible.</p>

					<div class="api-section__params">
						<h4>Propiedades</h4>
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
									<td><code>open</code></td>
									<td>boolean</td>
									<td>false</td>
									<td>Estado de apertura del modal</td>
								</tr>
								<tr>
									<td><code>title</code></td>
									<td>string</td>
									<td>''</td>
									<td>Título del modal</td>
								</tr>
								<tr>
									<td><code>position</code></td>
									<td>ModalPosition</td>
									<td>'center'</td>
									<td>Posición del modal en pantalla</td>
								</tr>
								<tr>
									<td><code>size</code></td>
									<td>ModalSize</td>
									<td>'md'</td>
									<td>Tamaño del modal</td>
								</tr>
								<tr>
									<td><code>dismissible</code></td>
									<td>boolean</td>
									<td>true</td>
									<td>Permite cerrar con ESC o click fuera</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="api-section">
				<h2>Tipos</h2>

				<div class="api-section__method">
					<h3>ModalPosition</h3>
					<div class="api-section__signature">
						type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'auto';
					</div>
				</div>

				<div class="api-section__method">
					<h3>ModalSize</h3>
					<div class="api-section__signature">type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';</div>
				</div>
			</div>
		</app-api-layout>
	`
})
export class ModalApiComponent {}
