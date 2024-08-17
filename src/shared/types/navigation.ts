import { type Icons } from '@/client/components/icons'

export type NavLink = {
	label: string
	href: string
	icon: keyof typeof Icons
}
