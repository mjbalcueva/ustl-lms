import { catchError } from '@/core/lib/utils/catch-error'

import { db } from '@/server/db'

export async function getTwoFactorConfirmationByUserId(userId: string) {
	const [data, error] = await catchError(
		db.twoFactorConfirmation.findUnique({
			where: { userId }
		})
	)

	if (error) return error

	return data
}
