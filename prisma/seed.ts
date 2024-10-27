import { ChapterType, PrismaClient, Role, Status } from '@prisma/client'

import { generateCourseInviteToken } from '@/features/courses/lib/tokens'

const db = new PrismaClient()

async function main() {
	try {
		const categoriesToInsert = [
			{ name: 'History' },
			{ name: 'Technology' },
			{ name: 'Science' },
			{ name: 'Literature' },
			{ name: 'Mathematics' },
			{ name: 'Zombies' },
			{ name: 'AI and Machine Learning' }
		]

		for (const category of categoriesToInsert) {
			const existingCategory = await db.category.findUnique({
				where: { name: category.name }
			})

			if (!existingCategory) {
				await db.category.create({
					data: category
				})
			}
		}
		console.log('Categories seeded successfully', categoriesToInsert)

		const instructorsToInsert = [
			{
				email: 'rafael.reyes@ust-legazpi.edu.ph',
				password: '$2a$10$HI6XsWZoQrtKysyXCxKN9e4l.P4vOAB7p0cS449Igs0rr3K4RMo6u',
				role: Role.INSTRUCTOR,
				emailVerified: new Date(),
				profile: {
					create: {
						name: 'Rafael Reyes',
						image:
							'https://vignette.wikia.nocookie.net/breakingbad/images/8/8c/Gustavo_Fring.jpg/revision/latest?cb=20180218183206&path-prefix=de',
						bio: 'History and Zombie enthusiast.'
					}
				},
				courses: {
					create: [
						{
							code: 'ZEN-101',
							title: 'World War Z',
							description: 'A comprehensive exploration of zombie culture and history.',
							status: Status.PUBLISHED,
							token: generateCourseInviteToken(),
							categories: {
								connect: [{ name: 'Zombies' }, { name: 'History' }]
							},
							chapters: {
								create: [
									{
										title: 'Introduction to Zombie Culture',
										type: ChapterType.LESSON,
										content: 'Zombies through the ages.',
										position: 1,
										status: Status.PUBLISHED
									},
									{
										title: 'Quiz 1: Zombie Survival Skills',
										type: ChapterType.ASSESSMENT,
										position: 2,
										status: Status.PUBLISHED
									},
									{
										title: 'Zombie Apocalypse Task',
										type: ChapterType.ASSIGNMENT,
										position: 3,
										status: Status.PUBLISHED
									}
								]
							}
						},
						{
							code: 'HIS-102',
							title: 'Medieval History',
							description: 'An in-depth look at the Middle Ages and its historical significance.',
							status: Status.PUBLISHED,
							token: generateCourseInviteToken(),
							categories: {
								connect: [{ name: 'History' }]
							},
							chapters: {
								create: [
									{
										title: 'The Feudal System',
										type: ChapterType.LESSON,
										content: 'Learn about the feudal system that shaped medieval society.',
										position: 1,
										status: Status.PUBLISHED
									},
									{
										title: 'Quiz 1: Feudal Lords',
										type: ChapterType.ASSESSMENT,
										position: 2,
										status: Status.PUBLISHED
									},
									{
										title: 'Essay: Medieval Castles',
										type: ChapterType.ASSIGNMENT,
										position: 3,
										status: Status.PUBLISHED
									}
								]
							}
						}
					]
				}
			},
			{
				email: 'maryanne.dela.cruz@ust-legazpi.edu.ph',
				password: '$2a$10$HI6XsWZoQrtKysyXCxKN9e4l.P4vOAB7p0cS449Igs0rr3K4RMo6u',
				role: Role.INSTRUCTOR,
				emailVerified: new Date(), // Email verified
				profile: {
					create: {
						name: 'Mary Anne Dela Cruz',
						image: 'https://example.com/profile/maryanne.jpg',
						bio: 'AI and technology specialist.'
					}
				},
				courses: {
					create: [
						{
							code: 'AI-202',
							title: 'Introduction to AI and Machine Learning',
							description: 'Learn the basics of artificial intelligence and its applications.',
							status: Status.PUBLISHED,
							token: generateCourseInviteToken(),
							categories: {
								connect: [{ name: 'AI and Machine Learning' }, { name: 'Technology' }]
							},
							chapters: {
								create: [
									{
										title: 'The Evolution of AI',
										type: ChapterType.LESSON,
										content: 'From early algorithms to modern neural networks.',
										position: 1,
										status: Status.PUBLISHED
									},
									{
										title: 'Project: Build a Simple Neural Network',
										type: ChapterType.ASSIGNMENT,
										position: 2,
										status: Status.PUBLISHED
									},
									{
										title: 'Quiz 1: Basics of Machine Learning',
										type: ChapterType.ASSESSMENT,
										position: 3,
										status: Status.PUBLISHED
									}
								]
							}
						},
						{
							code: 'TEC-101',
							title: 'The Future of Technology',
							description: 'Explore the future trends in technology and its impact on society.',
							status: Status.PUBLISHED,
							token: generateCourseInviteToken(),
							categories: {
								connect: [{ name: 'Technology' }]
							},
							chapters: {
								create: [
									{
										title: 'Emerging Technologies',
										type: ChapterType.LESSON,
										content: 'Discover the latest breakthroughs in technology.',
										position: 1,
										status: Status.PUBLISHED
									},
									{
										title: 'Project: Predicting Future Tech',
										type: ChapterType.ASSIGNMENT,
										position: 2,
										status: Status.PUBLISHED
									},
									{
										title: 'Quiz 1: Technology Trends',
										type: ChapterType.ASSESSMENT,
										position: 3,
										status: Status.PUBLISHED
									}
								]
							}
						}
					]
				}
			}
		]

		for (const instructor of instructorsToInsert) {
			const existingInstructor = await db.user.findUnique({
				where: { email: instructor.email }
			})

			if (!existingInstructor) {
				await db.user.create({
					data: instructor
				})
			}
		}
		console.log('Instructors seeded successfully', instructorsToInsert)

		const studentsToInsert = [
			{
				email: 'juan.delacruz@ust-legazpi.edu.ph',
				password: '$2a$10$HI6XsWZoQrtKysyXCxKN9e4l.P4vOAB7p0cS449Igs0rr3K4RMo6u',
				role: Role.STUDENT,
				emailVerified: new Date(), // Email verified
				profile: {
					create: {
						name: 'Juan Dela Cruz',
						image: 'https://example.com/profile/juan.jpg',
						bio: 'A passionate student eager to learn about everything.'
					}
				}
			},
			{
				email: 'maria.clara@ust-legazpi.edu.ph',
				password: '$2a$10$HI6XsWZoQrtKysyXCxKN9e4l.P4vOAB7p0cS449Igs0rr3K4RMo6u',
				role: Role.STUDENT,
				emailVerified: new Date(), // Email verified
				profile: {
					create: {
						name: 'Maria Clara Santos',
						image: 'https://example.com/profile/maria.jpg',
						bio: 'Loves literature and exploring new ideas.'
					}
				}
			}
		]

		for (const student of studentsToInsert) {
			const existingStudent = await db.user.findUnique({
				where: { email: student.email }
			})

			if (!existingStudent) {
				await db.user.create({
					data: student
				})
			}
		}
		console.log('Students seeded successfully', studentsToInsert)
	} catch (error) {
		console.error('Error seeding data', error)
	} finally {
		await db.$disconnect()
	}
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})
