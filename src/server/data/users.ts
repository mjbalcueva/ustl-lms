import { catchError } from '@/core/lib/utils/catch-error'

import { db } from '@/server/db'

export async function getUserByEmail(email: string) {
	const [data, error] = await catchError(
		db.user.findUnique({
			where: { email }
		})
	)

	if (error) return error

	return data
}

export async function getUserById(id: string) {
	const [data, error] = await catchError(
		db.user.findUnique({
			where: { id }
		})
	)

	if (error) return error

	return data
}

export async function getUserByIdWithAccountsAndProfile(id: string) {
	const [data, error] = await catchError(
		db.user.findUnique({
			where: { id },
			include: { accounts: true, profile: true }
		})
	)

	if (error) return error

	return data
}
