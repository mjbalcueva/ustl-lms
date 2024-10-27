import { z } from 'zod'

export const editTwoFactorSchema = z.object({
	twoFactorEnabled: z.boolean()
})

export type EditTwoFactorSchema = z.infer<typeof editTwoFactorSchema>
