import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient({
	log: ['warn', 'error'],
	transactionOptions: {
		maxWait: 5000,
		timeout: 30000
	}
})

export const SEED_RANGES = {
	INSTRUCTORS: [2, 5],
	STUDENTS: [5, 15],
	COURSES_PER_INSTRUCTOR: [1, 5],
	COURSE_TAGS_PER_INSTRUCTOR: [1, 5],
	COURSE_TAGS_PER_COURSE: [0, 3],
	COURSE_ENROLLMENTS_PER_STUDENT: [0, 5],
	LESSONS_PER_COURSE: [2, 6],
	ASSESSMENTS_PER_COURSE: [0, 4],
	ASSIGNMENTS_PER_COURSE: [0, 3]
} as const

export const EMAIL_DOMAIN = '@ust-legazpi.edu.ph'
export const DEFAULT_PASSWORD = 'password'
