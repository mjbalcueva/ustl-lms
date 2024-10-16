import { type Icons } from '@/client/components/ui/icons'

export type Breadcrumb = {
	label?: string
	href?: string
	icon?: keyof typeof Icons
}[]
