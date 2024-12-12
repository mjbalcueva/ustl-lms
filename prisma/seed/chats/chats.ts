import { faker } from '@faker-js/faker'
import {
	ChatRoomType,
	type ChatRoom,
	type Course,
	type User
} from '@prisma/client'

import { db } from '../config'

export async function createChatRooms(courses: Course[], instructors: User[]) {
	const chatRooms: ChatRoom[] = []
	let totalMessages = 0

	// Create course-wide chat rooms
	for (const course of courses) {
		const chatRoom = await db.chatRoom.create({
			data: {
				name: `${course.title} General Discussion`,
				description: 'General discussion for the course',
				type: ChatRoomType.FORUM,
				courseId: course.courseId,
				creatorId: course.instructorId,
				isPinned: true
			}
		})
		chatRooms.push(chatRoom)

		// Create chat member for the instructor
		const chatMember = await db.chatMember.create({
			data: {
				chatRoomId: chatRoom.chatRoomId,
				userId: course.instructorId,
				role: 'OWNER'
			}
		})

		// Create some initial messages
		const messages = await db.chatMessage.createMany({
			data: Array(faker.number.int({ min: 3, max: 8 }))
				.fill(null)
				.map(() => ({
					content: faker.lorem.paragraph(),
					chatRoomId: chatRoom.chatRoomId,
					senderId: chatMember.chatMemberId
				}))
		})

		totalMessages += messages.count
	}

	// Create some private chat rooms
	const privateRooms = await Promise.all(
		Array(faker.number.int({ min: 5, max: 10 }))
			.fill(null)
			.map(async () => {
				const instructor = faker.helpers.arrayElement(instructors)
				const chatRoom = await db.chatRoom.create({
					data: {
						name: faker.company.catchPhrase(),
						description: faker.lorem.sentence(),
						type: faker.helpers.arrayElement([
							ChatRoomType.TEXT,
							ChatRoomType.AUDIO,
							ChatRoomType.VIDEO
						]),
						isPrivate: true,
						creatorId: instructor.id
					}
				})

				// Create chat member for the creator
				const chatMember = await db.chatMember.create({
					data: {
						chatRoomId: chatRoom.chatRoomId,
						userId: instructor.id,
						role: 'OWNER'
					}
				})

				// Create some initial messages
				const messages = await db.chatMessage.createMany({
					data: Array(faker.number.int({ min: 3, max: 8 }))
						.fill(null)
						.map(() => ({
							content: faker.lorem.paragraph(),
							chatRoomId: chatRoom.chatRoomId,
							senderId: chatMember.chatMemberId
						}))
				})

				totalMessages += messages.count
				return chatRoom
			})
	)

	chatRooms.push(...privateRooms)

	return {
		items: chatRooms,
		total: chatRooms.length,
		messages: totalMessages,
		averageMessagesPerRoom: Math.round(totalMessages / chatRooms.length)
	}
}

export async function createChatConversations(users: User[]) {
	const conversations = []
	let totalMessages = 0

	// Create some direct message conversations between users
	for (let i = 0; i < faker.number.int({ min: 10, max: 20 }); i++) {
		const participants = faker.helpers.arrayElements(users, 2)
		if (!participants[0] || !participants[1]) continue

		const conversation = await db.chatConversation.create({
			data: {
				memberOneId: participants[0].id,
				memberTwoId: participants[1].id
			}
		})

		conversations.push(conversation)

		// Create some messages in the conversation
		const messages = await db.chatDirectMessage.createMany({
			data: Array(faker.number.int({ min: 5, max: 15 }))
				.fill(null)
				.map(() => ({
					content: faker.lorem.paragraph(),
					chatConversationId: conversation.chatConversationId,
					senderId: faker.helpers.arrayElement([
						participants[0]!.id,
						participants[1]!.id
					])
				}))
		})

		totalMessages += messages.count
	}

	return {
		items: conversations,
		total: conversations.length,
		messages: totalMessages,
		averageMessagesPerConversation: Math.round(
			totalMessages / conversations.length
		)
	}
}
