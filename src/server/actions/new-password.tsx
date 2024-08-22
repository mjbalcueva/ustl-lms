'use server'

import { hash } from 'bcryptjs'

import { getPasswordResetTokenByToken } from '@/shared/data/password-reset-token'
import { getUserByEmail } from '@/shared/data/user'
import { newPasswordSchema, type NewPasswordSchema } from '@/shared/schemas/new-password'

import { db } from '@/server/lib/db'

export async function newPassword(values: NewPasswordSchema, token: string) {
	if (!token) return { error: 'Missing token!' }

	const validatedFields = newPasswordSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid fields!' }
	const { password } = validatedFields.data

	const existingToken = await getPasswordResetTokenByToken(token)
	if (!existingToken) return { error: 'Invalid token' }

	const tokenHasExpired = new Date(existingToken.expires) < new Date()
	if (tokenHasExpired) return { error: 'Token has expired!' }

	const existingUser = await getUserByEmail(existingToken.email)
	if (!existingUser) return { error: 'Email does not exists!' }

	const hashedPassoword = await hash(password, 10)

	await db.user.update({
		where: { id: existingUser.id },
		data: { password: hashedPassoword }
	})

	await db.passwordResetToken.delete({
		where: { id: existingToken.id }
	})

	return { success: 'Password updated!' }
}
