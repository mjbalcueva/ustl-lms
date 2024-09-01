import { siteConfig } from '@/shared/config/site'
import { type Link } from '@/shared/types/navigation'

export const links: Record<string, Link[]> = {
	site: [
		{
			label: siteConfig.title,
			href: '/dashboard',
			icon: 'logo'
		}
	],
	home: [
		{
			label: 'Dashboard',
			href: '/dashboard',
			icon: 'dashboard'
		},
		{
			label: 'Learning',
			href: '/learning',
			icon: 'learning'
		},
		{
			label: 'Chat',
			href: '/chat',
			icon: 'chat'
		},
		{
			label: 'Reports',
			href: '/reports',
			icon: 'reports',
			role: ['STUDENT']
		}
	],
	instructor: [
		{
			label: 'My Courses',
			href: '/course',
			icon: 'course',
			role: ['INSTRUCTOR']
		},
		{
			label: 'Analytics',
			href: '/analytics',
			icon: 'analytics',
			role: ['INSTRUCTOR']
		}
	],
	account: [
		{
			label: 'Profile',
			href: '/profile',
			icon: 'profile'
		},
		{
			label: 'Settings',
			href: '/settings',
			icon: 'settings'
		}
	]
}
