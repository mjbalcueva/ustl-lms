import { db } from '@/server/db'

import { catchError } from '@/core/lib/utils/catch-error'

export async function getTwoFactorTokenByToken(token: string) {
	const [data, error] = await catchError(
		db.twoFactorToken.findUnique({
			where: { token }
		})
	)

	if (error) return error

	return data
}

export async function getTwoFactorTokenByEmail(email: string) {
	const [data, error] = await catchError(
		db.twoFactorToken.findFirst({
			where: { email }
		})
	)

	if (error) return error

	return data
}
