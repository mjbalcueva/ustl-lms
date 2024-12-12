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
	Settings,
	Users
} from '@/core/lib/icons'
import { type Link } from '@/core/types/links'

export const site: Link = {
	label: siteConfig.title,
	href: '/courses',
	icon: Logo
}

export const home: Link[] = [
	{
		label: 'Home',
		href: '/courses',
		icon: Dashboard,
		children: [
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
		roles: ['DEAN', 'PROGRAM_CHAIR', 'INSTRUCTOR'],
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
			}
		]
	}
]

export const roleManagement: Link[] = [
	{
		label: 'Role Management',
		icon: Users,
		roles: ['REGISTRAR', 'DEAN', 'PROGRAM_CHAIR'],
		children: [
			{
				label: 'Manage Users',
				href: '/role-management/',
				icon: Users
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
