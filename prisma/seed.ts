import { createChapters } from './seed/chapters/chapters'
import { createChatConversations, createChatRooms } from './seed/chats/chats'
import { db } from './seed/config'
import { createTags } from './seed/course-tags/tags'
import { createCourses } from './seed/courses/courses'
import { createEnrollments } from './seed/enrollments/enrollments'
import { createUsers } from './seed/users/users'

async function main() {
	console.log('\n=== 🌱 Starting Database Seed ===\n')

	try {
		// Clean existing data
		console.log('Cleaning existing data...')
		await db.$transaction([
			db.groupChatMessage.deleteMany(),
			db.groupChatMember.deleteMany(),
			db.groupChat.deleteMany(),
			db.directChatMessage.deleteMany(),
			db.directChat.deleteMany(),
			db.courseEnrollment.deleteMany(),
			db.chapter.deleteMany(),
			db.course.deleteMany(),
			db.courseTag.deleteMany(),
			db.profile.deleteMany(),
			db.user.deleteMany()
		])

		// Create entities and collect stats
		console.log('Creating users...')
		const userStats = await createUsers()

		console.log('Creating course tags...')
		const tagStats = await createTags(userStats.instructors.items)

		console.log('Creating courses...')
		const courseStats = await createCourses(userStats.instructors.items)

		console.log('Creating chapters...')
		const chapterStats = await createChapters(courseStats.items)

		console.log('Creating enrollments...')
		const enrollmentStats = await createEnrollments(
			userStats.students.items,
			courseStats.items
		)

		console.log('Creating chat rooms...')
		const chatRoomStats = await createChatRooms(
			courseStats.items,
			userStats.instructors.items
		)

		console.log('Creating chat conversations...')
		const chatConversationStats = await createChatConversations([
			...userStats.instructors.items,
			...userStats.students.items
		])

		// Output final statistics
		const stats = {
			users: {
				instructors: userStats.instructors.total,
				students: userStats.students.total
			},
			courses: {
				total: courseStats.total,
				averagePerInstructor: courseStats.averagePerInstructor
			},
			courseTags: {
				total: tagStats.total,
				averagePerCourse: tagStats.averagePerInstructor
			},
			chapters: {
				lessons: chapterStats.lessons,
				assessments: chapterStats.assessments,
				assignments: chapterStats.assignments,
				total: chapterStats.total,
				averagePerCourse: chapterStats.averagePerCourse
			},
			enrollments: {
				total: enrollmentStats.total,
				averagePerStudent: enrollmentStats.averagePerStudent
			},
			chats: {
				rooms: {
					total: chatRoomStats.total,
					messages: chatRoomStats.messages,
					averageMessagesPerRoom: chatRoomStats.averageMessagesPerRoom
				},
				conversations: {
					total: chatConversationStats.total,
					messages: chatConversationStats.messages,
					averageMessagesPerConversation:
						chatConversationStats.averageMessagesPerConversation
				}
			}
		}

		console.log('\n=== 🌱 Database Seed Complete ===')
		console.log('\nStatistics:', stats)
		console.log('\n')
	} catch (error) {
		console.error('Seed failed:', error)
		process.exit(1)
	}
}

main()
	.catch((error) => {
		console.error('Fatal error:', error)
		process.exit(1)
	})
	.finally(() => {
		void (async () => {
			await db.$disconnect()
		})()
	})
