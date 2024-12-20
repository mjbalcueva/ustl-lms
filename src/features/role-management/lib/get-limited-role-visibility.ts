import { type Role } from '@prisma/client'

export function getLimitedRoleVisibility(role: Role): Role[] {
	switch (role) {
		case 'REGISTRAR':
			return ['DEAN']
		case 'DEAN':
			return ['PROGRAM_CHAIR']
		case 'PROGRAM_CHAIR':
			return ['INSTRUCTOR']
		case 'INSTRUCTOR':
			return ['STUDENT']
		default:
			return []
	}
}
