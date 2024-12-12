import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const chatRouter = createTRPCRouter({
	getAllChats: protectedProcedure.query(async ({ ctx }) => {
		// Fetch direct conversations
		const directConversations = await ctx.db.chatConversation.findMany({
			where: {
				OR: [
					{ memberOneId: ctx.session.user.id },
					{ memberTwoId: ctx.session.user.id }
				]
			},
			include: {
				memberOne: {
					include: {
						profile: true
					}
				},
				memberTwo: {
					include: {
						profile: true
					}
				},
				messages: {
					orderBy: {
						createdAt: 'desc'
					},
					take: 1
				}
			},
			orderBy: {
				updatedAt: 'desc'
			}
		})

		// Fetch group chats
		const groupChats = await ctx.db.chatRoom.findMany({
			where: {
				members: {
					some: {
						userId: ctx.session.user.id
					}
				}
			},
			include: {
				messages: {
					orderBy: { createdAt: 'desc' },
					take: 1,
					include: {
						sender: {
							include: {
								user: {
									include: { profile: true }
								}
							}
						}
					}
				},
				members: {
					include: {
						user: {
							include: { profile: true }
						}
					}
				},
				creator: {
					include: { profile: true }
				}
			},
			orderBy: { updatedAt: 'desc' }
		})

		return {
			directConversations,
			groupChats
		}
	})
})
