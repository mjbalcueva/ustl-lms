import { faker } from '@faker-js/faker'
import {
	GroupChatType,
	type Course,
	type GroupChat,
	type User
} from '@prisma/client'

import { db } from '../config'

export async function createChatRooms(courses: Course[], instructors: User[]) {
	const chatRooms: GroupChat[] = []
	let totalMessages = 0

	// Create course-wide chat rooms
	for (const course of courses) {
		// Create forum chat room
		const forumRoom = await db.groupChat.create({
			data: {
				name: `${course.title} Forum`,
				description: 'Course discussion forum',
				type: GroupChatType.FORUM,
				courseId: course.courseId,
				creatorId: course.instructorId,
				isPrivate: false
			}
		})
		chatRooms.push(forumRoom)

		// Create group chat room
		const groupRoom = await db.groupChat.create({
			data: {
				name: course.title,
				description: 'Course group chat',
				type: GroupChatType.TEXT,
				courseId: course.courseId,
				creatorId: course.instructorId,
				isPrivate: false
			}
		})
		chatRooms.push(groupRoom)

		// Create chat member for the instructor in both rooms
		const forumMember = await db.groupChatMember.create({
			data: {
				groupChatId: forumRoom.groupChatId,
				userId: course.instructorId,
				role: 'OWNER'
			}
		})

		const groupMember = await db.groupChatMember.create({
			data: {
				groupChatId: groupRoom.groupChatId,
				userId: course.instructorId,
				role: 'OWNER'
			}
		})

		// Get enrolled students for this course
		const enrollments = await db.courseEnrollment.findMany({
			where: { courseId: course.courseId },
			include: { student: true }
		})

		// Create chat members for enrolled students in group chat
		const studentMembers = await Promise.all(
			enrollments.map((enrollment) =>
				db.groupChatMember.create({
					data: {
						groupChatId: groupRoom.groupChatId,
						userId: enrollment.studentId,
						role: 'MEMBER'
					}
				})
			)
		)

		// Create some initial messages in forum
		const forumMessages = await db.groupChatMessage.createMany({
			data: Array(faker.number.int({ min: 3, max: 8 }))
				.fill(null)
				.map(() => ({
					content: faker.lorem.paragraph(),
					groupChatId: forumRoom.groupChatId,
					senderId: forumMember.groupChatMemberId
				}))
		})

		// Create messages from students and instructor in group chat
		const allMembers = [groupMember, ...studentMembers]
		const groupMessages = await db.groupChatMessage.createMany({
			data: Array(faker.number.int({ min: 10, max: 20 }))
				.fill(null)
				.map(() => {
					const sender = faker.helpers.arrayElement(allMembers)
					return {
						content: faker.lorem.paragraph(),
						groupChatId: groupRoom.groupChatId,
						senderId: sender.groupChatMemberId
					}
				})
		})

		// Create some message reads
		for (const message of await db.groupChatMessage.findMany({
			where: { groupChatId: groupRoom.groupChatId }
		})) {
			await db.groupChatMessageReadReceipt.createMany({
				data: allMembers
					.filter(() => faker.number.int({ min: 1, max: 10 }) > 3)
					.map((member) => ({
						messageId: message.groupChatMessageId,
						userId: member.userId,
						readAt: faker.date.between({
							from: message.createdAt,
							to: new Date()
						})
					}))
			})
		}

		totalMessages += forumMessages.count + groupMessages.count
	}

	// Create some private chat rooms
	const privateRooms = await Promise.all(
		Array(faker.number.int({ min: 5, max: 10 }))
			.fill(null)
			.map(async () => {
				const instructor = faker.helpers.arrayElement(instructors)
				const chatRoom = await db.groupChat.create({
					data: {
						name: faker.company.catchPhrase(),
						description: faker.lorem.sentence(),
						type: faker.helpers.arrayElement([
							GroupChatType.TEXT,
							GroupChatType.AUDIO,
							GroupChatType.VIDEO
						]),
						isPrivate: true,
						creatorId: instructor.id
					}
				})

				// Create chat member for the creator
				const chatMember = await db.groupChatMember.create({
					data: {
						groupChatId: chatRoom.groupChatId,
						userId: instructor.id,
						role: 'OWNER'
					}
				})

				// Create some initial messages
				const messages = await db.groupChatMessage.createMany({
					data: Array(faker.number.int({ min: 3, max: 8 }))
						.fill(null)
						.map(() => ({
							content: faker.lorem.paragraph(),
							groupChatId: chatRoom.groupChatId,
							senderId: chatMember.groupChatMemberId
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

		const conversation = await db.directChat.create({
			data: {
				memberOneId: smallerId!,
				memberTwoId: largerId!
			}
		})

		conversations.push(conversation)

		// Create messages in the conversation
		const messages = await Promise.all(
			Array(faker.number.int({ min: 5, max: 15 }))
				.fill(null)
				.map(async () => {
					const sender = faker.helpers.arrayElement([
						participants[0]!,
						participants[1]!
					])
					return db.directChatMessage.create({
						data: {
							content: faker.lorem.paragraph(),
							directChatId: conversation.directChatId,
							senderId: sender.id
						}
					})
				})
		)

		// Create read receipts for messages
		for (const message of messages) {
			// The recipient has a chance to read the message
			const recipient = participants.find((p) => p.id !== message.senderId)!
			if (faker.number.int({ min: 1, max: 10 }) > 3) {
				// 70% chance of reading
				await db.directChatMessageReadReceipt.create({
					data: {
						messageId: message.directChatMessageId,
						userId: recipient.id,
						readAt: faker.date.between({
							from: message.createdAt,
							to: new Date()
						})
					}
				})
			}
		}

		totalMessages += messages.length
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
