import { type UserRole } from '@prisma/client'
import { type DefaultSession } from 'next-auth'
import { type DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: {
			role: UserRole
			isTwoFactorEnabled: boolean
			isOAuth: boolean
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		role: UserRole
		isTwoFactorEnabled: boolean
		isOAuth: boolean
	}
}
