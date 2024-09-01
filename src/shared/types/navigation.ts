import { type Icons } from '@/client/components/icons'

export interface Link {
	label: string
	href: string
	icon: keyof typeof Icons
}
