import { type Role } from '@prisma/client'

export function getRoleVisibility(role: Role): Role[] {
	switch (role) {
		case 'REGISTRAR':
			return ['DEAN', 'PROGRAM_CHAIR', 'INSTRUCTOR', 'STUDENT']
		case 'DEAN':
			return ['PROGRAM_CHAIR', 'INSTRUCTOR', 'STUDENT']
		case 'PROGRAM_CHAIR':
			return ['INSTRUCTOR', 'STUDENT']
		case 'INSTRUCTOR':
			return ['STUDENT']
		default:
			return []
	}
}
