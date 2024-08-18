import { randomInt } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { getTwoFactorTokenByEmail } from '@/shared/data/two-factor-token'
import { getVerificationTokenByEmail } from '@/shared/data/verification-token'

import { db } from '@/server/lib/db'

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4()
	const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

	const existingToken = await getVerificationTokenByEmail(email)

	if (existingToken) {
		await db.verificationToken.delete({
			where: { id: existingToken.id }
		})
	}

	const verficationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expires
		}
	})

	return verficationToken
}

export const generateTwoFactorToken = async (email: string) => {
	const token = randomInt(100_000, 1_000_000).toString()
	const expires = new Date(new Date().getTime() + 5 * 60 * 1000) // 5min

	const existingToken = await getTwoFactorTokenByEmail(email)

	if (existingToken) {
		await db.twoFactorToken.delete({
			where: { id: existingToken.id }
		})
	}

	const twoFactorToken = await db.twoFactorToken.create({
		data: {
			email,
			token,
			expires
		}
	})

	return twoFactorToken
}
