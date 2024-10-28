import { faker } from '@faker-js/faker'
import { ChapterType, PrismaClient, Status, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { catchError } from '@/core/lib/utils/catch-error'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'

const prisma = new PrismaClient()

// Configurable Constants
const NUM_RANGES = {
	CATEGORIES: [5, 20],
	INSTRUCTORS: [3, 5],
	STUDENTS: [10, 15],
	COURSES: [15, 30],
	CHAPTERS: [5, 10]
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

	const courses = await Promise.all(
		Array.from({ length: getRandomInRange(NUM_RANGES.COURSES) }, async () => {
			const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)]

			if (!randomInstructor) throw new Error('No instructor found')

			const randomCategories = categories
				.slice(0, faker.number.int({ min: 1, max: 2 }))
				.map((cat) => cat.id)

			return prisma.course.create({
				data: {
					id: faker.database.mongodbObjectId(),
					code: `${faker.string.alpha({ length: 2 }).toUpperCase()}-${faker.number.int({ min: 100, max: 999 })}`,
					title: faker.company.catchPhrase(),
					description: faker.lorem.sentence(),
					imageUrl: faker.image.url(),
					status: getRandomStatus(),
					token: generateCourseInviteToken(),
					instructor: { connect: { id: randomInstructor.id } },
					categories: { connect: randomCategories.map((catId) => ({ id: catId })) }
				}
			})
		})
	)
	return courses
}

async function createChapters(courses: Awaited<ReturnType<typeof createCourses>>) {
	const chapters = await Promise.all(
		courses.flatMap((course) =>
			Array.from({ length: getRandomInRange(NUM_RANGES.CHAPTERS) }, (_, position) =>
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
	)
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
	let totalEnrollments = 0
	const enrollments = []

	for (const student of students) {
		const numEnrollments = faker.number.int({ min: 1, max: 3 })
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
	console.log('\n🌱 Starting database seed...')

	console.log('\nCreating categories...')
	const [categories, categoriesError] = await catchError(createCategories())
	if (categoriesError) throw categoriesError
	console.log(`✅ Created/Updated ${categories.length} categories`)

	console.log('\nCreating users...')
	const [users, usersError] = await catchError(createUsers())
	if (usersError) throw usersError
	console.log(`✅ Created ${users.instructors.length} instructors`)
	console.log(`✅ Created ${users.students.length} students`)

	console.log('\nCreating courses...')
	const [courses, coursesError] = await catchError(createCourses(users.instructors))
	if (coursesError) throw coursesError
	console.log(`✅ Created ${courses.length} courses`)

	console.log('\nCreating chapters...')
	const [chapters, chaptersError] = await catchError(createChapters(courses))
	if (chaptersError) throw chaptersError
	console.log(`✅ Created ${chapters.length} chapters`)

	console.log('\nCreating enrollments...')
	const [enrollmentResult, enrollmentsError] = await catchError(
		createEnrollments(users.students, courses)
	)
	if (enrollmentsError) throw enrollmentsError
	console.log(`✅ Created ${enrollmentResult.totalEnrollments} enrollments`)

	console.log('\n✨ Database has been seeded successfully!')
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
