import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DocumentationLayoutComponent } from '../../../components/layouts/documentation-layout.component';

@Component({
	selector: 'app-avatar-docs',
	standalone: true,
	imports: [DocumentationLayoutComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-documentation-layout
			title="Avatar"
			description="Componente para mostrar imágenes de perfil de usuario con sistema de fallbacks automático."
		>
			<h2>Instalación</h2>
			<pre><code>npm install @ng-hub-ui/avatar</code></pre>

			<h2>Importación</h2>
			<pre><code>import &lbrace; AvatarModule &rbrace; from '@ng-hub-ui/avatar';</code></pre>

			<h2>Uso Básico</h2>
			<p>El componente Avatar muestra imágenes de perfil con sistema de fallbacks inteligente.</p>

			<pre><code>&lt;hub-avatar 
  src="https://example.com/user.jpg"
  alt="Usuario"
  name="Juan Pérez"&gt;
&lt;/hub-avatar&gt;</code></pre>

			<h2>Sistema de Fallbacks</h2>
			<p>El Avatar implementa un sistema de fallbacks automático:</p>
			<ol>
				<li><strong>Imagen principal</strong>: Se intenta cargar la imagen especificada en <code>src</code></li>
				<li><strong>Imagen de respaldo</strong>: Si falla, se intenta cargar <code>fallbackSrc</code></li>
				<li><strong>Iniciales</strong>: Si ambas fallan, se muestran las iniciales del nombre</li>
				<li><strong>Ícono genérico</strong>: Como último recurso se muestra un ícono de usuario</li>
			</ol>

			<h2>Tamaños Disponibles</h2>
			<ul>
				<li><code>xs</code> - 24px</li>
				<li><code>sm</code> - 32px</li>
				<li><code>md</code> - 40px (por defecto)</li>
				<li><code>lg</code> - 56px</li>
				<li><code>xl</code> - 72px</li>
				<li><code>xxl</code> - 96px</li>
			</ul>

			<h2>Características</h2>
			<ul>
				<li>Sistema de fallbacks automático e inteligente</li>
				<li>Múltiples tamaños predefinidos</li>
				<li>Diferentes formas geométricas</li>
				<li>Generación automática de iniciales</li>
				<li>Colores de fondo aleatorios para iniciales</li>
				<li>Indicadores de estado opcionales</li>
				<li>Soporte para grupos de avatares</li>
				<li>Completamente personalizable</li>
			</ul>
		</app-documentation-layout>
	`
})
export class AvatarDocsComponent {}
