import { AvatarSource, AvatarConfig } from '../../../projects/avatar/src/public_api';
import { MockUser } from './avatar-mock.model';

export type { MockUser } from './avatar-mock.model';

export const MOCK_USERS: MockUser[] = [
	{
		id: 1,
		name: 'Ana García López',
		email: 'ana.garcia@example.com',
		username: 'anagarcia',
		githubUsername: 'anagl',
		role: 'Frontend Developer',
		status: 'online'
	},
	{
		id: 2,
		name: 'Carlos Ruiz Martín',
		email: 'carlos.ruiz@example.com',
		username: 'carlosrm',
		githubUsername: 'carlosruiz',
		twitterUsername: 'carlosrm_dev',
		role: 'Backend Developer',
		status: 'busy'
	},
	{
		id: 3,
		name: 'Laura Martín Silva',
		email: 'laura.martin@example.com',
		username: 'lauramartin',
		facebookId: 'laura.martin.dev',
		role: 'DevOps Engineer',
		status: 'away'
	},
	{
		id: 4,
		name: 'David López Vega',
		email: 'david.lopez@example.com',
		username: 'davidlopez',
		githubUsername: 'davidlv',
		customImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
		role: 'UX/UI Designer',
		status: 'online'
	},
	{
		id: 5,
		name: 'María Sánchez Torres',
		email: 'maria.sanchez@example.com',
		username: 'mariasanchez',
		githubUsername: 'mariast',
		role: 'QA Engineer',
		status: 'offline'
	},
	{
		id: 6,
		name: 'Pedro Jiménez Ruiz',
		email: 'pedro.jimenez@example.com',
		username: 'pedrojimenez',
		twitterUsername: 'pedro_dev',
		role: 'Product Manager',
		status: 'online'
	},
	{
		id: 7,
		name: 'Elena Vega Castro',
		email: 'elena.vega@example.com',
		username: 'elenavega',
		githubUsername: 'elenavega',
		customImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
		role: 'Data Scientist',
		status: 'busy'
	},
	{
		id: 8,
		name: 'Roberto Castro Díaz',
		email: 'roberto.castro@example.com',
		username: 'robertocastro',
		githubUsername: 'robertocd',
		role: 'Tech Lead',
		status: 'online'
	}
];

export const AVATAR_SIZES = [
	{ name: 'Pequeño', value: 32 },
	{ name: 'Mediano', value: 48 },
	{ name: 'Grande', value: 64 },
	{ name: 'Extra Grande', value: 96 },
	{ name: 'Jumbo', value: 128 }
];

export const AVATAR_COLORS = [
	'#1f77b4',
	'#ff7f0e',
	'#2ca02c',
	'#d62728',
	'#9467bd',
	'#8c564b',
	'#e377c2',
	'#7f7f7f',
	'#bcbd22',
	'#17becf',
	'#aec7e8',
	'#ffbb78',
	'#98df8a',
	'#ff9896',
	'#c5b0d5'
];

export const SAMPLE_AVATAR_CONFIGS: { [key: string]: AvatarConfig } = {
	default: {
		colors: AVATAR_COLORS,
		sourcePriorityOrder: [AvatarSource.CUSTOM, AvatarSource.GITHUB, AvatarSource.GRAVATAR, AvatarSource.INITIALS]
	},
	socialFirst: {
		colors: AVATAR_COLORS,
		sourcePriorityOrder: [
			AvatarSource.FACEBOOK,
			AvatarSource.GITHUB,
			AvatarSource.GRAVATAR,
			AvatarSource.CUSTOM,
			AvatarSource.INITIALS
		]
	},
	initialsOnly: {
		colors: AVATAR_COLORS,
		sourcePriorityOrder: [AvatarSource.INITIALS]
	},
	githubFirst: {
		colors: ['#24292e', '#0366d6', '#28a745', '#ffd33d', '#f85149'],
		sourcePriorityOrder: [AvatarSource.GITHUB, AvatarSource.GRAVATAR, AvatarSource.INITIALS]
	}
};

export const AVATAR_EXAMPLES = {
	basic: MOCK_USERS.slice(0, 4),
	allSources: MOCK_USERS,
	sizes: MOCK_USERS.slice(0, 3),
	fallbacks: [
		// User with custom image (should work)
		MOCK_USERS[3],
		// User with only GitHub (might work)
		MOCK_USERS[0],
		// User with non-existent sources (should fallback to initials)
		{
			id: 99,
			name: 'Usuario Sin Fuentes',
			email: 'nofuentes@example.com',
			role: 'Test User',
			status: 'offline' as const
		}
	]
};
