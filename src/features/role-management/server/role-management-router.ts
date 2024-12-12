import { type Role } from '@prisma/client'

import {
	createTRPCRouter,
	instructorProcedure,
	protectedProcedure
} from '@/server/api/trpc'

import { editUserRoleSchema } from '@/features/role-management/validation/schema'

const ROLE_ORDER = {
	REGISTRAR: 1,
	DEAN: 2,
	PROGRAM_CHAIR: 3,
	INSTRUCTOR: 4,
	STUDENT: 5
} as const

function getRoleVisibility(role: Role): Role[] {
	switch (role) {
		case 'REGISTRAR':
			return ['DEAN', 'PROGRAM_CHAIR', 'INSTRUCTOR', 'STUDENT']
		case 'DEAN':
			return ['PROGRAM_CHAIR', 'INSTRUCTOR', 'STUDENT']
		case 'PROGRAM_CHAIR':
			return ['INSTRUCTOR', 'STUDENT']
		case 'INSTRUCTOR':
			return ['STUDENT']
		default:
			return []
	}
}

export const roleManagementRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	findManyUsers: instructorProcedure.query(async ({ ctx }) => {
		const currentUserId = ctx.session.user.id
		const currentUserRole = ctx.session.user.role

		const visibleRoles = getRoleVisibility(currentUserRole)

		const users = await ctx.db.user.findMany({
			select: {
				id: true,
				email: true,
				role: true,
				profile: { select: { name: true, imageUrl: true } }
			},
			where: {
				id: { not: currentUserId },
				role: { in: visibleRoles }
			}
		})

		return {
			users: users
				.map((user) => ({
					id: user.id,
					name: user.profile?.name,
					email: user.email,
					role: user.role,
					imageUrl: user.profile?.imageUrl
				}))
				.sort((a, b) => {
					// First sort by role order
					const roleOrderDiff =
						ROLE_ORDER[a.role as keyof typeof ROLE_ORDER] -
						ROLE_ORDER[b.role as keyof typeof ROLE_ORDER]

					// If roles are different, return role order difference
					if (roleOrderDiff !== 0) return roleOrderDiff
					// If roles are the same, sort by email
					return (a.email ?? '').localeCompare(b?.email ?? '')
				})
		}
	}),

	// ---------------------------------------------------------------------------
	// UPDATE
	// ---------------------------------------------------------------------------
	//

	editUserRole: protectedProcedure
		.input(editUserRoleSchema)
		.mutation(async ({ ctx, input }) => {
			const { userId, newRole } = input
			await ctx.db.user.update({
				where: { id: userId },
				data: { role: newRole }
			})

			return { message: 'User role updated successfully' }
		})
})
