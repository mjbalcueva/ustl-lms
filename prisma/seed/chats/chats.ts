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
		// Create forum chat room
		const forumRoom = await db.chatRoom.create({
			data: {
				name: `${course.title} Forum`,
				description: 'Course discussion forum',
				type: ChatRoomType.FORUM,
				courseId: course.courseId,
				creatorId: course.instructorId,
				isPinned: true
			}
		})
		chatRooms.push(forumRoom)

		// Create group chat room
		const groupRoom = await db.chatRoom.create({
			data: {
				name: course.title,
				description: 'Course group chat',
				type: ChatRoomType.TEXT,
				courseId: course.courseId,
				creatorId: course.instructorId,
				isPinned: true
			}
		})
		chatRooms.push(groupRoom)

		// Create chat member for the instructor in both rooms
		const forumMember = await db.chatMember.create({
			data: {
				chatRoomId: forumRoom.chatRoomId,
				userId: course.instructorId,
				role: 'OWNER'
			}
		})

		const groupMember = await db.chatMember.create({
			data: {
				chatRoomId: groupRoom.chatRoomId,
				userId: course.instructorId,
				role: 'OWNER'
			}
		})

		// Create some initial messages in forum
		const forumMessages = await db.chatMessage.createMany({
			data: Array(faker.number.int({ min: 3, max: 8 }))
				.fill(null)
				.map(() => ({
					content: faker.lorem.paragraph(),
					chatRoomId: forumRoom.chatRoomId,
					senderId: forumMember.chatMemberId
				}))
		})

		// Create some initial messages in group chat
		const groupMessages = await db.chatMessage.createMany({
			data: Array(faker.number.int({ min: 3, max: 8 }))
				.fill(null)
				.map(() => ({
					content: faker.lorem.paragraph(),
					chatRoomId: groupRoom.chatRoomId,
					senderId: groupMember.chatMemberId
				}))
		})

		totalMessages += forumMessages.count + groupMessages.count
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
	const existingPairs = new Set<string>()

	// Create some direct message conversations between users
	for (let i = 0; i < faker.number.int({ min: 10, max: 20 }); i++) {
		const participants = faker.helpers.arrayElements(users, 2)
		if (!participants[0] || !participants[1]) continue

		// Create a unique key for this pair (sort IDs to ensure consistency)
		const [smallerId, largerId] = [
			participants[0].id,
			participants[1].id
		].sort()
		const pairKey = `${smallerId}-${largerId}`

		// Skip if this pair already has a conversation
		if (existingPairs.has(pairKey)) continue
		existingPairs.add(pairKey)

		const conversation = await db.chatConversation.create({
			data: {
				memberOneId: smallerId!,
				memberTwoId: largerId!
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
