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
	nav: [
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
			label: 'Reports',
			href: '/reports',
			icon: 'reports'
		},
		{
			label: 'Chat',
			href: '/chat',
			icon: 'chat'
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
