import { z } from 'zod'

export const enrollmentSchema = z.object({
	token: z.string().min(1, 'Token is required')
})
export type EnrollmentSchema = z.infer<typeof enrollmentSchema>
