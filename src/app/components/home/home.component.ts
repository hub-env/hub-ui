import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [HubButtonComponent],
	template: `
		<div class="home-container">
			<!-- Header -->
			<div class="hero-section">
				<div class="hero-content">
					<h1 class="display-4 fw-bold text-primary mb-4">
						<span class="me-3">⚡</span>
						ng-hub-ui
					</h1>
					<p class="lead text-muted mb-4">
						Una familia completa de bibliotecas de componentes Angular modernas, diseñadas para acelerar el
						desarrollo de aplicaciones web empresariales.
					</p>
					<div class="hero-stats">
						<div class="stat-item">
							<span class="stat-number">{{ librariesCount }}</span>
							<span class="stat-label">Bibliotecas</span>
						</div>
						<div class="stat-item">
							<span class="stat-number">{{ componentsCount }}</span>
							<span class="stat-label">Componentes</span>
						</div>
						<div class="stat-item">
							<span class="stat-number">{{ examplesCount }}</span>
							<span class="stat-label">Ejemplos</span>
						</div>
					</div>
				</div>
				<div class="hero-visual">
					<div class="component-showcase">
						<div class="component-card board-card">
							<div class="card-header">📋 Board</div>
							<div class="mini-kanban">
								<div class="mini-column"></div>
								<div class="mini-column"></div>
								<div class="mini-column"></div>
							</div>
						</div>
						<div class="component-card avatar-card">
							<div class="card-header">👤 Avatar</div>
							<div class="mini-avatars">
								<div class="mini-avatar bg-primary"></div>
								<div class="mini-avatar bg-success"></div>
								<div class="mini-avatar bg-warning"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Features -->
			<div class="features-section">
				<div class="row">
					<div class="col-lg-4 mb-4">
						<div class="feature-card">
							<div class="feature-icon">🚀</div>
							<h3>Rápido y Moderno</h3>
							<p>
								Construido con Angular 21+ y las últimas características del framework. Standalone components,
								signals y control flow moderno.
							</p>
						</div>
					</div>
					<div class="col-lg-4 mb-4">
						<div class="feature-card">
							<div class="feature-icon">🎨</div>
							<h3>Totalmente Personalizable</h3>
							<p>
								Cada componente está diseñado para ser fácilmente personalizable con templates, estilos y
								configuraciones flexibles.
							</p>
						</div>
					</div>
					<div class="col-lg-4 mb-4">
						<div class="feature-card">
							<div class="feature-icon">📦</div>
							<h3>Modular</h3>
							<p>
								Importa solo lo que necesitas. Cada biblioteca es independiente y puede usarse por separado en
								tu proyecto.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Libraries Overview -->
			<div class="libraries-section">
				<h2 class="text-center mb-5">Bibliotecas Disponibles</h2>
				<div class="row">
					@for (library of libraries; track library.id) {
						<div class="col-lg-6 col-xl-4 mb-4">
							<div class="library-card" [class]="'library-' + library.status">
								<div class="library-header">
									<span class="library-icon">{{ library.icon }}</span>
									<div class="library-info">
										<h4>{{ library.name }}</h4>
										<span class="library-status status-{{ library.status }}">
											{{ getStatusLabel(library.status) }}
										</span>
									</div>
								</div>
								<p class="library-description">{{ library.description }}</p>
								<div class="library-features">
									@for (feature of library.features; track feature) {
										<span class="feature-tag">{{ feature }}</span>
									}
								</div>
								<div class="library-actions">
									@if (library.status === 'ready') {
										<button hubButton variant="outline" color="primary" size="sm" class="me-2">
											Ver Ejemplos
										</button>
										<button hubButton variant="outline" color="secondary" size="sm">Documentación</button>
									} @else {
										<button hubButton size="sm" class="btn-outline-muted" disabled>
											{{ library.status === 'development' ? 'En Desarrollo' : 'Planeado' }}
										</button>
									}
								</div>
							</div>
						</div>
					}
				</div>
			</div>

			<!-- Getting Started -->
			<div class="getting-started-section">
				<div class="row align-items-center">
					<div class="col-lg-8">
						<h2>Comenzar es Fácil</h2>
						<p class="lead">
							Instala las bibliotecas que necesites y comienza a construir aplicaciones increíbles.
						</p>
						<div class="installation-steps">
							<div class="step">
								<span class="step-number">1</span>
								<div class="step-content">
									<h5>Instalar</h5>
									<code>npm install @ng-hub-ui/[library]</code>
								</div>
							</div>
							<div class="step">
								<span class="step-number">2</span>
								<div class="step-content">
									<h5>Importar</h5>
									<code>import {{ '{' }} Component {{ '}' }} from '@ng-hub-ui/[library]'</code>
								</div>
							</div>
							<div class="step">
								<span class="step-number">3</span>
								<div class="step-content">
									<h5>Usar</h5>
									<code>&lt;hub-component&gt;&lt;/hub-component&gt;</code>
								</div>
							</div>
						</div>
					</div>
					<div class="col-lg-4">
						<div class="quick-links">
							<h4>Enlaces Rápidos</h4>
							<a href="#" class="quick-link">📖 Guía de Inicio</a>
							<a href="#" class="quick-link">🎯 Ver Ejemplos</a>
							<a href="#" class="quick-link">🔧 Referencia API</a>
							<a href="#" class="quick-link">💡 Mejores Prácticas</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.home-container {
				max-width: 1200px;
				margin: 0 auto;
			}

			.hero-section {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 3rem;
				align-items: center;
				padding: 3rem 0;
				min-height: 60vh;
			}

			@media (max-width: 768px) {
				.hero-section {
					grid-template-columns: 1fr;
					text-align: center;
				}
			}

			.hero-stats {
				display: flex;
				gap: 2rem;
				margin-top: 2rem;
			}

			.stat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.stat-number {
				font-size: 2rem;
				font-weight: bold;
				color: #0d6efd;
			}

			.stat-label {
				font-size: 0.9rem;
				color: var(--hub-sys-text-muted, #6c757d);
				text-transform: uppercase;
				letter-spacing: 0.5px;
			}

			.hero-visual {
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.component-showcase {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 1rem;
				perspective: 1000px;
			}

			.component-card {
				background: white;
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 1rem;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				transform: rotateY(-5deg);
				transition: transform 0.3s ease;
			}

			.component-card:hover {
				transform: rotateY(0deg);
			}

			.component-card:nth-child(2) {
				transform: rotateY(5deg);
				margin-top: 2rem;
			}

			.component-card:nth-child(2):hover {
				transform: rotateY(0deg);
			}

			.card-header {
				font-weight: 600;
				font-size: 0.9rem;
				margin-bottom: 0.75rem;
				color: var(--hub-sys-text-secondary, #495057);
			}

			.mini-kanban {
				display: flex;
				gap: 0.25rem;
			}

			.mini-column {
				flex: 1;
				height: 60px;
				background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
				border-radius: 4px;
				position: relative;
			}

			.mini-column::before {
				content: '';
				position: absolute;
				top: 4px;
				left: 4px;
				right: 4px;
				height: 12px;
				background: #0d6efd;
				border-radius: 2px;
				opacity: 0.8;
			}

			.mini-avatars {
				display: flex;
				gap: 0.5rem;
				justify-content: center;
			}

			.mini-avatar {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 0.8rem;
				font-weight: 600;
			}

			.features-section {
				padding: 4rem 0;
				background: var(--hub-sys-surface-elevated, #f8f9fa);
				border-radius: 12px;
				margin: 3rem 0;
			}

			.feature-card {
				text-align: center;
				padding: 2rem 1rem;
			}

			.feature-icon {
				font-size: 3rem;
				margin-bottom: 1rem;
			}

			.feature-card h3 {
				margin-bottom: 1rem;
				color: var(--hub-sys-text-primary, #212529);
			}

			.libraries-section {
				padding: 4rem 0;
			}

			.library-card {
				background: white;
				border: 1px solid #e0e0e0;
				border-radius: 8px;
				padding: 1.5rem;
				height: 100%;
				transition: all 0.3s ease;
			}

			.library-card:hover {
				transform: translateY(-4px);
				box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
			}

			.library-card.library-development {
				border-left: 4px solid #ffc107;
			}

			.library-card.library-ready {
				border-left: 4px solid #198754;
			}

			.library-card.library-planned {
				border-left: 4px solid #6c757d;
			}

			.library-header {
				display: flex;
				align-items: flex-start;
				gap: 1rem;
				margin-bottom: 1rem;
			}

			.library-icon {
				font-size: 2rem;
			}

			.library-info h4 {
				margin: 0 0 0.25rem 0;
				color: var(--hub-sys-text-primary, #212529);
			}

			.library-status {
				font-size: 0.8rem;
				padding: 0.25rem 0.5rem;
				border-radius: 12px;
				text-transform: uppercase;
				font-weight: 600;
			}

			.status-ready {
				background: #d1e7dd;
				color: #0f5132;
			}
			.status-development {
				background: #fff3cd;
				color: #664d03;
			}
			.status-planned {
				background: #e2e3e5;
				color: #41464b;
			}

			.library-description {
				margin-bottom: 1rem;
				color: var(--hub-sys-text-muted, #6c757d);
				line-height: 1.5;
			}

			.library-features {
				display: flex;
				flex-wrap: wrap;
				gap: 0.5rem;
				margin-bottom: 1.5rem;
			}

			.feature-tag {
				background: var(--hub-sys-state-hover-bg, #e9ecef);
				color: var(--hub-sys-text-secondary, #495057);
				padding: 0.25rem 0.5rem;
				border-radius: 4px;
				font-size: 0.8rem;
			}

			.library-actions {
				margin-top: auto;
			}

			.getting-started-section {
				padding: 4rem 0;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				color: white;
				border-radius: 12px;
				margin: 3rem 0;
			}

			.installation-steps {
				margin-top: 2rem;
			}

			.step {
				display: flex;
				align-items: center;
				gap: 1rem;
				margin-bottom: 1.5rem;
			}

			.step-number {
				background: rgba(255, 255, 255, 0.2);
				color: white;
				width: 32px;
				height: 32px;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 600;
				flex-shrink: 0;
			}

			.step-content h5 {
				margin: 0 0 0.25rem 0;
				color: white;
			}

			.step-content code {
				background: rgba(0, 0, 0, 0.3);
				color: #e9ecef;
				padding: 0.5rem;
				border-radius: 4px;
				font-size: 0.9rem;
			}

			.quick-links {
				background: rgba(255, 255, 255, 0.1);
				padding: 2rem;
				border-radius: 8px;
			}

			.quick-links h4 {
				margin-bottom: 1rem;
				color: white;
			}

			.quick-link {
				display: block;
				color: rgba(255, 255, 255, 0.9);
				text-decoration: none;
				padding: 0.5rem 0;
				border-bottom: 1px solid rgba(255, 255, 255, 0.2);
				transition: color 0.3s ease;
			}

			.quick-link:hover {
				color: white;
			}

			.quick-link:last-child {
				border-bottom: none;
			}
		`
	]
})
export class HomeComponent {
	librariesCount = 12;
	componentsCount = 50;
	examplesCount = 24;

