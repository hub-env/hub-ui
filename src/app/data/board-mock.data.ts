import { Board, BoardCard } from '../../../projects/board/src/public-api';
import { TaskData } from './board-mock.model';

export type { TaskData } from './board-mock.model';

export const MOCK_CARDS: BoardCard<TaskData>[] = [
	{
		id: 1,
		title: 'Implementar autenticación',
		description: 'Crear sistema de login y registro de usuarios',
		data: {
			assignee: 'Ana García',
			priority: 'high',
			tags: ['backend', 'security'],
			dueDate: new Date('2024-12-15')
		}
	},
	{
		id: 2,
		title: 'Diseñar dashboard',
		description: 'Crear mockups del panel principal',
		data: {
			assignee: 'Carlos Ruiz',
			priority: 'medium',
			tags: ['ui', 'design'],
			dueDate: new Date('2024-12-10')
		}
	},
	{
		id: 3,
		title: 'Configurar CI/CD',
		description: 'Implementar pipeline de despliegue automático',
		data: {
			assignee: 'Laura Martín',
			priority: 'high',
			tags: ['devops', 'automation']
		}
	},
	{
		id: 4,
		title: 'Escribir documentación',
		description: 'Documentar API y guías de usuario',
		data: {
			assignee: 'David López',
			priority: 'low',
			tags: ['docs'],
			dueDate: new Date('2024-12-20')
		}
	},
	{
		id: 5,
		title: 'Testing unitario',
		description: 'Crear tests para componentes principales',
		data: {
			assignee: 'María Sánchez',
			priority: 'medium',
			tags: ['testing', 'quality']
		}
	},
	{
		id: 6,
		title: 'Optimizar rendimiento',
		description: 'Mejorar tiempos de carga de la aplicación',
		data: {
			assignee: 'Pedro Jiménez',
			priority: 'medium',
			tags: ['performance', 'optimization']
		}
	},
	{
		id: 7,
		title: 'Implementar notificaciones',
		description: 'Sistema de notificaciones push y email',
		data: {
			assignee: 'Elena Vega',
			priority: 'low',
			tags: ['feature', 'notifications']
		}
	},
	{
		id: 8,
		title: 'Integrar pagos',
		description: 'Conectar con pasarela de pagos',
		data: {
			assignee: 'Roberto Castro',
			priority: 'high',
			tags: ['integration', 'payments'],
			dueDate: new Date('2024-12-18')
		}
	}
];

export const MOCK_BOARD: Board<TaskData> = {
	id: 1,
	title: 'Desarrollo de Aplicación Web',
	description: 'Tablero principal para el desarrollo del proyecto',
	columns: [
		{
			id: 1,
			boardId: 1,
			title: 'Por Hacer',
			description: 'Tareas pendientes de iniciar',
			style: { backgroundColor: '#e3f2fd' },
			cards: [
				MOCK_CARDS[0], // Implementar autenticación
				MOCK_CARDS[3], // Escribir documentación
				MOCK_CARDS[6] // Implementar notificaciones
			]
		},
		{
			id: 2,
			boardId: 1,
			title: 'En Progreso',
			description: 'Tareas actualmente en desarrollo',
			style: { backgroundColor: '#fff3e0' },
			cards: [
				MOCK_CARDS[1], // Diseñar dashboard
				MOCK_CARDS[2], // Configurar CI/CD
				MOCK_CARDS[4] // Testing unitario
			]
		},
		{
			id: 3,
			boardId: 1,
			title: 'En Revisión',
			description: 'Tareas esperando revisión',
			style: { backgroundColor: '#f3e5f5' },
			cards: [
				MOCK_CARDS[5] // Optimizar rendimiento
			]
		},
		{
			id: 4,
			boardId: 1,
			title: 'Completado',
			description: 'Tareas finalizadas',
			style: { backgroundColor: '#e8f5e8' },
			cards: [
				MOCK_CARDS[7] // Integrar pagos
			]
		}
	]
};

export const MOCK_SIMPLE_BOARD: Board<TaskData> = {
	id: 2,
	title: 'Tablero Básico',
	description: 'Ejemplo simple de tablero',
	columns: [
		{
			id: 5,
			boardId: 2,
			title: 'Tareas',
			cards: [
				{
					id: 9,
					columnId: 5,
					title: 'Tarea Simple 1',
					data: {
						priority: 'medium',
						tags: ['ejemplo']
					}
				},
				{
					id: 10,
					columnId: 5,
					title: 'Tarea Simple 2',
					data: {
						priority: 'low',
						tags: ['demo']
					}
				}
			]
		},
		{
			id: 6,
			boardId: 2,
			title: 'Completadas',
			cards: [
				{
					id: 11,
					columnId: 6,
					title: 'Tarea Completada',
					data: {
						priority: 'high',
						tags: ['finalizada']
					}
				}
			]
		}
	]
};

export const MOCK_EMPTY_BOARD: Board<TaskData> = {
	id: 3,
	title: 'Tablero Vacío',
	description: 'Tablero sin tareas para demostrar estado vacío',
	columns: [
		{
			id: 7,
			boardId: 3,
			title: 'Columna Vacía',
			cards: []
		}
	]
};
