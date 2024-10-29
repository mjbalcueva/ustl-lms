import { faker } from '@faker-js/faker'
import { ChapterType, PrismaClient, Status, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { catchError } from '@/core/lib/utils/catch-error'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'

const prisma = new PrismaClient()

// Configurable Constants
const SEED_RANGES = {
	INSTRUCTORS: [3, 10],
	STUDENTS: [10, 30],
	CATEGORIES_PER_INSTRUCTOR: [1, 5],
	COURSES_PER_INSTRUCTOR: [0, 10],
	CHAPTERS_PER_COURSE: [0, 10],
	CATEGORIES_PER_COURSE: [0, 5],
	ENROLLMENTS_PER_STUDENT: [0, 15]
} as const

const EMAIL_DOMAIN = '@ust-legazpi.edu.ph'
const DEFAULT_PASSWORD = 'password'

// Add helper function for random range
function getRandomInRange([min, max]: readonly [number, number]): number {
	return faker.number.int({ min, max })
}

// Utility functions
function getRandomStatus(): Status {
	const statuses = Object.values(Status)
	return statuses[Math.floor(Math.random() * statuses.length)]!
}

function getRandomChapterType(): ChapterType {
	const types = Object.values(ChapterType)
	return types[Math.floor(Math.random() * types.length)]!
}

// Optimize user creation with batch operations
async function createUsers() {
	const createUserBatch = (role: 'INSTRUCTOR' | 'STUDENT', count: number) => {
		return Promise.all(
			Array.from({ length: count }, async () => {
				const firstName = faker.person.firstName()
				const lastName = faker.person.lastName()
				const hashedPassword = await hash(DEFAULT_PASSWORD, 10)

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
		)
	}

	const [instructorData, studentData] = await Promise.all([
		createUserBatch('INSTRUCTOR', getRandomInRange(SEED_RANGES.INSTRUCTORS)),
		createUserBatch('STUDENT', getRandomInRange(SEED_RANGES.STUDENTS))
	])

	const [instructors, students] = await Promise.all([
		prisma.$transaction(instructorData.map((data) => prisma.user.create({ data }))),
		prisma.$transaction(studentData.map((data) => prisma.user.create({ data })))
	])

	return { instructors, students }
}

// Optimize category creation with createMany
async function createCategories(instructors: User[]) {
	const categories = instructors.flatMap((instructor) => {
		const categoryCount = getRandomInRange(SEED_RANGES.CATEGORIES_PER_INSTRUCTOR)
		return Array.from({ length: categoryCount }, () => ({
			id: faker.database.mongodbObjectId(),
			name: faker.commerce.department(),
			instructorId: instructor.id
		}))
	})

	return prisma.category.createMany({
		data: categories,
		skipDuplicates: true
	})
}

// Optimize course creation with batch operations
async function createCourses(instructors: User[]) {
	const courseData = await Promise.all(
		instructors.map(async (instructor) => {
			const instructorCategories = await prisma.category.findMany({
				where: { instructorId: instructor.id }
			})

			const numCourses = getRandomInRange(SEED_RANGES.COURSES_PER_INSTRUCTOR)
			return Array.from({ length: numCourses }, () => {
				const randomCategories = faker.helpers
					.arrayElements(instructorCategories, getRandomInRange(SEED_RANGES.CATEGORIES_PER_COURSE))
					.map((cat) => ({ id: cat.id }))

				return {
					id: faker.database.mongodbObjectId(),
					code: `${faker.string.alpha({ length: 2 }).toUpperCase()}-${faker.number.int({
						min: 100,
						max: 999
					})}`,
					title: faker.company.catchPhrase(),
					description: faker.lorem.sentence(),
					imageUrl: faker.image.url(),
					status: getRandomStatus(),
					token: generateCourseInviteToken(),
					instructor: { connect: { id: instructor.id } },
					categories: randomCategories.length ? { connect: randomCategories } : undefined
				}
			})
		})
	).then((arrays) => arrays.flat())

	return prisma.$transaction(courseData.map((data) => prisma.course.create({ data })))
}

// Optimize chapter creation
async function createChapters(courses: Awaited<ReturnType<typeof createCourses>>) {
	const chapterData = courses.flatMap((course) => {
		const numChapters = getRandomInRange(SEED_RANGES.CHAPTERS_PER_COURSE)
		return Array.from({ length: numChapters }, (_, index) => ({
			id: faker.database.mongodbObjectId(),
			title: faker.commerce.productName(),
			content: faker.lorem.paragraph(),
			position: index + 1,
			type: getRandomChapterType(),
			status: getRandomStatus(),
			courseId: course.id
		}))
	})

	return prisma.chapter.createMany({ data: chapterData })
}

// Optimize enrollment creation
async function createEnrollments(
	students: User[],
	courses: Awaited<ReturnType<typeof createCourses>>
) {
	const enrollmentData = students.flatMap((student) => {
		const numEnrollments = getRandomInRange(SEED_RANGES.ENROLLMENTS_PER_STUDENT)
		const randomCourses = faker.helpers.arrayElements(courses, numEnrollments)
		return randomCourses.map((course) => ({
			userId: student.id,
			courseId: course.id
		}))
	})

	const result = await prisma.enrollment.createMany({
		data: enrollmentData,
		skipDuplicates: true
	})

	return { enrollments: enrollmentData, totalEnrollments: result.count }
}

// Optimize main function with better error handling and transactions
async function main() {
	console.log('\n=== 🌱 Database Seed Started ===\n')

	const [result, error] = await catchError(
		prisma.$transaction(async () => {
			console.log('Creating users...')
			const { instructors, students } = await createUsers()

			console.log('Creating categories...')
			const categories = await createCategories(instructors)

			console.log('Creating courses...')
			const courses = await createCourses(instructors)

			console.log('Creating chapters...')
			const chapters = await createChapters(courses)

			console.log('Creating enrollments...')
			const { totalEnrollments } = await createEnrollments(students, courses)

			const stats = {
				instructors: instructors.length,
				students: students.length,
				categories: categories.count,
				courses: courses.length,
				chapters: chapters.count,
				enrollments: totalEnrollments
			}

			// Calculate some additional insights
			const avgChaptersPerCourse = (chapters.count / courses.length).toFixed(1)
			const avgEnrollmentsPerStudent = (totalEnrollments / students.length).toFixed(1)

			return {
				...stats,
				insights: {
					averageChaptersPerCourse: Number(avgChaptersPerCourse),
					averageEnrollmentsPerStudent: Number(avgEnrollmentsPerStudent),
					totalContentItems: chapters.count + courses.length
				}
			}
		})
	)

	if (error) {
		console.error('Seed failed:', error)
		process.exit(1)
	}

	console.log('\n=== 🌱 Database Seed Complete ===')
	console.log('\nStatistics:', result)
	console.log('\n')
}

// Update the program execution
const [, mainError] = await catchError(main())

if (mainError) {
	console.error('Fatal error:', mainError)
	process.exit(1)
}

await prisma.$disconnect()
process.exit(0)
