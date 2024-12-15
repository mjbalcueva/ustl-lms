import { EventEmitter, on } from 'node:events'
import {
	GroupChatType,
	type DirectChatMessage,
	type GroupChatMessage,
	type Profile,
	type User
} from '@prisma/client'
import { TRPCClientError } from '@trpc/client'
import { tracked } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

type ChatMessageEvent = {
	id: string
	content: string
	senderId: string
	senderName: string | null
	senderImage: string | null
	createdAt: Date
	chatId: string
	type: 'direct' | 'group'
}

type DirectMessageWithSender = DirectChatMessage & {
	sender: User & {
		profile: Profile | null
	}
}

type GroupMessageWithSender = GroupChatMessage & {
	sender: {
		user: User & {
			profile: Profile | null
		}
	}
}

type Message = DirectMessageWithSender | GroupMessageWithSender

class MyEventEmitter extends EventEmitter {
	public toIterable<TEv extends keyof ChatEvents>(
		event: TEv,
		opts: Parameters<typeof on>[2]
	): AsyncIterable<Parameters<ChatEvents[TEv]>> {
		return on(this, event as string, opts) as AsyncIterable<
			Parameters<ChatEvents[TEv]>
		>
	}
}

// Event emitter for real-time updates
export const ee = new MyEventEmitter()

// Type for chat events
interface ChatEvents {
	onMessage: (chatId: string, message: ChatMessageEvent) => void
	isTyping: (chatId: string, who: Record<string, { lastTyped: Date }>) => void
}

// Who is currently typing in each chat
const currentlyTyping: Record<string, Record<string, { lastTyped: Date }>> = {}

// Clear old typing indicators every 3 seconds
setInterval(() => {
	const updatedChats = new Set<string>()
	const now = Date.now()

	for (const [chatId, typers] of Object.entries(currentlyTyping)) {
		for (const [userId, value] of Object.entries(typers)) {
			if (now - value.lastTyped.getTime() > 3000) {
				delete typers[userId]
				updatedChats.add(chatId)
			}
		}
	}

	updatedChats.forEach((chatId) => {
		ee.emit('isTyping', chatId, currentlyTyping[chatId] ?? {})
	})
}, 3000).unref()

