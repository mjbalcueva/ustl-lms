import { type UserRole } from '@prisma/client'
import { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			role: UserRole
		} & DefaultSession['user']
	}
}
