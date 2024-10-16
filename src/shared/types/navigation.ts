import { type Role } from '@prisma/client'

import { type Icons } from '@/client/components/ui/icons'

export type Link = {
	label: string
	href?: string
	icon?: keyof typeof Icons
	roles?: Role[]
	children?: Link[]
}
