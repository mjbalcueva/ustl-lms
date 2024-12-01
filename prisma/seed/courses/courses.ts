import { faker } from '@faker-js/faker'
import type { User } from '@prisma/client'

import { generateCourseInviteToken } from '@/features/courses/shared/lib/generate-course-invite-token'

import { db, SEED_RANGES } from '../config'
import type { CourseStats } from '../types'
import { getRandomInRange, getRandomStatus } from '../utils'

export async function createCourses(instructors: User[]): Promise<CourseStats> {
	const courses = []

	for (const instructor of instructors) {
		const instructorTags = await db.courseTag.findMany({
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

	const createdCourses = await db.$transaction(
		courses.map((data) =>
			db.course.create({
				data,
				include: { tags: true }
			})
		)
	)

	return {
		total: createdCourses.length,
		averagePerInstructor: Number(
			(createdCourses.length / instructors.length).toFixed(1)
		),
		averagePerCourse: Number(
			(createdCourses.length / createdCourses.length).toFixed(1)
		),
		items: createdCourses
	}
}
