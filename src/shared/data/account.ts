import { db } from '@/server/lib/db'

export async function getAccountByUserId(userId: string) {
	try {
		const account = await db.account.findFirst({
			where: { userId }
		})

		return account
	} catch {
		return null
	}
}
