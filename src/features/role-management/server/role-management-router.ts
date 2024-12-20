import {
	createTRPCRouter,
	instructorProcedure,
	protectedProcedure
} from '@/server/api/trpc'

import { getRoleVisibility } from '@/features/role-management/lib/get-role-visibility'
import { editUserRoleSchema } from '@/features/role-management/validation/role-management-schema'

const ROLE_ORDER = {
	REGISTRAR: 1,
	DEAN: 2,
	PROGRAM_CHAIR: 3,
	INSTRUCTOR: 4,
	STUDENT: 5
} as const

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
				profile: { 
					select: { 
						name: true, 
						imageUrl: true, 
						department: true 
					} 
				},
				promotionsReceived: {
					select: {
						promoter: {
							select: {
								profile: { select: { name: true } },
								email: true
							}
						},
						oldRole: true,
						newRole: true,
						createdAt: true
					},
					orderBy: { createdAt: 'desc' },
					take: 1
				}
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
					imageUrl: user.profile?.imageUrl,
					department: user.profile?.department,
					lastPromotion: user.promotionsReceived[0]
						? {
								promoterName:
									user.promotionsReceived[0].promoter.profile?.name ??
									user.promotionsReceived[0].promoter.email,
								oldRole: user.promotionsReceived[0].oldRole,
								newRole: user.promotionsReceived[0].newRole,
								date: user.promotionsReceived[0].createdAt
							}
						: null
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
			const { userId, newRole, department } = input

			// Get the user's current role before updating
			const user = await ctx.db.user.findUnique({
				where: { id: userId },
				select: { role: true, profile: true }
			})

			if (!user) {
				throw new Error('User not found')
			}

			const oldRole = user.role

			// Update user's role and department if provided
			await ctx.db.user.update({
				where: { id: userId },
				data: { 
					role: newRole,
					profile: department ? {
						upsert: {
							create: { department },
							update: { department }
						}
					} : undefined
				}
			})

			// Record the promotion
			await ctx.db.rolePromotion.create({
				data: {
					promotedUserId: userId,
					promoterUserId: ctx.session.user.id,
					oldRole,
					newRole
				}
			})

			return { message: 'User role updated successfully' }
		})
})
