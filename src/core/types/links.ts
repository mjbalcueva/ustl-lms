import { type Role } from '@prisma/client'
import { type IconType } from 'react-icons'

export type Link = {
	label: string
	href?: string
	icon?: IconType
	roles?: Role[]
	children?: Link[]
}