	libraries = [
		{
			id: 'board',
			name: 'Board',
			icon: '📋',
			description: 'Componentes de tablero Kanban con drag & drop, templates personalizados y scroll infinito.',
			features: ['Drag & Drop', 'Templates', 'Infinite Scroll', 'Responsive'],
			status: 'ready'
		},
		{
			id: 'avatar',
			name: 'Avatar',
			icon: '👤',
			description: 'Sistema de avatares con múltiples fuentes, fallbacks automáticos y personalización completa.',
			features: ['Multi-source', 'Fallbacks', 'Custom Colors', 'Lazy Loading'],
			status: 'ready'
		},
		{
			id: 'modal',
			name: 'Modal',
			icon: '🪟',
			description: 'Sistema de modales programático con stack management y configuración flexible.',
			features: ['Programmatic', 'Stacking', 'Templates', 'Backdrop Control'],
			status: 'development'
		},
		{
			id: 'stepper',
			name: 'Stepper',
			icon: '👣',
			description: 'Componentes de pasos con validación, navegación personalizada y temas.',
			features: ['Validation', 'Custom Nav', 'Theming', 'Events'],
			status: 'development'
		},
		{
			id: 'table',
			name: 'Table',
			icon: '📊',
			description: 'Tablas avanzadas con paginación, filtros, ordenamiento y templates responsivos.',
			features: ['Pagination', 'Sorting', 'Filtering', 'Responsive'],
			status: 'development'
		},
		{
			id: 'breadcrumbs',
			name: 'Breadcrumbs',
			icon: '🧭',
			description: 'Navegación de migas de pan con integración de router y templates personalizados.',
			features: ['Router Integration', 'Templates', 'Dynamic', 'Responsive'],
			status: 'planned'
		},
		{
			id: 'portal',
			name: 'Portal',
			icon: '🌀',
			description: 'Sistema de portales para overlay content con posicionamiento y gestión avanzada.',
			features: ['Positioning', 'Stacking', 'Backdrop', 'Events'],
			status: 'planned'
		},
		{
			id: 'action-sheet',
			name: 'Action Sheet',
			icon: '⚡',
			description: 'Hojas de acción para móviles con animaciones y gestos intuitivos.',
			features: ['Mobile First', 'Gestures', 'Animations', 'Responsive'],
			status: 'planned'
		},
		{
			id: 'utils',
			name: 'Utils',
			icon: '🛠️',
			description: 'Utilidades compartidas: focus trap, popup positioning, transitions y helpers.',
			features: ['Focus Trap', 'Positioning', 'Transitions', 'Helpers'],
			status: 'development'
		}
	];

	getStatusLabel(status: string): string {
		const labels: { [key: string]: string } = {
			ready: 'Listo',
			development: 'En Desarrollo',
			planned: 'Planeado'
		};
		return labels[status] || status;
	}
}
