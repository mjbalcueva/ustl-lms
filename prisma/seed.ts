import { faker } from '@faker-js/faker'
import { ChapterType, PrismaClient, Status, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { catchError } from '@/core/lib/utils/catch-error'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'

const prisma = new PrismaClient()

// Configurable Constants
const NUM_RANGES = {
	CATEGORIES: [5, 20],
	INSTRUCTORS: [3, 10],
	STUDENTS: [10, 30],
	COURSES_PER_INSTRUCTOR: [0, 5],
	CHAPTERS_PER_COURSE: [0, 10],
	CATEGORIES_PER_COURSE: [0, 3],
	ENROLLMENTS_PER_STUDENT: [0, 5]
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

async function createCategories() {
	const uniqueNames = new Set<string>()
	const categories = Array.from({ length: getRandomInRange(NUM_RANGES.CATEGORIES) }, () => {
		let name: string
		do {
			name = faker.commerce.department()
		} while (uniqueNames.has(name))
		uniqueNames.add(name)
		return { name }
	})

	const result = await Promise.all(
		categories.map(({ name }) =>
			prisma.category.upsert({
				where: { name },
				update: {},
				create: {
					id: faker.database.mongodbObjectId(),
					name
				}
			})
		)
	)
	return result
}

async function createUser(role: 'INSTRUCTOR' | 'STUDENT') {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()
	const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${EMAIL_DOMAIN}`
	const hashedPassword = await hash(DEFAULT_PASSWORD, 10)

	const [user, error] = await catchError(
		prisma.user.create({
			data: {
				id: faker.database.mongodbObjectId(),
				email,
				password: hashedPassword,
				role,
				emailVerified: new Date(),
				profile: {
					create: {
						name: `${firstName} ${lastName}`,
						image: faker.image.url(),
						bio: faker.lorem.sentence()
					}
				}
			}
		})
	)

	if (error) {
		console.error(`Failed to create ${role}:`, error)
		throw error
	}

	return user
}

async function createUsers() {
	const instructors = await Promise.all(
		Array.from({ length: getRandomInRange(NUM_RANGES.INSTRUCTORS) }, () => createUser('INSTRUCTOR'))
	)

	const students = await Promise.all(
		Array.from({ length: getRandomInRange(NUM_RANGES.STUDENTS) }, () => createUser('STUDENT'))
	)
	return { instructors, students }
}

async function createCourses(instructors: User[]) {
	const categories = await prisma.category.findMany()
	const courses = []

	for (const instructor of instructors) {
		const numCourses = getRandomInRange(NUM_RANGES.COURSES_PER_INSTRUCTOR)

		for (let i = 0; i < numCourses; i++) {
			const numCategories = getRandomInRange(NUM_RANGES.CATEGORIES_PER_COURSE)
			const randomCategories = faker.helpers
				.arrayElements(categories, numCategories)
				.map((cat) => cat.id)

			const course = await prisma.course.create({
				data: {
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
					categories: randomCategories.length
						? { connect: randomCategories.map((catId) => ({ id: catId })) }
						: undefined
				}
			})
			courses.push(course)
		}
	}
	return courses
}

async function createChapters(courses: Awaited<ReturnType<typeof createCourses>>) {
	const chapters = []

	for (const course of courses) {
		const numChapters = getRandomInRange(NUM_RANGES.CHAPTERS_PER_COURSE)
		const courseChapters = await Promise.all(
			Array.from({ length: numChapters }, (_, position) =>
				prisma.chapter.create({
					data: {
						id: faker.database.mongodbObjectId(),
						title: faker.commerce.productName(),
						content: faker.lorem.paragraph(),
						position,
						type: getRandomChapterType(),
						course: { connect: { id: course.id } }
					}
				})
			)
		)

		chapters.push(...courseChapters)
	}
	return chapters
}

const createEnrollment = async (userId: string, courseId: string) => {
	// Check if enrollment exists
	const existingEnrollment = await prisma.enrollment.findUnique({
		where: {
			userId_courseId: {
				userId,
				courseId
			}
		}
	})

	if (existingEnrollment) {
		console.log('Enrollment already exists')
		return existingEnrollment
	}

	// Create new enrollment if it doesn't exist
	return prisma.enrollment.create({
		data: {
			userId,
			courseId
		}
	})
}

async function createEnrollments(
	students: User[],
	courses: Awaited<ReturnType<typeof createCourses>>
) {
	const enrollments = []
	let totalEnrollments = 0

	for (const student of students) {
		const numEnrollments = getRandomInRange(NUM_RANGES.ENROLLMENTS_PER_STUDENT)
		const randomCourses = faker.helpers.arrayElements(courses, numEnrollments)

		for (const course of randomCourses) {
			const enrollment = await createEnrollment(student.id, course.id)
			enrollments.push(enrollment)
			totalEnrollments++
		}
	}

	return { enrollments, totalEnrollments }
}

async function main() {
	console.log('\n=== 🌱 Database Seed Started ===\n')

	// Create categories
	console.log('Creating categories...')
	const [categories, categoriesError] = await catchError(createCategories())
	if (categoriesError) throw categoriesError

	// Create users
	console.log('Creating users...')
	const [users, usersError] = await catchError(createUsers())
	if (usersError) throw usersError

	// Create courses
	console.log('Creating courses...')
	const [courses, coursesError] = await catchError(createCourses(users.instructors))
	if (coursesError) throw coursesError

	// Create chapters
	console.log('Creating chapters...')
	const [chapters, chaptersError] = await catchError(createChapters(courses))
	if (chaptersError) throw chaptersError

	// Create enrollments
	console.log('Creating enrollments...')
	const [enrollmentResult, enrollmentsError] = await catchError(
		createEnrollments(users.students, courses)
	)
	if (enrollmentsError) throw enrollmentsError

	// Log creation summary
	console.log('\n=== 📊 Creation Summary ===\n')
	console.log('Categories:', { created: categories.length })
	console.log('Users:', {
		instructors: users.instructors.length,
		students: users.students.length,
		total: users.instructors.length + users.students.length
	})
	console.log('Courses:', { created: courses.length })
	console.log('Chapters:', { created: chapters.length })
	console.log('Enrollments:', { created: enrollmentResult.totalEnrollments })

	console.log('\n=== ✨ Database Seed Completed ===\n')
}

main()
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
	.finally(() => {
		void prisma.$disconnect()
		process.exit(0)
	})
