import { ChatRoomType } from '@prisma/client'
import { TRPCError } from '@trpc/server'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

import {
	getConversationMessagesSchema,
	markChatAsReadSchema,
	sendMessageSchema
} from '@/features/chat/validations/chat-schema'

export const chatRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

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
					include: { profile: true }
				},
				memberTwo: {
					include: { profile: true }
				},
				messages: {
					orderBy: { createdAt: 'desc' },
					take: 1,
					include: {
						sender: {
							include: { profile: true }
						},
						readBy: {
							select: { userId: true }
						}
					}
				}
			}
		})

		// Transform direct chats
		const directChats = directConversations.map((conv) => {
			const memberOne = conv.memberOne
			const otherUser =
				memberOne.id === ctx.session.user.id ? conv.memberTwo : memberOne

			const lastMessage = conv.messages[0] ?? null
			const isCurrentUserSender = lastMessage?.senderId === ctx.session.user.id

			return {
				id: conv.chatConversationId,
				type: 'direct' as const,
				title: otherUser.profile?.name ?? 'Unknown User',
				image: otherUser.profile?.imageUrl ?? null,
				lastMessage: lastMessage?.content ?? null,
				lastMessageSender: isCurrentUserSender
					? 'You'
					: (otherUser.profile?.name ?? 'Unknown User'),
				lastActiveAt: lastMessage?.createdAt ?? conv.updatedAt,
				isRead: Boolean(
					isCurrentUserSender || (lastMessage?.readBy?.length ?? 0) > 0
				)
			}
		})

		// Fetch group chats with latest message
		const groupChats = await ctx.db.chatRoom.findMany({
			where: {
				OR: [
					{
						members: {
							some: { userId: ctx.session.user.id }
						}
					},
					{
						course: { instructorId: ctx.session.user.id }
					}
				],
				type: ChatRoomType.TEXT
			},
			include: {
				course: true,
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
						},
						readBy: {
							where: {
								userId: ctx.session.user.id
							}
						}
					}
				},
				creator: {
					include: { profile: true }
				}
			}
		})

		// Transform group chats
		const groupChatsList = groupChats.map((chat) => {
			const lastMessage = chat.messages[0] ?? null
			const isCurrentUserSender =
				lastMessage && lastMessage.sender
					? lastMessage.sender.userId === ctx.session.user.id
					: false

			return {
				id: chat.chatRoomId,
				type: 'group' as const,
				title: chat.name,
				image: chat.course?.imageUrl ?? chat.creator.profile?.imageUrl ?? null,
				lastMessage: lastMessage?.content ?? null,
				lastMessageSender: isCurrentUserSender
					? 'You'
					: (lastMessage?.sender?.user?.profile?.name ?? 'Unknown User'),
				lastActiveAt: lastMessage?.createdAt ?? chat.updatedAt,
				isRead: Boolean(
					isCurrentUserSender || (lastMessage?.readBy?.length ?? 0) > 0
				)
			}
		})

		// Combine and sort by latest message/update
		const chats = [...directChats, ...groupChatsList].sort(
			(a, b) => b.lastActiveAt.getTime() - a.lastActiveAt.getTime()
		)

		return { chats }
	}),

	getConversationMessages: protectedProcedure
		.input(getConversationMessagesSchema)
		.query(async ({ ctx, input }) => {
			if (input.type === 'direct') {
				const conversation = await ctx.db.chatConversation.findUnique({
					where: {
						chatConversationId: input.conversationId,
						OR: [
							{ memberOneId: ctx.session.user.id },
							{ memberTwoId: ctx.session.user.id }
						]
					},
					include: {
						memberOne: { include: { profile: true } },
						memberTwo: { include: { profile: true } },
						messages: {
							orderBy: { createdAt: 'asc' },
							include: {
								sender: { include: { profile: true } }
							}
						}
					}
				})

				if (!conversation) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Conversation not found'
					})
				}

				const otherUser =
					conversation.memberOne.id === ctx.session.user.id
						? conversation.memberTwo
						: conversation.memberOne

				return {
					id: conversation.chatConversationId,
					title: otherUser.profile?.name ?? 'Unknown User',
					image: otherUser.profile?.imageUrl,
					messages: conversation.messages.map((message) => ({
						id: message.chatDirectMessageId,
						content: message.content,
						senderId: message.senderId,
						senderName: message.sender.profile?.name ?? 'Unknown User',
						senderImage: message.sender.profile?.imageUrl,
						createdAt: message.createdAt
					}))
				}
			}

			const room = await ctx.db.chatRoom.findUnique({
				where: {
					chatRoomId: input.conversationId,
					OR: [
						{
							members: { some: { userId: ctx.session.user.id } }
						},
						{
							course: { instructorId: ctx.session.user.id }
						}
					]
				},
				include: {
					course: true,
					messages: {
						orderBy: { createdAt: 'asc' },
						include: {
							sender: {
								include: { user: { include: { profile: true } } }
							}
						}
					}
				}
			})

			if (!room) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Room not found'
				})
			}

			return {
				id: room.chatRoomId,
				title: room.name,
				image: room.course?.imageUrl ?? null,
				messages: room.messages.map((message) => ({
					id: message.chatMessageId,
					content: message.content,
					senderId: message.sender.userId,
					senderName: message.sender.user.profile?.name ?? 'Unknown User',
					senderImage: message.sender.user.profile?.imageUrl,
					createdAt: message.createdAt
				}))
			}
		}),

	sendMessage: protectedProcedure
		.input(sendMessageSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.type === 'direct') {
				const conversation = await ctx.db.chatConversation.findUnique({
					where: {
						chatConversationId: input.conversationId,
						OR: [
							{ memberOneId: ctx.session.user.id },
							{ memberTwoId: ctx.session.user.id }
						]
					},
					include: {
						memberOne: { include: { profile: true } },
						memberTwo: { include: { profile: true } }
					}
				})

				if (!conversation) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Conversation not found'
					})
				}

				await ctx.db.chatDirectMessage.create({
					data: {
						content: input.content,
						senderId: ctx.session.user.id,
						chatConversationId: input.conversationId
					},
					include: {
						sender: { include: { profile: true } }
					}
				})

				return { success: true }
			}

			const room = await ctx.db.chatRoom.findUnique({
				where: {
					chatRoomId: input.conversationId,
					OR: [
						{
							members: { some: { userId: ctx.session.user.id } }
						},
						{
							course: { instructorId: ctx.session.user.id }
						}
					]
				}
			})

			if (!room) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Room not found'
				})
			}

			const sender = await ctx.db.chatMember.findUnique({
				where: {
					userId_chatRoomId: {
						chatRoomId: input.conversationId,
						userId: ctx.session.user.id
					}
				}
			})

			if (!sender) {
				await ctx.db.chatMember.create({
					data: {
						chatRoomId: input.conversationId,
						userId: ctx.session.user.id
					}
				})
			}

			await ctx.db.chatMessage.create({
				data: {
					content: input.content,
					senderId:
						sender?.chatMemberId ??
						(
							await ctx.db.chatMember.findFirstOrThrow({
								where: {
									chatRoomId: input.conversationId,
									userId: ctx.session.user.id
								}
							})
						).chatMemberId,
					chatRoomId: input.conversationId
				},
				include: {
					sender: {
						include: {
							user: {
								include: {
									profile: true
								}
							}
						}
					}
				}
			})

			return { success: true }
		}),

	markChatAsRead: protectedProcedure
		.input(markChatAsReadSchema)
		.mutation(async ({ ctx, input }) => {
			const isDirectChat = input.type === 'direct'

			if (isDirectChat) {
				const chat = await ctx.db.chatConversation.findUnique({
					where: {
						chatConversationId: input.chatId,
						OR: [
							{ memberOneId: ctx.session.user.id },
							{ memberTwoId: ctx.session.user.id }
						]
					}
				})

				if (!chat) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Chat not found' })
				}

				const unreadMessages = await ctx.db.chatDirectMessage.findMany({
					where: {
						chatConversationId: input.chatId,
						NOT: { senderId: ctx.session.user.id },
						readBy: { none: { userId: ctx.session.user.id } }
					},
					select: { chatDirectMessageId: true }
				})

				await Promise.all(
					unreadMessages.map((msg) =>
						ctx.db.chatDirectMessageRead.create({
							data: {
								userId: ctx.session.user.id,
								messageId: msg.chatDirectMessageId
							}
						})
					)
				)
			} else {
				const chat = await ctx.db.chatRoom.findUnique({
					where: {
						chatRoomId: input.chatId,
						OR: [
							{ members: { some: { userId: ctx.session.user.id } } },
							{ course: { instructorId: ctx.session.user.id } }
						]
					}
				})

				if (!chat) {
					throw new TRPCError({ code: 'NOT_FOUND', message: 'Chat not found' })
				}

				const unreadMessages = await ctx.db.chatMessage.findMany({
					where: {
						chatRoomId: input.chatId,
						sender: { userId: { not: ctx.session.user.id } },
						readBy: { none: { userId: ctx.session.user.id } }
					},
					select: { chatMessageId: true }
				})

				await Promise.all(
					unreadMessages.map((msg) =>
						ctx.db.chatMessageRead.create({
							data: {
								userId: ctx.session.user.id,
								messageId: msg.chatMessageId
							}
						})
					)
				)
			}

			return { success: true }
		})
})
