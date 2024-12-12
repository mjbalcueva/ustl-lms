import { Role } from '@prisma/client'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------
//

export const editUserRoleSchema = z.object({
	userId: z.string().min(1, 'User ID is required'),
	newRole: z.nativeEnum(Role)
})

export type EditUserRoleInput = z.infer<typeof editUserRoleSchema>
