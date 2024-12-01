import { db } from '@/server/db'

import { catchError } from '@/core/lib/utils/catch-error'

export async function getTwoFactorConfirmationByUserId(userId: string) {
	const [data, error] = await catchError(
		db.twoFactorConfirmation.findUnique({
			where: { userId }
		})
	)

	if (error) return error

	return data
}
