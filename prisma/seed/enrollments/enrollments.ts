import { faker } from '@faker-js/faker'

import { db, SEED_RANGES } from '../config'
import type { CourseStats, EnrollmentStats, UserStats } from '../types'
import { getRandomInRange } from '../utils'

export async function createEnrollments(
	students: UserStats['students']['items'],
	courses: CourseStats['items']
): Promise<EnrollmentStats> {
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

	await db.courseEnrollment.createMany({
		data: enrollmentData,
		skipDuplicates: true
	})

	return {
		total: enrollmentData.length,
		averagePerStudent: Number(
			(enrollmentData.length / students.length).toFixed(1)
		),
		items: enrollmentData
	}
}