export const chatRouter = createTRPCRouter({
	// ---------------------------------------------------------------------------
	// CREATE
	// ---------------------------------------------------------------------------
	//

	createDirectChat: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const currentUserId = ctx.session.user.id

			// Check if chat already exists
			const existingChat = await ctx.db.directChat.findFirst({
				where: {
					OR: [
						{
							memberOneId: currentUserId,
							memberTwoId: input.userId
						},
						{
							memberOneId: input.userId,
							memberTwoId: currentUserId
						}
					]
				}
			})

			if (existingChat) {
				return { chatId: existingChat.directChatId }
			}

			// Create new chat
			const chat = await ctx.db.directChat.create({
				data: {
					memberOneId: currentUserId,
					memberTwoId: input.userId
				}
			})

			return { chatId: chat.directChatId }
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	findManyConversations: protectedProcedure.query(async ({ ctx }) => {
		const userId = ctx.session.user.id

		// Find all direct chats
		const directChats = await ctx.db.directChat.findMany({
			where: {
				OR: [{ memberOneId: userId }, { memberTwoId: userId }]
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
						readBy: true,
						sender: {
							include: { profile: true }
						}
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		})

		// Find all group chats
		const groupChats = await ctx.db.groupChat.findMany({
			where: {
				AND: {
					members: {
						some: { userId }
					},
					type: GroupChatType.TEXT
				}
			},
			include: {
				course: {
					select: { imageUrl: true }
				},
				members: {
					include: {
						user: {
							include: { profile: true }
						}
					}
				},
				messages: {
					orderBy: { createdAt: 'desc' },
					take: 1,
					include: {
						readBy: true,
						sender: {
							include: {
								user: {
									include: { profile: true }
								}
							}
						}
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		})

		// Transform direct chats
		const transformedDirectChats = directChats.map((chat) => {
			const otherUser =
				chat.memberOne.id === userId ? chat.memberTwo : chat.memberOne
			const lastMessage = chat.messages[0]
			const isCurrentUserSender = lastMessage?.senderId === userId

			return {
				chatId: chat.directChatId,
				type: 'direct' as const,
				name: otherUser.profile?.name ?? 'Unknown User',
				image: otherUser.profile?.imageUrl ?? null,
				lastMessage: lastMessage
					? {
							content: lastMessage.content,
							createdAt: lastMessage.createdAt,
							isRead: lastMessage.readBy.some((read) => read.userId === userId),
							sender: isCurrentUserSender
								? 'You'
								: (lastMessage.sender.profile?.name ?? 'Unknown User')
						}
					: null,
				updatedAt: chat.updatedAt
			}
		})

		// Transform group chats
		const transformedGroupChats = groupChats.map((chat) => {
			const lastMessage = chat.messages[0]
			const isCurrentUserSender = lastMessage?.senderId === userId

			return {
				chatId: chat.groupChatId,
				type: 'group' as const,
				name: chat.name,
				image: chat.course?.imageUrl ?? null,
				lastMessage: lastMessage
					? {
							content: lastMessage.content,
							createdAt: lastMessage.createdAt,
							isRead: lastMessage.readBy.some((read) => read.userId === userId),
							sender: isCurrentUserSender
								? 'You'
								: (lastMessage.sender.user.profile?.name ?? 'Unknown User')
						}
					: null,
				updatedAt: chat.updatedAt
			}
		})

		// Combine and sort all chats by most recent activity
		const chats = [...transformedDirectChats, ...transformedGroupChats].sort(
			(a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
		)

		return { chats }
	}),

	// Add new SSE subscription for messages
	onMessage: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
				lastMessageId: z.string().nullish()
			})
		)
		.subscription(async function* ({ ctx, input }) {
			const abortController = new AbortController()

			const messageIterable = ee.toIterable<'onMessage'>('onMessage', {
				signal: abortController.signal
			})

			const { chatId, lastMessageId } = input

			// Get last message timestamp if lastMessageId provided
			let lastMessageTimestamp: Date | null = lastMessageId
				? ((
						(await ctx.db.directChatMessage.findFirst({
							where: { directChatMessageId: lastMessageId },
							select: { createdAt: true }
						})) ??
						(await ctx.db.groupChatMessage.findFirst({
							where: { groupChatMessageId: lastMessageId },
							select: { createdAt: true }
						}))
					)?.createdAt ?? null)
				: null

			// Fetch any messages since last seen
			const [directMessages, groupMessages] = await Promise.all([
				ctx.db.directChatMessage.findMany({
					where: {
						directChatId: chatId,
						createdAt: lastMessageTimestamp
							? { gt: lastMessageTimestamp }
							: undefined
					},
					orderBy: { createdAt: 'asc' },
					include: {
						sender: {
							include: { profile: true }
						}
					}
				}),
				ctx.db.groupChatMessage.findMany({
					where: {
						groupChatId: chatId,
						createdAt: lastMessageTimestamp
							? { gt: lastMessageTimestamp }
							: undefined
					},
					orderBy: { createdAt: 'asc' },
					include: {
						sender: {
							include: {
								user: {
									include: { profile: true }
								}
							}
						}
					}
				})
			])

			const newMessages: Message[] = [...directMessages, ...groupMessages]

			function* maybeYield(message: ChatMessageEvent) {
				if (message.chatId !== chatId) return
				if (lastMessageTimestamp && message.createdAt <= lastMessageTimestamp)
					return

				yield tracked(message.id, message)
				lastMessageTimestamp = message.createdAt
			}

			// Yield any messages we missed
			for (const message of newMessages) {
				const transformedMessage: ChatMessageEvent = {
					id:
						'directChatMessageId' in message
							? message.directChatMessageId
							: message.groupChatMessageId,
					content: message.content,
					senderId: message.senderId,
					senderName:
						'profile' in message.sender
							? (message.sender.profile?.name ?? null)
							: (message.sender.user.profile?.name ?? null),
					senderImage:
						'profile' in message.sender
							? (message.sender.profile?.imageUrl ?? null)
							: (message.sender.user.profile?.imageUrl ?? null),
					createdAt: message.createdAt,
					chatId:
						'directChatId' in message
							? message.directChatId
							: message.groupChatId,
					type: 'directChatId' in message ? 'direct' : 'group'
				}
				yield* maybeYield(transformedMessage)
			}

			// Yield new messages as they come in
			for await (const [, message] of messageIterable) {
				yield* maybeYield(message)
			}
		}),

	// Add typing indicator subscription
	whoIsTyping: protectedProcedure
		.input(z.object({ chatId: z.string() }))
		.subscription(async function* ({
			input: { chatId }
		}): AsyncGenerator<Record<string, { lastTyped: Date }>> {
			let lastTyping = ''

			function* maybeYield(who: Record<string, { lastTyped: Date }>) {
				const typingUsers = Object.keys(who).sort().toString()
				if (typingUsers === lastTyping) return
				yield who
				lastTyping = typingUsers
			}

			yield* maybeYield(currentlyTyping[chatId] ?? {})

			for await (const [typingChatId, who] of ee.toIterable('isTyping', {
				signal: new AbortController().signal
			})) {
				if (typingChatId === chatId) {
					yield* maybeYield(who)
				}
			}
		}),

	// Add isTyping mutation
	isTyping: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
				typing: z.boolean()
			})
		)
		.mutation(async (opts) => {
			const { chatId, typing } = opts.input
			const userId = opts.ctx.session.user.id

			if (!currentlyTyping[chatId]) {
				currentlyTyping[chatId] = {}
			}

			if (!typing) {
				delete currentlyTyping[chatId][userId]
			} else {
				currentlyTyping[chatId][userId] = {
					lastTyped: new Date()
				}
			}

			ee.emit('isTyping', chatId, currentlyTyping[chatId])
		}),

	// Modify sendMessage mutation
	sendMessage: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				type: z.enum(['direct', 'group']),
				content: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { conversationId, type, content } = input
			const userId = ctx.session.user.id

			if (type === 'direct') {
				const chat = await ctx.db.directChat.findFirst({
					where: {
						directChatId: conversationId,
						OR: [{ memberOneId: userId }, { memberTwoId: userId }]
					}
				})

				if (!chat) {
					throw new TRPCClientError('Chat not found or access denied')
				}

				const message = await ctx.db.directChatMessage.create({
					data: {
						content,
						directChatId: conversationId,
						senderId: userId
					},
					include: {
						sender: {
							include: { profile: true }
						}
					}
				})

				// Create or update read receipt for sender
				await ctx.db.directChatMessageReadReceipt.upsert({
					where: {
						messageId_userId: {
							messageId: message.directChatMessageId,
							userId
						}
					},
					create: {
						userId,
						messageId: message.directChatMessageId,
						readAt: new Date()
					},
					update: {
						readAt: new Date()
					}
				})

				// Emit the new message event
				const transformedMessage: ChatMessageEvent = {
					id: message.directChatMessageId,
					content: message.content,
					senderId: message.senderId,
					senderName: message.sender.profile?.name ?? null,
					senderImage: message.sender.profile?.imageUrl ?? null,
					createdAt: message.createdAt,
					chatId: message.directChatId,
					type: 'direct'
				}

				ee.emit('onMessage', conversationId, transformedMessage)

				return message
			}

			// Handle group chat messages
			const chat = await ctx.db.groupChat.findFirst({
				where: {
					groupChatId: conversationId,
					members: {
						some: { userId }
					}
				}
			})

			if (!chat) {
				throw new TRPCClientError('Chat not found or access denied')
			}

			// Get the member record for the sender
			const member = await ctx.db.groupChatMember.findUnique({
				where: {
					userId_groupChatId: {
						userId,
						groupChatId: conversationId
					}
				}
			})

			if (!member) {
				throw new TRPCClientError('You are not a member of this chat')
			}

			const message = await ctx.db.groupChatMessage.create({
				data: {
					content,
					groupChatId: conversationId,
					senderId: member.groupChatMemberId
				},
				include: {
					sender: {
						include: {
							user: {
								include: { profile: true }
							}
						}
					}
				}
			})

			// Create or update read receipt for sender
			await ctx.db.groupChatMessageReadReceipt.upsert({
				where: {
					messageId_userId: {
						messageId: message.groupChatMessageId,
						userId
					}
				},
				create: {
					userId,
					messageId: message.groupChatMessageId,
					readAt: new Date()
				},
				update: {
					readAt: new Date()
				}
			})

			// Emit the new message event
			const transformedMessage: ChatMessageEvent = {
				id: message.groupChatMessageId,
				content: message.content,
				senderId: message.sender.userId,
				senderName: message.sender.user.profile?.name ?? null,
				senderImage: message.sender.user.profile?.imageUrl ?? null,
				createdAt: message.createdAt,
				chatId: message.groupChatId,
				type: 'group'
			}

			ee.emit('onMessage', conversationId, transformedMessage)

			return message
		}),

	getConversationMessages: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				type: z.enum(['direct', 'group'])
			})
		)
		.query(async ({ ctx, input }) => {
			const messages = await (input.type === 'direct'
				? ctx.db.directChatMessage.findMany({
						where: { directChatId: input.conversationId },
						orderBy: { createdAt: 'desc' },
						include: {
							sender: { include: { profile: true } },
							readBy: {
								include: {
									user: { include: { profile: true } }
								}
							}
						}
					})
				: ctx.db.groupChatMessage.findMany({
						where: { groupChatId: input.conversationId },
						orderBy: { createdAt: 'desc' },
						include: {
							sender: { include: { user: { include: { profile: true } } } },
							readBy: {
								include: {
									user: { include: { profile: true } }
								}
							}
						}
					}))

			// Find the last read message for each user
			const lastReadMessageIds = new Set<string>()
			const userReadTimes = new Map<string, Date>()

			for (const message of messages) {
				for (const receipt of message.readBy) {
					const prevReadTime = userReadTimes.get(receipt.userId)
					if (!prevReadTime || receipt.readAt > prevReadTime) {
						userReadTimes.set(receipt.userId, receipt.readAt)
						lastReadMessageIds.add(
							'directChatMessageId' in message
								? message.directChatMessageId
								: message.groupChatMessageId
						)
					}
				}
			}

			// Transform messages with read receipt data
			const transformedMessages = messages.map((message) => ({
				...message,
				isLastReadByUser: lastReadMessageIds.has(
					'directChatMessageId' in message
						? message.directChatMessageId
						: message.groupChatMessageId
				)
			}))

			return { messages: transformedMessages }
		}),

	// Add this new procedure
	verifyChat: protectedProcedure
		.input(
			z.object({
				chatId: z.string(),
				type: z.enum(['direct', 'group'])
			})
		)
		.query(async ({ ctx, input }) => {
			const { chatId, type } = input
			const userId = ctx.session.user.id

			if (type === 'direct') {
				const chat = await ctx.db.directChat.findFirst({
					where: {
						directChatId: chatId,
						OR: [{ memberOneId: userId }, { memberTwoId: userId }]
					}
				})
				return !!chat
			}

			const chat = await ctx.db.groupChat.findFirst({
				where: {
					groupChatId: chatId,
					members: {
						some: { userId }
					}
				}
			})
			return !!chat
		}),

	getChatType: protectedProcedure
		.input(z.object({ chatId: z.string() }))
		.query(async ({ ctx, input }) => {
			const directChat = await ctx.db.directChat.findFirst({
				where: { directChatId: input.chatId }
			})

			if (directChat) return 'direct' as const

			const groupChat = await ctx.db.groupChat.findFirst({
				where: { groupChatId: input.chatId }
			})

			if (groupChat) return 'group' as const

			return null
		}),

	// Add procedure to mark messages as read
	markAsRead: protectedProcedure
		.input(
			z.object({
				conversationId: z.string(),
				type: z.enum(['direct', 'group'])
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { conversationId, type } = input
			const userId = ctx.session.user.id

			if (type === 'direct') {
				// Check if user already has a read receipt for this conversation
				const existingReceipt =
					await ctx.db.directChatMessageReadReceipt.findFirst({
						where: {
							user: { id: userId },
							message: { directChatId: conversationId }
						},
						orderBy: { readAt: 'desc' }
					})

				const latestMessage = await ctx.db.directChatMessage.findFirst({
					where: { directChatId: conversationId },
					orderBy: { createdAt: 'desc' }
				})

				if (!latestMessage) return null

				// Only create/update if it's a new message
				if (
					!existingReceipt ||
					existingReceipt.messageId !== latestMessage.directChatMessageId
				) {
					return await ctx.db.directChatMessageReadReceipt.upsert({
						where: {
							messageId_userId: {
								messageId: latestMessage.directChatMessageId,
								userId
							}
						},
						create: {
							userId,
							messageId: latestMessage.directChatMessageId,
							readAt: new Date()
						},
						update: {
							readAt: new Date()
						}
					})
				}

				return existingReceipt
			}

			// Check if user already has a read receipt for this conversation
			const existingReceipt =
				await ctx.db.groupChatMessageReadReceipt.findFirst({
					where: {
						user: { id: userId },
						message: { groupChatId: conversationId }
					},
					orderBy: { readAt: 'desc' }
				})

			const latestMessage = await ctx.db.groupChatMessage.findFirst({
				where: { groupChatId: conversationId },
				orderBy: { createdAt: 'desc' }
			})

			if (!latestMessage) return null

			// Only create/update if it's a new message
			if (
				!existingReceipt ||
				existingReceipt.messageId !== latestMessage.groupChatMessageId
			) {
				return await ctx.db.groupChatMessageReadReceipt.upsert({
					where: {
						messageId_userId: {
							messageId: latestMessage.groupChatMessageId,
							userId
						}
					},
					create: {
						userId,
						messageId: latestMessage.groupChatMessageId,
						readAt: new Date()
					},
					update: {
						readAt: new Date()
					}
				})
			}

			return existingReceipt
		}),

	// ---------------------------------------------------------------------------
	// READ
	// ---------------------------------------------------------------------------
	//

	searchUsers: protectedProcedure
		.input(z.object({ query: z.string() }))
		.query(async ({ ctx, input }) => {
			if (!input.query) return []

			const users = await ctx.db.user.findMany({
				where: {
					OR: [
						{
							profile: {
								name: {
									contains: input.query,
									mode: 'insensitive'
								}
							}
						},
						{
							email: {
								contains: input.query,
								mode: 'insensitive'
							}
						}
					],
					AND: {
						id: {
							not: ctx.session.user.id // Exclude current user
						}
					}
				},
				select: {
					id: true,
					email: true,
					profile: {
						select: {
							name: true,
							imageUrl: true
						}
					}
				},
				take: 5
			})

			return users.map((user) => ({
				id: user.id,
				email: user.email,
				name: user.profile?.name ?? null,
				imageUrl: user.profile?.imageUrl ?? null
			}))
		})
})
