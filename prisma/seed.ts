import { faker } from '@faker-js/faker'
import { ChapterType, PrismaClient, Status, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { generateCourseInviteToken } from '@/features/courses/shared/lib/generate-course-invite-token'

// Initialize PrismaClient with optimized settings
const prisma = new PrismaClient({
	log: ['warn', 'error'],
	transactionOptions: {
		maxWait: 5000, // 5s max wait
		timeout: 30000 // 30s timeout
	}
})

// Configurable Constants - Reduced ranges for faster seeding
const SEED_RANGES = {
	INSTRUCTORS: [2, 5],
	STUDENTS: [5, 15],
	COURSES_PER_INSTRUCTOR: [1, 5],
	COURSE_TAGS_PER_INSTRUCTOR: [1, 5],
	COURSE_TAGS_PER_COURSE: [1, 3],
	COURSE_ENROLLMENTS_PER_STUDENT: [1, 5],
	CHAPTERS_PER_COURSE: [1, 5]
} as const

const EMAIL_DOMAIN = '@ust-legazpi.edu.ph'
const DEFAULT_PASSWORD = 'password'

// Predefined tags for better consistency and performance
const PREDEFINED_TAGS = [
	'Computer Science',
	'Mathematics',
	'Engineering',
	'Physics',
	'Chemistry',
	'Biology',
	'Literature',
	'History',
	'Art',
	'Music'
]

function getRandomInRange([min, max]: readonly [number, number]): number {
	return faker.number.int({ min, max })
}

function getRandomStatus(): Status {
	return faker.helpers.arrayElement(Object.values(Status))
}

function getRandomChapterType(): ChapterType {
	return faker.helpers.arrayElement(Object.values(ChapterType))
}

async function createUsers() {
	const hashedPassword = await hash(DEFAULT_PASSWORD, 10)

	async function createUserBatch(
		role: 'INSTRUCTOR' | 'STUDENT',
		count: number
	) {
		const userData = Array.from({ length: count }, () => {
			const firstName = faker.person.firstName()
			const lastName = faker.person.lastName()
			return {
				id: faker.database.mongodbObjectId(),
				email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${EMAIL_DOMAIN}`,
				password: hashedPassword,
				role,
				emailVerified: new Date(),
				profile: {
					create: {
						name: `${firstName} ${lastName}`,
						imageUrl: faker.image.url(),
						bio: faker.lorem.sentence()
					}
				}
			}
		})

		return prisma.$transaction(
			userData.map((data) => prisma.user.create({ data }))
		)
	}

	const instructors = await createUserBatch(
		'INSTRUCTOR',
		getRandomInRange(SEED_RANGES.INSTRUCTORS)
	)
	const students = await createUserBatch(
		'STUDENT',
		getRandomInRange(SEED_RANGES.STUDENTS)
	)

	return { instructors, students }
}

async function createTags(instructors: User[]) {
	// Create a pool of unique tags for each instructor
	const tagData = instructors.flatMap((instructor) => {
		const tagCount = getRandomInRange(SEED_RANGES.COURSE_TAGS_PER_INSTRUCTOR)
		return faker.helpers
			.arrayElements(PREDEFINED_TAGS, tagCount)
			.map((tagName) => ({
				tagId: faker.database.mongodbObjectId(),
				name: tagName,
				instructorId: instructor.id
			}))
	})

	// Use createMany with skipDuplicates for better performance
	return prisma.courseTag.createMany({
		data: tagData,
		skipDuplicates: true
	})
}

async function createCourses(instructors: User[]) {
	const courses = []

	for (const instructor of instructors) {
		const instructorTags = await prisma.courseTag.findMany({
			where: { instructorId: instructor.id }
		})

		const numCourses = getRandomInRange(SEED_RANGES.COURSES_PER_INSTRUCTOR)
		const courseBatch = Array.from({ length: numCourses }, () => ({
			courseId: faker.database.mongodbObjectId(),
			code: `${faker.string.alpha({ length: 2 }).toUpperCase()}-${faker.number.int(
				{
					min: 100,
					max: 999
				}
			)}`,
			title: faker.company.catchPhrase(),
			description: faker.lorem.sentence(),
			imageUrl: faker.image.url(),
			status: getRandomStatus(),
			token: generateCourseInviteToken(),
			instructorId: instructor.id,
			tags: {
				connect: faker.helpers
					.arrayElements(
						instructorTags,
						getRandomInRange(SEED_RANGES.COURSE_TAGS_PER_COURSE)
					)
					.map((tag) => ({ tagId: tag.tagId }))
			}
		}))

		courses.push(...courseBatch)
	}

	return prisma.$transaction(
		courses.map((data) =>
			prisma.course.create({
				data,
				include: { tags: true }
			})
		)
	)
}

async function createChapters(
	courses: Awaited<ReturnType<typeof createCourses>>
) {
	const chapterData = courses.flatMap((course) => {
		const numChapters = getRandomInRange(SEED_RANGES.CHAPTERS_PER_COURSE)
		return Array.from({ length: numChapters }, (_, index) => ({
			chapterId: faker.database.mongodbObjectId(),
			title: faker.commerce.productName(),
			content: faker.lorem.paragraph(),
			position: index + 1,
			type: getRandomChapterType(),
			status: getRandomStatus(),
			courseId: course.courseId
		}))
	})

	return prisma.chapter.createMany({ data: chapterData })
}

async function createEnrollments(
	students: User[],
	courses: Awaited<ReturnType<typeof createCourses>>
) {
	const enrollmentData = students.flatMap((student) => {
		const numEnrollments = getRandomInRange(
			SEED_RANGES.COURSE_ENROLLMENTS_PER_STUDENT
		)
		return faker.helpers
			.arrayElements(courses, numEnrollments)
			.map((course) => ({
				enrollmentId: faker.database.mongodbObjectId(),
				studentId: student.id,
				courseId: course.courseId
			}))
	})

	return prisma.courseEnrollment.createMany({
		data: enrollmentData,
		skipDuplicates: true
	})
}

async function main() {
	console.log('\n=== 🌱 Starting Database Seed ===\n')

	try {
		// Clear existing data
		console.log('Cleaning existing data...')
		await prisma.$transaction([
			prisma.courseEnrollment.deleteMany(),
			prisma.chapter.deleteMany(),
			prisma.course.deleteMany(),
			prisma.courseTag.deleteMany(),
			prisma.profile.deleteMany(),
			prisma.user.deleteMany()
		])

		console.log('Creating users...')
		const { instructors, students } = await createUsers()

		console.log('Creating course tags...')
		const tags = await createTags(instructors)

		console.log('Creating courses...')
		const courses = await createCourses(instructors)

		console.log('Creating chapters...')
		const chapters = await createChapters(courses)

		console.log('Creating enrollments...')
		const enrollments = await createEnrollments(students, courses)

		const stats = {
			instructors: instructors.length,
			students: students.length,
			tags: tags.count,
			courses: courses.length,
			chapters: chapters.count,
			enrollments: enrollments.count,
			insights: {
				averageChaptersPerCourse: Number(
					(chapters.count / courses.length).toFixed(1)
				),
				averageEnrollmentsPerStudent: Number(
					(enrollments.count / students.length).toFixed(1)
				),
				totalContentItems: chapters.count + courses.length
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
			await prisma.$disconnect()
		})()
	})
