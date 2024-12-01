import { db } from '@/server/db'

import { catchError } from '@/core/lib/utils/catch-error'

export async function getPasswordResetTokenByToken(token: string) {
	const [data, error] = await catchError(
		db.passwordResetToken.findUnique({
			where: { token }
		})
	)

	if (error) return error

	return data
}

export async function getPasswordResetTokenByEmail(email: string) {
	const [data, error] = await catchError(
		db.passwordResetToken.findFirst({
			where: { email }
		})
	)

	if (error) return error

	return data
}
