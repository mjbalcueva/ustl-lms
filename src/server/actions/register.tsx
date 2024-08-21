'use server'

import { hash } from 'bcryptjs'

import { generateVerificationToken } from '@/shared/data/tokens'
import { getUserByEmail } from '@/shared/data/user'
import { registerSchema, type RegisterSchema } from '@/shared/schemas'

import { db } from '@/server/lib/db'
import { sendVerificationEmail } from '@/server/lib/mail'

export const register = async (values: RegisterSchema) => {
	const validatedFields = registerSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid Fields!' }
	const { name, email, password } = validatedFields.data

	if (!email.endsWith('@ust-legazpi.edu.ph')) return { error: 'Please use your UST Legazpi email address!' }

	const existingUser = await getUserByEmail(email)
	if (existingUser) return { error: 'User already exists!' }

	const hashedPassword = await hash(password, 10)

	await db.user.create({
		data: {
			name,
			email,
			password: hashedPassword
		}
	})

	const verificationToken = await generateVerificationToken(email)
	await sendVerificationEmail(verificationToken.email, verificationToken.token)

	return { success: 'Confirmation email sent.' }
}
