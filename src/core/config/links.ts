import { siteConfig } from '@/core/config/site'
import {
	Analytics,
	Chat,
	Courses,
	Dashboard,
	Instructor,
	Learning,
	Logo,
	Profile,
	Reports,
	Settings
} from '@/core/lib/icons'
import { type Link } from '@/core/types/links'

export const site: Link = {
	label: siteConfig.title,
	href: '/dashboard',
	icon: Logo
}

export const home: Link[] = [
	{
		label: 'home',
		href: '/dashboard',
		icon: Dashboard,
		children: [
			{
				label: 'Dashboard',
				href: '/dashboard',
				icon: Dashboard
			},
			{
				label: 'Learning',
				href: '/courses',
				icon: Learning
			},
			{
				label: 'Chat',
				href: '/chat',
				icon: Chat
			},
			{
				label: 'Reports',
				href: '/reports',
				icon: Reports
			}
		]
	}
]

export const instructor: Link[] = [
	{
		label: 'Instructor',
		icon: Instructor,
		roles: ['INSTRUCTOR'],
		children: [
			{
				label: 'Courses',
				href: '/instructor/courses',
				icon: Courses
			},
			{
				label: 'Analytics',
				href: '/instructor/analytics',
				icon: Analytics
			},
			{
				label: 'Demo',
				href: '/instructor/demo',
				icon: Instructor
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
				icon: Profile
			},
			{
				label: 'Settings',
				href: '/settings',
				icon: Settings
			}
		]
	}
]
