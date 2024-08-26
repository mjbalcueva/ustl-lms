'use server'

import { getUserByEmail } from '@/shared/data/user'
import { resetSchema, type ResetSchema } from '@/shared/schemas/reset'

import { sendPasswordResetEmail } from '@/server/lib/mail'
import { generatePasswordResetToken } from '@/server/lib/tokens'

export async function reset(values: ResetSchema) {
	const validatedFields = resetSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid email!' }
	const { email } = validatedFields.data

	const existingUser = await getUserByEmail(email)
	if (!existingUser) return { error: 'Email not found!' }

	const passwordResetToken = await generatePasswordResetToken(email)
	await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

	return { success: 'Password reset email sent!' }
}
