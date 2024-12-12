import { type Role } from '@prisma/client'

import { Badge } from '@/core/components/ui/badge'
import { capitalize } from '@/core/lib/utils/capitalize'

export const RoleBadge = ({
	role,
	size = 'default'
}: {
	role: Role
	size?: 'xs' | 'default'
}) => {
	const className = size === 'xs' ? 'text-xs' : 'text-center'

	switch (role) {
		case 'REGISTRAR':
			return <Badge className={className}>Registrar</Badge>
		case 'DEAN':
			return <Badge className={className}>Dean</Badge>
		case 'PROGRAM_CHAIR':
			return <Badge className={className}>Program Chair</Badge>
		case 'INSTRUCTOR':
			return (
				<Badge variant="secondary" className={className}>
					Instructor
				</Badge>
			)
		case 'STUDENT':
			return (
				<Badge variant="outline" className={className}>
					Student
				</Badge>
			)
		default:
			return (
				<Badge variant="outline" className={className}>
					{capitalize(role)}
				</Badge>
			)
	}
}
