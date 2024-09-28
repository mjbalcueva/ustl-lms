import { type UserRole } from '@prisma/client'

import { type Icons } from '@/client/components/icons'

export type Link = {
	label: string
	href?: string
	icon?: keyof typeof Icons
	roles?: UserRole[]
	children?: Link[]
}
