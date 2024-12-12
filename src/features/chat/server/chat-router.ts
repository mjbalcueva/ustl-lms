import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const chatRouter = createTRPCRouter({
	getAllChats: protectedProcedure.query(async ({ ctx }) => {
		// Fetch direct conversations with latest message
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
			}
		})

		// Fetch group chats with latest message
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
			}
		})

		// Transform and combine both types of chats
		const directChats = directConversations.map((conv) => ({
			id: conv.chatConversationId,
			type: 'direct' as const,
			updatedAt: conv.messages[0]?.createdAt ?? conv.updatedAt,
			lastMessage: conv.messages[0],
			conversation: conv
		}))

		const groupChatsList = groupChats.map((chat) => ({
			id: chat.chatRoomId,
			type: 'group' as const,
			updatedAt: chat.messages[0]?.createdAt ?? chat.updatedAt,
			lastMessage: chat.messages[0],
			chat
		}))

		// Combine and sort by latest message/update
		const chats = [...directChats, ...groupChatsList].sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
		)

		return { chats }
	})
})
