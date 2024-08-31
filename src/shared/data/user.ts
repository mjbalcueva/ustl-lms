import { db } from '@/server/lib/db'

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.user.findUnique({ where: { email } })

		return user
	} catch {
		return null
	}
}

export const getUserById = async (id: string) => {
	try {
		const user = await db.user.findUnique({ where: { id } })

		return user
	} catch {
		return null
	}
}

export const getUserByIdWithAccountsAndProfile = async (id: string) => {
	try {
		const user = await db.user.findUnique({ where: { id }, include: { accounts: true, profile: true } })

		return user
	} catch {
		return null
	}
}
