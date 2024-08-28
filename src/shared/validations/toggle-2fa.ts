import { z } from 'zod'

export const toggle2FASchema = z.object({
	twoFactorEnabled: z.boolean()
})
