import { z } from 'zod'

export const editBioSchema = z.object({
	bio: z.string().max(500, 'Bio must be less than 500 characters').nullable()
})

export type EditBioSchema = z.infer<typeof editBioSchema>
