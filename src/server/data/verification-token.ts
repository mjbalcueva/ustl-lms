import { catchError } from '@/core/lib/utils/catch-error'

import { db } from '@/server/db'

export const getVerificationTokenByEmail = async (email: string) => {
	const [data, error] = await catchError(
		db.verificationToken.findFirst({
			where: { email }
		})
	)

	if (error) return error

	return data
}

export const getVerificationTokenByToken = async (token: string) => {
	const [data, error] = await catchError(
		db.verificationToken.findUnique({
			where: { token }
		})
	)

	if (error) return error

	return data
}
