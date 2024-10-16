import { siteConfig } from '@/shared/config/site'
import { type Link } from '@/shared/types/navigation'

export const site: Link = {
	label: siteConfig.title,
	href: '/dashboard',
	icon: 'logo'
}

export const home: Link[] = [
	{
		label: 'home',
		href: '/dashboard',
		icon: 'dashboard',
		children: [
			{
				label: 'Dashboard',
				href: '/dashboard',
				icon: 'dashboard'
			},
			{
				label: 'Learning',
				href: '/courses',
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
				icon: 'reports'
			}
		]
	}
]

export const instructor: Link[] = [
	{
		label: 'Instructor',
		icon: 'instructor',
		roles: ['INSTRUCTOR'],
		children: [
			{
				label: 'Courses',
				href: '/courses/manage',
				icon: 'courses'
			},
			{
				label: 'Analytics',
				href: '/analytics',
				icon: 'analytics'
			}
		]
	}
]

export const account: Link[] = [
	{
		label: 'Account',
		href: '/account',
		children: [
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
]
