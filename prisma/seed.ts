import { faker } from '@faker-js/faker'
import { PrismaClient, type User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { catchError } from '@/core/lib/utils/catch-error'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'

const prisma = new PrismaClient()

// Configurable Constants
const NUM_INSTRUCTORS = 5
const NUM_STUDENTS = 15
const NUM_COURSES = 30
const NUM_CHAPTERS = 10
const EMAIL_DOMAIN = '@ust-legazpi.edu.ph'
const DEFAULT_PASSWORD = 'password'
const COURSE_STATUSES = ['PUBLISHED', 'DRAFT', 'ARCHIVED'] as const
const NUM_CATEGORIES = 20

// Utility functions
function getRandomStatus() {
	return COURSE_STATUSES[Math.floor(Math.random() * COURSE_STATUSES.length)]
}

async function createCategories() {
	console.log('\nCreating categories...')

	const uniqueNames = new Set<string>()
	const categories = Array.from({ length: NUM_CATEGORIES }, () => {
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
	console.log(`✅ Created/Updated ${result.length} categories`)
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

	console.log(`Created user: ${email}`)
	return user
}

async function createUsers() {
	console.log('\nCreating users...')
	const instructors = await Promise.all(
		Array.from({ length: NUM_INSTRUCTORS }, () => createUser('INSTRUCTOR'))
	)
	console.log(`✅ Created ${instructors.length} instructors`)

	const students = await Promise.all(
		Array.from({ length: NUM_STUDENTS }, () => createUser('STUDENT'))
	)
	console.log(`✅ Created ${students.length} students`)
	return { instructors, students }
}

async function createCourses(instructors: User[]) {
	console.log('\nCreating courses...')
	const categories = await prisma.category.findMany()

	const courses = await Promise.all(
		Array.from({ length: NUM_COURSES }, async () => {
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
	console.log(`✅ Created ${courses.length} courses`)
	return courses
}

async function createChapters(courses: Awaited<ReturnType<typeof createCourses>>) {
	console.log('\nCreating chapters...')
	const chapters = await Promise.all(
		courses.flatMap((course) =>
			Array.from({ length: NUM_CHAPTERS }, (_, position) =>
				prisma.chapter.create({
					data: {
						id: faker.database.mongodbObjectId(),
						title: faker.commerce.productName(),
						content: faker.lorem.paragraph(),
						videoUrl: faker.internet.url(),
						position,
						type: 'LESSON',
						course: { connect: { id: course.id } }
					}
				})
			)
		)
	)
	console.log(`✅ Created ${chapters.length} chapters`)
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

async function main() {
	console.log('\n🌱 Starting database seed...')

	const [, categoriesError] = await catchError(createCategories())
	if (categoriesError) throw categoriesError
	console.log('Categories created successfully')

	const [users, usersError] = await catchError(createUsers())
	if (usersError) throw usersError
	console.log('Users created successfully:', {
		instructorCount: users.instructors.length,
		studentCount: users.students.length
	})

	const [courses, coursesError] = await catchError(createCourses(users.instructors))
	if (coursesError) throw coursesError
	console.log('Courses created successfully')

	const [, chaptersError] = await catchError(createChapters(courses))
	if (chaptersError) throw chaptersError
	console.log('Chapters created successfully')

	console.log('\nCreating enrollments...')
	let totalEnrollments = 0

	for (const student of users.students) {
		const numEnrollments = faker.number.int({ min: 1, max: 3 })
		const randomCourses = faker.helpers.arrayElements(courses, numEnrollments)

		for (const course of randomCourses) {
			await createEnrollment(student.id, course.id)
			totalEnrollments++
		}
	}
	console.log(`✅ Created ${totalEnrollments} enrollments`)

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
