import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AppI18nService } from '../../services/app-i18n.service';
import { AboutContent } from './about.model';

export type { AboutContent, TimelineItem, StackCategory, ContactLink } from './about.model';

// ──────────────────────────────────────────────
// Bilingual content
// ──────────────────────────────────────────────

const CONTENT: Record<'en' | 'es', AboutContent> = {
	es: {
		hero: {
			badge: 'Arquitecto Frontend · Angular · Design Systems · Open Source',
			name: 'Carlos Morcillo',
			tagline:
				'Diseño y construyo bibliotecas UI, design systems y herramientas frontend para Angular listas para producción.',
			scrollCta: 'Ver trayectoria'
		},
		story: {
			heading: 'Arquitectura frontend con foco en Angular',
			paragraphs: [
				'Soy Carlos Morcillo, desarrollador y arquitecto frontend especializado en Angular, TypeScript y diseño de bibliotecas de componentes reutilizables. Llevo más de 13 años construyendo producto digital, primero como perfil full stack y desde hace años centrado sobre todo en frontend architecture, component libraries y tooling para equipos de desarrollo.',
				'Mi trabajo suele moverse entre tres capas: experiencia de usuario, arquitectura mantenible y velocidad real de equipo. Me interesan especialmente los design systems, las librerías UI publicadas en NPM, la accesibilidad, la documentación técnica útil y las decisiones que hacen que un proyecto Angular siga siendo sostenible cuando crece.',
				'También trabajo en entornos donde Angular no es solo una SPA más, sino la base de herramientas internas, plataformas low-code, paneles de administración y productos con flujos complejos. Ahí es donde más valor aportan una librería de componentes sólida y una arquitectura frontend coherente.'
			],
			imgCaption: 'Foto de Carlos · Espacio reservado'
		},
		mission: {
			heading: 'Por qué existe Hub-UI',
			paragraphs: [
				'Hub-UI nació para resolver un problema repetido en muchos proyectos Angular: volver a construir los mismos componentes una y otra vez. Modal, tabla de datos, stepper, navegación, calendario. En lugar de seguir duplicando esfuerzo, decidí convertir esa experiencia en un ecosistema de librerías Angular reutilizables, independientes y publicadas en NPM.',
				'El objetivo no era solo empaquetar componentes visuales, sino crear una base útil para trabajo real: APIs claras, soporte para standalone, theming con variables CSS, accesibilidad, ejemplos funcionales y documentación que ayude tanto al desarrollador como al arquitecto frontend. Hub-UI es, en esencia, una colección de Angular UI libraries pensadas para equipos que mantienen producto de verdad.'
			],
			imgCaption: 'Hub-UI ecosystem · Espacio reservado',
			githubCta: 'Ver en GitHub'
		},
		timeline: {
			heading: 'El recorrido',
			ariaLabel: 'Trayectoria profesional',
			items: [
				{
					year: '2012',
					text: 'Primer commit serio. Máster en UCLM con primer premio al mejor proyecto. La hubris ya instalada.'
				},
				{
					year: '2012 – 2015',
					text: 'Consultoría Innova. ERP para bodegas vinícolas: vinificación, almacén, producción. El código también tiene terroir.'
				},
				{
					year: '2015 – 2022',
					text: 'Líder de frontend en Netberry. Equipos, intranet corporativa con Gantt y Trello, apps Ionic. El caos, pero con arquitectura.'
				},
				{
					year: '2020',
					text: 'Nace Hub-UI. El proyecto que nadie encargó pero que varias personas necesitaban.'
				},
				{
					year: '2022 – 2023',
					text: 'Arquitecto inicial de Appolow en Keapps / Bosonit. Redux, Angular Schematics, patrones que aguantan el paso del tiempo.'
				},
				{
					year: '2023 – Hoy',
					text: 'Tech Lead de Appolow en Grupo Bosonit. Low-code, librerías UI, TDD y reuniones que merecían haber sido un email.'
				}
			]
		},
		stack: {
			heading: 'Con qué trabajo',
			categories: [
				{
					label: 'Especialización',
					items: ['Angular', 'TypeScript', 'Angular Schematics', 'NgRx / Redux', 'RxJS', 'Signals']
				},
				{
					label: 'Arquitectura',
					items: ['Design Systems', 'Component Libraries', 'Monorepos', 'Low-Code Platforms']
				},
				{
					label: 'Backend (cuando toca)',
					items: ['Laravel', 'NestJS', 'Node.js', 'REST APIs']
				},
				{
					label: 'Testing',
					items: ['TDD / BDD', 'Vitest', 'Jasmine', 'Code Review']
				}
			]
		},
		contact: {
			heading: '¿Hablamos?',
			paragraph:
				'Si estás construyendo un producto Angular, un design system, una librería de componentes o una plataforma interna y necesitas apoyo en arquitectura frontend, documentación técnica o tooling, podemos hablar.',
			links: [
				{ label: 'Email', url: 'mailto:carlos.morcillo@me.com', icon: 'fa-solid fa-envelope' },
				{
					label: 'LinkedIn',
					url: 'https://linkedin.com/in/carlosmorcillofernandez',
					icon: 'fa-brands fa-linkedin'
				},
				{ label: 'GitHub', url: 'https://github.com/carlos-morcillo', icon: 'fa-brands fa-github' },
				{ label: 'Portfolio', url: 'https://www.carlosmorcillo.com', icon: 'fa-solid fa-globe' },
				{
					label: 'Servicios de consultoría',
					url: 'https://www.carlosmorcillo.com/servicios/',
					icon: 'fa-solid fa-handshake'
				}
			]
		}
	},

	en: {
		hero: {
			badge: 'Frontend Architect · Angular · Design Systems · Open Source',
			name: 'Carlos Morcillo',
			tagline:
				'I design and build UI libraries, design systems and frontend tooling for Angular teams shipping production software.',
			scrollCta: 'See the journey'
		},
		story: {
			heading: 'Frontend architecture with Angular at the core',
			paragraphs: [
				'I’m Carlos Morcillo, a frontend developer and architect focused on Angular, TypeScript and reusable component libraries. I’ve spent more than 13 years building digital products, starting from full stack work and gradually specializing in frontend architecture, UI systems and developer tooling.',
				'My work usually sits at the intersection of user experience, maintainable architecture and team velocity. I care about design systems, NPM component libraries, accessibility, useful technical documentation and the kind of frontend decisions that still make sense once an Angular codebase becomes large.',
				'I also work in environments where Angular powers more than a generic SPA: internal tools, low-code platforms, admin panels and products with complex workflows. That is where reusable UI libraries and solid frontend architecture have the biggest impact.'
			],
			imgCaption: "Carlos' photo · Placeholder"
		},
		mission: {
			heading: 'Why Hub-UI exists',
			paragraphs: [
				'Hub-UI started as a response to a recurring Angular problem: teams rebuilding the same UI components over and over again. Modal from scratch. Data table from scratch. Stepper from scratch. Instead of repeating that cost in every project, I turned the work into a reusable ecosystem of independent Angular libraries published on NPM.',
				'That goal was never just about shipping visual components. It was about building a practical foundation for real teams: clear APIs, standalone support, CSS-variable theming, accessibility, live examples and documentation that helps both developers and frontend architects make faster decisions. Hub-UI is basically a set of Angular UI libraries for production work.'
			],
			imgCaption: 'Hub-UI ecosystem · Placeholder',
			githubCta: 'View on GitHub'
		},
		timeline: {
			heading: 'The journey',
			ariaLabel: 'Career timeline',
			items: [
				{
					year: '2012',
					text: "First serious commit. Master's degree at UCLM, best project award. Hubris fully installed."
				},
				{
					year: '2012 – 2015',
					text: 'Innova Consultoría. ERP for wineries: vinification, warehouse, production. Code also has terroir.'
				},
				{
					year: '2015 – 2022',
					text: 'Frontend Lead at Netberry. Teams, corporate intranet with Gantt and Trello, Ionic apps. Chaos — but with architecture.'
				},
				{
					year: '2020',
					text: 'Hub-UI born. The project nobody ordered but several people needed.'
				},
				{
					year: '2022 – 2023',
					text: 'Initial architect of Appolow at Keapps / Bosonit. Redux, Angular Schematics, patterns that stand the test of time.'
				},
				{
					year: '2023 – Now',
					text: 'Tech Lead at Appolow / Grupo Bosonit. Low-code, UI libraries, TDD, and meetings that should have been emails.'
				}
			]
		},
		stack: {
			heading: 'What I work with',
			categories: [
				{
					label: 'Specialization',
					items: ['Angular', 'TypeScript', 'Angular Schematics', 'NgRx / Redux', 'RxJS', 'Signals']
				},
				{
					label: 'Architecture',
					items: ['Design Systems', 'Component Libraries', 'Monorepos', 'Low-Code Platforms']
				},
				{
					label: 'Backend (when needed)',
					items: ['Laravel', 'NestJS', 'Node.js', 'REST APIs']
				},
				{
					label: 'Testing',
					items: ['TDD / BDD', 'Vitest', 'Jasmine', 'Code Review']
				}
			]
		},
		contact: {
			heading: "Let's talk",
			paragraph:
				'If you are building an Angular product, a design system, a component library or an internal platform and need help with frontend architecture, technical documentation or developer tooling, let’s talk.',
			links: [
				{ label: 'Email', url: 'mailto:carlos.morcillo@me.com', icon: 'fa-solid fa-envelope' },
				{
					label: 'LinkedIn',
					url: 'https://linkedin.com/in/carlosmorcillofernandez',
					icon: 'fa-brands fa-linkedin'
				},
				{ label: 'GitHub', url: 'https://github.com/carlos-morcillo', icon: 'fa-brands fa-github' },
				{ label: 'Portfolio', url: 'https://www.carlosmorcillo.com', icon: 'fa-solid fa-globe' },
				{
					label: 'Consulting services',
					url: 'https://www.carlosmorcillo.com/en/services/',
					icon: 'fa-solid fa-handshake'
				}
			]
		}
	}
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

/**
 * About the author page.
 * Presents Carlos Morcillo's background, the Hub-UI origin story, career timeline,
 * tech stack, and contact information in a bilingual (ES / EN) layout.
 */
@Component({
	selector: 'app-about',
	standalone: true,
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './about.component.html',
	styleUrl: './about.component.scss'
})
export class AboutComponent {
	protected readonly i18n = inject(AppI18nService);

	/** Reactive content object driven by the active language. */
	protected readonly c = computed(() => CONTENT[this.i18n.lang() === 'es' ? 'es' : 'en']);
}
