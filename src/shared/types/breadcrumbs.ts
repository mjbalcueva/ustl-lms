import { type Icons } from '@/client/components/icons'

export type Breadcrumb = {
	label?: string
	href?: string
	icon?: keyof typeof Icons
}[]
