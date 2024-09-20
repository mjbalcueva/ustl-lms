import { z } from 'zod'

export const addPasswordSchema = z
	.object({
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})
export type AddPasswordSchema = z.infer<typeof addPasswordSchema>

export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		})
})
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export const registerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z
		.string()
		.email('Email is required')
		.refine((email) => email.endsWith('@ust-legazpi.edu.ph'), {
			message: 'Please use your UST Legazpi email address.'
		}),
	password: z.string().min(6, 'Mininum of 6 characters required')
})
export type RegisterSchema = z.infer<typeof registerSchema>

export const resetPasswordSchema = z.object({
	password: z.string().min(6, 'Mininum of 6 characters required'),
	token: z.string().optional()
})
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const toggle2FASchema = z.object({
	twoFactorEnabled: z.boolean()
})
